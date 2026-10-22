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

type MarkerProps = {
  icon: LucideIcon;
  previousIcon: LucideIcon;
  moving: boolean;
  duration: number;
};

function Marker({
  icon: Icon,
  previousIcon: PreviousIcon,
  moving,
  duration,
}: MarkerProps) {
  return (
    <foreignObject x="-25" y="-25" width="50" height="50">
      <div className="relative flex h-[50px] w-[50px] items-center justify-center">
        <div className="absolute inset-1 rounded-full border border-white/45 bg-teal-400/35 shadow-[0_0_24px_rgba(94,234,212,0.5)] backdrop-blur-md" />
        <div className="relative flex h-10 w-10 items-center justify-center text-white">
          {moving ? (
            <>
              <PreviousIcon
                size={22}
                className="water-marker-icon-out absolute"
                style={{ animationDuration: `${duration}ms` }}
              />
              <Icon
                size={22}
                className="water-marker-icon-in absolute"
                style={{ animationDuration: `${duration}ms` }}
              />
            </>
          ) : (
            <Icon size={22} />
          )}
        </div>
      </div>
    </foreignObject>
  );
}

/* ==========================================
   MAIN COMPONENT
   ========================================== */

type Props = {
  onClose: () => void;
  onStepChange: (step: JourneyStepId) => void;
};

export default function WaterDropletJourney({ onClose, onStepChange }: Props) {
  const [stepId, setStepId] = useState<JourneyStepId>("ocean");

  const [moving, setMoving] = useState(false);

  // The marker's current appearance.
  const [markerStepId, setMarkerStepId] = useState<JourneyStepId>("ocean");
  const [targetIconId, setTargetIconId] = useState<JourneyStepId>("ocean");
  const [iconDuration, setIconDuration] = useState(3500);

  // SVG elements used for animation.
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);

  // Animation lifecycle.
  const frameRef = useRef<number | null>(null);
  const movingRef = useRef(false);

  const step = journeySteps[stepId];
  const MarkerIcon = journeySteps[markerStepId].icon;
  const TargetIcon = journeySteps[targetIconId].icon;

  const cancelTravel = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    movingRef.current = false;
  }, []);

  const setMarkerPosition = useCallback((x: number, y: number) => {
    markerRef.current?.setAttribute("transform", `translate(${x} ${y})`);
  }, []);

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
    setTargetIconId(next);
    onStepChange(next);

    if (reducedMotion) {
      setMarkerPosition(destination.x, destination.y);
      setMarkerStepId(next);
      setMoving(false);
      return;
    }

    const duration = getTravelDuration(stepId, next);
    setIconDuration(duration);

    const easing = getEasing(stepId, next);

    movingRef.current = true;
    setMoving(true);

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
      }
    }

    frameRef.current = requestAnimationFrame(animate);
  }

  function reset() {
    cancelTravel();

    setStepId("ocean");
    setMarkerStepId("ocean");
    setTargetIconId("ocean");
    setMoving(false);

    setMarkerPosition(journeySteps.ocean.x, journeySteps.ocean.y);

    onStepChange("ocean");
  }

  function closeJourney() {
    cancelTravel();
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
        .water-marker-icon-out { animation: water-icon-out ease-in-out both; }
        .water-marker-icon-in { animation: water-icon-in ease-in-out both; }
        @media (prefers-reduced-motion: reduce) {
          .water-marker-icon-out { animation: none; opacity: 0; }
          .water-marker-icon-in { animation: none; opacity: 1; }
        }
      `}</style>
      {/* Image-aligned journey layer */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
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
              icon={TargetIcon}
              previousIcon={MarkerIcon}
              moving={moving}
              duration={iconDuration}
            />
          </g>
        </svg>
      </div>

      {/* Floating journey panel */}
      <aside className="pointer-events-auto absolute inset-x-3 bottom-20 z-30 max-h-[54svh] overflow-y-auto rounded-[26px] border border-cyan-200/25 bg-[#071d2c]/90 p-5 shadow-2xl backdrop-blur-2xl sm:inset-x-auto sm:bottom-7 sm:right-7 sm:w-[400px] sm:max-h-[65svh] sm:p-7">
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

        <p className="mt-4 text-sm leading-7 text-slate-200" aria-live="polite">
          {step.description}
        </p>

        <div className="mt-5 border-t border-white/15 pt-5">
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

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
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
            <MarkerIcon
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
