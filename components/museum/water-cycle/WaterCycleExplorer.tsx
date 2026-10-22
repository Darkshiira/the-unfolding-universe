"use client";

import WaterCycleScene from "./WaterCycleScene";
import WaterDropletJourney from "./WaterDropletJourney";
import WaterTemperatureLab from "./WaterTemperatureLab";
import WaterSunLab from "./WaterSunLab";
import WaterGroundLab from "./WaterGroundLab";
import WaterEvaporationEffect from "./WaterEvaporationEffect";
import WaterCondensationEffect from "./WaterCondensationEffect";
import WaterFrostEffect from "./WaterFrostEffect";
import WaterRainEffect from "./WaterRainEffect";
import WaterfallMist from "./WaterfallMist";
import WaterMeltingEffect from "./WaterMeltingEffect";
import WaterSnowEffect from "./WaterSnowEffect";
import WaterRiverEffect from "./WaterRiverEffect";
import WaterGroundwaterEffect from "./WaterGroundwaterEffect";
import WaterPlantEffect from "./WaterPlantEffect";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  CloudRain,
  Droplets,
  Leaf,
  MountainSnow,
  RotateCcw,
  Waves,
  X,
  Info,
} from "lucide-react";

export type TopicId =
  | "snow"
  | "clouds"
  | "rain"
  | "runoff"
  | "groundwater"
  | "plants"
  | "evaporation";

type Topic = {
  id: TopicId;
  title: string;
  short: string;
  description: string;
  detail: string;
  x: number;
  y: number;
  icon: typeof Cloud;
};

const topics: Topic[] = [
  {
    id: "snow",
    title: "Snö och is",
    short: "Vatten lagras som snö och glaciäris.",
    description:
      "I kalla områden kan nederbörd falla som snö. En del av snön smälter varje år, medan annan snö kan omvandlas till glaciäris.",
    detail:
      "När snö och is smälter kan vattnet rinna vidare till bäckar, sjöar och hav. Glaciärer kan lagra vatten under mycket lång tid.",
    x: 17,
    y: 32,
    icon: MountainSnow,
  },
  {
    id: "clouds",
    title: "Moln",
    short: "Vatten kondenserar till små droppar.",
    description:
      "När fuktig luft kyls kan vattenånga kondensera till små vattendroppar eller bilda iskristaller.",
    detail:
      "Moln består av små vattendroppar, iskristaller eller båda. Vattenånga är däremot en osynlig gas.",
    x: 60,
    y: 23,
    icon: Cloud,
  },
  {
    id: "rain",
    title: "Nederbörd",
    short: "Vatten faller som regn eller snö.",
    description:
      "När droppar eller iskristaller i molnen växer kan de bli tillräckligt stora för att falla som nederbörd.",
    detail:
      "Beroende på temperaturen och förhållandena i atmosfären kan nederbörden nå marken som regn, snö eller hagel.",
    x: 70,
    y: 41,
    icon: CloudRain,
  },
  {
    id: "runoff",
    title: "Sjöar och floder",
    short: "Vatten rinner genom landskapet.",
    description:
      "Vatten från regn och snösmältning kan rinna över marken och samlas i bäckar, floder och sjöar.",
    detail:
      "Vattnet rör sig ofta mot lägre höjder genom gravitationens påverkan. Mycket av det når till slut havet.",
    x: 42,
    y: 70,
    icon: Waves,
  },
  {
    id: "groundwater",
    title: "Grundvatten",
    short: "Vatten rör sig under markytan.",
    description:
      "En del av nederbörden infiltrerar marken och kan tränga ned till grundvattenmagasin.",
    detail:
      "Grundvatten kan röra sig långsamt genom jord och berg och senare nå källor, vattendrag eller havet.",
    x: 38,
    y: 87,
    icon: Droplets,
  },
  {
    id: "plants",
    title: "Växter",
    short: "Växter tar upp och avger vatten.",
    description:
      "Växter tar upp vatten genom sina rötter. En stor del av vattnet avges sedan som vattenånga genom bladen.",
    detail:
      "Den processen kallas transpiration och är en viktig del av vattnets kretslopp.",
    x: 30,
    y: 57,
    icon: Leaf,
  },
  {
    id: "evaporation",
    title: "Avdunstning",
    short: "Flytande vatten blir vattenånga.",
    description:
      "Solenergi bidrar till att vatten avdunstar från hav, sjöar, mark och andra våta ytor.",
    detail:
      "Vattenångan kan transporteras med vinden och senare kondensera till molndroppar när luften kyls.",
    x: 83,
    y: 75,
    icon: Waves,
  },
];

export default function WaterCycleExplorer() {
  const [selectedId, setSelectedId] = useState<TopicId | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  const selectedIndex = topics.findIndex((topic) => topic.id === selectedId);

  const selected = selectedIndex >= 0 ? topics[selectedIndex] : null;

  function navigate(direction: number) {
    const current = selectedIndex < 0 ? 0 : selectedIndex;
    const next = (current + direction + topics.length) % topics.length;

    setSelectedId(topics[next].id);
  }
  const [showIntroduction, setShowIntroduction] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowIntroduction(false);
    }, 6500);

    return () => window.clearTimeout(timer);
  }, []);

  const [activeMode, setActiveMode] = useState<
    "explore" | "journey" | "experiment"
  >("explore");
  const [activeLab, setActiveLab] = useState<"temperature" | "sun" | "ground">(
    "temperature",
  );
  const [journeyStep, setJourneyStep] = useState<
    | "ocean"
    | "vapor"
    | "cloud"
    | "rain"
    | "snow"
    | "river"
    | "groundwater"
    | "plant"
  >("ocean");

  return (
    <main className="relative isolate h-[100svh] min-h-[500px] overflow-hidden bg-[#071b28] text-white">
      {/* Full-screen landscape */}
      <WaterCycleScene
        hotspots={activeMode === "explore" ? topics : []}
        selectedId={selectedId}
        onSelect={setSelectedId}
        showLabels={showLabels}
      />

      {activeMode === "journey" && (
        <>
          <WaterEvaporationEffect active={journeyStep === "vapor"} />
          <WaterCondensationEffect
            active={journeyStep === "cloud" || journeyStep === "rain"}
          />
          <WaterRainEffect active={journeyStep === "rain"} />
          <WaterSnowEffect active={journeyStep === "snow"} />
          <WaterFrostEffect active={journeyStep === "snow"} />
          <WaterRiverEffect
            active={activeMode === "journey" && journeyStep === "river"}
          />
          <WaterfallMist
            active={activeMode === "journey" && journeyStep === "river"}
          />
          <WaterMeltingEffect
            active={activeMode === "journey" && journeyStep === "river"}
          />
          <WaterGroundwaterEffect active={journeyStep === "groundwater"} />
          <WaterPlantEffect active={journeyStep === "plant"} />
          <WaterDropletJourney
            onClose={() => setActiveMode("explore")}
            onStepChange={setJourneyStep}
          />
        </>
      )}

      {activeMode === "experiment" && (
        <>
          {activeLab === "temperature" ? (
            <WaterTemperatureLab onClose={() => setActiveMode("explore")} />
          ) : activeLab === "sun" ? (
            <WaterSunLab onClose={() => setActiveMode("explore")} />
          ) : (
            <WaterGroundLab onClose={() => setActiveMode("explore")} />
          )}
          <nav
            aria-label="Välj laboratorium"
            className="pointer-events-auto absolute inset-x-3 top-4 z-40 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-full border border-white/20 bg-[#092536]/95 p-1.5 shadow-xl backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => setActiveLab("temperature")}
              aria-current={activeLab === "temperature" ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-[11px] font-semibold transition sm:px-5 sm:text-xs ${activeLab === "temperature" ? "bg-cyan-300/20 text-cyan-100" : "text-white/60 hover:text-white"}`}
            >
              01 · Vattnets former
            </button>
            <button
              type="button"
              onClick={() => setActiveLab("sun")}
              aria-current={activeLab === "sun" ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-[11px] font-semibold transition sm:px-5 sm:text-xs ${activeLab === "sun" ? "bg-amber-300/20 text-amber-100" : "text-white/60 hover:text-white"}`}
            >
              02 · Skapa väder
            </button>
            <button
              type="button"
              onClick={() => setActiveLab("ground")}
              aria-current={activeLab === "ground" ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-[11px] font-semibold transition sm:px-5 sm:text-xs ${activeLab === "ground" ? "bg-emerald-300/20 text-emerald-100" : "text-white/60 hover:text-white"}`}
            >
              03 · Regnets väg
            </button>
          </nav>
        </>
      )}

      {/* Top navigation */}
      <header
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 p-4 sm:p-6 lg:p-8 ${activeMode === "experiment" ? "hidden" : ""}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="pointer-events-auto max-w-xl">
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#071b28]/55 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition hover:bg-[#071b28]/80"
            >
              <ArrowLeft size={15} />
              Tillbaka till tidslinjen
            </Link>

            {/* Sliding introduction */}
            <div className="relative mt-5">
              <div
                className={`origin-left transition-all duration-700 ease-in-out ${
                  showIntroduction
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-[120%] opacity-0"
                }`}
                aria-hidden={!showIntroduction}
              >
                <div className="max-w-xl rounded-[24px] border border-white/15 bg-[#071b28]/35 p-5 shadow-xl backdrop-blur-md sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-200 sm:text-xs">
                    The Unfolding Universe · Interaktivt museum
                  </p>

                  <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
                    Vattnets kretslopp
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/85">
                    Utforska landskapet. Klicka på de lysande symbolerna och
                    upptäck vattnets resa.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowIntroduction(false)}
                    className="mt-5 text-xs font-semibold text-teal-200 transition hover:text-white"
                  >
                    Dölj introduktionen ←
                  </button>
                </div>
              </div>

              {/* Small floating tab when hidden */}
              <button
                type="button"
                onClick={() => setShowIntroduction(true)}
                aria-label="Visa introduktionen"
                aria-expanded={showIntroduction}
                className={`absolute left-0 top-0 flex items-center gap-2 rounded-full border border-white/25 bg-[#071b28]/75 px-4 py-3 text-xs font-semibold shadow-lg backdrop-blur-xl transition-all duration-500 hover:bg-[#123b4a] ${
                  showIntroduction
                    ? "pointer-events-none -translate-x-5 opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
              >
                <Info size={16} className="text-teal-200" />
                Om utställningen
              </button>
            </div>
          </div>

          {/* Museum navigation — desktop */}
          <div className="pointer-events-auto hidden items-center gap-2 rounded-full border border-white/20 bg-[#071b28]/60 p-1.5 backdrop-blur-xl md:flex">
            <button
              type="button"
              onClick={() => {
                setActiveMode("explore");
                setSelectedId(null);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeMode === "explore"
                  ? "bg-teal-400/20 text-teal-100"
                  : "text-white/60 hover:text-white"
              }`}
            >
              01 · Utforska
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode("journey");
                setSelectedId(null);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeMode === "journey"
                  ? "bg-cyan-400/20 text-cyan-100"
                  : "text-white/60 hover:text-white"
              }`}
            >
              02 · Följ droppen
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode("experiment");
                setSelectedId(null);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeMode === "experiment" ? "bg-amber-400/20 text-amber-100" : "text-white/60 hover:text-white"}`}
            >
              03 · Experimentera
            </button>
          </div>
        </div>
      </header>

      {/* Selected information */}
      {activeMode === "explore" && selected && (
        <aside
          aria-live="polite"
          aria-label={`Information om ${selected.title}`}
          className="absolute inset-x-3 bottom-20 z-30 max-h-[52svh] overflow-y-auto rounded-[26px] border border-white/20 bg-[#071c28]/90 p-5 shadow-2xl backdrop-blur-2xl sm:inset-x-auto sm:bottom-7 sm:right-7 sm:w-[390px] sm:max-h-[65svh] sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-300/15 p-3 text-teal-200">
                <selected.icon size={23} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300">
                  Upptäck vattnets väg
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold">
                  {selected.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Stäng information"
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 h-px bg-white/15" />

          <p className="mt-5 text-sm leading-7 text-slate-100">
            {selected.description}
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            {selected.detail}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Föregående område"
              className="rounded-full border border-white/20 p-3 transition hover:bg-white/10"
            >
              <ArrowLeft size={18} />
            </button>

            <span className="text-xs font-medium tracking-widest text-white/70">
              {selectedIndex + 1} / {topics.length}
            </span>

            <button
              type="button"
              onClick={() => navigate(1)}
              aria-label="Nästa område"
              className="rounded-full border border-white/20 p-3 transition hover:bg-white/10"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </aside>
      )}

      {/* Bottom controls */}
      {activeMode !== "experiment" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
              {/* Mobile: switch between Explore and Journey */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode(
                    activeMode === "journey" ? "explore" : "journey",
                  );
                  setSelectedId(null);
                }}
                className="rounded-full border border-cyan-200/30 bg-[#071b28]/80 px-4 py-3 text-xs font-semibold text-cyan-100 backdrop-blur-xl transition hover:bg-[#123b4a] md:hidden"
              >
                {activeMode === "journey" ? "← Utforska" : "💧 Följ droppen"}
              </button>

              {/* Show or hide hotspot labels */}
              {activeMode === "explore" && (
                <button
                  type="button"
                  onClick={() => setShowLabels((value) => !value)}
                  className="rounded-full border border-white/20 bg-[#071b28]/70 px-4 py-3 text-xs font-semibold backdrop-blur-xl transition hover:bg-[#123b4a]"
                >
                  {showLabels ? "Dölj namn" : "Visa namn"}
                </button>
              )}

              {/* Reset selected information */}
              {activeMode === "explore" && (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Återställ vyn"
                  className="rounded-full border border-white/20 bg-[#071b28]/70 p-3 backdrop-blur-xl transition hover:bg-[#123b4a]"
                >
                  <RotateCcw size={17} />
                </button>
              )}
            </div>

            {/* Hint displayed when nothing is selected */}
            {activeMode === "explore" && !selected && (
              <div className="hidden rounded-full border border-white/20 bg-[#071b28]/70 px-5 py-3 text-xs text-white/85 backdrop-blur-xl sm:block">
                <span className="mr-2 text-teal-300">✦</span>
                Välj en lysande symbol för att utforska
              </div>
            )}
          </div>
        </div>
      )}
      {activeMode !== "experiment" && (
        <button
          type="button"
          onClick={() => {
            setActiveMode("experiment");
            setSelectedId(null);
          }}
          className="absolute bottom-4 right-4 z-30 rounded-full border border-amber-200/30 bg-[#071b28]/85 px-4 py-3 text-xs font-semibold text-amber-100 backdrop-blur-xl md:hidden"
        >
          🔬 Experimentera
        </button>
      )}
    </main>
  );
}
