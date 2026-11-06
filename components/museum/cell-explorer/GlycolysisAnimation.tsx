"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { paused: boolean; fuel: number };

// An intentionally simplified visual metaphor for glycolysis:
// one 6-carbon glucose -> two 3-carbon pyruvate molecules + net 2 ATP.
// Glycolysis takes place in the cytoplasm, outside the mitochondrion.
export default function GlycolysisAnimation({ paused, fuel }: Props) {
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);
  const glucose = useRef<THREE.Group>(null);
  const pyruvateA = useRef<THREE.Group>(null);
  const pyruvateB = useRef<THREE.Group>(null);
  const atpA = useRef<THREE.Group>(null);
  const atpB = useRef<THREE.Group>(null);

  const glucosePoints = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return [Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0] as const;
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!paused && fuel > 0)
      time.current += Math.min(delta, 0.05) * (0.38 + (0.62 * fuel) / 100);
    const cycle = time.current % 7.5;
    const split = THREE.MathUtils.smoothstep(cycle, 2.0, 3.5);
    const release = THREE.MathUtils.smoothstep(cycle, 3.0, 4.8);
    const fade = 1 - THREE.MathUtils.smoothstep(cycle, 6.2, 7.4);
    const fuelScale = fuel > 0 ? 1 : 0.2;

    if (glucose.current) {
      glucose.current.position.set(-0.65 + split * 0.35, 0.24, 0);
      glucose.current.scale.setScalar(Math.max(0.001, (1 - split) * fuelScale));
      glucose.current.rotation.z = time.current * 0.14;
    }
    for (const [index, ref] of [pyruvateA, pyruvateB].entries()) {
      if (!ref.current) continue;
      ref.current.visible = fuel > 0 && split > 0.01;
      const sign = index === 0 ? 1 : -1;
      ref.current.position.set(
        -0.12 + release * (0.42 + index * 0.2),
        0.24 + sign * (0.12 + release * 0.42),
        0,
      );
      ref.current.scale.setScalar(Math.max(0.001, split * fade));
      ref.current.rotation.z = sign * (0.3 + time.current * 0.08);
    }
    for (const [index, ref] of [atpA, atpB].entries()) {
      if (!ref.current) continue;
      ref.current.visible = fuel > 0 && release > 0.01;
      ref.current.position.set(
        -0.15 + release * (0.58 + index * 0.32),
        -0.28 - index * 0.27 + 0.05 * Math.sin(time.current * 2 + index),
        0.15,
      );
      ref.current.scale.setScalar(
        Math.max(
          0.001,
          release * fade * (0.88 + 0.08 * Math.sin(time.current * 3 + index)),
        ),
      );
    }
    if (group.current) group.current.visible = true;
  });

  const carbon = "#303941";
  const bond = "#c3d3ce";

  return (
    <group ref={group} position={[-2.85, 0.85, 1.75]} scale={0.88}>
      {/* Glucose: 6 linked carbon markers. This is symbolic, not an atomistic model. */}
      <group ref={glucose}>
        {glucosePoints.map(([x, y, z], i) => (
          <group key={i}>
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.1, 12, 10]} />
              <meshStandardMaterial
                color={carbon}
                emissive="#ff8b37"
                emissiveIntensity={0.13}
                roughness={0.55}
              />
            </mesh>
            <mesh
              position={[
                (x + glucosePoints[(i + 1) % 6][0]) / 2,
                (y + glucosePoints[(i + 1) % 6][1]) / 2,
                z,
              ]}
              rotation={[
                0,
                0,
                Math.atan2(
                  glucosePoints[(i + 1) % 6][1] - y,
                  glucosePoints[(i + 1) % 6][0] - x,
                ) -
                  Math.PI / 2,
              ]}
            >
              <cylinderGeometry args={[0.022, 0.022, 0.23, 6]} />
              <meshStandardMaterial color={bond} />
            </mesh>
          </group>
        ))}
        {/* Matching the photosynthesis model: red oxygen and white hydrogen.
            Decorative simplified molecular representation. */}
        {[
          [-0.32, 0.18],
          [0.31, 0.18],
          [-0.3, -0.19],
          [0.3, -0.19],
        ].map(([x, y], i) => (
          <mesh key={`oxygen-${i}`} position={[x, y, 0.02]}>
            <sphereGeometry args={[0.085, 12, 10]} />
            <meshStandardMaterial color="#e87972" roughness={0.6} />
          </mesh>
        ))}
        {[
          [-0.4, 0.31],
          [0.4, 0.31],
          [-0.4, -0.32],
          [0.4, -0.32],
        ].map(([x, y], i) => (
          <mesh key={`hydrogen-${i}`} position={[x, y, 0.02]}>
            <sphereGeometry args={[0.046, 10, 8]} />
            <meshStandardMaterial color="#f1f5f3" />
          </mesh>
        ))}
        <pointLight color="#ff902d" intensity={0.9} distance={1.5} />
      </group>
      <group ref={pyruvateA} visible={false}>
        <PyruvateShape />
      </group>
      <group ref={pyruvateB} visible={false}>
        <PyruvateShape />
      </group>
      <group ref={atpA} visible={false}>
        <ATPShape />
      </group>
      <group ref={atpB} visible={false}>
        <ATPShape />
      </group>
    </group>
  );
}

function PyruvateShape() {
  return (
    <>
      {[-0.17, 0, 0.17].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <sphereGeometry args={[0.095, 12, 10]} />
          <meshStandardMaterial
            color="#303941"
            emissive="#ff8b37"
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}
      <mesh position={[-0.18, 0.16, 0]}>
        <sphereGeometry args={[0.078, 12, 10]} />
        <meshStandardMaterial color="#e87972" />
      </mesh>
      <mesh position={[0.18, -0.16, 0]}>
        <sphereGeometry args={[0.078, 12, 10]} />
        <meshStandardMaterial color="#e87972" />
      </mesh>
      <mesh position={[0.26, -0.23, 0]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshStandardMaterial color="#f1f5f3" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.34, 6]} />
        <meshStandardMaterial color="#c3d3ce" />
      </mesh>
    </>
  );
}

function ATPShape() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshStandardMaterial
          color="#ffd977"
          emissive="#f5b53c"
          emissiveIntensity={0.85}
          roughness={0.35}
        />
      </mesh>
      <pointLight color="#ffcd69" intensity={0.45} distance={1.1} />
    </>
  );
}
