
import type { Metadata } from "next";
import WaterCycleExplorer from "@/components/museum/water-cycle/WaterCycleExplorer";

export const metadata: Metadata = {
  title: "Vattnets kretslopp | The Unfolding Universe",
  description:
    "Utforska vattnets kretslopp i ett interaktivt landskap. Upptäck avdunstning, moln, nederbörd, grundvatten och vattnets väg genom naturen.",
};

export default function WaterCyclePage() {
  return <WaterCycleExplorer />;
}
