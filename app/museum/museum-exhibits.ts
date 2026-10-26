
export type ExhibitStatus = "available" | "development" | "planned";

export type ExhibitCategory =
  | "universe"
  | "earth"
  | "life";

export type MuseumExhibit = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: ExhibitCategory;
  status: ExhibitStatus;
  href?: string;
  articleHref?: string;
};

export const exhibitCategories: {
  id: ExhibitCategory;
  title: string;
  description: string;
}[] = [
  {
    id: "universe",
    title: "Universum och materia",
    description: "Från planeter till atomer",
  },
  {
    id: "earth",
    title: "Jorden och naturen",
    description: "Vår föränderliga planet",
  },
  {
    id: "life",
    title: "Livets utveckling",
    description: "Från celler till ekosystem",
  },
];

export const museumExhibits: MuseumExhibit[] = [
  {
    id: "solar-system",
    title: "Utforska solsystemet",
    description:
      "Besök planeterna och jämför deras storlek och avstånd.",
    emoji: "🪐",
    category: "universe",
    status: "planned",
  },
  {
    id: "atoms-molecules",
    title: "Atomernas och molekylernas värld",
    description:
      "Utforska materiens byggstenar och bygg egna molekyler.",
    emoji: "⚛️",
    category: "universe",
    status: "planned",
  },
  {
    id: "light",
    title: "Ljusets värld",
    description:
      "Experimentera med färger, ljus och hur vi ser.",
    emoji: "🌈",
    category: "universe",
    status: "planned",
  },
  {
    id: "supercontinents",
    title: "Superkontinenternas värld",
    description:
      "Res genom tiden på en roterande jordglob.",
    emoji: "🌎",
    category: "earth",
    status: "planned",
  },
  {
    id: "water-cycle",
    title: "Vattnets kretslopp",
    description:
      "Följ en vattendroppe genom naturens kretslopp.",
    emoji: "💧",
    category: "earth",
    status: "development",
    articleHref: "/timeline/earth-today",
    href: "/museum/water-cycle",
  },
  {
    id: "plant-key",
    title: "Upptäck Sveriges växter",
    description:
      "Identifiera svenska växter med en interaktiv växtnyckel.",
    emoji: "🌿",
    category: "earth",
    status: "planned",
  },
  {
    id: "cells",
    title: "Cellernas värld",
    description:
      "Utforska livets minsta byggstenar och deras funktioner.",
    emoji: "🔬",
    category: "life",
    status: "planned",
  },
  {
    id: "food-web",
    title: "Naturens näringsvävar",
    description:
      "Upptäck hur växter och djur är beroende av varandra.",
    emoji: "🦊",
    category: "life",
    status: "planned",
  },
];

export function getMuseumExhibit(id: string) {
  return museumExhibits.find((exhibit) => exhibit.id === id);
}
