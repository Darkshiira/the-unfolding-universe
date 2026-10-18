import { earthArticles } from "./earth";
import { earlyUniverseArticles } from "./early-universe";
import type { MilestoneArticleData } from "./types";

export const articles: Record<string, MilestoneArticleData> = {
  ...earthArticles,
  ...earlyUniverseArticles,
};

export function getArticle(id: string): MilestoneArticleData | undefined {
  return articles[id];
}
