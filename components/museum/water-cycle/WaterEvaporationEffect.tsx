"use client";

import { useId } from "react";

type Props = {
  active: boolean;
};

const wisps = [
  { x: -9, delay: -0.5, duration: 7.5, drift: -12, width: 7 },
  { x: 3, delay: -2.5, duration: 8.2, drift: 10, width: 9 },
  { x: -2, delay: -4.5, duration: 7.8, drift: -8, width: 6 },
  { x: 9, delay: -1.8, duration: 8.5, drift: 13, width: 7 },
  { x: -5, delay: -5.5, duration: 8, drift: -10, width: 8 },
];

export default function WaterEvaporationEffect({ active }: Props) {
  const id = useId().replace(/:/g, "");

  const sunlightId = `${id}-sunlight`;
  const reflectionId = `${id}-reflection`;
  const mistId = `${id}-mist`;
  const mistGradientId = `${id}-mist-gradient`;

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {/* Soft sunshine: no sharp triangular rays */}
      <div
        className="water-evap-sunshine pointer-events-none absolute"
        style={{
          right: "-9%",
          top: "-18%",
          width: "49%",
          height: "86%",
          background: `radial-gradient(ellipse at 78% 36%,
              rgba(255,246,201,0.32) 0%,
              rgba(255,224,150,0.15) 34%,
              rgba(255,219,142,0.05) 62%,
              transparent 82%)`,
        }}
      />

      {/* Gentle sunlight reflected on the sea */}
      <div
        className="water-evap-warmth pointer-events-none absolute"
        style={{
          left: "84%",
          top: "48%",
          width: "17%",
          height: "14%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse,
              rgba(255,246,216,0.35) 0%,
              rgba(255,232,168,0.14) 45%,
              transparent 75%)`,
        }}
      />

      {/* Independent wisps rising from the ocean */}
      <svg
        viewBox="0 0 180 260"
        width="180"
        height="260"
        className="pointer-events-none absolute left-[94%] top-[60%] h-[200px] w-[140px] -translate-x-1/2 -translate-y-full overflow-visible sm:h-[260px] sm:w-[180px]"
      >
        <defs>
          <filter id={mistId} x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.015"
              numOctaves="2"
              seed="8"
              result="noise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />

            <feGaussianBlur stdDeviation="3" />
          </filter>

          <linearGradient id={mistGradientId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".9" />
            <stop offset="45%" stopColor="#f7fdff" stopOpacity=".78" />
            <stop offset="100%" stopColor="#e9f8ff" stopOpacity=".15" />
          </linearGradient>

          <radialGradient id={sunlightId}>
            <stop offset="0%" stopColor="#fff4d0" />
            <stop offset="100%" stopColor="#fff4d0" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={reflectionId}>
            <stop offset="0%" stopColor="#fff7dd" />
            <stop offset="100%" stopColor="#fff7dd" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Small, softly illuminated mist at the surface */}
        <ellipse
          cx="90"
          cy="249"
          rx="33"
          ry="7"
          fill={`url(#${mistGradientId})`}
          filter={`url(#${mistId})`}
          opacity=".55"
        />

        {wisps.map((wisp, index) => (
          <g
            key={index}
            className="water-evap-wisp"
            style={
              {
                animationDelay: `${wisp.delay}s`,
                animationDuration: `${wisp.duration}s`,
                "--wisp-drift": `${wisp.drift}px`,
              } as React.CSSProperties
            }
          >
            {/* Thin curling ribbon instead of a round cloud */}
            <path
              d={`
        M ${90 + wisp.x} 250
        C ${78 + wisp.x} 226,
          ${104 + wisp.x} 211,
          ${91 + wisp.x} 187
        C ${77 + wisp.x} 167,
          ${107 + wisp.x} 150,
          ${92 + wisp.x} 130
      `}
              fill="none"
              stroke="#ffffff"
              strokeWidth={wisp.width}
              strokeLinecap="round"
              opacity=".65"
              filter={`url(#${mistId})`}
            />

            {/* Softer outer haze */}
            <path
              d={`
        M ${90 + wisp.x} 250
        C ${78 + wisp.x} 226,
          ${104 + wisp.x} 211,
          ${91 + wisp.x} 187
        C ${77 + wisp.x} 167,
          ${107 + wisp.x} 150,
          ${92 + wisp.x} 130
      `}
              fill="none"
              stroke="#eafaff"
              strokeWidth={wisp.width * 2.5}
              strokeLinecap="round"
              opacity=".15"
              filter={`url(#${mistId})`}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
