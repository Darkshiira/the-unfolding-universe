import type { Milestone } from "./timeline-data";

/**
 * Nodes keep their physical size. Only the distance between nodes changes.
 * A milestone needs approximately 220px of horizontal room for its label.
 */
export function getVisibleMilestoneIds(
  milestones: Milestone[],
  zoom: number,
  spread = 1,
): Set<string> {
  const minimumDistance = 225 / Math.max(0.1, spread);
  const showMinor = zoom >= 0.8;
  const priorityIds = new Set([
    "earth",
    "earth-today",
    "life-today",
    "plants-today",
    "animals-today",
    "humans-today",
  ]);
  const candidates = milestones
    .filter((m) => m.major || showMinor || priorityIds.has(m.id))
    .sort((a, b) => {
      const pa = priorityIds.has(a.id) ? 2 : a.major ? 1 : 0;
      const pb = priorityIds.has(b.id) ? 2 : b.major ? 1 : 0;
      return pb - pa || a.x - b.x;
    });
  const visible: Milestone[] = [];
  for (const event of candidates) {
    const overlaps = visible.some(
      (other) =>
        other.category === event.category &&
        Math.abs(other.x - event.x) < minimumDistance,
    );
    if (!overlaps) visible.push(event);
  }
  return new Set(visible.map((m) => m.id));
}
