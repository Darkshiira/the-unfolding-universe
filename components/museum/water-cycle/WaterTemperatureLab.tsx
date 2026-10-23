"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Droplets,
  RotateCcw,
  Snowflake,
  Thermometer,
  Waves,
  Wind,
  X,
} from "lucide-react";

type Props = { onClose: () => void };
type Phase = "ice" | "water" | "steam";

const surfaceBubbles = Array.from({ length: 18 }, (_, i) => ({
  left: 7 + ((i * 43 + 17) % 86),
  size: 5 + ((i * 7) % 12),
  delay: -((i * 11) % 29) / 10,
  duration: 0.85 + (i % 5) * 0.19,
}));

const particles = Array.from({ length: 16 }, (_, i) => ({
  left: 12 + ((i * 47 + 13) % 76),
  delay: -((i * 13) % 25) / 10,
  duration: 2.2 + (i % 5) * 0.35,
}));

export default function WaterTemperatureLab({ onClose }: Props) {
  const [temperature, setTemperature] = useState(22);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const phase: Phase =
    temperature < 0 ? "ice" : temperature >= 100 ? "steam" : "water";
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const smooth = (v: number) => {
    const t = clamp(v);
    return t * t * (3 - 2 * t);
  };
  const bubbleIntensity = smooth((temperature - 55) / 45);
  const mistIntensity = smooth((temperature - 65) / 55);
  // Surface activity increases continuously as water approaches boiling.
  const surfaceBoil = smooth((temperature - 72) / 32);
  // An illustrative freezing front progresses from the exposed surface
  // downwards, while frost slowly forms against the glass walls.
  const freezeProgress = 1 - smooth((temperature + 12) / 14);
  const edgeFrost = smooth(freezeProgress * 1.8);
  const iceOpacity = 0.45 + freezeProgress * 0.55;
  const waterOpacity =
    (1 - smooth((temperature - 95) / 25) * 0.75) * (1 - freezeProgress * 0.16);
  const waterHeight = 61 - smooth((temperature - 90) / 30) * 30;
  const progress = ((temperature + 20) / 140) * 100;
  const phaseInfo = {
    ice: {
      title: "Fast form · Is",
      subtitle:
        "Vattenmolekylerna sitter i en ordnad struktur och vibrerar på plats.",
      accent: "text-sky-200",
      detail:
        "Vid normalt lufttryck är vatten oftast fruset under 0 °C. Is har en öppen kristallstruktur och är därför mindre tät än flytande vatten.",
    },
    water: {
      title: "Flytande form · Vatten",
      subtitle: "Molekylerna rör sig och glider förbi varandra.",
      accent: "text-cyan-200",
      detail:
        "Mellan ungefär 0 och 100 °C är vatten vanligen flytande vid normalt lufttryck. Vatten kan avdunsta även när det inte kokar.",
    },
    steam: {
      title: "Gasform · Vattenånga",
      subtitle: "Molekylerna rör sig fritt och sprids i luften.",
      accent: "text-amber-200",
      detail:
        "Vid normalt lufttryck kokar vatten vid ungefär 100 °C. Själva vattenångan är osynlig – den vita dimma man kan se består av små flytande vattendroppar.",
    },
  }[phase];

  return (
    <section
      className="museum-lab-shell pointer-events-auto absolute inset-0 z-20 overflow-y-auto bg-[#061724]/95 px-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-20 text-white backdrop-blur-xl sm:px-8 sm:pt-24"
      aria-label="Experimentera med vattnets temperatur"
    >
      <style>{`
        @keyframes labFloat { from { transform: translateY(18px) scale(.65); opacity: 0; } 30% { opacity: .7; } to { transform: translateY(-200px) scale(1.35); opacity: 0; } }
        @keyframes labBubble { from { transform: translateY(0) scale(.7); opacity: .2; } 45% { opacity: .8; } to { transform: translateY(-140px) scale(1.2); opacity: 0; } }
        @keyframes labSurfaceBubble {
          0% { transform: translate(-50%, 0) scale(.45); opacity: 0; }
          24% { opacity: .75; }
          70% { opacity: .9; }
          100% { transform: translate(-50%, -13px) scale(1.4); opacity: 0; }
        }
        @keyframes labSurfaceRipple {
          0% { transform: translate(-50%, -50%) scale(.3); opacity: 0; }
          30% { opacity: .7; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        @keyframes labShimmer { 0%,100% { transform: translateY(0) } 50% { transform: translateY(5px) } }
        .lab-range { appearance: none; -webkit-appearance: none; height: 10px; border-radius: 999px; border: 1px solid rgba(165,243,252,.4); }
        .lab-range::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #22d3ee; border: 3px solid #e0fbff; box-shadow: 0 0 0 3px rgba(34,211,238,.16); cursor: grab; }
        .lab-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #22d3ee; border: 3px solid #e0fbff; cursor: grab; }
        @media (prefers-reduced-motion: reduce) { .lab-motion { animation: none !important; } }
      `}</style>
      <div className="museum-lab-inner mx-auto max-w-5xl">
        <div className="museum-lab-heading flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.25em] text-teal-300">
              03 · Experimentera / Laboratorium 01
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-5xl">
              Vattnets tre former
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Ändra temperaturen och upptäck hur vatten förändras mellan is,
              vätska och gas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng experimentet"
            className="museum-temp-close rounded-full border border-white/20 bg-white/10 p-3 transition hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <div className="museum-temp-layout mt-7 grid items-start gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="museum-temp-scene relative flex h-[min(480px,65dvh)] min-h-[320px] items-center justify-center overflow-hidden rounded-[30px] sm:h-[550px] lg:h-[590px] border border-cyan-200/20 bg-[radial-gradient(ellipse_at_50%_80%,#18556a_0%,#0b293b_44%,#071b2b_85%)] sm:min-h-[450px]">
            <div className="museum-temp-scene-label absolute left-5 top-5 flex items-center gap-2 text-xs font-medium text-white/60">
              <Droplets size={15} /> Simulerad vattenbehållare
            </div>
            <div className="absolute bottom-9 h-5 w-64 rounded-[100%] bg-black/40 blur-xl" />
            <div className="museum-temp-glass relative mt-0 -translate-y-12 h-64 w-52 sm:h-72 sm:w-60 lg:-translate-y-10">
              {/* Rim and transparent glass */}
              <div className="absolute inset-x-1 bottom-0 top-3 overflow-hidden rounded-b-[42px] border-x-[3px] border-b-[4px] border-cyan-100/45 bg-white/[.035] shadow-[inset_16px_0_20px_-14px_rgba(255,255,255,.32),inset_-12px_0_20px_-15px_rgba(255,255,255,.25),0_25px_50px_rgba(0,0,0,.25)]">
                <div className="absolute left-3 top-4 z-10 h-[75%] w-2 rounded-full bg-white/10 blur-[2px]" />
                {/* Water, bubbles and ice are layered to allow gradual visual changes. */}
                <div
                  className="absolute inset-x-0 bottom-0 overflow-hidden bg-gradient-to-b from-cyan-300/65 via-sky-500/70 to-blue-700/80"
                  style={{
                    height: `${waterHeight}%`,
                    opacity: waterOpacity,
                    transition: "height 400ms ease-out, opacity 400ms ease-out",
                  }}
                >
                  <div
                    className="lab-motion absolute -top-2 h-5 w-full rounded-[50%] border-t-2 border-cyan-100/75 bg-cyan-200/35"
                    style={{ animation: "labShimmer 3s ease-in-out infinite" }}
                  />
                  {/* Boiling breaks the water surface: small bubbles burst and
                      leave expanding circular ripples. This layer is anchored
                      to the actual waterline and clipped inside the vessel. */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8"
                    style={{
                      opacity: surfaceBoil,
                      transition: "opacity 450ms ease-out",
                    }}
                    aria-hidden="true"
                  >
                    {surfaceBubbles.map((bubble, i) => (
                      <span
                        key={i}
                        className="lab-motion absolute top-1 rounded-full border border-cyan-50/90 bg-cyan-100/20 shadow-[0_0_6px_rgba(224,251,255,.45)]"
                        style={{
                          left: `${bubble.left}%`,
                          width: `${bubble.size}px`,
                          height: `${Math.max(4, bubble.size * 0.45)}px`,
                          animation: `labSurfaceBubble ${bubble.duration}s ${bubble.delay}s infinite ease-out`,
                        }}
                      />
                    ))}
                    {surfaceBubbles
                      .filter((_, i) => i % 3 === 0)
                      .map((bubble, i) => (
                        <span
                          key={`ripple-${i}`}
                          className="lab-motion absolute top-2 h-2 w-5 rounded-[50%] border border-white/60"
                          style={{
                            left: `${bubble.left}%`,
                            animation: `labSurfaceRipple ${bubble.duration * 1.4}s ${bubble.delay}s infinite ease-out`,
                          }}
                        />
                      ))}
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: bubbleIntensity,
                      transition: "opacity 250ms",
                    }}
                  >
                    {particles.map((p, i) => (
                      <span
                        key={i}
                        className="lab-motion absolute bottom-0 h-2.5 w-2.5 rounded-full border border-white/65 bg-white/20"
                        style={{
                          left: `${p.left}%`,
                          animation: `labBubble ${p.duration}s ${p.delay}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* A single continuous mass of frozen water, not separate cubes.
                    The frozen volume expands slightly and develops cloudy,
                    irregular internal textures, while retaining clear patches. */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
                  style={{
                    height: `${waterHeight * (1 + 0.085 * freezeProgress)}%`,
                    opacity: iceOpacity,
                    // Reveal ice from the surface down rather than switching
                    // the entire body of water to solid at once.
                    clipPath: `inset(0 0 ${100 - freezeProgress * 100}% 0)`,
                    transition:
                      "height 600ms ease-out, opacity 600ms ease-out, clip-path 600ms ease-out",
                  }}
                >
                  <svg
                    viewBox="0 0 240 180"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="lab-solid-ice"
                        x1="0"
                        y1="0"
                        x2=".85"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#d7f6ff"
                          stopOpacity=".87"
                        />
                        <stop
                          offset="22%"
                          stopColor="#80b9d1"
                          stopOpacity=".64"
                        />
                        <stop
                          offset="52%"
                          stopColor="#3c7899"
                          stopOpacity=".45"
                        />
                        <stop
                          offset="80%"
                          stopColor="#9fd6e5"
                          stopOpacity=".76"
                        />
                        <stop
                          offset="100%"
                          stopColor="#d7f3f8"
                          stopOpacity=".91"
                        />
                      </linearGradient>
                      <linearGradient
                        id="lab-ice-frost"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#f6ffff"
                          stopOpacity=".9"
                        />
                        <stop
                          offset="48%"
                          stopColor="#d9f4fc"
                          stopOpacity=".3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#f4ffff"
                          stopOpacity=".85"
                        />
                      </linearGradient>
                      <radialGradient id="lab-ice-clear">
                        <stop
                          offset="0%"
                          stopColor="#123e59"
                          stopOpacity=".48"
                        />
                        <stop
                          offset="70%"
                          stopColor="#447e98"
                          stopOpacity=".2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#e8fbff"
                          stopOpacity="0"
                        />
                      </radialGradient>
                      <filter
                        id="lab-ice-cloud"
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
                      >
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency=".028 .065"
                          numOctaves="3"
                          seed="9"
                          result="noise"
                        />
                        <feColorMatrix
                          in="noise"
                          type="saturate"
                          values="0"
                          result="gray"
                        />
                        <feComponentTransfer in="gray" result="softCloud">
                          <feFuncA type="linear" slope=".48" intercept="-.13" />
                        </feComponentTransfer>
                      </filter>
                      <filter id="lab-ice-soften">
                        <feGaussianBlur stdDeviation="7" />
                      </filter>
                    </defs>
                    {/* Ice fills the vessel as one solid, level-topped mass. */}
                    <rect width="240" height="180" fill="url(#lab-solid-ice)" />
                    {/* Clearer regions and deep blue shadows add depth. */}
                    <ellipse
                      cx="115"
                      cy="65"
                      rx="105"
                      ry="67"
                      fill="url(#lab-ice-clear)"
                    />
                    <ellipse
                      cx="157"
                      cy="124"
                      rx="76"
                      ry="43"
                      fill="#164f6b"
                      opacity=".17"
                      filter="url(#lab-ice-soften)"
                    />
                    {/* Frosty microbubbles and organic veining, no geometric cracks. */}
                    <rect
                      width="240"
                      height="180"
                      fill="#f4feff"
                      filter="url(#lab-ice-cloud)"
                      opacity=".72"
                    />
                    <path
                      d="M0 16 C25 31 42 14 68 27 S111 52 138 32 S197 14 240 30 L240 0 L0 0Z"
                      fill="url(#lab-ice-frost)"
                      opacity=".42"
                    />
                    <path
                      d="M0 116 C36 101 55 140 88 125 S151 107 177 139 S221 141 240 126 L240 180 L0 180Z"
                      fill="#e8faff"
                      opacity=".24"
                      filter="url(#lab-ice-soften)"
                    />
                    <path
                      d="M12 0 C22 33 15 69 29 96 S27 149 38 180 M222 0 C210 40 226 67 215 111 S219 154 203 180"
                      fill="none"
                      stroke="#f2fdff"
                      strokeWidth="13"
                      strokeOpacity=".27"
                      filter="url(#lab-ice-soften)"
                    />
                    {/* Subtle trapped air bubbles inside the frozen water. */}
                    <g
                      fill="none"
                      stroke="#e9fbff"
                      strokeOpacity=".37"
                      strokeWidth="1"
                    >
                      <ellipse cx="62" cy="104" rx="2" ry="3" />
                      <ellipse cx="68" cy="114" rx="1.5" ry="2" />
                      <ellipse cx="148" cy="54" rx="2.5" ry="3" />
                      <ellipse cx="178" cy="96" rx="1.5" ry="2" />
                      <ellipse cx="104" cy="146" rx="2" ry="2.5" />
                    </g>
                    {/* A nearly flat frozen surface with a soft icy sheen. */}
                    <path
                      d="M0 3 Q120 -1 240 3"
                      fill="none"
                      stroke="#f1fdff"
                      strokeWidth="4"
                      strokeOpacity=".72"
                    />
                    <path
                      d="M0 8 Q120 5 240 8"
                      fill="none"
                      stroke="#a2e7f4"
                      strokeWidth="2"
                      strokeOpacity=".35"
                    />
                  </svg>
                </div>
                {/* Frost gathers on the cold inner glass, especially at the sides. */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[38px]"
                  style={{
                    height: `${waterHeight * (1 + 0.085 * freezeProgress)}%`,
                    opacity: edgeFrost * 0.7,
                    boxShadow:
                      "inset 11px 0 15px -8px rgba(235,251,255,.8), inset -11px 0 15px -8px rgba(235,251,255,.8), inset 0 -10px 18px -10px rgba(231,249,255,.65)",
                    transition: "height 600ms ease-out, opacity 600ms ease-out",
                  }}
                />
              </div>
              <div className="absolute inset-x-0 top-1 h-6 rounded-[50%] border-[3px] border-cyan-100/55 bg-[#0b293b]/75 shadow-[0_2px_10px_rgba(165,243,252,.15)]" />
              <div
                className="pointer-events-none absolute -top-24 inset-x-0 h-48"
                style={{ opacity: mistIntensity, transition: "opacity 400ms" }}
                aria-hidden="true"
              >
                {particles.slice(0, 10).map((p, i) => (
                  <span
                    key={i}
                    className="lab-motion absolute bottom-0 h-12 w-7 rounded-full bg-white/20 blur-xl"
                    style={{
                      left: `${p.left}%`,
                      animation: `labFloat ${p.duration + 1}s ${p.delay}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Reserved caption area BELOW the vessel; its height never changes. */}
            <div
              className={`museum-temp-caption pointer-events-none absolute inset-x-5 bottom-5 z-20 mx-auto flex h-[88px] max-w-[430px] items-center rounded-2xl border px-4 py-3 text-xs leading-5 shadow-xl backdrop-blur-xl transition-opacity duration-300 sm:h-[76px] ${
                temperature > -12 && temperature <= 2
                  ? "border-sky-200/30 bg-[#0b2b40]/90 text-sky-100 opacity-100"
                  : temperature >= 70 && temperature < 100
                    ? "border-amber-200/30 bg-[#28352e]/90 text-amber-100 opacity-100"
                    : "border-white/10 bg-[#0b2b40]/90 text-white opacity-0"
              }`}
              aria-hidden={
                !(
                  (temperature > -12 && temperature <= 2) ||
                  (temperature >= 70 && temperature < 100)
                )
              }
            >
              {temperature > -12 && temperature <= 2
                ? "Nära fryspunkten kan is börja bildas vid ytan och längs kalla väggar. Hur snabbt vattnet fryser beror också på tiden och omgivningen."
                : temperature >= 70 && temperature < 100
                  ? "Vattnet närmar sig kokpunkten. Bubblor och dimma ökar gradvis i visualiseringen. Kraftig kokning börjar omkring 100 °C vid normalt lufttryck."
                  : ""}
            </div>
            <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-[#061724]/60 px-3 py-2 text-[10px] text-white/60">
              Illustration · ej i skala
            </div>
          </div>

          <div className="museum-temp-controls flex flex-col gap-5">
            <div className="rounded-[26px] border border-white/15 bg-white/[.06] p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Thermometer size={18} className="text-cyan-300" /> Temperatur
                </span>
                <button
                  type="button"
                  onClick={() => setTemperature(22)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 transition hover:text-white"
                >
                  <RotateCcw size={14} /> Återställ
                </button>
              </div>
              <p
                className="mt-5 font-serif text-5xl font-bold tabular-nums sm:text-6xl"
                aria-live="off"
              >
                {temperature}
                <span className="ml-2 text-2xl text-white/55">°C</span>
              </p>
              <label
                htmlFor="water-temperature"
                className="mt-6 block text-xs font-semibold uppercase tracking-widest text-cyan-200"
              >
                Dra för att ändra temperaturen
              </label>
              <input
                id="water-temperature"
                type="range"
                min={-20}
                max={120}
                step={1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="lab-range mt-4 block w-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right,#8dd5ff ${progress}%,rgba(255,255,255,.2) ${progress}%)`,
                }}
                aria-valuetext={`${temperature} grader Celsius`}
              />
              <div
                className="relative mt-2 h-6 text-[11px] text-slate-400"
                aria-hidden="true"
              >
                {[-20, 0, 100, 120].map((value) => (
                  <span
                    key={value}
                    className="absolute top-0 whitespace-nowrap"
                    style={{
                      left: `${((value + 20) / 140) * 100}%`,
                      transform:
                        value === -20
                          ? "none"
                          : value === 120
                            ? "translateX(-100%)"
                            : "translateX(-50%)",
                    }}
                  >
                    {value === -20 ? "−20" : value} °C
                  </span>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTemperature(-10)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs transition ${phase === "ice" ? "border-sky-300/60 bg-sky-300/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                >
                  <Snowflake size={19} /> Is
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature(22)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs transition ${phase === "water" ? "border-cyan-300/60 bg-cyan-300/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                >
                  <Waves size={19} /> Vatten
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature(110)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs transition ${phase === "steam" ? "border-amber-300/60 bg-amber-300/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                >
                  <Wind size={19} /> Ånga
                </button>
              </div>
            </div>
            <div
              className={`museum-temp-explanation rounded-[26px] border border-cyan-200/15 bg-[#102d3b]/80 p-6 sm:p-7 ${detailsOpen ? "museum-temp-explanation-open" : ""}`}
              aria-live="polite"
            >
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-teal-300">
                Vad händer med vattnet?
              </p>
              <h3
                className={`mt-3 font-serif text-2xl font-bold ${phaseInfo.accent}`}
              >
                {phaseInfo.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/90">
                {phaseInfo.subtitle}
              </p>
              <button
                type="button"
                className="museum-temp-details-toggle mt-3 inline-flex min-h-10 items-center rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 text-xs font-semibold text-cyan-100"
                onClick={() => setDetailsOpen((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={detailsOpen}
              >
                Varför händer det? ↗
              </button>
            </div>
          </div>
        </div>
        {detailsOpen && (
          <div
            className="museum-temp-modal fixed inset-0 z-[100] flex items-center justify-center bg-[#03121d]/75 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setDetailsOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="museum-temp-modal-title"
              className="w-full max-w-md overflow-y-auto rounded-2xl border border-cyan-200/25 bg-[#0b2838] p-5 shadow-2xl sm:p-7"
              style={{ maxHeight: "min(85dvh, 480px)" }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setDetailsOpen(false);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-teal-300">
                    Vad händer med vattnet?
                  </p>
                  <h3
                    id="museum-temp-modal-title"
                    className={`mt-2 font-serif text-xl font-bold ${phaseInfo.accent}`}
                  >
                    {phaseInfo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  autoFocus
                  aria-label="Stäng förklaringen"
                  onClick={() => setDetailsOpen(false)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 hover:bg-white/20"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/90">
                {phaseInfo.subtitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {phaseInfo.detail}
              </p>
              <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-5 text-slate-400">
                Förenklad modell vid normalt lufttryck. Vid fasövergångar kan
                två former finnas samtidigt.
              </p>
            </section>
          </div>
        )}
        <p className="museum-bottom-note mt-5 text-center text-xs leading-6 text-slate-400">
          Förenklad modell vid normalt lufttryck (cirka 1 atmosfär). Vid exakt 0
          °C och 100 °C kan två faser förekomma samtidigt.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="museum-bottom-note mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white"
        >
          <ArrowLeft size={16} /> Tillbaka till landskapet
        </button>
      </div>
    </section>
  );
}
