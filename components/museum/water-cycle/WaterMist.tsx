"use client";

import { useId } from "react";

export default function WaterMist() {
  const id = useId().replace(/:/g, "");

  const noiseId = `${id}-noise`;
  const fadeId = `${id}-fade`;
  const shapeId = `${id}-shape`;
  const maskId = `${id}-mask`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[60%] overflow-hidden"
    >
      <svg
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Irregular cloud texture */}
          <filter
            id={noiseId}
            x="-20%"
            y="-30%"
            width="140%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006 0.018"
              numOctaves="4"
              seed="8"
              result="cloudNoise"
            >
              <animate
                attributeName="baseFrequency"
                values="
      0.006 0.018;
      0.007 0.015;
      0.0055 0.020;
      0.006 0.018
    "
                dur="55s"
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;0.33;0.66;1"
                keySplines="
      0.42 0 0.58 1;
      0.42 0 0.58 1;
      0.42 0 0.58 1
    "
              />
            </feTurbulence>

            <feColorMatrix
              in="cloudNoise"
              type="matrix"
              values="
                0 0 0 0 0.91
                0 0 0 0 0.96
                0 0 0 0 1
                0 0 0 3.2 -1.65
              "
            />

            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* Soft fading in every direction */}
          <radialGradient id={fadeId} cx="50%" cy="48%" rx="50%" ry="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="40%" stopColor="white" stopOpacity=".9" />
            <stop offset="72%" stopColor="white" stopOpacity=".45" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>

          {/* Organic mist silhouette */}
          <filter id={shapeId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.025"
              numOctaves="3"
              seed="14"
              result="shapeNoise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="shapeNoise"
              scale="85"
              xChannelSelector="R"
              yChannelSelector="G"
            />

            <feGaussianBlur stdDeviation="18" />
          </filter>

          {/* Final feathered mask */}
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="-300"
            y="-100"
            width="1800"
            height="620"
            style={{ maskType: "luminance" }}
          >
            <ellipse
              cx="600"
              cy="210"
              rx="770"
              ry="230"
              fill={`url(#${fadeId})`}
              filter={`url(#${shapeId})`}
            />
          </mask>
        </defs>

        {/* Distant drifting cloud layer */}
        <g
          className="water-fog-layer water-fog-slow"
          opacity=".32"
          mask={`url(#${maskId})`}
        >
          <rect
            x="-450"
            y="-80"
            width="2100"
            height="580"
            filter={`url(#${noiseId})`}
          />
        </g>

        {/* Closer mountain mist */}
        <g
          className="water-fog-layer water-fog-fast"
          opacity=".42"
          mask={`url(#${maskId})`}
        >
          <rect
            x="-500"
            y="30"
            width="2200"
            height="500"
            filter={`url(#${noiseId})`}
          />
        </g>
      </svg>
    </div>
  );
}
