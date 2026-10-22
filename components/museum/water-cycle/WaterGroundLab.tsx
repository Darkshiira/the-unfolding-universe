"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Droplets,
  Leaf,
  RotateCcw,
  Sun,
  X,
  AlertTriangle,
} from "lucide-react";

type Soil = "sand" | "loam" | "clay" | "rock";
type Props = { onClose: () => void };
const soilData: Record<
  Soil,
  { name: string; infiltration: number; capacity: number; explanation: string }
> = {
  sand: {
    name: "Sandjord",
    infiltration: 0.87,
    capacity: 0.35,
    explanation:
      "Stora porer släpper igenom vatten snabbt, men sand håller kvar mindre vatten nära rötterna.",
  },
  loam: {
    name: "Mullrik jord",
    infiltration: 0.72,
    capacity: 0.78,
    explanation:
      "En blandning av porstorlekar gör att vatten både kan tränga ner och stanna tillgängligt för rötterna.",
  },
  clay: {
    name: "Lerjord",
    infiltration: 0.28,
    capacity: 0.83,
    explanation:
      "Små porer gör att vattnet rör sig långsamt. Jorden kan hålla mycket vatten, men vid mättnad får rötterna syrebrist.",
  },
  rock: {
    name: "Hårdgjord mark",
    infiltration: 0.06,
    capacity: 0.08,
    explanation:
      "På tät mark rinner mer regn bort på ytan i stället för att nå rötter och grundvatten.",
  },
};
const clamp = (x: number) => Math.max(0, Math.min(100, x));
// Paths are positioned over groundwater-landscape.webp (SVG viewBox 800 × 400).
// The final path is an alternative branch: the same droplet cannot both
// transpire through the tree and subsequently enter the aquifer.
const waterJourneyPaths = [
  { path: "M236 52 C235 100 237 150 236 192", end: [236, 192], seconds: 3.2 },
  {
    path: "M236 192 C231 220 247 238 241 261 S254 288 270 292",
    end: [270, 292],
    seconds: 3.8,
  },
  {
    path: "M270 292 C350 309 430 312 515 301 S612 271 681 223",
    end: [681, 223],
    seconds: 5.2,
  },
  {
    path: "M681 223 C694 199 693 160 696 129 S698 75 698 49",
    end: [698, 49],
    seconds: 4.4,
  },
  { path: "M698 49 C711 38 724 23 749 11", end: [749, 11], seconds: 3.3 },
  { path: "M270 292 C289 321 349 345 440 352", end: [440, 352], seconds: 4.2 },
] as const;

const drops = Array.from({ length: 23 }, (_, i) => ({
  x: 35 + ((i * 73) % 710),
  delay: (i * 0.37) % 3.2,
  duration: 1.7 + (i % 4) * 0.35,
}));

export default function WaterGroundLab({ onClose }: Props) {
  const [savedWeather, setSavedWeather] = useState<{
    rain: number;
    sun: number;
  } | null>(null);
  const [rain, setRain] = useState(55);
  const [sun, setSun] = useState(55);
  const [soil, setSoil] = useState<Soil>("loam");
  const [follow, setFollow] = useState(false);
  const [step, setStep] = useState(0);
  // Keep plant-health readings based on the visitor's experiment settings
  // while the guided droplet journey temporarily pauses the weather.
  const modelRain = follow ? (savedWeather?.rain ?? rain) : rain;
  const modelSun = follow ? (savedWeather?.sun ?? sun) : sun;

  function startWaterdropJourney(nextStep = 0) {
    if (!follow) {
      setSavedWeather({ rain, sun });
      setRain(0);
      setSun(0);
    }
    setFollow(true);
    setStep(nextStep);
  }

  function stopWaterdropJourney() {
    if (savedWeather) {
      setRain(savedWeather.rain);
      setSun(savedWeather.sun);
    }
    setSavedWeather(null);
    setFollow(false);
    setStep(0);
  }

  const values = useMemo(() => {
    const rain = modelRain;
    const sun = modelSun;
    const info = soilData[soil];
    const evap = clamp((8 + sun * 0.24) * (rain > 0 ? 1 : 0.4));
    const infiltration = clamp(info.infiltration * (100 - evap) * 1.08);
    const runoff = clamp(100 - evap - infiltration);
    const waterAvailable = clamp(rain * info.capacity * (1 - sun * 0.003));
    const waterlogging = soil === "clay" && rain >= 78;
    const drought = rain < 22 || waterAvailable < 14;
    const status = waterlogging
      ? "Syrebrist i blöt jord"
      : drought
        ? "Vattenstress"
        : waterAvailable > 30
          ? "Goda växtförhållanden"
          : "Begränsad vattentillgång";
    return {
      evap,
      infiltration,
      runoff,
      waterAvailable,
      waterlogging,
      drought,
      status,
    };
  }, [modelRain, modelSun, soil]);
  const journey = [
    {
      title: "1 · Regnet når marken",
      body: "En del vatten fastnar på blad och avdunstar. Resten når markytan.",
    },
    {
      title: "2 · Vatten tränger ner",
      body: "I jordens porer rör sig vattnet nedåt. Hur snabbt det går beror på markens egenskaper.",
    },
    {
      title: "3 · Rötterna tar upp vatten",
      body: "Vatten passerar in i fina rötter. Transporten uppåt sker i vedkärlen (xylemet).",
    },
    {
      title: "4 · Vattnet når bladen",
      body: "Vatten behövs för fotosyntes och för att cellerna ska behålla sitt tryck och sin stadga.",
    },
    {
      title: "5 · Vatten lämnar bladen",
      body: "Genom klyvöppningar avges vattenånga till luften: transpiration. Det bidrar till att dra nytt vatten uppåt.",
    },
    {
      title: "6 · Resten fortsätter",
      body: "En annan regndroppe som inte tas upp av rötterna kan fortsätta ner till grundvattnet. Detta är en alternativ väg, inte en fortsättning från bladet.",
    },
  ];
  return (
    <section
      className="pointer-events-auto absolute inset-0 z-20 overflow-y-auto bg-[#061724]/95 px-4 pb-24 pt-24 text-white backdrop-blur-xl sm:px-8 md:pt-28"
      aria-label="Laboratorium 03 – Vart tar regnet vägen?"
    >
      <style>{`
        @keyframes groundRain { from { transform:translateY(-35px); opacity:0 } 15% { opacity:.9 } to { transform:translateY(215px); opacity:0 } }
        @keyframes groundFlow { to { stroke-dashoffset:-32 } }
        @keyframes groundPulse { 0%,100% { opacity:.25 } 50% { opacity:1 } }
        @media(prefers-reduced-motion:reduce){.ground-motion{animation:none!important}}
      `}</style>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.25em] text-emerald-300">
              03 · Experimentera / Laboratorium 03
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">
              Vart tar regnet vägen?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Utforska marken under våra fötter. Ändra regn, sol och jord – och
              följ vattnet genom rötterna upp till trädets blad.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Stäng experimentet"
            className="shrink-0 rounded-full border border-white/20 bg-white/10 p-3 hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 rounded-[22px] border border-cyan-200/20 bg-cyan-200/[.055] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-200">
                Följ en vattendroppe ·{" "}
                {follow ? `${step + 1} av ${journey.length}` : "6 steg"}
              </p>
              <h3 className="mt-1 text-base font-semibold">
                {follow ? journey[step].title : "Från regn till trädets blad"}
              </h3>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-300">
                {follow
                  ? journey[step].body
                  : "Starta resan och se vattnets väg i landskapet nedanför."}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {follow && step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="rounded-full border border-white/20 px-3 py-2 text-xs hover:bg-white/10"
                >
                  Föregående
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (follow) {
                    setStep((s) => (s + 1) % journey.length);
                  } else {
                    startWaterdropJourney();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-200 px-4 py-2 text-xs font-bold text-[#0b2834]"
              >
                {!follow
                  ? "Starta resan"
                  : step === journey.length - 1
                    ? "Börja om"
                    : "Nästa steg"}
                <ArrowRight size={15} />
              </button>
              {follow && (
                <button
                  type="button"
                  onClick={() => {
                    stopWaterdropJourney();
                  }}
                  className="rounded-full border border-white/20 px-3 py-2 text-xs"
                >
                  Avsluta
                </button>
              )}
            </div>
          </div>
          <div
            className="mt-3 grid grid-cols-6 gap-1.5"
            aria-label="Resans steg"
          >
            {journey.map((item, i) => (
              <button
                type="button"
                key={item.title}
                onClick={() => {
                  startWaterdropJourney(i);
                }}
                aria-label={item.title}
                aria-current={follow && step === i ? "step" : undefined}
                className={`h-2 rounded-full transition-colors ${follow && i <= step ? "bg-cyan-300" : "bg-white/15 hover:bg-white/30"}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,.7fr)]">
          <div className="overflow-hidden rounded-[28px] border border-emerald-200/20 bg-[#102b36]">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <span className="text-xs font-semibold text-emerald-100">
                Genomskärning · mark, rötter och grundvatten
              </span>
              <span className="text-[11px] text-white/50">
                {follow
                  ? "Guidat läge · övriga flöden pausade"
                  : "Förenklad modell"}
              </span>
            </div>
            <svg
              viewBox="0 0 800 400"
              role="img"
              aria-label="Realistisk genomskärning av sjö, skogsmark, rötter, jord och grundvatten. Animerade blå linjer visar vattnets rörelse."
              className="w-full"
            >
              <defs>
                <linearGradient id="ground-label-bg" x1="0" x2="1">
                  <stop stopColor="#071c29" stopOpacity=".87" />
                  <stop offset="1" stopColor="#0d3943" stopOpacity=".70" />
                </linearGradient>
              </defs>
              {/* The actual illustration lives in /public/images/museum. */}
              <image
                href="/images/museum/groundwater-landscape.webp"
                x="0"
                y="0"
                width="800"
                height="400"
                preserveAspectRatio="xMidYMid slice"
              />
              {/* Soil moisture is an illustrative overlay, not a simulated water table.
                  Its opacity and depth vary by soil and rainfall. */}
              <defs>
                <clipPath id="ground-soil-zone">
                  <path d="M0 201 Q180 195 335 205 T800 198 V338 H0Z" />
                </clipPath>
                <linearGradient
                  id="ground-moisture"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop stopColor="#4ec9e6" stopOpacity=".52" />
                  <stop offset="1" stopColor="#1788b4" stopOpacity=".08" />
                </linearGradient>
                <linearGradient id="ground-puddle" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#a9effa" stopOpacity=".84" />
                  <stop offset="1" stopColor="#248bad" stopOpacity=".64" />
                </linearGradient>
              </defs>
              <g clipPath="url(#ground-soil-zone)" pointerEvents="none">
                <rect
                  x="0"
                  y={
                    soil === "sand"
                      ? 273
                      : soil === "loam"
                        ? 236
                        : soil === "clay"
                          ? 205
                          : 291
                  }
                  width="800"
                  height={
                    soil === "sand"
                      ? 55
                      : soil === "loam"
                        ? 94
                        : soil === "clay"
                          ? 125
                          : 22
                  }
                  fill="url(#ground-moisture)"
                  opacity={
                    (rain / 100) *
                    (soil === "clay"
                      ? 0.95
                      : soil === "loam"
                        ? 0.72
                        : soil === "sand"
                          ? 0.38
                          : 0.12)
                  }
                  className="transition-all duration-700"
                />
                {soil === "loam" && (
                  <g fill="#5bdaee" opacity={rain / 190}>
                    <ellipse cx="465" cy="257" rx="105" ry="24" />
                    <ellipse cx="610" cy="277" rx="80" ry="19" />
                  </g>
                )}
              </g>
              {/* Puddles are surface water, not a rising groundwater table. */}
              {(soil === "clay" || soil === "rock") && rain > 20 && (
                <g
                  pointerEvents="none"
                  opacity={Math.min(0.92, (rain - 20) / 70)}
                >
                  <path
                    d="M22 202 Q85 192 149 203 Q198 212 245 201 Q208 218 146 217 Q76 218 22 202Z"
                    fill="url(#ground-puddle)"
                  />
                  <path
                    d="M341 207 Q425 199 496 207 Q551 214 594 207 Q554 224 483 224 Q394 222 341 207Z"
                    fill="url(#ground-puddle)"
                  />
                  <path
                    d="M70 207 Q132 205 196 210"
                    fill="none"
                    stroke="#d6faff"
                    strokeWidth="2"
                    opacity=".7"
                  />
                </g>
              )}
              {/* Short directional water paths make the contrast between soils obvious. */}
              {!follow && rain > 0 && (
                <g
                  pointerEvents="none"
                  fill="none"
                  strokeLinecap="round"
                  className="ground-motion"
                >
                  {soil === "sand" &&
                    [190, 265, 365, 460, 540].map((x, i) => (
                      <path
                        key={x}
                        d={`M${x} 214 q-8 36 5 67 t-2 45`}
                        stroke="#8deaff"
                        strokeWidth="3"
                        strokeDasharray="3 15"
                        opacity={rain / 105}
                        style={{
                          animation: `groundFlow ${0.7 + i * 0.08}s linear infinite`,
                        }}
                      />
                    ))}
                  {soil === "loam" &&
                    [235, 350, 465, 565].map((x, i) => (
                      <path
                        key={x}
                        d={`M${x} 218 q-14 26 8 44 t25 28`}
                        stroke="#9beaf0"
                        strokeWidth="3.2"
                        strokeDasharray="4 12"
                        opacity={rain / 115}
                        style={{
                          animation: `groundFlow ${1.9 + i * 0.17}s linear infinite`,
                        }}
                      />
                    ))}
                  {soil === "clay" &&
                    [240, 370, 505].map((x, i) => (
                      <path
                        key={x}
                        d={`M${x} 215 q-7 12 3 27`}
                        stroke="#b1f4ff"
                        strokeWidth="3"
                        strokeDasharray="3 12"
                        opacity={rain / 100}
                        style={{
                          animation: `groundFlow ${4 + i * 0.4}s linear infinite`,
                        }}
                      />
                    ))}
                  {soil === "rock" && (
                    <path
                      d="M640 202 Q505 207 385 203 T110 205"
                      stroke="#b1f4ff"
                      strokeWidth="5"
                      strokeDasharray="9 14"
                      opacity={rain / 100}
                      style={{ animation: "groundFlow .85s linear infinite" }}
                    />
                  )}
                </g>
              )}
              {/* Reduce the rain already painted into the illustration on dry days;
                  added moving rain responds to the slider. */}
              <rect
                x="0"
                y="0"
                width="800"
                height="180"
                fill="#f5dba6"
                opacity={sun / 650}
              />
              {!follow &&
                rain > 0 &&
                drops.slice(0, Math.ceil(rain / 5)).map((d, i) => (
                  <path
                    key={i}
                    d={`M${d.x} -18 v13`}
                    stroke="#d4f4ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity={0.25 + rain / 145}
                    className="ground-motion"
                    style={{
                      animation: `groundRain ${d.duration}s ${-d.delay}s linear infinite`,
                    }}
                  />
                ))}
              {!follow && (
                <g
                  fill="none"
                  stroke="#70d5fa"
                  strokeWidth="3.5"
                  strokeDasharray="8 12"
                  className="ground-motion"
                  style={{
                    animation: `groundFlow ${soil === "sand" ? 0.9 : soil === "loam" ? 1.8 : soil === "clay" ? 4.5 : 7}s linear infinite`,
                    opacity:
                      (rain / 100) *
                      (soil === "rock" ? 0.08 : soil === "clay" ? 0.28 : 0.6),
                  }}
                >
                  {/* Water infiltrates the left bank, seeps down and reaches the aquifer. */}
                  <path d="M236 192 C231 228 253 251 241 291" />
                  <path d="M347 198 C337 232 361 267 350 305" />
                  {/* Water moves toward the fine roots of the tree on the right. */}
                  <path
                    d="M515 306 Q561 289 610 270 T683 225"
                    stroke="#9ef0f0"
                  />
                  {/* Groundwater flows laterally through the porous layer. */}
                  <path
                    d="M120 345 Q330 340 515 349 T755 345"
                    stroke="#b5f2ff"
                  />
                </g>
              )}
              {/* Surface runoff follows the shoreline. */}
              {!follow && (
                <path
                  d="M20 189 Q85 201 145 194 T242 204"
                  stroke="#8be3fa"
                  strokeWidth={2 + values.runoff / 9}
                  fill="none"
                  opacity={
                    (rain / 100) *
                    (soil === "rock"
                      ? 1
                      : soil === "clay"
                        ? 0.7
                        : soil === "loam"
                          ? 0.35
                          : 0.18)
                  }
                  strokeDasharray="10 9"
                  className="ground-motion"
                  style={{ animation: "groundFlow 2s linear infinite" }}
                />
              )}
              {!follow && (
                <g
                  fill="none"
                  stroke="#bdf9f2"
                  strokeWidth="3"
                  strokeDasharray="5 10"
                  className="ground-motion"
                  style={{
                    animation: "groundFlow 2.5s linear infinite",
                    opacity: values.drought ? 0.25 : 0.85,
                  }}
                >
                  {/* Water rises through the trunk; transpiration exits the leaves. */}
                  <path d="M684 221 Q692 180 696 137 T698 50" />
                  <path d="M697 53 Q723 36 746 20" strokeWidth="2" />
                </g>
              )}
              {/* Guided journey: one visible droplet follows the actual landscape.
                  Step 6 branches from the soil to the aquifer, not from the leaves. */}
              {follow && (
                <g pointerEvents="none" aria-hidden="true">
                  <path
                    d={waterJourneyPaths[step].path}
                    fill="none"
                    stroke="#063846"
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity=".52"
                  />
                  <path
                    d={waterJourneyPaths[step].path}
                    fill="none"
                    stroke="#b5f5ff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="3 8"
                    opacity=".9"
                  />
                  <g key={`droplet-${step}`} className="ground-guide-moving">
                    <g>
                      <circle
                        r="19"
                        fill="#52e1fa"
                        opacity=".32"
                        className="ground-guide-halo"
                        style={{
                          transformOrigin: "center",
                          animation:
                            "groundGuideHalo 2.2s ease-in-out infinite",
                        }}
                      />
                      <path
                        d="M0 -12 C-4 -5 -9 1 -9 6 A9 9 0 0 0 9 6 C9 1 4 -5 0 -12Z"
                        fill="#7eeaff"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <circle
                        cx="-3"
                        cy="3"
                        r="2.6"
                        fill="white"
                        opacity=".9"
                      />
                    </g>
                    <animateMotion
                      dur={`${waterJourneyPaths[step].seconds}s`}
                      path={waterJourneyPaths[step].path}
                      repeatCount="indefinite"
                      calcMode="spline"
                      keyTimes="0;1"
                      keySplines=".35 0 .65 1"
                    />
                  </g>
                  <g
                    className="ground-guide-static"
                    style={{ display: "none" }}
                    transform={`translate(${waterJourneyPaths[step].end[0]} ${waterJourneyPaths[step].end[1]})`}
                  >
                    <circle r="16" fill="#52e1fa" opacity=".3" />
                    <circle
                      r="9"
                      fill="#7eeaff"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>
                </g>
              )}
              <g
                fontFamily="sans-serif"
                fontSize="13"
                fontWeight="600"
                fill="#eaffff"
              >
                {[
                  { x: 15, y: 23, w: 63, label: "Regn" },
                  { x: 14, y: 180, w: 113, label: "Ytavrinning" },
                  { x: 16, y: 270, w: 86, label: "Jordlager" },
                  { x: 14, y: 367, w: 111, label: "Grundvatten" },
                  { x: 626, y: 80, w: 153, label: "Transpiration" },
                  { x: 588, y: 267, w: 111, label: "Rotupptag" },
                ].map((item) => (
                  <g key={item.label}>
                    <rect
                      x={item.x}
                      y={item.y}
                      width={item.w}
                      height="27"
                      rx="13.5"
                      fill="url(#ground-label-bg)"
                    />
                    <text x={item.x + 10} y={item.y + 18}>
                      {item.label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
            <p className="px-5 pb-4 text-xs leading-5 text-slate-300">
              Bakgrundsbilden är en konstnärlig illustration. Den lysande
              droppen visar en möjlig väg genom marken. Sista steget visar en
              annan droppe som når grundvattnet. Flöden och procenttal är
              förenklade pedagogiska modeller, inte uppmätta värden.
            </p>
          </div>
          <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/[.045] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Styr naturen</h3>
              <button
                type="button"
                onClick={() => {
                  setRain(55);
                  setSun(55);
                  setSoil("loam");
                  setSavedWeather(null);
                  setFollow(false);
                  setStep(0);
                }}
                className="flex items-center gap-1.5 text-xs text-white/65 hover:text-white"
              >
                <RotateCcw size={14} /> Återställ
              </button>
            </div>
            <label className="block text-sm">
              <span className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Droplets size={16} /> Nederbörd
                </span>
                <strong>{rain}%</strong>
              </span>
              <input
                className="mt-3 w-full accent-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                type="range"
                min="0"
                max="100"
                value={rain}
                onChange={(e) => setRain(Number(e.target.value))}
                disabled={follow}
              />
            </label>
            <label className="block text-sm">
              <span className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Sun size={16} /> Solenergi
                </span>
                <strong>{sun}%</strong>
              </span>
              <input
                className="mt-3 w-full accent-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                type="range"
                min="0"
                max="100"
                value={sun}
                onChange={(e) => setSun(Number(e.target.value))}
                disabled={follow}
              />
            </label>
            <fieldset>
              <legend className="mb-2 text-sm">Marktyp</legend>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(soilData) as Soil[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={soil === key}
                    onClick={() => setSoil(key)}
                    className={`rounded-xl border px-2 py-3 text-xs font-medium transition ${soil === key ? "border-emerald-300 bg-emerald-300/20 text-emerald-100" : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"}`}
                  >
                    {soilData[key].name}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="min-h-[106px] rounded-xl border border-emerald-300/15 bg-emerald-300/[.06] p-4">
              <p className="text-xs font-bold text-emerald-200">
                MARKENS EGENSKAPER
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {soilData[soil].explanation}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="Vatten som tränger ner" value={values.infiltration} />
          <Metric label="Ytavrinning" value={values.runoff} />
          <Metric label="Avdunstning" value={values.evap} />
        </div>
        {/* Plant-health exhibit: matching photographic foliage crossfades in place. */}
        <div className="mt-5 overflow-hidden rounded-[26px] border border-emerald-300/35 bg-[#082330] shadow-[0_12px_50px_rgba(0,0,0,.16)]">
          <div className="grid min-h-[235px] items-stretch lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_250px]">
            <div className="relative min-h-[220px] overflow-hidden bg-[#082330]">
              <h3 className="absolute left-5 top-5 z-10 flex items-center gap-2 text-lg font-bold text-white">
                <Leaf size={21} className="text-emerald-400" />
                Hur mår växten?
              </h3>
              <div
                className="absolute inset-x-0 bottom-0 top-10"
                style={{
                  maskImage:
                    "radial-gradient(ellipse 76% 85% at 50% 72%, black 50%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 76% 85% at 50% 72%, black 50%, transparent 100%)",
                }}
                role="img"
                aria-label={`Växtens illustrerade tillstånd: ${values.status}.`}
              >
                <Image
                  src="/images/museum/plant-healthy-v2.webp"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-contain object-bottom"
                />
                <Image
                  src="/images/museum/plant-drought-v2.webp"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-contain object-bottom transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none"
                  style={{
                    opacity: values.waterlogging
                      ? 0
                      : Math.max(
                          0,
                          Math.min(1, (35 - values.waterAvailable) / 28),
                        ),
                  }}
                />
                <Image
                  src="/images/museum/plant-waterlogged-v2.webp"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-contain object-bottom transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none"
                  style={{
                    opacity: values.waterlogging
                      ? Math.min(1, (rain - 70) / 20)
                      : 0,
                  }}
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#082330] to-transparent" />
            </div>

            <div className="flex min-w-0 flex-col justify-center px-5 py-6 lg:px-3">
              <h4
                className={`text-xl font-bold ${
                  values.waterlogging
                    ? "text-orange-300"
                    : values.drought
                      ? "text-amber-300"
                      : "text-emerald-200"
                }`}
              >
                {values.status}
              </h4>
              <p className="mt-2 min-h-[100px] text-sm leading-6 text-slate-200">
                {values.waterlogging
                  ? "När jorden är mättad med vatten blir det ont om syre i porerna. Rötterna får svårt att andas och bladen kan så småningom gulna."
                  : values.drought
                    ? "Det finns för lite vatten i marken. Bladen kan sloka och växten kan minska transpirationen genom att delvis stänga klyvöppningarna."
                    : values.waterAvailable < 30
                      ? "Växten har begränsad tillgång till vatten. Under varma dagar kan det bli svårt att ersätta det vatten som lämnar bladen."
                      : "Rötterna tar upp vatten som transporteras till bladen. Det mesta av det upptagna vattnet avges så småningom genom transpiration."}
              </p>
              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15"
                role="progressbar"
                aria-label="Illustrativ vattentillgång"
                aria-valuenow={Math.round(values.waterAvailable)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ${
                    values.waterlogging
                      ? "bg-orange-400"
                      : values.drought
                        ? "bg-amber-300"
                        : "bg-emerald-400"
                  }`}
                  style={{ width: `${values.waterAvailable}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Illustrativ vattentillgång: {Math.round(values.waterAvailable)}{" "}
                / 100
              </p>
            </div>

            <div className="m-3 rounded-2xl border border-white/10 bg-white/[.045] p-4 lg:self-center">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Leaf size={17} className="text-emerald-400" /> Växtens status
              </p>
              <div className="mt-3 space-y-3">
                {[
                  {
                    label: "Tillräckligt med vatten",
                    active: !values.drought,
                    warning: false,
                  },
                  {
                    label: "Gynnsamma förhållanden",
                    active:
                      !values.drought &&
                      !values.waterlogging &&
                      values.waterAvailable >= 30,
                    warning: false,
                  },
                  {
                    label: "Risk för vattenstress",
                    active: values.drought,
                    warning: true,
                  },
                  {
                    label: "Risk för syrebrist",
                    active: values.waterlogging,
                    warning: true,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 text-xs ${item.active ? (item.warning ? "text-amber-300" : "text-slate-100") : "text-slate-500"}`}
                  >
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                        item.active
                          ? item.warning
                            ? "bg-amber-400 text-[#092632]"
                            : "bg-emerald-400 text-[#092632]"
                          : "bg-white/15 text-slate-500"
                      }`}
                    >
                      {item.active && item.warning ? (
                        <AlertTriangle size={12} />
                      ) : (
                        <Check size={12} strokeWidth={3} />
                      )}
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="border-t border-white/5 px-5 py-2 text-[11px] text-slate-400">
            Illustrativ förändring över tid – växter reagerar inte omedelbart
            när regn eller jordtyp ändras.
          </p>
        </div>
        <p className="mt-6 max-w-4xl text-xs leading-6 text-slate-400">
          Vetenskaplig förenkling: Flödena är relativa modellvärden som
          illustrerar samband, inte exakta hydrologiska prognoser. I
          verkligheten påverkas infiltration och växters vattenupptag även av
          markfuktighet, lutning, jordpackning, nederbördens intensitet,
          temperatur och växtart.
        </p>
      </div>
    </section>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
      <div className="flex justify-between gap-2 text-xs text-slate-300">
        <span>{label}</span>
        <strong className="text-white">{Math.round(value)}%</strong>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-300 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
