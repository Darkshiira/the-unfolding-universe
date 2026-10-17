import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Leaf,
  Telescope,
  Clock3,
} from "lucide-react";
import { notFound } from "next/navigation";
import { milestones, palette } from "../timeline-data";
import { getMilestoneEra } from "../timeline-eras";

type Props = { params: Promise<{ id: string }> };

const stories: Record<
  string,
  { heading: string; paragraphs: string[]; evidence: string }
> = {
  earth: {
    heading: "En planet växer fram",
    paragraphs: [
      "För ungefär 4,54 miljarder år sedan samlades små partiklar i solsystemets unga skiva. Genom otaliga kollisioner växte de till allt större kroppar.",
      "Den tidiga jorden var mycket het. Med tiden förändrades ytan, atmosfären och haven. Planetens historia hade bara börjat.",
    ],
    evidence:
      "Forskare daterar bland annat mycket gamla mineral och meteoriter för att förstå solsystemets ålder.",
  },
  moon: {
    heading: "En dramatisk början",
    paragraphs: [
      "Den ledande hypotesen är att en stor himlakropp kolliderade med den unga jorden. Material från kollisionen bildade så småningom månen.",
      "Månen påverkar tidvattnet och hjälper till att stabilisera jordaxelns lutning.",
    ],
    evidence:
      "Månstenar och datormodeller ger forskare ledtrådar om hur månen kan ha bildats.",
  },
  microbes: {
    heading: "Liv som nästan inte syntes",
    paragraphs: [
      "Livet på den unga jorden var länge mycket enkelt. Små mikroorganismer levde i vatten och lämnade spår som forskare kan undersöka idag.",
      "Under en stor del av jordens historia fanns varken skogar, dinosaurier eller människor.",
    ],
    evidence:
      "Mikroskopiska fossil och kemiska signaturer i gamla bergarter används som bevis för tidigt liv.",
  },
  oxygen: {
    heading: "En ny sorts atmosfär",
    paragraphs: [
      "Fotosyntetiserande mikroorganismer släppte ut syre. Under mycket lång tid reagerade syret med ämnen i haven och berggrunden.",
      "Så småningom ökade mängden syre i atmosfären. Det förändrade förutsättningarna för många organismer.",
    ],
    evidence:
      "Gamla bergarter visar kemiska förändringar som hjälper forskare att rekonstruera syrets historia.",
  },
  dinosaurs: {
    heading: "En värld av dinosaurier",
    paragraphs: [
      "Dinosaurierna uppstod under trias och utvecklades till en stor mångfald av arter. Vissa var små, andra blev några av de största landdjuren någonsin.",
      "Alla dinosaurier försvann inte. Fåglarna är en överlevande gren av dinosauriernas släktträd.",
    ],
    evidence:
      "Fossil av ben, fotspår, ägg och fjädrar hjälper oss att förstå deras liv.",
  },
  humans: {
    heading: "En ny gren i livets historia",
    paragraphs: [
      "Homo sapiens utvecklades i Afrika för ungefär 300 000 år sedan. Vi är en av många arter som har funnits inom människans evolutionära släktträd.",
      "Vår historia är en mycket liten del av jordens 4,54 miljarder år, men vi har hunnit förändra planeten på stora sätt.",
    ],
    evidence:
      "Fossil, arkeologiska fynd och DNA ger olika pusselbitar till vår historia.",
  },
};

export function generateStaticParams() {
  return milestones.map((milestone) => ({ id: milestone.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const milestone = milestones.find((item) => item.id === id);
  return {
    title: milestone
      ? `${milestone.title} | The Unfolding Universe`
      : "Jordens historia",
    description: milestone?.description ?? "Utforska jordens historia.",
  };
}

export default async function MilestonePage({ params }: Props) {
  const { id } = await params;
  const milestone = milestones.find((item) => item.id === id);
  if (!milestone) notFound();

  const colors = palette[milestone.category];
  const story = stories[id];
  const related = milestones
    .filter(
      (item) =>
        item.category === milestone.category && item.id !== milestone.id,
    )
    .sort((a, b) => Math.abs(a.x - milestone.x) - Math.abs(b.x - milestone.x))
    .slice(0, 3);

  return (
    <main className="min-h-svh bg-[#F8F5EE] text-[#34473C]">
      <header className="border-b border-[#DDD8CD] bg-[#FBF9F3] px-5 py-5 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/timeline"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#657D69] hover:text-[#344F3B]"
          >
            <ArrowLeft size={17} /> Tillbaka till tidslinjen
          </Link>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.24em] text-[#9B8972] sm:block">
            THE UNFOLDING UNIVERSE
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-10 sm:pt-20">
        <p
          className="mb-4 text-xs font-bold uppercase tracking-[0.22em]"
          style={{ color: colors.color }}
        >
          {colors.label} · {milestone.date}
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {milestone.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#697064]">
          {milestone.description}
        </p>

        <div className="mt-12 grid overflow-hidden rounded-[28px] border border-[#DED7CA] lg:grid-cols-[1.2fr_1fr]">
          <div
            className="relative flex min-h-[330px] items-center justify-center overflow-hidden"
            style={{ backgroundColor: colors.light }}
          >
            {milestone.image ? (
              <Image
                src={milestone.image}
                alt={milestone.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            ) : (
              <span
                className="text-[170px]"
                role="img"
                aria-label={milestone.title}
              >
                {milestone.symbol}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center bg-[#FFFCF6] p-8 sm:p-12">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9D896D]">
              <Clock3 size={16} /> En stund i jordens historia
            </p>
            <h2 className="mt-5 text-2xl font-semibold">
              {story?.heading ?? milestone.title}
            </h2>
            <p className="mt-5 leading-8 text-[#697064]">
              {story?.paragraphs[0] ?? milestone.description}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_320px]">
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-semibold">
              <BookOpen size={22} className="text-[#9D896D]" /> Upptäck mer
            </h2>
            {(story?.paragraphs.slice(1) ?? [milestone.description]).map(
              (paragraph, index) => (
                <p key={index} className="max-w-2xl leading-8 text-[#697064]">
                  {paragraph}
                </p>
              ),
            )}
            <div className="rounded-2xl border border-[#E3DCCE] bg-[#FFFCF6] p-6">
              <h3 className="flex items-center gap-2 font-semibold text-[#536F64]">
                <Telescope size={18} /> Hur vet forskarna det?
              </h3>
              <p className="mt-3 leading-7 text-[#697064]">
                {story?.evidence ??
                  "Forskare jämför fossil, bergarter och andra vetenskapliga fynd för att förstå den här delen av jordens historia. Forskningen fortsätter att utvecklas."}
              </p>
            </div>
            <p className="text-xs italic text-[#9B8972]">
              Tiderna är ungefärliga. Tidslinjens avstånd är illustrativa, inte
              skalenliga.
            </p>
          </section>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#E6DDCD] bg-[#F6F0E5] p-6">
              <h2 className="flex items-center gap-2 font-bold text-[#718363]">
                <Leaf size={18} /> Visste du att?
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#686B60]">
                {milestone.fact}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E6DDCD] bg-[#FFFCF6] p-6">
              <h2 className="text-sm font-semibold">Geologisk tid</h2>
              <p className="mt-2 text-sm text-[#686B60]">
                {getMilestoneEra(milestone)}
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-16 border-t border-[#DDD8CD] pt-8">
          <h2 className="mb-5 text-xl font-semibold">
            Utforska fler upptäckter
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/timeline/${item.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-[#DDD8CD] bg-[#FFFCF6] p-4 hover:bg-[#F2EBDF]"
              >
                <span className="text-3xl">{item.symbol}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs text-[#8D8171]">
                    {item.date}
                  </span>
                </span>
                <ArrowRight size={16} className="shrink-0 text-[#718363]" />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
