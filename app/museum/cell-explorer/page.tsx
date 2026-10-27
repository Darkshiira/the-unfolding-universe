import type { Metadata } from "next";

import CellMuseumExperience from "@/components/museum/cell-explorer/CellMuseumExperience";

export const metadata: Metadata = {
  title: "Cell Explorer – Livets osynliga värld",
  description:
    "Utforska en levande 3D-cell. Upptäck cellens delar och lär dig hur livet fungerar på mikroskopisk nivå.",
};

export default function CellExplorerPage() {
  return (
    <main className="relative min-h-svh bg-[#081522]">
      <CellMuseumExperience />
    </main>
  );
}
