"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type WaterRainEffectProps = { active: boolean };
type RainDrop = {
  id: number;
  x: number;
  y: number;
  length: number;
  opacity: number;
  duration: number;
  delay: number;
};
const RAIN_COUNT = 145;
const rainDrops: RainDrop[] = Array.from({ length: RAIN_COUNT }, (_, i) => {
  const seed = (i * 73 + 19) % 997;
  const secondary = (i * 137 + 47) % 991;
  return {
    id: i,
    x: 760 + (seed / 997) * 350,
    y: 145 + (secondary / 991) * 230,
    length: 9 + (i % 6) * 3,
    opacity: 0.16 + (i % 5) * 0.065,
    duration: 0.8 + (i % 7) * 0.13,
    delay: -(i % 17) * 0.17,
  };
});

export default function WaterRainEffect({ active }: WaterRainEffectProps) {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!active) return;
    let flashTimeout: ReturnType<typeof setTimeout>;
    let endTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const scheduleFlash = () => {
      const delay = 7000 + Math.random() * 7000;
      flashTimeout = setTimeout(() => {
        if (cancelled) return;
        setFlash(true);
        // One event for the actual visual flash; audio adds the thunder delay.
        window.dispatchEvent(new Event("water-cycle:lightning"));
        endTimeout = setTimeout(() => {
          if (cancelled) return;
          setFlash(false);
          scheduleFlash();
        }, 160);
      }, delay);
    };
    scheduleFlash();
    return () => {
      cancelled = true;
      clearTimeout(flashTimeout);
      clearTimeout(endTimeout);
    };
  }, [active]);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-[1600ms] ${active ? "opacity-100" : "opacity-0"}`}
    >
      <svg
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="water-rain-curtain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9deed" stopOpacity="0" />
            <stop offset="35%" stopColor="#b4cadc" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#dcecf5" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="water-lightning-glow">
            <stop offset="0%" stopColor="#fff4b5" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#ffe4a0" stopOpacity="0.23" />
            <stop offset="100%" stopColor="#fff4b5" stopOpacity="0" />
          </radialGradient>
          <clipPath id="water-rain-area">
            <path d="M 745 155 C 830 175, 970 170, 1105 155 L 1145 450 C 1010 470, 860 445, 760 420 Z" />
          </clipPath>
        </defs>
        <path
          d="M 745 155 C 830 175, 970 170, 1105 155 L 1145 450 C 1010 470, 860 445, 760 420 Z"
          fill="url(#water-rain-curtain)"
          opacity="0.8"
        />
        <g clipPath="url(#water-rain-area)">
          {rainDrops.map((drop) => (
            <line
              key={drop.id}
              x1={drop.x}
              y1={drop.y}
              x2={drop.x - 3}
              y2={drop.y + drop.length}
              stroke="#e6f3ff"
              strokeWidth="1"
              strokeLinecap="round"
              opacity={drop.opacity}
              className="water-rain-drop"
              style={
                {
                  "--rain-duration": `${drop.duration}s`,
                  "--rain-delay": `${drop.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </g>
        <ellipse
          cx="945"
          cy="115"
          rx="245"
          ry="115"
          fill="url(#water-lightning-glow)"
          opacity={flash ? 0.8 : 0}
          style={{
            transition: flash
              ? "opacity 55ms ease-out"
              : "opacity 280ms ease-out",
          }}
        />
      </svg>
    </div>
  );
}
