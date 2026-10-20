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
import { swedishHistoryBoundaries } from "./timeline-history";
import Link from "next/link";
import Image from "next/image";
import { milestoneVisualX } from "./timeline-layout";
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
  Map as MapIcon,
  Layers3,
  Leaf,
  Maximize2,
  Minus,
  Plus,
  Menu,
  X,
} from "lucide-react";

// A spatial timeline: milestones move apart, but icons and text never scale.
const EARTH_X = milestones.find((m) => m.id === "earth")?.x ?? 400;
const EARTH_Y = milestones.find((m) => m.id === "earth")?.y ?? 195;
const END_X = 12000;
const START_ZOOM = 1.05;
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 5;

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
    return `M ${positionX(-850, zoom)} ${y} H ${end}`;
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
  const [periodMode, setPeriodMode] = useState<"geology" | "history" | "none">(
    "geology",
  );
  const periods =
    periodMode === "history"
      ? swedishHistoryBoundaries()
      : geologicalBoundaries();
  const [showMap, setShowMap] = useState(true);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [showTouchHint, setShowTouchHint] = useState(true);

  // Only a first-visit visual hint; never move the timeline without consent.
  useEffect(() => {
    const timer = window.setTimeout(() => setShowTouchHint(false), 7500);
    return () => window.clearTimeout(timer);
  }, []);

  const [viewportSize, setViewportSize] = useState({ width: 900, height: 600 });

  // The small floating label follows the center of the viewport while
  // the world pans and zooms. It only appears for Swedish history.
  const currentHistoricalPeriod =
    periodMode === "history"
      ? periods.find((period) => {
          const left =
            viewportSize.width / 2 +
            view.x +
            positionX(period.startX, view.zoom);
          const right =
            viewportSize.width / 2 + view.x + positionX(period.endX, view.zoom);
          return (
            left <= viewportSize.width / 2 && right > viewportSize.width / 2
          );
        })
      : undefined;
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
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
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
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{
    distance: number;
    zoom: number;
    focusWorldX: number;
    focusWorldY: number;
    centerX: number;
    centerY: number;
    viewX: number;
    viewY: number;
  } | null>(null);

  function toggleHistory() {
    setPeriodMode((v) => (v === "history" ? "none" : "history"));
    const nextZoom = Math.max(targetViewRef.current.zoom, 4);
    targetViewRef.current = {
      zoom: nextZoom,
      x: -positionX(7850, nextZoom),
      y: -branchY.humans,
    };
    setMobileMenuOpen(false);
  }

  // Overview is a true fit-to-screen map. At this scale milestone labels
  // cannot be readable, so show dots and let a tap zoom into that region.
  function openOverview() {
    setSelected(null);
    setMobileMenuOpen(false);
    setMobileMapOpen(false);
    setOverviewOpen(true);
  }

  function jumpFromOverview(x: number, y: number) {
    const current = targetViewRef.current;
    const zoom = Math.max(1.05, current.zoom);
    targetViewRef.current = {
      zoom,
      x: -positionX(x, zoom),
      y: -y,
    };
    setOverviewOpen(false);
  }

  function resetView() {
    targetViewRef.current = initialView;
    setActiveBranch(null);
    setMobileMenuOpen(false);
  }

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
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (
      (event.target as Element).closest("button, a, input, [data-timeline-ui]")
    )
      return;

    if (event.pointerType === "touch") setShowTouchHint(false);
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    event.currentTarget.setPointerCapture(event.pointerId);

    if (pointersRef.current.size === 2) {
      const [a, b] = Array.from(pointersRef.current.values());
      const rect = event.currentTarget.getBoundingClientRect();
      const cx = (a.x + b.x) / 2 - rect.left - rect.width / 2;
      const cy = (a.y + b.y) / 2 - rect.top - rect.height / 2;
      const current = targetViewRef.current;
      pinchRef.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        zoom: current.zoom,
        focusWorldX: originalX(cx - current.x, current.zoom),
        focusWorldY: cy - current.y,
        centerX: cx,
        centerY: cy,
        viewX: current.x,
        viewY: current.y,
      };
      dragRef.current = null;
      ignoreClickRef.current = true;
      setDragging(true);
      return;
    }

    if (pointersRef.current.size === 1) {
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        viewX: targetViewRef.current.x,
        viewY: targetViewRef.current.y,
        moved: false,
      };
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [a, b] = Array.from(pointersRef.current.values());
      const rect = event.currentTarget.getBoundingClientRect();
      const cx = (a.x + b.x) / 2 - rect.left - rect.width / 2;
      const cy = (a.y + b.y) / 2 - rect.top - rect.height / 2;
      const pinch = pinchRef.current;
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const nextZoom = clamp(
        pinch.zoom * (distance / Math.max(1, pinch.distance)),
        MIN_ZOOM,
        MAX_ZOOM,
      );
      targetViewRef.current = {
        zoom: nextZoom,
        x: cx - positionX(pinch.focusWorldX, nextZoom),
        y: cy - pinch.focusWorldY,
      };
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || pinchRef.current) return;
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
    if (drag?.pointerId === event.pointerId) {
      ignoreClickRef.current = drag.moved;
    }
    pointersRef.current.delete(event.pointerId);
    if (pinchRef.current) {
      ignoreClickRef.current = true;
      pinchRef.current = null;
      // Don't start a new drag with the remaining finger.
      dragRef.current = null;
    } else if (drag?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
    if (pointersRef.current.size === 0) setDragging(false);
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
      <style>{`
        @keyframes timeline-swipe-hint {
          0%, 100% { transform: translateX(-9px); opacity: .45; }
          50% { transform: translateX(9px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden="true"] > span[style*="timeline-swipe-hint"] {
            animation: none !important;
          }
        }
      `}</style>
      {/* Museum-style header */}
      <header className="relative z-30 flex shrink-0 items-center justify-between gap-2 border-b border-[#DDD8CD] bg-[#FBF9F3]/95 px-3 py-2 backdrop-blur-md sm:gap-4 sm:px-10 sm:py-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#F1E9D9] sm:size-14">
            <Image
              src="/images/explorers-compass.webp"
              alt="Gyllene kompass med gröna blad"
              fill
              priority
              sizes="(max-width: 640px) 40px, 56px"
              className="object-cover"
            />
          </div>

          <div>
            <p className="hidden text-[9px] font-bold uppercase tracking-[0.3em] text-[#9B8972] sm:block">
              Hur allt började
            </p>

            <h1 className="truncate text-base font-semibold tracking-tight text-[#34473C] sm:mt-1 sm:text-2xl">
              Jordens historia
            </h1>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#DCD4C6] p-2.5 text-xs font-semibold text-[#6C7066] transition-colors hover:bg-[#EFE8DB] sm:px-4"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Tillbaka till universum</span>
        </Link>
      </header>

      {/* Intro strip */}
      <div className="relative z-20 hidden shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#E5DFD3] bg-[#F5F0E6] px-5 py-3 sm:flex sm:px-10">
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
            onClick={() =>
              setPeriodMode((v) => (v === "geology" ? "none" : "geology"))
            }
            aria-pressed={periodMode === "geology"}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${periodMode === "geology" ? "border-[#839B70] bg-[#E5EDDD] text-[#48634D]" : "border-[#DDD4C6] text-[#66766B] hover:bg-white"}`}
          >
            <Layers3 size={15} />{" "}
            <span className="hidden sm:inline">Geologiska tider</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPeriodMode((v) => (v === "history" ? "none" : "history"));
              const nextZoom = Math.max(targetViewRef.current.zoom, 4);
              targetViewRef.current = {
                zoom: nextZoom,
                x: -positionX(7850, nextZoom),
                y: -branchY.humans,
              };
            }}
            aria-pressed={periodMode === "history"}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${periodMode === "history" ? "border-[#839B70] bg-[#E5EDDD] text-[#48634D]" : "border-[#DDD4C6] text-[#66766B] hover:bg-white"}`}
          >
            <BookOpen size={15} />
            <span className="hidden sm:inline">Svenska historiska tider</span>
            <span className="sm:hidden">Historia</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            aria-pressed={showMap}
            className="flex items-center gap-2 rounded-full border border-[#DDD4C6] px-3 py-2 text-xs font-semibold text-[#66766B] hover:bg-white"
          >
            <MapIcon size={15} />{" "}
            <span className="hidden sm:inline">Översiktskarta</span>
          </button>
        </div>
      </div>

      {/* Branch navigation on smaller screens */}
      <div className="relative z-20 hidden shrink-0 gap-2 overflow-x-auto border-b border-[#E5DFD3] bg-[#FBF9F3] px-4 py-2 sm:flex lg:hidden">
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
        {/* Short, accessible gesture hint for first-time mobile visitors. */}
        {showTouchHint && !mobileMenuOpen && !mobileMapOpen && !selected && (
          <div
            className="pointer-events-none absolute left-1/2 top-[22%] z-20 -translate-x-1/2 sm:hidden"
            aria-live="polite"
          >
            <div className="flex min-w-[210px] flex-col items-center gap-2 rounded-2xl border border-[#DED7CA] bg-[#FFFCF6]/90 px-5 py-3 text-center shadow-md backdrop-blur-sm">
              <span
                className="text-2xl font-medium tracking-[0.35em] text-[#77907D]"
                style={{
                  animation: "timeline-swipe-hint 1.6s ease-in-out infinite",
                }}
                aria-hidden="true"
              >
                ← ↔ →
              </span>
              <span className="text-xs font-semibold text-[#435D4D]">
                Följ linjen för att resa genom tiden
              </span>
              <span className="text-[11px] text-[#8B8275]">
                Nyp med två fingrar för att zooma
              </span>
            </div>
          </div>
        )}

        {/* Mobile controls float above the canvas instead of consuming its height. */}
        <div
          data-timeline-ui
          className="absolute left-3 right-3 top-3 z-20 flex items-start justify-between gap-2 sm:hidden"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen((v) => !v);
              setMobileMapOpen(false);
            }}
            aria-expanded={mobileMenuOpen}
            aria-label="Öppna utforskarmenyn"
            className="flex items-center gap-2 rounded-full border border-[#DED7CA] bg-[#FFFCF6]/95 px-4 py-2.5 text-xs font-semibold text-[#435D4D] shadow-md"
          >
            <Menu size={17} /> Utforska
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMapOpen((v) => !v);
              setMobileMenuOpen(false);
            }}
            aria-expanded={mobileMapOpen}
            aria-label={
              mobileMapOpen ? "Dölj översiktskartan" : "Visa översiktskartan"
            }
            className="rounded-full border border-[#DED7CA] bg-[#FFFCF6]/95 p-2.5 text-[#435D4D] shadow-md hidden sm:flex"
          >
            {mobileMapOpen ? <X size={18} /> : <MapIcon size={18} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            data-timeline-ui
            className="absolute left-3 right-3 top-16 z-30 max-h-[min(65svh,480px)] overflow-y-auto rounded-2xl border border-[#DED7CA] bg-[#FFFCF6] p-4 shadow-xl sm:hidden"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9D8A71]">
              Utforska tidslinjen
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-[#F2EEE6]"
            >
              <Search size={17} /> Sök milstolpar
            </button>
            <div className="my-2 border-t border-[#E8E1D6]" />
            {branches.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => travelToBranch(category)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-[#F2EEE6]"
              >
                <span
                  className="h-1 w-7 rounded-full"
                  style={{ backgroundColor: palette[category].color }}
                />
                {palette[category].label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setActiveBranch(null);
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#657D69]"
            >
              Visa alla grenar
            </button>
            <div className="my-2 border-t border-[#E8E1D6]" />
            <button
              type="button"
              onClick={() => {
                setPeriodMode((v) => (v === "geology" ? "none" : "geology"));
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-[#F2EEE6]"
            >
              <Layers3 size={17} /> Geologiska tider{" "}
              {periodMode === "geology" ? "✓" : ""}
            </button>
            <button
              type="button"
              onClick={toggleHistory}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-[#F2EEE6]"
            >
              <BookOpen size={17} /> Svenska historiska tider{" "}
              {periodMode === "history" ? "✓" : ""}
            </button>
            <button
              type="button"
              onClick={resetView}
              className="mt-2 flex w-full items-center gap-3 rounded-xl bg-[#E5EDDD] px-3 py-3 text-left text-sm font-semibold text-[#435D4D]"
            >
              <Maximize2 size={17} /> Till början
            </button>
          </div>
        )}

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

        {/* Before Earth existed: a subtle cosmic introduction, not a geological era. */}
        {periodMode === "geology" && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0"
            style={{
              width: Math.max(
                0,
                viewportSize.width / 2 + view.x + positionX(100, view.zoom),
              ),
              background: "linear-gradient(90deg, #DFE1EB, #E8E1DE)",
            }}
          />
        )}

        {/* Geological/history bands: anchored to the VIEWPORT, not WORLD_HEIGHT.
            They still use the same animated horizontal world coordinates,
            so the colors follow every pan and smooth spatial zoom. */}
        {periodMode !== "none" && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            {periods.map((era, index) => {
              const left =
                viewportSize.width / 2 +
                view.x +
                positionX(era.startX, view.zoom);
              const right =
                viewportSize.width / 2 +
                view.x +
                positionX(era.endX, view.zoom);
              // Extend the first and last eras to the edges of the viewport
              // so the user never sees a blank band at either end.
              const from = index === 0 ? left : left;
              const to =
                index === periods.length - 1
                  ? Math.max(viewportSize.width + 100, right)
                  : right;
              return (
                <div
                  key={era.name}
                  className="absolute inset-y-0 border-l border-white/50"
                  style={{
                    left: from,
                    width: Math.max(0, to - from),
                    background: `linear-gradient(90deg, ${era.color}B8, ${era.color}8A 85%, ${era.color}B8)`,
                  }}
                />
              );
            })}
          </div>
        )}

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
            const isSwedish = event.id.startsWith("sweden-");

            const pinColor = isSwedish ? "#2463A0" : colors.color;
            const pinBackground = isSwedish ? "#FFF1BD" : colors.light;
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
                  left: positionX(milestoneVisualX(event), view.zoom),
                  top: event.y,
                  opacity: visible ? (dimmed ? 0.12 : 1) : 0,
                  pointerEvents: visible && !dimmed ? "auto" : "none",
                }}
              >
                <div
                  className="relative flex size-[92px] items-center justify-center rounded-full border-[5px] border-[#FBF9F3] shadow-[0_5px_20px_rgba(80,64,44,0.14)] transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: pinBackground,
                    outline: `3px solid ${pinColor}`,
                  }}
                >
                  <span className="text-[43px]" aria-hidden="true">
                    {event.symbol}
                  </span>

                  {/* Small marker beneath the milestone */}
                  <span
                    className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rounded-full border-[3px] border-[#FBF9F3]"
                    style={{
                      backgroundColor: isSwedish ? "#E8BA36" : colors.color,
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

        {/* Selected period labels stay visible while panning vertically. */}
        {periodMode !== "none" && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-11 overflow-hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(248,245,238,.9), transparent)",
            }}
          >
            {periods.map((era) => {
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
              if (clippedRight - clippedLeft < 65) return null;
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

        {/* Floating Swedish historical-period label. No extra layout height. */}
        {currentHistoricalPeriod && (
          <div
            className="pointer-events-none absolute left-1/2 top-[68px] z-[16] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#D8CEBF] bg-[#FFFCF6]/95 px-4 py-2 text-center shadow-[0_5px_18px_rgba(65,55,40,0.12)] backdrop-blur-md sm:top-4"
            role="status"
            aria-label={`Historisk period: ${currentHistoricalPeriod.name}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#526B5B]">
              {currentHistoricalPeriod.name}
            </span>
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
            className={`absolute right-3 top-16 z-20 w-[min(75vw,240px)] rounded-2xl border border-[#DED7CA] bg-[#FFFCF6]/95 p-3 shadow-lg sm:right-4 sm:top-4 sm:z-10 sm:w-[260px] ${mobileMapOpen ? "block" : "hidden sm:block"}`}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9D8A71] hidden sm:block">
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
              {/* A connected, museum-style miniature of the evolutionary tree. */}
              {(
                [
                  ["earth", "M 5 18 H 235"],
                  ["life", "M 30 18 C 52 18, 45 39, 70 39 H 235"],
                  ["plants", "M 95 39 C 118 39, 110 61, 135 61 H 235"],
                  ["animals", "M 110 39 C 140 39, 132 83, 160 83 H 235"],
                  ["humans", "M 185 83 C 205 83, 198 103, 218 103 H 235"],
                ] as const
              ).map(([category, d]) => (
                <path
                  key={category}
                  d={d}
                  fill="none"
                  stroke={palette[category].color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={
                    activeBranch && activeBranch !== category ? 0.2 : 0.9
                  }
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

        {/* Entire timeline overview: readable branches, dots for milestones.
            Tap a location to travel there at normal exploration zoom. */}
        {overviewOpen && (
          <div
            className="absolute inset-0 z-30 flex flex-col bg-[#F8F5EE]/98 px-4 pb-5 pt-5 sm:px-10 sm:pt-8"
            data-timeline-ui
            onPointerDown={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#34473C]">
                  Hela tidslinjen
                </h2>
                <p className="mt-1 text-xs text-[#82796C]">
                  Tryck på en plats för att utforska den närmare
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOverviewOpen(false)}
                aria-label="Stäng översiktskartan"
                className="rounded-full border border-[#DED7CA] bg-[#FFFCF6] p-3 text-[#536F64]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col justify-center gap-5 sm:gap-7">
              <svg
                viewBox="0 0 1000 480"
                preserveAspectRatio="none"
                className="h-[min(42vh,380px)] min-h-[190px] w-full shrink-0 touch-manipulation overflow-visible rounded-2xl border border-[#E5DDD0] bg-[#FFFCF6] p-3 sm:h-[min(55vh,480px)]"
                role="img"
                aria-label="Hela tidslinjen med fem utvecklingsgrenar. Tryck för att förflytta dig."
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  // preserveAspectRatio="none": the complete world fills the
                  // available mobile screen width and height.
                  const svgX =
                    ((event.clientX - rect.left) / rect.width) * 1000;
                  const svgY = ((event.clientY - rect.top) / rect.height) * 480;
                  if (svgX < 0 || svgX > 1000 || svgY < 0 || svgY > 480) return;
                  jumpFromOverview(
                    -850 + (svgX / 1000) * (END_X + 850),
                    (svgY / 480) * WORLD_HEIGHT,
                  );
                }}
              >
                {branches.map((category) => {
                  const y = (branchY[category] / WORLD_HEIGHT) * 480;
                  const first = Math.min(
                    ...milestones
                      .filter((m) => m.category === category)
                      .map((m) => m.x),
                  );
                  const parent: Category =
                    category === "life"
                      ? "earth"
                      : category === "humans"
                        ? "animals"
                        : "life";
                  const parentY = (branchY[parent] / WORLD_HEIGHT) * 480;
                  const toSvgX = (x: number) =>
                    ((x + 850) / (END_X + 850)) * 1000;
                  const start = toSvgX(first - 380);
                  const landing = toSvgX(first - 100);
                  const d =
                    category === "earth"
                      ? `M 0 ${y} H 1000`
                      : `M ${start} ${parentY} C ${start + 22} ${parentY}, ${landing - 22} ${y}, ${landing} ${y} H 1000`;
                  return (
                    <g key={category}>
                      <path
                        d={d}
                        fill="none"
                        stroke="#FFFCF6"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d={d}
                        fill="none"
                        stroke={palette[category].color}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
                {milestones.map((m) => (
                  <circle
                    key={m.id}
                    cx={((m.x + 850) / (END_X + 850)) * 1000}
                    cy={(m.y / WORLD_HEIGHT) * 480}
                    r={m.major ? 6 : 3.5}
                    fill={
                      m.id.startsWith("sweden-")
                        ? "#2463A0"
                        : palette[m.category].color
                    }
                    stroke={m.major ? "#FFFCF6" : "none"}
                    strokeWidth="1.5"
                  >
                    <title>
                      {m.title} — {m.date}
                    </title>
                  </circle>
                ))}
              </svg>

              {/* Readable legend stays outside the SVG, so mobile browsers
                  never shrink the labels along with the full timeline. */}
              <div className="rounded-2xl border border-[#E5DDD0] bg-[#FFFCF6] p-3 sm:p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9B8972]">
                  Tidslinjens färger
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {branches.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setOverviewOpen(false);
                        travelToBranch(category);
                      }}
                      className="flex min-h-11 items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#F3EEE5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#657D69]"
                    >
                      <span
                        className="h-1 w-7 shrink-0 rounded-full"
                        style={{ backgroundColor: palette[category].color }}
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-semibold leading-4 text-[#536355] sm:text-xs">
                        {palette[category].label}
                      </span>
                    </button>
                  ))}
                </div>
                {/* <p className="mt-3 text-[11px] leading-5 text-[#82796C]">
                  Tryck på kartan för att resa till en plats, eller välj en färg
                  för att följa en gren.
                </p> */}
              </div>
            </div>
          </div>
        )}

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-2xl border border-[#DED7CA] bg-[#FFFCF6]/95 p-1 shadow-[0_12px_35px_rgba(75,60,43,0.08)] backdrop-blur-sm sm:bottom-7 sm:right-7 sm:gap-2 sm:p-2">
          <button
            type="button"
            onClick={() => zoomAt(1 / 1.25)}
            aria-label="Zooma ut"
            className="rounded-xl p-2.5 text-[#6F7769] transition-colors hover:bg-[#EEE9DE] sm:p-3"
          >
            <Minus size={19} />
          </button>

          <span className="min-w-10 text-center text-[11px] font-bold tabular-nums text-[#696C60] sm:min-w-12 sm:text-xs">
            {Math.round(view.zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={() => zoomAt(1.25)}
            aria-label="Zooma in"
            className="rounded-xl p-2.5 text-[#6F7769] transition-colors hover:bg-[#EEE9DE] sm:p-3"
          >
            <Plus size={19} />
          </button>

          <div className="mx-0.5 h-6 w-px bg-[#E2DBCE] sm:mx-1" />

          <button
            type="button"
            onClick={openOverview}
            aria-label="Visa hela tidslinjen"
            className="rounded-xl p-2.5 text-[#6F7769] transition-colors hover:bg-[#EEE9DE] sm:p-3"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 hidden shrink-0 items-center justify-between gap-3 border-t border-[#E2DBCE] bg-[#FBF9F3] px-5 py-3 sm:flex sm:px-10">
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
              className="flex h-32 items-center justify-center sm:h-48"
              style={{
                backgroundColor: palette[selected.category].light,
              }}
            >
              <span className="text-[72px] sm:text-[100px]" aria-hidden="true">
                {selected.symbol}
              </span>
            </div>

            <div className="max-h-[calc(85svh-8rem)] overflow-y-auto p-5 sm:max-h-none sm:p-9">
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
                className="mt-3 text-2xl font-semibold tracking-tight text-[#35463B] sm:text-3xl"
              >
                {selected.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#6C7066]">
                {selected.description}
              </p>

              <div className="mt-5 rounded-xl border border-[#E6DDCD] bg-[#F6F0E5] p-4 sm:mt-7 sm:p-5">
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
