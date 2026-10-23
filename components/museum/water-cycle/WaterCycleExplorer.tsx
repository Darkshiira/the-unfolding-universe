"use client";

import "./MuseumMobile.css";

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
import { useCallback, useEffect, useRef, useState } from "react";
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
  Maximize2,
  Minimize2,
  Smartphone,
  ChevronDown,
  ChevronUp,
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
  const [topicExpanded, setTopicExpanded] = useState(false);
  const [topicSheetCollapsed, setTopicSheetCollapsed] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dismissRotateTip, setDismissRotateTip] = useState(false);
  const [rotateTipVisible, setRotateTipVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [journeyMoving, setJourneyMoving] = useState(false);
  const [portraitTopicsOpen, setPortraitTopicsOpen] = useState(false);
  const [portraitCamera, setPortraitCamera] = useState(false);
  const museumRef = useRef<HTMLElement>(null);

  // The scene and the journey SVG both use a centered, cover-cropped panorama.
  // Pan their shared viewport without zooming or exposing blank edges.
  const followJourneyPosition = useCallback((x: number, y: number) => {
    const root = museumRef.current;
    if (
      !root ||
      !window.matchMedia("(orientation: portrait) and (max-width: 900px)")
        .matches
    )
      return;

    const { width, height } = root.getBoundingClientRect();
    if (!width || !height) return;

    const imageWidth = 1672;
    const imageHeight = 941;
    const cover = Math.max(width / imageWidth, height / imageHeight);
    const renderedWidth = imageWidth * cover;
    const renderedHeight = imageHeight * cover;
    const imageLeft = (width - renderedWidth) / 2;
    const imageTop = (height - renderedHeight) / 2;

    const markerX = imageLeft + x * cover;
    const markerY = imageTop + y * cover;
    const desiredX = width * 0.5 - markerX;
    const desiredY = height * 0.37 - markerY;
    const limitX = Math.max(0, (renderedWidth - width) / 2);
    const limitY = Math.max(0, (renderedHeight - height) / 2);
    const clamp = (value: number, limit: number) =>
      Math.max(-limit, Math.min(limit, value));

    root.style.setProperty("--museum-rendered-width", `${renderedWidth}px`);
    root.style.setProperty("--museum-rendered-height", `${renderedHeight}px`);
    root.style.setProperty("--museum-image-left", `${imageLeft}px`);
    root.style.setProperty("--museum-image-top", `${imageTop}px`);
    root.style.setProperty("--journey-pan-x", `${clamp(desiredX, limitX)}px`);
    root.style.setProperty("--journey-pan-y", `${clamp(desiredY, limitY)}px`);
  }, []);

  const resetJourneyCamera = useCallback(() => {
    museumRef.current?.style.setProperty("--journey-pan-x", "0px");
    museumRef.current?.style.setProperty("--journey-pan-y", "0px");
  }, []);

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        const element = document.getElementById("water-museum-root");
        await element?.requestFullscreen();
      }
    } catch {
      // Some mobile browsers, including iOS Safari, restrict fullscreen.
    }
  }

  const selectedIndex = topics.findIndex((topic) => topic.id === selectedId);

  const selected = selectedIndex >= 0 ? topics[selectedIndex] : null;

  function navigate(direction: number) {
    const current = selectedIndex < 0 ? 0 : selectedIndex;
    const next = (current + direction + topics.length) % topics.length;

    setSelectedId(topics[next].id);
    setPortraitCamera(true);
    followJourneyPosition(
      (topics[next].x / 100) * 1672,
      (topics[next].y / 100) * 941,
    );
    setTopicExpanded(false);
  }
  const [showIntroduction, setShowIntroduction] = useState(true);

  useEffect(() => {
    if (!showIntroduction) return;
    const timer = window.setTimeout(() => {
      setShowIntroduction(false);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [showIntroduction]);

  const [activeMode, setActiveMode] = useState<
    "explore" | "journey" | "experiment"
  >("explore");
  useEffect(() => {
    if (activeMode !== "journey") resetJourneyCamera();
  }, [activeMode, resetJourneyCamera]);

  const [activeLab, setActiveLab] = useState<"temperature" | "sun" | "ground">(
    "temperature",
  );

  // Show the rotation hint when entering an exhibit.
  // Reset the hint in the timer callback to avoid synchronous
  // state updates inside the effect.
  useEffect(() => {
    const showTimeout = window.setTimeout(() => {
      setDismissRotateTip(false);
      setRotateTipVisible(true);
    }, 0);

    const hideTimeout = window.setTimeout(() => {
      setRotateTipVisible(false);
    }, 4200);

    return () => {
      window.clearTimeout(showTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, [activeMode, activeLab]);

  const [labMenuOpen, setLabMenuOpen] = useState(false);
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
    <main
      id="water-museum-root"
      ref={museumRef}
      data-mode={activeMode}
      data-portrait-camera={
        activeMode === "journey" || (activeMode === "explore" && portraitCamera)
      }
      data-topic-open={Boolean(selected)}
      className="relative isolate h-[100dvh] min-h-[320px] overflow-hidden bg-[#071b28] text-white [--museum-bottom:env(safe-area-inset-bottom)]"
    >
      {/* Full-screen landscape */}
      <div className="museum-camera-landscape absolute inset-0">
        <WaterCycleScene
          cameraEnabled={
            activeMode === "journey" ||
            (activeMode === "explore" && portraitCamera)
          }
          hotspots={activeMode === "explore" ? topics : []}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setPortraitCamera(Boolean(id));
            if (id)
              followJourneyPosition(
                (topics.find((t) => t.id === id)!.x / 100) * 1672,
                (topics.find((t) => t.id === id)!.y / 100) * 941,
              );
            else resetJourneyCamera();
            setTopicExpanded(false);
            setShowIntroduction(false);
          }}
          showLabels={showLabels}
        />
      </div>

      {activeMode === "journey" && (
        <>
          <WaterEvaporationEffect active={journeyStep === "vapor"} />
          <WaterCondensationEffect
            active={journeyStep === "cloud" || journeyStep === "rain"}
          />
          <WaterRainEffect active={journeyStep === "rain"} />
          <WaterSnowEffect active={journeyStep === "snow"} />
          <WaterFrostEffect active={journeyStep === "snow"} />
          <div className="museum-journey-river-effects">
            <WaterRiverEffect
              active={activeMode === "journey" && journeyStep === "river"}
            />
            <WaterfallMist
              active={activeMode === "journey" && journeyStep === "river"}
            />
            <WaterMeltingEffect
              active={activeMode === "journey" && journeyStep === "river"}
            />
          </div>
          <WaterGroundwaterEffect active={journeyStep === "groundwater"} />
          <WaterPlantEffect active={journeyStep === "plant"} />
          <WaterDropletJourney
            onClose={() => {
              resetJourneyCamera();
              setActiveMode("explore");
            }}
            onStepChange={setJourneyStep}
            onMovingChange={setJourneyMoving}
            onPositionChange={followJourneyPosition}
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
          {/* Original desktop laboratory navigation — mobile uses the compact menu. */}
          <nav
            aria-label="Välj laboratorium"
            className="pointer-events-auto absolute left-1/2 top-[10px] z-[85] hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-[#102b3b]/90 p-1.5 shadow-lg backdrop-blur-xl min-[901px]:flex"
          >
            {(
              [
                ["temperature", "01 · Vattnets former"],
                ["sun", "02 · Skapa väder"],
                ["ground", "03 · Regnets väg"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveLab(id)}
                aria-current={activeLab === id ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  activeLab === id
                    ? "bg-[#20596b] text-cyan-50"
                    : "text-slate-300/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="museum-lab-global-menu pointer-events-auto hidden max-[900px]:block absolute left-[max(0.65rem,env(safe-area-inset-left))] top-[max(0.5rem,env(safe-area-inset-top))] z-[80]">
            {labMenuOpen && (
              <button
                type="button"
                aria-label="Stäng menyn"
                className="fixed inset-0 z-0 cursor-default"
                onClick={() => setLabMenuOpen(false)}
              />
            )}
            <button
              type="button"
              onClick={() => setLabMenuOpen((v) => !v)}
              aria-expanded={labMenuOpen}
              aria-controls="museum-lab-global-options"
              className="relative z-10 flex min-h-11 items-center gap-2 rounded-xl border border-teal-200/30 bg-[#071b28]/95 px-3 py-2 text-xs font-bold text-teal-100 shadow-xl backdrop-blur-xl"
            >
              ☰ Meny
            </button>
            {labMenuOpen && (
              <nav
                id="museum-lab-global-options"
                aria-label="Museets navigation"
                className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[min(260px,calc(100vw-1.5rem))] max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-2xl border border-cyan-200/25 bg-[#082332]/98 p-2 shadow-2xl backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("explore");
                    setLabMenuOpen(false);
                  }}
                  className="museum-lab-menu-item"
                >
                  ← Vattnets kretslopp
                </button>
                <Link href="/timeline" className="museum-lab-menu-item">
                  ↗ Till tidslinjen
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("journey");
                    setLabMenuOpen(false);
                  }}
                  className="museum-lab-menu-item"
                >
                  💧 Följ droppen
                </button>
                <div className="my-1 border-t border-white/10 px-3 pt-2 text-[10px] font-bold uppercase tracking-widest text-teal-300">
                  Laboratorier
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLab("temperature");
                    setLabMenuOpen(false);
                  }}
                  aria-current={
                    activeLab === "temperature" ? "page" : undefined
                  }
                  className="museum-lab-menu-item"
                >
                  01 · Vattnets former
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLab("sun");
                    setLabMenuOpen(false);
                  }}
                  aria-current={activeLab === "sun" ? "page" : undefined}
                  className="museum-lab-menu-item"
                >
                  02 · Skapa väder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLab("ground");
                    setLabMenuOpen(false);
                  }}
                  aria-current={activeLab === "ground" ? "page" : undefined}
                  className="museum-lab-menu-item"
                >
                  03 · Regnets väg
                </button>
              </nav>
            )}
          </div>
        </>
      )}

      {activeMode === "journey" && !journeyMoving && (
        <button
          type="button"
          onClick={() => setActiveMode("explore")}
          className="pointer-events-auto absolute left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex min-h-11 items-center gap-2 rounded-full border border-cyan-200/30 bg-[#071b28]/90 px-4 py-2 text-xs font-semibold text-cyan-100 shadow-xl backdrop-blur-xl"
        >
          <ArrowLeft size={15} /> Tillbaka till museet
        </button>
      )}

      {/* Top navigation */}
      <header
        className={`museum-explore-header pointer-events-none absolute inset-x-0 top-0 z-30 p-4 sm:p-6 lg:p-8 ${activeMode !== "explore" ? "hidden" : ""}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="pointer-events-auto max-w-xl">
            <Link
              href="/timeline"
              className="museum-timeline-link hidden min-[901px]:inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#071b28]/55 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition hover:bg-[#071b28]/80"
            >
              <ArrowLeft size={15} />
              Tillbaka till tidslinjen
            </Link>

            {/* Sliding introduction */}
            <div className="museum-intro-anchor relative mt-5">
              <div
                className={`origin-left transition-all duration-700 ease-in-out ${
                  showIntroduction
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-[120%] opacity-0"
                }`}
                aria-hidden={!showIntroduction}
              >
                <div className="museum-intro-card max-w-xl rounded-[24px] border border-white/15 bg-[#071b28]/35 p-5 shadow-xl backdrop-blur-md sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-200 sm:text-xs">
                    The Unfolding Universe · Interaktivt museum
                  </p>

                  <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
                    Vattnets kretslopp
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/85">
                    Tryck på de lysande symbolerna och följ vattnets resa.
                  </p>
                </div>
              </div>

              {/* Small floating tab when hidden */}
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setMobileMenuOpen(false);
                  setShowIntroduction(true);
                }}
                aria-label="Visa introduktionen"
                aria-expanded={showIntroduction}
                className={`absolute left-0 top-0 hidden min-[901px]:flex items-center gap-2 rounded-full border border-white/25 bg-[#071b28]/75 px-4 py-3 text-xs font-semibold shadow-lg backdrop-blur-xl transition-all duration-500 hover:bg-[#123b4a] ${
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
          <div className="museum-explore-nav pointer-events-auto hidden items-center gap-2 rounded-full border border-white/20 bg-[#071b28]/60 p-1.5 backdrop-blur-xl md:flex">
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

      {activeMode === "explore" && (
        <div
          className={`museum-portrait-topics pointer-events-auto absolute left-3 z-40 ${showIntroduction ? "top-[180px]" : "top-[16px]"}`}
        >
          <button
            type="button"
            aria-expanded={portraitTopicsOpen}
            aria-controls="museum-portrait-topic-options"
            onClick={() => setPortraitTopicsOpen((v) => !v)}
            className="flex min-h-11 items-center gap-2 rounded-xl border border-teal-200/30 bg-[#071b28]/95 px-4 py-2 text-xs font-bold text-teal-100 shadow-xl backdrop-blur-xl"
          >
            <Droplets size={16} /> Upptäck vattnets väg{" "}
            {portraitTopicsOpen ? "▴" : "▾"}
          </button>
          {portraitTopicsOpen && (
            <nav
              id="museum-portrait-topic-options"
              aria-label="Välj del av vattnets kretslopp"
              className="mt-2 max-h-[min(46dvh,360px)] w-[min(290px,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-teal-200/25 bg-[#071b28]/95 p-2 shadow-2xl backdrop-blur-xl"
            >
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(topic.id);
                    setTopicSheetCollapsed(false);
                    setPortraitCamera(true);
                    followJourneyPosition(
                      (topic.x / 100) * 1672,
                      (topic.y / 100) * 941,
                    );
                    setTopicExpanded(false);
                    setShowIntroduction(false);
                    setPortraitTopicsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-white hover:bg-white/10"
                  aria-current={selectedId === topic.id ? "true" : undefined}
                >
                  <topic.icon size={18} className="shrink-0 text-teal-200" />
                  <span>
                    <strong className="block">{topic.title}</strong>
                    <span className="mt-0.5 block text-[11px] text-slate-300">
                      {topic.short}
                    </span>
                  </span>
                </button>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* Selected information */}
      {activeMode === "explore" && selected && (
        <aside
          aria-live="polite"
          aria-label={`Information om ${selected.title}`}
          data-expanded={topicExpanded}
          data-collapsed={topicSheetCollapsed}
          className="museum-topic-panel absolute inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-30 max-h-[min(45dvh,380px)] overflow-y-auto rounded-[26px] border border-white/20 bg-[#071c28]/90 p-5 shadow-2xl backdrop-blur-2xl sm:inset-x-auto sm:bottom-7 sm:right-7 sm:w-[390px] sm:max-h-[65svh] sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-300/15 p-3 text-teal-200">
                <selected.icon size={23} />
              </div>

              <div>
                <p className="museum-topic-eyebrow text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300">
                  Upptäck vattnets väg
                </p>

                <div className="museum-portrait-topic-title-nav">
                  <h2 className="mt-1 font-serif text-2xl font-bold">
                    {selected.title}
                  </h2>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setPortraitCamera(false);
                resetJourneyCamera();
              }}
              aria-label="Stäng information"
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="museum-topic-portrait-controls">
            <button
              type="button"
              className="museum-topic-edge-arrow museum-topic-edge-left"
              aria-label="Föregående område"
              onClick={() => navigate(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="museum-topic-collapse"
              aria-expanded={!topicSheetCollapsed}
              onClick={() => setTopicSheetCollapsed((v) => !v)}
              aria-label={
                topicSheetCollapsed ? "Visa information" : "Dölj information"
              }
            >
              {topicSheetCollapsed ? (
                <ChevronUp size={25} strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <ChevronDown size={25} strokeWidth={2.5} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="museum-topic-edge-arrow museum-topic-edge-right"
              aria-label="Nästa område"
              onClick={() => navigate(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
          <div className="mt-5 h-px bg-white/15" />

          <p className="mt-5 text-sm leading-7 text-slate-100">
            {selected.description}
          </p>

          <p className="museum-topic-detail mt-3 text-sm leading-7 text-slate-300">
            {selected.detail}
          </p>
          <button
            type="button"
            className="museum-topic-more mt-2 text-xs font-semibold text-teal-200"
            onClick={() => setTopicExpanded((v) => !v)}
            aria-expanded={topicExpanded}
          >
            {topicExpanded ? "Visa mindre ↑" : "Läs mer ↓"}
          </button>

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
      {activeMode === "explore" && (
        <div className="museum-explore-bottom pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2 pr-16 sm:pr-0">
              {/* Mobile: switch between Explore and Journey */}
              <button
                type="button"
                onClick={() => {
                  setActiveMode("journey");
                  setSelectedId(null);
                }}
                className="hidden rounded-full border border-cyan-200/30 bg-[#071b28]/80 px-4 py-3 text-xs font-semibold text-cyan-100 backdrop-blur-xl transition hover:bg-[#123b4a]"
              >
                {"💧 Följ droppen"}
              </button>

              {/* Show or hide hotspot labels */}
              {activeMode === "explore" && (
                <button
                  type="button"
                  onClick={() => setShowLabels((value) => !value)}
                  className="hidden md:inline-flex rounded-full border border-white/20 bg-[#071b28]/70 px-4 py-3 text-xs font-semibold backdrop-blur-xl transition hover:bg-[#123b4a]"
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
              <div className="museum-explore-hint hidden rounded-full border border-white/20 bg-[#071b28]/70 px-5 py-3 text-xs text-white/85 backdrop-blur-xl sm:block">
                <span className="mr-2 text-teal-300">✦</span>
                Välj en lysande symbol för att utforska
              </div>
            )}
          </div>
        </div>
      )}
      {activeMode === "explore" && (
        <div className="museum-overview-menu absolute bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-3 z-40 md:hidden">
          {mobileMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Stäng menyn"
                className="museum-menu-dismiss fixed inset-0 z-[-1] cursor-default"
                onClick={() => setMobileMenuOpen(false)}
              />
              <nav
                aria-label="Museimenyn"
                className="museum-overview-dropdown absolute bottom-[calc(100%+0.5rem)] right-0 flex w-52 flex-col gap-1 rounded-2xl border border-white/20 bg-[#071b28]/95 p-2 shadow-2xl backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null);
                    setShowIntroduction(false);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-teal-100 hover:bg-white/10"
                >
                  ✦ Utforska
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null);
                    setShowIntroduction(true);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-white hover:bg-white/10"
                >
                  ⓘ Om utställningen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("journey");
                    setSelectedId(null);
                    setShowIntroduction(false);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-cyan-100 hover:bg-white/10"
                >
                  💧 Följ droppen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("experiment");
                    setSelectedId(null);
                    setShowIntroduction(false);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-amber-100 hover:bg-white/10"
                >
                  🔬 Experimentera
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void toggleFullscreen();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-cyan-100 hover:bg-white/10"
                >
                  {isFullscreen ? "⤢ Avsluta helskärm" : "⛶ Visa i helskärm"}
                </button>
                <Link
                  href="/timeline"
                  className="rounded-xl border-t border-white/10 px-3 py-2.5 text-left text-xs font-semibold text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ← Tillbaka till tidslinjen
                </Link>
              </nav>
            </>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen ? "Stäng museimenyn" : "Öppna museimenyn"
            }
            className="flex min-h-11 items-center rounded-full border border-amber-200/30 bg-[#071b28]/95 px-4 py-3 text-xs font-semibold text-amber-100 shadow-xl backdrop-blur-xl"
          >
            {mobileMenuOpen ? "✕ Stäng" : "☰ Meny"}
          </button>
        </div>
      )}
      {rotateTipVisible && !dismissRotateTip && (
        <div
          role="status"
          className="museum-rotate-hint pointer-events-auto absolute z-[95] items-center gap-2 rounded-xl border border-cyan-200/25 bg-[#071b28]/95 px-3 py-2 text-[11px] text-cyan-100 shadow-xl backdrop-blur-xl"
        >
          <Smartphone size={17} className="shrink-0 text-cyan-300" />
          <span className="min-w-0">
            <strong className="block font-semibold">
              Vrid mobilen för större vy
            </strong>
            <span className="block text-cyan-100/65">
              Fungerar också i stående läge
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              setDismissRotateTip(true);
              setRotateTipVisible(false);
            }}
            aria-label="Stäng tipset"
            className="ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg hover:bg-white/10"
          >
            <X size={15} />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => void toggleFullscreen()}
        aria-label={isFullscreen ? "Avsluta helskärm" : "Visa i helskärm"}
        title={isFullscreen ? "Avsluta helskärm" : "Visa i helskärm"}
        className={`pointer-events-auto absolute right-4 top-[calc(0.75rem+env(safe-area-inset-top))] z-50 hidden rounded-full border border-white/20 bg-[#071b28]/85 p-2.5 text-white shadow-lg backdrop-blur-xl hover:bg-white/15 md:block ${activeMode !== "explore" ? "!hidden" : ""}`}
      >
        {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
      </button>
    </main>
  );
}
