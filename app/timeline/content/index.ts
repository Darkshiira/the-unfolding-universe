import { earthArticles } from "./earth";
import { earlyUniverseArticles } from "./early-universe";
import { earlyEarthArticles } from "./early-earth";
import type { MilestoneArticleData } from "./types";

export const articles: Record<string, MilestoneArticleData> = {
  ...earthArticles,
  ...earlyUniverseArticles,
  ...earlyEarthArticles,
};

export function getArticle(id: string): MilestoneArticleData | undefined {
  return articles[id];
}
