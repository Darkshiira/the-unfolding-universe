"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GalaxiesScene = dynamic(() => import("./GalaxiesScene"), { ssr: false });

export default function BirthOfGalaxies() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);

  const introRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  const milkyWayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([introRef.current, typesRef.current, milkyWayRef.current], {
        autoAlpha: 0,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=5000",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      timeline.to(
        progress,
        {
          current: 1,
          duration: 10,
          ease: "none",
        },
        0,
      );

      timeline
        .to(
          introRef.current,
          {
            autoAlpha: 1,
            duration: 0.8,
          },
          0.5,
        )
        .to(
          introRef.current,
          {
            autoAlpha: 0,
            duration: 0.8,
          },
          2.7,
        );

      timeline
        .to(
          typesRef.current,
          {
            autoAlpha: 1,
            duration: 0.8,
          },
          3.5,
        )
        .to(
          typesRef.current,
          {
            autoAlpha: 0,
            duration: 0.8,
          },
          5.8,
        );

      timeline
        .to(
          milkyWayRef.current,
          {
            autoAlpha: 1,
            duration: 0.8,
          },
          7,
        )
        .to(
          milkyWayRef.current,
          {
            autoAlpha: 0,
            duration: 0.8,
          },
          9.2,
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
        <GalaxiesScene progress={progress} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.7)_100%)]" />

      <div
        ref={introRef}
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-24 text-center sm:pb-32"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-200/70">
            The First Galaxies
          </p>
          <h2 className="text-3xl font-light sm:text-5xl">
            Gravity begins to build
            <br />
            the cosmic web.
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Within vast structures shaped by dark matter, gas gathers and early
            galaxies begin to grow.
          </p>
        </div>
      </div>

      <div
        ref={typesRef}
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-24 text-center sm:pb-32"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber-200/70">
            Galactic Evolution
          </p>
          <h2 className="text-3xl font-light sm:text-5xl">
            A universe of galaxies.
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Over billions of years, galaxies grow through star formation, gas
            accretion, and mergers, developing a remarkable variety of shapes.
          </p>
        </div>
      </div>

      <div
        ref={milkyWayRef}
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-24 text-center sm:pb-32"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Our Galactic Home
          </p>
          <h2 className="text-3xl font-light sm:text-5xl">The Milky Way.</h2>
          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Within this immense barred spiral galaxy, a small star system will
            eventually become our home.
          </p>
        </div>
      </div>
    </section>
  );
}
