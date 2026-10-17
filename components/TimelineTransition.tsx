"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import gsap from "gsap";

type Props = {
  children: React.ReactNode;
};

export default function TimelineTransition({ children }: Props) {
  const router = useRouter();

  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    const overlay = overlayRef.current;
    const flash = flashRef.current;
    const glow = glowRef.current;

    if (!overlay || !flash || !glow) return;

    const timeline = gsap.timeline({
      onComplete: () => {
        navigatingRef.current = false;
        setActive(false);
        router.push("/timeline");
      },
    });
    
    timeline
      .set(overlay, {
        opacity: 1,
        pointerEvents: "auto",
      })
      .fromTo(
        glow,
        {
          scale: 0.02,
          opacity: 0,
        },
        {
          scale: 4,
          opacity: 1,
          duration: 0.95,
          ease: "power3.in",
        },
      )
      .fromTo(
        flash,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        "-=0.25",
      );

    return () => {
      timeline.kill();
    };
  }, [active, router]);

  function startTransition() {
    if (navigatingRef.current) return;

    navigatingRef.current = true;
    setActive(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={startTransition}
        className="group inline-flex items-center gap-4 rounded-full border border-amber-200/30 bg-gradient-to-r from-[#e4c18b] to-[#c99c60] px-8 py-4 text-sm font-semibold tracking-wide text-[#20160c] shadow-[0_0_35px_rgba(226,170,91,0.17)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_55px_rgba(226,170,91,0.35)]"
      >
        {children}
      </button>

      {mounted &&
        active &&
        createPortal(
          <div
            ref={overlayRef}
            className="pointer-events-auto fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050508]/80"
          >
            {/* Expanding golden light */}
            <div
              ref={glowRef}
              className="absolute h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle,#fffdf2_0%,#ffe6a5_12%,#f3ac54_32%,rgba(239,148,56,0.25)_55%,transparent_72%)]"
            />

            {/* Final ivory flash */}
            <div
              ref={flashRef}
              className="absolute inset-0 bg-[#F8F5EE] opacity-0"
            />
          </div>,
          document.body,
        )}
    </>
  );
}
