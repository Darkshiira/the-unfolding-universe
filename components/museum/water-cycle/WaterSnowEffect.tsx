"use client";

import { useId } from "react";
import type { CSSProperties } from "react";

type WaterSnowEffectProps = {
  active: boolean;
};

type SnowParticle = {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
};

const SNOW_COUNT = 115;

// Deterministic positions prevent hydration and purity errors.
const snowParticles: SnowParticle[] = Array.from(
  { length: SNOW_COUNT },
  (_, i) => {
    const a = ((i * 79 + 23) % 997) / 997;
    const b = ((i * 151 + 41) % 991) / 991;

    return {
      id: i,
      x: 115 + a * 520,
      y: 35 + b * 310,
      radius: 0.8 + (i % 5) * 0.35,
      opacity: 0.3 + (i % 6) * 0.085,
      duration: 5 + (i % 8) * 0.7,
      delay: -(i % 19) * 0.43,
      drift: -18 + (i % 9) * 5,
    };
  },
);

export default function WaterSnowEffect({ active }: WaterSnowEffectProps) {
  const id = useId().replace(/:/g, "");

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-[1800ms] ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Gentle cold-blue atmospheric tint */}
          <radialGradient id={`snow-cold-${id}`}>
            <stop offset="0%" stopColor="#b7e5f6" stopOpacity="0.2" />
            <stop offset="65%" stopColor="#b7e5f6" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#b7e5f6" stopOpacity="0" />
          </radialGradient>

          {/* Frosty glow over the mountain peaks */}
          <radialGradient id={`snow-frost-${id}`}>
            <stop offset="0%" stopColor="#f0faff" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#f0faff" stopOpacity="0" />
          </radialGradient>

          {/* Snow stays near the glacier */}
          <clipPath id={`snow-region-${id}`}>
            <path
              d="
                M 65 0
                L 710 0
                L 665 255
                C 600 320, 495 365, 360 345
                C 225 320, 145 275, 65 245
                Z
              "
            />
          </clipPath>

          <filter
            id={`snow-soften-${id}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>

        {/* Cooler air surrounding the snowy mountains */}
        <ellipse
          cx="365"
          cy="175"
          rx="420"
          ry="270"
          fill={`url(#snow-cold-${id})`}
          className="water-snow-atmosphere"
        />

        {/* Gentle frosty illumination over the glacier */}
        <ellipse
          cx="365"
          cy="155"
          rx="290"
          ry="165"
          fill={`url(#snow-frost-${id})`}
          className="water-snow-atmosphere"
        />

        {/* Falling snow particles */}
        <g clipPath={`url(#snow-region-${id})`}>
          {snowParticles.map((particle) => (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.radius}
              fill="#f4fbff"
              opacity={particle.opacity}
              filter={
                particle.radius > 1.8 ? `url(#snow-soften-${id})` : undefined
              }
              className="water-snow-particle"
              style={
                {
                  "--snow-duration": `${particle.duration}s`,
                  "--snow-delay": `${particle.delay}s`,
                  "--snow-drift": `${particle.drift}px`,
                } as CSSProperties
              }
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
