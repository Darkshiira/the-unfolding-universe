export const DETECTIVE_STORAGE_KEY = "unfolding-universe-celldetektiverna-v1";
export const DETECTIVE_PROGRESS_EVENT = "celldetektiverna-progress-updated";
export type CellId = "animal" | "plant" | "bacteria" | "archaea";
export type Mode = "guided" | "free";
export type Answer = Record<string, CellId[]>;
export const specimens: {
  id: CellId;
  name: string;
  latin: string;
  number: string;
  color: string;
  emoji: string;
}[] = [
  {
    id: "animal",
    name: "Djurcell",
    latin: "Eukaryot cell",
    number: "001",
    color: "#a9a2ef",
    emoji: "🔮",
  },
  {
    id: "plant",
    name: "Växtcell",
    latin: "Eukaryot cell",
    number: "002",
    color: "#80d8a4",
    emoji: "🌿",
  },
  {
    id: "bacteria",
    name: "Bakteriecell",
    latin: "Escherichia coli",
    number: "003",
    color: "#80d6d4",
    emoji: "🦠",
  },
  {
    id: "archaea",
    name: "Arkécell",
    latin: "Sulfolobus acidocaldarius",
    number: "004",
    color: "#c9a9df",
    emoji: "🧬",
  },
];
export const cases: {
  id: string;
  title: string;
  question: string;
  hint: string;
  answer: CellId[];
  explanation: string;
  evidence: string;
}[] = [
  {
    id: "nucleus",
    title: "Mysteriet med cellkärnan",
    question: "Vilka av våra fyra preparat har en cellkärna?",
    hint: "Leta efter en membranomsluten cellkärna. DNA finns även i celler utan cellkärna.",
    answer: ["animal", "plant"],
    evidence: "Cellkärna",
    explanation:
      "Djurceller och växtceller är eukaryoter och har en membranomsluten cellkärna. Bakterier och arkéer saknar cellkärna; deras DNA finns i cellens inre.",
  },
  {
    id: "wall",
    title: "Det skyddande skalet",
    question: "Vilka av dessa preparat har en cellvägg?",
    hint: "Skilj cellvägg från cellmembran och från arkéernas S-lager.",
    answer: ["plant", "bacteria"],
    evidence: "Cellvägg",
    explanation:
      "Växtcellen har en cellvägg av framför allt cellulosa. E. coli har en cellvägg med peptidoglykan. Djurcellen saknar cellvägg. Vår Sulfolobus-modell har ett skyddande S-lager av proteiner, men inte en peptidoglykanvägg. Begreppet cellvägg kan användas bredare om vissa arkéers ytterlager, så här jämför vi just våra preparat.",
  },
  {
    id: "chloroplast",
    title: "Den gröna energifabriken",
    question: "Vilket preparat har kloroplaster?",
    hint: "Leta efter gröna organeller där fotosyntes sker.",
    answer: ["plant"],
    evidence: "Kloroplast",
    explanation:
      "Vår växtcell har kloroplaster. Djurcellen saknar dem, och våra bakterie- och arképreparat saknar också kloroplaster. Vissa bakterier kan ändå utföra fotosyntes utan kloroplaster.",
  },
  {
    id: "ribosome",
    title: "Cellernas gemensamma verkstad",
    question: "Vilka av preparaten har ribosomer?",
    hint: "Ribosomer bygger proteiner och finns även i celler utan cellkärna.",
    answer: ["animal", "plant", "bacteria", "archaea"],
    evidence: "Ribosomer",
    explanation:
      "Alla fyra celltyperna har ribosomer. Det är ett av livets gemensamma kännetecken. Ribosomernas uppbyggnad skiljer sig mellan olika grupper.",
  },
  {
    id: "mitochondria",
    title: "Energins hemliga rum",
    question: "Vilka preparat har mitokondrier?",
    hint: "Mitokondrier är membranomslutna organeller i eukaryota celler.",
    answer: ["animal", "plant"],
    evidence: "Mitokondrier",
    explanation:
      "Både djurceller och växtceller har mitokondrier. Växter har alltså både kloroplaster och mitokondrier. Bakterier och arkéer saknar mitokondrier.",
  },
  {
    id: "dna",
    title: "Livets instruktioner",
    question: "Vilka av preparaten innehåller DNA?",
    hint: "Att sakna cellkärna betyder inte att sakna arvsmassa.",
    answer: ["animal", "plant", "bacteria", "archaea"],
    evidence: "DNA",
    explanation:
      "Alla fyra har DNA. Hos djur- och växtceller finns det mesta av DNA:t i cellkärnan. Hos bakterier och arkéer finns DNA utan en membranomsluten cellkärna.",
  },
];
