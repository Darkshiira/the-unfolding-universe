import Image from "next/image";
import Link from "next/link";
import ZoomableFigure from "./ZoomableFigure";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Leaf,
  Microscope,
  HelpCircle,
} from "lucide-react";
import type { Milestone } from "../timeline-data";
import { milestones, palette } from "../timeline-data";
import type { MilestoneArticleData } from "../content/types";
import MuseumShowcase from "./MuseumShowcase";

export default function MilestoneArticle({
  milestone,
  article,
}: {
  milestone: Milestone;
  article: MilestoneArticleData;
}) {
  const colors = palette[milestone.category];
  const related = article.relatedIds
    .map((id) => milestones.find((item) => item.id === id))
    .filter((item): item is Milestone => Boolean(item));

  return (
    <article className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-10 sm:pt-16">
      {/* A cinematic image with REAL HTML text, not lettering baked into the image. */}
      <div className="relative -mx-5 overflow-hidden bg-[#151F26] sm:-mx-10 sm:rounded-[28px]">
        <div className="relative min-h-[390px] sm:min-h-[470px]">
          <Image
            src={article.hero.src}
            alt={article.hero.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C151B]/90 via-[#0C151B]/35 to-[#0C151B]/10 sm:bg-gradient-to-r sm:from-[#0C151B]/95 sm:via-[#0C151B]/50 sm:to-transparent" />
          <div className="relative z-10 flex min-h-[390px] max-w-2xl flex-col justify-end px-6 pb-12 pt-20 sm:min-h-[470px] sm:px-12 sm:pb-16">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F1C18F]">
              {colors.label} · {milestone.date}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {milestone.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#F5EEE3] sm:text-lg">
              {article.lead}
            </p>
          </div>
        </div>
        <p className="bg-[#1A242A] px-6 py-3 text-[11px] leading-5 text-[#D3C9BA] sm:px-12">
          {article.hero.caption} · {article.hero.credit}
        </p>
      </div>

      <div
        id="oversikt"
        className="mt-12 grid scroll-mt-8 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_290px]"
      >
        <div className="min-w-0 space-y-14">
          {/* Museum showcase on mobile and tablet */}
          {article.showcase && (
            <div className="lg:hidden">
              <MuseumShowcase
                src={article.showcase.src}
                title={article.showcase.title}
                description={article.showcase.description}
                alt={article.showcase.alt}
              />
            </div>
          )}

          <nav
            aria-label="På den här sidan"
            className="rounded-2xl border border-[#E1D7C8] bg-[#FFFCF6] p-6"
          >
            <p className="flex items-center gap-2 font-semibold text-[#465C4E]">
              <BookOpen size={18} /> I den här upptäckten
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {article.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm leading-6 text-[#627F6B] underline-offset-4 hover:underline"
                >
                  {section.heading}
                </a>
              ))}
            </div>
          </nav>

          {article.sections.map((section, index) => (
            <section id={section.id} key={section.id} className="scroll-mt-24">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B48E6B]">
                KAPITEL {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#34473C] sm:text-3xl">
                {section.heading}
              </h2>
              <div className="mt-5 space-y-5">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className="text-[15px] leading-8 text-[#616B61] sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.image && (
                <div className="mt-7">
                  <ZoomableFigure image={section.image} />
                </div>
              )}
            </section>
          ))}

          <section className="rounded-[24px] border border-[#D6DED4] bg-[#EDF2E9] p-6 sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-[#465F4E]">
              <Microscope size={22} /> Hur vet forskarna det?
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-[15px] leading-7 text-[#5C6D5F]">
              {article.evidence.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-[24px] border border-[#E5D9C5] bg-[#FFFCF6] p-6 sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-[#806C55]">
              <HelpCircle size={22} /> Vad vet vi inte ännu?
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-[15px] leading-7 text-[#6B6A60]">
              {article.uncertainties.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-5">
          {/* Museum showcase in the desktop sidebar */}
          {article.showcase && (
            <div className="hidden lg:block">
              <MuseumShowcase
                src={article.showcase.src}
                title={article.showcase.title}
                description={article.showcase.description}
                alt={article.showcase.alt}
              />
            </div>
          )}

          <div className="rounded-2xl border border-[#E6DDCD] bg-[#F6F0E5] p-6">
            <h2 className="flex items-center gap-2 font-semibold text-[#718363]">
              <Leaf size={18} /> Visste du att?
            </h2>
            <ul className="mt-4 space-y-4 text-sm leading-7 text-[#686B60]">
              {article.facts.map((fact) => (
                <li
                  key={fact}
                  className="border-b border-[#E2D7C7] pb-3 last:border-0 last:pb-0"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#E6DDCD] bg-[#FFFCF6] p-6">
            <h2 className="font-semibold text-[#34473C]">
              Källor och vidare läsning
            </h2>
            <p className="mt-2 text-xs leading-6 text-[#817B6E]">
              Vetenskapliga källor och vidare läsning. Vissa bilder är
              AI-genererade konstnärliga rekonstruktioner, inte fotografier.
            </p>
            <ul className="mt-4 space-y-3">
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm leading-6 text-[#607F69] underline-offset-4 hover:underline"
                  >
                    <ExternalLink size={14} className="mt-1 shrink-0" />
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-[#DDD8CD] pt-9">
          <h2 className="text-2xl font-semibold text-[#34473C]">
            Fortsätt upptäcka
          </h2>
          <p className="mt-2 text-sm text-[#817B6E]">
            Nästa kapitel i vår planets historia väntar.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/timeline/${item.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-[#DDD8CD] bg-[#FFFCF6] p-5 transition hover:-translate-y-0.5 hover:bg-[#F2EBDF]"
              >
                <span className="text-4xl" aria-hidden="true">
                  {item.symbol}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#34473C]">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#8D8171]">
                    {item.date}
                  </span>
                </span>
                <ArrowRight size={16} className="shrink-0 text-[#718363]" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
