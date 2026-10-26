"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpRight, Landmark, Sparkles, X } from "lucide-react";

import {
  exhibitCategories,
  museumExhibits,
  type ExhibitStatus,
} from "@/app/museum/museum-exhibits";

const statusLabels: Record<ExhibitStatus, string> = {
  available: "Utforska",
  development: "Under utveckling",
  planned: "Planerad",
};

export default function MuseumDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: globalThis.PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0" data-timeline-ui>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="museum-dropdown-panel"
        className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors sm:px-4 ${
          open
            ? "border-[#839B70] bg-[#E5EDDD] text-[#48634D]"
            : "border-[#DCD4C6] bg-[#FFFCF6] text-[#526B5B] hover:bg-[#EFE8DB]"
        }`}
      >
        <Landmark size={16} />
        <span>Museum</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id="museum-dropdown-panel"
          className="museum-dropdown-scroll absolute right-0 top-[calc(100%+12px)] z-[100] w-[min(350px,calc(100vw-24px))] max-h-[min(75svh,650px)] overflow-y-auto overscroll-contain rounded-[22px] border border-[#DED6C8] bg-[#FFFCF6] p-4 text-left shadow-[0_24px_65px_rgba(53,43,30,0.18)] sm:p-5"
          onPointerDown={(event) => event.stopPropagation()}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#B98562 #FFFCF6",
          }}
          onWheel={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B48E6B]">
                <Sparkles size={13} />
                The Unfolding Universe
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[#34473C]">
                Utforska museet
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#817B6E]">
                Upptäck våra interaktiva utställningar och se vad som kommer
                härnäst.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Stäng museimenyn"
              className="rounded-full p-2 text-[#817B6E] hover:bg-[#F2EBDF]"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {exhibitCategories.map((category) => {
              const exhibits = museumExhibits.filter(
                (exhibit) => exhibit.category === category.id,
              );

              return (
                <section key={category.id}>
                  <div className="mb-2 border-b border-[#E8E0D3] pb-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7C8E78]">
                      {category.title}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {exhibits.map((exhibit) => {
                      const isNavigable =
                        Boolean(exhibit.href) &&
                        (exhibit.status === "available" ||
                          exhibit.status === "development");

                      const content = (
                        <>
                          <span className="mt-0.5 text-xl" aria-hidden="true">
                            {exhibit.emoji}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-semibold leading-5 text-[#34473C]">
                              {exhibit.title}
                            </span>

                            <span className="mt-0.5 block text-[11px] leading-[18px] text-[#817B6E]">
                              {exhibit.description}
                            </span>

                            <span
                              className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                exhibit.status === "available"
                                  ? "bg-[#E4EFDF] text-[#47704F]"
                                  : exhibit.status === "development"
                                    ? "bg-[#F6EBDD] text-[#9B7046]"
                                    : "bg-[#F0EDE6] text-[#8A847A]"
                              }`}
                            >
                              {statusLabels[exhibit.status]}
                            </span>
                          </span>

                          {isNavigable && (
                            <ArrowUpRight
                              size={15}
                              className="mt-1 shrink-0 text-[#718363]"
                            />
                          )}
                        </>
                      );

                      return isNavigable && exhibit.href ? (
                        <Link
                          key={exhibit.id}
                          href={exhibit.href}
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-3 rounded-xl px-2 py-3 transition hover:bg-[#F2EEE6] focus-visible:outline-2 focus-visible:outline-[#657D69]"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div
                          key={exhibit.id}
                          className="flex items-start gap-3 rounded-xl px-2 py-3"
                        >
                          {content}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-[#E6DDCD] bg-[#F6F0E5] p-3">
            <p className="text-xs leading-5 text-[#776E60]">
              🌱 Museet växer! Fler upplevelser är på väg. Titta gärna in igen
              och upptäck något nytt.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
