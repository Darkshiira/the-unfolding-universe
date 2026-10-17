"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Galaxy from "./Galaxy";
import DeepSpaceBackground from "./DeepSpaceBackground";

type SceneProps = {
  progress: React.RefObject<number>;
};

function GalaxyCamera({ progress }: SceneProps) {
  useFrame((state) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    // Reversible camera motion tied to scroll
    state.camera.position.z = 35 - p * 16;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function GalaxiesScene({ progress }: SceneProps) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 35],
        fov: 60,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#010207"]} />

      <DeepSpaceBackground progress={progress} />
      <GalaxyCamera progress={progress} />

      <Galaxy
        type="spiral"
        position={[-11, 5, -15]}
        rotation={[0.55, 0.3, 0.2]}
        scale={0.85}
        seed={10}
        count={8500}
        progress={progress}
      />

      <Galaxy
        type="elliptical"
        position={[11, 4, -22]}
        rotation={[0.3, 0.1, -0.2]}
        scale={0.8}
        seed={20}
        count={6500}
        progress={progress}
      />

      <Galaxy
        type="irregular"
        position={[-8, -7, -20]}
        scale={0.65}
        seed={30}
        count={5000}
        progress={progress}
      />

      <Galaxy
        type="spiral"
        position={[10, -7, -28]}
        rotation={[0.9, 0, -0.5]}
        scale={0.6}
        seed={40}
        count={7000}
        progress={progress}
      />

      {/* Milky Way-inspired barred spiral galaxy */}
      <Galaxy
        type="spiral"
        barred
        position={[0, 0, -12]}
        rotation={[0.65, 0.15, -0.2]}
        scale={1.5}
        seed={50}
        count={24000}
        progress={progress}
      />
    </Canvas>
  );
}
