"use client";

import {
  useRef,
  useEffect,
  useMemo,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react";
import { getVisibleMilestoneIds } from "./timeline-zoom";
import Link from "next/link";
import Image from "next/image";
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
  Leaf,
  Maximize2,
  Minus,
  Plus,
  X,
} from "lucide-react";

// A spatial timeline: milestones move apart, but icons and text never scale.
const EARTH_X = milestones.find((m) => m.id === "earth")?.x ?? 400;
const EARTH_Y = milestones.find((m) => m.id === "earth")?.y ?? 195;
const END_X = WORLD_WIDTH - 100;
const START_ZOOM = 1.05;
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 2.5;

// Change the *distance* between events, not their size.
function spread(zoom: number) {
  return 0.65 + zoom * 1.15;
}

function positionX(x: number, zoom: number) {
  return EARTH_X + (x - EARTH_X) * spread(zoom);
}

function originalX(layoutX: number, zoom: number) {
  return EARTH_X + (layoutX - EARTH_X) / spread(zoom);
}

const branchY: Record<Category, number> = {
  earth: 195,
  life: 435,
  plants: 695,
  animals: 890,
  humans: 1080,
};

const branchTitles: Record<Category, string> = {
  earth: "JORDEN FÖRÄNDRAS",
  life: "LIVET UPPSTÅR",
  plants: "VÄXTERNAS HISTORIA",
  animals: "DJURENS HISTORIA",
  humans: "VÅR HISTORIA",
};

const branches: Category[] = ["earth", "life", "plants", "animals", "humans"];

// Branches split smoothly from their parent, then bend into a horizontal line.
// Each curve ends BEFORE its first milestone; no backwards paths or zigzags.
function branchPath(category: Category, zoom: number) {
  const y = branchY[category];
  const end = positionX(END_X, zoom);
  if (category === "earth") {
    return `M ${positionX(65, zoom)} ${y} H ${end}`;
  }

  const first = Math.min(
    ...milestones.filter((m) => m.category === category).map((m) => m.x),
  );
  const parent: Category =
    category === "life" ? "earth" : category === "humans" ? "animals" : "life";

  const parentY = branchY[parent];
  const startX = positionX(first - 380, zoom);
  const landingX = positionX(first - 100, zoom);
  const bend = (landingX - startX) * 0.75;

  return `M ${startX} ${parentY} C ${startX + bend} ${parentY} ${landingX - bend} ${y} ${landingX} ${y} H ${end}`;
}

const initialView = { x: -EARTH_X, y: -EARTH_Y, zoom: START_ZOOM };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function TimelinePage() {
  const [view, setView] = useState(initialView);
  const targetViewRef = useRef(initialView);

  // One animation loop eases the WHOLE world (lines and icons) together.
  // No competing CSS position transitions.
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      setView((current) => {
        const target = targetViewRef.current;
        const ease = 0.17;
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const dz = target.zoom - current.zoom;
        if (Math.abs(dx) + Math.abs(dy) < 0.12 && Math.abs(dz) < 0.0001) {
          return current;
        }
        return {
          x: current.x + dx * ease,
          y: current.y + dy * ease,
          zoom: current.zoom + dz * ease,
        };
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  const [selected, setSelected] = useState<Milestone | null>(null);
  const [dragging, setDragging] = useState(false);
  const worldWidth = positionX(END_X + 160, view.zoom);
  const visibleMilestoneIds = useMemo(
    () => getVisibleMilestoneIds(milestones, view.zoom, spread(view.zoom)),
    [view.zoom],
  );
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    viewX: number;
    viewY: number;
    moved: boolean;
  } | null>(null);

  const ignoreClickRef = useRef(false);

  function zoomAt(factor: number, px = 0) {
    const current = targetViewRef.current;
    const nextZoom = clamp(current.zoom * factor, MIN_ZOOM, MAX_ZOOM);
    const focusOriginalX = originalX(px - current.x, current.zoom);
    targetViewRef.current = {
      ...current,
      zoom: nextZoom,
      x: px - positionX(focusOriginalX, nextZoom),
    };
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left - rect.width / 2;
    zoomAt(Math.exp(-event.deltaY * 0.00065), px);
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
      viewX: targetViewRef.current.x,
      viewY: targetViewRef.current.y,
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

    targetViewRef.current = {
      ...targetViewRef.current,
      x: drag.viewX + dx,
      y: drag.viewY + dy,
    };
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
          {/* Explorer's Compass */}
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full sm:size-14">
            <Image
              src="/images/timeline/compass-icon.png"
              alt="En gyllene kompass omgiven av gröna blad"
              fill
              priority
              sizes="(max-width: 640px) 48px, 56px"
              className="object-cover"
            />
          </div>

          {/* Header text */}
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

        {/* Spatial world: only positions change, never the size of content. */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: worldWidth,
            height: WORLD_HEIGHT,
            transform: `translate(${view.x}px, ${view.y}px)`,
          }}
        >
          {/* Curved branches dynamically follow the milestones. */}
          <svg
            width={worldWidth}
            height={WORLD_HEIGHT}
            viewBox={`0 0 ${worldWidth} ${WORLD_HEIGHT}`}
            className="pointer-events-none absolute inset-0 overflow-visible"
            aria-hidden="true"
          >
            {branches.map((category) => {
              const d = branchPath(category, view.zoom);
              const color = palette[category].color;
              const first = Math.min(
                ...milestones
                  .filter((m) => m.category === category)
                  .map((m) => m.x),
              );
              const titleX =
                category === "earth"
                  ? positionX(80, view.zoom)
                  : positionX(first - 350, view.zoom);
              return (
                <g key={category}>
                  <path
                    d={d}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="17"
                    strokeLinecap="round"
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <text
                    x={titleX}
                    y={branchY[category] - 105}
                    fill="#625D51"
                    fontSize="21"
                    fontWeight="600"
                    letterSpacing="3"
                  >
                    {branchTitles[category]}
                  </text>
                  <circle
                    cx={positionX(END_X, view.zoom)}
                    cy={branchY[category]}
                    r="8"
                    fill={color}
                    stroke="#FFFCF6"
                    strokeWidth="3"
                  />
                  <text
                    x={positionX(END_X, view.zoom) + 17}
                    y={branchY[category] + 5}
                    fontSize="15"
                    fill="#77786C"
                  >
                    IDAG
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Each medallion has a fixed screen size. Its position moves. */}
          {milestones.map((event) => {
            const colors = palette[event.category];
            const visible = visibleMilestoneIds.has(event.id);
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => selectMilestone(event)}
                aria-label={`Läs om ${event.title}`}
                tabIndex={visible ? 0 : -1}
                aria-hidden={!visible}
                className="group absolute flex w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center transition-opacity duration-200"
                style={{
                  left: positionX(event.x, view.zoom),
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
                    style={{ backgroundColor: colors.color }}
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
            onClick={() => {
              targetViewRef.current = initialView;
            }}
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
