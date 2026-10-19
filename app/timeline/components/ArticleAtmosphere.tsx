"use client";

import { useEffect, useState, type CSSProperties } from "react";

type AtmosphereMode = "embers" | "frost" | "underwater" | "steam";
type Intensity = "subtle" | "normal" | "dramatic";

type ArticleAtmosphereProps = {
  mode: AtmosphereMode;
  intensity?: Intensity;
};

// Deterministic particles prevent hydration mismatches.
const particles = Array.from({ length: 68 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
  y: (i * 43 + 17) % 100,
  delay: -((i * 13) % 19),
  duration: 7 + ((i * 7) % 10),
  size: 2 + ((i * 3) % 6),
  drift: -65 + ((i * 19) % 131),
}));

const settings: Record<
  Intensity,
  {
    count: number;
    snowScale: number;
    snowOpacity: number;
    snowSpeed: number;
    smokeOpacity: number;
  }
> = {
  subtle: {
    count: 13,
    snowScale: 0.75,
    snowOpacity: 0.48,
    snowSpeed: 1.2,
    smokeOpacity: 0.32,
  },
  normal: {
    count: 30,
    snowScale: 1,
    snowOpacity: 0.78,
    snowSpeed: 1,
    smokeOpacity: 0.57,
  },
  dramatic: {
    count: 68,
    snowScale: 1.3,
    snowOpacity: 1,
    snowSpeed: 0.72,
    smokeOpacity: 0.9,
  },
};

export default function ArticleAtmosphere({
  mode,
  intensity = "normal",
}: ArticleAtmosphereProps) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setReducedMotion(query.matches);
    update();

    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  if (reducedMotion) return null;

  const config = settings[intensity];
  const isEmbers = mode === "embers";
  const isFrost = mode === "frost";
  const isUnderwater = mode === "underwater";
  const isSteam = mode === "steam";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {/* EMBERS */}
      {isEmbers && (
        <>
          <div className="absolute -bottom-1/2 left-[-15%] h-full w-[85%] rounded-full bg-orange-500/10 blur-[90px]" />

          <div
            className="atmosphere-smoke-top absolute -left-[20%] -top-[38%] h-[95%] w-[95%] rounded-full bg-stone-300/20 blur-[55px]"
            style={{ opacity: config.smokeOpacity }}
          />

          <div
            className="atmosphere-smoke-top-delayed absolute -right-[25%] -top-[48%] h-[100%] w-[100%] rounded-full bg-stone-200/20 blur-[65px]"
            style={{ opacity: config.smokeOpacity }}
          />

          <div
            className="atmosphere-smoke-middle absolute left-[15%] top-[8%] h-[55%] w-[65%] rounded-full bg-neutral-400/10 blur-[50px]"
            style={{ opacity: config.smokeOpacity }}
          />
        </>
      )}

      {/* FROST */}
      {isFrost && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100/10 via-transparent to-cyan-100/10" />

          <div
            className="atmosphere-frost-haze absolute -left-1/4 top-0 h-full w-[80%] rounded-full bg-white/10 blur-[65px]"
            style={{
              opacity:
                intensity === "subtle"
                  ? 0.35
                  : intensity === "dramatic"
                    ? 1
                    : 0.65,
            }}
          />

          {intensity === "dramatic" && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-sky-100/10" />
          )}
        </>
      )}

      {/* UNDERWATER */}
      {isUnderwater && (
        <>
          {/* Ocean depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-100/15 via-transparent to-[#052f46]/25" />

          {/* Main moving sunlight beam */}
          <div
            className="atmosphere-light-ray absolute -top-[45%] left-[15%] h-[170%] w-[25%] origin-top blur-[18px]"
            style={{
              opacity: config.smokeOpacity * 0.95,
              background:
                "linear-gradient(to bottom, rgba(205,250,255,0.75), rgba(155,235,255,0.3), transparent)",
            }}
          />

          {/* Secondary sunlight beam */}
          <div
            className="atmosphere-light-ray-delayed absolute -top-[45%] left-[55%] h-[170%] w-[18%] origin-top blur-[22px]"
            style={{
              opacity: config.smokeOpacity * 0.8,
              background:
                "linear-gradient(to bottom, rgba(210,250,255,0.65), rgba(160,230,255,0.2), transparent)",
            }}
          />

          {/* Soft drifting underwater haze */}
          <div
            className="atmosphere-underwater-haze absolute -left-[25%] top-[10%] h-[90%] w-[110%] rounded-full bg-cyan-100/20 blur-[65px]"
            style={{ opacity: config.smokeOpacity }}
          />

          <div
            className="atmosphere-underwater-haze-delayed absolute -right-[25%] top-[25%] h-[80%] w-[95%] rounded-full bg-teal-100/20 blur-[65px]"
            style={{ opacity: config.smokeOpacity }}
          />
        </>
      )}

      {/* STEAM */}
      {isSteam && (
        <>
          {/* Heat glow from below */}
          <div
            className="absolute -bottom-[55%] left-[5%] h-full w-[90%] rounded-full bg-orange-400/15 blur-[95px]"
            style={{ opacity: config.smokeOpacity }}
          />

          {/* Large drifting steam clouds */}
          <div
            className="atmosphere-steam-left absolute -bottom-[45%] -left-[30%] h-[110%] w-[95%] rounded-full bg-stone-100/20 blur-[65px]"
            style={{ opacity: config.smokeOpacity }}
          />

          <div
            className="atmosphere-steam-right absolute -bottom-[50%] right-[-25%] h-[115%] w-[85%] rounded-full bg-stone-200/20 blur-[75px]"
            style={{ opacity: config.smokeOpacity * 0.8 }}
          />

          <div
            className="atmosphere-steam-center absolute -bottom-[55%] left-[25%] h-[90%] w-[50%] rounded-full bg-orange-100/15 blur-[55px]"
            style={{ opacity: config.smokeOpacity * 0.7 }}
          />
        </>
      )}

      {/* PARTICLES */}
      {!isSteam &&
        particles.slice(0, config.count).map((particle) => {
          const size = isUnderwater
            ? particle.size * 1.1
            : isFrost
              ? particle.size * config.snowScale
              : particle.size;

          return (
            <span
              key={particle.id}
              className={
                isEmbers
                  ? "atmosphere-ember"
                  : isFrost
                    ? "atmosphere-snow"
                    : "atmosphere-underwater-particle"
              }
              style={
                {
                  left: `${particle.x}%`,
                  top: isUnderwater ? `${particle.y}%` : undefined,
                  width: size,
                  height: size,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${
                    particle.duration *
                    (isFrost ? config.snowSpeed : isUnderwater ? 2.5 : 1)
                  }s`,
                  "--particle-drift": `${
                    particle.drift *
                    (intensity === "dramatic" && isFrost ? 1.8 : 1)
                  }px`,
                  "--particle-opacity": isEmbers
                    ? 0.85
                    : isUnderwater
                      ? config.snowOpacity * 0.85
                      : config.snowOpacity,
                } as CSSProperties
              }
            />
          );
        })}

      <style jsx>{`
        .atmosphere-ember,
        .atmosphere-snow,
        .atmosphere-underwater-particle {
          position: absolute;
          display: block;
          border-radius: 9999px;
          will-change: transform, opacity;
        }

        .atmosphere-ember {
          bottom: -8%;
          top: auto !important;
          background: #ffcc73;
          box-shadow: 0 0 8px 2px rgba(255, 122, 35, 0.65);
          animation: ember-rise linear infinite;
        }

        .atmosphere-snow {
          top: -8%;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 0 7px rgba(200, 235, 255, 0.7);
          animation: snow-fall linear infinite;
        }

        .atmosphere-underwater-particle {
          background: rgba(220, 250, 255, 0.95);
          box-shadow:
            0 0 6px 2px rgba(170, 235, 255, 0.55),
            0 0 14px rgba(130, 220, 255, 0.25);

          animation: underwater-drift ease-in-out infinite alternate;
        }
        .atmosphere-smoke-top {
          animation: smoke-drift 18s ease-in-out infinite alternate;
        }

        .atmosphere-smoke-top-delayed {
          animation: smoke-drift 25s ease-in-out -9s infinite alternate-reverse;
        }

        .atmosphere-smoke-middle {
          animation: smoke-drift 22s ease-in-out -5s infinite alternate;
        }

        .atmosphere-frost-haze {
          animation: smoke-drift 22s ease-in-out infinite alternate;
        }

        .atmosphere-light-ray {
          animation: light-sway 20s ease-in-out infinite alternate;
        }

        .atmosphere-light-ray-delayed {
          animation: light-sway 26s ease-in-out -8s infinite alternate-reverse;
        }

        .atmosphere-underwater-haze {
          animation: smoke-drift 28s ease-in-out infinite alternate;
        }

        .atmosphere-underwater-haze-delayed {
          animation: smoke-drift 34s ease-in-out -12s infinite alternate-reverse;
        }

        .atmosphere-steam-left {
          animation: steam-rise-left 16s ease-in-out infinite alternate;
        }

        .atmosphere-steam-right {
          animation: steam-rise-right 20s ease-in-out -7s infinite alternate;
        }

        .atmosphere-steam-center {
          animation: steam-rise-left 23s ease-in-out -10s infinite alternate;
        }

        @keyframes ember-rise {
          0% {
            transform: translate3d(0, 0, 0) scale(0.65);
            opacity: 0;
          }
          12% {
            opacity: var(--particle-opacity);
          }
          85% {
            opacity: 0.55;
          }
          100% {
            transform: translate3d(var(--particle-drift), -550px, 0) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes snow-fall {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          12% {
            opacity: var(--particle-opacity);
          }
          85% {
            opacity: var(--particle-opacity);
          }
          100% {
            transform: translate3d(var(--particle-drift), 550px, 0);
            opacity: 0;
          }
        }

        @keyframes underwater-drift {
          0% {
            transform: translate3d(-10px, 18px, 0) scale(0.7);
            opacity: 0;
          }
          30% {
            opacity: var(--particle-opacity);
          }
          70% {
            opacity: var(--particle-opacity);
          }
          100% {
            transform: translate3d(var(--particle-drift), -35px, 0) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes smoke-drift {
          from {
            transform: translate3d(-8%, 4%, 0) scale(0.95);
          }
          to {
            transform: translate3d(12%, -14%, 0) scale(1.15);
          }
        }

        @keyframes light-sway {
          from {
            transform: rotate(13deg) translateX(-8%);
          }
          to {
            transform: rotate(22deg) translateX(10%);
          }
        }

        @keyframes steam-rise-left {
          from {
            transform: translate3d(-10%, 12%, 0) scale(0.9);
          }
          to {
            transform: translate3d(12%, -30%, 0) scale(1.2);
          }
        }

        @keyframes steam-rise-right {
          from {
            transform: translate3d(10%, 15%, 0) scale(0.9);
          }
          to {
            transform: translate3d(-15%, -35%, 0) scale(1.25);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .atmosphere-ember,
          .atmosphere-snow,
          .atmosphere-underwater-particle,
          .atmosphere-smoke-top,
          .atmosphere-smoke-top-delayed,
          .atmosphere-smoke-middle,
          .atmosphere-frost-haze,
          .atmosphere-light-ray,
          .atmosphere-light-ray-delayed,
          .atmosphere-underwater-haze,
          .atmosphere-underwater-haze-delayed,
          .atmosphere-steam-left,
          .atmosphere-steam-right,
          .atmosphere-steam-center {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
