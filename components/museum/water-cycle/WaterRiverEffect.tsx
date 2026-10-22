"use client";

import { useId } from "react";

type WaterRiverEffectProps = {
  active: boolean;
};

export default function WaterRiverEffect({ active }: WaterRiverEffectProps) {
  const id = useId().replace(/:/g, "");

  const maskId = `river-mask-${id}`;
  const maskBlurId = `river-mask-blur-${id}`;
  const distortionId = `river-distortion-${id}`;
  const imageId = `river-image-${id}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-[1400ms] ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 1648 928"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Feather the edges of the water mask */}
          <filter id={maskBlurId} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="18" />
          </filter>

          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1648"
            height="928"
          >
            <g filter={`url(#${maskBlurId})`}>
              {/* Upper waterfall: narrower, softer */}
              <path
                d="
                  M 360 205
                  C 373 232, 389 262, 398 288
                  C 407 314, 419 337, 431 360
                  L 439 388
                  L 414 390
                  C 396 354, 380 327, 369 297
                  C 357 267, 352 231, 360 205
                  Z
                "
                fill="white"
              />

              {/* Foreground waterfall and river */}
              <path
                d="
                  M 270 630
                  C 350 614, 438 626, 520 651
                  C 595 667, 660 681, 713 702
                  C 772 725, 817 748, 851 777
                  L 829 843
                  C 761 814, 696 791, 625 771
                  C 558 749, 498 725, 428 707
                  C 355 684, 299 668, 270 654
                  Z
                "
                fill="white"
              />

              {/* Coastal whitewater */}
              <path
                d="
                  M 1155 613
                  C 1215 596, 1268 607, 1320 635
                  C 1375 661, 1416 684, 1463 703
                  L 1480 741
                  C 1412 728, 1353 710, 1289 683
                  C 1231 658, 1185 650, 1155 641
                  Z
                "
                fill="white"
              />
            </g>
          </mask>

          {/* Flowing distortion — never reverses direction */}
          <filter
            id={distortionId}
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016 0.034"
              numOctaves="2"
              seed="6"
              result="noise"
            />

            <feOffset in="noise" dx="0" dy="0" result="movingNoise">
              <animate
                attributeName="dx"
                from="-80"
                to="80"
                dur="9s"
                repeatCount="indefinite"
              />
            </feOffset>

            <feDisplacementMap
              in="SourceGraphic"
              in2="movingNoise"
              scale="7"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <image
            id={imageId}
            href="/images/museum/water-cycle-landscape.webp"
            x="0"
            y="0"
            width="1648"
            height="928"
            preserveAspectRatio="none"
            mask={`url(#${maskId})`}
            filter={`url(#${distortionId})`}
          />
        </defs>

        <use href={`#${imageId}`} />
      </svg>
    </div>
  );
}
