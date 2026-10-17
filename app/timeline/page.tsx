"use client";

import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import Link from "next/link";
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

type Category = "earth" | "life" | "plants" | "animals" | "humans";

type Milestone = {
  id: string;
  title: string;
  date: string;
  description: string;
  fact: string;
  x: number;
  y: number;
  category: Category;
  symbol: string;
  major?: boolean;
};

const WORLD_WIDTH = 2500;
const WORLD_HEIGHT = 1160;

const palette: Record<
  Category,
  { color: string; light: string; label: string }
> = {
  earth: {
    color: "#BC906C",
    light: "#F1E2D0",
    label: "Earth's history",
  },
  life: {
    color: "#739FA2",
    light: "#E0EFF0",
    label: "Early life",
  },
  plants: {
    color: "#839B70",
    light: "#E5EDDD",
    label: "Plant evolution",
  },
  animals: {
    color: "#B88D8D",
    light: "#F2E4E3",
    label: "Animal evolution",
  },
  humans: {
    color: "#BA916A",
    light: "#F3E8D9",
    label: "Human evolution",
  },
};

const milestones: Milestone[] = [
  {
    id: "earth",
    title: "Earth is born",
    date: "4.54 billion years ago",
    description:
      "Our planet forms from material surrounding the young Sun. Its early history is marked by intense heat, collisions, and rapid geological change.",
    fact: "Earth is approximately 4.54 billion years old.",
    x: 170,
    y: 195,
    category: "earth",
    symbol: "🌋",
    major: true,
  },
  {
    id: "moon",
    title: "The Moon forms",
    date: "Around 4.5 billion years ago",
    description:
      "According to the leading hypothesis, a giant collision in Earth's early history produced debris that eventually formed the Moon.",
    fact: "The Moon helps stabilize Earth's axial tilt.",
    x: 520,
    y: 195,
    category: "earth",
    symbol: "🌕",
  },
  {
    id: "oceans",
    title: "A world of water",
    date: "Possibly by 4.4 billion years ago",
    description:
      "Ancient zircon minerals suggest that liquid water may have existed on Earth's surface surprisingly early.",
    fact: "Some of the oldest evidence comes from tiny zircon crystals.",
    x: 900,
    y: 195,
    category: "earth",
    symbol: "🌊",
    major: true,
  },
  {
    id: "microbes",
    title: "Ancient microorganisms",
    date: "At least 3.5 billion years ago",
    description:
      "Some of the earliest widely accepted evidence of life points to simple microbial organisms living in ancient environments.",
    fact: "Microbial life dominated Earth's history for billions of years.",
    x: 1080,
    y: 435,
    category: "life",
    symbol: "🦠",
    major: true,
  },
  {
    id: "oxygen",
    title: "Oxygen transforms Earth",
    date: "Around 2.4 billion years ago",
    description:
      "During the Great Oxidation Event, oxygen begins accumulating significantly in Earth's atmosphere, transforming environments and evolution.",
    fact: "Oxygen was not always abundant in Earth's atmosphere.",
    x: 1530,
    y: 435,
    category: "life",
    symbol: "🫧",
    major: true,
  },
  {
    id: "eukaryotes",
    title: "Complex cells",
    date: "At least 1.6 billion years ago",
    description:
      "Eukaryotic cells, with complex internal structures, became a crucial part of the history of life.",
    fact: "Plants, animals, and fungi are all eukaryotes.",
    x: 1790,
    y: 435,
    category: "life",
    symbol: "🔬",
  },
  {
    id: "land-plants",
    title: "Plants conquer land",
    date: "Around 470 million years ago",
    description:
      "Early land plants begin spreading into terrestrial environments, eventually transforming landscapes and ecosystems.",
    fact: "Early land plants were very different from modern trees.",
    x: 1910,
    y: 695,
    category: "plants",
    symbol: "🌱",
    major: true,
  },
  {
    id: "forests",
    title: "The first forests",
    date: "Around 385 million years ago",
    description:
      "Early forests alter the landscape, influence soils, and help reshape the global carbon cycle.",
    fact: "Some early trees looked unlike anything growing today.",
    x: 2260,
    y: 695,
    category: "plants",
    symbol: "🌳",
  },
  {
    id: "animals",
    title: "Early animals",
    date: "By around 600 million years ago",
    description:
      "Animals diversify in ancient oceans. Their deeper evolutionary origins are still being studied.",
    fact: "The earliest animals lived in the sea.",
    x: 1910,
    y: 890,
    category: "animals",
    symbol: "🪼",
    major: true,
  },
  {
    id: "dinosaurs",
    title: "The age of dinosaurs",
    date: "Beginning around 230 million years ago",
    description:
      "Dinosaurs appear during the Triassic period and diversify into an extraordinary variety of forms.",
    fact: "Birds are the surviving dinosaur lineage.",
    x: 2240,
    y: 890,
    category: "animals",
    symbol: "🦕",
    major: true,
  },
  {
    id: "humans",
    title: "Our species emerges",
    date: "Around 300,000 years ago",
    description:
      "Homo sapiens evolves in Africa, very recently compared with the immense history of life on Earth.",
    fact: "Humans are mammals, primates, and part of the animal kingdom.",
    x: 2430,
    y: 1080,
    category: "humans",
    symbol: "👣",
    major: true,
  },
];

const paths: {
  id: Category;
  d: string;
  title: string;
  x: number;
  y: number;
}[] = [
  {
    id: "earth",
    d: "M 65 195 H 2500",
    title: "THE CHANGING EARTH",
    x: 80,
    y: 120,
  },
  {
    id: "life",
    d: "M 900 195 C 1020 195 930 435 1080 435 H 2500",
    title: "THE BEGINNING OF LIFE",
    x: 1050,
    y: 365,
  },
  {
    id: "plants",
    d: "M 1790 435 C 1900 435 1790 695 1910 695 H 2500",
    title: "THE GREEN WORLD",
    x: 1950,
    y: 630,
  },
  {
    id: "animals",
    d: "M 1790 435 C 1920 435 1780 890 1910 890 H 2500",
    title: "THE ANIMAL KINGDOM",
    x: 1950,
    y: 830,
  },
  {
    id: "humans",
    d: "M 2240 890 C 2360 890 2320 1080 2430 1080 H 2500",
    title: "OUR STORY",
    x: 2330,
    y: 1010,
  },
];

const initialView = {
  x: 0,
  y: 0,
  zoom: 0.65,
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
              The Unfolding Universe
            </p>

            <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#34473C] sm:text-2xl">
              The Story of Earth
            </h1>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#DCD4C6] px-4 py-2.5 text-xs font-semibold text-[#6C7066] transition-colors hover:bg-[#EFE8DB]"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Back to the universe</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </header>

      {/* Intro strip */}
      <div className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#E5DFD3] bg-[#F5F0E6] px-5 py-3 sm:px-10">
        <div className="flex items-center gap-3">
          <BookOpen size={17} className="text-[#9D896D]" strokeWidth={1.5} />

          <p className="text-xs leading-relaxed text-[#77786C]">
            An illustrated atlas of our planet&apos;s extraordinary history.
          </p>
        </div>

        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A29480] md:block">
          Drag to explore · Scroll to zoom
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
                aria-label={`Read about ${event.title}`}
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
            Explore the branches
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
            aria-label="Zoom out"
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
            aria-label="Zoom in"
            className="rounded-xl p-3 text-[#6F7769] transition-colors hover:bg-[#EEE9DE]"
          >
            <Plus size={19} />
          </button>

          <div className="mx-1 h-6 w-px bg-[#E2DBCE]" />

          <button
            type="button"
            onClick={() => setView(initialView)}
            aria-label="Reset timeline view"
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
            An interactive natural history atlas
          </span>
        </div>

        <span className="hidden text-[10px] text-[#A49A8C] sm:block">
          A journey through deep time
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
              aria-label="Close information panel"
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
                  Did you know?
                </p>

                <p className="text-sm leading-6 text-[#686B60]">
                  {selected.fact}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#657D69] transition-colors hover:text-[#344F3B]"
              >
                Continue exploring
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
