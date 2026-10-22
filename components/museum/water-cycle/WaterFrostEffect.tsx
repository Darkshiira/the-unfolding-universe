"use client";

import { useId } from "react";

type WaterFrostEffectProps = {
  active: boolean;
};

const branches = [
  { x: 0, y: 0, rotate: 0, scale: 1.3 },
  { x: 75, y: 0, rotate: 35, scale: 0.9 },
  { x: 0, y: 115, rotate: -35, scale: 1.1 },
  { x: 1672, y: 0, rotate: 90, scale: 1.2 },
  { x: 1590, y: 0, rotate: 135, scale: 0.85 },
  { x: 1672, y: 110, rotate: 120, scale: 1 },
  { x: 0, y: 941, rotate: -90, scale: 1.3 },
  { x: 90, y: 941, rotate: -45, scale: 0.85 },
  { x: 1672, y: 941, rotate: 180, scale: 1.2 },
  { x: 1585, y: 941, rotate: 225, scale: 0.9 },
];

const frostSpecks = Array.from({ length: 85 }, (_, i) => {
  const a = ((i * 79 + 17) % 997) / 997;
  const b = ((i * 131 + 43) % 991) / 991;

  const side = i % 4;

  return {
    x: side === 0 ? a * 145 : side === 1 ? 1672 - a * 145 : a * 1672,
    y: side === 2 ? b * 110 : side === 3 ? 941 - b * 110 : b * 941,
    r: 0.5 + (i % 5) * 0.28,
    opacity: 0.15 + (i % 6) * 0.07,
  };
});

export default function WaterFrostEffect({ active }: WaterFrostEffectProps) {
  const id = useId().replace(/:/g, "");

  const edge = `frost-edge-${id}`;
  const corner = `frost-corner-${id}`;
  const blur = `frost-blur-${id}`;
  const crystal = `frost-crystal-${id}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-[2600ms] ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 1672 941"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Soft frozen-glass edge */}
          <linearGradient id={edge}>
            <stop offset="0%" stopColor="#e8f8ff" stopOpacity="0.48" />
            <stop offset="28%" stopColor="#ccecff" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#ccecff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ccecff" stopOpacity="0" />
          </linearGradient>

          {/* Corner haze */}
          <radialGradient id={corner}>
            <stop offset="0%" stopColor="#f0fbff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#d7f1ff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#d7f1ff" stopOpacity="0" />
          </radialGradient>

          <filter id={blur} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* Organic frost fern */}
          <g
            id={crystal}
            fill="none"
            stroke="#effbff"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Main irregular vein */}
            <path
              d="M0 0 C15 12 27 25 38 42 S67 72 88 100"
              strokeWidth="2.1"
              opacity="0.7"
            />

            {/* Fine side branches */}
            <path
              d="
                M18 16 L36 12
                M27 26 L18 45
                M38 42 L60 37
                M48 54 L35 76
                M60 68 L85 64
                M73 83 L63 108
              "
              strokeWidth="1.15"
              opacity="0.7"
            />

            {/* Tiny feathered subdivisions */}
            <path
              d="
                M29 14 L35 4
                M31 14 L44 18
                M21 39 L9 42
                M21 39 L22 54
                M53 38 L60 26
                M53 38 L67 44
                M41 65 L27 66
                M41 65 L42 81
                M77 65 L83 53
                M77 65 L93 73
                M66 99 L54 103
                M66 99 L68 115
              "
              strokeWidth="0.75"
              opacity="0.55"
            />
          </g>
        </defs>

        {/* Frosted glass edge haze */}
        <rect width="190" height="941" fill={`url(#${edge})`} />

        <rect
          x="1482"
          width="190"
          height="941"
          fill={`url(#${edge})`}
          transform="rotate(180 1577 470.5)"
        />

        {/* Corner haze */}
        {[
          [0, 0],
          [1672, 0],
          [0, 941],
          [1672, 941],
        ].map(([cx, cy], index) => (
          <ellipse
            key={index}
            cx={cx}
            cy={cy}
            rx="260"
            ry="220"
            fill={`url(#${corner})`}
            filter={`url(#${blur})`}
          />
        ))}

        {/* Growing frost branches */}
        <g className="water-frost-organic">
          {branches.map((branch, index) => (
            <use
              key={index}
              href={`#${crystal}`}
              transform={`translate(${branch.x} ${branch.y}) rotate(${branch.rotate}) scale(${branch.scale})`}
              opacity={0.45 + (index % 4) * 0.1}
            />
          ))}
        </g>

        {/* Tiny ice grains near the window edges */}
        <g className="water-frost-specks">
          {frostSpecks.map((speck, index) => (
            <circle
              key={index}
              cx={speck.x}
              cy={speck.y}
              r={speck.r}
              fill="#f4fcff"
              opacity={speck.opacity}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
