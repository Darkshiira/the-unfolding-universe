"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Menu,
  X,
  Search,
  Layers,
  BookOpen,
  ChevronDown,
  Map as MapIcon,
} from "lucide-react";

import MuseumDropdown from "@/components/MuseumDropdown";
import { milestones, palette, type Category } from "../timeline-data";
import { GEOLOGICAL_ERAS } from "../timeline-eras";
import { SWEDISH_HISTORY_PERIODS } from "../timeline-history";

type Chapter = {
  id: Category;
  title: string;
  description: string;
  symbol: string;
  x: number;
  y: number;
};

const chapters: Chapter[] = [
  {
    id: "earth",
    title: "Jordens historia",
    description: "Från en ung planet till en värld av hav och kontinenter.",
    symbol: "🌋",
    x: 44,
    y: 78,
  },
  {
    id: "life",
    title: "Livets början",
    description: "Upptäck hur livet uppstod och förändrade jorden.",
    symbol: "🦠",
    x: 104,
    y: 188,
  },
  {
    id: "plants",
    title: "Växternas utveckling",
    description: "Följ växternas resa från enkla livsformer till skogar.",
    symbol: "🌿",
    x: 164,
    y: 298,
  },
  {
    id: "animals",
    title: "Djurens utveckling",
    description: "Från havens första djur till livet på land.",
    symbol: "🦕",
    x: 224,
    y: 408,
  },
  {
    id: "humans",
    title: "Människans utveckling",
    description: "Utforska vår plats i jordens långa historia.",
    symbol: "🧑",
    x: 284,
    y: 518,
  },
];

const MAP_HEIGHT = 670;
const MAP_WIDTH = 330;

const paths: Record<Category, string> = {
  earth: "M44 0 V670",
  life: "M44 120 C44 154 104 145 104 188 V670",
  plants: "M104 230 C104 264 164 255 164 298 V670",
  animals: "M104 340 C104 374 224 365 224 408 V670",
  humans: "M224 450 C224 484 284 475 284 518 V670",
};

type View = "map" | "chapter";

export default function MobileTimeline() {
  const [view, setView] = useState<View>("map");
  const [selected, setSelected] = useState<Category | null>(null);
  const [focusing, setFocusing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSection, setMenuSection] = useState<
    "branches" | "geology" | "history" | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGeology, setShowGeology] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapScrollRef = useRef<HTMLDivElement>(null);
  const chapterScrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetDiscoveryRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  const activeChapter = chapters.find((chapter) => chapter.id === selected);
  const activeColor = selected ? palette[selected].color : "#344F43";
  const focusChapter = chapters.find((chapter) => chapter.id === selected);

  // Matches the horizontal order used by the existing desktop timeline.
  const discoveries = selected
    ? milestones
        .filter((milestone) => milestone.category === selected)
        .sort((a, b) => a.x - b.x)
    : [];

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("sv-SE");
  const searchResults = normalizedSearch
    ? milestones
        .filter((item) =>
          [item.title, item.description, item.date].some((value) =>
            value.toLocaleLowerCase("sv-SE").includes(normalizedSearch),
          ),
        )
        .slice(0, 30)
    : [];

  function closeMenu() {
    setMenuOpen(false);
    setMenuSection(null);
    setSearchTerm("");
  }

  // Navigate directly between chapters. Going back through the map would
  // race with returnToMap's reset timer and lose the selected discovery.
  function navigateToChapter(category: Category, discoveryId?: string) {
    closeMenu();
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    timeoutRef.current = null;
    frameRef.current = null;
    targetDiscoveryRef.current = discoveryId ?? null;

    if (view === "chapter") {
      // Keep the chapter panel visible while changing its content.
      setSelected(category);
      setFocusing(true);
      if (discoveryId && selected === category) {
        requestAnimationFrame(() => {
          const item = Array.from(
            chapterScrollRef.current?.querySelectorAll<HTMLElement>(
              "[data-discovery-id]",
            ) ?? [],
          ).find((node) => node.dataset.discoveryId === discoveryId);
          if (item && chapterScrollRef.current) {
            const container = chapterScrollRef.current;
            const top =
              container.scrollTop +
              item.getBoundingClientRect().top -
              container.getBoundingClientRect().top -
              90;
            container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
            targetDiscoveryRef.current = null;
          }
        });
      }
      if (!discoveryId && selected === category) {
        chapterScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      openChapter(category);
    }
  }

  function jumpToDiscovery(id: string, category: Category) {
    navigateToChapter(category, id);
  }

  // Wait until React has committed the destination chapter's discoveries.
  // This also works when searching within the current chapter.
  useLayoutEffect(() => {
    if (view !== "chapter" || !selected || !targetDiscoveryRef.current) return;
    const id = targetDiscoveryRef.current;
    const item = Array.from(
      chapterScrollRef.current?.querySelectorAll<HTMLElement>(
        "[data-discovery-id]",
      ) ?? [],
    ).find((node) => node.dataset.discoveryId === id);
    if (!item) return;
    targetDiscoveryRef.current = null;
    const container = chapterScrollRef.current;
    if (!container) return;
    const top =
      container.scrollTop +
      item.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      90;
    container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [view, selected]);

  function periodDiscoveries(olderMa: number, youngerMa: number) {
    return milestones
      .filter(
        (item) =>
          typeof item.ageMa === "number" &&
          item.ageMa <= olderMa &&
          (item.ageMa > youngerMa || (youngerMa === 0 && item.ageMa === 0)),
      )
      .sort((a, b) => (b.ageMa ?? 0) - (a.ageMa ?? 0));
  }

  function jumpToPeriod(
    olderMa: number,
    youngerMa: number,
    layer: "geology" | "history",
  ) {
    const first = periodDiscoveries(olderMa, youngerMa)[0];
    if (!first) return;
    if (layer === "geology") setShowGeology(true);
    else setShowHistory(true);
    jumpToDiscovery(first.id, first.category);
  }

  function geologicalEra(ageMa?: number) {
    if (ageMa === undefined) return undefined;
    return GEOLOGICAL_ERAS.find(
      (era) =>
        ageMa <= era.olderMa &&
        (ageMa > era.youngerMa || (era.youngerMa === 0 && ageMa === 0)),
    );
  }

  function historicalPeriod(ageMa?: number) {
    if (ageMa === undefined) return undefined;
    return SWEDISH_HISTORY_PERIODS.find(
      (period) =>
        ageMa <= period.olderMa &&
        (ageMa > period.youngerMa || (period.youngerMa === 0 && ageMa === 0)),
    );
  }

  function openChapter(category: Category) {
    if (view !== "map" || focusing) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

    setSelected(category);
    setFocusing(true);

    // First allow the chosen line to become the focus of the map.
    // The destination stays below the viewport until that movement finishes.
    timeoutRef.current = setTimeout(() => {
      chapterScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          setView("chapter");
          frameRef.current = null;
        });
      });
    }, 480);
  }

  function returnToMap() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    frameRef.current = null;
    setView("map");
    // Keep the focused map underneath until the chapter has slid away.
    timeoutRef.current = setTimeout(() => {
      setFocusing(false);
      setSelected(null);
    }, 880);
  }

  return (
    <main className="flex h-svh min-h-0 flex-col overflow-hidden bg-[#F8F5EE] text-[#344F43]">
      <header className="relative z-50 flex shrink-0 items-center justify-between gap-2 border-b border-[#E1D9CC] bg-[#FBF9F3] px-3 py-2.5 sm:px-5">
        <Link
          href="/timeline"
          className="flex min-w-0 items-center gap-2"
          aria-label="Till den klassiska tidslinjen"
        >
          <Compass size={23} className="shrink-0 text-[#B78A62]" />
          <span className="truncate text-[13px] font-bold sm:text-sm">
            Jordens historia
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchTerm("");
            }}
            aria-expanded={menuOpen}
            aria-controls="mobile-timeline-explore"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#DED6C8] bg-[#FFFCF6] px-3 text-[11px] font-semibold text-[#344F43]"
          >
            {menuOpen ? <X size={15} /> : <Menu size={15} />}
            Utforska
          </button>
          <MuseumDropdown />
        </div>
      </header>

      {menuOpen && (
        <div
          className="absolute inset-x-0 bottom-0 top-[58px] z-40 flex justify-center bg-[#25372D]/25 px-3 pb-3 pt-2 backdrop-blur-[2px]"
          onClick={closeMenu}
        >
          <div
            id="mobile-timeline-explore"
            role="dialog"
            aria-label="Utforska tidslinjen"
            className="flex h-fit max-h-full w-full max-w-lg flex-col overflow-hidden rounded-[22px] border border-[#DDD4C5] bg-[#FFFCF6] shadow-[0_20px_60px_rgba(36,48,38,.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#E8E0D3] px-4 py-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#B78A62]">
                  Jordens historia
                </p>
                <h2 className="mt-0.5 text-base font-bold">
                  Utforska tidslinjen
                </h2>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Stäng menyn"
                className="rounded-full p-2 hover:bg-[#F0E9DF]"
              >
                <X size={19} />
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-color:#B78A62_#F8F5EE] [scrollbar-width:thin]">
              <label className="flex items-center gap-2 rounded-xl border border-[#DDD4C5] bg-white px-3 py-2.5">
                <Search size={17} className="shrink-0 text-[#6B806E]" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Sök bland upptäckter..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#989487]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Rensa sökningen och visa menyn"
                    className="rounded-full p-1.5 text-[#526B58] hover:bg-[#F0E9DF]"
                  >
                    <X size={17} />
                  </button>
                )}
              </label>
              {normalizedSearch && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#526B58]"
                >
                  <ArrowLeft size={14} /> Tillbaka till utforska-menyn
                </button>
              )}
              {normalizedSearch ? (
                <div className="mt-3 space-y-1">
                  <p className="mb-2 text-[11px] text-[#77796F]">
                    {searchResults.length
                      ? `Visar ${searchResults.length} träffar`
                      : "Inga upptäckter hittades"}
                  </p>
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => jumpToDiscovery(item.id, item.category)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#F3EEE5]"
                    >
                      <span className="text-xl">{item.symbol}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {item.title}
                        </span>
                        <span className="block text-[11px] text-[#77796F]">
                          {item.date}
                        </span>
                      </span>
                      <ArrowRight size={15} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMenuSection(
                        menuSection === "branches" ? null : "branches",
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-[#F3EEE5]"
                    aria-expanded={menuSection === "branches"}
                  >
                    <Compass size={19} className="text-[#597565]" />
                    <span className="flex-1 text-sm font-semibold">
                      Välj en gren
                    </span>
                    <ChevronDown
                      size={16}
                      className={menuSection === "branches" ? "rotate-180" : ""}
                    />
                  </button>
                  {menuSection === "branches" && (
                    <div className="space-y-1 pl-4">
                      {chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => navigateToChapter(chapter.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-[#F3EEE5]"
                        >
                          <span
                            className="h-5 w-1 rounded-full"
                            style={{
                              backgroundColor: palette[chapter.id].color,
                            }}
                          />
                          {chapter.symbol} {chapter.title}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setMenuSection(
                        menuSection === "geology" ? null : "geology",
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-[#F3EEE5]"
                    aria-expanded={menuSection === "geology"}
                  >
                    <Layers size={19} className="text-[#597565]" />
                    <span className="flex-1 text-sm font-semibold">
                      Geologiska tider
                    </span>
                    <ChevronDown
                      size={16}
                      className={menuSection === "geology" ? "rotate-180" : ""}
                    />
                  </button>
                  {menuSection === "geology" && (
                    <div className="space-y-1 pl-4">
                      <label className="mb-2 flex items-center gap-2 rounded-lg bg-[#F0F3EA] px-3 py-2 text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={showGeology}
                          onChange={(e) => setShowGeology(e.target.checked)}
                          className="accent-[#597565]"
                        />{" "}
                        Visa geologiska perioder längs tidslinjen
                      </label>
                      {GEOLOGICAL_ERAS.map((era) => (
                        <button
                          key={era.name}
                          type="button"
                          onClick={() =>
                            jumpToPeriod(era.olderMa, era.youngerMa, "geology")
                          }
                          disabled={
                            periodDiscoveries(era.olderMa, era.youngerMa)
                              .length === 0
                          }
                          className="flex w-full disabled:opacity-40 items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-[#F3EEE5]"
                        >
                          <span
                            className="h-7 w-1.5 rounded-full"
                            style={{ backgroundColor: era.color }}
                          />
                          <span className="flex-1">
                            <span className="block text-sm font-semibold">
                              {era.name}
                            </span>
                            <span className="block text-[11px] text-[#77796F]">
                              {era.olderMa}–{era.youngerMa} miljoner år sedan ·{" "}
                              {
                                periodDiscoveries(era.olderMa, era.youngerMa)
                                  .length
                              }{" "}
                              upptäckter
                            </span>
                          </span>
                          <ArrowRight size={14} />
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setMenuSection(
                        menuSection === "history" ? null : "history",
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-[#F3EEE5]"
                    aria-expanded={menuSection === "history"}
                  >
                    <BookOpen size={19} className="text-[#597565]" />
                    <span className="flex-1 text-sm font-semibold">
                      Svenska historiska tider
                    </span>
                    <ChevronDown
                      size={16}
                      className={menuSection === "history" ? "rotate-180" : ""}
                    />
                  </button>
                  {menuSection === "history" && (
                    <div className="space-y-1 pl-4">
                      <label className="mb-2 flex items-center gap-2 rounded-lg bg-[#F0F3EA] px-3 py-2 text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={showHistory}
                          onChange={(e) => setShowHistory(e.target.checked)}
                          className="accent-[#597565]"
                        />{" "}
                        Visa svenska historiska tider längs tidslinjen
                      </label>
                      {SWEDISH_HISTORY_PERIODS.map((period) => (
                        <button
                          key={period.name}
                          type="button"
                          onClick={() =>
                            jumpToPeriod(
                              period.olderMa,
                              period.youngerMa,
                              "history",
                            )
                          }
                          disabled={
                            periodDiscoveries(period.olderMa, period.youngerMa)
                              .length === 0
                          }
                          className="flex w-full disabled:opacity-40 items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-[#F3EEE5]"
                        >
                          <span
                            className="h-7 w-1.5 rounded-full"
                            style={{ backgroundColor: period.color }}
                          />
                          <span className="flex-1">
                            <span className="block text-sm font-semibold">
                              {period.name}
                            </span>
                            <span className="block text-[11px] text-[#77796F]">
                              {
                                periodDiscoveries(
                                  period.olderMa,
                                  period.youngerMa,
                                ).length
                              }{" "}
                              upptäckter
                            </span>
                          </span>
                          <ArrowRight size={14} />
                        </button>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/timeline"
                    className="flex items-center gap-3 rounded-xl border-t border-[#E8E0D3] p-3 text-sm font-semibold hover:bg-[#F3EEE5]"
                  >
                    <MapIcon size={19} className="text-[#597565]" />
                    Klassisk tidslinje
                    <ArrowRight size={15} className="ml-auto" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative min-h-0 flex-1 overflow-hidden isolate">
        <div
          ref={mapScrollRef}
          aria-hidden={view === "chapter"}
          inert={view === "chapter"}
          className="absolute inset-0 overflow-y-auto overscroll-contain transition-[transform,opacity,filter] duration-[850ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
          style={{
            transform:
              focusing && focusChapter
                ? `scale(1.28) translate(${(165 - focusChapter.x) * 0.3}px, ${Math.min(0, 170 - focusChapter.y) * 0.28}px)`
                : "scale(1) translate(0, 0)",
            opacity: view === "chapter" ? 0.55 : 1,
            filter: view === "chapter" ? "blur(2px)" : "none",
            pointerEvents: view === "chapter" ? "none" : "auto",
          }}
        >
          <section className="mx-auto w-full max-w-lg px-4 pt-5 sm:px-6">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B78A62]">
                Hur allt fortsatte
              </p>
              <h1 className="mt-2 font-serif text-[28px] font-semibold leading-tight tracking-tight sm:text-3xl">
                Fem vägar genom tiden
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-[13px] leading-5 text-[#7A8074]">
                Tryck på en färgad gren för att utforska dess historia.
              </p>
            </div>

            <div className="relative mx-auto mt-5 w-full max-w-[360px]">
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                className="block h-auto w-full overflow-visible"
                role="img"
                aria-label="Fem lodräta, sammanlänkade färgade grenar genom jordens historia"
              >
                <defs>
                  <filter
                    id="mobile-timeline-glow"
                    x="-60%"
                    y="-60%"
                    width="220%"
                    height="220%"
                  >
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>

                {chapters.map((chapter) => {
                  const isSelected = focusing && selected === chapter.id;
                  const dimmed = focusing && !isSelected;
                  const color = palette[chapter.id].color;

                  return (
                    <g
                      key={chapter.id}
                      style={{
                        opacity: dimmed ? 0.08 : 1,
                        transition: "opacity 550ms ease",
                      }}
                    >
                      {isSelected && (
                        <path
                          d={paths[chapter.id]}
                          fill="none"
                          stroke={color}
                          strokeWidth="22"
                          opacity="0.35"
                          filter="url(#mobile-timeline-glow)"
                        />
                      )}
                      <path
                        d={paths[chapter.id]}
                        fill="none"
                        stroke={color}
                        strokeWidth={isSelected ? 9 : 5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transition: "stroke-width 500ms ease" }}
                      />
                      <circle
                        cx={chapter.x}
                        cy={chapter.y}
                        r="22"
                        fill="#FFFCF6"
                        stroke={color}
                        strokeWidth="3"
                      />
                      <text
                        x={chapter.x}
                        y={chapter.y + 6}
                        fontSize="19"
                        textAnchor="middle"
                      >
                        {chapter.symbol}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => openChapter(chapter.id)}
                  className="absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#344F43]"
                  style={{
                    left: `${(chapter.x / MAP_WIDTH) * 100}%`,
                    top: `${(chapter.y / MAP_HEIGHT) * 100}%`,
                  }}
                  aria-label={`Utforska ${chapter.title}`}
                  title={chapter.title}
                >
                  <span className="sr-only">{chapter.title}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div
          ref={chapterScrollRef}
          inert={view !== "chapter"}
          aria-hidden={view !== "chapter"}
          className="absolute inset-0 z-10 overflow-y-auto overscroll-contain will-change-transform bg-[#F8F5EE] shadow-[0_-18px_55px_rgba(44,60,48,.14)] transition-[transform,opacity] duration-[850ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
          style={{
            transform:
              view === "chapter"
                ? "translate3d(0,0,0)"
                : "translate3d(0,105%,0)",
            opacity: 1,
            pointerEvents: view === "chapter" ? "auto" : "none",
          }}
        >
          {activeChapter && (
            <section
              key={activeChapter.id}
              className="relative mx-auto w-full max-w-xl px-4 pb-16 pt-0 sm:px-6"
            >
              {/* The chapter's colored line begins directly under the navigation header. */}
              <div
                className="pointer-events-none absolute left-[35px] top-0 w-[5px] rounded-full sm:left-[43px]"
                style={{ backgroundColor: activeColor, bottom: "165px" }}
                aria-hidden="true"
              />
              <div className="relative pl-[57px] pt-3">
                <button
                  type="button"
                  onClick={returnToMap}
                  className="mb-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#DED6C8] bg-[#FFFCF6] px-3 text-xs font-semibold text-[#526B58]"
                >
                  <ArrowLeft size={15} />
                  Alla grenar
                </button>
              </div>

              {/* One uninterrupted line runs beside both the title and all discoveries. */}
              <div className="relative">
                <div className="relative min-h-[205px] pl-[57px] pb-9 pt-4 sm:min-h-[225px]">
                  <div
                    className="absolute left-0 top-5 flex h-[43px] w-[43px] items-center justify-center rounded-full border-[3px] bg-[#FFFCF6] text-xl shadow-sm"
                    style={{ borderColor: activeColor }}
                    aria-hidden="true"
                  >
                    {activeChapter.symbol}
                  </div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: activeColor }}
                  >
                    En väg genom tiden
                  </p>
                  <h1 className="mt-3 font-serif text-[clamp(2.15rem,9vw,3.5rem)] font-semibold leading-[1.06] tracking-tight">
                    {activeChapter.title}
                  </h1>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-[#737A70]">
                    {activeChapter.description}
                  </p>
                </div>

                <ol className="relative space-y-5 pb-5">
                  {discoveries.map((discovery, index) => {
                    const era = showGeology
                      ? geologicalEra(discovery.ageMa)
                      : undefined;
                    const previousEra =
                      index > 0
                        ? geologicalEra(discoveries[index - 1].ageMa)
                        : undefined;
                    const history = showHistory
                      ? historicalPeriod(discovery.ageMa)
                      : undefined;
                    const previousHistory =
                      index > 0
                        ? historicalPeriod(discoveries[index - 1].ageMa)
                        : undefined;
                    return (
                      <li
                        key={discovery.id}
                        data-discovery-id={discovery.id}
                        className="relative pl-[57px]"
                      >
                        {era &&
                          (index === 0 || era.name !== previousEra?.name) && (
                            <div
                              className="relative mb-4 rounded-xl border border-[#E4DBCD] px-3 py-3"
                              style={{ backgroundColor: era.color }}
                            >
                              <span className="block text-[9px] font-bold uppercase tracking-[.13em] text-[#526B58]">
                                Geologisk tidsålder
                              </span>
                              <strong className="mt-1 block font-serif text-xl text-[#344F43]">
                                {era.name}
                              </strong>
                              <span className="mt-1 block text-[11px] text-[#647063]">
                                {era.olderMa}–{era.youngerMa} miljoner år sedan
                              </span>
                            </div>
                          )}
                        {history &&
                          (index === 0 ||
                            history.name !== previousHistory?.name) && (
                            <div
                              className="relative mb-4 rounded-xl border border-[#E4DBCD] px-3 py-3"
                              style={{ backgroundColor: history.color }}
                            >
                              <span className="block text-[9px] font-bold uppercase tracking-[.13em] text-[#526B58]">
                                Svensk historisk period
                              </span>
                              <strong className="mt-1 block font-serif text-xl text-[#344F43]">
                                {history.name}
                              </strong>
                              <span className="mt-1 block text-[11px] text-[#647063]">
                                Regional och ungefärlig tidsindelning
                              </span>
                            </div>
                          )}
                        <span
                          className="absolute left-[11px] top-6 h-[21px] w-[21px] rounded-full border-[4px] border-[#F8F5EE]"
                          style={{
                            backgroundColor: activeColor,
                            boxShadow: `0 0 0 2px ${activeColor}`,
                          }}
                          aria-hidden="true"
                        />
                        <Link
                          href={`/timeline/${discovery.id}`}
                          className="group block rounded-2xl border border-[#E4DBCD] bg-[#FFFCF6] p-4 shadow-sm transition hover:border-[#C7BAA5] hover:shadow-md"
                        >
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: activeColor }}
                          >
                            {discovery.date}
                          </p>
                          <div className="mt-3 flex items-start gap-3">
                            <span
                              className="shrink-0 text-2xl"
                              aria-hidden="true"
                            >
                              {discovery.symbol}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h2 className="text-base font-bold leading-snug text-[#344F43]">
                                {discovery.title}
                              </h2>
                              <p className="mt-2 text-xs leading-6 text-[#737A70]">
                                {discovery.description}
                              </p>
                            </div>
                          </div>
                          <span className="mt-4 flex items-center justify-end gap-1 text-xs font-bold text-[#526B58]">
                            Utforska upptäckten
                            <ArrowRight
                              size={15}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>

                {discoveries.length === 0 && (
                  <div className="relative pl-[57px] pb-8">
                    <p className="rounded-xl border border-[#E4DBCD] bg-[#FFFCF6] p-4 text-sm text-[#737A70]">
                      Upptäckterna för den här grenen kommer snart.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={returnToMap}
                className="relative z-10 ml-[57px] mt-8 flex min-h-11 w-[calc(100%-57px)] items-center justify-center gap-2 rounded-xl border border-[#DED6C8] bg-[#FFFCF6] text-sm font-semibold"
              >
                <ArrowLeft size={16} />
                Tillbaka till alla grenar
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
