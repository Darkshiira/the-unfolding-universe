import { ageToX } from "./timeline-chronology";

// Swedish/Nordic periodization (approximate and region-dependent).
// Ma = million years before the present, with 2026 as a reference year.
// These are NOT worldwide historical eras.
export const SWEDISH_HISTORY_PERIODS = [
  { name: "Senaste istiden", olderMa: 0.115, youngerMa: 0.0117, color: "#DBE8EE" },
  { name: "Stenåldern", olderMa: 0.0117, youngerMa: 0.003726, color: "#E9E1CE" },
  { name: "Bronsåldern", olderMa: 0.003726, youngerMa: 0.002526, color: "#EAD9BC" },
  { name: "Järnåldern", olderMa: 0.002526, youngerMa: 0.001226, color: "#E0E2D3" },
  { name: "Vikingatiden", olderMa: 0.001226, youngerMa: 0.000976, color: "#D7E4DE" },
  { name: "Medeltiden", olderMa: 0.000976, youngerMa: 0.000506, color: "#E4DDEA" },
  { name: "Tidigmodern tid", olderMa: 0.000506, youngerMa: 0.000226, color: "#F0DED7" },
  { name: "1800-talet", olderMa: 0.000226, youngerMa: 0.000126, color: "#E5E9D6" },
  { name: "1900-talet", olderMa: 0.000126, youngerMa: 0.000026, color: "#DDE7EF" },
  { name: "2000-talet", olderMa: 0.000026, youngerMa: 0, color: "#E9E5F0" },
] as const;

export function swedishHistoryBoundaries() {
  return SWEDISH_HISTORY_PERIODS.map((period) => ({
    ...period,
    startX: ageToX(period.olderMa),
    endX: ageToX(period.youngerMa),
  }));
}
