"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Compass,
  Info,
  Menu,
  Microscope,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import MuseumExhibitMenuSection from "./MuseumExhibitMenuSection";

export type MuseumMenuAction = {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  onClick: () => void;
};

type Props = {
  currentExhibitId: string;
  onExplore: () => void;
  onAbout: () => void;
  onParts?: () => void;
  partsLabel?: string;
  experiments?: MuseumMenuAction[];
  className?: string;
};

export default function MuseumSceneMenu({
  currentExhibitId,
  onExplore,
  onAbout,
  onParts,
  partsLabel = "Cellens delar",
  experiments = [],
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<"main" | "museum" | "experiments">("main");
  const close = () => {
    setOpen(false);
    setPage("main");
  };
  const run = (action: () => void) => {
    close();
    action();
  };
  const itemClass =
    "flex min-h-10 w-full shrink-0 items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10";

  return (
    <div
      className={`cell-mobile-menu absolute left-3 top-3 z-50 sm:left-5 sm:top-4 ${className}`}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Öppna museimenyn"
          aria-expanded={false}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-200/25 bg-[#102638]/95 text-teal-100 shadow-lg backdrop-blur-xl transition hover:bg-[#19384a]"
        >
          <Menu size={19} />
        </button>
      ) : (
        <div className="flex max-h-[calc(100dvh-88px)] flex-col items-start gap-2 max-[900px]:landscape:max-h-[calc(100dvh-74px)]">
          <nav
            aria-label="Museimenyn"
            className="flex w-[min(248px,calc(100vw-24px))] min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-teal-200/20 bg-[#0b1d2d]/97 p-3 text-white shadow-[0_20px_60px_rgba(0,0,0,.5)] backdrop-blur-xl"
          >
            {page === "museum" ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
                <MuseumExhibitMenuSection
                  currentExhibitId={currentExhibitId}
                  onBack={() => setPage("main")}
                />
              </div>
            ) : page === "experiments" ? (
              <>
                <button
                  type="button"
                  onClick={() => setPage("main")}
                  className={itemClass}
                >
                  <ArrowLeft size={16} /> Tillbaka till menyn
                </button>
                <div className="my-1 shrink-0 border-t border-white/10" />
                <p className="shrink-0 px-2 pt-1 text-[10px] font-bold uppercase tracking-[.12em] text-amber-200">
                  Interaktiva experiment
                </p>
                <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">
                  {experiments.map(
                    ({ id, title, description, icon: Icon, onClick }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => run(onClick)}
                        className={itemClass}
                      >
                        {Icon ? (
                          <Icon size={16} className="shrink-0 text-amber-200" />
                        ) : (
                          <Sparkles
                            size={16}
                            className="shrink-0 text-amber-200"
                          />
                        )}
                        <span className="min-w-0">
                          <span className="block">{title}</span>
                          {description && (
                            <span className="block pt-0.5 text-[10px] font-normal text-slate-300/75">
                              {description}
                            </span>
                          )}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </>
            ) : (
              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">
                <p className="px-2 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-teal-300">
                  The Unfolding Universe
                </p>
                <button
                  type="button"
                  onClick={() => run(onExplore)}
                  className={itemClass}
                >
                  <Sparkles size={15} /> Utforska
                </button>
                <button
                  type="button"
                  onClick={() => run(onAbout)}
                  className={itemClass}
                >
                  <Info size={15} /> Om utställningen
                </button>
                {onParts && (
                  <button
                    type="button"
                    onClick={() => run(onParts)}
                    className={itemClass}
                  >
                    <BookOpen size={15} /> {partsLabel}
                  </button>
                )}
                {experiments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPage("experiments")}
                    className={`${itemClass} text-[#f2e2b2]`}
                  >
                    <Sparkles size={15} />
                    <span className="flex-1">Experimentera</span>
                    <ChevronRight size={15} />
                  </button>
                )}
                <div className="my-2 border-t border-white/10" />
                <button
                  type="button"
                  onClick={() => setPage("museum")}
                  className={itemClass}
                >
                  <Compass size={15} />
                  <span className="flex-1">Museets utställningar</span>
                  <ChevronRight size={15} />
                </button>
                <Link
                  href="/museum/cell-explorer/forskningsstation"
                  onClick={close}
                  className={itemClass}
                >
                  <Microscope size={15} /> Forskningsstationen
                </Link>
                <Link href="/timeline" onClick={close} className={itemClass}>
                  <ArrowLeft size={15} /> Tidslinjen
                </Link>
              </div>
            )}
          </nav>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-full border border-[#b49b60]/40 bg-[#0b1d2d]/95 px-4 py-2 text-xs font-bold text-[#f3e0a3] shadow-lg transition hover:bg-[#19384a]"
          >
            <X size={13} className="mr-1 inline" /> Stäng
          </button>
        </div>
      )}
    </div>
  );
}
