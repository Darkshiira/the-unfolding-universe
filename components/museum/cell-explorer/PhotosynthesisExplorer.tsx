"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Canvas, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import PhotosynthesisChloroplast, {
  type PhotosynthesisStage,
} from "./PhotosynthesisChloroplast";
import PhotosynthesisControls from "./PhotosynthesisControls";

function ResponsiveCamera({ portrait }: { portrait: boolean }) {
  const set = useThree((state) => state.set);

  useEffect(() => {
    set((state) => {
      const camera = state.camera.clone();
      camera.position.z = portrait ? 15.5 : 9;
      camera.updateProjectionMatrix();
      return { camera };
    });
  }, [portrait, set]);

  return null;
}

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function PhotosynthesisExplorer({
  onClose,
}: {
  onClose: () => void;
}) {
  const portalReady = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [stage, setStage] = useState<PhotosynthesisStage>(0);
  const [paused, setPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isPortraitPhone, setIsPortraitPhone] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(max-width: 600px) and (orientation: portrait)",
    );
    const update = () => setIsPortraitPhone(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight")
        setStage((s) => ((s + 1) % 4) as PhotosynthesisStage);
      if (event.key === "ArrowLeft")
        setStage((s) => Math.max(0, s - 1) as PhotosynthesisStage);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!portalReady) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Följ solljuset – fotosyntesen"
      className={`photo-explorer fixed inset-0 z-[9999] h-[100dvh] w-[100vw] overflow-hidden bg-[#041710] text-white transition-opacity duration-700 ${entered ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0 h-full w-full">
        <Canvas
          style={{ width: "100%", height: "100%", display: "block" }}
          camera={{
            position: [0, 0, isPortraitPhone ? 15.5 : 9],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <ResponsiveCamera portrait={isPortraitPhone} />
          <color attach="background" args={["#041710"]} />
          <ambientLight intensity={2.0} />
          <directionalLight
            position={[3, 5, 8]}
            intensity={2.3}
            color="#d9f8d4"
          />
          <pointLight
            position={[-4, 2, 3]}
            intensity={35}
            distance={13}
            color="#72dfac"
          />
          <Stars
            radius={60}
            depth={30}
            count={190}
            factor={1}
            saturation={0}
            fade
            speed={0.08}
          />
          <PhotosynthesisChloroplast
            stage={stage}
            paused={paused}
            showLabels={showLabels}
          />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute left-4 top-5 z-10 sm:left-7 sm:top-7">
        <p className="text-[9px] uppercase tracking-[.2em] text-amber-200/80 sm:text-[10px]">
          The Unfolding Universe · Museum
        </p>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl">
          Inuti kloroplasten
        </h1>
        <p className="mt-1 max-w-[260px] text-xs text-emerald-100/80 sm:max-w-none sm:text-sm">
          Följ solljuset – upptäck fotosyntesen
        </p>
      </div>

      <div className="photo-controls-wrap pointer-events-auto absolute bottom-3 left-3 right-3 z-20 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[min(390px,40vw)]">
        <PhotosynthesisControls
          stage={stage}
          onStageChange={setStage}
          paused={paused}
          onPauseChange={setPaused}
          showLabels={showLabels}
          onShowLabelsChange={setShowLabels}
          onClose={onClose}
        />
      </div>

      <style jsx>{`
        @media (max-width: 900px) and (orientation: landscape) {
          .photo-controls-wrap {
            top: auto;
            bottom: 8px;
            left: auto;
            right: 8px;
            width: min(52vw, 410px);
            display: flex;
            align-items: flex-end;
          }
          .photo-controls-wrap :global(.photo-controls) {
            width: 100%;
            max-height: calc(100dvh - 16px);
            overflow-y: auto;
            padding: 10px;
          }
          .photo-controls-wrap :global(.photo-controls.is-collapsed) {
            max-height: none;
            overflow: visible;
          }
        }
        @media (max-width: 600px) and (orientation: portrait) {
          .photo-controls-wrap :global(.photo-controls) {
            max-height: min(55dvh, 480px);
            overflow-y: auto;
          }
          .photo-controls-wrap :global(.photo-controls.is-collapsed) {
            max-height: none;
            overflow: visible;
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}
