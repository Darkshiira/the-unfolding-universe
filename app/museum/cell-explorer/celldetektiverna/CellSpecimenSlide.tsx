"use client";

import type { CellKind } from "../../../../components/museum/cell-explorer/CellSlideSelector";

export default function CellSpecimenSlide({ kind }: { kind: CellKind }) {
  return (
    <svg
      viewBox="0 0 76 40"
      aria-hidden="true"
      className="h-[38px] w-[72px] shrink-0 overflow-visible"
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
