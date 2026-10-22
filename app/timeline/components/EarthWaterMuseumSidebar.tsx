import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Droplets, FlaskConical, Sparkles } from "lucide-react";

const MUSEUM_HREF = "/museum/water-cycle";

export default function EarthWaterMuseumSidebar() {
  return (
    <Link
      href={MUSEUM_HREF}
      aria-label="Besök det interaktiva museet och utforska vattnets kretslopp"
      className="group relative block overflow-hidden rounded-[24px] border border-[#456b67]/60 bg-[#102e32] text-white shadow-[0_16px_36px_-22px_rgba(14,46,49,.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-20px_rgba(14,46,49,.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#328b7a] motion-reduce:transform-none"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(106,196,166,.14),transparent_65%)]" />

      {/* Static museum illustration with a soft weather overlay. */}
      <div className="relative h-[228px] overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#214d53] via-[#123940] to-[#0b2830]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5c77e]/10 blur-3xl" />

        <Image
          src="/images/museum/water-museum-building.webp"
          alt="Ett upplyst naturhistoriskt museum med glaskupol och en bäck som rinner framför byggnaden"
          fill
          sizes="(max-width: 1024px) 100vw, 290px"
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none"
        />

        {/* Atmospheric mist and rainfall. The museum artwork remains static. */}
        <svg
          viewBox="0 0 320 228"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            {/* Noise breaks up the silhouette so the cloud reads as fog, not circles. */}
            <filter
              id="museum-fog-texture"
              x="-35%"
              y="-70%"
              width="170%"
              height="240%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035 0.075"
                numOctaves="3"
                seed="8"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="17"
                xChannelSelector="R"
                yChannelSelector="G"
              />
              <feGaussianBlur stdDeviation="4.2" />
            </filter>
            <radialGradient id="museum-fog-core">
              <stop offset="0" stopColor="#d6e3e2" stopOpacity=".69" />
              <stop offset=".42" stopColor="#bed3d4" stopOpacity=".44" />
              <stop offset=".8" stopColor="#a9c4c8" stopOpacity=".17" />
              <stop offset="1" stopColor="#a9c4c8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="museum-rain-streak" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#ccefff" stopOpacity="0" />
              <stop offset=".5" stopColor="#ccefff" stopOpacity=".78" />
              <stop offset="1" stopColor="#ccefff" stopOpacity=".12" />
            </linearGradient>
            <clipPath id="museum-rain-center">
              {/* Rain reaches the middle of the stream, not the left margin. */}
              <path d="M95 65 H237 L229 202 Q170 215 107 202 Z" />
            </clipPath>
          </defs>

          {/* Several irregular, blurred layers create denser and thinner fog pockets. */}
          <g className="museum-fog-drift" filter="url(#museum-fog-texture)">
            <path
              d="M55 83 C45 66 66 45 91 52 C104 31 139 35 153 52 C175 40 203 54 207 72 C229 83 205 101 181 96 C155 109 124 96 109 103 C82 105 56 99 55 83Z"
              fill="url(#museum-fog-core)"
            />
            <path
              d="M88 75 C94 52 117 50 134 61 C148 47 179 58 181 75 C173 94 143 88 128 94 C108 93 89 91 88 75Z"
              fill="url(#museum-fog-core)"
              opacity=".86"
            />
            <path
              d="M132 60 C145 42 171 45 184 57 C199 51 217 63 217 77 C205 90 180 87 168 84 C150 91 132 78 132 60Z"
              fill="url(#museum-fog-core)"
              opacity=".73"
            />
          </g>

          <g
            clipPath="url(#museum-rain-center)"
            stroke="url(#museum-rain-streak)"
            strokeWidth="1.15"
            strokeLinecap="round"
          >
            {Array.from({ length: 32 }, (_, i) => {
              const x = 108 + ((i * 47) % 119);
              const delay = -((i * 0.37) % 2.7);
              const duration = 1.45 + (i % 5) * 0.17;
              return (
                <path
                  key={i}
                  d={`M${x} ${78 + (i % 5) * 4} l-3 13`}
                  className="museum-falling-rain"
                  style={{
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              );
            })}
          </g>

          {/* Ripple locations correspond to the central foreground water. */}
          <g fill="none" stroke="#c7f3ff" strokeWidth="1.05">
            {[
              { x: 131, y: 200, delay: "0s" },
              { x: 158, y: 209, delay: "-.65s" },
              { x: 189, y: 211, delay: "-1.4s" },
              { x: 214, y: 203, delay: "-2.1s" },
            ].map((r) => (
              <g key={r.x} transform={`translate(${r.x} ${r.y})`}>
                <ellipse
                  rx="6"
                  ry="1.8"
                  className="museum-rain-ripple"
                  style={{ animationDelay: r.delay }}
                />
                <ellipse
                  rx="6"
                  ry="1.8"
                  className="museum-rain-ripple"
                  style={{ animationDelay: `calc(${r.delay} - 1.4s)` }}
                />
              </g>
            ))}
          </g>
        </svg>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#102e32]/80 to-transparent" />
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#c4f2d5]/25 bg-[#09262c]/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-[#a8efcf] backdrop-blur-sm">
          <Sparkles size={11} /> Interaktivt museum
        </div>
      </div>

      <div className="relative px-5 pb-5 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[.19em] text-[#9cdbc4]">
          Tre experiment väntar
        </p>
        <h2 className="mt-2 font-serif text-[26px] font-semibold leading-[1.12] tracking-tight text-[#fff7e9]">
          Kliv in och upptäck vattnets värld
        </h2>
        <p className="mt-3 text-[13px] leading-[1.65] text-[#c6d7d3]">
          Följ en vattendroppe, skapa eget väder och se hur regnet ger liv åt
          växter.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-medium text-[#d3e9e1]">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1">
            <Droplets size={12} /> Vattnets väg
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1">
            <FlaskConical size={12} /> Laboratorium
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between rounded-xl bg-[#f0cf90] px-4 py-3 text-sm font-bold text-[#233b37] transition-colors group-hover:bg-[#ffe3a9]">
          Utforska museet
          <ArrowUpRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
          />
        </div>
      </div>

      <style>{`
        @keyframes museum-fog-drift {
          0%, 100% { transform: translateX(-3px); opacity: .1; }
          50% { transform: translateX(8px); opacity: 1; }
        }
        @keyframes museum-rain-fall {
          0% { transform: translate(0, -15px); opacity: 0; }
          12% { opacity: .72; }
          85% { opacity: .72; }
          100% { transform: translate(-7px, 135px); opacity: 0; }
        }
        @keyframes museum-ripple-expand {
          0% { transform: scale(.18); opacity: 0; }
          15% { opacity: .8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .museum-fog-drift { animation: museum-fog-drift 14s ease-in-out infinite; }
          .museum-falling-rain { animation: museum-rain-fall 1.6s linear infinite; }
          .museum-rain-ripple { animation: museum-ripple-expand 2.6s ease-out infinite; transform-box: fill-box; transform-origin: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .museum-falling-rain, .museum-rain-ripple { opacity: 0; }
        }
      `}</style>
    </Link>
  );
}
