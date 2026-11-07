"use client";

import { useCallback, useState } from "react";
import MuseumResearchMenu from "../../MuseumResearchMenu";
import {
  ArrowRight,
  Dna,
  Heart,
  RotateCcw,
  Sparkles,
  X,
  FlaskConical,
  Microscope,
} from "lucide-react";

type Genes = { coat: "BB" | "Bb" | "bb"; texture: "SS" | "Ss" | "ss" };
type Parent = { id: string; name: string; genes: Genes };
type Baby = {
  genes: Genes;
  inherited: { coat: [string, string]; texture: [string, string] };
};
type Props = { onClose?: () => void };
type Species = "guinea" | "rabbit" | "mouse";
type Trait = "coat" | "texture";
type LandscapeStage = "parents" | "hypothesis" | "inheritance";

const PARENTS: Parent[] = [
  { id: "mossa", name: "Mossa", genes: { coat: "Bb", texture: "Ss" } },
  { id: "kotte", name: "Kotte", genes: { coat: "Bb", texture: "ss" } },
  { id: "moln", name: "Moln", genes: { coat: "bb", texture: "Ss" } },
  { id: "tindra", name: "Tindra", genes: { coat: "BB", texture: "SS" } },
];

const SPECIES: {
  id: Species;
  name: string;
  emoji: string;
  texture: [string, string];
  animals: Parent[];
}[] = [
  {
    id: "guinea",
    name: "Marsvin",
    emoji: "🐹",
    texture: ["rufsig", "slät"],
    animals: PARENTS,
  },
  {
    id: "rabbit",
    name: "Kaniner",
    emoji: "🐰",
    texture: ["upprättstående", "hängande"],
    animals: [
      { id: "tuss", name: "Tuss", genes: { coat: "Bb", texture: "Ss" } },
      { id: "snö", name: "Snö", genes: { coat: "bb", texture: "ss" } },
      { id: "skugga", name: "Skugga", genes: { coat: "BB", texture: "Ss" } },
      { id: "fluff", name: "Fluff", genes: { coat: "Bb", texture: "SS" } },
    ],
  },
  {
    id: "mouse",
    name: "Möss",
    emoji: "🐭",
    texture: ["lång", "kort"],
    animals: [
      { id: "pip", name: "Pip", genes: { coat: "Bb", texture: "ss" } },
      { id: "smulan", name: "Smulan", genes: { coat: "bb", texture: "Ss" } },
      { id: "natt", name: "Natt", genes: { coat: "BB", texture: "Ss" } },
      { id: "frö", name: "Frö", genes: { coat: "Bb", texture: "SS" } },
    ],
  },
];

const coatLabel = (g: Genes, species: Species) =>
  species === "rabbit"
    ? g.coat === "bb"
      ? "blå"
      : "brun"
    : g.coat === "bb"
      ? "ljus"
      : "mörk";
const textureLabel = (g: Genes, species: Species) =>
  species === "rabbit"
    ? g.texture === "ss"
      ? "hängande"
      : "upprättstående"
    : species === "mouse"
      ? g.texture === "ss"
        ? "kort"
        : "lång"
      : g.texture === "ss"
        ? "slät"
        : "rufsig";
const traitName = (species: Species, trait: Trait) =>
  species === "rabbit"
    ? trait === "coat"
      ? "Ögonfärg"
      : "Öronform"
    : species === "mouse"
      ? trait === "coat"
        ? "Pälsfärg"
        : "Svanslängd"
      : trait === "coat"
        ? "Pälsfärg"
        : "Pälsstruktur";
const traitPhrase = (species: Species, trait: Trait, genes: Genes) =>
  species === "rabbit"
    ? trait === "coat"
      ? `${coatLabel(genes, species)}a ögon`
      : `${textureLabel(genes, species)} öron`
    : species === "mouse" && trait === "texture"
      ? `${textureLabel(genes, species)} svans`
      : `${trait === "coat" ? coatLabel(genes, species) : textureLabel(genes, species)} päls`;
const traitDescription = (species: Species, genes: Genes) =>
  species === "rabbit"
    ? `${coatLabel(genes, species)}a ögon · ${textureLabel(genes, species)} öron`
    : species === "mouse"
      ? `${coatLabel(genes, species)} päls · ${textureLabel(genes, species)} svans`
      : `${coatLabel(genes, species)} · ${textureLabel(genes, species)}`;
const normalized = (a: string, b: string) =>
  a === "B" || b === "B" ? (a === "B" && b === "B" ? "BB" : "Bb") : "bb";
const normalizedTexture = (a: string, b: string) =>
  a === "S" || b === "S" ? (a === "S" && b === "S" ? "SS" : "Ss") : "ss";

const svgCoordinate = (value: number) => Number(value.toFixed(3));

function GuineaPig({
  genes,
  baby = false,
  animate = false,
}: {
  genes: Genes;
  baby?: boolean;
  animate?: boolean;
}) {
  const light = genes.coat === "bb";
  const fluffy = genes.texture !== "ss";
  const fur = light ? "#e9d5b8" : "#9b674b";
  const shadow = light ? "#c7aa85" : "#70452f";
  return (
    <svg
      viewBox="0 0 240 190"
      role="img"
      aria-label={`${light ? "Ljust" : "Mörkt"} marsvin med ${fluffy ? "rufsig" : "slät"} päls`}
      className={`h-full w-full drop-shadow-[0_12px_14px_rgba(0,0,0,.16)] ${animate ? "baby-reveal" : ""}`}
    >
      <ellipse cx="121" cy="169" rx="88" ry="10" fill="#1e3a35" opacity=".12" />
      <g transform={baby ? "translate(25 22) scale(.8)" : undefined}>
        <ellipse cx="84" cy="135" rx="19" ry="12" fill={shadow} />
        <ellipse cx="164" cy="136" rx="19" ry="12" fill={shadow} />
        {fluffy &&
          Array.from({ length: 18 }, (_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={svgCoordinate(113 + Math.cos(angle) * 72)}
                cy={svgCoordinate(102 + Math.sin(angle) * 52)}
                r="19"
                fill={fur}
              />
            );
          })}
        <ellipse cx="114" cy="103" rx="82" ry="57" fill={fur} />
        <ellipse
          cx="84"
          cy="62"
          rx="20"
          ry="25"
          fill={shadow}
          transform="rotate(-20 84 62)"
        />
        <ellipse
          cx="86"
          cy="63"
          rx="11"
          ry="15"
          fill="#e8aaa9"
          transform="rotate(-20 86 63)"
        />
        <ellipse
          cx="167"
          cy="63"
          rx="20"
          ry="25"
          fill={shadow}
          transform="rotate(20 167 63)"
        />
        <ellipse
          cx="165"
          cy="63"
          rx="11"
          ry="15"
          fill="#e8aaa9"
          transform="rotate(20 165 63)"
        />
        <ellipse cx="145" cy="104" rx="51" ry="47" fill={fur} />
        <ellipse
          cx="172"
          cy="120"
          rx="27"
          ry="23"
          fill={light ? "#f7e9d2" : "#bb8a6a"}
        />
        {/* Both eyes remain visible on the gently three-quarter-facing head. */}
        <circle cx="119" cy="91" r="6.5" fill="#211b20" />
        <circle cx="121" cy="89" r="2.2" fill="white" />
        <circle cx="159" cy="92" r="7" fill="#211b20" />
        <circle cx="161" cy="90" r="2.5" fill="white" />
        <ellipse cx="192" cy="115" rx="9" ry="7" fill="#d78f99" />
        <path
          d="M189 125 Q180 134 174 126"
          stroke={shadow}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M192 122 L217 116 M192 126 L217 130"
          stroke="#f5e9de"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {fluffy &&
          [40, 57, 73, 92, 111, 132].map((x, i) => (
            <path
              key={x}
              d={`M${x} ${57 - (i % 2) * 6} q-7 -12 3 -18`}
              stroke={shadow}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity=".65"
            />
          ))}
      </g>
    </svg>
  );
}

function AnimalPicture({
  species,
  genes,
  baby = false,
  animate = false,
}: {
  species: Species;
  genes: Genes;
  baby?: boolean;
  animate?: boolean;
}) {
  if (species === "guinea")
    return <GuineaPig genes={genes} baby={baby} animate={animate} />;
  const light = genes.coat === "bb";
  const fluffy = genes.texture !== "ss";
  const fur = species === "rabbit" ? "#d9c4ad" : light ? "#ead8c0" : "#987057";
  const shade =
    species === "rabbit" ? "#aa8c76" : light ? "#d3baa0" : "#76513e";
  return (
    <svg
      viewBox="0 0 240 190"
      role="img"
      aria-label={`${species === "rabbit" ? "Kanin" : "Mus"}: ${traitDescription(species, genes)}`}
      className={`h-full w-full drop-shadow-[0_10px_12px_rgba(0,0,0,.12)] ${animate ? "baby-reveal" : ""}`}
    >
      <ellipse cx="118" cy="169" rx="79" ry="9" fill="#446276" opacity=".13" />
      <g transform={baby ? "translate(24 19) scale(.82)" : undefined}>
        {species === "rabbit" ? (
          <>
            <ellipse cx="87" cy="116" rx="66" ry="42" fill={fur} />
            <ellipse cx="146" cy="107" rx="45" ry="42" fill={fur} />
            {fluffy ? (
              <>
                <ellipse
                  cx="130"
                  cy="40"
                  rx="17"
                  ry="46"
                  fill={shade}
                  transform="rotate(-13 130 40)"
                />
                <ellipse
                  cx="161"
                  cy="36"
                  rx="17"
                  ry="48"
                  fill={shade}
                  transform="rotate(13 161 36)"
                />
                <ellipse
                  cx="130"
                  cy="40"
                  rx="9"
                  ry="35"
                  fill="#e5aeb2"
                  transform="rotate(-13 130 40)"
                />
                <ellipse
                  cx="161"
                  cy="36"
                  rx="9"
                  ry="37"
                  fill="#e5aeb2"
                  transform="rotate(13 161 36)"
                />
              </>
            ) : (
              <>
                {/* Lop ears: anchored to the crown, bending down beside the cheeks. */}
                <path
                  d="M119 80 C106 66 93 72 92 91 C89 112 98 143 113 147 C128 149 132 136 126 120 C120 105 119 92 119 80 Z"
                  fill={shade}
                />
                <path
                  d="M114 89 C104 81 100 93 102 111 C104 126 109 138 115 138 C122 137 121 125 117 113 C113 102 113 95 114 89 Z"
                  fill="#e5aeb2"
                />
                <path
                  d="M171 80 C182 66 198 72 204 90 C211 111 204 140 191 146 C177 152 169 140 175 122 C180 107 175 92 171 80 Z"
                  fill={shade}
                />
                <path
                  d="M180 90 C189 81 196 94 195 112 C194 127 191 138 185 139 C178 140 179 125 183 112 C185 102 183 95 180 90 Z"
                  fill="#e5aeb2"
                />
              </>
            )}
            <circle cx="30" cy="102" r="16" fill={fur} />
            <ellipse cx="60" cy="148" rx="24" ry="11" fill={shade} />
            <ellipse cx="150" cy="150" rx="25" ry="11" fill={shade} />
          </>
        ) : (
          <>
            {fluffy ? (
              <path
                d="M56 133 C18 144 7 105 27 69 C39 48 15 39 9 55"
                fill="none"
                stroke={shade}
                strokeWidth="7"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M56 133 Q42 130 35 123"
                fill="none"
                stroke={shade}
                strokeWidth="8"
                strokeLinecap="round"
              />
            )}
            <ellipse cx="103" cy="123" rx="67" ry="38" fill={fur} />
            <circle cx="157" cy="103" r="43" fill={fur} />
            <circle cx="130" cy="66" r="25" fill={shade} />
            <circle cx="182" cy="66" r="25" fill={shade} />
            <circle cx="130" cy="66" r="16" fill="#e5aeb2" />
            <circle cx="182" cy="66" r="16" fill="#e5aeb2" />
          </>
        )}
        {fluffy &&
          Array.from({ length: 9 }, (_, i) => (
            <circle
              key={i}
              cx={svgCoordinate(57 + i * 10)}
              cy={svgCoordinate(97 + Math.sin(i * 1.7) * 9)}
              r="12"
              fill={fur}
            />
          ))}
        <circle
          cx="155"
          cy="101"
          r="6"
          fill={
            species === "rabbit" ? (light ? "#d69ac4" : "#70452f") : "#231e20"
          }
        />
        <circle cx="157" cy="99" r="2" fill="white" />
        <circle
          cx="181"
          cy="103"
          r="6"
          fill={
            species === "rabbit" && light
              ? "#6d9ac4"
              : species === "rabbit"
                ? "#70452f"
                : "#231e20"
          }
        />
        <circle cx="183" cy="101" r="2" fill="white" />
        <ellipse cx="199" cy="121" rx="9" ry="7" fill="#dc9eab" />
        <path
          d="M199 126 L218 120 M199 129 L218 133"
          stroke={shade}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function makeBaby(a: Genes, b: Genes): Baby {
  const ac = a.coat[Math.floor(Math.random() * 2)];
  const bc = b.coat[Math.floor(Math.random() * 2)];
  const at = a.texture[Math.floor(Math.random() * 2)];
  const bt = b.texture[Math.floor(Math.random() * 2)];
  return {
    genes: { coat: normalized(ac, bc), texture: normalizedTexture(at, bt) },
    inherited: { coat: [ac, bc], texture: [at, bt] },
  };
}

function PunnettSquare({
  first,
  second,
  trait,
  baby,
  species,
}: {
  first: Parent;
  second: Parent;
  trait: Trait;
  baby: Baby | null;
  species: Species;
}) {
  const [inspected, setInspected] = useState<number | null>(null);
  const a = first.genes[trait].split("");
  const b = second.genes[trait].split("");
  const combine = (x: string, y: string) =>
    [x, y]
      .sort(
        (m, n) =>
          (m === m.toUpperCase() ? -1 : 1) - (n === n.toUpperCase() ? -1 : 1),
      )
      .join("");
  const target = baby?.genes[trait];
  const combinations = a.flatMap((x) => b.map((y) => combine(x, y)));
  const dominant = combinations.filter(
    (v) => v !== (trait === "coat" ? "bb" : "ss"),
  ).length;
  const matches = a
    .flatMap((x) => b.map((y) => combine(x, y)))
    .filter((v) => v === target).length;
  return (
    <div className="rounded-xl border border-[#c9e0ec] bg-[#f7fbfe] p-2 sm:rounded-[22px] sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-[.13em] text-[#5e8da6]">
          Korsningsschema
        </span>
        <span className="rounded-full bg-[#e3f2fb] px-2 py-1 text-[10px] font-bold text-[#4a86a8]">
          {trait === "coat"
            ? `${traitName(species, "coat")} · B/b`
            : `${traitName(species, "texture")} · S/s`}
        </span>
      </div>
      <div className="grid grid-cols-[minmax(28px,.45fr)_repeat(2,minmax(0,1fr))] gap-1 sm:grid-cols-[minmax(36px,.6fr)_repeat(2,minmax(0,1fr))] sm:gap-2">
        <div className="flex items-center justify-center text-[10px] font-semibold text-[#68889a]">
          ↓ × →
        </div>
        {b.map((v, i) => (
          <div
            key={"col" + i}
            className="rounded-lg bg-[#deeff8] py-2 text-center text-base font-extrabold text-[#256b92]"
          >
            {v}
          </div>
        ))}
        {a.map((v, i) => (
          <div key={"row" + i} className="contents">
            <div className="flex items-center justify-center rounded-lg bg-[#deeff8] text-base font-extrabold text-[#256b92]">
              {v}
            </div>
            {b.map((w, j) => {
              const value = combine(v, w);
              const isMatch = !!baby && value === target;
              const sampleGenes: Genes =
                trait === "coat"
                  ? { coat: value as Genes["coat"], texture: "ss" }
                  : { coat: "Bb", texture: value as Genes["texture"] };
              const phenotype =
                trait === "coat"
                  ? coatLabel(sampleGenes, species)
                  : textureLabel(sampleGenes, species);
              return (
                <button
                  type="button"
                  key={i + "-" + j}
                  onClick={() => setInspected(i * 2 + j)}
                  aria-pressed={inspected === i * 2 + j}
                  aria-label={`Undersök ${value}: ${first.name} ger ${v}, ${second.name} ger ${w}`}
                  className={`flex min-h-[98px] flex-col items-center justify-center rounded-lg border px-0.5 py-1.5 transition-colors sm:min-h-[112px] sm:rounded-xl sm:px-1 sm:py-2 ${inspected === i * 2 + j ? "ring-2 ring-[#318fbd] ring-offset-1 " : ""}${isMatch ? "border-[#4aafd9] bg-[#d9f1fd] text-[#17658b]" : "border-[#dbe8f0] bg-white text-[#35576d]"}`}
                >
                  <div
                    className="h-[56px] w-full max-w-[95px]"
                    aria-hidden="true"
                  >
                    <AnimalPicture species={species} genes={sampleGenes} baby />
                  </div>
                  <span className="text-base font-extrabold leading-tight">
                    {value}
                  </span>
                  <span className="text-[10px] font-semibold capitalize leading-tight">
                    {phenotype}
                  </span>
                  {isMatch && (
                    <span className="mt-0.5 text-[9px] font-semibold">
                      Möjligt utfall
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div
        className="mt-3 overflow-hidden rounded-full bg-[#e9d8c2] h-3"
        aria-label={`${dominant * 25} procent dominant egenskap och ${(4 - dominant) * 25} procent recessiv egenskap`}
      >
        <div
          className="h-full bg-[#9b674b] transition-all"
          style={{ width: `${dominant * 25}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-bold text-[#527a91]">
        <span>
          {dominant * 25}%{" "}
          {trait === "coat"
            ? coatLabel({ coat: "BB", texture: "SS" }, species)
            : textureLabel({ coat: "BB", texture: "SS" }, species)}
        </span>
        <span>
          {(4 - dominant) * 25}%{" "}
          {trait === "coat"
            ? coatLabel({ coat: "bb", texture: "ss" }, species)
            : textureLabel({ coat: "bb", texture: "ss" }, species)}
        </span>
      </div>
      {inspected !== null && (
        <div
          className="mt-3 rounded-xl border border-[#b8daed] bg-[#eaf6fc] p-3 text-xs leading-relaxed text-[#285976]"
          aria-live="polite"
        >
          <strong>🔬 Forskarens upptäckt!</strong> {first.name} gav{" "}
          <strong>{a[Math.floor(inspected / 2)]}</strong> och {second.name} gav{" "}
          <strong>{b[inspected % 2]}</strong>. Tillsammans blir det{" "}
          <strong>{combinations[inspected]}</strong> – alltså{" "}
          <strong>
            {trait === "coat"
              ? coatLabel(
                  {
                    coat: combinations[inspected] as Genes["coat"],
                    texture: "SS",
                  },
                  species,
                )
              : textureLabel(
                  {
                    coat: "BB",
                    texture: combinations[inspected] as Genes["texture"],
                  },
                  species,
                )}
          </strong>{" "}
          ({traitName(species, trait).toLowerCase()}).
        </div>
      )}
      <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[#5c7e91]">
        <Dna size={15} className="mt-0.5 shrink-0 text-[#458db4]" />
        <p>
          {baby
            ? `Ungens genpar blev ${target}. ${matches} av 4 rutor visar samma genpar (${matches * 25} %).`
            : `Varje ruta visar en lika sannolik genkombination från ${first.name} och ${second.name}. Flera rutor kan ge samma utseende.`}
        </p>
      </div>
    </div>
  );
}

export default function GenlabbetGuineaPigs({ onClose }: Props) {
  const [species, setSpecies] = useState<Species>("guinea");
  const [first, setFirst] = useState(PARENTS[0].id);
  const [second, setSecond] = useState(PARENTS[1].id);
  const [guessCoat, setGuessCoat] = useState<string | null>(null);
  const [guessTexture, setGuessTexture] = useState<string | null>(null);
  const [baby, setBaby] = useState<Baby | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [round, setRound] = useState(0);
  const [landscapeStage, setLandscapeStage] =
    useState<LandscapeStage>("parents");
  const [trait, setTrait] = useState<"coat" | "texture">("coat");
  const animals = SPECIES.find((s) => s.id === species)!.animals;
  const p1 = animals.find((p) => p.id === first) ?? animals[0];
  const p2 = animals.find((p) => p.id === second) ?? animals[1];
  const reset = useCallback(() => {
    setBaby(null);
    setGuessCoat(null);
    setGuessTexture(null);
    setShowWhy(false);
  }, []);

  const changeSpecies = (id: Species) => {
    setSpecies(id);

    const group = SPECIES.find((s) => s.id === id)!;

    setFirst(group.animals[0].id);
    setSecond(group.animals[1].id);

    reset();
    setLandscapeStage("parents");
  };
  const reveal = () => {
    setBaby(makeBaby(p1.genes, p2.genes));
    setShowWhy(false);
    setRound((v) => v + 1);
  };
  const choice =
    "rounded-lg border px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400";
  return (
    <div
      className="relative isolate min-h-[100dvh] overflow-x-hidden bg-[#edf5f9] text-[#17374d]"
      lang="sv"
    >
      <style>{`
        /* Dedicated phone-landscape stations; portrait and desktop are unchanged. */
        @media (orientation: landscape) and (max-width: 900px) {
          .genlabbet-header-inner { padding-top: 7px; padding-bottom: 7px; }
          .genlabbet-header-title { font-size: 1.05rem; line-height: 1.15; }
          .genlabbet-header-eyebrow { display: none; }
          .genlabbet-main { padding-top: 10px; padding-bottom: 16px; }
          .genlabbet-experiment-badge { margin-bottom: 9px; }
          .genlabbet-desktop-progress { display: none; }
          .genlabbet-landscape-nav { display: grid; }
          .genlabbet-stations { gap: 0; }
          .genlabbet-station { display: none; }
          .genlabbet-station[data-landscape-active="true"] { display: block; }
          .genlabbet-station[data-landscape-active="true"] { padding: 12px 14px; }
          .genlabbet-station-parents[data-landscape-active="true"] { margin-top: 39px; }
          .genlabbet-station-parents .genlabbet-parent-grid { max-width: 650px; }
          .genlabbet-station-parents .genlabbet-parent-picture { max-width: 125px; }
          .genlabbet-station-parents .genlabbet-parent-card { padding: 7px; }
          .genlabbet-station-parents .genlabbet-parent-name { font-size: 1rem; }
          .genlabbet-station-parents .genlabbet-parent-description { margin-bottom: 5px; min-height: 0; }
          .genlabbet-station-parents .genlabbet-parent-select { padding-top: 6px; padding-bottom: 6px; }
          .genlabbet-station-hypothesis .genlabbet-section-heading,
          .genlabbet-station-inheritance .genlabbet-section-heading { margin-bottom: 10px; }
          .genlabbet-station-hypothesis .genlabbet-hypothesis-fieldset { margin-bottom: 10px; }
          .genlabbet-station-hypothesis .genlabbet-hypothesis-action { padding-top: 10px; padding-bottom: 10px; }
          .genlabbet-science-note { margin-top: 10px; }
        }
      `}</style>
      <style>{`@keyframes baby-pop{0%{transform:scale(.35) translateY(45px);opacity:0}65%{transform:scale(1.07) translateY(-5px);opacity:1}100%{transform:scale(1);opacity:1}}.baby-reveal{animation:baby-pop .65s cubic-bezier(.2,1.5,.4,1) both}@media(prefers-reduced-motion:reduce){.baby-reveal{animation:none}}`}</style>
      <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-[#d6eaf5] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-12 h-96 w-96 rounded-full bg-[#dcebf7] blur-3xl" />
      <header className="relative z-50 border-b border-[#d1e2eb] bg-[#f8fcff]/95 backdrop-blur-md">
        <div className="genlabbet-header-inner mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-8 sm:py-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#bddae9] bg-[#e5f3fb] text-[#277ca5] sm:h-11 sm:w-11 sm:rounded-2xl">
              <Microscope size={20} className="sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <p className="genlabbet-header-eyebrow text-[8px] font-extrabold uppercase leading-tight tracking-[.1em] text-[#648ba2] sm:text-[10px] sm:tracking-[.18em]">
                The Unfolding Universe · Forskningsstation 01
              </p>
              <h1 className="genlabbet-header-title font-sans text-[clamp(1.12rem,5vw,1.5rem)] font-bold leading-tight sm:text-3xl">
                Genlabbet <span className="text-[#62a9cc]">·</span> Vem blir
                ungen?
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <MuseumResearchMenu onSelectSpecies={changeSpecies} />
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Stäng Genlabbet"
                className="rounded-full border border-[#cbdde8] bg-white/80 p-2.5 hover:bg-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </header>
      <main
        id="genlabbet-intro"
        className="genlabbet-main relative z-0 mx-auto max-w-6xl px-3 pb-10 pt-4 sm:px-8 sm:pb-12 sm:pt-6"
      >
        {/* The experiment label replaces the redundant welcome paragraph. */}
        <div className="genlabbet-experiment-badge mb-4 flex justify-start">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9dfea] bg-white/90 px-3 py-1.5 text-xs font-bold text-[#477f9d]">
            <FlaskConical size={13} /> Experiment 01 ·{" "}
            {SPECIES.find((s) => s.id === species)!.name}
          </span>
        </div>
        <div className="genlabbet-desktop-progress hidden sm:grid mb-5 grid grid-cols-3 gap-1 rounded-lg border border-[#d5e5ef] bg-white/80 p-1 text-center text-[10px] font-bold text-[#547c93] sm:mb-6 sm:gap-2 sm:p-1.5 sm:text-xs">
          <div className="flex min-h-9 items-center justify-center rounded-lg bg-[#e8f4fa] px-1 py-1.5 sm:px-2 sm:py-2">
            <span className="sm:hidden">01</span>
            <span className="hidden sm:inline">01 · Välj föräldrar</span>
          </div>
          <div className="flex min-h-9 items-center justify-center rounded-lg bg-[#e8f4fa] px-1 py-1.5 sm:px-2 sm:py-2">
            <span className="sm:hidden">02</span>
            <span className="hidden sm:inline">02 · Gör en hypotes</span>
          </div>
          <div className="flex min-h-9 items-center justify-center rounded-lg bg-[#e8f4fa] px-1 py-1.5 sm:px-2 sm:py-2">
            <span className="sm:hidden">03</span>
            <span className="hidden sm:inline">03 · Undersök arvet</span>
          </div>
        </div>
        {/* On phone landscape, switch between stations instead of stacking them. */}
        <nav
          aria-label="Forskningsstationer"
          className="genlabbet-landscape-nav mb-3 hidden grid-cols-3 gap-1.5 rounded-xl border border-[#c9dfec] bg-white/90 p-1.5"
        >
          {(
            [
              ["parents", "01 · Föräldrar"],
              ["hypothesis", baby ? "02 · Resultat" : "02 · Hypotes"],
              ["inheritance", "03 · Arvet"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-current={landscapeStage === id ? "step" : undefined}
              onClick={() => setLandscapeStage(id)}
              className={`min-w-0 rounded-lg px-1.5 py-2 text-[11px] font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#308dbb] ${landscapeStage === id ? "bg-[#dceffa] text-[#175b7f] shadow-sm" : "text-[#63869a] hover:bg-[#edf6fa]"}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="genlabbet-stations flex flex-col gap-5 sm:gap-6">
          <section
            data-landscape-active={landscapeStage === "inheritance"}
            className="genlabbet-station genlabbet-station-inheritance order-3 rounded-xl border border-[#d8e5ed] bg-white/95 p-3 shadow-[0_12px_30px_rgba(34,92,125,.055)] sm:p-6"
          >
            <div className="">
              <div className="genlabbet-section-heading mb-5 flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f4fb] text-[#277da7]">
                  <Dna size={19} />
                </span>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    03 · Undersök arvet
                  </h3>
                  <p className="mt-0.5 text-xs text-[#64849a]">
                    Se hur föräldrarnas gener kan kombineras i korsningsschemat.
                  </p>
                </div>
              </div>
              <div
                className="mx-auto mb-3 grid max-w-xl grid-cols-2 gap-2"
                role="group"
                aria-label="Välj egenskap"
              >
                <button
                  type="button"
                  onClick={() => setTrait("coat")}
                  aria-pressed={trait === "coat"}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold ${trait === "coat" ? "border-[#389ac8] bg-[#dceffa] text-[#195b80]" : "border-[#d4e5ef] bg-white"}`}
                >
                  {traitName(species, "coat")}
                </button>
                <button
                  type="button"
                  onClick={() => setTrait("texture")}
                  aria-pressed={trait === "texture"}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold ${trait === "texture" ? "border-[#389ac8] bg-[#dceffa] text-[#195b80]" : "border-[#d4e5ef] bg-white"}`}
                >
                  {traitName(species, "texture")}
                </button>
              </div>
              <div className="mx-auto w-full max-w-xl">
                <PunnettSquare
                  key={species + trait + first + second}
                  first={p1}
                  second={p2}
                  trait={trait}
                  baby={baby}
                  species={species}
                />
              </div>
              <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-[#5c7c90]">
                <strong>
                  {trait === "coat"
                    ? `B = ${coatLabel({ coat: "BB", texture: "SS" }, species)}, b = ${coatLabel({ coat: "bb", texture: "ss" }, species)}`
                    : `S = ${textureLabel({ coat: "BB", texture: "SS" }, species)}, s = ${textureLabel({ coat: "bb", texture: "ss" }, species)}`}
                  .
                </strong>{" "}
                En stor bokstav är dominant i den här förenklade modellen.
              </p>
            </div>
          </section>
          <section
            data-landscape-active={landscapeStage === "parents"}
            className="genlabbet-station genlabbet-station-parents order-1 relative mt-10 rounded-b-xl rounded-tl-none rounded-tr-xl border border-[#c9dfec] bg-white p-3 shadow-[0_12px_30px_rgba(34,92,125,.055)] sm:mt-11 sm:p-6"
          >
            {/* Research folder tabs: attached to the upper edge of this animal file. */}
            <div
              role="group"
              aria-label="Välj djurart"
              className="absolute bottom-[calc(100%-1px)] left-0 right-3 flex items-end gap-1 sm:right-auto sm:gap-1.5"
            >
              {SPECIES.map((s) => {
                const active = species === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => changeSpecies(s.id)}
                    className={`relative flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-t-lg border px-2 py-2 text-xs font-extrabold transition-[background-color,box-shadow] sm:min-w-32 sm:flex-none sm:gap-2 sm:px-5 sm:text-sm ${
                      active
                        ? "z-10 border-[#c9dfec] border-b-white bg-white text-[#175b7f] shadow-[0_-4px_12px_rgba(34,92,125,.08)] after:absolute after:-bottom-[2px] after:left-0 after:right-0 after:h-[3px] after:bg-white"
                        : "border-[#c9dfec] bg-[#dceef8] text-[#527f99] shadow-[0_-3px_8px_rgba(34,92,125,.08)] hover:bg-[#eaf6fc] hover:shadow-[0_-4px_12px_rgba(34,92,125,.12)]"
                    }`}
                  >
                    <span aria-hidden="true">{s.emoji}</span>
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="genlabbet-section-heading mb-5 flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f4fb]">
                <Heart size={19} className="text-[#d88b91]" />
              </span>
              <div>
                <h2 className="font-sans text-lg font-bold sm:text-xl">
                  01 · Välj föräldrar
                </h2>
                <p className="mt-0.5 text-xs text-[#64849a]">
                  Välj två djur som ska få en unge.
                </p>
              </div>
            </div>
            <div className="genlabbet-parent-grid grid grid-cols-2 gap-2 sm:gap-4 mx-auto w-full max-w-3xl">
              {[
                {
                  parent: p1,
                  selected: first,
                  change: (id: string) => {
                    setFirst(id);
                    reset();
                  },
                  label: "Förälder 1",
                },
                {
                  parent: p2,
                  selected: second,
                  change: (id: string) => {
                    setSecond(id);
                    reset();
                  },
                  label: "Förälder 2",
                },
              ].map(({ parent, selected, change, label }) => (
                <div
                  key={label}
                  className="genlabbet-parent-card flex min-w-0 flex-col rounded-lg bg-[#edf6fa] p-2 sm:p-3"
                >
                  <p className="text-center text-[11px] font-extrabold uppercase tracking-widest text-[#7294a7]">
                    {label}
                  </p>
                  <div className="genlabbet-parent-picture mx-auto aspect-[6/5] w-full max-w-[190px]">
                    <AnimalPicture species={species} genes={parent.genes} />
                  </div>
                  <p className="genlabbet-parent-name text-center font-sans text-xl font-bold">
                    {parent.name}
                  </p>
                  <p className="genlabbet-parent-description mb-3 min-h-8 text-center text-[11px] leading-4 text-[#5d7789] sm:text-xs">
                    {traitDescription(species, parent.genes)}
                  </p>
                  <label className="mt-auto block">
                    <span className="sr-only">Välj {label.toLowerCase()}</span>
                    <select
                      value={selected}
                      onChange={(e) => change(e.target.value)}
                      className="genlabbet-parent-select w-full rounded-xl border border-[#cfded0] bg-white px-2 py-2.5 text-sm font-semibold outline-offset-2 focus-visible:outline-teal-500"
                    >
                      {animals.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          </section>
          <section
            data-landscape-active={landscapeStage === "hypothesis"}
            className="genlabbet-station genlabbet-station-hypothesis order-2 rounded-xl border border-[#d8e5ed] bg-white/95 p-3 shadow-[0_12px_30px_rgba(34,92,125,.055)] sm:p-6"
          >
            {!baby ? (
              <>
                <div className="genlabbet-section-heading mb-5 flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f4fb]">
                    <Sparkles size={19} className="text-[#397fa5]" />
                  </span>
                  <div>
                    <h2 className="font-sans text-lg font-bold sm:text-xl">
                      02 · Gör en hypotes
                    </h2>
                    <p className="mt-0.5 text-xs text-[#64849a]">
                      Hur tror du att ungen kommer se ut? Det är okej att gissa
                      fel!
                    </p>
                  </div>
                </div>
                <fieldset className="genlabbet-hypothesis-fieldset mb-5 mx-auto max-w-xl">
                  <legend className="mb-2 text-sm font-bold">
                    {traitName(species, "coat")}
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      coatLabel({ coat: "BB", texture: "SS" }, species),
                      coatLabel({ coat: "bb", texture: "ss" }, species),
                    ].map((v, i) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={guessCoat === v}
                        onClick={() => setGuessCoat(v)}
                        className={`${choice} ${guessCoat === v ? "border-[#308dbb] bg-[#dff2fc]" : "border-[#dbe7ee] bg-[#f9fcff] hover:border-[#8dbbd4]"}`}
                      >
                        <span
                          className={`mr-2 inline-block h-3 w-3 rounded-full ${species === "rabbit" ? (i === 0 ? "bg-[#70452f]" : "bg-[#6d9ac4]") : i === 0 ? "bg-[#9b674b]" : "bg-[#e9d5b8]"}`}
                        />
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="genlabbet-hypothesis-fieldset mb-6 mx-auto max-w-xl">
                  <legend className="mb-2 text-sm font-bold">
                    {traitName(species, "texture")}
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      textureLabel({ coat: "BB", texture: "SS" }, species),
                      textureLabel({ coat: "bb", texture: "ss" }, species),
                    ].map((v, i) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={guessTexture === v}
                        onClick={() => setGuessTexture(v)}
                        className={`${choice} ${guessTexture === v ? "border-[#308dbb] bg-[#dff2fc]" : "border-[#dbe7ee] bg-[#f9fcff] hover:border-[#8dbbd4]"}`}
                      >
                        {i === 0 ? "〰 " : "━ "}
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <button
                  onClick={reveal}
                  disabled={!guessCoat || !guessTexture}
                  className="genlabbet-hypothesis-action mx-auto flex w-full max-w-xl items-center justify-center gap-2 rounded-lg bg-[#45b7e9] px-4 py-4 font-extrabold text-[#103c58] shadow-md transition hover:bg-[#70d2fa] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Testa hypotesen! <ArrowRight size={19} />
                </button>
                <p className="mt-3 text-center text-xs text-[#718b9b]">
                  Gissa båda egenskaperna för att fortsätta.
                </p>
              </>
            ) : (
              <div key={round} aria-live="polite">
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f4fb]">
                    <Sparkles size={19} className="text-[#397fa5]" />
                  </span>
                  <div>
                    <h2 className="font-sans text-lg font-bold sm:text-xl">
                      02 · Forskningsresultat: Här är ungen!
                    </h2>
                    <p className="mt-0.5 text-xs text-[#64849a]">
                      Jämför resultatet med din hypotes.
                    </p>
                  </div>
                </div>
                <div className="mx-auto aspect-[6/4] max-w-[290px]">
                  <AnimalPicture
                    species={species}
                    genes={baby.genes}
                    baby
                    animate
                  />
                </div>
                <p className="text-center font-sans text-2xl font-bold">
                  Vilken sötnos! {SPECIES.find((s) => s.id === species)!.emoji}
                </p>
                <p className="mt-1 text-center text-sm">
                  Ungen har{" "}
                  <strong>{traitPhrase(species, "coat", baby.genes)}</strong>{" "}
                  och{" "}
                  <strong>{traitPhrase(species, "texture", baby.genes)}</strong>
                  .
                </p>
                <div className="mt-4 rounded-xl bg-[#e6f5fc] p-3 text-center text-sm">
                  <strong>Din gissning:</strong>{" "}
                  {guessCoat === coatLabel(baby.genes, species) &&
                  guessTexture === textureLabel(baby.genes, species)
                    ? "Båda rätt! 🎉"
                    : [
                          guessCoat === coatLabel(baby.genes, species),
                          guessTexture === textureLabel(baby.genes, species),
                        ].filter(Boolean).length === 1
                      ? "En av två rätt! 🌟"
                      : "Inte denna gång – prova igen! 💚"}
                </div>
                <button
                  onClick={() => setShowWhy((v) => !v)}
                  aria-expanded={showWhy}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#cbdfea] bg-white px-3 py-3 text-sm font-bold hover:bg-[#eff8fc]"
                >
                  <Dna size={18} /> Varför blev det så?
                </button>
                {showWhy && (
                  <div className="mt-3 rounded-xl bg-[#f1f8fc] p-4 text-sm leading-relaxed">
                    <p>
                      <strong>{traitName(species, "coat")}:</strong> {p1.name}{" "}
                      gav <strong>{baby.inherited.coat[0]}</strong> och{" "}
                      {p2.name} gav <strong>{baby.inherited.coat[1]}</strong>.
                      Ungens genpar blev <strong>{baby.genes.coat}</strong>.
                    </p>
                    <p className="mt-2">
                      <strong>{traitName(species, "texture")}:</strong>{" "}
                      {p1.name} gav <strong>{baby.inherited.texture[0]}</strong>{" "}
                      och {p2.name} gav{" "}
                      <strong>{baby.inherited.texture[1]}</strong>. Ungens
                      genpar blev <strong>{baby.genes.texture}</strong>.
                    </p>
                    <p className="mt-3 text-xs text-[#607d8f]">
                      I vår förenklade modell dominerar B över b och S över s.
                      Egenskaperna är olika för varje djurart. En unge ärver en
                      allel från varje förälder för varje gen.
                    </p>
                  </div>
                )}
                <button
                  onClick={reset}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#45b7e9] px-4 py-3.5 font-extrabold text-[#103c58] hover:bg-[#70d2fa]"
                >
                  <RotateCcw size={18} /> Försök igen!
                </button>
              </div>
            )}
          </section>
        </div>
        <div className="genlabbet-science-note mt-6 rounded-xl border border-[#d7e6ee] bg-white/70 p-4 text-xs leading-relaxed text-[#607f90]">
          <strong>Vetenskaplig notering:</strong> Det här är en förenklad modell
          med två oberoende gener och fullständig dominans, skapad för att visa
          grundprincipen för nedärvning. Verklig nedärvning av pälsfärg,
          pälsstruktur, ögonfärg, öronform och svanslängd kan styras av flera
          gener och mer komplexa samband. Varje unge får ett nytt slumpmässigt
          genetiskt utfall. Bokstäverna och dominansen är förenklade
          undervisningsexempel för alla tre djurarter.
        </div>
      </main>
    </div>
  );
}
