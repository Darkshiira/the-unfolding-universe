"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Image from "next/image";
import WaterMist from "./WaterMist";
import type { TopicId } from "./WaterCycleExplorer";

export type SceneHotspot = {
  id: TopicId;
  title: string;
  x: number;
  y: number;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
};

type Props = {
  hotspots: SceneHotspot[];
  selectedId: TopicId | null;
  onSelect: (id: TopicId | null) => void;
  showLabels: boolean;
};

const IMAGE_WIDTH = 1648;
const IMAGE_HEIGHT = 928;

export default function WaterCycleScene({
  hotspots,
  selectedId,
  onSelect,
  showLabels,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scale = Math.max(size.width / IMAGE_WIDTH, size.height / IMAGE_HEIGHT);

  const sceneWidth = IMAGE_WIDTH * scale;
  const sceneHeight = IMAGE_HEIGHT * scale;

  const offsetX = (size.width - sceneWidth) / 2;
  const offsetY = (size.height - sceneHeight) / 2;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-[#09283a]"
    >
      <Image
        src="/images/museum/water-cycle-landscape.webp"
        alt="Berg med snö och glaciärer, skogar, floder, moln och ett hav i kvällssol."
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Cinematic drifting clouds and mountain mist */}
      <WaterMist />

      {/* Atmospheric overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#041725]/50 via-transparent to-[#03121d]/55" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#041725]/25 via-transparent to-transparent" />

      {/* Hotspots anchored to image coordinates */}
      {size.width > 0 &&
        hotspots.map((hotspot) => {
          const Icon = hotspot.icon;
          const active = selectedId === hotspot.id;

          const left = offsetX + (hotspot.x / 100) * sceneWidth;

          const top = offsetY + (hotspot.y / 100) * sceneHeight;

          // Don't show hotspots outside the visible crop.
          if (
            left < 24 ||
            left > size.width - 24 ||
            top < 24 ||
            top > size.height - 24
          ) {
            return null;
          }

          return (
            <button
              key={hotspot.id}
              type="button"
              onClick={() => onSelect(active ? null : hotspot.id)}
              aria-label={`Utforska ${hotspot.title}`}
              aria-pressed={active}
              style={{ left, top }}
              className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span
                className={`relative flex size-11 items-center justify-center rounded-full border backdrop-blur-xl transition duration-300 group-hover:scale-110 ${
                  active
                    ? "border-teal-200 bg-teal-400/50 shadow-[0_0_32px_rgba(94,234,212,0.7)]"
                    : "border-white/60 bg-[#082536]/75 shadow-[0_0_22px_rgba(94,234,212,0.35)]"
                }`}
              >
                <span className="absolute -inset-1.5 rounded-full border border-teal-200/25" />
                <Icon size={20} />
              </span>

              {showLabels && (
                <span className="hidden whitespace-nowrap rounded-full border border-white/20 bg-[#061c2a]/80 px-3 py-2 text-xs font-semibold shadow-xl backdrop-blur-xl lg:block">
                  {hotspot.title}
                </span>
              )}
            </button>
          );
        })}
    </div>
  );
}
