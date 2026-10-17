"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FirstStarsScene = dynamic(() => import("./FirstStarsScene"), {
  ssr: false,
});

export default function FirstStars() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);

  const darknessRef = useRef<HTMLDivElement>(null);
  const birthRef = useRef<HTMLDivElement>(null);
  const supernovaRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([darknessRef.current, birthRef.current, supernovaRef.current], {
        autoAlpha: 0,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=5500",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Main scroll progress
      timeline.to(
        progress,
        {
          current: 1,
          duration: 10,
          ease: "none",
        },
        0,
      );

      // The cosmic dark ages
      timeline
        .to(
          darknessRef.current,
          {
            autoAlpha: 1,
            duration: 0.7,
          },
          0.2,
        )
        .to(
          darknessRef.current,
          {
            autoAlpha: 0,
            duration: 0.7,
          },
          1.8,
        );

      // First stars
      timeline
        .to(
          birthRef.current,
          {
            autoAlpha: 1,
            duration: 0.8,
          },
          3.2,
        )
        .to(
          birthRef.current,
          {
            autoAlpha: 0,
            duration: 0.8,
          },
          5.8,
        );

      // Supernova caption
      timeline
        .to(
          supernovaRef.current,
          {
            autoAlpha: 1,
            duration: 0.7,
          },
          7.2,
        )
        .to(
          supernovaRef.current,
          {
            autoAlpha: 0,
            duration: 0.7,
          },
          9.1,
        );

      // Brief white-gold supernova flash
      timeline
        .fromTo(
          flashRef.current,
          { opacity: 0 },
          {
            opacity: 0.85,
            duration: 0.12,
            ease: "power2.in",
          },
          7.3,
        )
        .to(
          flashRef.current,
          {
            opacity: 0,
            duration: 0.55,
          },
          7.42,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0">
        <FirstStarsScene progress={progress} />
      </div>

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.75)_100%)]" />

      {/* Dark ages */}
      <div
        ref={darknessRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
      >
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/40">
            The Cosmic Dark Ages
          </p>
          <h2 className="text-3xl font-light tracking-wide sm:text-5xl">
            For millions of years,
            <br />
            darkness prevailed.
          </h2>
        </div>
      </div>

      {/* First stars */}
      <div
        ref={birthRef}
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-28 text-center sm:pb-36"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Approximately 100–200 Million Years Later
          </p>
          <h2 className="text-3xl font-light sm:text-5xl">
            The first stars ignite.
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Gravity draws primordial hydrogen and helium together. Deep within
            immense clouds of gas, nuclear fusion begins.
          </p>
        </div>
      </div>

      {/* Supernova */}
      <div
        ref={supernovaRef}
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-28 text-center sm:pb-36"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber-200/70">
            The First Stellar Deaths
          </p>
          <h2 className="text-3xl font-light sm:text-5xl">
            From destruction,
            <br />
            new possibilities.
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Some massive stars end their lives in extraordinary explosions,
            dispersing newly forged elements into the cosmos.
          </p>
        </div>
      </div>

      {/* Supernova flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 57% 46%, #ffffff 0%, #fff2cb 12%, rgba(255,160,75,0.5) 35%, transparent 75%)",
        }}
      />
    </section>
  );
}
