import type { Milestone } from "./timeline-data";
import { milestoneVisualX } from "./timeline-layout";

/**
 * Decide which milestones can fit on the timeline.
 *
 * Major milestones are preferred.
 * Minor milestones appear when zoomed in.
 * All overlap checks use actual screen-space distances.
 */
export function getVisibleMilestoneIds(
  milestones: Milestone[],
  zoom: number,
  spread = 1,
): Set<string> {
  const safeSpread = Math.max(0.1, spread);

  const CARD_WIDTH = 190;
  const CARD_GAP = 0;

  const minimumDistance = CARD_WIDTH + CARD_GAP;
  const showMinor = zoom >= 0.8;

  const protectedIds = new Set([
    "earth",
    "earth-today",
    "life-today",
    "plants-today",
    "animals-today",
    "humans-today",
  ]);

  const visible = new Set<string>();
  const selected: Milestone[] = [];

  // Higher-priority milestones are considered first.
  const candidates = milestones
    .filter(
      (milestone) =>
        milestone.major || showMinor || protectedIds.has(milestone.id),
    )
    .sort((a, b) => {
      const priorityA = protectedIds.has(a.id) ? 2 : a.major ? 1 : 0;

      const priorityB = protectedIds.has(b.id) ? 2 : b.major ? 1 : 0;

      return priorityB - priorityA || a.x - b.x;
    });

  for (const milestone of candidates) {
    // Protected milestones must remain visible.
    if (protectedIds.has(milestone.id)) {
      selected.push(milestone);
      visible.add(milestone.id);
      continue;
    }

    const overlaps = selected.some((other) => {
      if (other.category !== milestone.category) {
        return false;
      }

      // Convert timeline coordinates into screen pixels.
      const screenDistance =
        Math.abs(milestoneVisualX(other) - milestoneVisualX(milestone)) *
        safeSpread;

      return screenDistance < minimumDistance;
    });

    if (!overlaps) {
      selected.push(milestone);
      visible.add(milestone.id);
    }
  }

  return visible;
}
