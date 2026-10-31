"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/** Shared anatomical model for plant and animal cells. */
export default function SharedNucleus({
  position = [0, 0, 0],
  scale = 1,
  selected = false,
  showInside = false,
  motion = true,
  onSelect,
}: {
  position?: [number, number, number];
  scale?: number;
  selected?: boolean;
  showInside?: boolean;
  motion?: boolean;
  onSelect?: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(0);
  useFrame((_, delta) => {
    if (motion) phase.current += Math.min(delta, 0.05);
    if (ref.current) {
      ref.current.rotation.y = Math.sin(phase.current * 0.22) * 0.1;
      ref.current.rotation.z = Math.sin(phase.current * 0.13) * 0.015;
    }
  });
  // Deterministic, irregular distributions: natural-looking but stable across renders.
  const random = (seed: number) => {
    const n = Math.sin(seed * 127.1 + 78.233) * 43758.5453;
    return n - Math.floor(n);
  };
  const pores = useMemo(
    () =>
      Array.from({ length: 76 }, (_, i) => {
        const y = Math.max(
          -0.985,
          Math.min(
            0.985,
            1 - (2 * (i + 0.5)) / 76 + (random(i + 71) - 0.5) * 0.095,
          ),
        );
        const a = i * 2.399963229728653 + (random(i + 121) - 0.5) * 0.36;
        const r = Math.sqrt(1 - y * y);
        const position = new THREE.Vector3(
          0.748 * r * Math.cos(a),
          0.703 * y,
          0.719 * r * Math.sin(a),
        );
        const normal = new THREE.Vector3(
          position.x / 0.748 ** 2,
          position.y / 0.703 ** 2,
          position.z / 0.719 ** 2,
        ).normalize();
        return {
          position: position.toArray() as [number, number, number],
          quaternion: new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            normal,
          ),
          size: 0.012 + random(i + 191) * 0.005,
        };
      }),
    [],
  );
  const strands = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const a = i * 2.399963 + random(i + 41) * 1.2;
        const radius = 0.12 + Math.sqrt(random(i + 11)) * 0.4;
        const center = new THREE.Vector3(
          radius * Math.cos(a),
          (random(i + 29) - 0.5) * 0.9,
          radius * Math.sin(a),
        );
        const direction = new THREE.Vector3(
          random(i + 51) - 0.5,
          random(i + 61) - 0.5,
          random(i + 81) - 0.5,
        ).normalize();
        const length = 0.15 + random(i + 17) * 0.28;
        const points = Array.from({ length: 18 }, (_, j) => {
          const t = j / 17 - 0.5;
          const wiggle = t * Math.PI * (2.5 + random(i + 23) * 3.5);
          const point = center.clone().addScaledVector(direction, t * length);
          point.x += Math.sin(wiggle + a) * (0.025 + random(i + 33) * 0.024);
          point.y += Math.cos(wiggle * 0.79 + a) * 0.027;
          point.z += Math.sin(wiggle * 1.19 + i) * 0.035;
          const normalized = Math.sqrt(
            (point.x / 0.61) ** 2 +
              (point.y / 0.57) ** 2 +
              (point.z / 0.58) ** 2,
          );
          if (normalized > 1) point.multiplyScalar(1 / normalized);
          return point;
        });
        return new THREE.CatmullRomCurve3(points);
      }),
    [],
  );
  const inside = selected && showInside;
  return (
    <group ref={ref} position={position} scale={scale * (selected ? 1.035 : 1)}>
      {/* Outer and inner nuclear envelope; intentionally translucent for museum viewing. */}
      <mesh
        scale={[0.76, 0.715, 0.73]}
        onClick={
          onSelect
            ? (e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onSelect();
              }
            : undefined
        }
      >
        <sphereGeometry args={[1, 48, 36]} />
        <meshPhysicalMaterial
          color="#a88bca"
          transparent
          opacity={inside ? 0.095 : 0.67}
          depthWrite={false}
          roughness={0.35}
          emissive="#9168c2"
          emissiveIntensity={selected ? 0.24 : 0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh scale={[0.735, 0.69, 0.704]} raycast={() => null}>
        <sphereGeometry args={[1, 40, 30]} />
        <meshPhysicalMaterial
          color="#76569d"
          transparent
          opacity={inside ? 0.055 : 0.13}
          depthWrite={false}
          roughness={0.65}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Nuclear pore complexes, distributed across the envelope. */}
      {pores.map((pore, i) => (
        <mesh
          key={`pore-${i}`}
          position={pore.position}
          quaternion={pore.quaternion}
          raycast={() => null}
        >
          <torusGeometry args={[pore.size, 0.0035, 6, 12]} />
          <meshStandardMaterial
            color="#e1c5f0"
            transparent
            opacity={inside ? 0.72 : 0.36}
            roughness={0.65}
          />
        </mesh>
      ))}
      {/* Chromatin: loosely arranged DNA-protein fibres, not condensed chromosomes. */}
      {strands.map((curve, i) => (
        <mesh key={`strand-${i}`} raycast={() => null}>
          <tubeGeometry
            args={[curve, 16, 0.004 + (i % 3) * 0.0013, 5, false]}
          />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#f2c9ef" : "#c6a2de"}
            transparent
            opacity={inside ? 0.8 : 0.3}
            depthWrite={false}
            roughness={0.85}
          />
        </mesh>
      ))}
      {/* Dense nucleolus, located inside the nucleus. */}
      <mesh position={[0.13, 0.085, 0.24]} raycast={() => null}>
        <sphereGeometry args={[0.19, 32, 24]} />
        <meshStandardMaterial
          color="#d4a4e2"
          roughness={0.78}
          emissive="#8e4baf"
          emissiveIntensity={inside ? 0.22 : 0.07}
        />
      </mesh>
      {Array.from({ length: 32 }, (_, i) => {
        const y = 1 - (2 * (i + 0.5)) / 32;
        const a = i * 2.399963;
        const r = Math.sqrt(1 - y * y);
        return (
          <mesh
            key={`nucleolus-grain-${i}`}
            position={[
              0.13 + 0.19 * r * Math.cos(a),
              0.085 + 0.19 * y,
              0.24 + 0.19 * r * Math.sin(a),
            ]}
            raycast={() => null}
          >
            <sphereGeometry args={[0.009, 6, 6]} />
            <meshBasicMaterial color="#f1d4f2" />
          </mesh>
        );
      })}
    </group>
  );
}
