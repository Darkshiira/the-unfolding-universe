"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

import { rememberTimelineView } from "@/components/TimelineBackLink";

type Props = {
  children: React.ReactNode;
};

export default function TimelineTransition({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayContainerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const navigatingRef = useRef(false);

  // Clean up any remaining transition elements.
  function cleanupTransition() {
    animationRef.current?.kill();
    animationRef.current = null;

    overlayContainerRef.current?.remove();
    overlayContainerRef.current = null;

    navigatingRef.current = false;
  }

  // When the route changes, remove the old overlay
  // and unlock the button for the next visit.
  useEffect(() => {
    if (overlayContainerRef.current) {
      animationRef.current?.kill();
      animationRef.current = null;

      overlayContainerRef.current.remove();
      overlayContainerRef.current = null;
    }

    navigatingRef.current = false;
  }, [pathname]);

  // Also clean up when the component unmounts.
  useEffect(() => {
    return () => {
      animationRef.current?.kill();
      animationRef.current = null;

      overlayContainerRef.current?.remove();
      overlayContainerRef.current = null;

      navigatingRef.current = false;
    };
  }, []);

  function startTransition() {
    if (navigatingRef.current) return;

    navigatingRef.current = true;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const view = isMobile ? "mobile" : "classic";

    rememberTimelineView(view);

    const destination = isMobile ? "/timeline/mobile" : "/timeline";

    // Remove any previous overlay before starting.
    cleanupTransition();

    // Lock navigation again for this animation.
    navigatingRef.current = true;

    // Create the overlay directly on click,
    // avoiding React state and rendering delays.
    const container = document.createElement("div");

    container.className =
      "pointer-events-auto fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050508]/80";

    const glow = document.createElement("div");

    glow.className =
      "absolute h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle,#fffdf2_0%,#ffe6a5_12%,#f3ac54_32%,rgba(239,148,56,0.25)_55%,transparent_72%)]";

    const flash = document.createElement("div");

    flash.className = "absolute inset-0 bg-[#F8F5EE] opacity-0";

    container.append(glow, flash);
    document.body.appendChild(container);

    overlayContainerRef.current = container;

    // Play the golden transition before navigating.
    const timeline = gsap.timeline({
      onComplete: () => {
        router.push(destination);
      },
    });

    animationRef.current = timeline;

    timeline
      .set(container, {
        opacity: 1,
        pointerEvents: "auto",
      })
      .fromTo(
        glow,
        {
          scale: 0.02,
          opacity: 0,
        },
        {
          scale: 4,
          opacity: 1,
          duration: 0.95,
          ease: "power3.in",
        },
      )
      .fromTo(
        flash,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        "-=0.25",
      );
  }

  return (
    <button
      type="button"
      onClick={startTransition}
      className="group inline-flex items-center gap-4 rounded-full border border-amber-200/30 bg-gradient-to-r from-[#e4c18b] to-[#c99c60] px-8 py-4 text-sm font-semibold tracking-wide text-[#20160c] shadow-[0_0_35px_rgba(226,170,91,0.17)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_55px_rgba(226,170,91,0.35)]"
    >
      {children}
    </button>
  );
}
