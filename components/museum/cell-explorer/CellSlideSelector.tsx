"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CellKind = "animal" | "plant" | "bacteria" | "archaea";

export const CELL_SPECIMENS: ReadonlyArray<{
  id: CellKind;
  label: string;
  number: string;
  accent: string;
}> = [
  { id: "animal", label: "Djurcell", number: "001", accent: "#a3d7e7" },
  { id: "plant", label: "Växtcell", number: "002", accent: "#a9d7a2" },
  { id: "bacteria", label: "Bakteriecell", number: "003", accent: "#e8c58d" },
  { id: "archaea", label: "Arkécell", number: "004", accent: "#cdb7ef" },
];

function Specimen({ kind }: { kind: CellKind }) {
  return (
    <svg
      viewBox="0 0 76 40"
      aria-hidden="true"
      className="h-[33px] w-[66px] max-[900px]:landscape:w-[54px] shrink-0 overflow-visible"
    >
      <defs>
        <radialGradient id={`specimen-glow-${kind}`}>
          <stop stopColor="#d7f1f5" stopOpacity=".23" />
          <stop offset="1" stopColor="#b6dce7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx="38"
        cy="20"
        rx="23"
        ry="17"
        fill={`url(#specimen-glow-${kind})`}
      />
      <rect
        x="16"
        y="3"
        width="44"
        height="34"
        rx="2.5"
        fill="#d7f4ff"
        fillOpacity=".035"
        stroke="#ccebf5"
        strokeOpacity=".23"
        strokeWidth=".7"
      />
      {kind === "animal" && (
        <>
          <path
            d="M38 8 C48 7 54 14 53 22 C52 31 44 34 35 32 C25 32 21 25 24 17 C26 11 32 8 38 8Z"
            fill="#80b7d0"
            fillOpacity=".73"
            stroke="#b5ddec"
            strokeWidth=".9"
          />
          <ellipse
            cx="37"
            cy="19"
            rx="6.5"
            ry="7.5"
            fill="#ae94ce"
            fillOpacity=".9"
          />
          <circle cx="35" cy="18" r="2.5" fill="#d4c3eb" />
          <ellipse
            cx="46"
            cy="25"
            rx="4.5"
            ry="2.2"
            fill="#dfb19a"
            transform="rotate(-30 46 25)"
          />
          <ellipse
            cx="30"
            cy="27"
            rx="4"
            ry="2"
            fill="#dfb19a"
            transform="rotate(30 30 27)"
          />
        </>
      )}
      {kind === "plant" && (
        <>
          <rect
            x="25"
            y="8"
            width="27"
            height="25"
            rx="4"
            fill="#7ea975"
            fillOpacity=".55"
            stroke="#bce1a3"
            strokeWidth="2"
          />
          <rect
            x="29"
            y="12"
            width="19"
            height="17"
            rx="6"
            fill="#a2d9dc"
            fillOpacity=".42"
          />
          <ellipse
            cx="30"
            cy="17"
            rx="3"
            ry="4.4"
            fill="#4caa6d"
            transform="rotate(-24 30 17)"
          />
          <ellipse
            cx="46"
            cy="16"
            rx="3"
            ry="4.4"
            fill="#4caa6d"
            transform="rotate(25 46 16)"
          />
          <ellipse
            cx="44"
            cy="28"
            rx="3"
            ry="4"
            fill="#4caa6d"
            transform="rotate(-25 44 28)"
          />
          <circle cx="32" cy="27" r="4" fill="#b5a0d5" />
        </>
      )}
      {kind === "bacteria" && (
        <>
          <g transform="rotate(-24 38 20)">
            <rect
              x="22"
              y="13"
              width="32"
              height="14"
              rx="7"
              fill="#d3ae74"
              fillOpacity=".85"
              stroke="#f3d7a6"
              strokeWidth="1"
            />
            <path
              d="M29 20 Q33 15 38 20 T48 20"
              fill="none"
              stroke="#e7c5e7"
              strokeWidth="1.6"
            />
            <circle cx="32" cy="24" r="1" fill="#fff0c6" />
            <circle cx="46" cy="17" r="1" fill="#fff0c6" />
            <path
              d="M54 20 Q64 13 67 20"
              fill="none"
              stroke="#e8c58d"
              strokeWidth="1.2"
            />
          </g>
        </>
      )}
      {kind === "archaea" && (
        <>
          <ellipse
            cx="38"
            cy="20"
            rx="16"
            ry="12"
            fill="#a28bc9"
            fillOpacity=".65"
            stroke="#d6c1ef"
            strokeWidth="1.2"
          />
          <path
            d="M29 20 Q36 11 42 20 T48 21 Q39 29 32 24"
            fill="none"
            stroke="#e3c7ed"
            strokeWidth="1.8"
          />
          <circle cx="32" cy="17" r="1.2" fill="#d4e5ec" />
          <circle cx="43" cy="26" r="1.2" fill="#d4e5ec" />
          <path
            d="M22 15 l-5 -4 M23 25 l-6 5 M53 15 l5 -4 M54 25 l5 5"
            stroke="#c6b1e8"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

interface CellSlideSelectorProps {
  value: CellKind;
  onChange: (next: CellKind) => void;
  className?: string;
}

export default function CellSlideSelector({
  value,
  onChange,
  className = "",
}: CellSlideSelectorProps) {
  const selectedIndex = Math.max(
    0,
    CELL_SPECIMENS.findIndex((item) => item.id === value),
  );
  const slideRefs = useRef<Partial<Record<CellKind, HTMLButtonElement | null>>>(
    {},
  );

  useEffect(() => {
    const activeSlide = slideRefs.current[value];
    if (!activeSlide || !window.matchMedia("(max-width: 639px)").matches)
      return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    activeSlide.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [value]);

  function navigate(direction: -1 | 1) {
    onChange(
      CELL_SPECIMENS[
        (selectedIndex + direction + CELL_SPECIMENS.length) %
          CELL_SPECIMENS.length
      ].id,
    );
  }

  return (
    <nav
      aria-label="Välj cell att utforska"
      className={`pointer-events-auto w-full ${className}`}
    >
      <div className="mx-auto flex w-full max-w-[740px] items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Föregående cell"
          className="grid size-9 max-[900px]:landscape:size-7 shrink-0 place-items-center rounded-full text-[#c3d6df] transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3d7e7]"
        >
          <ChevronLeft size={19} strokeWidth={1.6} />
        </button>
        <div className="cell-slides-scroll flex min-w-0 flex-1 snap-x snap-mandatory items-center gap-2 overflow-x-auto px-1 py-2 max-[900px]:landscape:py-1 sm:justify-center sm:overflow-visible">
          {CELL_SPECIMENS.map((cell) => {
            const active = value === cell.id;
            return (
              <button
                key={cell.id}
                ref={(element) => {
                  slideRefs.current[cell.id] = element;
                }}
                type="button"
                onClick={() => onChange(cell.id)}
                aria-label={`Utforska ${cell.label.toLowerCase()}`}
                aria-current={active ? "true" : undefined}
                className="group relative flex h-[49px] w-[141px] max-[900px]:landscape:h-[40px] max-[900px]:landscape:w-[125px] shrink-0 snap-center items-center overflow-hidden rounded-[3px] border bg-[#bdd9e5]/[0.075] text-left shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_5px_15px_rgba(0,0,0,.25)] transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-[#d0e9f1]/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b5e1f1] motion-reduce:transition-none"
                style={{
                  borderColor: active ? cell.accent : "rgba(204,231,242,.28)",
                  boxShadow: active
                    ? `inset 0 1px 0 rgba(255,255,255,.27), 0 0 16px ${cell.accent}35, 0 5px 15px rgba(0,0,0,.25)`
                    : undefined,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[2px] rounded-[1px] border border-white/[.09]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
                <Specimen kind={cell.id} />
                <span className="flex min-w-0 flex-1 flex-col gap-[3px] pr-1">
                  <span className="whitespace-nowrap text-[9px] font-medium tracking-[.02em] text-[#e1edf2]">
                    {cell.label}
                  </span>
                  <span className="text-[8px] tracking-[.17em] text-[#90a9b6]">
                    {cell.number}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Nästa cell"
          className="grid size-9 max-[900px]:landscape:size-7 shrink-0 place-items-center rounded-full text-[#c3d6df] transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3d7e7]"
        >
          <ChevronRight size={19} strokeWidth={1.6} />
        </button>
      </div>
      <style jsx>{`
        .cell-slides-scroll {
          scrollbar-width: none;
        }
        .cell-slides-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  );
}
