"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Compass,
  Dna,
  Info,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import MuseumExhibitMenuSection from "./MuseumExhibitMenuSection";

type Species = "guinea" | "rabbit" | "mouse";
type Panel = "main" | "exhibits" | "experiments";

type Props = {
  onSelectSpecies: (species: Species) => void;
};

const species: {
  id: Species;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "guinea",
    title: "Marsvin",
    description: "Pälsfärg och pälsstruktur",
    icon: Dna,
  },
  {
    id: "rabbit",
    title: "Kaniner",
    description: "Ögonfärg och öronform",
    icon: Dna,
  },
  {
    id: "mouse",
    title: "Möss",
    description: "Pälsfärg och svanslängd",
    icon: Dna,
  },
];

export default function MuseumResearchMenu({ onSelectSpecies }: Props) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("main");
  const close = () => {
    setOpen(false);
    setPanel("main");
  };
  const choose = (id: Species) => {
    onSelectSpecies(id);
    close();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const item =
    "flex min-h-10 w-full shrink-0 items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-[#24536f] transition-colors hover:bg-[#e8f4fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5aa8d0]";

  return (
    <div className="relative z-[100] shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Stäng museimenyn" : "Öppna museimenyn"}
        aria-expanded={open}
        aria-controls="genlabbet-museum-navigation"
        className="flex h-10 items-center justify-center gap-2 rounded-full border border-[#bddae9] bg-[#e5f3fb] px-3 text-[#246c91] shadow-sm transition hover:bg-[#d5ebf8] sm:px-4"
      >
        {open ? <X size={19} /> : <Menu size={19} />}
        <span className="hidden text-xs font-bold sm:inline">Museimeny</span>
      </button>
      {/* The shared exhibit list is dark-themed in Cell Explorer. Scope these
          light-theme overrides to Genlabbet only, leaving other menus intact. */}
      <style jsx global>{`
        .genlabbet-light-exhibits {
          color: #24536f;
        }
        .genlabbet-light-exhibits :is(a, button, p, span, div) {
          color: #24536f !important;
        }
        .genlabbet-light-exhibits :is(a, button):hover {
          background-color: #e8f4fb !important;
        }
        .genlabbet-light-exhibits :is(a, button):focus-visible {
          outline: 2px solid #5aa8d0;
          outline-offset: 2px;
        }
        .genlabbet-light-exhibits
          :is([class*="uppercase"], [class*="tracking-"]) {
          color: #247ba8 !important;
        }
        .genlabbet-light-exhibits
          :is([class*="opacity-"], [class*="text-slate-"]) {
          color: #698ba0 !important;
          opacity: 1 !important;
        }
        .genlabbet-light-exhibits
          :is([class*="border-white"], [class*="border-teal"]) {
          border-color: #d8e9f2 !important;
        }
      `}</style>
      {open && (
        <div className="absolute right-0 top-full z-[110] mt-2 flex max-h-[calc(100dvh-100px)] flex-col items-end gap-2">
          <nav
            id="genlabbet-museum-navigation"
            aria-label="Museimenyn"
            className="flex w-[min(260px,calc(100vw-24px))] min-h-0 flex-col overflow-hidden rounded-2xl border border-[#c9e0ec] bg-[#fafdff] p-3 text-[#17374d] shadow-[0_18px_45px_rgba(34,92,125,.16)]"
          >
            {panel === "main" ? (
              <div className="min-h-0 space-y-1 overflow-y-auto overscroll-contain">
                <p className="px-2 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#528ba9]">
                  The Unfolding Universe
                </p>
                <a href="#genlabbet-intro" onClick={close} className={item}>
                  <Info size={15} /> Om forskningsstationen
                </a>
                <button
                  type="button"
                  onClick={() => setPanel("experiments")}
                  className={`${item} text-[#247ba8]`}
                >
                  <Dna size={15} />
                  <span className="flex-1">Experimentera</span>
                  <ChevronRight size={15} />
                </button>
                <div className="my-2 border-t border-[#d8e9f2]" />
                <button
                  type="button"
                  onClick={() => setPanel("exhibits")}
                  className={item}
                >
                  <Compass size={15} />
                  <span className="flex-1">Museets utställningar</span>
                  <ChevronRight size={15} />
                </button>
                <Link
                  href="/museum/cell-explorer"
                  onClick={close}
                  className={item}
                >
                  <ArrowLeft size={15} /> Tillbaka till cellen
                </Link>
                <Link href="/timeline" onClick={close} className={item}>
                  <ArrowLeft size={15} /> Tidslinjen
                </Link>
              </div>
            ) : panel === "exhibits" ? (
              <div className="genlabbet-light-exhibits flex min-h-0 flex-col overflow-y-auto overscroll-contain">
                <MuseumExhibitMenuSection onBack={() => setPanel("main")} />
              </div>
            ) : (
              <div className="min-h-0 space-y-1 overflow-y-auto overscroll-contain">
                <button
                  type="button"
                  onClick={() => setPanel("main")}
                  className={item}
                >
                  <ArrowLeft size={15} /> Tillbaka till menyn
                </button>
                <div className="my-2 border-t border-[#d8e9f2]" />
                <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#528ba9]">
                  Välj experiment
                </p>
                {species.map(({ id, title, description, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => choose(id)}
                    className={item}
                  >
                    <Icon size={16} className="shrink-0 text-[#4197c3]" />
                    <span>
                      <span className="block">{title}</span>
                      <span className="block pt-0.5 text-[10px] font-normal text-[#6b8ca0]">
                        {description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </nav>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-full border border-[#c9e0ec] bg-white px-4 py-2 text-xs font-bold text-[#397c9e] shadow-[0_4px_12px_rgba(34,92,125,.10)] transition hover:bg-[#e8f4fb]"
          >
            <X size={13} className="mr-1 inline" /> Stäng
          </button>
        </div>
      )}
    </div>
  );
}
