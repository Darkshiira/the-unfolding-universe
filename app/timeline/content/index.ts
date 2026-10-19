import { earthArticles } from "./earth";
import { earlyUniverseArticles } from "./early-universe";
import { earlyEarthArticles } from "./early-earth";
import { ancientEarthArticles } from "./ancient-earth";
import { frozenEarthArticles } from "./frozen-earth";
import { earthAwakensArticles } from "./earth-awakens";
import { worldInMotionArticles } from "./a-world-in-motion";
import { remainingEarthArticles } from "./remaining-earth-articles";
import type { MilestoneArticleData } from "./types";

export const articles: Record<string, MilestoneArticleData> = {
  ...earthArticles,
  ...earlyUniverseArticles,
  ...earlyEarthArticles,
  ...ancientEarthArticles,
  ...frozenEarthArticles,
  ...earthAwakensArticles,
  ...worldInMotionArticles,
  ...remainingEarthArticles,
};

export function getArticle(id: string): MilestoneArticleData | undefined {
  return articles[id];
}
