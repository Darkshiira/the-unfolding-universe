"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Cloud,
  CloudRain,
  Snowflake,
  Droplets,
  Pause,
  Play,
  RotateCcw,
  Sun,
  Thermometer,
  Waves,
  Wind,
  Clock3,
  Volume2,
  VolumeX,
  Trophy,
  CheckCircle2,
  Sparkles,
  Target,
  ScrollText,
  X,
} from "lucide-react";

type Props = { onClose: () => void };
type Atmosphere = {
  vapor: number;
  cloud: number;
  rain: number;
  seconds: number;
};
const clamp = (v: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, v));
// Saturation vapor pressure in hPa, Tetens approximation (suitable for this educational range).
const saturation = (temp: number) =>
  6.112 * Math.exp((17.67 * temp) / (temp + 243.5));
const initial: Atmosphere = { vapor: 7.8, cloud: 0, rain: 0, seconds: 0 };
const rainDrops = Array.from({ length: 210 }, (_, i) => ({
  x: 5 + ((i * 71 + 19) % 90),
  y: (i * 29) % 32,
  delay: -((i * 17) % 27) / 10,
  duration: 0.85 + (i % 6) * 0.12,
}));
const wisps = Array.from({ length: 34 }, (_, i) => ({
  x: 12 + ((i * 41 + 9) % 72),
  delay: -((i * 7) % 19) / 3,
  duration: 4 + (i % 5) * 0.8,
}));

type ChallengeId = "sunny" | "rain" | "snow" | "mist";
const challenges: {
  id: ChallengeId;
  icon: string;
  title: string;
  mission: string;
  hint: string;
  why: string;
}[] = [
  {
    id: "sunny",
    icon: "☀️",
    title: "En solig sommardag",
    mission: "Skapa en solig dag med lite moln och torr luft.",
    hint: "Öka solenergin. Värm luften så att den relativa luftfuktigheten sjunker och molnen löses upp.",
    why: "Varmare luft har högre mättnadsångtryck. Samma mängd vattenånga kan därför ge lägre relativ luftfuktighet.",
  },
  {
    id: "rain",
    icon: "🌧️",
    title: "Framkalla regn",
    mission: "Få ett moln att släppa ifrån sig regndroppar.",
    hint: "Värm sjön för att öka avdunstningen. Kyl sedan luften så att vattenånga kondenserar, men håll luften tillräckligt varm för regn.",
    why: "När fuktig luft når mättnad kan molndroppar bildas. Nederbörd kräver också att dropparna växer.",
  },
  {
    id: "snow",
    icon: "❄️",
    title: "Låt det snöa",
    mission: "Skapa nederbörd som når marken som snö.",
    hint: "Bygg upp fukt med varmt vatten och kyl luften till under noll. Ge molnet tid att utvecklas.",
    why: "I den här modellen antas kall luft hela vägen ner, så nederbörden kan nå marken som snö utan att smälta.",
  },
  {
    id: "mist",
    icon: "🌫️",
    title: "Skapa morgondimma",
    mission: "Få varm, fuktig luft att möta kyla nära sjön.",
    hint: "Sätt vattnet till minst 25 °C, luften till högst 8 °C och låt den relativa luftfuktigheten stiga över 85 %.",
    why: "Varmt vatten kan tillföra vattenånga som kondenserar i kall luft. Synlig dimma består av små vattendroppar, inte osynlig vattenånga.",
  },
];

export default function WaterSunLab({ onClose }: Props) {
  const [mobilePanel, setMobilePanel] = useState<
    "scene" | "controls" | "results"
  >("scene");
  const [challengesOpen, setChallengesOpen] = useState(false);
  const [sun, setSun] = useState(65);
  const [waterTemp, setWaterTemp] = useState(22);
  const [airTemp, setAirTemp] = useState(17);
  const [wind, setWind] = useState(25);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(true);
  const [atmosphere, setAtmosphere] = useState<Atmosphere>(initial);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioTracks = useRef<Record<string, HTMLAudioElement>>({});
  const targetVolumes = useRef<Record<string, number>>({});
  const playbackPending = useRef<Record<string, boolean>>({});
  const [audioError, setAudioError] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeId | null>(
    null,
  );
  const [completedChallenges, setCompletedChallenges] = useState<ChallengeId[]>(
    [],
  );
  const [showChallengeHint, setShowChallengeHint] = useState(false);

  // All four loops share one stable fade timer. Tracks are only created once.
  useEffect(() => {
    const tracks: Record<string, HTMLAudioElement> = {};
    for (const name of ["forest", "wind", "rain", "snow"]) {
      const audio = new Audio(`/audio/water-cycle/${name}.mp3`);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      audio.addEventListener("error", () => setAudioError(name));
      tracks[name] = audio;
    }
    audioTracks.current = tracks;
    const fadeTimer = window.setInterval(() => {
      for (const [name, audio] of Object.entries(tracks)) {
        const target = targetVolumes.current[name] ?? 0;
        const difference = target - audio.volume;
        audio.volume = clamp(
          audio.volume +
            Math.sign(difference) * Math.min(Math.abs(difference), 0.025),
          0,
          1,
        );
        if (target === 0 && audio.volume < 0.015 && !audio.paused)
          audio.pause();
      }
    }, 60);
    return () => {
      window.clearInterval(fadeTimer);
      for (const audio of Object.values(tracks)) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      audioTracks.current = {};
    };
  }, []);

  const controls = useRef({
    sun,
    waterTemp,
    airTemp,
    wind,
    speed,
  });

  useEffect(() => {
    controls.current = {
      sun,
      waterTemp,
      airTemp,
      wind,
      speed,
    };
  }, [sun, waterTemp, airTemp, wind, speed]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const c = controls.current;
      // 0.5 simulation minutes per tick at 1x speed.
      const dt = 0.5 * c.speed;
      setAtmosphere((previous) => {
        const effectiveWater = c.waterTemp + (c.sun - 50) * 0.09;
        const lakeSat = saturation(effectiveWater);
        const airSat = saturation(c.airTemp);
        // Evaporation is strongest over warm water when the air is unsaturated.
        const evaporation =
          Math.max(0, lakeSat - previous.vapor) *
          (0.00085 + c.sun * 0.000012) *
          (1 + c.wind * 0.004);
        const mixing = (previous.vapor - 6.5) * (0.0008 + c.wind * 0.000055);
        let vapor = Math.max(0, previous.vapor + (evaporation - mixing) * dt);
        // Excess vapor condenses into cloud droplets when air cools below saturation.
        const condensed =
          Math.max(0, vapor - airSat) * Math.min(0.5, 0.16 * dt);
        vapor -= condensed;
        let cloud = previous.cloud + condensed;
        // Existing droplets can evaporate if the air becomes unsaturated.
        const reevaporation = Math.min(
          cloud,
          Math.max(0, airSat - vapor) * 0.014 * dt,
        );
        cloud -= reevaporation;
        vapor += reevaporation;
        // Cloud droplets must accumulate before appreciable precipitation occurs.
        const precipitation = Math.max(0, cloud - 1.5) * 0.09 * dt;
        cloud = Math.max(0, cloud - precipitation);
        const rain = Math.max(
          0,
          previous.rain * Math.exp(-dt * 0.3) + precipitation * 1.5,
        );
        return { vapor, cloud, rain, seconds: previous.seconds + dt };
      });
    }, 160);
    return () => window.clearInterval(interval);
  }, [running]);

  const airSat = saturation(airTemp);
  const rh = clamp((atmosphere.vapor / airSat) * 100);
  const cloudAmount = clamp(atmosphere.cloud * 26);
  const rainAmount = clamp(atmosphere.rain * 35);
  const effectiveWater = waterTemp + (sun - 50) * 0.09;
  const evaporationLevel = clamp(
    Math.max(0, saturation(effectiveWater) - atmosphere.vapor) *
      (0.85 + sun * 0.012) *
      (1 + wind * 0.004) *
      2.1,
  );
  const moistAir = clamp((atmosphere.vapor / 30) * 100);

  // The simplified model assumes one air temperature through the falling path.
  // A real storm can contain warm/cold layers and mixed precipitation.
  const snowFraction = clamp((2 - airTemp) / 5, 0, 1);
  const snowAmount = rainAmount * snowFraction;
  const liquidRainAmount = rainAmount * (1 - snowFraction);
  const snowing = snowAmount > 4;
  const liquidRaining = liquidRainAmount > 4;
  const frostStrength =
    clamp((-airTemp - 0.5) / 11, 0, 1) * clamp(rh / 85, 0, 1);
  const snowCover = clamp((snowAmount - 3) / 48, 0, 1);

  // Challenges observe the existing simulation. They never change its physics or controls.
  const challengeAchieved: Record<ChallengeId, boolean> = {
    sunny: sun >= 75 && rh < 70 && cloudAmount < 15 && rainAmount < 4,
    rain: liquidRainAmount >= 8 && airTemp >= 4,
    snow: snowAmount >= 8 && airTemp <= -3,
    mist: waterTemp >= 25 && airTemp <= 8 && rh >= 85 && evaporationLevel >= 15,
  };
  const challengeIsAchieved =
    activeChallenge !== null && challengeAchieved[activeChallenge];
  const currentChallenge = challenges.find(
    (challenge) => challenge.id === activeChallenge,
  );
  useEffect(() => {
    if (!activeChallenge || !challengeIsAchieved) return;
    const id = activeChallenge;
    const timer = window.setTimeout(() => {
      setCompletedChallenges((previous) =>
        previous.includes(id) ? previous : [...previous, id],
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activeChallenge, challengeIsAchieved]);

  // Sound targets respond to wind and precipitation, without recreating audio.
  useEffect(() => {
    const audible = soundEnabled && running;
    const storm = clamp(rainAmount / 65, 0, 1);
    targetVolumes.current = {
      forest: audible
        ? Math.max(0.035, 0.32 * (1 - storm * 0.8) * (1 - snowFraction * 0.65))
        : 0,
      wind: audible ? Math.min(0.53, (wind / 100) * 0.45) : 0,
      rain:
        audible && liquidRaining
          ? Math.min(0.75, 0.12 + (liquidRainAmount / 100) * 0.7)
          : 0,
      snow:
        audible && snowing
          ? Math.min(0.45, 0.12 + (snowAmount / 100) * 0.4)
          : 0,
    };
    for (const [name, audio] of Object.entries(audioTracks.current)) {
      if (
        (targetVolumes.current[name] ?? 0) === 0 ||
        !audio.paused ||
        playbackPending.current[name]
      )
        continue;
      playbackPending.current[name] = true;
      void audio
        .play()
        .catch(() => setAudioError(name))
        .finally(() => {
          playbackPending.current[name] = false;
        });
    }
  }, [
    soundEnabled,
    running,
    wind,
    rainAmount,
    liquidRainAmount,
    snowAmount,
    snowFraction,
    liquidRaining,
    snowing,
  ]);

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setAudioError(null);
    if (!next) {
      targetVolumes.current = {};
      return;
    }
    // Explicit user interaction unlocks playback for browsers with autoplay restrictions.
    for (const [name, audio] of Object.entries(audioTracks.current)) {
      if (!running) break;
      void audio.play().catch(() => setAudioError(name));
    }
  }
  // The animation reacts to model values without changing the underlying science.
  const stormStrength = clamp(rainAmount / 75, 0, 1);
  const cloudStrength = clamp(cloudAmount / 65, 0, 1);
  const windDrift = (wind - 50) / 5;
  const rippleStrength = clamp(liquidRainAmount / 60, 0, 1);

  function reset() {
    setSun(65);
    setWaterTemp(22);
    setAirTemp(17);
    setWind(25);
    setSpeed(1);
    setAtmosphere(initial);
    setRunning(true);
  }

  return (
    <section
      data-mobile-panel={mobilePanel}
      data-weather-lab="true"
      className="museum-lab-shell pointer-events-auto absolute inset-0 z-20 overflow-y-auto bg-[#061724]/95 px-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-20 text-white backdrop-blur-xl sm:px-8 sm:pt-24"
      aria-label="Laboratorium 02 – Skapa ditt eget väder"
    >
      <style>{`
        @keyframes weather-mist { 0% {transform:translate(0,8px);opacity:0} 30% {opacity:.65} 100% {transform:translate(18px,-60px);opacity:0} }
        @keyframes weather-rain { 0% {transform:translateY(0);opacity:0} 15% {opacity:.9} 100% {transform:translateY(360px);opacity:0} }
        @keyframes weather-cloud { 0%,100% {transform:translateX(-14px)} 50% {transform:translateX(16px)} }
        @keyframes weather-cloud-drift { 0%,100% {transform:translateX(-20px) scale(1)} 50% {transform:translateX(25px) scale(1.035)} }
        @keyframes weather-ripple { 0% {transform:scale(.2);opacity:0} 22% {opacity:.8} 100% {transform:scale(2.5);opacity:0} }
        @keyframes weather-snowfall { 0% {transform:translate3d(0,-15px,0);opacity:0} 12% {opacity:.9} 100% {transform:translate3d(40px,360px,0);opacity:0} }
        @keyframes weather-frost-shimmer { 0%,100% {opacity:.65} 50% {opacity:1} }
        @keyframes weather-haze { 0%,100% {transform:translateX(-2%);opacity:.6} 50% {transform:translateX(2%);opacity:1} }
        @media (prefers-reduced-motion:reduce) { .weather-motion {animation:none!important} }
      `}</style>
      <div className="museum-lab-inner mx-auto max-w-[1320px]">
        <div className="museum-lab-heading mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.24em] text-cyan-300">
              03 · Experimentera / Laboratorium 02
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
              Skapa ditt eget väder
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Värm sjön, låt vatten avdunsta och kyl luften. Kan du skapa moln
              och få det att regna?
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
            aria-label="Stäng laboratoriet"
          >
            ✕
          </button>
        </div>

        <div
          className="museum-mobile-tabs"
          role="group"
          aria-label="Mobil vy för laboratoriet"
        >
          <button
            type="button"
            aria-pressed={mobilePanel === "scene"}
            onClick={() => setMobilePanel("scene")}
          >
            Landskap
          </button>
          <button
            type="button"
            aria-pressed={mobilePanel === "controls"}
            onClick={() =>
              setMobilePanel(mobilePanel === "controls" ? "scene" : "controls")
            }
          >
            Reglage
          </button>
          <button
            type="button"
            aria-pressed={mobilePanel === "results"}
            onClick={() =>
              setMobilePanel(mobilePanel === "results" ? "scene" : "results")
            }
          >
            Resultat
          </button>
        </div>
        <button
          className="museum-panel-scrim"
          data-visible={mobilePanel !== "scene"}
          aria-label="Stäng panelen"
          type="button"
          onClick={() => setMobilePanel("scene")}
        />

        <button
          type="button"
          className="museum-weather-challenge-trigger"
          onClick={() => {
            setMobilePanel("scene");
            setChallengesOpen(true);
          }}
          aria-label="Öppna vetenskapliga utmaningar"
        >
          <ScrollText size={16} /> <span>Utmaningar</span>
          <span className="museum-challenge-count">
            {completedChallenges.length}/{challenges.length}
          </span>
        </button>
        {challengesOpen && (
          <div
            className="museum-weather-challenge-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setChallengesOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-label="Vetenskapliga utmaningar"
              className="museum-weather-challenge-dialog"
            >
              <div className="museum-weather-challenge-heading">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                    Vetenskapliga utmaningar
                  </p>
                  <h3 className="font-serif text-xl font-bold">
                    Kan du styra vädret?
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setChallengesOpen(false)}
                  aria-label="Stäng utmaningarna"
                  className="museum-weather-icon-close"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                {completedChallenges.length} av {challenges.length} klara · Välj
                ett uppdrag och justera vädret.
              </p>
              <div className="museum-weather-challenge-options">
                {challenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    type="button"
                    aria-pressed={activeChallenge === challenge.id}
                    onClick={() => {
                      setActiveChallenge(challenge.id);
                      setShowChallengeHint(false);
                    }}
                    className={`museum-weather-challenge-option ${activeChallenge === challenge.id ? "is-active" : ""}`}
                  >
                    <span>{challenge.icon}</span>
                    <span>{challenge.title}</span>
                    {completedChallenges.includes(challenge.id) && (
                      <CheckCircle2 size={15} className="text-emerald-300" />
                    )}
                  </button>
                ))}
              </div>
              {currentChallenge && (
                <div className="museum-weather-challenge-detail">
                  {challengeIsAchieved ||
                  completedChallenges.includes(currentChallenge.id) ? (
                    <>
                      <p className="font-semibold text-emerald-200">
                        Uppdrag slutfört! ✨
                      </p>
                      <p>{currentChallenge.why}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-cyan-100">
                        {currentChallenge.mission}
                      </p>
                      <button
                        type="button"
                        className="text-cyan-200 underline underline-offset-4"
                        onClick={() => setShowChallengeHint((v) => !v)}
                      >
                        {showChallengeHint ? "Dölj ledtråd" : "Visa ledtråd"}
                      </button>
                      {showChallengeHint && <p>{currentChallenge.hint}</p>}
                    </>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setChallengesOpen(false);
                  setMobilePanel("controls");
                }}
                className="museum-weather-challenge-action"
              >
                {currentChallenge
                  ? "Experimentera med reglagen →"
                  : "Till reglagen →"}
              </button>
            </section>
          </div>
        )}
        <div className="museum-landscape-stage grid items-start gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,1fr)]">
          <div className="museum-landscape-scene-column space-y-4">
            <div className="museum-weather-scene relative isolate aspect-[16/10] min-h-[220px] overflow-hidden rounded-[26px] border border-cyan-200/20 bg-[#10364a] sm:aspect-[16/9]">
              {/* Save the accompanying landscape at public/images/museum/weather-lab-landscape.webp */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/images/museum/weather-lab-landscape.webp')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051b2a]/55 via-transparent to-[#061c2a]/10" />
              <div
                className="absolute inset-0 bg-amber-200 mix-blend-screen transition-opacity duration-700"
                style={{ opacity: sun / 650 }}
              />
              <div
                className="absolute inset-0 bg-[#0a2742] transition-opacity duration-700"
                style={{ opacity: (100 - sun) / 290 }}
              />
              {/* A cooler, darker atmosphere develops as cloud water accumulates. */}
              <div
                className="pointer-events-none absolute inset-0 bg-[#142c41] transition-opacity duration-[2500ms]"
                style={{ opacity: cloudStrength * 0.17 + stormStrength * 0.27 }}
              />

              {/* Mist is condensed droplets, not invisible water vapor. */}
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1800ms]"
                style={{ opacity: Math.min(0.95, evaporationLevel / 105) }}
                aria-hidden="true"
              >
                <div
                  className="weather-motion absolute bottom-[19%] left-[10%] h-[17%] w-[79%] rounded-[50%] bg-white/35 blur-[25px]"
                  style={{
                    animation: "weather-haze 9s ease-in-out infinite",
                    animationPlayState: running ? "running" : "paused",
                  }}
                />
                {wisps.map((w, i) => (
                  <span
                    key={i}
                    className="weather-motion absolute bottom-[19%] h-[19%] w-[4px] rounded-full bg-white/70 blur-[5px]"
                    style={{
                      left: `${w.x}%`,
                      animation: `weather-mist ${w.duration}s ${w.delay}s infinite linear`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                ))}
              </div>

              {/* Organic, feathered cloud banks. SVG turbulence breaks up the edges,
                  avoiding the obvious overlapping-circle look of the old clouds. */}
              <svg
                viewBox="0 0 1000 600"
                preserveAspectRatio="xMidYMid slice"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <filter
                    id="weather-soft-cloud"
                    x="-35%"
                    y="-70%"
                    width="170%"
                    height="240%"
                  >
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.011 0.022"
                      numOctaves="3"
                      seed="7"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale="37"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                    <feGaussianBlur stdDeviation="9" />
                  </filter>
                  <filter
                    id="weather-storm-cloud"
                    x="-35%"
                    y="-70%"
                    width="170%"
                    height="240%"
                  >
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.013 0.019"
                      numOctaves="3"
                      seed="12"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale="45"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                    <feGaussianBlur stdDeviation="7" />
                  </filter>
                  <linearGradient
                    id="weather-cloud-light"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#fffdf6" stopOpacity=".96" />
                    <stop offset=".55" stopColor="#e4ecf1" stopOpacity=".94" />
                    <stop offset="1" stopColor="#8298aa" stopOpacity=".82" />
                  </linearGradient>
                  <linearGradient
                    id="weather-cloud-dark"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#8195a5" stopOpacity=".96" />
                    <stop offset=".55" stopColor="#475e72" stopOpacity=".97" />
                    <stop offset="1" stopColor="#253b4d" stopOpacity=".92" />
                  </linearGradient>
                </defs>
                <g
                  className="weather-motion"
                  style={{
                    opacity: cloudStrength,
                    transformOrigin: "70% 24%",
                    animation: "weather-cloud-drift 19s ease-in-out infinite",
                    animationPlayState: running ? "running" : "paused",
                    transition: "opacity 2.5s ease",
                  }}
                >
                  <g
                    filter="url(#weather-soft-cloud)"
                    fill="url(#weather-cloud-light)"
                  >
                    <ellipse cx="670" cy="122" rx="125" ry="45" />
                    <ellipse cx="744" cy="96" rx="99" ry="68" />
                    <ellipse cx="838" cy="111" rx="123" ry="58" />
                    <ellipse cx="913" cy="142" rx="108" ry="42" />
                    <ellipse cx="760" cy="147" rx="231" ry="37" />
                  </g>
                </g>
                <g
                  className="weather-motion"
                  style={{
                    opacity: stormStrength,
                    animation: "weather-cloud 13s ease-in-out infinite",
                    animationPlayState: running ? "running" : "paused",
                    transition: "opacity 2.5s ease",
                  }}
                >
                  <g
                    filter="url(#weather-storm-cloud)"
                    fill="url(#weather-cloud-dark)"
                  >
                    <ellipse cx="595" cy="124" rx="156" ry="62" />
                    <ellipse cx="716" cy="89" rx="125" ry="78" />
                    <ellipse cx="834" cy="106" rx="165" ry="71" />
                    <ellipse cx="949" cy="150" rx="145" ry="53" />
                    <ellipse cx="752" cy="171" rx="292" ry="46" />
                  </g>
                </g>
              </svg>

              {/* Rain originates beneath the cloud bank, with a broader fall area downwind. */}
              <div
                className="pointer-events-none absolute left-[46%] top-[22%] h-[65%] w-[54%] overflow-hidden transition-opacity duration-[1700ms]"
                style={{ opacity: Math.min(0.95, liquidRainAmount / 50) }}
                aria-hidden="true"
              >
                {rainDrops.map((d, i) => (
                  <span
                    key={i}
                    className="weather-motion absolute h-10 w-px bg-gradient-to-b from-transparent via-cyan-100/90 to-transparent"
                    style={{
                      left: `${d.x}%`,
                      top: `${d.y}%`,
                      transform: `rotate(${windDrift - 12}deg)`,
                      animation: `weather-rain ${d.duration}s ${d.delay}s infinite linear`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                ))}
              </div>

              {/* Snow drifts down from the same cloud bank as the rain. */}
              <div
                className="pointer-events-none absolute left-[46%] top-[22%] h-[67%] w-[54%] overflow-hidden transition-opacity duration-[2200ms]"
                style={{ opacity: clamp(snowAmount / 45, 0, 0.95) }}
                aria-hidden="true"
              >
                {Array.from({ length: 100 }, (_, i) => (
                  <span
                    key={i}
                    className="weather-motion absolute rounded-full bg-white/90 shadow-[0_0_5px_rgba(255,255,255,.7)]"
                    style={{
                      left: `${(i * 71 + 13) % 100}%`,
                      top: `${(i * 31) % 38}%`,
                      width: `${2 + (i % 3)}px`,
                      height: `${2 + (i % 3)}px`,
                      animation: `weather-snowfall ${3.2 + (i % 7) * 0.6}s ${-((i * 13) % 43) / 6}s infinite linear`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                ))}
              </div>

              {/* Frost grows upward from foreground vegetation, rather than forming a flat white band. */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[23%] overflow-hidden transition-opacity duration-[3500ms]"
                style={{ opacity: frostStrength * 0.88 + snowCover * 0.12 }}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 1000 145"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <defs>
                    <linearGradient
                      id="frost-grass-stroke"
                      x1="0"
                      y1="1"
                      x2="0"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#d9f5ff" stopOpacity=".15" />
                      <stop
                        offset="48%"
                        stopColor="#ecfbff"
                        stopOpacity=".55"
                      />
                      <stop
                        offset="100%"
                        stopColor="#ffffff"
                        stopOpacity=".9"
                      />
                    </linearGradient>
                    <linearGradient
                      id="frost-grass-fade"
                      x1="0"
                      y1="1"
                      x2="0"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#d7f1ff" stopOpacity=".17" />
                      <stop offset="100%" stopColor="#e7f7ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 145 L0 116 Q120 125 245 115 Q390 133 535 120 Q760 128 1000 109 L1000 145 Z"
                    fill="url(#frost-grass-fade)"
                  />
                  {Array.from({ length: 230 }, (_, i) => {
                    const x = (i * 73 + 17) % 1000;
                    const baseY = 120 + ((i * 19) % 25);
                    const height = 8 + ((i * 37) % 29);
                    const lean = ((i * 29) % 21) - 10;
                    return (
                      <path
                        key={i}
                        d={`M ${x} ${baseY} Q ${x + lean * 0.2} ${baseY - height * 0.55} ${x + lean} ${baseY - height}`}
                        stroke="url(#frost-grass-stroke)"
                        strokeWidth={i % 6 === 0 ? 1.8 : 0.85}
                        strokeLinecap="round"
                        fill="none"
                        opacity={0.36 + (i % 5) * 0.12}
                      />
                    );
                  })}
                  {Array.from({ length: 75 }, (_, i) => {
                    const x = (i * 137 + 29) % 1000;
                    const y = 98 + ((i * 31) % 40);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={i % 4 === 0 ? 1.6 : 0.9}
                        fill="#f0fbff"
                        opacity={0.25 + (i % 4) * 0.17}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* A subtle cold haze drifts across the lake, separate from ground frost. */}
              <div
                className="pointer-events-none absolute bottom-[20%] left-[6%] h-[20%] w-[88%] transition-opacity duration-[4000ms]"
                style={{ opacity: frostStrength * 0.36 }}
                aria-hidden="true"
              >
                <div
                  className="weather-motion absolute inset-x-[4%] bottom-[5%] h-[65%] rounded-[50%] bg-[#e0f4ff]/40 blur-[32px]"
                  style={{
                    animation: "weather-haze 13s ease-in-out infinite",
                    animationPlayState: running ? "running" : "paused",
                  }}
                />
                <div
                  className="weather-motion absolute bottom-[12%] left-[18%] h-[48%] w-[55%] rounded-[50%] bg-white/25 blur-[28px]"
                  style={{
                    animation:
                      "weather-haze 17s ease-in-out -6s infinite reverse",
                    animationPlayState: running ? "running" : "paused",
                  }}
                />
              </div>

              {/* Expanding rain rings only where the cloud-bank rainfall meets the lake. */}
              <div
                className="pointer-events-none absolute left-[47%] bottom-[21%] h-[16%] w-[32%] overflow-hidden transition-opacity duration-[1600ms]"
                style={{ opacity: rippleStrength }}
                aria-hidden="true"
              >
                {Array.from({ length: 18 }, (_, i) => (
                  <span
                    key={i}
                    className="weather-motion absolute h-[7px] w-[22px] rounded-[50%] border border-cyan-100/80"
                    style={{
                      left: `${(i * 43 + 13) % 90}%`,
                      top: `${(i * 29 + 11) % 85}%`,
                      animation: `weather-ripple ${1.3 + (i % 5) * 0.27}s ${-((i * 7) % 19) / 4}s infinite ease-out`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                ))}
              </div>
              <div className="museum-weather-scene-status absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/20 bg-[#061724]/80 px-3 py-2 backdrop-blur-md">
                  {cloudAmount > 20 ? "☁️ Moln utvecklas" : "☀️ Klarare himmel"}
                </span>
                <span className="rounded-full border border-white/20 bg-[#061724]/80 px-3 py-2 backdrop-blur-md">
                  {snowing && liquidRaining
                    ? "🌨️ Snöblandat regn"
                    : snowing
                      ? "❄️ Snöfall"
                      : liquidRaining
                        ? "🌧️ Regn"
                        : rh > 90
                          ? "💧 Nära mättnad"
                          : "💨 Luftfuktighet byggs upp"}
                </span>
              </div>
            </div>
            <div
              data-panel="results"
              className="museum-mobile-panel museum-weather-results"
            >
              <div className="museum-weather-panel-header">
                <span>Resultat</span>
                <button
                  type="button"
                  onClick={() => setMobilePanel("scene")}
                  aria-label="Stäng resultat"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="museum-weather-metrics grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  title="Avdunstning"
                  value={evaporationLevel}
                  note="Relativ takt"
                  color="#42d5e4"
                />
                <Metric
                  title="Vattenånga"
                  value={moistAir}
                  note="Relativ mängd"
                  color="#81b7f6"
                />
                <Metric
                  title="Relativ luftfuktighet"
                  value={rh}
                  note="Andel av mättnad"
                  color="#b7a7ff"
                />
                <Metric
                  title="Moln / nederbörd"
                  value={cloudAmount}
                  note={`Moln ${Math.round(cloudAmount)} · Regn ${Math.round(liquidRainAmount)} · Snö ${Math.round(snowAmount)}`}
                  color="#65d6b0"
                />
              </div>
              <div className="museum-weather-extras rounded-2xl border border-cyan-200/15 bg-[#0d2b3c] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[.18em] text-cyan-300">
                  Vad händer just nu?
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {snowing && !liquidRaining
                    ? "Du skapade snö! ❄️ Molnet ger nederbörd och luften är tillräckligt kall i vår förenklade modell för att snöflingor ska nå marken."
                    : snowing && liquidRaining
                      ? "Snöblandat regn! Temperaturen ligger nära gränsen där snö kan smälta på väg mot marken."
                      : liquidRaining
                        ? "Molndropparna har vuxit tillräckligt i modellen för att ge regn. Prova att kyla luften för att skapa snö!"
                        : cloudAmount > 12
                          ? "Luften har blivit mättad och en del vattenånga har kondenserat till små molndroppar. Låt tiden gå så kan dropparna växa."
                          : rh > 92
                            ? "Luften är nästan mättad. Sänk lufttemperaturen lite till så kan kondensation börja."
                            : "Sjön avger vattenånga till luften. För att bilda moln behöver luften bli tillräckligt fuktig och kylas till mättnad."}
                </p>
              </div>
            </div>
            {/* Desktop: the four challenges remain visible below the results. */}
            <section
              className="museum-weather-desktop-challenges rounded-[26px] border border-cyan-200/20 bg-[#0d2b3c] p-5 sm:p-6"
              aria-labelledby="weather-desktop-challenges-title"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.16em] text-cyan-300">
                    Vetenskapliga utmaningar
                  </p>
                  <h3
                    id="weather-desktop-challenges-title"
                    className="mt-2 font-serif text-2xl font-bold"
                  >
                    Kan du styra vädret?
                  </h3>
                </div>
                <span className="rounded-full border border-amber-200/25 bg-amber-100/10 px-3 py-2 text-xs font-semibold text-amber-100">
                  <Trophy size={14} className="mr-1 inline" />{" "}
                  {completedChallenges.length} / {challenges.length} klara
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                Välj ett uppdrag och experimentera med reglagen. Laboratoriet
                känner av när du lyckas!
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {challenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    type="button"
                    aria-pressed={activeChallenge === challenge.id}
                    onClick={() => {
                      setActiveChallenge(challenge.id);
                      setShowChallengeHint(false);
                    }}
                    className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${activeChallenge === challenge.id ? "border-cyan-300/70 bg-cyan-300/15" : "border-white/15 bg-white/5 hover:bg-white/10"}`}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {challenge.icon}
                    </span>
                    <span className="flex-1">{challenge.title}</span>
                    {completedChallenges.includes(challenge.id) && (
                      <CheckCircle2 size={17} className="text-emerald-300" />
                    )}
                  </button>
                ))}
              </div>
              {currentChallenge ? (
                <div className="mt-4 rounded-xl border border-cyan-200/15 bg-[#082535] p-4 text-sm leading-6 text-slate-200">
                  {challengeIsAchieved ||
                  completedChallenges.includes(currentChallenge.id) ? (
                    <>
                      <p className="font-bold text-emerald-200">
                        Uppdrag slutfört! ✨
                      </p>
                      <p>{currentChallenge.why}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-cyan-100">
                        {currentChallenge.mission}
                      </p>
                      <button
                        type="button"
                        className="mt-2 text-cyan-200 underline underline-offset-4"
                        onClick={() => setShowChallengeHint((v) => !v)}
                      >
                        {showChallengeHint ? "Dölj ledtråd" : "Visa ledtråd"}
                      </button>
                      {showChallengeHint && (
                        <p className="mt-2">{currentChallenge.hint}</p>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">
                  Välj en utmaning ovan för att börja.
                </p>
              )}
            </section>
          </div>

          <div
            data-panel="controls"
            className="museum-mobile-panel museum-weather-controls space-y-4"
          >
            <div className="museum-weather-panel-header">
              <span>Reglage</span>
              <button
                type="button"
                onClick={() => setMobilePanel("scene")}
                aria-label="Stäng reglagen"
              >
                <X size={15} />
              </button>
            </div>
            <div className="rounded-[26px] border border-white/15 bg-[#1b2e3b] p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-2">
                <h3 className="font-bold">Styr förhållandena</h3>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
                >
                  <RotateCcw size={14} /> Återställ
                </button>
              </div>
              <div className="museum-weather-control-stack space-y-5">
                <Control
                  icon={<Sun size={18} />}
                  title="Solens energi"
                  value={sun}
                  onChange={setSun}
                  min={0}
                  max={100}
                  unit="%"
                  color="#ffd36c"
                  hint="Mer solenergi värmer sjön och ökar avdunstningen."
                />
                <Control
                  icon={<Waves size={18} />}
                  title="Vattentemperatur"
                  value={waterTemp}
                  onChange={setWaterTemp}
                  min={0}
                  max={40}
                  unit="°C"
                  color="#55d7ee"
                  hint="Varmare vatten kan avge mer vattenånga."
                />
                <Control
                  icon={<Thermometer size={18} />}
                  title="Lufttemperatur"
                  value={airTemp}
                  onChange={setAirTemp}
                  min={-10}
                  max={35}
                  unit="°C"
                  color="#b7a7ff"
                  hint="Kyl luften för moln, frost och – vid nederbörd – snö."
                />
                <Control
                  icon={<Wind size={18} />}
                  title="Vindstyrka"
                  value={wind}
                  onChange={setWind}
                  min={0}
                  max={100}
                  unit="%"
                  color="#79e1b2"
                  hint="Vind påverkar avdunstning och hur fukt blandas bort."
                />
              </div>
              <div className="museum-weather-toolbar mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => setRunning((v) => !v)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/20"
                >
                  {running ? <Pause size={16} /> : <Play size={16} />}{" "}
                  {running ? "Pausa" : "Fortsätt"}
                </button>
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock3 size={15} /> Hastighet{" "}
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="rounded-lg border border-white/20 bg-[#122e3d] px-2 py-2 text-white"
                  >
                    <option value={1}>1×</option>
                    <option value={3}>3×</option>
                    <option value={8}>8×</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-pressed={soundEnabled}
                  className="museum-weather-sound inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10"
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  {soundEnabled ? "Stäng av ljud" : "Aktivera ljud"}
                </button>
              </div>
              {audioError && (
                <p role="alert" className="mt-2 text-xs text-amber-200">
                  Ljudet {audioError}.mp3 kunde inte spelas. Kontrollera filen i
                  public/audio/water-cycle/.
                </p>
              )}
              <p className="mt-3 text-xs text-slate-400">
                Simulerad tid: {Math.floor(atmosphere.seconds)} minuter ·{" "}
                {running ? "Spelar" : "Pausad"}
              </p>
            </div>
            <div className="rounded-[26px] border border-cyan-200/15 bg-[#0c2b3c] p-5 sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-cyan-300">
                Så hänger det ihop
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <p>
                  <Sun className="mr-2 inline text-amber-300" size={16} />{" "}
                  <strong>Energi:</strong> Sol och varmt vatten driver
                  avdunstning.
                </p>
                <p>
                  <Droplets className="mr-2 inline text-cyan-300" size={16} />{" "}
                  <strong>Fukt:</strong> Vattenånga samlas i luften, men är
                  osynlig.
                </p>
                <p>
                  <Cloud className="mr-2 inline text-slate-200" size={16} />{" "}
                  <strong>Kylning:</strong> När luften når mättnad kondenserar
                  ångan till molndroppar.
                </p>
                <p>
                  <Snowflake className="mr-2 inline text-sky-200" size={16} />{" "}
                  <strong>Snö och frost:</strong> Kall luft kan ge snö när moln
                  redan ger nederbörd. Frost kräver kalla ytor och fukt.
                </p>
                <p>
                  <CloudRain className="mr-2 inline text-blue-300" size={16} />{" "}
                  <strong>Nederbörd:</strong> Droppar eller iskristaller måste
                  växa innan de faller. Temperaturen på vägen ned avgör om snön
                  smälter.
                </p>
              </div>
              <p className="mt-4 rounded-xl border border-amber-200/15 bg-amber-100/10 p-3 text-xs leading-5 text-amber-100">
                Förenklad undervisningsmodell, inte en väderprognos. Moln kräver
                även kondensationskärnor och verklig nederbörd påverkas av många
                processer. Här antas samma lufttemperatur genom hela
                nederbördssträckan. Frost och snötäcke är illustrativa och
                påverkas i verkligheten även av marktemperatur och tid.
                Procenttalen är modellvärden.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="museum-bottom-note mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white"
        >
          <ArrowLeft size={16} /> Tillbaka till landskapet
        </button>
      </div>
    </section>
  );
}

function Control({
  icon,
  title,
  value,
  onChange,
  min,
  max,
  unit,
  color,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  unit: string;
  color: string;
  hint: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color }}
        >
          {icon}
          <span className="text-white">{title}</span>
        </span>
        <span className="text-sm font-bold tabular-nums">
          {value} {unit}
        </span>
      </div>
      <input
        aria-label={title}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: color }}
      />
      <p className="museum-weather-control-hint mt-1 text-xs leading-5 text-slate-400">
        {hint}
      </p>
    </div>
  );
}
function Metric({
  title,
  value,
  note,
  color,
}: {
  title: string;
  value: number;
  note: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-200/15 bg-[#0d2b3c] p-4">
      <p className="text-xs font-semibold text-slate-200">{title}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums">
        {Math.round(value)}
        <span className="ml-1 text-sm text-slate-400">%</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${clamp(value)}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-2 text-[11px] text-slate-400">{note}</p>
    </div>
  );
}
