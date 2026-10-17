import type { Milestone } from "./timeline-data";

// Lätta vektorillustrationer för de fem temana. Specifika fotografier
// kan senare anges via milestone.image utan att ändra komponenten.
export function ScientificIllustration({
  milestone,
  size = 60,
}: {
  milestone: Milestone;
  size?: number;
}) {
  const common = { width: size, height: size, viewBox: "0 0 100 100" };
  if (milestone.category === "earth") {
    return (
      <svg
        {...common}
        role="img"
        aria-label={`Illustration: ${milestone.title}`}
      >
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="#79A9B3"
          stroke="#557D86"
          strokeWidth="2"
        />
        <path
          d="M26 32 L44 21 L59 29 L57 40 L70 48 L62 60 L48 58 L42 74 L28 63 L33 50 Z"
          fill="#88A977"
          stroke="#648568"
          strokeWidth="2"
        />
        <path
          d="M70 29 Q82 47 68 68"
          fill="none"
          stroke="#DDEDE5"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="33" cy="40" r="4" fill="#F4E7C6" opacity=".8" />
      </svg>
    );
  }
  if (milestone.category === "life") {
    return (
      <svg
        {...common}
        role="img"
        aria-label={`Illustration: ${milestone.title}`}
      >
        <ellipse
          cx="49"
          cy="51"
          rx="33"
          ry="26"
          fill="#A8CFCA"
          stroke="#679E9F"
          strokeWidth="3"
          transform="rotate(-25 49 51)"
        />
        <ellipse cx="49" cy="51" rx="12" ry="9" fill="#6C9EA4" />
        <circle cx="33" cy="46" r="4" fill="#EAF3DC" />
        <circle cx="64" cy="58" r="5" fill="#EAF3DC" />
        <path
          d="M25 27 l-8 -9 M73 70 l9 9 M20 58 l-12 4"
          stroke="#679E9F"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (milestone.category === "plants") {
    return (
      <svg
        {...common}
        role="img"
        aria-label={`Illustration: ${milestone.title}`}
      >
        <path
          d="M50 84 Q50 50 49 20"
          fill="none"
          stroke="#658365"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M48 62 Q15 65 17 38 Q41 36 48 62"
          fill="#9EBA80"
          stroke="#6D9369"
          strokeWidth="2"
        />
        <path
          d="M50 48 Q82 50 84 24 Q58 25 50 48"
          fill="#80A875"
          stroke="#6D9369"
          strokeWidth="2"
        />
        <path
          d="M49 30 Q25 30 33 12 Q51 15 49 30"
          fill="#B6C996"
          stroke="#6D9369"
          strokeWidth="2"
        />
        <path
          d="M38 83 H63"
          stroke="#A58C6C"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (milestone.category === "animals") {
    return (
      <svg
        {...common}
        role="img"
        aria-label={`Illustration: ${milestone.title}`}
      >
        <path
          d="M17 52 Q37 21 70 40 Q84 48 74 64 Q43 81 17 52"
          fill="#C99A95"
          stroke="#9C7777"
          strokeWidth="3"
        />
        <path
          d="M17 52 L5 37 L5 69 Z"
          fill="#B88D8D"
          stroke="#9C7777"
          strokeWidth="3"
        />
        <circle cx="63" cy="48" r="4" fill="#4E4D48" />
        <path
          d="M37 36 Q48 51 37 69 M49 35 Q59 51 49 70"
          fill="none"
          stroke="#EED7D2"
          strokeWidth="3"
        />
        <circle cx="73" cy="61" r="2" fill="#EED7D2" />
      </svg>
    );
  }
  return (
    <svg {...common} role="img" aria-label={`Illustration: ${milestone.title}`}>
      <circle
        cx="50"
        cy="22"
        r="12"
        fill="#CBA782"
        stroke="#9B765A"
        strokeWidth="2"
      />
      <path
        d="M50 36 V69 M50 45 L29 57 M50 45 L72 57 M50 68 L34 88 M50 68 L68 88"
        fill="none"
        stroke="#9B765A"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 92 H76"
        stroke="#D6B894"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
