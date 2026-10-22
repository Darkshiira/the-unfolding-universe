"use client";
import { useEffect, useState } from "react";
type Props = {
  active: boolean;
};

const waterParticles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: 56 + ((i * 17) % 15),
  y: 75 + ((i * 11) % 9),
  size: 2 + (i % 3) * 0.8,
  delay: -(i % 9) * 0.8,
  duration: 6.5 + (i % 5) * 1.1,
}));

const vaporParticles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: 55 + ((i * 13) % 16),
  y: 66 + ((i * 7) % 8),
  size: 3 + (i % 4),
  delay: -(i % 8) * 1.2,
  duration: 8 + (i % 5),
}));

export default function WaterPlantEffect({ active }: Props) {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (active) return;

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, [active]);
  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[5] overflow-hidden transition-opacity duration-[1800ms] ease-in-out ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Forest illumination — centered around the plant marker */}
      <div
        className="water-plant-glow absolute left-[53%] top-[60%] h-[26%] w-[25%] rounded-full blur-[65px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(108,219,119,0.32) 0%, rgba(51,153,91,0.18) 43%, transparent 75%)",
        }}
      />

      {/* Smaller patches of filtered sunlight */}
      <div
        className="water-plant-sunlight absolute left-[58%] top-[67%] h-[15%] w-[14%] rounded-full blur-[35px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(209,245,154,0.25), transparent 75%)",
        }}
      />

      {/* Tiny turquoise droplets travelling upward */}
      {waterParticles.map((particle) => (
        <span
          key={`water-${particle.id}`}
          className="water-plant-uptake absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size * 1.4,
            background: "rgba(147,248,233,0.9)",
            boxShadow:
              "0 0 8px rgba(94,234,212,0.8), 0 0 16px rgba(45,212,191,0.25)",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Gentle transpiration above the canopy */}
      {vaporParticles.map((particle) => (
        <span
          key={`vapor-${particle.id}`}
          className="water-plant-transpiration absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: "rgba(231,255,241,0.55)",
            filter: "blur(2px)",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Growing botanical illustration */}
      <div className="water-plant-corner absolute bottom-0 left-0 w-[180px] sm:w-[240px] lg:w-[300px]">
        <svg
          viewBox="0 0 300 360"
          className="h-auto w-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="plantStemGradient"
              x1="140"
              y1="350"
              x2="175"
              y2="55"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#183F2F" />
              <stop offset="0.55" stopColor="#426F48" />
              <stop offset="1" stopColor="#779B63" />
            </linearGradient>

            <linearGradient
              id="plantLeafGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#91AD70" />
              <stop offset="25%" stopColor="#638A55" />
              <stop offset="55%" stopColor="#3D7048" />
              <stop offset="80%" stopColor="#28563C" />
              <stop offset="100%" stopColor="#173E30" />
            </linearGradient>

            <filter
              id="plantSoftGlow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>

          {/* Atmospheric glow behind the plant */}
          <ellipse
            cx="145"
            cy="225"
            rx="90"
            ry="115"
            fill="#72D7A2"
            opacity="0.05"
            filter="url(#plantSoftGlow)"
          />

          {/* Main stem */}
          <path
            className="water-growing-stem"
            d="M140 355 C130 305 155 270 145 225 C135 175 170 135 160 70"
            stroke="url(#plantStemGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Left branch */}
          <path
            className="water-growing-stem water-growing-branch"
            d="M145 260 Q113 229 83 220"
            stroke="#6EBD78"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Right branch */}
          <path
            className="water-growing-stem water-growing-branch"
            d="M146 205 Q185 173 215 172"
            stroke="#83CB80"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Delicate botanical leaves */}

          {/* Lower left leaf */}
          <g className="water-growing-leaf water-growing-leaf-one">
            <path
              d="M145 260
       C126 251 111 236 96 223
       C80 209 64 206 53 211
       C60 229 75 246 95 253
       C114 260 132 261 145 260Z"
              fill="url(#plantLeafGradient)"
              fillOpacity="0.88"
              stroke="#B8DFA7"
              strokeOpacity="0.6"
              strokeWidth="0.8"
            />

            <path
              d="M145 260 Q98 246 53 211"
              stroke="#DDF3C5"
              strokeOpacity="0.6"
              strokeWidth="0.9"
            />

            <path
              d="M104 247 L91 230
       M91 239 L76 225
       M117 252 L108 240"
              stroke="#E2F5D3"
              strokeOpacity="0.28"
              strokeWidth="0.6"
            />
          </g>

          {/* Right leaf */}
          <g className="water-growing-leaf water-growing-leaf-two">
            <path
              d="M146 205
       C167 195 179 177 196 163
       C213 149 233 145 251 153
       C240 171 225 188 207 197
       C187 207 164 210 146 205Z"
              fill="url(#plantLeafGradient)"
              fillOpacity="0.9"
              stroke="#C4E7B3"
              strokeOpacity="0.55"
              strokeWidth="0.8"
            />

            <path
              d="M146 205 Q207 193 251 153"
              stroke="#E0F3C9"
              strokeOpacity="0.65"
              strokeWidth="0.9"
            />

            <path
              d="M181 199 L188 185
       M202 191 L211 174
       M220 180 L231 164"
              stroke="#E7F7D8"
              strokeOpacity="0.3"
              strokeWidth="0.6"
            />
          </g>

          {/* Upper left leaf */}
          <g className="water-growing-leaf water-growing-leaf-three">
            <path
              d="M156 145
       C143 130 127 120 116 104
       C105 88 103 72 110 57
       C127 68 141 83 150 103
       C157 119 160 135 156 145Z"
              fill="url(#plantLeafGradient)"
              fillOpacity="0.86"
              stroke="#BFE6AF"
              strokeOpacity="0.6"
              strokeWidth="0.8"
            />

            <path
              d="M156 145 Q137 91 110 57"
              stroke="#E3F5D1"
              strokeOpacity="0.6"
              strokeWidth="0.9"
            />

            <path
              d="M143 116 L127 107
       M135 96 L120 88
       M150 130 L140 120"
              stroke="#E9F8DB"
              strokeOpacity="0.25"
              strokeWidth="0.6"
            />
          </g>

          {/* Small, newly unfurled leaf */}
          <g className="water-growing-leaf water-growing-leaf-four">
            <path
              d="M160 70
       C157 52 160 35 170 22
       C180 10 192 7 201 8
       C201 25 194 43 182 55
       C174 63 166 68 160 70Z"
              fill="url(#plantLeafGradient)"
              fillOpacity="0.94"
              stroke="#D5EFC3"
              strokeOpacity="0.7"
              strokeWidth="0.8"
            />

            <path
              d="M160 70 Q181 40 201 8"
              stroke="#E9F9D9"
              strokeOpacity="0.7"
              strokeWidth="0.9"
            />
          </g>

          {/* Water travelling through the stem */}
          <circle
            r="4"
            fill="#A9FFF1"
            style={{
              filter: "drop-shadow(0 0 6px #5EEAD4)",
            }}
          >
            <animateMotion
              dur="5s"
              repeatCount="indefinite"
              path="M140 355 C130 305 155 270 145 225 C135 175 170 135 160 70"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
}
