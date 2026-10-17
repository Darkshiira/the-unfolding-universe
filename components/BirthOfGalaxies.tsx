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
      {/* Soft transition from the first stars section */}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[30vh]"
        style={{
          background:
            "linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.35) 65%, transparent 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.7)_100%)]" />

      {/* The first galaxies */}
      <div
        ref={introRef}
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-24 text-center sm:pb-32"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-200/70">
            De första galaxerna
          </p>

          <h2 className="text-3xl font-light sm:text-5xl">
            Stjärnorna börjar
            <br />
            samlas i galaxer.
          </h2>

          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Gravitationen drog samman gas och stjärnor i enorma samlingar. Med
            hjälp av den osynliga mörka materian började de första galaxerna
            växa fram.
          </p>
        </div>
      </div>

      {/* Galactic evolution */}
      <div
        ref={typesRef}
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-24 text-center sm:pb-32"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber-200/70">
            Galaxerna förändras
          </p>

          <h2 className="text-3xl font-light sm:text-5xl">
            Ett universum
            <br />
            fullt av galaxer.
          </h2>

          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Under miljarder år växte galaxerna. Nya stjärnor föddes och galaxer
            krockade och smälte samman. Vissa blev spiralformade, andra runda
            eller oregelbundna.
          </p>
        </div>
      </div>

      {/* The Milky Way */}
      <div
        ref={milkyWayRef}
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-24 text-center sm:pb-32"
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Vårt hem i universum
          </p>

          <h2 className="text-3xl font-light sm:text-5xl">Vintergatan.</h2>

          <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
            Bland universums alla galaxer finns Vintergatan. En enorm
            spiralgalax med miljarder stjärnor. Här kommer vår sol och våra
            planeter en dag att bildas.
          </p>
        </div>
      </div>
    </section>
  );
}
