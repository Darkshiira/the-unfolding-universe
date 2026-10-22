"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type JourneyStep =
  | "ocean"
  | "vapor"
  | "cloud"
  | "rain"
  | "snow"
  | "river"
  | "groundwater"
  | "plant";

type Props = {
  active: boolean;
  step: JourneyStep;
};

const BASE = "/audio/water-cycle/";
const FILES = {
  ocean: "ocean.mp3",
  wind: "wind.mp3",
  rain: "rain-v2.mp3",
  snow: "snow-v2.mp3",
  river: "river.mp3",
  groundwater: "groundwater.mp3",
  forest: "forest.mp3",
} as const;

type Sound = keyof typeof FILES;
const VOLUMES: Record<JourneyStep, Partial<Record<Sound, number>>> = {
  ocean: { ocean: 0.45 },
  vapor: { wind: 0.33 },
  cloud: { wind: 0.14 },
  rain: { rain: 0.42 },
  snow: { snow: 0.25 },
  river: { river: 0.43 },
  groundwater: { groundwater: 0.22 },
  plant: { forest: 0.4 },
};

export default function WaterCycleAudio({ active, step }: Props) {
  const [enabled, setEnabled] = useState(false);
  const sounds = useRef<Partial<Record<Sound, HTMLAudioElement>>>({});
  const thunder = useRef<HTMLAudioElement | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const cloudFilter = useRef<BiquadFilterNode | null>(null);
  const windSource = useRef<MediaElementAudioSourceNode | null>(null);
  const volumes = useRef<Partial<Record<Sound, number>>>({});
  const desired = useRef<Partial<Record<Sound, number>>>({});
  const animation = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const enabledRef = useRef(false);
  const activeRef = useRef(active);
  const stepRef = useRef(step);

  useEffect(() => {
    const elements: Partial<Record<Sound, HTMLAudioElement>> = {};
    (Object.keys(FILES) as Sound[]).forEach((key) => {
      const element = new Audio(BASE + FILES[key]);
      element.loop = true;
      element.preload = "none";
      element.volume = 0;
      elements[key] = element;
      volumes.current[key] = 0;
    });
    sounds.current = elements;
    const thunderAudio = new Audio(BASE + "thunder.mp3");
    thunderAudio.preload = "auto";
    thunderAudio.volume = 0.5;
    thunder.current = thunderAudio;

    const onLightning = () => {
      if (
        !enabledRef.current ||
        !activeRef.current ||
        stepRef.current !== "rain"
      )
        return;
      // Sound follows the flash, suggesting a storm some distance away.
      window.setTimeout(() => {
        if (
          !enabledRef.current ||
          !activeRef.current ||
          stepRef.current !== "rain"
        )
          return;
        const sound = thunder.current;
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
        void sound.play().catch(() => {});
      }, 1200);
    };
    window.addEventListener("water-cycle:lightning", onLightning);

    return () => {
      window.removeEventListener("water-cycle:lightning", onLightning);
      if (animation.current !== null) cancelAnimationFrame(animation.current);
      Object.values(elements).forEach((sound) => {
        sound.pause();
        sound.src = "";
      });
      thunderAudio.pause();
      thunderAudio.src = "";
      if (audioContext.current) void audioContext.current.close();
    };
  }, []);

  useEffect(() => {
    enabledRef.current = enabled;
    activeRef.current = active;
    stepRef.current = step;
    desired.current = enabled && active ? VOLUMES[step] : {};
    if (!enabled || !active) thunder.current?.pause();

    if (enabled && active) {
      Object.entries(desired.current).forEach(([key, volume]) => {
        if (!volume) return;
        const sound = sounds.current[key as Sound];
        if (sound?.paused) void sound.play().catch(() => {});
      });
    }

    if (cloudFilter.current && audioContext.current) {
      const cutoff = step === "cloud" ? 650 : 16000;
      cloudFilter.current.frequency.setTargetAtTime(
        cutoff,
        audioContext.current.currentTime,
        0.35,
      );
    }

    if (animation.current !== null) cancelAnimationFrame(animation.current);
    lastTime.current = null;
    const tick = (time: number) => {
      const elapsed =
        lastTime.current === null ? 0 : Math.min(100, time - lastTime.current);
      lastTime.current = time;
      let changing = false;
      (Object.keys(FILES) as Sound[]).forEach((key) => {
        const sound = sounds.current[key];
        if (!sound) return;
        const target = desired.current[key] ?? 0;
        const current = volumes.current[key] ?? 0;
        const difference = target - current;
        const next =
          Math.abs(difference) < 0.002
            ? target
            : current + difference * Math.min(1, elapsed / 650);
        volumes.current[key] = next;
        sound.volume = Math.max(0, Math.min(1, next));
        if (next === 0 && target === 0 && !sound.paused) sound.pause();
        if (next !== target) changing = true;
      });
      if (changing) animation.current = requestAnimationFrame(tick);
      else animation.current = null;
    };
    animation.current = requestAnimationFrame(tick);
    return () => {
      if (animation.current !== null) cancelAnimationFrame(animation.current);
    };
  }, [active, enabled, step]);

  const toggle = async () => {
    if (!enabled) {
      // Creating/resuming the audio graph in a user gesture satisfies autoplay rules.
      try {
        if (!audioContext.current) {
          const context = new AudioContext();
          const wind = sounds.current.wind;
          if (wind) {
            const source = context.createMediaElementSource(wind);
            const filter = context.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = step === "cloud" ? 650 : 16000;
            source.connect(filter).connect(context.destination);
            windSource.current = source;
            cloudFilter.current = filter;
          }
          audioContext.current = context;
        }
        await audioContext.current.resume();
      } catch {
        // Other recordings can still play if Web Audio isn't available.
      }
    }
    setEnabled((value) => !value);
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-label={enabled ? "Stäng av ljud" : "Aktivera ljud"}
      aria-pressed={enabled}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/65 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-slate-900/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
    >
      {enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
      {enabled ? "Ljud på" : "Aktivera ljud"}
    </button>
  );
}
