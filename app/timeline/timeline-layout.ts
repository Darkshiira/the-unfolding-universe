
import type { Milestone } from "./timeline-data";

// These offsets affect only the visual layout.
// The geological dates and chronological coordinates stay unchanged.
const VISUAL_OFFSETS: Record<string, number> = {
  "oldest-zircons": -110,
};

export function milestoneVisualX(milestone: Milestone): number {
  return milestone.x + (VISUAL_OFFSETS[milestone.id] ?? 0);
}
