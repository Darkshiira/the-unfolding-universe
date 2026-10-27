"use client";

import { useState } from "react";
import CellMuseumIntro from "./CellMuseumIntro";
import CellScene from "./CellScene";

export default function CellMuseumExperience() {
  const [entered, setEntered] = useState(false);

  return entered ? (
    <div className="h-svh min-h-[500px] w-full">
      <CellScene />
    </div>
  ) : (
    <CellMuseumIntro
      onEnter={() => {
        setEntered(true);
        // The introduction is several viewport heights tall.
        // Reset the page scroll when entering the interactive exhibit.
        window.scrollTo({ top: 0, behavior: "instant" });
      }}
    />
  );
}
