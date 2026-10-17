"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type ParticleTrailsProps = {
  progress: React.RefObject<number>;
};

const TRAIL_COUNT = 1400;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function ParticleTrails({ progress }: ParticleTrailsProps) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, directions } = useMemo(() => {
    const positions = new Float32Array(TRAIL_COUNT * 2 * 3);

    const directions = new Float32Array(TRAIL_COUNT * 3);

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const theta = seededRandom(i * 3 + 1) * Math.PI * 2;

      const z = seededRandom(i * 3 + 2) * 2 - 1;

      const r = Math.sqrt(1 - z * z);

      directions[i * 3] = r * Math.cos(theta);
      directions[i * 3 + 1] = r * Math.sin(theta);
      directions[i * 3 + 2] = z;
    }

    return { positions, directions };
  }, []);

  useFrame(() => {
    const lines = linesRef.current;
    if (!lines) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    const expansion = (1 - Math.pow(1 - p, 4)) * 30;

    // Trails are strongest just after ignition
    const strength = Math.sin(Math.min(p * Math.PI, Math.PI));

    const trailLength = 0.1 + strength * 1.5;

    const attribute = lines.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const d = i * 3;
    //   const v = i * 6;

      const variation = 0.65 + (i % 17) / 17;

      const distance = expansion * variation;

      const x = directions[d];
      const y = directions[d + 1];
      const z = directions[d + 2];

      attribute.setXYZ(i * 2, x * distance, y * distance, z * distance);

      attribute.setXYZ(
        i * 2 + 1,
        x * (distance - trailLength),
        y * (distance - trailLength),
        z * (distance - trailLength),
      );
    }

    attribute.needsUpdate = true;

    const material = lines.material as THREE.LineBasicMaterial;

    material.opacity = Math.max(0, strength * 0.35);
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <lineBasicMaterial
        color="#ffd6a0"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
