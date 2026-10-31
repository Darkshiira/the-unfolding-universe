"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Tags,
  X,
} from "lucide-react";
import { useState } from "react";
import type { PhotosynthesisStage } from "./PhotosynthesisChloroplast";

export const photosynthesisStages = [
  {
    label: "Solljus",
    heading: "1. Ljuset fångas",
    description:
      "Solljuset träffar de gröna skivorna i kloroplasten. Växten fångar upp ljusets energi – ungefär som en liten solfångare!",
    detail:
      "De gröna skivorna kallas tylakoider. I deras membran finns klorofyll som absorberar ljus och startar ljusreaktionerna.",
    watch:
      "Följ de tunna ljusstrålarna. När de träffar skivorna fångas ljusets energi upp.",
  },
  {
    label: "Vatten",
    heading: "2. Vatten blir till syre",
    description:
      "Samtidigt som ljuset fångas upp spjälkas vatten i ljusreaktionerna. Växten tar upp vatten med rötterna. Inne i kloroplasten används vatten i en reaktion som bildar syre. Syret kan sedan lämna växten och hamna i luften vi andas.",
    detail:
      "Ljusabsorptionen och vattenspjälkningen hör ihop och pågår under samma ljusreaktioner – de är inte två separata steg efter varandra. Vid fotosystem II spjälkas vatten. Då frigörs elektroner, vätejoner och syrgas (O₂).",
    watch:
      "Följ etiketten Vatten (H₂O). Se sedan Syre (O₂) bildas och röra sig bort.",
  },
  {
    label: "Energi",
    heading: "3. Energin förs vidare",
    description:
      "Växten omvandlar ljusets energi till två små energibärare. De behövs i nästa steg, när växten ska bygga socker.",
    detail:
      "Energibärarna heter ATP och NADPH. De bildas genom reaktioner i och vid tylakoidmembranet.",
    watch:
      "Följ ATP och NADPH när de förs vidare till nästa del av fotosyntesen.",
  },
  {
    label: "Socker",
    heading: "4. Växten bygger socker",
    description:
      "Nu möts koldioxid (CO₂) från luften och energibärarna ATP och NADPH från de tidigare stegen. Med deras hjälp bygger växten ämnen som kan bli socker! Syret som bildades tidigare lämnar däremot växten – det används inte för att bygga sockret.",
    detail:
      "I Calvincykeln används ATP och NADPH från ljusreaktionerna för att binda koldioxid. Bland produkterna finns G3P, som kan bli olika sockerarter. Syrgas (O₂) frigörs separat när vatten spjälkas i ljusreaktionerna; den är inte en ingrediens i sockret.",
    watch:
      "Följ CO₂ uppifrån och ATP + NADPH från sidan mot sockrets byggstenar. Se O₂ lämna växten åt andra hållet!",
  },
] as const;

export default function PhotosynthesisControls({
  stage,
  onStageChange,
  paused,
  onPauseChange,
  showLabels,
  onShowLabelsChange,
  onClose,
}: {
  stage: PhotosynthesisStage;
  onStageChange: (stage: PhotosynthesisStage) => void;
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  onClose: () => void;
}) {
  const item = photosynthesisStages[stage];
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className={`photo-controls ${collapsed ? "is-collapsed" : ""} rounded-2xl border border-emerald-200/20 bg-[#09251f]/90 p-3 text-[#edf8ee] shadow-2xl backdrop-blur-xl sm:p-4`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[.18em] text-emerald-200/70">
            Fotosyntesen · Vy {stage + 1} av 4
          </p>
          <h2 className="mt-1 font-serif text-lg sm:text-xl">{item.heading}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            aria-label={
              collapsed
                ? "Fäll upp informationspanelen"
                : "Fäll ned informationspanelen"
            }
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-white/15 p-2 hover:bg-white/10"
          >
            {collapsed ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng fotosyntesen"
            className="rounded-full border border-white/15 p-2 hover:bg-white/10"
          >
            <X size={17} />
          </button>
        </div>
      </div>
      {!collapsed && (
        <>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {photosynthesisStages.map((s, i) => (
              <button
                type="button"
                key={s.label}
                onClick={() => onStageChange(i as PhotosynthesisStage)}
                aria-pressed={stage === i}
                className={`min-h-10 rounded-lg border px-1 py-1.5 text-[10px] leading-tight sm:text-xs ${stage === i ? "border-amber-300/60 bg-amber-200/15 text-amber-100" : "border-white/10 bg-white/5 text-emerald-100/75 hover:bg-white/10"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-4 text-emerald-200/85">
            ☀️ Hela processen kallas{" "}
            <strong className="text-emerald-100">fotosyntes</strong> – växtens
            sätt att använda ljus för att bygga socker.
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[10px] leading-4 text-emerald-200/70">
              Solljus och vattenspjälkning sker samtidigt.
            </span>
            <button
              type="button"
              aria-pressed={showLabels}
              onClick={() => onShowLabelsChange(!showLabels)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] transition-colors ${showLabels ? "border-emerald-200/50 bg-emerald-200/15 text-emerald-100" : "border-white/15 bg-white/5 text-emerald-100/80 hover:bg-white/10"}`}
            >
              <Tags size={13} />
              {showLabels ? "Dölj etiketter" : "Visa etiketter"}
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#e1f4e6]">
            {item.description}
          </p>
          <p className="mt-2 text-[11px] leading-4 text-amber-100/85">
            👀 {item.watch}
          </p>
          <details
            key={stage}
            className="mt-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-[#d2e5d8]"
          >
            <summary className="cursor-pointer select-none font-medium text-emerald-100">
              Vill du veta mer?
            </summary>
            <p className="mt-2 leading-5">{item.detail}</p>
          </details>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => onPauseChange(!paused)}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-xs hover:bg-white/10"
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}{" "}
              {paused ? "Fortsätt" : "Pausa"}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={stage === 0}
                onClick={() =>
                  onStageChange((stage - 1) as PhotosynthesisStage)
                }
                className="rounded-full border border-white/20 p-2 disabled:opacity-30"
                aria-label="Föregående steg"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() =>
                  onStageChange(((stage + 1) % 4) as PhotosynthesisStage)
                }
                className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-950"
              >
                {stage === 3 ? "Börja om" : "Nästa"}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-emerald-200/50">
            Varje animation tar cirka 12 sekunder och upprepas. De två första
            vyerna visar samtidiga delar av ljusreaktionerna. Tryck Nästa när du
            själv är redo. Förenklad modell – inte en exakt kemisk reaktion.
          </p>
        </>
      )}
    </div>
  );
}
