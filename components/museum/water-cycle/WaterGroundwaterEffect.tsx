"use client";

type Props = {
  active: boolean;
};

const soilParticles = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  x: 28 + ((i * 37) % 43),
  y: 65 + ((i * 17) % 16),
  size: 1.5 + (i % 3) * 0.7,
  delay: (i % 9) * -1.3,
  duration: 9 + (i % 6) * 1.7,
}));

const undergroundParticles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: 26 + ((i * 29) % 43),
  y: 81 + ((i * 11) % 12),
  size: 1.5 + (i % 3),
  delay: (i % 7) * -2,
  duration: 14 + (i % 5) * 2,
}));

export default function WaterGroundwaterEffect({ active }: Props) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {/* ==========================================
    EARTHY UNDERGROUND FRAME
========================================== */}

      <div className="groundwater-earth-frame pointer-events-none absolute inset-0">
        {/* Deep soil darkness around the edges */}
        <div
          className="absolute inset-0"
          style={{
            background: `
        radial-gradient(
          ellipse 76% 66% at 50% 47%,
          transparent 37%,
          rgba(53, 35, 23, 0.12) 55%,
          rgba(45, 29, 19, 0.46) 78%,
          rgba(24, 16, 12, 0.82) 100%
        )
      `,
          }}
        />

        {/* Darker earth hanging over the top */}
        <div
          className="absolute inset-x-0 top-0 h-[27%]"
          style={{
            background: `
        linear-gradient(
          to bottom,
          rgba(35, 23, 16, 0.76) 0%,
          rgba(58, 37, 24, 0.4) 38%,
          transparent 100%
        )
      `,
          }}
        />

        {/* Soil rising from the bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-[32%]"
          style={{
            background: `
        linear-gradient(
          to top,
          rgba(28, 19, 14, 0.82) 0%,
          rgba(72, 46, 28, 0.38) 42%,
          transparent 100%
        )
      `,
          }}
        />

        {/* Subtle earthy shadows on both sides */}
        <div
          className="absolute inset-0"
          style={{
            background: `
        linear-gradient(
          to right,
          rgba(37, 24, 17, 0.46) 0%,
          transparent 19%,
          transparent 81%,
          rgba(37, 24, 17, 0.46) 100%
        )
      `,
          }}
        />
      </div>
      {/* Warm earthy atmosphere near the ground */}
      <div
        className="groundwater-earth-glow absolute bottom-[-15%] left-[20%] h-[48%] w-[58%] rounded-[50%] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(159,104,44,0.28) 0%, rgba(111,75,36,0.17) 40%, transparent 75%)",
        }}
      />
      {/* Dark earthy shading above the groundwater */}
      <div
        className="pointer-events-none absolute bottom-[18%] left-[20%] h-[30%] w-[58%] rounded-[50%] blur-[45px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(48,31,20,0.46) 0%, rgba(75,48,28,0.28) 45%, transparent 78%)",
        }}
      />

      {/* Warm brown underground atmosphere */}
      <div
        className="groundwater-earth-glow absolute bottom-[-15%] left-[20%] h-[48%] w-[58%] rounded-[50%] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(112,70,36,0.34) 0%, rgba(81,51,29,0.24) 42%, transparent 76%)",
        }}
      />

      {/* Subtle warm light beneath the soil */}
      <div
        className="groundwater-earth-glow absolute bottom-[0%] left-[29%] h-[22%] w-[35%] rounded-[50%] blur-[45px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(184,124,62,0.13), transparent 72%)",
          animationDelay: "-3s",
        }}
      />

      {/* Water slowly infiltrating the soil */}
      {soilParticles.map((particle) => (
        <span
          key={particle.id}
          className="groundwater-soil-particle absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size * 1.4,
            backgroundColor: "rgba(142,239,235,0.85)",
            boxShadow:
              "0 0 7px rgba(94,234,212,0.65), 0 0 15px rgba(45,212,191,0.22)",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Very slow movement through the underground */}
      {undergroundParticles.map((particle) => (
        <span
          key={`underground-${particle.id}`}
          className="groundwater-underground-particle absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: "rgba(103,232,249,0.8)",
            boxShadow:
              "0 0 8px rgba(103,232,249,0.65), 0 0 18px rgba(34,211,238,0.22)",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
