"use client";

type WaterfallMistProps = {
  active: boolean;
};

const mistClouds = [
  { x: 415, y: 393, rx: 62, ry: 21, delay: "-1.2s", duration: "7s" },
  { x: 455, y: 411, rx: 48, ry: 16, delay: "-4s", duration: "8s" },
  { x: 440, y: 690, rx: 88, ry: 30, delay: "-2s", duration: "6.5s" },
  { x: 565, y: 720, rx: 110, ry: 26, delay: "-5s", duration: "8.5s" },
  { x: 745, y: 810, rx: 96, ry: 33, delay: "-3s", duration: "7.5s" },
];

export default function WaterfallMist({ active }: WaterfallMistProps) {
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
          <radialGradient id="waterfall-mist-gradient">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.58" />
            <stop offset="35%" stopColor="#f0faff" stopOpacity="0.38" />
            <stop offset="70%" stopColor="#d9f3ff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#e8f8ff" stopOpacity="0" />
          </radialGradient>

          <filter
            id="waterfall-mist-soften"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {mistClouds.map((mist, index) => (
          <ellipse
            key={index}
            cx={mist.x}
            cy={mist.y}
            rx={mist.rx}
            ry={mist.ry}
            fill="url(#waterfall-mist-gradient)"
            filter="url(#waterfall-mist-soften)"
            className="waterfall-mist-cloud"
            style={{
              animationDelay: mist.delay,
              animationDuration: mist.duration,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
