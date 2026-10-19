"use client";

import { useEffect, useState, type CSSProperties } from "react";

type AtmosphereMode = "embers" | "frost";
type Intensity = "subtle" | "normal" | "dramatic";

type ArticleAtmosphereProps = {
  mode: AtmosphereMode;
  intensity?: Intensity;
};

// Fixed values keep the particles stable between renders (and avoid hydration issues).
const particles = Array.from({ length: 68 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
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

  const isEmbers = mode === "embers";
  const config = settings[intensity];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {isEmbers ? (
        <>
          {/* Warm glow near the lower edge. */}
          <div className="absolute -bottom-1/2 left-[-15%] h-full w-[85%] rounded-full bg-orange-500/10 blur-[90px]" />

          {/* Wisps of smoke across the TOP of the hero. */}
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
      ) : (
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

      {particles.slice(0, config.count).map((particle) => (
        <span
          key={particle.id}
          className={isEmbers ? "atmosphere-ember" : "atmosphere-snow"}
          style={
            {
              left: `${particle.x}%`,
              width: isEmbers
                ? particle.size
                : particle.size * config.snowScale,
              height: isEmbers
                ? particle.size
                : particle.size * config.snowScale,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration * (isEmbers ? 1 : config.snowSpeed)}s`,
              "--particle-drift": `${particle.drift * (intensity === "dramatic" && !isEmbers ? 1.8 : 1)}px`,
              "--particle-opacity": isEmbers ? 0.85 : config.snowOpacity,
            } as CSSProperties
          }
        />
      ))}

      <style jsx>{`
        .atmosphere-ember,
        .atmosphere-snow {
          position: absolute;
          display: block;
          border-radius: 9999px;
          will-change: transform, opacity;
        }
        .atmosphere-ember {
          bottom: -8%;
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
        @keyframes smoke-drift {
          from {
            transform: translate3d(-8%, 4%, 0) scale(0.95);
          }
          to {
            transform: translate3d(12%, -14%, 0) scale(1.15);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .atmosphere-ember,
          .atmosphere-snow,
          .atmosphere-smoke-top,
          .atmosphere-smoke-top-delayed,
          .atmosphere-smoke-middle,
          .atmosphere-frost-haze {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
