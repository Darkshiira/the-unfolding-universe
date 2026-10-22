"use client";

import { useId } from "react";

type WaterCondensationEffectProps = {
  active: boolean;
};

export default function WaterCondensationEffect({
  active,
}: WaterCondensationEffectProps) {
  const id = useId().replace(/:/g, "");
  const mistFilter = `condensation-soft-mist-${id}`;
  const cloudGlow = `condensation-cloud-glow-${id}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-[2200ms] ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id={mistFilter} x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur stdDeviation="28" />
          </filter>

          <radialGradient id={cloudGlow}>
            <stop offset="0%" stopColor="#dce9f2" stopOpacity="0.09" />
            <stop offset="55%" stopColor="#dce9f2" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`condensation-storm-${id}`}>
            <stop offset="0%" stopColor="#071522" stopOpacity="0.68" />
            <stop offset="45%" stopColor="#142839" stopOpacity="0.42" />
            <stop offset="80%" stopColor="#1c3445" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#1c3445" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* The central cloud gradually darkens as it becomes denser */}
        <ellipse
          cx="870"
          cy="135"
          rx="440"
          ry="165"
          fill={`url(#condensation-storm-${id})`}
          className="condensation-storm"
        />

        {/* Soft atmospheric density inside the existing cloud */}
        <ellipse
          cx="860"
          cy="120"
          rx="365"
          ry="125"
          fill={`url(#${cloudGlow})`}
          className="condensation-density"
        />

        {/* Mist gathering into the underside of the cloud */}
        <g filter={`url(#${mistFilter})`}>
          <ellipse
            cx="680"
            cy="155"
            rx="170"
            ry="32"
            fill="#dce9f2"
            opacity="0.22"
            className="condensation-gather condensation-gather-left"
          />

          <ellipse
            cx="960"
            cy="165"
            rx="190"
            ry="38"
            fill="#e7eef5"
            opacity="0.20"
            className="condensation-gather condensation-gather-right"
          />

          <ellipse
            cx="830"
            cy="125"
            rx="240"
            ry="48"
            fill="#d4e4f0"
            opacity="0.13"
            className="condensation-gather condensation-gather-center"
          />
        </g>
      </svg>
    </div>
  );
}
