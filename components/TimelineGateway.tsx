"use client";

import TimelineTransition from "./TimelineTransition";
import { useEffect, useRef } from "react";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TimelineGateway() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const line = lineRef.current;
    const content = contentRef.current;
    const markers = markersRef.current;

    if (!section || !line || !content || !markers) return;

    const context = gsap.context(() => {
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(markers.children, { opacity: 0, scale: 0.5 });
      gsap.set(content, { opacity: 0, y: 65 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "center center",
          scrub: 1.2,
        },
      });

      timeline
        .to(line, {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.out",
        })
        .to(
          markers.children,
          {
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.5,
          },
          0.3,
        )
        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          0.55,
        );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[110svh] items-center justify-center overflow-hidden bg-[#02030a] px-6 py-32 text-white"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(184,121,60,0.11),transparent_58%)]" />

      {/* Soft distant glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.035] blur-[100px]" />

      {/* Timeline */}
      <div className="absolute left-0 right-0 top-[15%] px-8 sm:top-[17%]">
        <div className="relative mx-auto max-w-5xl">
          <div className="h-px w-full bg-white/10" />

          <div
            ref={lineRef}
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-amber-100 shadow-[0_0_18px_rgba(255,200,105,0.7)]"
          />

          <div
            ref={markersRef}
            className="absolute inset-x-0 top-0 flex -translate-y-1/2 justify-between"
          >
            {[
              "13,8 md år",
              "Första stjärnorna",
              "Galaxerna",
              "4,6 md år",
              "Jorden",
            ].map((label, index) => (
              <div
                key={label}
                className="group relative flex flex-col items-center"
              >
                <div
                  className={`rounded-full border border-amber-200/60 bg-amber-100 shadow-[0_0_16px_rgba(255,191,91,0.55)] ${
                    index === 4 ? "h-3 w-3" : "h-1.5 w-1.5"
                  }`}
                />

                <span className="absolute top-5 hidden whitespace-nowrap text-[10px] tracking-widest text-white/40 sm:block">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main invitation */}

      {/* Main invitation */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto mt-36 flex max-w-3xl flex-col items-center text-center sm:mt-40"
      >
        <div className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-amber-200/75">
          <Sparkles size={14} strokeWidth={1.5} />
          Resan fortsätter
        </div>

        <h2 className="max-w-3xl text-4xl font-light leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
          Men det här är
          <br />
          <span className="bg-gradient-to-r from-[#f3d7a3] via-[#fff5dc] to-[#b98c56] bg-clip-text font-medium text-transparent">
            bara början.
          </span>
        </h2>

        <p className="mt-8 max-w-xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
          Vi har följt universums historia, från de första stjärnorna till
          jordens födelse. Men vad hände sedan? Hur uppstod livet, och hur blev
          vår planet den värld vi känner idag?
        </p>

        <div className="mt-11">
          <TimelineTransition>
            <Clock3 size={18} strokeWidth={1.7} />
            Utforska tidslinjen
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </TimelineTransition>
        </div>

        <span className="mt-7 text-[11px] uppercase tracking-[0.2em] text-white/30">
          13,8 miljarder år av universums historia
        </span>
      </div>

      {/* Bottom decorative fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#02030a] to-transparent" />
    </section>
  );
}
