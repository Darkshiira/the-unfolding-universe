"use client";

import CosmicLight from "./CosmicLight";
import ParticleTrails from "./ParticleTrails";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type UniverseSceneProps = {
  progress: React.RefObject<number>;
};

const PARTICLE_COUNT = 4000;

// Deterministic pseudo-random generator.
// Same seed always produces the same result.
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function CosmicParticles({ progress }: UniverseSceneProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, directions } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const directions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const index = i * 3;

      // Stable, reproducible directions
      const theta = seededRandom(i * 2 + 1) * Math.PI * 2;
      const z = seededRandom(i * 2 + 2) * 2 - 1;
      const radius = Math.sqrt(1 - z * z);

      directions[index] = radius * Math.cos(theta);
      directions[index + 1] = radius * Math.sin(theta);
      directions[index + 2] = z;

      positions[index] = 0;
      positions[index + 1] = 0;
      positions[index + 2] = 0;
    }

    return { positions, directions };
  }, []);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    // No particles visible before the universe begins.
    points.visible = p > 0.025;

    // Smooth expansion, beginning after the first spark.
    const particleProgress = THREE.MathUtils.clamp((p - 0.025) / 0.975, 0, 1);

    const expansion = (1 - Math.pow(1 - particleProgress, 4)) * 30;

    const attribute = points.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const index = i * 3;

      const variation = 0.65 + (i % 17) / 17;

      const distance = Math.max(0.001, expansion * variation);

      attribute.setXYZ(
        i,
        directions[index] * distance,
        directions[index + 1] * distance,
        directions[index + 2] * distance,
      );
    }

    attribute.needsUpdate = true;

    // Access camera from the frame state.
    // This avoids mutating a value returned by useThree().
    const camera = state.camera;

    const targetZ = 18 - p * 10;

    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZ,
      2,
      delta,
    );

    camera.lookAt(0, 0, 0);

    // Gentle cosmic rotation
    points.rotation.y = state.clock.elapsedTime * 0.012;

    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#fff0d5"
        size={0.055}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function SceneVisibility({ progress }: UniverseSceneProps) {
  useFrame(({ scene }) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    scene.visible = p > 0.005;
  });

  return null;
}

export default function UniverseScene({ progress }: UniverseSceneProps) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 18],
        fov: 60,
        near: 0.1,
        far: 1000,
      }}
      dpr={[1, 1.75]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      <color attach="background" args={["#000000"]} />
      <SceneVisibility progress={progress} />
      <CosmicLight progress={progress} />
      <ParticleTrails progress={progress} />
      <CosmicParticles progress={progress} />
    </Canvas>
  );
}
