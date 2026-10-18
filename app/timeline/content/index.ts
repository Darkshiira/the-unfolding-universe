import { earthArticles } from "./earth";
import type { MilestoneArticleData } from "./types";

export const articles: Record<string, MilestoneArticleData> = {
  ...earthArticles,
};

export function getArticle(id: string): MilestoneArticleData | undefined {
  return articles[id];
}
