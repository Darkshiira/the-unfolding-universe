"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export type PhotosynthesisStage = 0 | 1 | 2 | 3;

// Screen-facing labels stay readable as the 3D molecules travel.
function MoleculeLabel({
  text,
  tone = "mint",
  position = [0, -0.38, 0],
}: {
  text: string;
  tone?: "mint" | "blue" | "gold" | "coral";
  position?: [number, number, number];
}) {
  const colors = {
    mint: "#b8f6d6",
    blue: "#b9edff",
    gold: "#fff0b0",
    coral: "#ffcfbd",
  };
  return (
    <Html
      position={position}
      center
      distanceFactor={12}
      zIndexRange={[10, 0]}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "4px 8px",
          borderRadius: 20,
          border: `1px solid ${colors[tone]}66`,
          background: "rgba(3,28,23,.88)",
          color: colors[tone],
          fontFamily: "system-ui, sans-serif",
          fontWeight: 650,
          fontSize: 12,
          letterSpacing: ".01em",
          boxShadow: "0 3px 14px rgba(0,0,0,.3)",
        }}
      >
        {text}
      </span>
    </Html>
  );
}

function Orb({
  position,
  color,
  radius = 0.11,
  opacity = 1,
}: {
  position: [number, number, number];
  color: string;
  radius?: number;
  opacity?: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 14, 12]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

function Bar({
  start,
  end,
  color,
  radius = 0.022,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  radius?: number;
}) {
  const vector = end.clone().sub(start);
  const center = start.clone().add(end).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    vector.clone().normalize(),
  );
  return (
    <mesh position={center} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, vector.length(), 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Water({
  x = 0,
  y = 0,
  z = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
}) {
  return (
    <group position={[x, y, z]} scale={scale}>
      <Orb position={[0, 0, 0]} color="#e66f65" radius={0.16} />
      <Orb position={[-0.17, 0.15, 0]} color="#e9faff" radius={0.095} />
      <Orb position={[0.17, 0.15, 0]} color="#e9faff" radius={0.095} />
      <Bar
        start={new THREE.Vector3(0, 0, 0)}
        end={new THREE.Vector3(-0.17, 0.15, 0)}
        color="#e5f9ff"
      />
      <Bar
        start={new THREE.Vector3(0, 0, 0)}
        end={new THREE.Vector3(0.17, 0.15, 0)}
        color="#e5f9ff"
      />
    </group>
  );
}

function CarbonDioxide({
  x,
  y,
  z = 0.6,
}: {
  x: number;
  y: number;
  z?: number;
}) {
  return (
    <group position={[x, y, z]}>
      <Orb position={[0, 0, 0]} color="#424d50" radius={0.12} />
      <Orb position={[-0.23, 0, 0]} color="#e67872" radius={0.14} />
      <Orb position={[0.23, 0, 0]} color="#e67872" radius={0.14} />
      <Bar
        start={new THREE.Vector3(-0.22, 0.055, 0)}
        end={new THREE.Vector3(-0.03, 0.055, 0)}
        color="#f4e8dc"
        radius={0.012}
      />
      <Bar
        start={new THREE.Vector3(0.03, 0.055, 0)}
        end={new THREE.Vector3(0.22, 0.055, 0)}
        color="#f4e8dc"
        radius={0.012}
      />
      <Bar
        start={new THREE.Vector3(-0.22, -0.055, 0)}
        end={new THREE.Vector3(-0.03, -0.055, 0)}
        color="#f4e8dc"
        radius={0.012}
      />
      <Bar
        start={new THREE.Vector3(0.03, -0.055, 0)}
        end={new THREE.Vector3(0.22, -0.055, 0)}
        color="#f4e8dc"
        radius={0.012}
      />
    </group>
  );
}

// A feathered, additive light field rather than a solid cylinder.
// The shader fades each ray across its width AND along its length.
function Sunbeam({ x, index }: { x: number; index: number }) {
  const shader = useMemo(
    () => ({
      uniforms: { uTime: { value: 0 }, uOffset: { value: index * 1.7 } },
      vertexShader: `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uOffset;
      void main(){
        float width = exp(-pow((vUv.x-.5)*5.8,2.0));
        float center = exp(-pow((vUv.x-.5)*18.0,2.0));
        float lengthFade = smoothstep(0.0,.22,vUv.y)*smoothstep(1.0,.58,vUv.y);
        float shimmer = .78+.22*sin(uTime*2.3+uOffset+vUv.y*9.0);
        float alpha = (width*.12+center*.21)*lengthFade*shimmer;
        gl_FragColor=vec4(1.0,.87,.48,alpha);
      }`,
    }),
    [index],
  );
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, d) => {
    if (mat.current) mat.current.uniforms.uTime.value += Math.min(d, 0.06);
  });
  return (
    <group position={[x, 1.55, 1.6]} rotation={[0, 0, -0.17]}>
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[0.65, 2.3]} />
        <shaderMaterial
          ref={mat}
          args={[shader]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={i}
          position={[Math.sin(i * 4.7 + index) * 0.15, -0.65 + i * 0.43, 0.06]}
        >
          <sphereGeometry args={[0.014 + (i % 2) * 0.008, 8, 8]} />
          <meshBasicMaterial
            color="#fff4b4"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ReactionSparkles({
  count = 16,
  color = "#b5fbd4",
  paused = false,
}: {
  count?: number;
  color?: string;
  paused?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: i * 2.39996,
        distance: 0.12 + (i % 5) * 0.1,
        speed: 0.6 + (i % 4) * 0.15,
        size: 0.018 + (i % 3) * 0.009,
      })),
    [count],
  );
  const localTime = useRef(0);
  useFrame((_, delta) => {
    if (!group.current) return;
    if (!paused) localTime.current += Math.min(delta, 0.06);
    const t = localTime.current;
    group.current.children.forEach((child, i) => {
      const p = particles[i];
      const pulse = 0.4 + 0.6 * Math.abs(Math.sin(t * p.speed + i));
      child.position.set(
        Math.cos(p.angle + t * 0.35) * p.distance * pulse,
        Math.sin(p.angle + t * 0.35) * p.distance * pulse,
        0.15,
      );
      child.scale.setScalar(0.5 + pulse * 0.65);
    });
  });
  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Granum({
  x,
  y,
  count,
  glowing,
  paused,
}: {
  x: number;
  y: number;
  count: number;
  glowing: boolean;
  paused: boolean;
}) {
  const materials = useRef<THREE.Group>(null);
  const phase = useRef(0);
  useFrame((_, delta) => {
    if (!paused) phase.current += Math.min(delta, 0.06);
    if (!materials.current) return;
    const wave = Math.pow(
      Math.max(0, Math.sin(phase.current * 1.5 - x * 0.7)),
      8,
    );
    materials.current.traverse((object) => {
      if (
        object instanceof THREE.Mesh &&
        object.material instanceof THREE.MeshStandardMaterial
      ) {
        object.material.emissiveIntensity = glowing ? 0.18 + 0.5 * wave : 0.08;
      }
    });
  });
  return (
    <group ref={materials} position={[x, y, 0]} rotation={[0.1, 0.14, -0.13]}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[0, (i - (count - 1) / 2) * 0.085, 0]}>
          <cylinderGeometry args={[0.39, 0.39, 0.058, 32]} />
          <meshStandardMaterial
            color={glowing ? "#65c98b" : "#35815c"}
            emissive={glowing ? "#29955a" : "#092d1d"}
            emissiveIntensity={glowing ? 0.5 : 0.1}
            roughness={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}

// Every stage is a slow, repeating 12-second story. The models stay in one
// coordinate system, so visitors can follow where each molecule travels.
const STORY_SECONDS = 12;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {
  const v = clamp01(n);
  return v * v * (3 - 2 * v);
};

function Oxygen({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <Orb position={[-0.13, 0, 0]} color="#e66f65" radius={0.15} />
      <Orb position={[0.13, 0, 0]} color="#e66f65" radius={0.15} />
      <Bar
        start={new THREE.Vector3(-0.12, 0.05, 0)}
        end={new THREE.Vector3(0.12, 0.05, 0)}
        color="#f8c4b9"
        radius={0.015}
      />
      <Bar
        start={new THREE.Vector3(-0.12, -0.05, 0)}
        end={new THREE.Vector3(0.12, -0.05, 0)}
        color="#f8c4b9"
        radius={0.015}
      />
    </group>
  );
}

function StoryAnimation({
  stage,
  paused,
  showLabels,
}: {
  stage: PhotosynthesisStage;
  paused: boolean;
  showLabels: boolean;
}) {
  const time = useRef(0);
  const root = useRef<THREE.Group>(null);
  const light = useRef<THREE.Group>(null);
  const water = useRef<THREE.Group>(null);
  const oxygen = useRef<THREE.Group>(null);
  const energy = useRef<THREE.Group>(null);
  const co2 = useRef<THREE.Group>(null);
  const sugar = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Mesh>(null);
  const lastEnergy = useRef<THREE.Group>(null);
  const constructionGlow = useRef<THREE.Group>(null);
  const reaction = useRef<THREE.Group>(null);
  const hydrogen = useRef<THREE.Group>(null);
  const sugarPieces = useRef<THREE.Group>(null);
  const lastStage = useRef(stage);
  const finalCaption = useRef<THREE.Group>(null);
  const sugarBonds = useRef<THREE.Group>(null);
  const sugarAtoms = useRef<THREE.Group>(null);
  const lightCollector = useRef<THREE.Group>(null);
  // HTML overlays do not reliably inherit Three.js group visibility/scale.
  // Mount them only during the actual on-screen phase of each reaction.
  const [beat, setBeat] = useState(0);
  const beatRef = useRef(0);
  useFrame((_, delta) => {
    if (lastStage.current !== stage) {
      lastStage.current = stage;
      time.current = 0;
    }
    if (!paused) time.current += Math.min(delta, 0.06);
    const t = time.current % STORY_SECONDS;
    const progress = t / STORY_SECONDS;
    const nextBeat =
      stage === 0
        ? t < 4.7
          ? 0
          : 1
        : stage === 1
          ? t < 4.8
            ? 0
            : t < 6.2
              ? 1
              : t < 10.3
                ? 2
                : 3
          : stage === 2
            ? t < 2
              ? 0
              : t < 10.3
                ? 1
                : 2
            : t < 5.2
              ? 0
              : t < 8.3
                ? 1
                : t < 10.3
                  ? 2
                  : 3;
    if (nextBeat !== beatRef.current) {
      beatRef.current = nextBeat;
      setBeat(nextBeat);
    }
    // At the end of each loop all temporary products dissolve before replay.
    const fadeOut = 1 - ease((t - 10.5) / 1.25);
    const setOpacity = (group: THREE.Group | null, alpha: number) => {
      if (!group) return;
      group.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const material = object.material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.transparent = true;
          material.opacity = Math.max(0, Math.min(1, alpha));
          material.depthWrite = false;
        }
      });
    };
    if (root.current) root.current.rotation.y = 0; // Keep the reaction readable.
    if (light.current) {
      // Sunlight is absorbed quickly; never linger as stray streaks.
      const u = ease(t / 3.5);
      light.current.position.set(0, -1.1 * u, 0);
      // Rays converge at the membrane rather than fading into empty space.
      light.current.children.forEach((child, i) => {
        if (i < 4)
          child.position.x = [-1.5, -0.5, 0.5, 1.5][i] * (1 - 0.82 * u);
      });
      light.current.scale.setScalar(Math.max(0.001, 1 - ease((t - 3.4) / 1.2)));
      light.current.visible = t < 4.35;
    }
    if (lightCollector.current) {
      const gather = ease((t - 2.0) / 1.7);
      const release = 1 - ease((t - 4.05) / 0.85);
      const strength = gather * release;
      lightCollector.current.visible = stage === 0 && strength > 0.005;
      lightCollector.current.scale.setScalar(
        Math.max(0.001, strength * (1 + 0.12 * Math.sin(t * 13))),
      );
    }
    if (flash.current) {
      const mat = flash.current.material as THREE.MeshBasicMaterial;
      mat.opacity =
        stage === 0 && t >= 3.5 && t <= 5.1
          ? 0.48 * Math.sin(Math.PI * clamp01((t - 3.5) / 1.6))
          : 0;
    }
    if (water.current) {
      const u = ease((t - 1) / 4);
      water.current.position.set(-1.2 + u * 1.5, -0.8 + u * 0.25, 1.3);
      water.current.scale.setScalar(1 - 0.85 * ease((t - 5) / 1.3));
      water.current.visible = t < 6.7;
    }
    if (oxygen.current) {
      const u = ease((t - 6) / 4);
      oxygen.current.position.set(0.45 + u * 2.25, -0.5 + u * 1.25, 1.45);
      oxygen.current.scale.setScalar(0.1 + 0.9 * ease((t - 5.5) / 1.5));
      oxygen.current.visible = t >= 6.2 && t < 10.3;
      setOpacity(oxygen.current, fadeOut);
    }
    if (energy.current) {
      // Form at the thylakoid, then travel a short distance into the stroma.
      // The carriers remain INSIDE the chloroplast until the next view.
      const u = ease((t - 3.1) / 4.6);
      energy.current.position.set(-0.5 + 0.95 * u, -0.28 - 0.48 * u, 1.35);
      energy.current.scale.setScalar(
        (0.08 + 0.92 * ease((t - 1.5) / 2.5)) * Math.max(0.001, fadeOut),
      );
    }
    if (co2.current) {
      // CO₂ travels to the *same* construction site as the emerging product.
      // It is consumed by the reaction glow rather than shrinking in plain sight.
      const u = ease((t - 1.0) / 4.5);
      co2.current.position.set(0.12, 1.25 - 2.12 * u, 1.42);
      const consumed = ease((t - 5.15) / 1.35);
      co2.current.scale.setScalar(Math.max(0.001, 1 - consumed));
      co2.current.visible = t < 6.5;
    }
    if (sugar.current) {
      // Keep the atom assembly in the stroma, and visible at a readable size.
      sugar.current.scale.setScalar(Math.max(0.001, fadeOut));
    }
    if (lastEnergy.current) {
      const u = ease((t - 2.3) / 3.4);
      // ATP/NADPH meet the CO₂ at the assembly site and transfer energy.
      lastEnergy.current.position.set(-1.55 + u * 1.55, -0.25 - u * 0.62, 1.55);
      const used = ease((t - 5.4) / 1.45);
      lastEnergy.current.scale.setScalar(Math.max(0.001, 1 - used));
      lastEnergy.current.visible = t < 6.85;
    }
    if (constructionGlow.current) {
      const arrive = ease((t - 4.5) / 1.2);
      const settle = 1 - ease((t - 7.0) / 1.3);
      const strength = arrive * settle;
      constructionGlow.current.visible = strength > 0.005;
      constructionGlow.current.scale.setScalar(
        Math.max(0.001, strength * (1 + 0.09 * Math.sin(t * 9))),
      );
    }
    // A visible reaction bridge: existing bonds break, particles reorganize,
    // and products appear from the SAME reaction location.
    if (reaction.current) {
      const start =
        stage === 0 ? 4.2 : stage === 1 ? 4.7 : stage === 2 ? 4.0 : 5.0;
      const pulse = Math.sin(Math.PI * clamp01((t - start) / 2.5));
      reaction.current.visible = pulse > 0.01 && t < 10.5;
      reaction.current.scale.setScalar(0.15 + 1.5 * pulse);
      reaction.current.rotation.z = t * 0.35;
    }
    if (hydrogen.current) {
      const split = ease((t - 4.5) / 2.4);
      hydrogen.current.visible = t > 4.5 && t < 7.5;
      hydrogen.current.position.set(
        0.15 + split * 0.9,
        -0.32 + split * 0.3,
        1.55,
      );
      hydrogen.current.children.forEach((child, i) => {
        child.position.set(
          (i - 0.5) * (0.12 + split * 0.65),
          Math.sin(i * 3 + split * 4) * split * 0.24,
          0,
        );
      });
    }
    if (sugarPieces.current) {
      sugarPieces.current.children.forEach((child, i) => {
        const u = ease((t - 6.0 - i * 0.35) / 1.25);
        child.position.set(
          -0.62 + i * 0.31,
          Math.sin(i * 1.1) * 0.07 + (1 - u) * (0.25 + i * 0.04),
          0,
        );
        child.scale.setScalar(Math.max(0.001, u * fadeOut));
        child.visible = t >= 6.0 + i * 0.35 && t < 11.5;
      });
    }
    if (sugarAtoms.current) {
      sugarAtoms.current.children.forEach((child, i) => {
        const u = ease((t - 6.7 - i * 0.22) / 1.1);
        child.scale.setScalar(Math.max(0.001, u * fadeOut));
        child.visible = t >= 6.7 + i * 0.22 && t < 11.5;
      });
    }
    if (sugarBonds.current) {
      sugarBonds.current.visible = t >= 6.8 && t < 11.5;
      sugarBonds.current.children.forEach((bond, i) => {
        const born = ease((t - 6.8 - i * 0.35) / 0.8);
        bond.scale.setScalar(Math.max(0.001, born * fadeOut));
        bond.visible = t >= 6.8 + i * 0.35 && t < 11.5;
      });
    }
    if (finalCaption.current) {
      const appear = ease((t - 8.2) / 1.1);
      finalCaption.current.scale.setScalar(Math.max(0.001, appear * fadeOut));
      finalCaption.current.visible = stage === 3 && appear * fadeOut > 0.01;
    }
    // The slow 12s loop intentionally does NOT advance the four steps.
    void progress;
  });
  return (
    <group ref={root}>
      {stage === 0 && (
        <>
          <group ref={light}>
            {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
              <Sunbeam key={i} x={x} index={i} />
            ))}
            {showLabels && beat === 0 && (
              <MoleculeLabel
                text="Solljus ☀"
                tone="gold"
                position={[0, 2.9, 1.5]}
              />
            )}
          </group>
          <group ref={lightCollector} position={[0, 0.28, 1.78]}>
            <mesh>
              <sphereGeometry args={[0.21, 20, 16]} />
              <meshBasicMaterial
                color="#fff9c4"
                transparent
                opacity={0.46}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.37, 20, 16]} />
              <meshBasicMaterial
                color="#ffed96"
                transparent
                opacity={0.13}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
          <group ref={reaction} position={[0, 0.28, 1.65]}>
            <ReactionSparkles paused={paused} color="#fff2a6" count={20} />
          </group>
          <mesh ref={flash} position={[0, 0, 1.1]}>
            <sphereGeometry args={[0.22, 24, 16]} />
            <meshBasicMaterial
              color="#d8ff8c"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
      {stage === 1 && (
        <>
          <group ref={water}>
            <Water x={-0.35} y={0} z={0} scale={1.15} />
            <Water x={0.35} y={0} z={0} scale={1.15} />
            {showLabels && beat === 0 && (
              <MoleculeLabel
                text="Vatten · H₂O"
                tone="blue"
                position={[0, -0.48, 0]}
              />
            )}
          </group>
          <group ref={reaction} position={[0.28, -0.35, 1.6]}>
            <ReactionSparkles paused={paused} color="#b3edff" count={22} />
          </group>
          <group ref={hydrogen}>
            <Orb position={[0, 0, 0]} color="#e6faff" radius={0.085} />
            <Orb position={[0, 0, 0]} color="#e6faff" radius={0.085} />
          </group>
          <group ref={oxygen}>
            <Oxygen />
            {showLabels && beat === 2 && (
              <MoleculeLabel
                text="Syre · O₂ ↗"
                tone="coral"
                position={[0, -0.4, 0]}
              />
            )}
          </group>
        </>
      )}
      {stage === 2 && (
        <>
          <group ref={reaction} position={[0, -0.55, 1.65]}>
            <ReactionSparkles paused={paused} color="#ffe8a0" count={20} />
          </group>
          <group ref={energy}>
            <mesh position={[-0.34, 0, 0]}>
              <octahedronGeometry args={[0.26, 0]} />
              <meshBasicMaterial color="#f6d680" />
            </mesh>
            <mesh position={[0.34, 0, 0]}>
              <octahedronGeometry args={[0.26, 0]} />
              <meshBasicMaterial color="#a5f2c4" />
            </mesh>
            <mesh position={[-0.34, 0, 0.01]}>
              <ringGeometry args={[0.31, 0.34, 24]} />
              <meshBasicMaterial
                color="#ffe9a8"
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0.34, 0, 0.01]}>
              <ringGeometry args={[0.31, 0.34, 24]} />
              <meshBasicMaterial
                color="#c2ffdf"
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
            {showLabels && beat === 1 && (
              <MoleculeLabel
                text="ATP + NADPH"
                tone="gold"
                position={[0, -0.52, 0]}
              />
            )}
          </group>
        </>
      )}
      {stage === 3 && (
        <>
          <group ref={reaction} position={[0, -0.65, 1.75]}>
            <ReactionSparkles paused={paused} color="#c0fbd4" count={24} />
          </group>
          <group ref={co2}>
            <CarbonDioxide x={-0.7} y={0} z={0} />
            <CarbonDioxide x={0.7} y={0} z={0} />
            {showLabels && beat === 0 && (
              <MoleculeLabel
                text="Koldioxid · CO₂ ↓"
                tone="coral"
                position={[0, 0.48, 0]}
              />
            )}
          </group>
          <group ref={lastEnergy}>
            <mesh position={[-0.25, 0, 0]}>
              <octahedronGeometry args={[0.19, 0]} />
              <meshBasicMaterial color="#f6d680" />
            </mesh>
            <mesh position={[0.25, 0, 0]}>
              <octahedronGeometry args={[0.19, 0]} />
              <meshBasicMaterial color="#a5f2c4" />
            </mesh>
            {showLabels && beat <= 1 && (
              <MoleculeLabel
                text="ATP + NADPH →"
                tone="gold"
                position={[0, -0.42, 0]}
              />
            )}
          </group>
          {/* O₂ was released in the water-splitting view; it is not part of this reaction. */}
          <group ref={constructionGlow} position={[0, -0.87, 1.55]}>
            <mesh>
              <sphereGeometry args={[0.27, 20, 16]} />
              <meshBasicMaterial
                color="#c8ffe0"
                transparent
                opacity={0.32}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.46, 20, 16]} />
              <meshBasicMaterial
                color="#9ff3c1"
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
          <group ref={sugar} position={[0, -0.87, 1.6]}>
            {/* Carbon backbone assembles from recognizable carbon atoms; oxygen and
            hydrogen arrive afterwards. This is a teaching schematic of sugar
            precursors, not a literal molecular structure of glucose or G3P. */}
            <group ref={sugarPieces}>
              {Array.from({ length: 5 }, (_, i) => (
                <group key={i}>
                  <Orb position={[0, 0, 0]} color="#424d50" radius={0.115} />
                </group>
              ))}
            </group>
            <group ref={sugarBonds}>
              {Array.from({ length: 4 }, (_, i) => (
                <Bar
                  key={i}
                  start={
                    new THREE.Vector3(
                      -0.62 + i * 0.31,
                      Math.sin(i * 1.1) * 0.07,
                      0,
                    )
                  }
                  end={
                    new THREE.Vector3(
                      -0.62 + (i + 1) * 0.31,
                      Math.sin((i + 1) * 1.1) * 0.07,
                      0,
                    )
                  }
                  color="#b6d4c7"
                  radius={0.019}
                />
              ))}
            </group>
            <group ref={sugarAtoms}>
              {Array.from({ length: 5 }, (_, i) => (
                <group
                  key={i}
                  position={[-0.62 + i * 0.31, Math.sin(i * 1.1) * 0.07, 0]}
                >
                  <Orb
                    position={[0, i % 2 === 0 ? 0.22 : -0.22, 0]}
                    color="#e66f65"
                    radius={0.087}
                  />
                  <Orb
                    position={[0.13, i % 2 === 0 ? -0.18 : 0.18, 0]}
                    color="#e9faff"
                    radius={0.052}
                  />
                </group>
              ))}
            </group>
          </group>
          {/* Only one caption is shown: never overlay it with a second label. */}
          {beat === 2 && (
            <group ref={finalCaption} position={[0, -1.45, 1.85]}>
              <Html
                center
                distanceFactor={11}
                style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
              >
                <span
                  style={{
                    color: "#c6fbd4",
                    background: "rgba(3,30,22,.92)",
                    border: "1px solid #6be5a477",
                    borderRadius: 20,
                    padding: "6px 12px",
                    fontSize: 14,
                    fontWeight: 750,
                    fontFamily: "system-ui",
                  }}
                >
                  Sockrets byggstenar bildas!
                </span>
              </Html>
            </group>
          )}
        </>
      )}
    </group>
  );
}

export default function PhotosynthesisChloroplast({
  stage,
  paused,
  showLabels = false,
}: {
  stage: PhotosynthesisStage;
  paused: boolean;
  showLabels?: boolean;
}) {
  const organelle = useRef<THREE.Group>(null);
  useFrame(() => {
    if (organelle.current) organelle.current.rotation.y = 0;
  });
  return (
    <group ref={organelle} rotation={[0.08, -0.18, -0.08]}>
      <mesh scale={[3.1, 1.75, 1.2]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshPhysicalMaterial
          color="#2d8d60"
          transparent
          opacity={0.22}
          roughness={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={[3.03, 1.68, 1.15]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshPhysicalMaterial
          color="#72cf80"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <group rotation={[0.12, 0.04, 0]}>
        <Granum
          x={-1.72}
          y={0.13}
          count={10}
          glowing={stage < 3}
          paused={paused}
        />
        <Granum
          x={-0.77}
          y={-0.28}
          count={13}
          glowing={stage < 3}
          paused={paused}
        />
        <Granum
          x={0.28}
          y={0.28}
          count={9}
          glowing={stage < 3}
          paused={paused}
        />
        <Granum
          x={1.33}
          y={-0.18}
          count={12}
          glowing={stage < 3}
          paused={paused}
        />
        {[-1.3, -0.27, 0.75].map((x, i) => (
          <mesh
            key={i}
            position={[x, i % 2 ? 0 : -0.08, 0]}
            rotation={[0, 0, 0.08]}
          >
            <boxGeometry args={[0.85, 0.14, 0.045]} />
            <meshStandardMaterial color="#4c9f64" />
          </mesh>
        ))}
      </group>
      <StoryAnimation stage={stage} paused={paused} showLabels={showLabels} />
    </group>
  );
}
