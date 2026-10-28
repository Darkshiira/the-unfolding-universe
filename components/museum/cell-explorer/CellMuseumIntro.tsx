"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, SkipForward } from "lucide-react";

type Props = { onEnter: () => void };

// One shared silhouette drives the skin, volume shading, contour and cell clip.
const HAND_PATH =
  // Anatomical left palm, drawn as ONE continuous silhouette.
  // Rounded thumb web, four separated fingers, full palm heel and soft wrist.
  "M 376 1280 " +
  // Left wrist broadens gradually into the heel of the palm.
  "C 376 1120 376 949 375 858 " +
  "C 374 817 348 783 312 752 " +
  "C 277 719 231 687 193 659 " +
  // Thumb: fuller lower attachment, rounded tip and natural diagonal.
  "C 157 635 119 608 89 584 " +
  "C 61 561 54 536 70 517 " +
  "C 86 496 112 494 138 504 " +
  "C 170 516 210 546 251 573 " +
  "C 280 593 303 612 326 614 " +
  // Deep rounded thumb-index web, curving UP the index side.
  "C 356 615 372 593 373 558 " +
  "C 375 511 371 456 369 411 " +
  // Index outer side: straight, fuller and as wide as the middle.
  "C 367 345 363 235 362 160 " +
  "C 359 124 375 104 402 103 " +
  "C 432 101 448 125 446 160 " +
  "C 446 235 449 338 450 410 " +
  // Rounded web between index and middle, without overlap.
  "C 450 427 458 442 464 447 " +
  "C 471 437 474 424 474 407 " +
  // Middle finger: tallest and straight.
  "C 478 275 474 171 474 91 " +
  "C 474 55 490 38 514 38 " +
  "C 543 39 557 61 556 91 " +
  "C 553 188 558 299 556 407 " +
  // Middle-ring web.
  "C 556 424 563 437 569 442 " +
  "C 576 432 579 418 580 402 " +
  // Ring finger: narrower and shorter.
  "C 587 335 584 243 586 179 " +
  "C 588 145 602 128 624 129 " +
  "C 650 130 663 150 659 180 " +
  "C 656 259 647 348 645 414 " +
  // Lower ring-pinky web, per annotated silhouette.
  "C 642 455 650 477 658 488 " +
  "C 668 472 679 449 690 428 " +
  // Little finger begins lower and is distinctly slimmer.
  "C 697 407 704 365 713 344 " +
  "C 728 317 744 312 758 323 " +
  "C 771 334 772 350 766 374 " +
  "C 741 439 721 485 711 535 " +
  // Full outside palm: convex heel, only then taper into wrist.
  "C 712 595 712 650 703 700 " +
  "C 697 739 681 768 656 794 " +
  "C 632 819 621 828 617 853 " +
  "C 612 881 614 908 614 949 " +
  "C 614 1050 616 1170 616 1280 Z";
const clamp = (v: number) => Math.min(1, Math.max(0, v));
// Round generated SVG coordinates so server and browser render identical attributes.
const svgCoord = (value: number) => Number(value.toFixed(3));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Stable pseudo-random variation: identical on server and client.
const noise = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function OrganicCell({
  x,
  y,
  rx,
  ry,
  seed,
  selected = false,
  opacity = 1,
}: {
  x: number;
  y: number;
  rx: number;
  ry: number;
  seed: number;
  selected?: boolean;
  opacity?: number;
}) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const wobble = 0.91 + noise(seed * 13 + i * 3.7) * 0.17;
    return [Math.cos(angle) * rx * wobble, Math.sin(angle) * ry * wobble];
  });
  const path = points
    .map((p, i) => {
      const next = points[(i + 1) % points.length];
      const midX = svgCoord((p[0] + next[0]) / 2);
      const midY = svgCoord((p[1] + next[1]) / 2);
      return i === 0
        ? `M ${midX} ${midY}`
        : `Q ${svgCoord(p[0])} ${svgCoord(p[1])} ${midX} ${midY}`;
    })
    .join(" ");
  const first = points[0];
  const second = points[1];
  const start = `${svgCoord((first[0] + second[0]) / 2)} ${svgCoord((first[1] + second[1]) / 2)}`;
  const shape = `${path} Q ${svgCoord(first[0])} ${svgCoord(first[1])} ${start} Z`;
  const angle = (noise(seed + 6) - 0.5) * 36;
  const nx = (noise(seed + 11) - 0.5) * rx * 0.35;
  const ny = (noise(seed + 17) - 0.5) * ry * 0.35;
  return (
    <g
      transform={`translate(${svgCoord(x)} ${svgCoord(y)}) rotate(${svgCoord(angle)})`}
      opacity={opacity}
    >
      <path
        d={shape}
        fill={selected ? "url(#chosenCell)" : "url(#tissueCell)"}
        stroke={selected ? "#b9dce6" : "#e8b2c4"}
        strokeWidth={selected ? 2.1 : 1.1}
        strokeOpacity={selected ? 0.75 : 0.37}
      />
      <path
        d={shape}
        fill="none"
        stroke="#ffe0d6"
        strokeOpacity=".13"
        strokeWidth="2.5"
        transform="translate(-2 -2) scale(.96)"
      />
      <ellipse
        cx={svgCoord(nx)}
        cy={svgCoord(ny)}
        rx={svgCoord(rx * (0.3 + noise(seed + 29) * 0.08))}
        ry={svgCoord(ry * (0.34 + noise(seed + 31) * 0.08))}
        fill="#56406b"
        opacity=".73"
      />
      <ellipse
        cx={svgCoord(nx - rx * 0.11)}
        cy={svgCoord(ny - ry * 0.13)}
        rx={svgCoord(rx * 0.1)}
        ry={svgCoord(ry * 0.11)}
        fill="#c5a6d7"
        opacity=".42"
      />
    </g>
  );
}

export default function CellMuseumIntro({ onEnter }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Keep mobile pull-to-overscroll from revealing the page underneath the intro.
  // Restore the page's original behavior when the visitor enters the museum.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtml = html.style.overscrollBehaviorY;
    const previousBody = body.style.overscrollBehaviorY;
    html.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";
    return () => {
      html.style.overscrollBehaviorY = previousHtml;
      body.style.overscrollBehaviorY = previousBody;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = track.current;
        if (!el) return;
        const range = Math.max(1, el.offsetHeight - window.innerHeight);
        setProgress(clamp(-el.getBoundingClientRect().top / range));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const advance = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const range = Math.max(1, el.offsetHeight - window.innerHeight);
    const next =
      progress < 0.25
        ? 0.38
        : progress < 0.58
          ? 0.7
          : progress < 0.85
            ? 0.94
            : 1;
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top + range * next,
      behavior: reduced ? "instant" : "smooth",
    });
  }, [progress, reduced]);

  // Continuous zoom: let the cell-filled hand remain visible before transitioning into tissue.
  const tissueZoom = smooth(0.59, 0.9, progress);
  const skinZoom = smooth(0.04, 0.61, progress);
  // The hand keeps zooming throughout its cellular reveal; tissue enters later.
  const skinToTissue = smooth(0.49, 0.61, progress);
  const revealInterior = smooth(0.84, 0.98, progress);
  // Only fade the hand once its tiny cells have had time to fill the screen.
  const handOpacity = 1 - smooth(0.49, 0.61, progress);
  const handCellsOpacity = smooth(0.27, 0.36, progress);
  // Main palm creases are visible from the first frame.
  // Fine skin texture emerges gradually as we approach the hand.
  const skinDetailOpacity = 1 - smooth(0.38, 0.51, progress);
  const fineSkinOpacity =
    smooth(0.1, 0.32, progress) * (1 - smooth(0.38, 0.51, progress));
  const tissueOpacity = smooth(0.49, 0.61, progress);
  const surroundingCellsOpacity = 1 - smooth(0.76, 0.91, progress);
  const selectedCellOpacity = 1 - smooth(0.865, 0.94, progress);
  const selectedInteriorOpacity = smooth(0.865, 0.94, progress);
  // The blue cell shares the selected cell’s SVG coordinates and camera transform.
  // No independently scaled second cell: the membranes remain registered.
  // A soft, brief halo accompanies the chosen cell, then dissolves before entry.
  const focusHaloOpacity =
    smooth(0.62, 0.72, progress) * (1 - smooth(0.81, 0.94, progress));
  const firstText = 1 - smooth(0.15, 0.29, progress);
  const secondText =
    smooth(0.56, 0.63, progress) * (1 - smooth(0.72, 0.8, progress));
  const thirdText =
    smooth(0.77, 0.84, progress) * (1 - smooth(0.86, 0.93, progress));
  const lastText = smooth(0.93, 0.995, progress);

  return (
    <div
      ref={track}
      className="relative h-[540svh] bg-[#030b14] text-[#f5f2ea]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,#183347_0%,#081622_43%,#030a12_85%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#b7e1ef 0.7px,transparent 0.9px)",
            backgroundSize: "97px 103px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#02060dc9_100%)]" />

        {/* Hand silhouette: a deliberately stylized opening, not a medical photograph. */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-[opacity] duration-150"
          style={{
            opacity: handOpacity,
            willChange: "transform, opacity",
            transform: `scale(${1.02 + skinZoom * 2.6})`,
            // Zoom toward the center of the palm (not the finger gaps).
            transformOrigin: "56% 70%",
          }}
        >
          <svg
            viewBox="0 0 800 700"
            className="h-[88svh] w-[min(98vw,1000px)] overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#e2a59a" />
                <stop offset=".25" stopColor="#c78b85" />
                <stop offset=".58" stopColor="#9c6471" />
                <stop offset="1" stopColor="#49364d" />
              </linearGradient>
              <radialGradient id="skinVolume" cx="40%" cy="36%" r="73%">
                <stop stopColor="#f8c5af" stopOpacity=".55" />
                <stop offset=".4" stopColor="#e5a197" stopOpacity=".13" />
                <stop offset=".75" stopColor="#483348" stopOpacity=".12" />
                <stop offset="1" stopColor="#211c32" stopOpacity=".55" />
              </radialGradient>
              <filter
                id="skinSoftShadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="16" />
              </filter>
              <filter
                id="softContour"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <linearGradient id="softEdge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#302238" stopOpacity=".45" />
                <stop offset=".35" stopColor="#523445" stopOpacity=".09" />
                <stop offset=".65" stopColor="#f8c3b1" stopOpacity=".06" />
                <stop offset="1" stopColor="#33263c" stopOpacity=".40" />
              </linearGradient>
              <filter
                id="wristFoldBlur"
                x="-70%"
                y="-100%"
                width="240%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="11" />
              </filter>
              <radialGradient id="skinGlow">
                <stop stopColor="#eeb9a6" stopOpacity=".28" />
                <stop offset=".55" stopColor="#eeb9a6" stopOpacity=".12" />
                <stop offset="1" stopColor="#eeb9a6" stopOpacity="0" />
              </radialGradient>

              <clipPath id="handCellClip">
                <path d={HAND_PATH} />
              </clipPath>
              <radialGradient id="selectionGlow">
                <stop stopColor="#9ce7ff" stopOpacity=".38" />
                <stop offset=".45" stopColor="#9ce7ff" stopOpacity=".13" />
                <stop offset="1" stopColor="#9ce7ff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="tissueCell">
                <stop stopColor="#e4a2bd" />
                <stop offset=".6" stopColor="#a86891" />
                <stop offset="1" stopColor="#5d426c" />
              </radialGradient>
              <radialGradient id="chosenCell">
                <stop stopColor="#df9fbb" />
                <stop offset="1" stopColor="#67476f" />
              </radialGradient>
              <radialGradient id="handTissueCell">
                <stop stopColor="#e5a6b8" />
                <stop offset=".7" stopColor="#a86e91" />
                <stop offset="1" stopColor="#5d426d" />
              </radialGradient>
            </defs>
            <ellipse
              cx="398"
              cy="342"
              rx="245"
              ry="250"
              fill="url(#skinGlow)"
              opacity=".35"
            />
            <path
              d={HAND_PATH}
              fill="url(#skin)"
              stroke="#e4b1ad"
              strokeOpacity=".28"
              strokeWidth="3"
            />
            <path d={HAND_PATH} fill="url(#skinVolume)" />
            {/* Broad, blurred contour shading: no interior strokes that resemble bones. */}
            <g
              clipPath="url(#handCellClip)"
              filter="url(#softContour)"
              opacity=".58"
            >
              <path
                d={HAND_PATH}
                fill="none"
                stroke="#34243e"
                strokeOpacity=".6"
                strokeWidth="27"
              />
            </g>
            {/* Subtle anatomical fold at the thumb-side palm-to-wrist transition.
                Kept inside the unchanged silhouette and feathered so it never
                becomes a drawn line as the camera approaches. */}
            <g
              clipPath="url(#handCellClip)"
              opacity={1 - smooth(0.23, 0.38, progress)}
            >
              <path
                d="M 353 790 C 372 804 391 816 421 822"
                fill="none"
                stroke="#50313f"
                strokeWidth="20"
                strokeOpacity=".25"
                strokeLinecap="round"
                filter="url(#wristFoldBlur)"
              />
              <path
                d="M 361 785 C 378 796 393 802 414 807"
                fill="none"
                stroke="#f3b4a7"
                strokeWidth="7"
                strokeOpacity=".13"
                strokeLinecap="round"
                filter="url(#wristFoldBlur)"
              />
            </g>
            {/* Faint vessels beneath the skin, not exposed arteries.
                Soft branching paths keep the palm organic without resembling bones. */}
            <g
              clipPath="url(#handCellClip)"
              opacity={(1 - smooth(0.2, 0.36, progress)) * 0.52}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g
                filter="url(#wristFoldBlur)"
                stroke="#703c59"
                strokeOpacity=".35"
                strokeWidth="11"
              >
                <path d="M 442 925 C 446 839 424 770 438 694 S 483 604 479 557" />
                <path d="M 545 937 C 536 850 559 782 575 713 S 606 620 625 569" />
                <path d="M 438 710 C 408 670 402 616 399 565" />
                <path d="M 570 731 C 601 693 636 660 665 640" />
              </g>
              <g stroke="#a9657c" strokeOpacity=".18" strokeWidth="2.2">
                <path d="M 442 925 C 446 839 424 770 438 694 S 483 604 479 557" />
                <path d="M 545 937 C 536 850 559 782 575 713 S 606 620 625 569" />
                <path d="M 438 710 C 408 670 402 616 399 565" />
                <path d="M 570 731 C 601 693 636 660 665 640" />
              </g>
            </g>
            {/* Anatomical hand creases: present from the first frame.
                Paired shadow/highlight strokes give the folds depth without
                turning them into bright drawn-on lines. */}
            <g
              clipPath="url(#handCellClip)"
              opacity={1 - smooth(0.4, 0.57, progress)}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g stroke="#633b50" strokeOpacity=".34" strokeWidth="3.2">
                {/* Curved upper palm / heart line, bending down toward the little finger */}
                <path d="M 516 584 C 537 629 571 665 604 683 Q 628 699 653 692" />
                {/* Thumb-side life line wrapping around the fleshy thumb pad */}
                <path d="M 310 635 C 332 655 346 678 355 705 Q 363 733 390 758" />
                <path d="M 331 655 C 349 680 361 710 369 730" />
                {/* Lower palm and wrist creases */}
                <path d="M 398 753 C 443 739 481 743 520 757" />
                <path d="M 414 771 Q 466 758 506 773" />
                <path d="M 451 825 Q 486 834 518 825" />
                {/* Finger joint folds, paired and slightly irregular */}
                <path d="M 384 246 Q 406 252 432 246 M 387 253 Q 410 259 430 253" />
                <path d="M 383 338 Q 409 331 436 341 M 390 347 Q 412 343 432 348" />
                <path d="M 488 173 Q 516 180 542 173 M 492 182 Q 515 188 539 182" />
                <path d="M 487 297 Q 517 289 545 302 M 490 307 Q 517 301 541 310" />
                <path d="M 592 262 Q 619 268 645 262 M 594 272 Q 618 278 641 272" />
                <path d="M 589 356 Q 616 349 644 365 M 593 366 Q 619 361 639 374" />
                <path d="M 711 418 Q 727 433 739 438 M 708 426 Q 723 443 735 447" />
                <path d="M 690 487 Q 703 504 716 509 M 685 496 Q 700 512 711 518" />
                <path d="M 155 570 Q 169 586 168 603 M 164 567 Q 177 583 177 598" />
              </g>
              <g stroke="#f6bfb6" strokeOpacity=".25" strokeWidth="1.25">
                <path d="M 517 588 C 542 635 575 670 605 687 Q 631 703 653 697" />
                <path d="M 313 639 C 336 659 349 682 358 707 Q 369 739 392 762" />
                <path d="M 402 758 C 442 746 481 748 516 761" />
                <path d="M 386 250 Q 409 256 430 250 M 386 342 Q 409 337 433 345" />
                <path d="M 490 177 Q 517 184 540 177 M 490 302 Q 516 296 541 306" />
                <path d="M 594 267 Q 619 273 643 267 M 591 361 Q 615 355 642 370" />
                <path d="M 713 422 Q 727 438 738 442 M 690 492 Q 704 508 713 514" />
                <path d="M 159 573 Q 172 589 172 603" />
              </g>
            </g>
            {/* Palm folds and thumb-base creases: feathered and deliberately irregular. */}
            <g
              clipPath="url(#handCellClip)"
              opacity={1 - smooth(0.22, 0.36, progress)}
              fill="none"
              strokeLinecap="round"
            >
              <g stroke="#663e50" strokeWidth="3" strokeOpacity=".16">
                <path d="M 398 621 C 433 601 462 600 494 611 S 563 632 612 612" />
                <path d="M 396 639 C 432 625 465 633 491 646" />
                <path d="M 375 676 C 398 702 406 729 404 760" />
                <path d="M 412 789 C 455 802 487 797 517 786" />
                <path d="M 493 846 C 524 850 555 846 575 839" />
              </g>
              <g stroke="#f5bcb2" strokeWidth="1.3" strokeOpacity=".18">
                <path d="M 398 625 C 434 606 464 606 493 616 S 561 637 611 617" />
                <path d="M 379 679 C 402 705 409 730 408 758" />
                <path d="M 413 794 C 454 807 488 801 518 791" />
              </g>
            </g>
            <g clipPath="url(#handCellClip)" opacity={fineSkinOpacity * 0.78}>
              {Array.from({ length: 1500 }, (_, i) => {
                const x = noise(i * 2.17 + 9) * 800;
                const y = noise(i * 3.71 + 15) * 700;
                return (
                  <ellipse
                    key={i}
                    cx={svgCoord(x)}
                    cy={svgCoord(y)}
                    rx={svgCoord(0.3 + noise(i + 7) * 1.2)}
                    ry=".35"
                    fill={i % 3 === 0 ? "#ffe0cd" : "#56384b"}
                    opacity=".3"
                  />
                );
              })}
            </g>
            {/* Tiny skin cells fill the hand silhouette; the camera zooms into them before the tissue close-up. */}
            <g clipPath="url(#handCellClip)" opacity={handCellsOpacity}>
              <path d="M0 0 H800 V1300 H0 Z" fill="#5c3c60" opacity=".68" />
              {Array.from({ length: 100 }, (_, row) =>
                Array.from({ length: 60 }, (_, col) => {
                  // Fill the entire rectangular cell field. The shared hand
                  // clipPath trims it to the fingers, thumb, palm and wrist,
                  // avoiding empty wedges in the lower hand on mobile.
                  const seed = row * 61 + col;
                  const x =
                    7 + col * 14 + (row % 2) * 7 + (noise(seed + 4) - 0.5) * 5;
                  const y = 7 + row * 13 + (noise(seed + 9) - 0.5) * 5;
                  return (
                    <OrganicCell
                      key={seed}
                      x={x}
                      y={y}
                      rx={6.2 + noise(seed + 1) * 2.5}
                      ry={6 + noise(seed + 2) * 2.8}
                      seed={seed}
                    />
                  );
                }),
              )}
            </g>
            <ellipse
              cx="377"
              cy="358"
              rx="170"
              ry="198"
              fill="url(#skinGlow)"
              opacity=".55"
            />
            {/* At closer range, fine pale skin ridges emerge across the palm.
                Many short, softly curving strokes follow the palm rather than
                reading as large, dark knuckle creases. */}
            <g
              clipPath="url(#handCellClip)"
              opacity={
                smooth(0.075, 0.23, progress) *
                (1 - smooth(0.3, 0.39, progress))
              }
              fill="none"
              strokeLinecap="round"
            >
              {/* Organic micro-creases: curved, branching and very faint.
                  Generated from stable seeds so SSR and hydration agree. */}
              {Array.from({ length: 125 }, (_, i) => {
                const seed = i * 17.31;
                const x = 240 + noise(seed + 1) * 470;
                const y = 480 + noise(seed + 2) * 440;
                const length = 45 + noise(seed + 3) * 125;
                const sweep = (noise(seed + 4) - 0.5) * 45;
                const turn = (noise(seed + 5) - 0.5) * 42;
                const endX = x + length;
                const endY = y + sweep;
                const branchT = 0.45 + noise(seed + 6) * 0.25;
                const bx = x + length * branchT;
                const by = y + sweep * branchT + turn * 0.25;
                return (
                  <g key={`organic-palm-${i}`}>
                    <path
                      d={`M ${svgCoord(x)} ${svgCoord(y)} C ${svgCoord(x + length * 0.22)} ${svgCoord(y - 14 + turn)} ${svgCoord(x + length * 0.55)} ${svgCoord(y + 18 - turn)} ${svgCoord(endX)} ${svgCoord(endY)}`}
                      stroke={i % 4 === 0 ? "#ffe8dd" : "#f8d0c5"}
                      strokeWidth={(0.35 + noise(seed + 7) * 0.38).toFixed(3)}
                      strokeOpacity={(0.038 + noise(seed + 8) * 0.047).toFixed(
                        3,
                      )}
                    />
                    {i % 2 === 0 && (
                      <path
                        d={`M ${svgCoord(bx)} ${svgCoord(by)} Q ${svgCoord(bx + 17)} ${svgCoord(by - 12 - noise(seed + 9) * 13)} ${svgCoord(bx + 35 + noise(seed + 10) * 23)} ${svgCoord(by - 14 - noise(seed + 11) * 21)}`}
                        stroke="#ffe8dc"
                        strokeWidth=".32"
                        strokeOpacity=".045"
                      />
                    )}
                  </g>
                );
              })}
              {/* Finger ridges flow along each finger's actual direction.
                  Short, winding segments avoid the appearance of straight stripes. */}
              {[
                { x: 406, top: 130, bottom: 495, tilt: 0.012, width: 31 },
                { x: 516, top: 65, bottom: 490, tilt: -0.005, width: 30 },
                { x: 622, top: 157, bottom: 505, tilt: -0.035, width: 24 },
                { x: 742, top: 346, bottom: 555, tilt: -0.4, width: 16 },
              ].flatMap((finger, fi) =>
                Array.from({ length: 38 }, (_, j) => {
                  const seed = fi * 503 + j * 19.7;
                  const offset = (noise(seed + 1) - 0.5) * finger.width * 1.5;
                  const start =
                    finger.top +
                    30 +
                    noise(seed + 2) * (finger.bottom - finger.top - 105);
                  const length = 24 + noise(seed + 3) * 68;
                  const finish = Math.min(start + length, finger.bottom);
                  const delta = finish - start;
                  const baseX =
                    finger.x + offset + (start - finger.top) * finger.tilt;
                  const wobble = (noise(seed + 4) - 0.5) * 9;
                  const endX = baseX + delta * finger.tilt + wobble;
                  const forkY = start + delta * 0.58;
                  return (
                    <g key={`organic-finger-${fi}-${j}`}>
                      <path
                        d={`M ${svgCoord(baseX)} ${svgCoord(start)} C ${svgCoord(baseX - 5 + wobble)} ${svgCoord(start + delta * 0.26)} ${svgCoord(endX + 5 - wobble)} ${svgCoord(start + delta * 0.74)} ${svgCoord(endX)} ${svgCoord(finish)}`}
                        stroke="#ffe7dc"
                        strokeWidth={(0.32 + noise(seed + 5) * 0.33).toFixed(3)}
                        strokeOpacity={(0.04 + noise(seed + 6) * 0.05).toFixed(
                          3,
                        )}
                      />
                      {j % 3 === 0 && (
                        <path
                          d={`M ${svgCoord(baseX + delta * finger.tilt * 0.58)} ${svgCoord(forkY)} q ${svgCoord(3 + wobble * 0.3)} 9 ${svgCoord(6 + wobble * 0.5)} 20`}
                          stroke="#ffe7dc"
                          strokeWidth=".28"
                          strokeOpacity=".045"
                        />
                      )}
                    </g>
                  );
                }),
              )}
              {/* Thumb follows its diagonal axis, with subtle forks. */}
              {Array.from({ length: 42 }, (_, i) => {
                const seed = i * 13.9;
                const t = noise(seed + 1);
                const x = 115 + t * 250;
                const y = 550 + t * 150 + (noise(seed + 2) - 0.5) * 45;
                const length = 24 + noise(seed + 3) * 62;
                return (
                  <path
                    key={`organic-thumb-${i}`}
                    d={`M ${svgCoord(x)} ${svgCoord(y)} q ${svgCoord(length * 0.38)} ${svgCoord(length * 0.08 - 9)} ${svgCoord(length)} ${svgCoord(length * 0.48)}`}
                    stroke="#ffe5da"
                    strokeWidth=".45"
                    strokeOpacity=".065"
                  />
                );
              })}
              {/* Fine parallel lines curving around the thumb pad. */}
              {Array.from({ length: 22 }, (_, i) => (
                <path
                  key={`thenar-ridge-${i}`}
                  d={`M ${315 + i * 4} ${638 + i * 4} Q ${359 + i * 3} ${665 + i * 3} ${370 + i * 2} ${711 + i * 2}`}
                  stroke="#ffe0d1"
                  strokeWidth=".7"
                  strokeOpacity={(0.12 + (i % 4) * 0.035).toFixed(3)}
                />
              ))}
            </g>
            {/* Skin micro-relief grows naturally as the camera approaches the palm. */}
            <g
              clipPath="url(#handCellClip)"
              opacity={fineSkinOpacity}
              fill="none"
              stroke="#f3c6b9"
              strokeOpacity=".21"
              strokeWidth=".65"
            >
              {Array.from({ length: 700 }, (_, i) => {
                const x = noise(i * 5.37 + 7) * 800;
                const y = noise(i * 9.11 + 4) * 700;
                return (
                  <path
                    key={`ridge-${i}`}
                    d={`M ${svgCoord(x)} ${svgCoord(y)} l ${svgCoord(0.6 + noise(i + 5) * 1.6)} ${svgCoord((noise(i + 8) - 0.5) * 1.2)}`}
                  />
                );
              })}
            </g>
            {/* Palm creases, knuckle folds and fine skin ridges: visible before the cellular layer. */}
            <g
              clipPath="url(#handCellClip)"
              opacity={skinDetailOpacity}
              fill="none"
              strokeLinecap="round"
            >
              {/* Extra fine, branching palm creases gradually become visible on approach. */}
              <g
                opacity={
                  smooth(0.11, 0.3, progress) *
                  (1 - smooth(0.44, 0.59, progress))
                }
                stroke="#f7c9c0"
                strokeWidth=".75"
                strokeOpacity=".3"
              >
                <path d="M 404 603 Q 437 591 464 599 T 523 619" />
                <path d="M 421 615 Q 450 609 474 623" />
                <path d="M 462 660 Q 493 649 526 666 T 582 678" />
                <path d="M 451 674 Q 483 666 505 681" />
                <path d="M 411 703 Q 433 722 441 749" />
                <path d="M 419 710 Q 446 733 454 758" />
                <path d="M 490 743 Q 517 753 544 745" />
                <path d="M 482 759 Q 513 771 549 761" />
                <path d="M 457 803 Q 484 812 512 805" />
                <path d="M 530 822 Q 553 830 573 820" />
              </g>
              {/* Fine, low-contrast creases aligned to THIS hand silhouette.
                  Fade before the close-up so they do not turn into thick stripes. */}
              <g opacity={1 - smooth(0.36, 0.51, progress)}>
                <g stroke="#f3c0b6" strokeWidth="1.25" strokeOpacity=".22">
                  <path d="M 672 528 C 625 517 588 510 548 515 S 474 530 446 525" />
                  <path d="M 424 580 C 466 577 510 588 555 607" />
                  <path d="M 365 632 C 393 650 411 676 421 711" />
                  <path d="M 397 759 Q 441 770 485 759" />
                </g>
                {/* Short folds across each finger, not across adjacent fingers. */}
                <g stroke="#f6c9bf" strokeWidth=".9" strokeOpacity=".19">
                  <path d="M378 225 Q404 221 432 225 M380 234 Q405 230 432 234 M380 325 Q407 322 433 325" />
                  <path d="M486 160 Q515 157 545 160 M486 169 Q515 166 545 169 M487 282 Q515 279 545 282" />
                  <path d="M594 244 Q619 241 649 245 M594 252 Q619 249 649 253 M590 336 Q616 333 644 337" />
                  <path d="M711 390 Q731 398 749 404 M707 398 Q728 406 745 412" />
                  <path d="M132 540 Q147 551 159 565 M137 535 Q152 546 164 559" />
                </g>
                {/* Nested fingertip ridges: loops and whorls, never horizontal bars.
                    Each set sits inside the fingertip pad and follows its direction. */}
                <g stroke="#ffe4d8" strokeOpacity=".14" strokeWidth=".55">
                  {(
                    [
                      { x: 404, y: 161, angle: -2, rx: 26, ry: 38 },
                      { x: 515, y: 96, angle: 0, rx: 28, ry: 39 },
                      { x: 624, y: 184, angle: 5, rx: 25, ry: 35 },
                      { x: 745, y: 372, angle: 24, rx: 18, ry: 27 },
                      { x: 116, y: 536, angle: -53, rx: 23, ry: 31 },
                    ] as const
                  ).map((tip, finger) => (
                    <g
                      key={`fingerprint-${finger}`}
                      transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const scale = 1 - i * 0.082;
                        const rx = tip.rx * scale;
                        const ry = tip.ry * scale;
                        // A gently asymmetric oval loop, opening slightly near its base.
                        // This traces the contour of the fingertip rather than a row of stripes.
                        return (
                          <path
                            key={i}
                            d={`M ${svgCoord(-rx * 0.68)} ${svgCoord(ry * 0.86)} C ${svgCoord(-rx * 1.28)} ${svgCoord(ry * 0.35)}, ${svgCoord(-rx * 1.08)} ${svgCoord(-ry * 0.77)}, ${svgCoord(-rx * 0.23)} ${svgCoord(-ry)} C ${svgCoord(rx * 0.73)} ${svgCoord(-ry * 1.16)}, ${svgCoord(rx * 1.22)} ${svgCoord(-ry * 0.31)}, ${svgCoord(rx * 0.9)} ${svgCoord(ry * 0.4)} C ${svgCoord(rx * 0.66)} ${svgCoord(ry * 0.95)}, ${svgCoord(rx * 0.12)} ${svgCoord(ry * 0.83)}, ${svgCoord(-rx * 0.06)} ${svgCoord(ry * 0.4)}`}
                          />
                        );
                      })}
                    </g>
                  ))}
                </g>
              </g>
              {/* Micro skin texture, not a grid. Deterministic placement avoids hydration errors. */}
              {Array.from({ length: 330 }, (_, i) => {
                const x = (i * 73.31) % 800;
                const y = (i * 119.71) % 700;
                return (
                  <path
                    key={`micro-${i}`}
                    d={`M${svgCoord(x)} ${svgCoord(y)} q2 -1 4 .5`}
                    stroke="#ffe0d1"
                    strokeWidth=".6"
                    strokeOpacity=".18"
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Tissue emerges through an expanding, feathered circular window at the palm's
            focal point. There is no rectangular sheet or exposed grid boundary. */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            opacity: tissueOpacity,
            // Avoid pre-rasterizing the SVG at its small initial scale.
            // Let the browser repaint vector paths as the camera zooms.
            transform: `scale(${0.95 + tissueZoom * 2.65})`,
            transformOrigin: "50% 50%",
            WebkitMaskImage:
              skinToTissue >= 0.999
                ? "none"
                : `radial-gradient(circle at 50% 50%, #000 0%, #000 ${Math.min(96, 5 + skinToTissue * 95)}%, transparent ${Math.min(100, 12 + skinToTissue * 96)}%)`,
            maskImage:
              skinToTissue >= 0.999
                ? "none"
                : `radial-gradient(circle at 50% 50%, #000 0%, #000 ${Math.min(96, 5 + skinToTissue * 95)}%, transparent ${Math.min(100, 12 + skinToTissue * 96)}%)`,
          }}
        >
          <svg
            viewBox="0 0 900 900"
            preserveAspectRatio="xMidYMid slice"
            shapeRendering="geometricPrecision"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="tissueCell">
                <stop stopColor="#e4a2bd" />
                <stop offset=".6" stopColor="#a86891" />
                <stop offset="1" stopColor="#5d426c" />
              </radialGradient>
              <radialGradient id="chosenCell">
                <stop stopColor="#df9fbb" />
                <stop offset=".76" stopColor="#a66a93" />
                <stop offset="1" stopColor="#67476f" />
              </radialGradient>
            </defs>
            {/* An opaque microscopic field prevents the hand silhouette from showing
                through gaps between tissue cells as the camera enters the skin. */}
            <rect x="0" y="0" width="900" height="900" fill="#754e73" />
            {Array.from({ length: 19 }, (_, row) =>
              Array.from({ length: 19 }, (_, col) => {
                const chosen = row === 9 && col === 9;
                const seed = row * 19 + col;
                const stagger = row % 2 ? 35 : 0;
                const x = chosen
                  ? 450
                  : 450 +
                    (col - 9) * 73 +
                    stagger +
                    (noise(seed + 4) - 0.5) * 17;
                const y = chosen
                  ? 450
                  : 450 + (row - 9) * 71 + (noise(seed + 9) - 0.5) * 16;
                const radius = 35 + noise(seed + 2) * 10;
                return (
                  <OrganicCell
                    key={seed}
                    x={x}
                    y={y}
                    rx={chosen ? 42 : radius}
                    ry={chosen ? 43 : radius * (0.87 + noise(seed + 3) * 0.27)}
                    seed={seed}
                    selected={chosen}
                    opacity={
                      chosen ? selectedCellOpacity : surroundingCellsOpacity
                    }
                  />
                );
              }),
            )}
            {/* Blue cell replaces the selected pink cell at the SAME x/y and
                membrane diameter. It inherits the tissue camera transform. */}
            <svg
              x="400"
              y="400"
              width="100"
              height="100"
              viewBox="0 0 700 700"
              style={{ opacity: selectedInteriorOpacity, overflow: "visible" }}
              shapeRendering="geometricPrecision"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="mem">
                  <stop stopColor="#5e9bb2" stopOpacity=".15" />
                  <stop offset=".75" stopColor="#5086a1" stopOpacity=".26" />
                  <stop offset="1" stopColor="#8cc5d4" stopOpacity=".36" />
                </radialGradient>
                <radialGradient id="nuc">
                  <stop stopColor="#aa86cc" stopOpacity=".95" />
                  <stop offset="1" stopColor="#71599b" stopOpacity=".9" />
                </radialGradient>
                <filter id="halo">
                  <feGaussianBlur stdDeviation="16" />
                </filter>
              </defs>
              <path
                d="M345 48 C450 32 530 94 588 167 C651 248 653 360 613 470 C572 586 479 649 352 647 C223 650 111 580 74 467 C32 352 59 238 135 150 C188 87 252 54 345 48Z"
                fill="#63b7d4"
                opacity=".18"
                filter="url(#halo)"
              />
              <path
                d="M345 48 C450 32 530 94 588 167 C651 248 653 360 613 470 C572 586 479 649 352 647 C223 650 111 580 74 467 C32 352 59 238 135 150 C188 87 252 54 345 48Z"
                fill="url(#mem)"
                stroke="#8cc5d4"
                strokeOpacity=".5"
                strokeWidth="3"
              />
              <circle
                cx="350"
                cy="347"
                r="151"
                fill="url(#nuc)"
                stroke="#d0aee5"
                strokeOpacity=".55"
                strokeWidth="3"
              />
              <circle cx="400" cy="377" r="42" fill="#d3a5e3" opacity=".85" />
              {Array.from({ length: 16 }, (_, i) => {
                const a = i * 2.4;
                return (
                  <ellipse
                    key={i}
                    cx={svgCoord(350 + Math.sin(a) * 60)}
                    cy={svgCoord(347 + Math.cos(a) * 55)}
                    rx="42"
                    ry="13"
                    fill="none"
                    stroke="#d5b5f0"
                    strokeOpacity=".24"
                    strokeWidth="2"
                    transform={`rotate(${i * 43} 350 347)`}
                  />
                );
              })}
              {[-1, 1].map((side) => (
                <g
                  key={side}
                  transform={`translate(${side === -1 ? 160 : 510} 325) rotate(${side === -1 ? -14 : 19})`}
                  fill="none"
                  stroke="#7ed4e8"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity=".85"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <path
                      key={i}
                      d={`M ${side === -1 ? 40 : -40} ${-110 + i * 13} Q ${side === -1 ? -40 : 40} ${-75 + i * 13} ${side === -1 ? 24 : -24} ${10 + i * 11}`}
                    />
                  ))}
                </g>
              ))}
              {[
                { x: 210, y: 490, r: -28 },
                { x: 523, y: 205, r: 25 },
                { x: 500, y: 505, r: -16 },
              ].map((m, i) => (
                <g
                  key={i}
                  transform={`translate(${m.x} ${m.y}) rotate(${m.r})`}
                >
                  <ellipse
                    rx="77"
                    ry="39"
                    fill="#bd798c"
                    stroke="#e5a4af"
                    strokeWidth="3"
                  />
                  <path
                    d="M-55 -14 Q-30 23 -8 -13 T40 -13 T60 12"
                    fill="none"
                    stroke="#e9b1bc"
                    strokeWidth="6"
                  />
                </g>
              ))}
              <g
                stroke="#dca4df"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <path
                    key={i}
                    d={`M 175 ${420 + i * 13} Q 245 ${445 + i * 13} 290 ${410 + i * 13}`}
                  />
                ))}
              </g>
              {Array.from({ length: 70 }, (_, i) => {
                const a = i * 2.39996,
                  r = 165 + ((i * 37) % 100);
                return (
                  <circle
                    key={i}
                    cx={svgCoord(350 + Math.cos(a) * r)}
                    cy={svgCoord(350 + Math.sin(a) * r)}
                    r={i % 5 === 0 ? 3.2 : 1.8}
                    fill={i % 3 === 0 ? "#e7a8cf" : "#a6d9e7"}
                    opacity=".65"
                  />
                );
              })}
            </svg>
          </svg>
        </div>

        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-10 sm:pt-[max(1.5rem,env(safe-area-inset-top))] [@media(max-height:500px)]:pt-2">
          <div className="min-w-0 max-w-[52%] text-[9px] font-bold uppercase leading-snug tracking-[.16em] text-[#d8c18d] sm:max-w-none sm:text-xs sm:tracking-[.24em] [@media(max-height:500px)]:text-[9px]">
            The Unfolding Universe · Museum
          </div>
          <button
            type="button"
            onClick={onEnter}
            className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-[#0b1e2b]/75 px-3 py-2 text-[11px] text-white/80 backdrop-blur-md transition hover:bg-white/15 hover:text-white sm:px-4 sm:text-xs [@media(max-height:500px)]:py-1.5"
          >
            <SkipForward size={14} /> Hoppa över intro
          </button>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center px-5 pb-[max(6.5rem,15vh)] text-center sm:pb-[15vh] [@media(max-height:500px)]:items-center [@media(max-height:500px)]:pb-0 [@media(max-height:500px)]:pt-3">
          <div className="relative w-full max-w-2xl [@media(max-height:500px)]:max-w-[min(80vw,650px)]">
            <div
              style={{
                opacity: firstText,
                transform: `translateY(${(1 - firstText) * 15}px)`,
              }}
              className="absolute inset-x-0 bottom-0 [@media(max-height:500px)]:bottom-auto [@media(max-height:500px)]:top-1/2 [@media(max-height:500px)]:-translate-y-1/2"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[.28em] text-[#d8c18d] [@media(max-height:500px)]:mb-1 [@media(max-height:500px)]:text-[9px]">
                Titta närmare
              </p>
              <h1 className="font-serif text-3xl leading-tight sm:text-6xl [@media(max-height:500px)]:text-[clamp(1.25rem,6.5svh,2rem)] [@media(max-height:500px)]:leading-[1.12]">
                Allt levande är uppbyggt av celler.
              </h1>
              <p className="mt-4 text-sm text-[#c1d2dc] sm:text-lg [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:text-[clamp(0.7rem,2.8svh,0.85rem)] [@media(max-height:500px)]:leading-snug">
                Men de flesta är för små för att vi ska kunna se dem.
              </p>
            </div>
            <div
              style={{ opacity: secondText }}
              className="absolute inset-x-0 bottom-0 [@media(max-height:500px)]:bottom-auto [@media(max-height:500px)]:top-1/2 [@media(max-height:500px)]:-translate-y-1/2"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[.28em] text-[#d8c18d] [@media(max-height:500px)]:mb-1 [@media(max-height:500px)]:text-[9px]">
                Under ytan
              </p>
              <h2 className="font-serif text-3xl leading-tight sm:text-6xl [@media(max-height:500px)]:text-[clamp(1.25rem,6.5svh,2rem)] [@media(max-height:500px)]:leading-[1.12]">
                Under huden finns en hel värld.
              </h2>
              <p className="mt-4 text-sm text-[#c1d2dc] sm:text-lg [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:text-[clamp(0.7rem,2.8svh,0.85rem)] [@media(max-height:500px)]:leading-snug">
                Vi passerar hudens yttersta lager och närmar oss de levande
                cellerna.
              </p>
            </div>
            <div
              style={{ opacity: thirdText }}
              className="absolute inset-x-0 bottom-0 [@media(max-height:500px)]:bottom-auto [@media(max-height:500px)]:top-1/2 [@media(max-height:500px)]:-translate-y-1/2"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[.28em] text-[#d8c18d] [@media(max-height:500px)]:mb-1 [@media(max-height:500px)]:text-[9px]">
                Titta ännu närmare
              </p>
              <h2 className="font-serif text-3xl leading-tight sm:text-6xl [@media(max-height:500px)]:text-[clamp(1.25rem,6.5svh,2rem)] [@media(max-height:500px)]:leading-[1.12]">
                En enda cell. En hel värld.
              </h2>
              <p className="mt-4 text-sm text-[#c1d2dc] sm:text-lg [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:text-[clamp(0.7rem,2.8svh,0.85rem)] [@media(max-height:500px)]:leading-snug">
                Vi närmar oss en cell och upptäcker vad som finns inuti.
              </p>
            </div>
            <div
              style={{ opacity: lastText }}
              className="relative [@media(max-height:500px)]:-translate-y-2"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[.28em] text-[#d8c18d] [@media(max-height:500px)]:mb-1 [@media(max-height:500px)]:text-[9px]">
                Välkommen till
              </p>
              <h2 className="font-serif text-4xl leading-tight sm:text-6xl [@media(max-height:500px)]:text-[clamp(1.35rem,7svh,2.1rem)] [@media(max-height:500px)]:leading-[1.12]">
                Livets osynliga värld
              </h2>
              <p className="mt-4 text-sm text-[#c1d2dc] sm:text-lg [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:text-[clamp(0.7rem,2.8svh,0.85rem)] [@media(max-height:500px)]:leading-snug">
                Utforska cellen och upptäck världen som finns inuti.
              </p>
              <button
                type="button"
                onClick={onEnter}
                style={{ pointerEvents: lastText > 0.7 ? "auto" : "none" }}
                tabIndex={lastText > 0.7 ? 0 : -1}
                className="pointer-events-auto mt-7 inline-flex items-center gap-3 [@media(max-height:500px)]:mt-3 [@media(max-height:500px)]:px-5 [@media(max-height:500px)]:py-2 rounded-full border border-[#80d7f0]/60 bg-[#12658a] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_#4dc6e944] transition hover:bg-[#187ba5]"
              >
                Börja utforska <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-3 px-6 [@media(max-height:500px)]:bottom-2 [@media(max-height:500px)]:gap-1">
          <div
            className="flex gap-2"
            aria-label="Framsteg genom introduktionen"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${Math.min(3, Math.floor(progress * 4)) === i ? "w-9 bg-[#9edff2]" : "w-4 bg-white/25"}`}
              />
            ))}
          </div>
          {progress < 0.93 && (
            <button
              type="button"
              onClick={advance}
              className="flex items-center gap-2 text-xs text-[#b6cbd0] hover:text-white"
            >
              <ArrowDown size={14} /> Scrolla för att upptäcka
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
