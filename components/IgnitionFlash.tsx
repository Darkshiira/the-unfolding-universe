"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type IgnitionFlashProps = {
  progress: React.RefObject<number>;
};

export default function IgnitionFlash({ progress }: IgnitionFlashProps) {
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const flash = flashRef.current;

      if (flash) {
        const p = progress.current;

        // Flash peaks at 12% scroll progress
        const distance = Math.abs(p - 0.12);

        const intensity = Math.max(0, 1 - distance / 0.055);

        const opacity = Math.pow(intensity, 2) * 0.95;

        gsap.set(flash, {
          opacity,
        });
      }

      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frame);
  }, [progress]);

  return (
    <div
      ref={flashRef}
      className="pointer-events-none absolute inset-0 z-20 opacity-0"
      style={{
        background:
          "radial-gradient(circle at center, #ffffff 0%, #fff6df 25%, #f5bd71 60%, transparent 100%)",
      }}
    />
  );
}
