import type { Milestone } from "./timeline-data";
import { ageToX } from "./timeline-chronology";

export const GEOLOGICAL_ERAS = [
  { name: "Hadeikum", olderMa: 4600, youngerMa: 4000, color: "#EAD7C7" },
  { name: "Arkeikum", olderMa: 4000, youngerMa: 2500, color: "#E8E0C8" },
  { name: "Proterozoikum", olderMa: 2500, youngerMa: 538.8, color: "#DBE9E7" },
  { name: "Paleozoikum", olderMa: 538.8, youngerMa: 251.902, color: "#E3EBD9" },
  { name: "Mesozoikum", olderMa: 251.902, youngerMa: 66, color: "#F0DFD8" },
  { name: "Kenozoikum", olderMa: 66, youngerMa: 0, color: "#E9E5F0" },
] as const;

export function getMilestoneEra(milestone: Milestone): string {
  const age = milestone.ageMa;
  if (age === undefined) return "Datering saknas";
  const era = GEOLOGICAL_ERAS.find(
    (item) => age <= item.olderMa && age > item.youngerMa,
  );
  return era
    ? era.name
    : age === 0
      ? "Nutid (Kenozoikum)"
      : "Utanför jordens geologiska tidsindelning";
}

export function geologicalBoundaries() {
  return GEOLOGICAL_ERAS.map((era) => ({
    ...era,
    startX: ageToX(era.olderMa),
    endX: ageToX(era.youngerMa),
  }));
}
