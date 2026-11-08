"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Microscope,
  ScanLine,
  ShieldCheck,
} from "lucide-react";

const modules = [
  {
    number: "01",
    tag: "GENETIK / ÄRFTLIGHET",
    title: "Genlabbet",
    description:
      "Experimentera med gener och upptäck hur egenskaper ärvs hos marsvin, kaniner och möss.",
    href: "/museum/cell-explorer/forskningsstation/genlabbet",
    accent: "cyan" as const,
  },
  {
    number: "02",
    tag: "CELLBIOLOGI / UNDERSÖKNING",
    title: "Celldetektiverna",
    description:
      "Undersök fyra celltyper, samla ledtrådar och lös sex biologiska mysterier.",
    href: "/museum/cell-explorer/celldetektiverna",
    accent: "amber" as const,
  },
];

function DnaPreview() {
  return (
    <svg
      viewBox="0 0 360 190"
      className="h-full w-full"
      role="img"
      aria-label="Illustration av en DNA-dubbelhelix"
    >
      <defs>
        <linearGradient id="dnaLine" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#7ce4d5" />
          <stop offset="1" stopColor="#68aef0" />
        </linearGradient>
        <radialGradient id="dnaHalo">
          <stop stopColor="#43b9ca" stopOpacity=".28" />
          <stop offset="1" stopColor="#43b9ca" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="95" rx="150" ry="83" fill="url(#dnaHalo)" />
      <g className="bio-dna" fill="none" strokeLinecap="round">
        <path
          d="M55 98 C100 10 140 10 180 95 S260 180 305 92"
          stroke="url(#dnaLine)"
          strokeWidth="5"
        />
        <path
          d="M55 92 C100 180 140 180 180 95 S260 10 305 98"
          stroke="#b8c4f4"
          strokeWidth="5"
        />
        {Array.from({ length: 15 }, (_, i) => {
          const x = 58 + i * 17.5;
          const phase = ((x - 55) / 250) * Math.PI * 2;
          const y1 = 95 - 44 * Math.cos(phase);
          const y2 = 95 + 44 * Math.cos(phase);
          return (
            <line
              key={i}
              x1={x}
              y1={y1}
              x2={x}
              y2={y2}
              stroke={i % 2 === 0 ? "#8de1d2" : "#8eacd8"}
              strokeWidth="2.5"
              opacity=".72"
            />
          );
        })}
      </g>
      <g fill="#9dd8df" opacity=".7">
        <circle cx="42" cy="35" r="2" />
        <circle cx="324" cy="147" r="2" />
        <circle cx="293" cy="35" r="1.5" />
      </g>
      <path
        d="M20 24 H52 M20 24 V45 M340 24 H308 M340 24 V45 M20 166 H52 M20 166 V145 M340 166 H308 M340 166 V145"
        stroke="#5e9fac"
        opacity=".45"
        fill="none"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CellPreview() {
  return (
    <svg
      viewBox="0 0 360 190"
      className="h-full w-full"
      role="img"
      aria-label="Illustration av en djurcell med cellkärna och organeller"
    >
      <defs>
        <radialGradient id="cellFill">
          <stop stopColor="#47767e" stopOpacity=".65" />
          <stop offset="1" stopColor="#163947" stopOpacity=".75" />
        </radialGradient>
        <radialGradient id="cellHalo">
          <stop stopColor="#d3a46e" stopOpacity=".20" />
          <stop offset="1" stopColor="#d3a46e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="95" rx="140" ry="85" fill="url(#cellHalo)" />
      <g className="bio-cell">
        <path
          d="M82 92 C70 42 120 24 174 34 C216 16 280 42 285 88 C298 143 253 162 204 156 C151 176 90 148 82 92Z"
          fill="url(#cellFill)"
          stroke="#8acdc9"
          strokeWidth="2.5"
        />
        <path
          d="M163 71 C185 49 223 64 229 89 C236 116 208 137 182 125 C156 122 148 94 163 71Z"
          fill="#5d6d92"
          fillOpacity=".7"
          stroke="#bdc7e7"
          strokeWidth="2"
        />
        <ellipse
          cx="195"
          cy="96"
          rx="13"
          ry="11"
          fill="#b7a2cf"
          opacity=".85"
        />
        {[
          [117, 84, -30],
          [249, 110, 22],
          [144, 130, 30],
          [247, 66, -35],
        ].map(([x, y, rot], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <ellipse
              rx="17"
              ry="9"
              fill="#c58f5b"
              stroke="#efc18d"
              strokeWidth="1.6"
            />
            <path
              d="M-11 -2 Q-5 6 0 -2 T11 -2"
              fill="none"
              stroke="#ffddb3"
              strokeWidth="1.6"
            />
          </g>
        ))}
        <path
          d="M113 110 Q129 96 144 109 M118 118 Q136 106 151 118 M223 139 Q239 129 254 139"
          fill="none"
          stroke="#8ac4bd"
          strokeWidth="2"
          opacity=".8"
        />
        {[
          [143, 60],
          [258, 88],
          [160, 144],
          [108, 105],
          [231, 51],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#d5bf84" />
        ))}
      </g>
      <path
        d="M20 24 H52 M20 24 V45 M340 24 H308 M340 24 V45 M20 166 H52 M20 166 V145 M340 166 H308 M340 166 V145"
        stroke="#a18c69"
        opacity=".5"
        fill="none"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function ResearchStationsPage() {
  const [activated, setActivated] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setActivated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main className="bio-terminal relative isolate min-h-[100dvh] overflow-hidden bg-[#07151f] text-[#e7f4f5]">
      <div
        className="pointer-events-none absolute inset-0 bio-grid opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-280px] h-[620px] w-[800px] max-w-[100vw] -translate-x-1/2 rounded-full bg-[#135768]/20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-280px] right-[-120px] h-[550px] w-[550px] rounded-full bg-[#426a60]/10 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-[#83e5e2] to-transparent shadow-[0_0_22px_#71d5da] bio-scan ${activated ? "bio-scan-on" : ""}`}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1320px] flex-col px-4 pb-7 pt-5 sm:px-7 sm:pt-7 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#6bb8bc]/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7ad6d4]/30 bg-[#123641]/70 shadow-[inset_0_0_16px_#3da9b31a]">
              <Microscope className="h-5 w-5 text-[#9be5db]" />
            </span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[.24em] text-[#7fa9b6] sm:text-[10px]">
                The Unfolding Universe / Museum
              </p>
              <p className="text-xs font-bold uppercase tracking-[.13em] text-[#e5f3f2] sm:text-sm">
                Biologiska forskningsstationen
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#63a99e]/25 bg-[#0c2b30]/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#91dbc2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#86e4b6] shadow-[0_0_10px_#86e4b6]" />{" "}
            System aktivt
          </div>
        </header>

        <div
          className={`bio-enter ${activated ? "bio-enter-on" : ""} flex flex-1 flex-col justify-center py-8 sm:py-10`}
        >
          <div className="mb-7 max-w-2xl sm:mb-9">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.22em] text-[#88c5c8]">
              <ScanLine className="h-4 w-4" /> Forskningsarkiv / 02 aktiva
              stationer
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#f1f7f3] sm:text-4xl lg:text-5xl">
              Vad vill du <span className="text-[#9adfd5]">undersöka?</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#a9c5ce] sm:text-base">
              Välj en forskningsstation, utför experiment och upptäck hur livet
              fungerar — från gener till cellernas minsta delar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {modules.map((mod, index) => {
              const amber = mod.accent === "amber";
              return (
                <Link
                  key={mod.number}
                  href={mod.href}
                  className={`bio-module group relative flex min-h-[340px] flex-col overflow-hidden rounded-[22px] border bg-[#0d2733]/90 transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9ce4dc] sm:min-h-[390px] ${amber ? "border-[#a28a65]/35 hover:border-[#e2bd85]/70 hover:shadow-[0_15px_55px_#d3a46715]" : "border-[#5aafb7]/35 hover:border-[#9de2e3]/70 hover:shadow-[0_15px_55px_#4bd3d81b]"}`}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="flex items-center justify-between gap-2 px-5 pt-5 sm:px-6 sm:pt-6">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[.18em] ${amber ? "text-[#e0ba88]" : "text-[#8bd6dd]"}`}
                    >
                      Station {mod.number}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[.1em] text-[#92bcb8]">
                      <Check className="h-3.5 w-3.5" /> Tillgänglig
                    </span>
                  </div>
                  <div className="relative mx-5 mt-4 h-[145px] overflow-hidden rounded-xl border border-[#83a9b0]/10 bg-[#071d29]/65 sm:mx-6 sm:h-[170px]">
                    <div className="pointer-events-none absolute inset-0 bio-preview-grid opacity-45" />
                    {amber ? <CellPreview /> : <DnaPreview />}
                    <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-[#89abb6]">
                      <Activity className="h-3 w-3" /> LIVE PREVIEW
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                    <p
                      className={`mb-1.5 text-[10px] font-bold uppercase tracking-[.17em] ${amber ? "text-[#d7b78d]" : "text-[#88c8d0]"}`}
                    >
                      {mod.tag}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight text-[#f4f5f0] sm:text-[27px]">
                      {mod.title}
                    </h2>
                    <p className="mt-2 max-w-[40ch] text-[13px] leading-relaxed text-[#aac6ce]">
                      {mod.description}
                    </p>
                    <div
                      className={`mt-auto flex items-center justify-between border-t pt-4 ${amber ? "border-[#b49a72]/20" : "border-[#6aa9b1]/20"}`}
                    >
                      <span
                        className={`text-xs font-bold ${amber ? "text-[#edc48e]" : "text-[#a3e6e1]"}`}
                      >
                        Öppna forskningsstation
                      </span>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 ${amber ? "border-[#d9b884]/35 bg-[#7b5a34]/20 text-[#edc48e]" : "border-[#79cbd0]/35 bg-[#24616b]/25 text-[#a3e6e1]"}`}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#6bb8bc]/20 pt-4 text-[10px] uppercase tracking-[.13em] text-[#719ba9]">
          <Link
            href="/museum/cell-explorer"
            className="inline-flex items-center gap-2 rounded-md py-1 text-[#b6d5d8] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9ce4dc]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Tillbaka till cellmuseet
          </Link>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5" /> 02 forskningsstationer
            online
          </span>
        </footer>
      </div>
      <style jsx global>{`
        .bio-grid {
          background-image:
            linear-gradient(#7ac6c609 1px, transparent 1px),
            linear-gradient(90deg, #7ac6c609 1px, transparent 1px);
          background-size: 42px 42px;
        }
        .bio-preview-grid {
          background-image:
            linear-gradient(#8ebbc80c 1px, transparent 1px),
            linear-gradient(90deg, #8ebbc80c 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .bio-scan {
          opacity: 0;
          transform: translateY(0);
        }
        .bio-scan-on {
          animation: bioScan 0.65s ease-out forwards;
        }
        .bio-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        .bio-enter-on {
          animation: bioEnter 0.48s ease-out 0.14s both;
        }
        .bio-dna {
          transform-origin: 50% 50%;
          animation: bioFloat 5s ease-in-out infinite;
        }
        .bio-cell {
          transform-origin: 50% 50%;
          animation: bioBreathe 5.5s ease-in-out infinite;
        }
        @keyframes bioScan {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          25% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateY(100dvh);
          }
        }
        @keyframes bioEnter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bioFloat {
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes bioBreathe {
          50% {
            transform: scale(1.035);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bio-scan-on,
          .bio-enter-on,
          .bio-dna,
          .bio-cell {
            animation: none !important;
          }
          .bio-enter {
            opacity: 1;
            transform: none;
          }
          .bio-module {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
