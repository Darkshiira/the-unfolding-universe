"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, SkipForward } from "lucide-react";

type Props = { onEnter: () => void };
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
        ? 0.32
        : progress < 0.55
          ? 0.66
          : progress < 0.83
            ? 0.94
            : 1;
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top + range * next,
      behavior: reduced ? "instant" : "smooth",
    });
  }, [progress, reduced]);

  // Four beats: hand → tissue → one magnified cell → its interior.
  const tissueZoom = smooth(0.52, 0.88, progress);
  const skinZoom = smooth(0.04, 0.56, progress);
  // Finish entering the tissue BEFORE the “Under ytan” caption appears.
  const skinToTissue = smooth(0.3, 0.41, progress);
  const revealInterior = smooth(0.84, 0.98, progress);
  // Fade the entire hand silhouette, including its cellular texture.
  const handOpacity = 1 - smooth(0.3, 0.41, progress);
  const handCellsOpacity = smooth(0.27, 0.37, progress);
  const skinDetailOpacity =
    smooth(0.025, 0.14, progress) * (1 - smooth(0.5, 0.66, progress));
  const tissueOpacity = smooth(0.3, 0.41, progress);
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
    smooth(0.41, 0.48, progress) * (1 - smooth(0.61, 0.72, progress));
  const thirdText =
    smooth(0.68, 0.77, progress) * (1 - smooth(0.86, 0.93, progress));
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
            transformOrigin: "47% 52%",
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
              <radialGradient id="skinGlow">
                <stop stopColor="#eeb9a6" stopOpacity=".28" />
                <stop offset=".55" stopColor="#eeb9a6" stopOpacity=".12" />
                <stop offset="1" stopColor="#eeb9a6" stopOpacity="0" />
              </radialGradient>

              <clipPath id="handCellClip">
                <path d="M270 700 C268 610 267 540 238 472 C209 420 148 391 109 359 C79 335 85 303 111 299 C145 294 201 333 253 365 L183 205 C168 170 180 150 206 150 C229 150 239 168 250 194 L322 333 L276 121 C270 91 283 75 307 77 C334 79 339 101 344 124 L384 322 L385 92 C385 62 402 49 426 54 C452 59 452 84 451 109 L445 331 L491 169 C500 140 517 132 537 144 C559 157 553 181 548 204 L518 389 C506 456 477 503 466 551 L465 700 C463 855 472 1050 489 1280 L250 1280 C267 1050 270 858 270 700 Z" />
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
              d="M270 700 C268 610 267 540 238 472 C209 420 148 391 109 359 C79 335 85 303 111 299 C145 294 201 333 253 365 L183 205 C168 170 180 150 206 150 C229 150 239 168 250 194 L322 333 L276 121 C270 91 283 75 307 77 C334 79 339 101 344 124 L384 322 L385 92 C385 62 402 49 426 54 C452 59 452 84 451 109 L445 331 L491 169 C500 140 517 132 537 144 C559 157 553 181 548 204 L518 389 C506 456 477 503 466 551 L465 700 C463 855 472 1050 489 1280 L250 1280 C267 1050 270 858 270 700 Z"
              fill="url(#skin)"
              stroke="#e4b1ad"
              strokeOpacity=".28"
              strokeWidth="3"
            />
            <path
              d="M270 700 C268 610 267 540 238 472 C209 420 148 391 109 359 C79 335 85 303 111 299 C145 294 201 333 253 365 L183 205 C168 170 180 150 206 150 C229 150 239 168 250 194 L322 333 L276 121 C270 91 283 75 307 77 C334 79 339 101 344 124 L384 322 L385 92 C385 62 402 49 426 54 C452 59 452 84 451 109 L445 331 L491 169 C500 140 517 132 537 144 C559 157 553 181 548 204 L518 389 C506 456 477 503 466 551 L465 700 C463 855 472 1050 489 1280 L250 1280 C267 1050 270 858 270 700 Z"
              fill="url(#skinVolume)"
            />
            {/* Broad, blurred contour shading: no interior strokes that resemble bones. */}
            <g
              clipPath="url(#handCellClip)"
              filter="url(#softContour)"
              opacity=".58"
            >
              <path
                d="M270 700 C268 610 267 540 238 472 C209 420 148 391 109 359 C79 335 85 303 111 299 C145 294 201 333 253 365 L183 205 C168 170 180 150 206 150 C229 150 239 168 250 194 L322 333 L276 121 C270 91 283 75 307 77 C334 79 339 101 344 124 L384 322 L385 92 C385 62 402 49 426 54 C452 59 452 84 451 109 L445 331 L491 169 C500 140 517 132 537 144 C559 157 553 181 548 204 L518 389 C506 456 477 503 466 551 L465 700 C463 855 472 1050 489 1280 L250 1280 C267 1050 270 858 270 700 Z"
                fill="none"
                stroke="#34243e"
                strokeOpacity=".6"
                strokeWidth="27"
              />
            </g>
            <g clipPath="url(#handCellClip)" opacity={skinDetailOpacity * 0.78}>
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
                Array.from({ length: row < 55 ? 50 : 25 }, (_, index) => {
                  // Below the palm, draw only the wrist/forearm columns.
                  const col = row < 55 ? index : index + 14;
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
            {/* Skin micro-relief grows naturally as the camera approaches the palm. */}
            <g
              clipPath="url(#handCellClip)"
              opacity={skinDetailOpacity * smooth(0.17, 0.35, progress)}
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
              {/* Three principal palm creases, shaped around the thumb mound and finger bases. */}
              <g stroke="#f5c2b5" strokeWidth="2" strokeOpacity=".49">
                {/* Heart line: starts below the little finger and curves toward the index finger. */}
                <path d="M 506 363 C 465 375 441 389 400 393 S 320 388 282 364" />
                {/* Head line: travels diagonally across the middle of the palm. */}
                <path d="M 287 402 C 333 414 373 436 411 457 S 462 480 486 486" />
                {/* Life line: arcs around the fleshy base of the thumb toward the wrist. */}
                <path d="M 254 362 C 287 388 308 428 312 466 C 319 509 342 539 376 563" />
                {/* Thenar and wrist creases are shorter, uneven, and oblique. */}
                <path d="M 258 432 C 274 451 285 476 291 496" />
                <path d="M 347 579 Q 389 596 434 581" />
                <path d="M 331 608 Q 379 618 424 603" />
                <path d="M 310 529 Q 334 546 355 552" />
              </g>
              {/* Joint folds are perpendicular to each finger’s actual axis. */}
              <g stroke="#f6c9bf" strokeWidth="1.3" strokeOpacity=".37">
                {/* Index finger slopes down/right; its folds slope down/left. */}
                <path d="M191 247 Q202 238 218 235 M195 254 Q207 246 222 243 M226 312 Q238 301 253 299" />
                {/* Middle finger tilts slightly right. */}
                <path d="M280 184 Q299 177 324 173 M283 191 Q301 185 326 181 M302 257 Q321 251 341 248" />
                {/* Ring finger is almost vertical. */}
                <path d="M389 167 Q413 160 443 166 M389 175 Q414 169 444 174 M386 255 Q411 249 445 254" />
                {/* Little finger tilts left as it travels downward. */}
                <path d="M493 237 Q509 239 536 250 M491 245 Q510 247 534 257 M475 308 Q494 311 520 322" />
                {/* Thumb is diagonal: creases cross it rather than follow it. */}
                <path d="M135 351 Q146 337 158 327 M142 359 Q153 345 166 334" />
              </g>
              {/* Fingertip prints use local coordinates centered on the distal pads.
                  Rotate the entire print with the finger, never skew individual ridges. */}
              <g stroke="#ffe4d8" strokeOpacity=".28" strokeWidth=".65">
                {(
                  [
                    { x: 122, y: 326, angle: -56, width: 14 }, // thumb
                    { x: 204, y: 173, angle: -27, width: 12 }, // index
                    { x: 309, y: 101, angle: -12, width: 12 }, // middle
                    { x: 418, y: 77, angle: 0, width: 12 }, // ring
                    { x: 523, y: 166, angle: 15, width: 10 }, // little
                  ] as const
                ).map((tip, finger) => (
                  <g
                    key={`tip-${finger}`}
                    transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}
                  >
                    {Array.from({ length: 6 }, (_, i) => {
                      const r = tip.width - i * 1.3;
                      return (
                        <path
                          key={i}
                          d={`M ${-r} ${6 + i * 2} Q 0 ${-8 + i * 2} ${r} ${6 + i * 2}`}
                        />
                      );
                    })}
                  </g>
                ))}
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
