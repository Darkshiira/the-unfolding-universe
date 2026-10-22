"use client";

import type { CSSProperties } from "react";

type WaterMeltingEffectProps = {
  active: boolean;
};

const droplets = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: 4 + ((index * 67 + 11) % 92),
  size: 3 + (index % 4) * 1.4,

  // Slower melting
  duration: 11 + (index % 5) * 2,

  // Stagger the droplets
  delay: (index % 7) * 1.8,

  // Travel farther down the screen
  distance: 180 + (index % 5) * 55,
}));

export default function WaterMeltingEffect({
  active,
}: WaterMeltingEffectProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-1000 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Frosted, melting upper edge */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 via-sky-100/5 to-transparent" />

      {droplets.map((drop) => (
        <span
          key={drop.id}
          className="water-melting-drop absolute top-0 rounded-full border border-white/35 bg-gradient-to-br from-white/45 via-sky-100/20 to-transparent shadow-[0_1px_5px_rgba(255,255,255,0.2)] backdrop-blur-[1px]"
          style={
            {
              left: `${drop.left}%`,
              width: `${drop.size}px`,
              height: `${drop.size * 1.55}px`,
              "--melt-duration": `${drop.duration}s`,
              "--melt-delay": `${drop.delay}s`,
              "--melt-distance": `${drop.distance}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
