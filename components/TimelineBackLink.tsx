"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";

const STORAGE_KEY = "unfolding-universe-timeline-view";

type TimelineView = "mobile" | "classic";

export function rememberTimelineView(view: TimelineView) {
  try {
    sessionStorage.setItem(STORAGE_KEY, view);
  } catch {
    // Storage may be unavailable.
  }
}

export function preferredTimelineHref(): string {
  if (typeof window === "undefined") {
    return "/timeline";
  }

  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (saved === "mobile") return "/timeline/mobile";
    if (saved === "classic") return "/timeline";
  } catch {
    // Fall back to screen size.
  }

  return window.matchMedia("(max-width: 767px)").matches
    ? "/timeline/mobile"
    : "/timeline";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(max-width: 767px)");

  media.addEventListener("change", callback);
  window.addEventListener("pageshow", callback);

  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("pageshow", callback);
  };
}

function getSnapshot() {
  return preferredTimelineHref();
}

function getServerSnapshot() {
  return "/timeline";
}

export default function TimelineBackLink({
  className = "",
  compact = false,
  onClick,
}: {
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  const href = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Link href={href} className={className} onClick={onClick}>
      <ArrowLeft size={17} className="shrink-0" />

      {compact ? (
        <>
          <span className="hidden sm:inline">Tillbaka till tidslinjen</span>
          <span className="sm:hidden">Tidslinjen</span>
        </>
      ) : (
        <span>Tillbaka till tidslinjen</span>
      )}
    </Link>
  );
}
