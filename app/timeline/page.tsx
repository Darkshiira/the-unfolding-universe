"use client";

import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import Link from "next/link";
import {
  milestones,
  palette,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  type Category,
  type Milestone,
} from "./timeline-data";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Leaf,
  Maximize2,
  Minus,
  Plus,
  X,
} from "lucide-react";

const paths: {
  id: Category;
  d: string;
  title: string;
  x: number;
  y: number;
}[] = [
  {
    id: "earth",
    d: "M 65 195 H 6000",
    title: "JORDEN FÖRÄNDRAS",
    x: 80,
    y: 120,
  },
  {
    id: "life",
    d: "M 850 195 C 1020 195 1050 435 1300 435 H 6000",
    title: "LIVET UPPSTÅR",
    x: 1240,
    y: 365,
  },
  {
    id: "plants",
    d: "M 3450 435 C 3600 435 3510 695 3700 695 H 6000",
    title: "VÄXTERNAS HISTORIA",
    x: 3740,
    y: 630,
  },
  {
    id: "animals",
    d: "M 3200 435 C 3370 435 3300 890 3450 890 H 6000",
    title: "DJURENS HISTORIA",
    x: 3500,
    y: 830,
  },
  {
    id: "humans",
    d: "M 4650 890 C 4780 890 4660 1080 4750 1080 H 6000",
    title: "VÅR HISTORIA",
    x: 4800,
    y: 1010,
  },
];

const initialView = {
  // Starta med "Jorden föds" mitt i bilden.
  // (Världens mitt: 1250, 580; jordens position: 170, 195.)
  x: (WORLD_WIDTH / 2 - 170) * 1.05,
  y: (WORLD_HEIGHT / 2 - 195) * 1.05,
  zoom: 1.05,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function TimelinePage() {
  const [view, setView] = useState(initialView);
  const [selected, setSelected] = useState<Milestone | null>(null);
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    viewX: number;
    viewY: number;
    moved: boolean;
  } | null>(null);

  const ignoreClickRef = useRef(false);

  function zoomAt(factor: number, px = 0, py = 0) {
    setView((current) => {
      const nextZoom = clamp(current.zoom * factor, 0.35, 2.5);

      const ratio = nextZoom / current.zoom;

      return {
        zoom: nextZoom,
        x: px - (px - current.x) * ratio,
        y: py - (py - current.y) * ratio,
      };
    });
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    const px = event.clientX - rect.left - rect.width / 2;

    const py = event.clientY - rect.top - rect.height / 2;

    zoomAt(Math.exp(-event.deltaY * 0.001), px, py);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    // Let interactive controls receive their own clicks.
    if ((event.target as Element).closest("button, a")) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      viewX: view.x,
      viewY: view.y,
      moved: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (Math.abs(dx) + Math.abs(dy) > 5) {
      drag.moved = true;
      setDragging(true);
    }

    if (!drag.moved) return;

    setView((current) => ({
      ...current,
      x: drag.viewX + dx,
      y: drag.viewY + dy,
    }));
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    ignoreClickRef.current = drag.moved;
    dragRef.current = null;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function selectMilestone(event: Milestone) {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }

    setSelected(event);
  }

  return (
    <main className="timeline-page-enter relative flex h-svh flex-col overflow-hidden bg-[#F8F5EE] text-[#343E35]">
      {/* Museum-style header */}
      <header className="relative z-30 flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-[#DDD8CD] bg-[#FBF9F3]/95 px-5 py-4 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-full border border-[#D8D0BF] bg-[#F1E9D9]">
            <Compass size={22} strokeWidth={1.3} className="text-[#9C8061]" />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#9B8972]">
              Hur allt började
            </p>

            <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#34473C] sm:text-2xl">
              Jordens historia
            </h1>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#DCD4C6] px-4 py-2.5 text-xs font-semibold text-[#6C7066] transition-colors hover:bg-[#EFE8DB]"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Tillbaka till universum</span>
          <span className="sm:hidden">Tillbaka</span>
        </Link>
      </header>

      {/* Intro strip */}
      <div className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#E5DFD3] bg-[#F5F0E6] px-5 py-3 sm:px-10">
        <div className="flex items-center gap-3">
          <BookOpen size={17} className="text-[#9D896D]" strokeWidth={1.5} />

          <p className="text-xs leading-relaxed text-[#77786C]">
            En illustrerad resa genom jordens fantastiska historia.
          </p>
        </div>

        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A29480] md:block">
          Dra för att utforska · Scrolla för att zooma
        </span>
      </div>

      {/* Timeline viewport */}
      <div
        className={`relative min-h-0 flex-1 overflow-hidden touch-none select-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Subtle paper background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(#B8B1A3 0.7px, transparent 0.7px)",
            backgroundSize: "28px 28px",
            opacity: 0.17,
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(212,197,171,0.18))]" />

        {/* Large pannable world */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            transform: `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Curved evolutionary branches */}
          <svg
            width={WORLD_WIDTH}
            height={WORLD_HEIGHT}
            viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
            className="pointer-events-none absolute inset-0 overflow-visible"
            aria-hidden="true"
          >
            {paths.map((path) => {
              const color = palette[path.id].color;

              return (
                <g key={path.id}>
                  {/* Pale outer edge */}
                  <path
                    d={path.d}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="17"
                    strokeLinecap="round"
                  />

                  {/* Colored branch */}
                  <path
                    d={path.d}
                    fill="none"
                    stroke={color}
                    strokeWidth="9"
                    strokeLinecap="round"
                  />

                  {/* Fine central highlight */}
                  <path
                    d={path.d}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.7"
                  />

                  <text
                    x={path.x}
                    y={path.y}
                    fill="#625D51"
                    fontSize="23"
                    fontWeight="600"
                    letterSpacing="4"
                  >
                    {path.title}
                  </text>
                </g>
              );
            })}

            {/* Alla fem grenar fortsätter till nutid. */}
            {paths.map((path) => {
              const y =
                path.id === "earth"
                  ? 195
                  : path.id === "life"
                    ? 435
                    : path.id === "plants"
                      ? 695
                      : path.id === "animals"
                        ? 890
                        : 1080;
              return (
                <g key={`${path.id}-today`}>
                  <circle
                    cx="6000"
                    cy={y}
                    r="10"
                    fill={palette[path.id].color}
                    stroke="#FFFCF6"
                    strokeWidth="4"
                  />
                  <text x="6018" y={y + 6} fontSize="16" fill="#77786C">
                    IDAG
                  </text>
                </g>
              );
            })}

            {/* Subtle botanical decoration */}
            <g fill="none" stroke="#A5B394" strokeWidth="2" opacity="0.5">
              <path d="M 2050 570 Q 2070 535 2080 505" />
              <path d="M 2070 535 Q 2040 510 2038 490 Q 2070 496 2070 535" />
              <path d="M 2075 525 Q 2105 505 2115 480 Q 2085 483 2075 525" />
              <path d="M 2080 505 Q 2055 477 2057 459 Q 2080 470 2080 505" />
            </g>
          </svg>

          {/* Event medallions */}
          {milestones.map((event) => {
            const colors = palette[event.category];

            // Minor discoveries become visible when
            // visitors zoom closer.
            const visible = event.major || view.zoom >= 0.85;

            return (
              <button
                key={event.id}
                type="button"
                onClick={() => selectMilestone(event)}
                aria-label={`Läs om ${event.title}`}
                className="group absolute flex w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center transition-opacity duration-300"
                style={{
                  left: event.x,
                  top: event.y,
                  opacity: visible ? 1 : 0,
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <div
                  className="relative flex size-[92px] items-center justify-center rounded-full border-[5px] border-[#FBF9F3] shadow-[0_5px_20px_rgba(80,64,44,0.14)] transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: colors.light,
                    outline: `2px solid ${colors.color}`,
                  }}
                >
                  <span className="text-[43px]" aria-hidden="true">
                    {event.symbol}
                  </span>

                  <span
                    className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rounded-full border-[3px] border-[#FBF9F3]"
                    style={{
                      backgroundColor: colors.color,
                    }}
                  />
                </div>

                <span className="mt-5 rounded-md bg-[#F8F5EE]/90 px-2 py-1 text-[16px] font-bold leading-snug text-[#3E463D]">
                  {event.title}
                </span>

                <span className="mt-1 max-w-[180px] rounded-md bg-[#F8F5EE]/90 px-2 py-1 text-[12px] font-medium text-[#8D8171]">
                  {event.date}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating museum legend */}
        <div className="absolute bottom-5 left-4 z-10 hidden rounded-2xl border border-[#DED7CA] bg-[#FFFCF6]/95 p-5 shadow-[0_12px_35px_rgba(75,60,43,0.08)] backdrop-blur-sm lg:block">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9D8A71]">
            Utforska grenarna
          </p>

          <div className="space-y-3">
            {(Object.keys(palette) as Category[]).map((category) => (
              <div key={category} className="flex items-center gap-3">
                <span
                  className="h-[5px] w-8 rounded-full"
                  style={{
                    backgroundColor: palette[category].color,
                  }}
                />

                <span className="text-xs font-medium text-[#696B60]">
                  {palette[category].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-5 right-4 z-10 flex items-center gap-2 rounded-2xl border border-[#DED7CA] bg-[#FFFCF6]/95 p-2 shadow-[0_12px_35px_rgba(75,60,43,0.08)] backdrop-blur-sm sm:bottom-7 sm:right-7">
          <button
            type="button"
            onClick={() => zoomAt(1 / 1.25)}
            aria-label="Zooma ut"
            className="rounded-xl p-3 text-[#6F7769] transition-colors hover:bg-[#EEE9DE]"
          >
            <Minus size={19} />
          </button>

          <span className="min-w-12 text-center text-xs font-bold tabular-nums text-[#696C60]">
            {Math.round(view.zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={() => zoomAt(1.25)}
            aria-label="Zooma in"
            className="rounded-xl p-3 text-[#6F7769] transition-colors hover:bg-[#EEE9DE]"
          >
            <Plus size={19} />
          </button>

          <div className="mx-1 h-6 w-px bg-[#E2DBCE]" />

          <button
            type="button"
            onClick={() => setView(initialView)}
            aria-label="Återställ tidslinjens vy"
            className="rounded-xl p-3 text-[#6F7769] transition-colors hover:bg-[#EEE9DE]"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-t border-[#E2DBCE] bg-[#FBF9F3] px-5 py-3 sm:px-10">
        <div className="flex items-center gap-2 text-[#938777]">
          <Leaf size={14} strokeWidth={1.5} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
            En interaktiv resa genom naturens historia
          </span>
        </div>

        <span className="hidden text-[10px] text-[#A49A8C] sm:block">
          En resa genom miljarder år
        </span>
      </footer>

      {/* Museum information panel */}
      {selected && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-[#332D24]/20 p-3 backdrop-blur-[2px] sm:items-center sm:p-6">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-title"
            className="relative w-full max-w-lg overflow-hidden rounded-[26px] border border-[#DED6C8] bg-[#FFFCF6] shadow-[0_30px_90px_rgba(53,43,30,0.2)]"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Stäng informationsrutan"
              className="absolute right-5 top-5 z-10 rounded-full border border-[#E4DCCE] bg-[#FFFCF6] p-2 text-[#726D61] transition-colors hover:bg-[#F0E8DA]"
            >
              <X size={19} />
            </button>

            <div
              className="flex h-48 items-center justify-center"
              style={{
                backgroundColor: palette[selected.category].light,
              }}
            >
              <span className="text-[100px]" aria-hidden="true">
                {selected.symbol}
              </span>
            </div>

            <div className="p-7 sm:p-9">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{
                  color: palette[selected.category].color,
                }}
              >
                {selected.date}
              </p>

              <h2
                id="event-title"
                className="mt-3 text-3xl font-semibold tracking-tight text-[#35463B]"
              >
                {selected.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#6C7066]">
                {selected.description}
              </p>

              <div className="mt-7 rounded-xl border border-[#E6DDCD] bg-[#F6F0E5] p-5">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold text-[#7B8D6A]">
                  <Leaf size={15} />
                  Visste du att?
                </p>

                <p className="text-sm leading-6 text-[#686B60]">
                  {selected.fact}
                </p>
              </div>

              <Link
                href={`/timeline/${selected.id}`}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#657D69] transition-colors hover:text-[#344F3B]"
              >
                Fortsätt utforska
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
