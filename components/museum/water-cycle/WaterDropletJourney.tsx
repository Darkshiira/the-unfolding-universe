"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WaterCycleAudio from "./WaterCycleAudio";

import {
  ArrowRight,
  Cloud,
  CloudRain,
  Droplet,
  Leaf,
  RotateCcw,
  Snowflake,
  Waves,
  Wind,
  X,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";

type JourneyStepId =
  | "ocean"
  | "vapor"
  | "cloud"
  | "rain"
  | "snow"
  | "river"
  | "groundwater"
  | "plant";

type JourneyChoice = {
  label: string;
  next: JourneyStepId;
};

type JourneyStep = {
  id: JourneyStepId;
  title: string;
  description: string;
  x: number;
  y: number;
  icon: LucideIcon;
  choices: JourneyChoice[];
};

const IMAGE_WIDTH = 1672;
const IMAGE_HEIGHT = 941;

const journeySteps: Record<JourneyStepId, JourneyStep> = {
  ocean: {
    id: "ocean",
    title: "Havet",
    description:
      "Din vattendroppe börjar i havet. Solens energi kan få vatten att avdunsta från havsytan.",
    x: 1540,
    y: 480,
    icon: Waves,
    choices: [{ label: "Avdunsta", next: "vapor" }],
  },

  vapor: {
    id: "vapor",
    title: "Vattenånga",
    description:
      "Vattnet har övergått till osynlig vattenånga. Vindar kan transportera vattenångan genom atmosfären.",
    x: 1450,
    y: 290,
    icon: Wind,
    choices: [{ label: "Kondensera", next: "cloud" }],
  },

  cloud: {
    id: "cloud",
    title: "Molnet",
    description:
      "När fuktig luft kyls kan vattenångan kondensera till små droppar. Moln kan innehålla både vattendroppar och iskristaller.",
    x: 870,
    y: 165,
    icon: Cloud,
    choices: [
      { label: "Falla som regn", next: "rain" },
      { label: "Falla som snö", next: "snow" },
    ],
  },

  rain: {
    id: "rain",
    title: "Regn",
    description:
      "Din vattendroppe har fallit från molnet och nått marken. Nu kan den rinna vidare över markytan, tränga ned i jorden eller tas upp av en växt.",
    x: 1010,
    y: 625,
    icon: CloudRain,
    choices: [
      { label: "Rinna till floden", next: "river" },
      { label: "Tränga ned i marken", next: "groundwater" },
      { label: "Tas upp av en växt", next: "plant" },
    ],
  },

  snow: {
    id: "snow",
    title: "Snö och is",
    description:
      "När temperaturen är tillräckligt låg kan vatten falla som snö och lagras i glaciärer och snötäcken. När snön och isen smälter kan vattnet rinna vidare genom bäckar och floder.",
    x: 365,
    y: 260,
    icon: Snowflake,
    choices: [
      {
        label: "Smälta och rinna vidare",
        next: "river",
      },
    ],
  },

  river: {
    id: "river",
    title: "Floden",
    description:
      "Vattnet rinner genom landskapet, ofta mot lägre höjder. Floder transporterar vatten mot sjöar och hav.",
    x: 755,
    y: 735,
    icon: Waves,
    choices: [{ label: "Fortsätt till havet", next: "ocean" }],
  },

  groundwater: {
    id: "groundwater",
    title: "Grundvatten",
    description:
      "Vattnet har trängt ned i marken. Det kan röra sig långsamt genom jord och berg innan det når en källa, en flod eller havet.",
    x: 990,
    y: 795,
    icon: Droplet,
    choices: [
      { label: "Nå floden", next: "river" },
      { label: "Nå havet", next: "ocean" },
    ],
  },

  plant: {
    id: "plant",
    title: "Växten",
    description:
      "Växtens rötter tar upp vatten från marken. Vattnet transporteras upp genom växten och en del lämnar bladen som osynlig vattenånga genom transpiration.",
    x: 1080,
    y: 680,
    icon: Leaf,
    choices: [
      {
        label: "Transpirera till atmosfären",
        next: "vapor",
      },
    ],
  },
};

/* ==========================================
   CURVED ROUTES
   Coordinates follow the landscape image.
   ========================================== */

function createRoute(from: JourneyStep, to: JourneyStep): string {
  const start = `M ${from.x} ${from.y}`;
  const end = `${to.x} ${to.y}`;

  const key = `${from.id}-${to.id}`;

  switch (key) {
    case "ocean-vapor":
      return `${start}
        C 1545 415, 1480 375, ${end}`;

    case "vapor-cloud":
      return `${start}
        C 1350 240, 1190 150, 1090 205
        S 940 150, ${end}`;

    case "cloud-rain":
      return `${start}
    C 885 295, 925 445, ${end}`;

    case "cloud-snow":
      return `${start}
    C 810 145, 745 120, 675 125
    S 555 140, 500 155
    S 420 180, 395 205
    S 375 240, ${end}`;

    case "snow-river":
      return `${start}
    C 375 270, 390 295, 395 330
    C 405 370, 425 405, 460 430
    C 490 455, 520 465, 550 475
    C 610 480, 660 495, 710 505
    C 745 510, 770 510, 790 510
    C 805 510, 800 535, 780 545
    C 755 560, 755 590, 755 620
    C 755 650, 700 660, 635 670
    C 580 680, 545 680, 540 705
    C 535 735, 565 770, 615 790
    C 665 810, 715 775, ${end}`;

    case "rain-river":
      return `${start}
    C 1000 660, 955 690, 915 700
    S 840 730, 800 725
    S 770 730, ${end}`;

    case "rain-groundwater":
      return `${start}
    C 1015 665, 1000 705, 1005 735
    S 995 775, ${end}`;

    case "rain-plant":
      return `${start}
    C 1040 630, 1070 650, 1085 665
    S 1080 675, ${end}`;

    case "groundwater-river":
      return `${start}
    C 950 805, 875 825, 815 800
    S 765 770, ${end}`;

    case "groundwater-ocean":
      return `${start}
    C 1100 830, 1250 790, 1360 680
    S 1480 550, ${end}`;

    case "plant-vapor":
      return `${start}
    C 1090 600, 1070 500, 1110 420
    S 1250 310, 1330 305
    S 1420 290, ${end}`;

    case "river-ocean":
      return `${start}
    C 800 735, 840 755, 860 805
    S 930 870, 1000 830
    S 1120 760, 1210 720
    S 1320 650, 1390 600
    S 1500 520, ${end}`;

    default: {
      const middleX = (from.x + to.x) / 2;
      const middleY = (from.y + to.y) / 2 - 65;

      return `${start}
        Q ${middleX} ${middleY}, ${end}`;
    }
  }
}

/* ==========================================
   ANIMATION SETTINGS
   ========================================== */

function getTravelDuration(from: JourneyStepId, to: JourneyStepId): number {
  const key = `${from}-${to}`;

  switch (key) {
    case "ocean-vapor":
      return 3800;

    case "vapor-cloud":
      return 5200;

    case "cloud-rain":
      return 2200;

    case "cloud-snow":
      return 7500;

    case "snow-river":
      return 8500;

    case "river-ocean":
      return 6800;

    case "rain-river":
      return 4500;

    case "rain-groundwater":
      return 6500;

    case "plant-vapor":
      return 5000;

    case "rain-plant":
      return 3000;

    default:
      return 3500;
  }
}

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeInCubic(t: number): number {
  return t * t * t;
}

function easeLinear(t: number): number {
  return t;
}

function getEasing(
  from: JourneyStepId,
  to: JourneyStepId,
): (t: number) => number {
  // Rain accelerates as it falls.
  if (from === "cloud" && to === "rain") {
    return easeInCubic;
  }

  // Flowing water moves continuously downstream.
  if (
    (from === "rain" && to === "river") ||
    (from === "snow" && to === "river") ||
    (from === "river" && to === "ocean")
  ) {
    return easeLinear;
  }

  // Gentle acceleration and deceleration elsewhere.
  return easeInOutSine;
}

/* ==========================================
   TRAVELING MARKER
   ========================================== */

// Native SVG artwork stays visible inside the journey SVG even when the
// portrait camera pans. SVG foreignObject can disappear in mobile browsers.
function MarkerGlyph({ id }: { id: JourneyStepId }) {
  const common = {
    fill: "none",
    stroke: "#ffffff",
    strokeWidth: 2.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (id === "ocean" || id === "river")
    return (
      <g {...common}>
        <path d="M-13 -6 Q-7 -12 -1 -6 T11 -6" />
        <path d="M-13 2 Q-7 -4 -1 2 T11 2" />
        <path d="M-13 10 Q-7 4 -1 10 T11 10" />
      </g>
    );
  if (id === "cloud")
    return (
      <path
        {...common}
        d="M-11 8 H10 A7 7 0 0 0 10 -6 A10 10 0 0 0 -8 -3 A6 6 0 0 0 -11 8 Z"
      />
    );
  if (id === "rain")
    return (
      <g {...common}>
        <path d="M-11 2 H10 A7 7 0 0 0 10 -11 A10 10 0 0 0 -8 -8 A6 6 0 0 0 -11 2 Z" />
        <path d="M-7 8 l-2 5 M1 8 l-2 5 M9 8 l-2 5" />
      </g>
    );
  if (id === "snow")
    return (
      <g {...common}>
        <path d="M-13 0 H13 M0 -13 V13 M-9 -9 L9 9 M-9 9 L9 -9" />
      </g>
    );
  if (id === "vapor")
    return (
      <g {...common}>
        <path d="M-12 -6 Q-6 -12 0 -6 T12 -6 M-12 2 Q-6 -4 0 2 T12 2 M-12 10 Q-6 4 0 10 T12 10" />
      </g>
    );
  if (id === "plant")
    return (
      <g {...common}>
        <path d="M-2 13 V-5 M-2 3 Q-14 1 -12 -10 Q0 -10 -2 3 M-2 -3 Q10 -14 13 -7 Q13 5 -2 6" />
      </g>
    );
  return (
    <path
      {...common}
      d="M0 -14 C-5 -6 -12 2 -12 7 A12 12 0 0 0 12 7 C12 2 5 -6 0 -14 Z"
    />
  );
}

function Marker({
  id,
  nextId,
  duration,
}: {
  id: JourneyStepId;
  nextId?: JourneyStepId;
  duration?: number;
}) {
  return (
    <g aria-hidden="true">
      <circle
        r="25"
        fill="#103b4a"
        fillOpacity="0.88"
        stroke="#b5f6f2"
        strokeWidth="1.5"
      />
      <circle r="21" fill="#2dd4bf" fillOpacity="0.3" />
      {nextId && nextId !== id ? (
        <>
          <g
            className="museum-marker-glyph-leaving"
            style={{ animationDuration: `${duration ?? 1600}ms` }}
          >
            <MarkerGlyph id={id} />
          </g>
          <g
            className="museum-marker-glyph-arriving"
            style={{ animationDuration: `${duration ?? 1600}ms` }}
          >
            <MarkerGlyph id={nextId} />
          </g>
        </>
      ) : (
        <MarkerGlyph id={id} />
      )}
    </g>
  );
}

/* ==========================================
   MAIN COMPONENT
   ========================================== */

type Props = {
  onClose: () => void;
  onStepChange: (step: JourneyStepId) => void;
  onMovingChange?: (moving: boolean) => void;
  onPositionChange?: (x: number, y: number) => void;
};

export default function WaterDropletJourney({
  onClose,
  onStepChange,
  onMovingChange,
  onPositionChange,
}: Props) {
  const [stepId, setStepId] = useState<JourneyStepId>("ocean");

  const [moving, setMoving] = useState(false);
  const [sheetCollapsed, setSheetCollapsed] = useState(false);

  // The marker's current appearance.
  const [markerStepId, setMarkerStepId] = useState<JourneyStepId>("ocean");
  const [markerTransitionDuration, setMarkerTransitionDuration] =
    useState(1600);

  // SVG elements used for animation.
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);

  // Animation lifecycle.
  const frameRef = useRef<number | null>(null);
  const movingRef = useRef(false);

  const step = journeySteps[stepId];

  const cancelTravel = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    movingRef.current = false;
  }, []);

  const setMarkerPosition = useCallback(
    (x: number, y: number) => {
      markerRef.current?.setAttribute("transform", `translate(${x} ${y})`);
      onPositionChange?.(x, y);
    },
    [onPositionChange],
  );

  // Set the initial marker position and cancel
  // any animation when the component unmounts.
  useEffect(() => {
    setMarkerPosition(journeySteps.ocean.x, journeySteps.ocean.y);

    return () => {
      cancelTravel();
    };
  }, [cancelTravel, setMarkerPosition]);

  function travel(next: JourneyStepId) {
    if (movingRef.current) return;

    const from = journeySteps[stepId];
    const destination = journeySteps[next];

    const path = pathRef.current;
    const marker = markerRef.current;

    if (!path || !marker) return;

    cancelTravel();

    const route = createRoute(from, destination);

    // Set the route directly on the SVG path.
    path.setAttribute("d", route);

    const totalLength = path.getTotalLength();

    if (totalLength <= 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // The information panel updates immediately,
    // but the marker retains its original icon
    // until it reaches the destination.
    setStepId(next);
    setSheetCollapsed(false);
    onStepChange(next);

    if (reducedMotion) {
      setMarkerPosition(destination.x, destination.y);
      setMarkerStepId(next);
      setMoving(false);
      onMovingChange?.(false);
      return;
    }

    const duration = getTravelDuration(stepId, next);
    setMarkerTransitionDuration(duration);

    const easing = getEasing(stepId, next);

    movingRef.current = true;
    setMoving(true);
    onMovingChange?.(true);

    let startTime: number | null = null;

    // Start exactly at the beginning of the path.
    const startPoint = path.getPointAtLength(0);

    setMarkerPosition(startPoint.x, startPoint.y);

    function animate(now: number) {
      if (!movingRef.current) return;

      if (startTime === null) {
        startTime = now;
      }
      const elapsed = now - startTime;

      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easing(progress);

      const distance = totalLength * easedProgress;

      const point = path!.getPointAtLength(distance);

      setMarkerPosition(point.x, point.y);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        frameRef.current = null;
        movingRef.current = false;

        setMarkerPosition(destination.x, destination.y);

        setMarkerStepId(next);
        setMoving(false);
        onMovingChange?.(false);
      }
    }

    frameRef.current = requestAnimationFrame(animate);
  }

  function reset() {
    cancelTravel();

    setStepId("ocean");
    setMarkerStepId("ocean");
    setMoving(false);
    onMovingChange?.(false);

    setMarkerPosition(journeySteps.ocean.x, journeySteps.ocean.y);

    onStepChange("ocean");
  }

  function closeJourney() {
    cancelTravel();
    onMovingChange?.(false);
    onClose();
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <style>{`
        @keyframes water-icon-out {
          0%, 25% { opacity: 1; transform: scale(1) rotate(0deg); }
          65%, 100% { opacity: 0; transform: scale(.7) rotate(-18deg); }
        }
        @keyframes water-icon-in {
          0%, 25% { opacity: 0; transform: scale(.7) rotate(18deg); }
          65%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes museum-marker-leave {
          0%, 36% { opacity: 1; }
          64%, 100% { opacity: 0; }
        }
        @keyframes museum-marker-arrive {
          0%, 36% { opacity: 0; }
          64%, 100% { opacity: 1; }
        }
        .museum-marker-glyph-leaving { animation: museum-marker-leave ease-in-out both; }
        .museum-marker-glyph-arriving { animation: museum-marker-arrive ease-in-out both; }
        .water-marker-icon-out { animation: water-icon-out ease-in-out both; }
        .water-marker-icon-in { animation: water-icon-in ease-in-out both; }
        @media (prefers-reduced-motion: reduce) {
          .museum-marker-glyph-leaving { animation: none; opacity: 0; }
          .museum-marker-glyph-arriving { animation: none; opacity: 1; }
          .water-marker-icon-out { animation: none; opacity: 0; }
          .water-marker-icon-in { animation: none; opacity: 1; }
        }
      `}</style>
      {/* Image-aligned journey layer */}
      <div
        className="museum-camera-marker pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox={`0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          {/* Invisible path used for calculations */}
          <path ref={pathRef} d="" fill="none" stroke="none" />

          {/* Marker moves independently of React renders */}
          <g
            ref={markerRef}
            transform={`translate(${journeySteps.ocean.x} ${journeySteps.ocean.y})`}
          >
            <Marker
              id={markerStepId}
              nextId={moving ? stepId : undefined}
              duration={markerTransitionDuration}
            />
          </g>
        </svg>
      </div>

      {/* Floating journey panel */}
      <aside
        data-moving={moving}
        data-collapsed={sheetCollapsed}
        className="museum-journey-panel pointer-events-auto absolute inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-30 max-h-[min(48dvh,420px)] overflow-y-auto overscroll-contain rounded-[22px] border border-cyan-200/25 bg-[#071d2c]/95 p-4 shadow-2xl backdrop-blur-2xl md:inset-x-auto md:bottom-7 md:right-7 md:w-[400px] md:max-h-[65dvh] md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Interaktiv resa
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold">{step.title}</h2>
          </div>

          <button
            type="button"
            onClick={closeJourney}
            aria-label="Avsluta resan"
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <button
          type="button"
          className="museum-journey-collapse"
          aria-expanded={!sheetCollapsed}
          onClick={() => setSheetCollapsed((v) => !v)}
          aria-label={sheetCollapsed ? "Visa information" : "Dölj information"}
        >
          {sheetCollapsed ? (
            <ChevronUp size={25} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <ChevronDown size={25} strokeWidth={2.5} aria-hidden="true" />
          )}
        </button>
        <p
          className="museum-journey-travel-indicator"
          role="status"
          aria-live="polite"
        >
          Vattnet rör sig genom landskapet…
        </p>
        <p
          className="museum-journey-description mt-4 text-sm leading-7 text-slate-200 [@media(orientation:landscape)_and_(max-height:550px)]:mt-1 [@media(orientation:landscape)_and_(max-height:550px)]:text-xs [@media(orientation:landscape)_and_(max-height:550px)]:leading-5"
          aria-live="polite"
        >
          {step.description}
        </p>

        <div className="museum-journey-choices mt-5 border-t border-white/15 pt-5 [@media(orientation:landscape)_and_(max-height:550px)]:mt-2 [@media(orientation:landscape)_and_(max-height:550px)]:pt-2">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-cyan-300">
            Vart ska vattnet ta vägen?
          </p>

          <div className="flex flex-col gap-2">
            {step.choices.map((choice) => (
              <button
                key={choice.next}
                type="button"
                onClick={() => travel(choice.next)}
                disabled={moving}
                className="flex items-center justify-between rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-left text-sm font-semibold transition hover:border-cyan-300/50 hover:bg-cyan-300/15 disabled:cursor-wait disabled:opacity-50"
              >
                {choice.label}
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        </div>

        <div className="museum-journey-footer mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4 [@media(orientation:landscape)_and_(max-height:550px)]:mt-2 [@media(orientation:landscape)_and_(max-height:550px)]:pt-2">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white"
          >
            <RotateCcw size={15} />
            Börja om
          </button>

          <WaterCycleAudio active step={stepId} />

          <span className="hidden items-center gap-2 text-xs text-cyan-200 sm:flex">
            <Droplet
              size={20}
              strokeWidth={1.8}
              className="text-white drop-shadow"
            />
            Följ vattnet
          </span>
        </div>
      </aside>
    </div>
  );
}
