"use client";

import { useEffect, useState } from "react";
import CellMuseumIntro from "./CellMuseumIntro";
import CellScene from "./CellScene";
import PlantCellScene from "./PlantCellScene";
import CellSlideSelector, {
  CELL_SPECIMENS,
  type CellKind,
} from "./CellSlideSelector";

export default function CellMuseumExperience() {
  const [entered, setEntered] = useState(false);
  const [welcomeOnPlant, setWelcomeOnPlant] = useState(false);
  const [showIntroHint, setShowIntroHint] = useState(false);
  const [selectedCell, setSelectedCell] = useState<CellKind>("animal");
  useEffect(() => {
    if (!showIntroHint) return;
    const t = window.setTimeout(() => setShowIntroHint(false), 4400);
    return () => window.clearTimeout(t);
  }, [showIntroHint]);
  const selected = CELL_SPECIMENS.find((cell) => cell.id === selectedCell)!;

  if (!entered) {
    return (
      <CellMuseumIntro
        onEnter={() => {
          setEntered(true);
          setWelcomeOnPlant(true);
          setShowIntroHint(true);
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      />
    );
  }

  return (
    <div className="relative h-svh min-h-0 w-full overflow-hidden bg-[#081522]">
      {/* Preserve the existing animal cell without modifying its complex animations. */}
      {selectedCell === "animal" ? (
        <div className="h-full w-full pb-[76px] sm:pb-[88px] max-[900px]:landscape:pb-[58px]">
          <CellScene />
        </div>
      ) : selectedCell === "plant" ? (
        <div className="h-full w-full pb-[76px] sm:pb-[88px] max-[900px]:landscape:pb-[58px]">
          <PlantCellScene showWelcome={welcomeOnPlant} />
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-6 pb-24 text-center">
          <span className="mb-3 text-[10px] uppercase tracking-[.3em] text-[#91aebb]">
            Specimen {selected.number}
          </span>
          <h2 className="text-3xl font-semibold text-[#edf3f5]">
            {selected.label}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#a8bdc8]">
            Den interaktiva 3D-modellen för den här cellen kommer snart. Välj
            Djurcell för att utforska den färdiga modellen.
          </p>
        </div>
      )}

      {selectedCell === "animal" && showIntroHint && (
        <div
          className="pointer-events-none absolute inset-x-0 top-[43%] z-20 flex justify-center px-4"
          aria-live="polite"
        >
          <div className="museum-hint rounded-2xl border border-[#a8c7d1]/25 bg-[#0c2633]/80 px-5 py-4 text-center shadow-xl backdrop-blur-md">
            <p className="text-xs font-medium text-[#e2edf1]">
              Dra för att rotera · Zooma för att utforska
            </p>
            <p className="mt-1 text-[11px] text-[#d8c08a]">
              Tryck på en del av cellen för att lära dig mer
            </p>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes museumHint {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          12%,
          75% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-5px);
          }
        }
        .museum-hint {
          animation: museumHint 4.4s ease-in-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .museum-hint {
            animation: none;
          }
        }
      `}</style>
      {/* Floating navigation; intentionally no large background panel. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] px-2 pb-[max(8px,env(safe-area-inset-bottom))] sm:px-5 sm:pb-4 max-[900px]:landscape:pb-1">
        <CellSlideSelector value={selectedCell} onChange={setSelectedCell} />
      </div>
    </div>
  );
}
