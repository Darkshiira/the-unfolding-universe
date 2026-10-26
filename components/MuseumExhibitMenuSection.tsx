"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  exhibitCategories,
  museumExhibits,
} from "@/app/museum/museum-exhibits";

type Props = {
  currentExhibitId?: string;
  onBack: () => void;
};

export default function MuseumExhibitMenuSection({
  currentExhibitId,
  onBack,
}: Props) {
  return (
    <div className="flex min-h-0 w-full flex-col">
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
      >
        <ArrowLeft size={16} />
        Tillbaka till menyn
      </button>

      <div className="my-1 shrink-0 border-t border-white/10" />

      <div
        aria-label="Museets utställningar"
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-1 py-1"
      >
        {exhibitCategories.map((category) => {
          const exhibits = museumExhibits.filter(
            (exhibit) => exhibit.category === category.id,
          );

          if (exhibits.length === 0) return null;

          return (
            <section key={category.id}>
              <h3 className="px-2 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-teal-300">
                {category.title}
              </h3>

              <div className="space-y-1">
                {exhibits.map((exhibit) => {
                  const isCurrent = exhibit.id === currentExhibitId;

                  const canVisit =
                    Boolean(exhibit.href) && exhibit.status !== "planned";

                  const content = (
                    <>
                      <span aria-hidden="true" className="shrink-0 text-base">
                        {exhibit.emoji}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-xs font-semibold leading-5">
                          {exhibit.title}
                        </span>

                        <span className="mt-0.5 block text-[10px] leading-4 text-slate-300/70">
                          {isCurrent
                            ? "Du är här"
                            : exhibit.status === "planned"
                              ? "Planerad"
                              : exhibit.status === "development"
                                ? "Under utveckling"
                                : "Utforska"}
                        </span>
                      </span>
                    </>
                  );

                  const classes =
                    "flex min-w-0 items-start gap-2 rounded-xl px-2 py-2.5 text-left text-white";

                  if (isCurrent) {
                    return (
                      <div
                        key={exhibit.id}
                        aria-current="page"
                        className={`${classes} bg-teal-300/10`}
                      >
                        {content}
                      </div>
                    );
                  }

                  if (canVisit && exhibit.href) {
                    return (
                      <Link
                        key={exhibit.id}
                        href={exhibit.href}
                        className={`${classes} transition hover:bg-white/10`}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <div key={exhibit.id} className={`${classes} opacity-65`}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
