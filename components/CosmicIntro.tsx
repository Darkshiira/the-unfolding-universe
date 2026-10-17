"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import IgnitionFlash from "./IgnitionFlash";

const UniverseScene = dynamic(() => import("./UniverseScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function CosmicIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4500",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // Fade out the opening message
        .to(
          textRef.current,
          {
            opacity: 0,
            scale: 1.05,
            duration: 1.2,
          },
          0,
        )

        // Fade out the scroll indicator
        .to(
          scrollRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          0,
        )

        // Expand the universe
        .to(
          progress,
          {
            current: 1,
            duration: 6,
            ease: "none",
          },
          0.4,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* Three.js universe */}
      <div className="absolute inset-0 z-0">
        <UniverseScene progress={progress} />
      </div>

      <IgnitionFlash progress={progress} />

      {/* Subtle cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_15%,rgba(0,0,0,0.75)_100%)]" />

      {/* Opening message */}
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
      >
        <h1 className="max-w-4xl text-center font-light tracking-[0.12em] text-white/90 text-3xl sm:text-5xl md:text-6xl">
          First, there was nothing.
        </h1>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-4"
      >
        <p className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.35em] text-white/55 sm:text-xs">
          Scroll to ignite the cosmos
        </p>

        <ArrowDown
          size={19}
          strokeWidth={1.2}
          className="animate-bounce text-white/50"
        />
      </div>

      {/* Small branding */}
      <div className="pointer-events-none absolute left-6 top-8 z-30 sm:left-12 sm:top-10">
        <span className="text-xs font-medium uppercase tracking-[0.35em] text-white/60">
          The Unfolding Universe
        </span>
      </div>
    </section>
  );
}
