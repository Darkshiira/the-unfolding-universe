"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Pause,
  Play,
  RotateCcw,
  Wind,
  X,
  Zap,
  Flame,
} from "lucide-react";

type Stage = 0 | 1 | 2 | 3;
const stages = [
  {
    short: "Bränsle",
    title: "1. Cellen förbereder bränslet",
    simple:
      "Tänk dig att cellen får en stor bit socker som behöver delas upp i mindre delar. Redan när sockret delas får cellen lite användbar energi!",
    detail:
      "Det här kallas glykolys. I cellvätskan delas en glukosmolekyl till två pyruvat. Samtidigt bildas netto 2 ATP och energibäraren NADH. Glykolysen behöver inte syre direkt.",
    note: "Det första steget sker i cellvätskan, inte inne i mitokondrien.",
    visual:
      "🟠 Till vänster delas glukos (6 kol) till två pyruvat (3 kol vardera). Två gula ljuspunkter visar nettovinsten: 2 ATP.",
  },
  {
    short: "In i cellen",
    title: "2. Mitokondrien tar över",
    simple:
      "Nu fortsätter cellen att plocka ut energi ur sockrets mindre delar. En del av kolet lämnar som koldioxid, medan andra molekyler tar med sig energi till nästa steg.",
    detail:
      "Pyruvat transporteras in i mitokondriens matrix och omvandlas till acetyl-CoA. I citronsyracykeln frigörs koldioxid. NADH och FADH₂ bildas och transporterar energirika elektroner vidare. En liten mängd ATP (eller GTP) bildas också.",
    note: "De böjda rörelserna är en förenklad bild av reaktionerna i matrix, inte bokstavliga molekylbanor.",
    visual:
      "⚫ Pyruvat kommer in i mitokondrien. CO₂ lämnar, och blå NADH samt violett FADH₂ visar energibärare som bildas.",
  },
  {
    short: "Syre",
    title: "3. Syret hjälper till",
    simple:
      "Nu används energin från de tidigare stegen för att flytta små laddade partiklar över ett membran. Tänk på vatten som samlas bakom en damm! Syret hjälper processen att fortsätta, och vatten bildas.",
    detail:
      "Elektroner från NADH och FADH₂ passerar genom elektrontransportkedjans proteiner i det inre membranet. Energin används för att pumpa vätejoner (H⁺) från matrix till utrymmet på andra sidan membranet. Syre tar emot elektroner i slutet av kedjan och bildar vatten tillsammans med H⁺.",
    note: "O₂ visas som två röda syreatomer. H₂O har en röd syreatom och två vita väteatomer. Rörelserna är schematiska.",
    visual:
      "🔴 En O₂-molekyl når ett proteinkomplex i membranet. Vatten (H₂O) bildas, medan gula H⁺-partiklar pumpas över membranet.",
  },
  {
    short: "ATP",
    title: "4. Cellen får användbar energi",
    simple:
      "Nu får de laddade partiklarna strömma tillbaka genom pyttesmå molekylära maskiner. Precis som vatten kan driva en turbin används flödet för att tillverka ATP – cellens användbara energibärare!",
    detail:
      "Vätejoner (H⁺) strömmar tillbaka genom proteinet ATP-syntas i det inre membranet. Energin från flödet används för att bilda ATP från ADP och fosfat. ATP hjälper cellen att arbeta, växa och reparera sig.",
    note: "ATP är inte energi som skapas ur ingenting: energi från bränslet omvandlas.",
    visual:
      "🟡 H⁺ strömmar tillbaka genom ATP-syntas. Gyllene partiklar visar ATP som bildas.",
  },
] as const;

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

// The 3D anatomy is kept separate so the energy-lab UI can stay untouched.
import MitochondrionModel from "./MitochondrionModel";
import GlycolysisAnimation from "./GlycolysisAnimation";
import MatrixReactionsAnimation from "./MatrixReactionsAnimation";
import ElectronTransportAnimation from "./ElectronTransportAnimation";

// Set a wider initial framing on narrow screens, without disabling free rotation.
function ResponsiveEnergyCamera() {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    const update = () => {
      const portrait = window.matchMedia(
        "(max-width: 600px) and (orientation: portrait)",
      ).matches;
      // Portrait screens have a narrow horizontal field of view.
      camera.position.set(0, 0.1, portrait ? 15.2 : 9.5);
      camera.updateProjectionMatrix();
      invalidate();
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [camera, invalidate]);
  return null;
}

export default function CellEnergyExplorer({
  onClose,
}: {
  onClose: () => void;
}) {
  const mounted = useMounted();
  const [stage, setStage] = useState<Stage>(0);
  const [oxygen, setOxygen] = useState(100);
  const [fuel, setFuel] = useState(100);
  const [paused, setPaused] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // Mobile has a compact reading sheet and an optional larger reading mode.
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [mobileReading, setMobileReading] = useState(false);
  const [mobileMinimized, setMobileMinimized] = useState(false);
  // Educational visualization, not a measured biochemical yield.
  // A small glycolysis contribution remains when oxygen is absent.
  const glycolysis = fuel * 0.02;
  const aerobic = Math.min(oxygen, fuel) * 0.98;
  const activity = glycolysis + aerobic;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  if (!mounted) return null;
  const explanation =
    fuel === 0
      ? "Utan glukosbränsle stannar ATP-produktionen i den här förenklade modellen."
      : oxygen === 0
        ? "Oj! Utan syre kan glykolysen fortfarande ge lite ATP. Men den syreberoende produktionen i mitokondrien stannar."
        : oxygen < fuel
          ? "Syret begränsar den syreberoende ATP-produktionen. Prova att öka syret!"
          : fuel < oxygen
            ? "Bränslet begränsar ATP-produktionen. Mer syre hjälper inte om bränslet saknas."
            : "Gott om både syre och bränsle! Prova att minska ett reglage och jämför.";
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#080f1c] text-[#f6f0ea]"
      role="dialog"
      aria-modal="true"
      aria-label="Cellens energilabb"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_42%_46%,#352439_0%,#121a2b_50%,#070e19_92%)]" />
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.1, 9.5], fov: 42 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true }}
        >
          <ResponsiveEnergyCamera />
          <ambientLight intensity={1.7} />
          <hemisphereLight args={["#ffe4e5", "#273d60", 1.5]} />
          <directionalLight
            position={[3, 4, 6]}
            intensity={2.4}
            color="#ffd7d5"
          />
          <pointLight
            position={[-4, -2, 4]}
            intensity={17}
            distance={13}
            color="#b37b9d"
          />
          <Stars
            radius={50}
            depth={25}
            count={150}
            factor={0.6}
            fade
            speed={0.1}
          />
          <MitochondrionModel
            stage={stage}
            paused={paused}
            oxygen={stage === 3 ? oxygen : 100}
            fuel={stage === 3 ? fuel : 100}
          />
          {stage === 0 && <GlycolysisAnimation paused={paused} fuel={100} />}
          {stage === 1 && (
            <MatrixReactionsAnimation paused={paused} oxygen={100} fuel={100} />
          )}
          {(stage === 2 || stage === 3) && (
            <ElectronTransportAnimation
              stage={stage}
              paused={paused}
              oxygen={stage === 3 ? oxygen : 100}
              fuel={stage === 3 ? fuel : 100}
            />
          )}
          <OrbitControls
            enablePan={false}
            minDistance={6.6}
            maxDistance={18}
            minPolarAngle={0.5}
            maxPolarAngle={2.6}
            enableDamping
          />
        </Canvas>
      </div>
      <header className="pointer-events-none absolute left-4 top-4 z-10 max-w-[min(62vw,390px)] sm:left-8 sm:top-7">
        <p className="text-[9px] font-bold uppercase tracking-[.16em] text-amber-200/85 sm:text-[10px]">
          The Unfolding Universe · Museum
        </p>
        <h1 className="mt-1.5 font-serif text-[clamp(21px,3vw,37px)] leading-tight">
          Cellens energilabb
        </h1>
        <p className="mt-1.5 max-w-[320px] text-[11px] leading-5 text-slate-300 sm:text-sm">
          Hur får cellen energi? Följ de fyra stegen och experimentera med ATP!
        </p>
      </header>
      {/* Close is always separate from the collapsible controls and never overlaps its header. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Stäng energilabbet"
        className="absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#122235]/95 text-white shadow-xl backdrop-blur-xl transition hover:bg-white/20 sm:right-6 sm:top-5"
      >
        <X size={19} />
      </button>
      <aside
        className={`energy-controls energy-desktop-panel ${mobileExpanded && !collapsed ? "energy-mobile-expanded" : ""} absolute bottom-3 left-3 right-3 z-20 rounded-[22px] border border-amber-200/25 bg-[#111b2b]/96 shadow-[0_15px_65px_rgba(0,0,0,.55)] backdrop-blur-xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-[min(430px,42vw)] ${collapsed ? "energy-collapsed" : ""}`}
      >
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-amber-200">
              <Zap size={13} /> Interaktivt experiment
            </p>
            <h2 className="mt-1 font-serif text-[17px] leading-tight sm:text-xl">
              {collapsed ? "Cellens energilabb" : stages[stage].title}
            </h2>
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setMobileExpanded((value) => !value)}
              aria-label={
                mobileExpanded
                  ? "Visa mer av mitokondrien"
                  : "Visa mer av texten"
              }
              aria-pressed={mobileExpanded}
              className="energy-expand-button hidden h-9 shrink-0 items-center justify-center rounded-full border border-amber-200/25 bg-white/5 px-3 text-[11px] font-semibold text-amber-100"
            >
              {mobileExpanded ? "Visa modellen" : "Läs mer"}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setCollapsed((value) => !value);
              setMobileExpanded(false);
            }}
            aria-label={
              collapsed
                ? "Visa experimentets kontroller"
                : "Fäll ihop experimentets kontroller"
            }
            aria-expanded={!collapsed}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200/30 bg-white/5 text-amber-100 hover:bg-white/15"
          >
            {collapsed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {!collapsed && (
          <div className="energy-scroll space-y-3 overflow-y-auto overscroll-contain px-3 pb-3 sm:px-4 sm:pb-4">
            <p className="rounded-xl border border-amber-200/15 bg-amber-100/[.07] px-3 py-2 text-[12px] leading-5 text-amber-50">
              💡{" "}
              {stage === 3 ? (
                <>
                  <strong>Din tur!</strong> Sänk syret till 0 % men behåll
                  bränslet på 100 %. Kan cellen fortfarande bilda lite ATP?
                </>
              ) : (
                <>
                  <strong>Följ med!</strong> Upptäck vad som händer i det här
                  steget. I steg 4 får du själv experimentera med syre, bränsle
                  och ATP.
                </>
              )}
            </p>
            <div
              className="grid grid-cols-4 gap-1.5"
              aria-label="Cellandningens fyra steg"
            >
              {([0, 1, 2, 3] as Stage[]).map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStage(i)}
                  aria-current={stage === i ? "step" : undefined}
                  className={`flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center transition ${stage === i ? "border-amber-200/60 bg-amber-300/15 text-amber-100" : "border-white/10 bg-white/[.035] text-slate-300 hover:bg-white/10"}`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${stage === i ? "bg-amber-300 text-[#271c24]" : "bg-white/10"}`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[10px] leading-3">
                    {stages[i].short}
                  </span>
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[.04] px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200/90">
                Det här ser du just nu
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-100">
                {stages[stage].visual}
              </p>
            </div>
            <p className="text-[12px] leading-[1.65] text-slate-100">
              {stages[stage].simple}
            </p>
            <details className="group rounded-xl border border-white/10 bg-white/[.035] px-3 py-2.5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[12px] font-semibold text-amber-100 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <Info size={15} /> Fördjupa dig – så fungerar det
                </span>
                <ChevronDown
                  size={16}
                  className="shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-2 text-[12px] leading-[1.65] text-slate-200">
                {stages[stage].detail}
              </p>
              <p className="mt-2 text-[11px] leading-4 text-slate-400">
                {stages[stage].note}
              </p>
            </details>
            {stage === 3 && (
              <>
                <div className="rounded-xl border border-white/10 bg-white/[.045] p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <label
                      htmlFor="energy-oxygen"
                      className="flex items-center gap-2 text-xs font-semibold"
                    >
                      <Wind size={15} className="text-sky-300" /> Syre
                    </label>
                    <span className="text-xs tabular-nums text-sky-200">
                      {oxygen}%
                    </span>
                  </div>
                  <input
                    id="energy-oxygen"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={oxygen}
                    onChange={(e) => setOxygen(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                  <div className="mb-1 mt-2 flex items-center justify-between gap-2">
                    <label
                      htmlFor="energy-fuel"
                      className="flex items-center gap-2 text-xs font-semibold"
                    >
                      <Flame size={15} className="text-rose-300" /> Bränsle
                      (från socker)
                    </label>
                    <span className="text-xs tabular-nums text-rose-200">
                      {fuel}%
                    </span>
                  </div>
                  <input
                    id="energy-fuel"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={fuel}
                    onChange={(e) => setFuel(Number(e.target.value))}
                    className="w-full accent-rose-400"
                  />
                </div>
                <div className="rounded-xl border border-amber-200/25 bg-amber-200/[.07] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-xs font-semibold text-amber-100">
                      <Zap size={15} /> Illustrerad ATP-produktion
                    </span>
                    <span className="text-sm font-bold tabular-nums text-amber-200">
                      {Math.round(activity)}%
                    </span>
                  </div>
                  <div
                    className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-white/10"
                    role="progressbar"
                    aria-label="Illustrerad ATP-produktion"
                    aria-valuenow={Math.round(activity)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full bg-[#eaa15b] transition-[width] duration-500"
                      style={{ width: `${glycolysis}%` }}
                    />
                    <div
                      className="h-full bg-[#72b9df] transition-[width] duration-500"
                      style={{ width: `${aerobic}%` }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#eaa15b]" />
                      Glykolys (utan syre)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#72b9df]" />
                      Syreberoende produktion
                    </span>
                  </div>
                  <div className="mt-3 rounded-lg border border-white/10 bg-white/[.035] px-3 py-2">
                    <p className="text-[11px] font-semibold text-amber-100">
                      Vad händer i cellen?
                    </p>
                    <p
                      aria-live="polite"
                      className="mt-1 text-[11px] leading-[1.55] text-slate-200"
                    >
                      {explanation}
                    </p>
                  </div>
                </div>
              </>
            )}
            <p className="flex items-start gap-2 text-[10px] leading-4 text-slate-400">
              <Info size={13} className="mt-0.5 shrink-0" />
              {stage === 3
                ? "Illustrativ modell, inte ett verkligt mätvärde. Orange visar att glykolysen kan ge lite ATP utan syre. Verklig ATP-produktion beror på fler faktorer och är inte linjär med reglagen."
                : "Förenklade animationer av cellandningens olika steg. I steg 4 kan du experimentera med ATP-produktionen."}
            </p>
          </div>
        )}
        {!collapsed && (
          <div className="energy-toolbar shrink-0 space-y-2 border-t border-white/10 bg-[#111b2b] px-3 py-2.5 sm:px-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaused((v) => !v)}
                  className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-[11px] hover:bg-white/10"
                >
                  {paused ? <Play size={13} /> : <Pause size={13} />}{" "}
                  {paused ? "Fortsätt" : "Pausa"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOxygen(100);
                    setFuel(100);
                    setStage(0);
                    setPaused(false);
                  }}
                  className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-[11px] hover:bg-white/10"
                >
                  <RotateCcw size={13} /> Återställ
                </button>
              </div>
              <span className="text-[10px] text-slate-400">
                {stage + 1} av 4
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <button
                type="button"
                disabled={stage === 0}
                onClick={() => setStage((stage - 1) as Stage)}
                className="flex items-center gap-1 text-xs text-slate-200 disabled:opacity-30"
              >
                <ArrowLeft size={15} /> Föregående
              </button>
              <button
                type="button"
                disabled={stage === 3}
                onClick={() => setStage((stage + 1) as Stage)}
                className="flex items-center gap-1 text-xs font-semibold text-amber-200 disabled:opacity-30"
              >
                Nästa <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Dedicated mobile experience: the desktop aside above is left intact. */}
      <section
        className="energy-mobile-ui"
        aria-label="Mobilguide för cellens energilabb"
      >
        <div className="energy-mobile-playback">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "Fortsätt animationen" : "Pausa animationen"}
            className="energy-mobile-chip"
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            <span>{paused ? "Fortsätt" : "Pausa"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setOxygen(100);
              setFuel(100);
              setStage(0);
              setPaused(false);
              setMobileReading(false);
            }}
            className="energy-mobile-chip"
            aria-label="Återställ experimentet"
          >
            <RotateCcw size={14} />
            <span>Återställ</span>
          </button>
        </div>
        <div
          className={`energy-mobile-panel ${mobileReading ? "energy-mobile-panel-reading" : ""} ${mobileMinimized ? "energy-mobile-panel-minimized" : ""}`}
        >
          <div className="energy-mobile-panel-head">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[.12em] text-amber-200">
                {stage + 1} av 4 · Cellens energilabb
              </p>
              <h2 className="mt-1 font-serif text-[16px] leading-tight text-[#f6f0ea]">
                {stages[stage].title}
              </h2>
            </div>
            <div className="energy-mobile-head-actions">
              {!mobileMinimized && (
                <button
                  type="button"
                  className="energy-mobile-read-button"
                  aria-expanded={mobileReading}
                  onClick={() => setMobileReading((value) => !value)}
                >
                  {mobileReading ? "Visa steg" : "Läs mer"}
                  {mobileReading ? (
                    <ChevronDown size={14} />
                  ) : (
                    <Info size={14} />
                  )}
                </button>
              )}
              <button
                type="button"
                className="energy-mobile-minimize-button"
                aria-label={
                  mobileMinimized ? "Visa stegen" : "Minimera panelen"
                }
                aria-expanded={!mobileMinimized}
                onClick={() => {
                  setMobileMinimized((value) => !value);
                  setMobileReading(false);
                }}
              >
                {mobileMinimized ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
          </div>
          {!mobileMinimized && (
            <div
              className="energy-mobile-tabs"
              role="group"
              aria-label="Välj steg"
            >
              {([0, 1, 2, 3] as Stage[]).map((i) => (
                <button
                  type="button"
                  key={i}
                  aria-current={stage === i ? "step" : undefined}
                  onClick={() => {
                    setStage(i);
                    setMobileReading(false);
                  }}
                  className={`energy-mobile-tab ${stage === i ? "energy-mobile-tab-active" : ""}`}
                >
                  <span className="energy-mobile-tab-number">{i + 1}</span>
                  <span>{stages[i].short}</span>
                </button>
              ))}
            </div>
          )}
          {!mobileMinimized && (
            <div className="energy-mobile-content" key={stage}>
              {mobileReading ? (
                <div className="space-y-3 pb-2">
                  <p className="text-[12px] leading-[1.6] text-slate-100">
                    {stages[stage].simple}
                  </p>
                  <div className="rounded-xl border border-white/10 bg-white/[.045] p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                      Det här ser du
                    </p>
                    <p className="text-[12px] leading-[1.6] text-slate-200">
                      {stages[stage].visual}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[.045] p-3">
                    <p className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-amber-100">
                      <Info size={14} /> Fördjupning
                    </p>
                    <p className="text-[12px] leading-[1.6] text-slate-200">
                      {stages[stage].detail}
                    </p>
                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                      {stages[stage].note}
                    </p>
                  </div>
                </div>
              ) : stage === 3 ? (
                <div className="space-y-2 pb-2">
                  <div className="grid gap-1.5 rounded-xl border border-white/10 bg-white/[.045] p-3">
                    <div className="flex items-center justify-between text-xs">
                      <label
                        htmlFor="mobile-energy-oxygen"
                        className="flex items-center gap-1.5"
                      >
                        <Wind size={14} className="text-sky-300" /> Syre
                      </label>
                      <span className="tabular-nums text-sky-200">
                        {oxygen}%
                      </span>
                    </div>
                    <input
                      id="mobile-energy-oxygen"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={oxygen}
                      onChange={(e) => setOxygen(Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <label
                        htmlFor="mobile-energy-fuel"
                        className="flex items-center gap-1.5"
                      >
                        <Flame size={14} className="text-rose-300" /> Bränsle
                      </label>
                      <span className="tabular-nums text-rose-200">
                        {fuel}%
                      </span>
                    </div>
                    <input
                      id="mobile-energy-fuel"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={fuel}
                      onChange={(e) => setFuel(Number(e.target.value))}
                      className="w-full accent-rose-400"
                    />
                  </div>
                  <p className="text-[11px] leading-4 text-slate-300">
                    Prova att sänka syret till 0 % medan bränslet är kvar. Vad
                    händer med ATP?
                  </p>
                  <div className="rounded-xl border border-amber-200/20 bg-amber-200/[.06] p-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-100">
                      <span>Illustrerad ATP-produktion</span>
                      <span className="tabular-nums">
                        {Math.round(activity)}%
                      </span>
                    </div>
                    <div
                      className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10"
                      role="progressbar"
                      aria-label="Illustrerad ATP-produktion"
                      aria-valuenow={Math.round(activity)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="bg-[#eaa15b] transition-[width] duration-300"
                        style={{ width: `${glycolysis}%` }}
                      />
                      <div
                        className="bg-[#72b9df] transition-[width] duration-300"
                        style={{ width: `${aerobic}%` }}
                      />
                    </div>
                    <p
                      className="mt-2 text-[11px] leading-4 text-slate-200"
                      aria-live="polite"
                    >
                      {explanation}
                    </p>
                    <p className="mt-2 text-[10px] leading-4 text-slate-400">
                      Orange: glykolys. Blå: syreberoende produktion. Procenten
                      är illustrativ, inte ett verkligt mätvärde.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pb-2">
                  <p className="text-[12px] leading-[1.55] text-slate-100">
                    {stages[stage].simple}
                  </p>
                  <p className="text-[11px] leading-5 text-slate-400">
                    {stages[stage].visual}
                  </p>
                </div>
              )}
            </div>
          )}
          {!mobileMinimized && (
            <div className="energy-mobile-navigation">
              <button
                type="button"
                disabled={stage === 0}
                onClick={() => {
                  setStage((stage - 1) as Stage);
                  setMobileReading(false);
                }}
                className="energy-mobile-nav-button disabled:opacity-30"
              >
                <ArrowLeft size={15} /> Föregående
              </button>
              <button
                type="button"
                disabled={stage === 3}
                onClick={() => {
                  setStage((stage + 1) as Stage);
                  setMobileReading(false);
                }}
                className="energy-mobile-nav-button font-semibold text-amber-200 disabled:opacity-30"
              >
                Nästa <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>
      <style jsx>{`
        .energy-mobile-ui {
          display: none;
        }
        @media (max-width: 900px) {
          .energy-desktop-panel {
            display: none !important;
          }
          .energy-mobile-ui {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 20;
            pointer-events: none;
          }
          .energy-mobile-ui button,
          .energy-mobile-ui input {
            touch-action: manipulation;
          }
          .energy-mobile-playback {
            position: absolute;
            display: flex;
            gap: 7px;
            pointer-events: auto;
          }
          .energy-mobile-chip {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: rgba(17, 27, 43, 0.94);
            color: #f3eee9;
            border-radius: 999px;
            padding: 9px 12px;
            font-size: 11px;
            backdrop-filter: blur(12px);
          }
          .energy-mobile-panel {
            position: absolute;
            display: flex;
            flex-direction: column;
            min-height: 0;
            overflow: hidden;
            pointer-events: auto;
            border: 1px solid rgba(244, 210, 139, 0.26);
            background: rgba(17, 27, 43, 0.97);
            color: #f6f0ea;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.38);
          }
          .energy-mobile-head-actions {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            gap: 7px;
          }
          .energy-mobile-minimize-button {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid rgba(244, 210, 139, 0.3);
            color: #f7e4ad;
            background: rgba(255, 255, 255, 0.04);
          }
          .energy-mobile-panel-minimized {
            height: auto !important;
            max-height: none !important;
          }
          .energy-mobile-panel-minimized .energy-mobile-panel-head {
            padding: 10px 12px;
          }
          .energy-mobile-panel-minimized h2 {
            display: none;
          }
          .energy-mobile-panel-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            flex: 0 0 auto;
            padding: 11px 13px 9px;
          }
          .energy-mobile-read-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            flex-shrink: 0;
            padding: 8px 10px;
            border: 1px solid rgba(244, 210, 139, 0.3);
            border-radius: 999px;
            color: #f7e4ad;
            font-size: 11px;
            font-weight: 600;
          }
          .energy-mobile-tabs {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 6px;
            flex: 0 0 auto;
            padding: 0 12px 9px;
          }
          .energy-mobile-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 3px;
            min-width: 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.035);
            border-radius: 10px;
            padding: 6px 2px;
            font-size: 10px;
            color: #cbd5e1;
          }
          .energy-mobile-tab-active {
            border-color: rgba(251, 215, 130, 0.7);
            background: rgba(251, 191, 36, 0.14);
            color: #fde68a;
          }
          .energy-mobile-tab-number {
            font-size: 11px;
            font-weight: 800;
          }
          .energy-mobile-content {
            flex: 1 1 auto;
            min-height: 0;
            overflow-y: auto;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
            padding: 0 13px 6px;
            scrollbar-width: thin;
            scrollbar-color: #64748b transparent;
          }
          .energy-mobile-navigation {
            display: flex;
            justify-content: space-between;
            flex: 0 0 auto;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            padding: 9px 13px max(10px, env(safe-area-inset-bottom));
            background: #111b2b;
          }
          .energy-mobile-nav-button {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
          }
        }
        @media (max-width: 900px) and (orientation: portrait) {
          .energy-mobile-playback {
            top: 112px;
            right: 12px;
          }
          .energy-mobile-panel {
            left: 8px;
            right: 8px;
            bottom: max(8px, env(safe-area-inset-bottom));
            height: min(48dvh, 440px);
            border-radius: 18px;
            transition: height 180ms ease;
          }
          .energy-mobile-panel-reading {
            height: min(78dvh, 700px);
          }
          .energy-mobile-panel-minimized {
            left: auto;
            right: 8px;
            width: min(76vw, 285px);
          }
        }
        @media (max-width: 900px) and (orientation: landscape) {
          .energy-mobile-playback {
            left: 12px;
            bottom: 12px;
          }
          /* Reserve the upper-right corner for the full-screen close button. */
          .energy-mobile-panel {
            top: 62px;
            right: 10px;
            bottom: 8px;
            width: min(43vw, 345px);
            border-radius: 16px;
          }
          .energy-mobile-panel-reading {
            top: 62px;
            width: min(54vw, 440px);
          }
          .energy-mobile-panel-minimized {
            top: auto;
            bottom: 8px;
            right: 10px;
            width: min(43vw, 290px);
          }
          .energy-mobile-panel-head {
            padding-top: 9px;
          }
          .energy-mobile-tabs {
            padding-bottom: 6px;
          }
          .energy-mobile-tab {
            padding: 4px 2px;
          }
        }

        .energy-controls {
          max-height: min(80dvh, 760px);
          display: flex;
          flex-direction: column;
        }
        .energy-scroll {
          min-height: 0;
          flex: 1 1 auto;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #667181 transparent;
          overscroll-behavior: contain;
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
        }
        .energy-toolbar {
          border-radius: 0 0 22px 22px;
        }
        .energy-collapsed {
          max-height: none;
        }
        @media (max-width: 600px) and (orientation: portrait) {
          .energy-controls {
            /* Leave most of the viewport free for the interactive 3D scene. */
            max-height: none;
            height: min(44dvh, 395px);
            bottom: max(10px, env(safe-area-inset-bottom));
            transition: height 220ms ease;
          }
          .energy-mobile-expanded {
            height: min(75dvh, 660px);
          }
          .energy-collapsed {
            height: auto;
            max-height: none;
          }
          .energy-expand-button {
            display: inline-flex;
          }
          .energy-scroll {
            /* The text scrolls; dragging on the canvas still rotates the model. */
            scrollbar-width: thin;
            scrollbar-color: #667181 transparent;
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch;
          }
        }
        @media (max-width: 900px) and (orientation: landscape) {
          .energy-controls {
            left: auto;
            right: 8px;
            bottom: 8px;
            width: min(42vw, 360px);
            height: min(76dvh, 340px);
            max-height: calc(100dvh - 16px);
          }
          .energy-mobile-expanded {
            height: min(88dvh, 440px);
          }
          .energy-expand-button {
            display: inline-flex;
          }
          .energy-collapsed {
            height: auto;
            max-height: none;
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}
