"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  NotebookPen,
  Sparkles,
  X,
} from "lucide-react";
import {
  cases,
  specimens,
  DETECTIVE_PROGRESS_EVENT,
  type Answer,
  type CellId,
  type Mode,
} from "@/app/museum/cell-explorer/celldetektiverna/DetectiveCases";

import {
  readDetectiveProgress,
  updateDetectiveProgress,
} from "@/app/museum/cell-explorer/celldetektiverna/DetectiveProgress";

type Props = {
  caseId: string;
  mode: Mode;
  selectedCell: CellId;
  returnHref: string;
};
const plainLanguage: Record<string, string> = {
  nucleus:
    "En cellkärna är ett rum inne i cellen, omgivet av ett membran. Där finns det mesta av cellens DNA.",
  wall: "En cellvägg är ett stadigt lager utanför cellmembranet. Alla celler har inte en cellvägg. Ett S-lager är ett annat slags skydd.",
  chloroplast:
    "Kloroplaster är gröna delar som fångar ljus och hjälper växter att tillverka socker.",
  ribosome:
    "Ribosomer är pyttesmå proteinbyggare. De finns i alla fyra cellerna, men kan vara svåra att se.",
  mitochondria:
    "Mitokondrier hjälper cellen att frigöra användbar energi ur näringsämnen.",
  dna: "DNA är cellens instruktioner. Det kan finnas i celler både med och utan cellkärna.",
};

export default function DetectiveFieldNotebook({
  caseId,
  mode,
  selectedCell,
  returnHref,
}: Props) {
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [answers, setAnswers] = useState<Answer>({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [newEvidence, setNewEvidence] = useState(false);
  // Position is kept while switching specimens (the museum component stays mounted).
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function clampPosition(x: number, y: number) {
    const width = buttonRef.current?.offsetWidth ?? 44;
    const height = buttonRef.current?.offsetHeight ?? 44;
    const bottomReserve =
      window.innerWidth <= 900 && window.innerHeight < window.innerWidth
        ? 66
        : 96;
    return {
      x: Math.max(8, Math.min(x, window.innerWidth - width - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - height - bottomReserve)),
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: rect.left,
      y: rect.top,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    setDragging(true);
    setPosition(clampPosition(drag.x + dx, drag.y + dy));
  }
  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) suppressClickRef.current = true;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }
  useEffect(() => {
    const onResize = () =>
      setPosition((old) => (old ? clampPosition(old.x, old.y) : null));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const current = useMemo(
    () => cases.find((c) => c.id === caseId) ?? cases[0],
    [caseId],
  );
  const checked = answers[current.id] || [];
  const locked = revealed.includes(current.id);
  const load = useCallback(() => {
    const saved = readDetectiveProgress();
    setAnswers(saved.answers);
    setRevealed(saved.revealed);
  }, []);
  useEffect(() => {
    // Defer to keep React's set-state-in-effect rule satisfied.
    let active = true;
    Promise.resolve().then(() => {
      if (active) load();
    });
    window.addEventListener("storage", load);
    window.addEventListener(DETECTIVE_PROGRESS_EVENT, load);
    return () => {
      active = false;
      window.removeEventListener("storage", load);
      window.removeEventListener(DETECTIVE_PROGRESS_EVENT, load);
    };
  }, [load]);
  function toggle(cell: CellId) {
    if (locked) return;
    const saved = readDetectiveProgress();
    if (saved.revealed.includes(current.id)) return;
    const existing = saved.answers[current.id] || [];
    const next = existing.includes(cell)
      ? existing.filter((id) => id !== cell)
      : [...existing, cell];
    const nextAnswers = { ...saved.answers, [current.id]: next };
    setAnswers(nextAnswers);
    setRevealed(saved.revealed);
    updateDetectiveProgress({ answers: nextAnswers, revealed: saved.revealed });
    setNewEvidence(true);
  }
  return (
    <>
      <div
        className={`pointer-events-none fixed z-[75] ${position ? "" : "right-3 bottom-[105px] max-[900px]:landscape:bottom-[70px]"}`}
        style={position ? { left: position.x, top: position.y } : undefined}
      >
        <style>{`
        @keyframes detectiveGlow { 0%,100%{box-shadow:0 0 0 1px #e6b95b66,0 0 12px #d5a64e55,0 0 24px #e8bc4030} 50%{box-shadow:0 0 0 2px #f8d58caa,0 0 24px #f3c968aa,0 0 42px #e8bc4055} }
        @keyframes detectiveSpark { 0%{opacity:0;transform:translate(0,8px) scale(.5)} 30%{opacity:1} 100%{opacity:0;transform:translate(9px,-17px) scale(1.3)} }
        .detective-glow{animation:detectiveGlow 2.8s ease-in-out infinite}
        .detective-spark{animation:detectiveSpark 1.1s ease-out both}
        @media(prefers-reduced-motion:reduce){.detective-glow,.detective-spark{animation:none!important}}
      `}</style>
        <div className="pointer-events-auto relative inline-flex items-center gap-2">
          <button
            ref={buttonRef}
            type="button"
            aria-label={
              open
                ? "Stäng detektivboken (dra för att flytta)"
                : "Öppna detektivboken (dra för att flytta)"
            }
            aria-expanded={open}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={() => {
              if (suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
              }
              setOpen((value) => !value);
              setNewEvidence(false);
            }}
            style={{
              touchAction: "none",
              cursor: dragging ? "grabbing" : "grab",
            }}
            className={`${!open ? "detective-glow" : ""} relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200/70 bg-[#3d2b1d]/95 text-[#f5d797] shadow-lg backdrop-blur-md transition hover:bg-[#60452c]`}
          >
            <NotebookPen size={21} />
            {newEvidence && (
              <Sparkles
                size={14}
                className="detective-spark absolute -right-2 -top-2 text-amber-200"
              />
            )}
          </button>
          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-[#cba56c]/50 bg-[#142832]/90 px-3 py-2 text-[11px] font-bold text-[#f7e2b7] shadow-lg backdrop-blur-md max-[700px]:hidden"
            >
              Ditt uppdrag
            </button>
          )}
        </div>
      </div>
      {open && (
        <section
          aria-label="Detektivens fältbok"
          className="detective-field-panel pointer-events-auto fixed z-[90] right-[76px] top-1/2 w-[min(355px,calc(100vw-24px))] max-h-[min(590px,calc(100dvh-110px))] -translate-y-1/2 overflow-y-auto overscroll-contain rounded-xl border-2 border-[#b79562] bg-[#e9d7b2] p-4 text-[#30291f] shadow-[0_20px_50px_rgba(0,0,0,.65)] max-[700px]:!left-3 max-[700px]:!right-3 max-[700px]:!top-auto max-[700px]:!bottom-[90px] max-[700px]:!w-auto max-[700px]:!translate-y-0 max-[700px]:!max-h-[calc(100dvh-110px)] max-[900px]:landscape:!left-3 max-[900px]:landscape:!right-3 max-[900px]:landscape:!top-2 max-[900px]:landscape:!bottom-[65px] max-[900px]:landscape:!w-auto max-[900px]:landscape:!max-h-[calc(100dvh-73px)] max-[900px]:landscape:!translate-y-0 sm:p-5"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[#927b59]/40 pb-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.15em] text-[#8a6540]">
                Detektivens fältbok · Fall{" "}
                {String(cases.indexOf(current) + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold leading-tight">
                {current.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Stäng fältboken"
              className="rounded-full border border-[#b29b77] p-1.5"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold leading-relaxed">
            {current.question}
          </p>
          <div className="mt-3 rounded-md border-l-4 border-[#aa854d] bg-[#f7e8c8] p-3 text-xs leading-relaxed">
            <strong className="flex items-center gap-1">
              <Lightbulb size={15} /> Leta efter:
            </strong>
            <span className="mt-1 block">{current.hint}</span>
          </div>
          <button
            type="button"
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen((v) => !v)}
            className="mt-3 flex w-full items-center justify-between gap-2 rounded-md border border-[#b39b72] bg-[#f5e6c5] px-3 py-2 text-left text-xs font-bold"
          >
            <span>Svårt ord? Förklara enkelt</span>
            {helpOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {helpOpen && (
            <p className="rounded-b-md bg-[#f9edda] p-3 text-xs leading-relaxed">
              {plainLanguage[current.id]}
            </p>
          )}
          <p className="mt-4 text-xs font-black uppercase tracking-[.12em]">
            Mina misstankar
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#6d5a41]">
            Kryssa för de celler du tror passar. Du kan ändra dig innan du
            granskar bevisen.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {specimens.map((cell) => (
              <label
                key={cell.id}
                className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-2 py-2 text-xs font-semibold ${checked.includes(cell.id) ? "border-[#46775c] bg-[#c5e2c9]" : "border-[#a78c68] bg-[#f7e7c6]"}`}
              >
                <input
                  type="checkbox"
                  checked={checked.includes(cell.id)}
                  disabled={locked}
                  onChange={() => toggle(cell.id)}
                  className="accent-[#34634b]"
                />
                {cell.name}
                {cell.id === selectedCell && (
                  <span className="ml-auto text-[9px] text-[#6c593e]">Här</span>
                )}
              </label>
            ))}
          </div>
          {locked && (
            <p className="mt-2 text-xs text-[#77593b]">
              Det här fallet är granskat. Öppna detektivboken för att se
              resultatet.
            </p>
          )}
          <Link
            href={returnHref}
            className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[#244d40] px-3 py-3 text-xs font-bold text-[#f5ebd5] transition hover:bg-[#346b58]"
          >
            <ArrowLeft size={15} /> Tillbaka till utredningen{" "}
            <BookOpenCheck size={15} />
          </Link>
          <p className="mt-2 text-center text-[10px] text-[#705c43]">
            Dina kryss sparas automatiskt ·{" "}
            {mode === "free" ? "Fri undersökning" : "Guidad utredning"}
          </p>
        </section>
      )}
    </>
  );
}
