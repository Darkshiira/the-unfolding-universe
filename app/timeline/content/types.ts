export type ArticleImage = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  kind: "illustration" | "diagram" | "photo";
};

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  image?: ArticleImage;
};

export type MilestoneArticleData = {
  id: string;
  kicker: string;
  lead: string;
  hero: ArticleImage;
  sections: ArticleSection[];
  facts: string[];
  evidence: string[];
  uncertainties: string[];
  relatedIds: string[];
  sources: { label: string; url: string }[];
  showcase?: {
    src: string;
    title: string;
    description: string;
    alt: string;
  };
  atmosphere?: {
    mode: "embers" | "frost" | "underwater" | "steam";
    intensity?: "subtle" | "normal" | "dramatic";
  };
};
