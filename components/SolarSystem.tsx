"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SolarSystemScene = dynamic(() => import("./SolarSystemScene"), {
  ssr: false,
});

const chapters = [
  {
    eyebrow: "För 4,6 miljarder år sedan",
    title: "Vår sol tänds.",
    description:
      "Ett enormt moln av gas och stoft dras samman av gravitationen. I mitten föds en ny stjärna – vår sol.",
  },
  {
    eyebrow: "Ett solsystem börjar bildas",
    title: "Ett hav av stoft",
    description:
      "Runt den unga solen bildas en stor skiva av gas och små partiklar. Här finns materialet som en dag ska bli planeter.",
  },
  {
    eyebrow: "Planeterna växer fram",
    title: "Ur stoft bildas nya världar.",
    description:
      "Små partiklar krockar och fastnar i varandra. Under miljontals år växer de till allt större klumpar som så småningom bildar planeter.",
  },
  {
    eyebrow: "Jorden föds",
    title: "En av dem blir vårt hem.",
    description:
      "För ungefär 4,54 miljarder år sedan börjar jorden ta form. Den unga planeten är glödhet och formas av kraftiga kollisioner.",
  },
];

export default function SolarSystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);

  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const captions = captionRefs.current.filter(
        (element): element is HTMLDivElement => element !== null,
      );

      gsap.set(captions, { autoAlpha: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=6500",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
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

      const moments = [
        [0.5, 2.0], // Sun zoom-in
        [2.7, 4.0], // Protoplanetary disk
        [4.6, 7.0], // Planets forming
        [8.0, 9.7], // Earth close-up
      ];

      captions.forEach((caption, i) => {
        const [start, end] = moments[i];

        timeline.to(caption, { autoAlpha: 1, duration: 0.45 }, start);

        timeline.to(caption, { autoAlpha: 0, duration: 0.45 }, end);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#010208] text-white"
    >
      <div className="absolute inset-0">
        <SolarSystemScene progress={progress} />
      </div>

      {/* Cinematic edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.65)_100%)]" />

      {/* Scientific captions */}
      {chapters.map((chapter, i) => (
        <div
          key={chapter.title}
          ref={(element) => {
            captionRefs.current[i] = element;
          }}
          className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-24 text-center sm:pb-32"
          style={{ visibility: "hidden" }}
        >
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-amber-200/75">
              {chapter.eyebrow}
            </p>

            <h2 className="text-3xl font-light tracking-tight sm:text-5xl">
              {chapter.title}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              {chapter.description}
            </p>
          </div>
        </div>
      ))}

      {/* Chapter label
      <div className="pointer-events-none absolute left-5 top-7 sm:left-10 sm:top-10">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
          The Unfolding Universe
        </p>
        <p className="mt-2 text-xs tracking-wide text-white/60">
          The Birth of Our Solar System
        </p>
      </div> */}
    </section>
  );
}
