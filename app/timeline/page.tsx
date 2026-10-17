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
import { geologicalBoundaries, getMilestoneEra } from "./timeline-eras";
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
  Search,
  Map,
  Layers3,
  Leaf,
  Maximize2,
  Minus,
  Plus,
  X,
} from "lucide-react";

// A spatial timeline: milestones move apart, but icons and text never scale.
const EARTH_X = milestones.find((m) => m.id === "earth")?.x ?? 400;
const EARTH_Y = milestones.find((m) => m.id === "earth")?.y ?? 195;
const END_X = 8600;
const START_ZOOM = 1.05;
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 4;

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
  const [activeBranch, setActiveBranch] = useState<Category | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showEras, setShowEras] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [viewportSize, setViewportSize] = useState({ width: 900, height: 600 });
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry)
        setViewportSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("sv");
    if (!needle) return [];
    return milestones
      .filter((m) =>
        [m.title, m.description, m.date, m.fact].some((text) =>
          text.toLocaleLowerCase("sv").includes(needle),
        ),
      )
      .slice(0, 8);
  }, [query]);

  function travelTo(milestone: Milestone) {
    const current = targetViewRef.current;
    const zoom = Math.max(current.zoom, 1.3);
    targetViewRef.current = {
      x: -positionX(milestone.x, zoom),
      y: -milestone.y,
      zoom,
    };
    setSearchOpen(false);
    setQuery("");
    setSelected(milestone);
  }

  function travelToBranch(category: Category) {
    setActiveBranch((previous) => (previous === category ? null : category));
    const first = milestones
      .filter((m) => m.category === category)
      .reduce(
        (earliest, item) =>
          !earliest || item.x < earliest.x ? item : earliest,
        null as Milestone | null,
      );
    if (!first) return;
    const current = targetViewRef.current;
    targetViewRef.current = {
      ...current,
      x: -positionX(first.x, current.zoom),
      y: -branchY[category],
    };
  }

  function travelFromMap(normalizedX: number, normalizedY: number) {
    const current = targetViewRef.current;
    const x = 100 + clamp(normalizedX, 0, 1) * (END_X - 100);
    const y = clamp(normalizedY, 0, 1) * WORLD_HEIGHT;
    targetViewRef.current = {
      ...current,
      x: -positionX(x, current.zoom),
      y: -y,
    };
  }
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
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-[#D8D0BF] bg-[#F1E9D9] sm:size-14">
            <Image
              src="/images/explorers-compass.png"
              alt="Gyllene kompass med gröna blad"
              fill
              priority
              sizes="(max-width: 640px) 48px, 56px"
              className="object-cover"
            />
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Sök milstolpar"
            className="flex items-center gap-2 rounded-full border border-[#DDD4C6] px-3 py-2 text-xs font-semibold text-[#66766B] hover:bg-white"
          >
            <Search size={15} /> <span className="hidden sm:inline">Sök</span>
          </button>
          <button
            type="button"
            onClick={() => setShowEras((v) => !v)}
            aria-pressed={showEras}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${showEras ? "border-[#839B70] bg-[#E5EDDD] text-[#48634D]" : "border-[#DDD4C6] text-[#66766B] hover:bg-white"}`}
          >
            <Layers3 size={15} />{" "}
            <span className="hidden sm:inline">Geologiska tider</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            aria-pressed={showMap}
            className="flex items-center gap-2 rounded-full border border-[#DDD4C6] px-3 py-2 text-xs font-semibold text-[#66766B] hover:bg-white"
          >
            <Map size={15} />{" "}
            <span className="hidden sm:inline">Översiktskarta</span>
          </button>
        </div>
      </div>

      {/* Branch navigation on smaller screens */}
      <div className="relative z-20 flex shrink-0 gap-2 overflow-x-auto border-b border-[#E5DFD3] bg-[#FBF9F3] px-4 py-2 lg:hidden">
        {branches.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => travelToBranch(category)}
            aria-pressed={activeBranch === category}
            className={`shrink-0 rounded-full border px-3 py-2 text-[11px] font-semibold ${
              activeBranch === category
                ? "border-[#839B70] bg-[#E5EDDD] text-[#34473C]"
                : "border-[#DED7CA] text-[#696B60]"
            }`}
          >
            {palette[category].label}
          </button>
        ))}
        {activeBranch && (
          <button
            type="button"
            onClick={() => setActiveBranch(null)}
            className="shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold text-[#657D69]"
          >
            Visa alla
          </button>
        )}
      </div>

      {/* Timeline viewport */}
      <div
        ref={viewportRef}
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
          {/* Geological periods fill the ENTIRE world height and expand with zoom. */}
          {showEras && (
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden="true"
            >
              {geologicalBoundaries().map((era) => {
                const left = positionX(era.startX, view.zoom);
                const right = positionX(era.endX, view.zoom);
                return (
                  <div
                    key={era.name}
                    className="absolute top-0 h-full border-l border-white/50"
                    style={{
                      left,
                      width: Math.max(0, right - left),
                      background: `linear-gradient(90deg, ${era.color}B8, ${era.color}8A 85%, ${era.color}B8)`,
                    }}
                  />
                );
              })}
            </div>
          )}

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
              return (
                <g
                  key={category}
                  opacity={activeBranch && activeBranch !== category ? 0.16 : 1}
                >
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

          {/* Branch headings sit above their branch origins, outside milestone cards. */}
          {branches.map((category) => {
            const first = Math.min(
              ...milestones
                .filter((m) => m.category === category)
                .map((m) => m.x),
            );
            const headingX = category === "earth" ? 65 : first - 420;
            return (
              <div
                key={`heading-${category}`}
                className="pointer-events-none absolute whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.22em] sm:text-[16px]"
                style={{
                  left: positionX(headingX, view.zoom),
                  top: branchY[category] - 145,
                  color: palette[category].color,
                  opacity:
                    activeBranch && activeBranch !== category ? 0.18 : 0.95,
                }}
              >
                {branchTitles[category]}
              </div>
            );
          })}

          {/* Each medallion has a fixed screen size. Its position moves. */}
          {milestones.map((event) => {
            const colors = palette[event.category];
            const visible = visibleMilestoneIds.has(event.id);
            const dimmed =
              activeBranch !== null && activeBranch !== event.category;
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
                  opacity: visible ? (dimmed ? 0.12 : 1) : 0,
                  pointerEvents: visible && !dimmed ? "auto" : "none",
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

        {/* Geological period labels stay visible while panning vertically. */}
        {showEras && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-11 overflow-hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(248,245,238,.9), transparent)",
            }}
          >
            {geologicalBoundaries().map((era) => {
              const left =
                viewportSize.width / 2 +
                view.x +
                positionX(era.startX, view.zoom);
              const right =
                viewportSize.width / 2 +
                view.x +
                positionX(era.endX, view.zoom);
              if (right < 0 || left > viewportSize.width) return null;
              const clippedLeft = Math.max(0, left);
              const clippedRight = Math.min(viewportSize.width, right);
              return (
                <span
                  key={era.name}
                  className="absolute top-3 overflow-hidden whitespace-nowrap text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#766E61]"
                  style={{
                    left: clippedLeft,
                    width: Math.max(0, clippedRight - clippedLeft),
                  }}
                >
                  {era.name}
                </span>
              );
            })}
          </div>
        )}

        {/* Clickable museum legend */}
        <div className="absolute bottom-5 left-4 z-10 hidden rounded-2xl border border-[#DED7CA] bg-[#FFFCF6]/95 p-4 shadow-[0_12px_35px_rgba(75,60,43,0.08)] backdrop-blur-sm lg:block">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9D8A71]">
            Utforska grenarna
          </p>
          <div className="space-y-1">
            {branches.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={activeBranch === category}
                onClick={() => travelToBranch(category)}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-xs font-medium transition-colors hover:bg-[#F0E9DC] ${activeBranch === category ? "bg-[#EEE8DA] text-[#34473C]" : "text-[#696B60]"}`}
              >
                <span
                  className="h-[5px] w-8 shrink-0 rounded-full"
                  style={{ backgroundColor: palette[category].color }}
                />
                {palette[category].label}
              </button>
            ))}
          </div>
          {activeBranch && (
            <button
              type="button"
              onClick={() => setActiveBranch(null)}
              className="mt-3 text-xs font-semibold text-[#718363]"
            >
              Visa alla grenar
            </button>
          )}
        </div>

        {/* Search results: interactive overlay above viewport */}
        {searchOpen && (
          <div
            className="absolute left-1/2 top-4 z-30 w-[min(94vw,480px)] -translate-x-1/2 rounded-2xl border border-[#DDD4C6] bg-[#FFFCF6] p-4 shadow-xl"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Search size={19} className="text-[#839B70]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök dinosaurier, hav, syre..."
                aria-label="Sök milstolpar"
                className="min-w-0 flex-1 bg-transparent p-2 text-sm outline-none placeholder:text-[#A49A8C]"
              />
              <button
                type="button"
                aria-label="Stäng sökningen"
                onClick={() => setSearchOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            {query.trim() && (
              <div className="mt-2 max-h-64 overflow-y-auto border-t border-[#E8E1D6] pt-2">
                {results.length === 0 && (
                  <p className="p-3 text-sm text-[#857E72]">
                    Inga träffar hittades.
                  </p>
                )}
                {results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => travelTo(item)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-[#F3EEE5]"
                  >
                    <span className="text-2xl">{item.symbol}</span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {item.title}
                      </span>
                      <span className="block text-xs text-[#8D8171]">
                        {item.date}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Interactive minimap. Each line represents a complete branch. */}
        {showMap && (
          <div
            className="absolute right-4 top-4 z-10 w-[210px] rounded-2xl border border-[#DED7CA] bg-[#FFFCF6]/95 p-3 shadow-lg sm:w-[260px]"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9D8A71]">
              Översiktskarta
            </p>
            <svg
              viewBox="0 0 240 110"
              className="w-full cursor-crosshair"
              role="img"
              aria-label="Klicka för att förflytta dig i tidslinjen"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                travelFromMap(
                  (e.clientX - rect.left) / rect.width,
                  (e.clientY - rect.top) / rect.height,
                );
              }}
            >
              {branches.map((category) => (
                <line
                  key={category}
                  x1="5"
                  x2="235"
                  y1={(branchY[category] / WORLD_HEIGHT) * 110}
                  y2={(branchY[category] / WORLD_HEIGHT) * 110}
                  stroke={palette[category].color}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
              <rect
                x={clamp(
                  (originalX(-view.x - viewportSize.width / 2, view.zoom) /
                    END_X) *
                    240,
                  0,
                  240,
                )}
                y={clamp(
                  ((-view.y - viewportSize.height / 2) / WORLD_HEIGHT) * 110,
                  0,
                  110,
                )}
                width={clamp(
                  (viewportSize.width / spread(view.zoom) / END_X) * 240,
                  7,
                  240,
                )}
                height={clamp(
                  (viewportSize.height / WORLD_HEIGHT) * 110,
                  6,
                  110,
                )}
                rx="3"
                fill="#839B70"
                fillOpacity=".12"
                stroke="#657D69"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}

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

              <p className="mt-2 text-xs text-[#8D8171]">
                {getMilestoneEra(selected)}
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
