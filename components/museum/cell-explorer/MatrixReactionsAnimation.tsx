"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { paused: boolean; oxygen: number; fuel: number };

function CarbonMolecule({ small = false }: { small?: boolean }) {
  const spacing = small ? 0.1 : 0.13;
  return (
    <group>
      {[-1, 0, 1].map((n) => (
        <mesh key={n} position={[n * spacing, 0, 0]}>
          <sphereGeometry args={[small ? 0.058 : 0.075, 12, 10]} />
          <meshStandardMaterial
            color="#303941"
            emissive="#ff9c46"
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.017, 0.017, spacing * 2, 6]} />
        <meshStandardMaterial color="#c6d0cb" />
      </mesh>
      <mesh position={[-spacing, 0.11, 0]}>
        <sphereGeometry args={[0.064, 10, 8]} />
        <meshStandardMaterial color="#e87972" />
      </mesh>
      <mesh position={[spacing, -0.11, 0]}>
        <sphereGeometry args={[0.064, 10, 8]} />
        <meshStandardMaterial color="#e87972" />
      </mesh>
      <mesh position={[spacing + 0.07, -0.16, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#f1f5f3" />
      </mesh>
    </group>
  );
}

function Carrier({ color }: { color: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          roughness={0.4}
        />
      </mesh>
      <pointLight color={color} intensity={0.45} distance={0.8} />
    </group>
  );
}

function CO2() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial color="#303941" />
      </mesh>
      {[-1, 1].map((n) => (
        <mesh key={n} position={[n * 0.11, 0, 0]}>
          <sphereGeometry args={[0.064, 10, 8]} />
          <meshStandardMaterial color="#e87972" />
        </mesh>
      ))}
    </group>
  );
}

// Stage 2 is a guided schematic: pyruvate enters the matrix, then the
// conversion to acetyl-CoA and citric-acid-cycle reactions yield CO2 and
// electron carriers. These are NOT literal molecule trajectories.
export default function MatrixReactionsAnimation({
  paused,
  oxygen,
  fuel,
}: Props) {
  const clock = useRef(0);
  const pyruvateOne = useRef<THREE.Group>(null);
  const pyruvateTwo = useRef<THREE.Group>(null);
  const reaction = useRef<THREE.Group>(null);
  const nadh = useRef<THREE.Group>(null);
  const fadh = useRef<THREE.Group>(null);
  const carbonDioxideOne = useRef<THREE.Group>(null);
  const carbonDioxideTwo = useRef<THREE.Group>(null);
  const entryGlow = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!paused && fuel > 0) {
      clock.current += Math.min(delta, 0.05) * (0.45 + (0.55 * fuel) / 100);
    }
    const t = clock.current % 12;
    const enter = THREE.MathUtils.smoothstep(t, 0.6, 3.0);
    const process = THREE.MathUtils.smoothstep(t, 3.0, 5.1);
    const release = THREE.MathUtils.smoothstep(t, 5.1, 7.2);
    const exit = THREE.MathUtils.smoothstep(t, 9.8, 11.8);
    const visible = fuel > 0;

    const movePyruvate = (obj: THREE.Group | null, index: number) => {
      if (!obj) return;
      obj.visible = visible && t < 5.3;
      const offset = index * 0.38;
      obj.position.set(
        -2.78 + enter * (2.0 + offset),
        (index ? -0.23 : 0.24) + enter * (index ? 0.08 : -0.12),
        0.1,
      );
      obj.scale.setScalar(Math.max(0.001, (1 - process) * (1 - exit)));
      obj.rotation.z = 0.1 * Math.sin(clock.current + index);
    };
    movePyruvate(pyruvateOne.current, 0);
    movePyruvate(pyruvateTwo.current, 1);

    if (reaction.current) {
      reaction.current.visible = visible && process > 0.01 && t < 9.9;
      const a = (t - 3.0) * 1.8;
      // Deliberately stays in the open matrix between the pink folds.
      reaction.current.position.set(
        -0.18 + 0.55 * Math.cos(a),
        0.01 + 0.28 * Math.sin(a),
        0.08,
      );
      reaction.current.scale.setScalar(Math.max(0.001, process * (1 - exit)));
      reaction.current.rotation.z = a;
    }

    const moveCarrier = (obj: THREE.Group | null, index: number) => {
      if (!obj) return;
      obj.visible = visible && release > 0.01;
      const x = 0.1 + release * (0.85 + index * 0.3);
      const y =
        (index === 0 ? 0.06 : -0.05) + release * (index === 0 ? 0.52 : -0.48);
      obj.position.set(x, y, 0.1);
      obj.scale.setScalar(Math.max(0.001, release * (1 - exit)));
    };
    moveCarrier(nadh.current, 0);
    moveCarrier(fadh.current, 1);

    const moveCO2 = (obj: THREE.Group | null, index: number) => {
      if (!obj) return;
      obj.visible = visible && release > 0.01;
      obj.position.set(
        -0.2 + release * (index ? 0.55 : -0.55),
        0.05 + release * (index ? 1.35 : -1.25),
        0.12,
      );
      obj.scale.setScalar(Math.max(0.001, release * (1 - exit)));
    };
    moveCO2(carbonDioxideOne.current, 0);
    moveCO2(carbonDioxideTwo.current, 1);

    if (entryGlow.current) {
      entryGlow.current.visible = visible && t < 3.5;
      const material = entryGlow.current.material as THREE.MeshBasicMaterial;
      material.opacity = (1 - THREE.MathUtils.smoothstep(t, 2.6, 3.5)) * 0.28;
    }
    // Oxygen is not directly consumed in matrix reactions. It is needed
    // downstream for sustained aerobic respiration, so stage 2 is not
    // artificially switched off just because oxygen is set to zero.
    void oxygen;
  });

  return (
    <group rotation={[0.05, -0.12, -0.035]}>
      {/* A small glow marks transport across the membranes. */}
      <mesh ref={entryGlow} position={[-2.37, 0.15, 0.1]}>
        <sphereGeometry args={[0.27, 16, 12]} />
        <meshBasicMaterial
          color="#ffa95e"
          transparent
          opacity={0.24}
          depthWrite={false}
        />
      </mesh>
      <group ref={pyruvateOne}>
        <CarbonMolecule />
      </group>
      <group ref={pyruvateTwo}>
        <CarbonMolecule />
      </group>
      <group ref={reaction}>
        <CarbonMolecule small />
      </group>
      <group ref={nadh} visible={false}>
        <Carrier color="#78d6f4" />
      </group>
      <group ref={fadh} visible={false}>
        <Carrier color="#b6a2ff" />
      </group>
      <group ref={carbonDioxideOne} visible={false}>
        <CO2 />
      </group>
      <group ref={carbonDioxideTwo} visible={false}>
        <CO2 />
      </group>
    </group>
  );
}
