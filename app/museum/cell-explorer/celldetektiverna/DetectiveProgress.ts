import {
  DETECTIVE_PROGRESS_EVENT,
  DETECTIVE_STORAGE_KEY,
  type Answer,
} from "./DetectiveCases";

export type DetectiveProgress = { answers: Answer; revealed: string[] };
export function readDetectiveProgress(): DetectiveProgress {
  if (typeof window === "undefined") return { answers: {}, revealed: [] };
  try {
    const value = JSON.parse(
      window.localStorage.getItem(DETECTIVE_STORAGE_KEY) || "null",
    );
    return {
      answers:
        value?.answers && typeof value.answers === "object"
          ? value.answers
          : {},
      revealed: Array.isArray(value?.revealed) ? value.revealed : [],
    };
  } catch {
    return { answers: {}, revealed: [] };
  }
}
export function updateDetectiveProgress(progress: DetectiveProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DETECTIVE_STORAGE_KEY,
      JSON.stringify(progress),
    );
    window.dispatchEvent(new Event(DETECTIVE_PROGRESS_EVENT));
  } catch {
    /* Browser storage unavailable */
  }
}
