"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  progress: React.RefObject<number>;
};

const PLANET_ORBITS = [3.2, 5.1, 7.2, 9.5, 13, 16, 19, 22];

const PLANET_SIZES = [0.14, 0.34, 0.55, 0.29, 1.05, 0.86, 0.57, 0.54];

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function smooth(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function planetPosition(index: number, p: number) {
  const radius = PLANET_ORBITS[index];

  const angle =
    index * 2.39996 + smooth(0.34, 0.76, p) * (0.65 / Math.sqrt(radius));

  return new THREE.Vector3(
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius,
  );
}

type Impact = {
  planet: number;
  time: number;
  direction: THREE.Vector3;
  size: number;
};

const IMPACT_COUNT = 36;
const DEBRIS_PER_IMPACT = 32;

function CollisionDebris({ progress }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const impacts = useMemo<Impact[]>(() => {
    return Array.from({ length: IMPACT_COUNT }, (_, i) => {
      const planet = i % PLANET_ORBITS.length;

      const angle = random(i * 11 + 1) * Math.PI * 2;
      const elevation = (random(i * 11 + 2) - 0.5) * 1.2;

      return {
        planet,
        time: 0.48 + random(i * 11 + 3) * 0.25,
        direction: new THREE.Vector3(
          Math.cos(angle),
          elevation,
          Math.sin(angle),
        ).normalize(),
        size: 0.5 + random(i * 11 + 4),
      };
    });
  }, []);

  const data = useMemo(() => {
    const count = IMPACT_COUNT * DEBRIS_PER_IMPACT;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    const gold = new THREE.Color("#ffb45d");
    const white = new THREE.Color("#fff3d1");

    for (let i = 0; i < count; i++) {
      const n = i * 17 + 99;

      const direction = new THREE.Vector3(
        random(n + 1) * 2 - 1,
        random(n + 2) * 2 - 1,
        random(n + 3) * 2 - 1,
      ).normalize();

      const speed = 0.2 + random(n + 4) * 1.1;

      velocities[i * 3] = direction.x * speed;
      velocities[i * 3 + 1] = direction.y * speed;
      velocities[i * 3 + 2] = direction.z * speed;

      const color = gold.clone().lerp(white, random(n + 5) * 0.8);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors, velocities };
  }, []);

  useFrame(() => {
    const points = pointsRef.current;
    const material = materialRef.current;

    if (!points || !material) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const positionAttribute = points.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    for (let i = 0; i < impacts.length; i++) {
      const impact = impacts[i];

      const center = planetPosition(impact.planet, p);

      const age = Math.max(0, p - impact.time);
      const normalizedAge = Math.min(age / 0.055, 1);

      const active = p >= impact.time && p <= impact.time + 0.055;

      const surface = center
        .clone()
        .addScaledVector(impact.direction, PLANET_SIZES[impact.planet] * 0.8);

      for (let j = 0; j < DEBRIS_PER_IMPACT; j++) {
        const index = i * DEBRIS_PER_IMPACT + j;

        const velocity = new THREE.Vector3(
          data.velocities[index * 3],
          data.velocities[index * 3 + 1],
          data.velocities[index * 3 + 2],
        );

        const distance = normalizedAge * 1.5;

        const pos = surface.clone().addScaledVector(velocity, distance);

        // Inactive fragments collapse to their
        // impact point and become extremely small.
        if (!active) {
          pos.copy(center);
        }

        positionAttribute.setXYZ(index, pos.x, pos.y, pos.z);
      }
    }

    positionAttribute.needsUpdate = true;

    // Global fade keeps the effect subtle.
    material.opacity =
      smooth(0.46, 0.52, p) * (1 - smooth(0.76, 0.83, p)) * 0.85;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
      </bufferGeometry>

      <pointsMaterial
        ref={materialRef}
        vertexColors
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ImpactFlashes({ progress }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const flashes = useMemo(
    () =>
      Array.from({ length: IMPACT_COUNT }, (_, i) => ({
        planet: i % PLANET_ORBITS.length,
        time: 0.48 + random(i * 11 + 3) * 0.25,
        angle: random(i * 11 + 1) * Math.PI * 2,
      })),
    [],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    group.children.forEach((child, i) => {
      const flash = flashes[i];
      const center = planetPosition(flash.planet, p);

      const age = p - flash.time;

      const strength =
        age >= 0 && age < 0.025 ? Math.sin((age / 0.025) * Math.PI) : 0;

      const radius = PLANET_SIZES[flash.planet];

      child.position
        .copy(center)
        .add(
          new THREE.Vector3(
            Math.cos(flash.angle) * radius,
            0.05,
            Math.sin(flash.angle) * radius,
          ),
        );

      child.scale.setScalar(Math.max(0.0001, strength * 0.35));
    });
  });

  return (
    <group ref={groupRef}>
      {flashes.map((flash, i) => (
        <mesh key={i} scale={0.0001}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial
            color="#fff3bf"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function PlanetCollisions({ progress }: Props) {
  return (
    <>
      <CollisionDebris progress={progress} />
      <ImpactFlashes progress={progress} />
    </>
  );
}
