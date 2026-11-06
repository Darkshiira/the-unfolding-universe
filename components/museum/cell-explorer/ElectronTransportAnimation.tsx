"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { stage: 2 | 3; paused: boolean; oxygen: number; fuel: number };
const smooth = (t: number, a: number, b: number) =>
  THREE.MathUtils.smoothstep(t, a, b);
const clamp = (n: number) => THREE.MathUtils.clamp(n, 0, 1);

function Oxygen() {
  return (
    <group>
      {[-0.09, 0.09].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <sphereGeometry args={[0.105, 14, 12]} />
          <meshStandardMaterial
            color="#e87972"
            emissive="#b84b42"
            emissiveIntensity={0.14}
          />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, 0.18, 8]} />
        <meshStandardMaterial color="#eab3a9" />
      </mesh>
      <pointLight color="#72d6f7" intensity={0.7} distance={0.95} />
    </group>
  );
}

function Water() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.11, 16, 12]} />
        <meshStandardMaterial color="#e87972" roughness={0.5} />
      </mesh>
      {[-1, 1].map((sign) => (
        <group key={sign}>
          <mesh position={[sign * 0.105, 0.11, 0]}>
            <sphereGeometry args={[0.065, 12, 10]} />
            <meshStandardMaterial color="#f1f5f3" />
          </mesh>
          <mesh
            position={[sign * 0.055, 0.056, 0]}
            rotation={[0, 0, sign * -0.75]}
          >
            <cylinderGeometry args={[0.018, 0.018, 0.15, 8]} />
            <meshStandardMaterial color="#d9e2df" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Proton() {
  return (
    <mesh>
      <sphereGeometry args={[0.065, 12, 10]} />
      <meshStandardMaterial
        color="#ffde83"
        emissive="#ffbb45"
        emissiveIntensity={0.9}
      />
    </mesh>
  );
}

function ATP({ glycolysis = false }: { glycolysis?: boolean }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[glycolysis ? 0.115 : 0.13, 16, 12]} />
        <meshStandardMaterial
          color={glycolysis ? "#ffcb7a" : "#ffda75"}
          emissive="#ffb732"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight
        color={glycolysis ? "#ffae64" : "#ffd166"}
        intensity={glycolysis ? 0.75 : 0.55}
        distance={0.9}
      />
    </group>
  );
}

function ProteinSite({ atp = false }: { atp?: boolean }) {
  return (
    <group>
      <mesh scale={[atp ? 0.15 : 0.16, 0.22, 0.095]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial
          color={atp ? "#e2c17a" : "#7c9caa"}
          emissive={atp ? "#9a6d2c" : "#315f72"}
          emissiveIntensity={0.3}
          roughness={0.65}
        />
      </mesh>
      {atp && (
        <mesh position={[0, 0.24, 0]} scale={[0.075, 0.13, 0.08]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial
            color="#f5d38a"
            emissive="#d69b38"
            emissiveIntensity={0.35}
          />
        </mesh>
      )}
    </group>
  );
}

export default function ElectronTransportAnimation({
  stage,
  paused,
  oxygen,
  fuel,
}: Props) {
  const elapsed = useRef(0);
  // Independent glycolysis clock: ATP outside the mitochondrion must continue
  // to appear when oxygen is 0%, provided glucose fuel is available.
  const glycolysisElapsed = useRef(0);
  const o2 = useRef<THREE.Group>(null);
  const water1 = useRef<THREE.Group>(null);
  const water2 = useRef<THREE.Group>(null);
  const proton0 = useRef<THREE.Group>(null);
  const proton1 = useRef<THREE.Group>(null);
  const proton2 = useRef<THREE.Group>(null);
  const proton3 = useRef<THREE.Group>(null);
  const proton4 = useRef<THREE.Group>(null);
  const proton5 = useRef<THREE.Group>(null);
  const atp0 = useRef<THREE.Group>(null);
  const atp1 = useRef<THREE.Group>(null);
  const atp2 = useRef<THREE.Group>(null);
  const glycolysisAtp0 = useRef<THREE.Group>(null);
  const glycolysisAtp1 = useRef<THREE.Group>(null);
  const protein = useRef<THREE.Group>(null);
  const synthase = useRef<THREE.Group>(null);
  const oxygenLevel = clamp(oxygen / 100);
  const fuelLevel = clamp(fuel / 100);
  const active = oxygenLevel > 0 && fuelLevel > 0;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!paused) {
      if (active)
        elapsed.current +=
          dt * (0.35 + 0.65 * Math.min(oxygenLevel, fuelLevel));
      if (fuelLevel > 0)
        glycolysisElapsed.current += dt * (0.45 + 0.55 * fuelLevel);
    }
    const t = elapsed.current % 7.2;
    const stage3 = stage === 2;

    // O2 arrives at complex IV; water forms on the matrix-facing side.
    if (o2.current) {
      const arrive = smooth(t, 0.25, 2.35);
      const vanish = 1 - smooth(t, 2.45, 3.05);
      o2.current.visible = stage3 && active && vanish > 0.01;
      o2.current.position.set(
        -1.75 + arrive * 2.78,
        0.04 + arrive * 0.38,
        0.055,
      );
      o2.current.scale.setScalar(Math.max(0.001, vanish));
    }
    [water1, water2].forEach((ref, i) => {
      if (!ref.current) return;
      const appear = smooth(t, 2.8 + i * 0.18, 3.5 + i * 0.18);
      const fade = 1 - smooth(t, 6.3, 7.15);
      ref.current.visible = stage3 && active && appear * fade > 0.01;
      // Water is formed next to complex IV on the MATRIX-facing side.
      // Keep the entire path behind the cutaway plane (z < 0.22) and
      // well inside the inner membrane rather than outside the opening.
      const drift = smooth(t, 3.3 + i * 0.18, 6.2);
      ref.current.position.set(
        0.88 - drift * (i === 0 ? 0.55 : 0.9),
        0.36 - drift * (i === 0 ? 0.42 : 0.67),
        0.035 - drift * 0.12 + i * 0.025,
      );
      ref.current.scale.setScalar(Math.max(0.001, appear * fade * 0.82));
      ref.current.rotation.z = (i ? -1 : 1) * elapsed.current * 0.11;
    });

    // H+ moves across the inner membrane in stage 3, and through ATP synthase in stage 4.
    [proton0, proton1, proton2, proton3, proton4, proton5].forEach((ref, i) => {
      if (!ref.current) return;
      const q = (t + (i / 6) * 7.2) % 7.2;
      const flow = smooth(q, 0.4, 5.5);
      const fade = smooth(q, 0, 0.5) * (1 - smooth(q, 6.2, 7.15));
      ref.current.visible = active && fade > 0.01;
      if (stage3) {
        const site = i % 2;
        const x = site ? -0.9 : 1.03;
        const y = site ? -0.43 : 0.54;
        ref.current.position.set(
          x + (site ? -0.16 : 0.12) * flow,
          y + (site ? -0.34 : 0.3) * flow,
          0.16,
        );
      } else {
        ref.current.position.set(
          -0.78 + 0.12 * Math.sin(i),
          -0.91 + flow * 0.75,
          0.15,
        );
      }
      ref.current.scale.setScalar(
        Math.max(0.001, fade * (0.75 + 0.25 * oxygenLevel)),
      );
    });

    // Large, oxygen-dependent ATP production INSIDE the mitochondrion.
    [atp0, atp1, atp2].forEach((ref, i) => {
      if (!ref.current) return;
      const q = (t + i * 2.1) % 7.2;
      const form = smooth(q, 2.6, 3.7);
      const fade = 1 - smooth(q, 6.1, 7.15);
      ref.current.visible = !stage3 && active && form * fade > 0.01;
      ref.current.position.set(
        -0.78 + form * (0.35 + i * 0.18),
        -0.45 + form * (0.45 + i * 0.16),
        0.19,
      );
      ref.current.scale.setScalar(Math.max(0.001, form * fade));
    });

    // Two small ATP symbols OUTSIDE the mitochondrion represent the net ATP
    // yield from glycolysis in the cytosol. This process does not directly
    // require oxygen. The symbols are illustrative, not atomistic ATP models.
    [glycolysisAtp0, glycolysisAtp1].forEach((ref, i) => {
      if (!ref.current) return;
      const visible = !stage3 && fuelLevel > 0;
      ref.current.visible = visible;
      if (!visible) return;
      const time = glycolysisElapsed.current;
      const phase = time * 1.7 + i * 2.4;
      const pulse = 0.93 + 0.1 * Math.sin(phase);
      ref.current.position.set(
        -3.18 - i * 0.36 + 0.055 * Math.sin(time * 0.65 + i),
        0.23 - i * 0.44 + 0.085 * Math.sin(time * 1.05 + i * 1.7),
        1.2,
      );
      ref.current.scale.setScalar(pulse * (0.65 + 0.35 * fuelLevel));
    });

    if (protein.current) protein.current.visible = stage3;
    if (synthase.current) synthase.current.visible = !stage3;
  });

  return (
    <group rotation={[0.05, -0.12, -0.035]}>
      <group ref={protein}>
        <group position={[1.04, 0.55, 0.045]}>
          <ProteinSite />
        </group>
        <group position={[-0.9, -0.44, 0.045]}>
          <ProteinSite />
        </group>
      </group>
      <group ref={synthase} visible={false} position={[-0.78, -0.72, 0.13]}>
        <ProteinSite atp />
      </group>
      <group ref={o2} visible={false}>
        <Oxygen />
      </group>
      <group ref={water1} visible={false}>
        <Water />
      </group>
      <group ref={water2} visible={false}>
        <Water />
      </group>
      <group ref={proton0}>
        <Proton />
      </group>
      <group ref={proton1}>
        <Proton />
      </group>
      <group ref={proton2}>
        <Proton />
      </group>
      <group ref={proton3}>
        <Proton />
      </group>
      <group ref={proton4}>
        <Proton />
      </group>
      <group ref={proton5}>
        <Proton />
      </group>
      <group ref={atp0} visible={false}>
        <ATP />
      </group>
      <group ref={atp1} visible={false}>
        <ATP />
      </group>
      <group ref={atp2} visible={false}>
        <ATP />
      </group>
      <group ref={glycolysisAtp0} visible={false}>
        <ATP glycolysis />
      </group>
      <group ref={glycolysisAtp1} visible={false}>
        <ATP glycolysis />
      </group>
    </group>
  );
}
