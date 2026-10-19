"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, Minus, Plus, RotateCcw, X, ZoomIn } from "lucide-react";

import type { ArticleImage } from "../content/types";

type Props = {
  image: ArticleImage;
  priority?: boolean;
};

export default function ZoomableFigure({ image, priority = false }: Props) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragRef = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isDiagram = image.kind === "diagram";

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  function openViewer() {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setOpen(true);
  }

  function changeZoom(amount: number) {
    setZoom((current) => {
      const next = Math.min(4, Math.max(1, current + amount));

      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }

      return next;
    });
  }

  function resetZoom() {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (zoom <= 1) return;

    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      startX: position.x,
      startY: position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;

    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;

    setPosition({
      x: dragRef.current.startX + dx,
      y: dragRef.current.startY + dy,
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <>
      {/* Existing article illustration */}
      <figure className="overflow-hidden rounded-[24px] border border-[#E1D7C8] bg-[#F2E8DB]">
        <button
          ref={triggerRef}
          type="button"
          onClick={openViewer}
          aria-label={`Förstora illustration: ${image.alt}`}
          className="group relative block w-full cursor-zoom-in overflow-hidden text-left"
        >
          {isDiagram ? (
            <div className="w-full bg-[#F5F0E8]">
              <Image
                src={image.src}
                alt={image.alt}
                width={2048}
                height={768}
                priority={priority}
                sizes="(max-width: 768px) 100vw, 900px"
                className="block h-auto w-full object-contain"
              />
            </div>
          ) : (
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
              />
            </div>
          )}

          {/* Zoom hint */}
          <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/30 bg-[#17231F]/85 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-transform duration-200 group-hover:scale-105">
            <ZoomIn size={16} />
            Klicka för att förstora
          </span>
        </button>

        <figcaption className="bg-[#FFFCF6] px-5 py-4 text-xs leading-6 text-[#77766A]">
          {image.caption}
          <span className="block text-[#9A8C7B]">{image.credit}</span>
        </figcaption>
      </figure>

      {/* Fullscreen image viewer */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Förstorad illustration"
          className="fixed inset-0 z-[100] flex flex-col bg-[#0C151B]/95 backdrop-blur-lg"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          {/* Toolbar */}
          <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#101C20]/90 px-4 py-3 sm:px-8">
            <div className="flex min-w-0 items-center gap-3 text-white">
              <Maximize2 size={19} className="shrink-0 text-[#D6C19E]" />
              <span className="truncate text-sm font-medium">Illustration</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeZoom(-0.25)}
                disabled={zoom <= 1}
                aria-label="Zooma ut"
                className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-30"
              >
                <Minus size={18} />
              </button>

              <span className="min-w-12 text-center text-xs font-semibold tabular-nums text-white">
                {Math.round(zoom * 100)}%
              </span>

              <button
                type="button"
                onClick={() => changeZoom(0.25)}
                disabled={zoom >= 4}
                aria-label="Zooma in"
                className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-30"
              >
                <Plus size={18} />
              </button>

              <button
                type="button"
                onClick={resetZoom}
                aria-label="Återställ zoom"
                className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              >
                <RotateCcw size={17} />
              </button>

              <div className="mx-1 h-6 w-px bg-white/20" />

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Stäng bildvisaren"
                className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              >
                <X size={21} />
              </button>
            </div>
          </div>

          {/* Zoomable image */}
          <div
            className={`relative min-h-0 flex-1 overflow-hidden ${
              zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
            }`}
            style={{ touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={2048}
                height={1152}
                sizes="100vw"
                className="max-h-full w-auto max-w-full select-none object-contain"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom caption */}
          <div className="shrink-0 border-t border-white/10 bg-[#101C20]/90 px-5 py-3 text-center">
            <p className="mx-auto max-w-4xl text-xs leading-6 text-[#D7D2C6]">
              {image.caption}
            </p>
            <p className="mt-1 text-[11px] text-[#9EA7A1]">
              {zoom > 1
                ? "Dra bilden för att utforska detaljerna."
                : "Använd + för att zooma in på detaljerna."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
