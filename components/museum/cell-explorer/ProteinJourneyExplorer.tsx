"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  EndoplasmicReticulum,
  GolgiApparatus,
} from "./SharedSecretoryOrganelles";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";

type CellType = "animal" | "plant";
type Props = { cellType: CellType; onClose: () => void };

const LOCATIONS = [
  {
    place: "CELLKÄRNAN",
    action: "RNA-polymeras kopierar en gen",
    tint: "#c994f5",
    number: "01",
  },
  {
    place: "CELLKÄRNAN · KÄRNPOREN",
    action: "Vi följer mRNA genom kärnporen",
    tint: "#c4a3ff",
    number: "02",
  },
  {
    place: "RIBOSOMEN",
    action: "Aminosyror blir ett protein",
    tint: "#8ce6d1",
    number: "03",
  },
  {
    place: "KORNIGT ER",
    action: "Proteinet veckas och kontrolleras",
    tint: "#79d5f3",
    number: "04",
  },
  {
    place: "GOLGIAPPARATEN",
    action: "Bearbetning och sortering",
    tint: "#f5a6d2",
    number: "05",
  },
  {
    place: "CELLMEMBRANET",
    action: "Proteinet lämnar cellen",
    tint: "#a2f0ba",
    number: "06",
  },
] as const;

const STEPS = [
  {
    short: "DNA",
    title: "1. DNA blir en instruktion",
    simple:
      "Vi är inne i cellkärnan! DNA öppnas längs en gen. Enzymet RNA-polymeras läser av ena strängen och bygger ett nytt RNA-meddelande, bit för bit.",
    detail:
      "DNA består av två komplementära strängar. När en gen ska användas öppnas ett begränsat område så att RNA-polymeras kan läsa av den ena DNA-strängen.",
    note: "DNA lämnar inte cellkärnan under den här resan.",
  },
  {
    short: "mRNA",
    title: "2. En kopia lämnar kärnan",
    simple:
      "Det färdiga mRNA:t lämnar DNA:t bakom sig och färdas mot en kärnpor. Vi följer med när meddelandet passerar genom kärnans hölje ut till cytoplasman.",
    detail:
      "Vid transkription byggs RNA från en DNA-mall. I eukaryota celler bearbetas det nya RNA:t, bland annat genom splitsning, innan moget mRNA exporteras genom en kärnpor.",
    note: "Det är mRNA, inte själva DNA:t, som går vidare till ribosomen.",
  },
  {
    short: "Ribosom",
    title: "3. Ribosomen bygger",
    simple:
      "En ribosom läser mRNA och kopplar ihop aminosyror. En växande proteinkedja bildas, en bit i taget!",
    detail:
      "Ribosomen läser mRNA i kodon om tre nukleotider. tRNA levererar aminosyror. För proteiner som ska utsöndras leder en signalsekvens ribosomen till det korniga ER.",
    note: "Många andra proteiner tillverkas på fria ribosomer och går aldrig genom ER och Golgi.",
  },
  {
    short: "Kornigt ER",
    title: "4. Proteinet formas i ER",
    simple:
      "Den växande proteinkedjan förs in i det korniga ER. Där får proteinet hjälp att veckas till en fungerande form.",
    detail:
      "Proteiner för sekretion förs in i ER:s lumen under syntesen. Där kan de veckas, kvalitetskontrolleras och få vissa kemiska modifieringar. Transportvesiklar tar sedan lasten mot Golgi.",
    note: "Proteinet flyter inte fritt genom cellvätskan mellan ER och Golgi; det transporteras i membranblåsor.",
  },
  {
    short: "Golgi",
    title: "5. Golgi sorterar paketet",
    simple:
      "En liten membranblåsa levererar proteinet till Golgiapparaten. Här bearbetas och sorteras det för rätt destination.",
    detail:
      "I Golgi kan proteiner få ytterligare modifieringar. De sorteras sedan till olika transportvägar, exempelvis utsöndring eller transport till andra membranbundna delar av cellen.",
    note: "Golgiapparaten finns i både djur- och växtceller.",
  },
  {
    short: "Leverans",
    title: "6. Proteinet levereras",
    simple:
      "Transportblåsan smälter samman med cellmembranet och släpper ut proteinet. Leveransen är framme!",
    detail:
      "Vid exocytos förenas vesikelns membran med plasmamembranet, så att ett lösligt sekretoriskt protein kan frisättas utanför cellen.",
    note: "I växtceller passerar utsöndrade ämnen först cellmembranet och kan sedan nå cellväggen eller utrymmet utanför cellen.",
  },
] as const;

function Bead({
  position,
  color = "#f6c6ee",
  radius = 0.085,
}: {
  position: [number, number, number];
  color?: string;
  radius?: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 12, 10]} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        emissive={color}
        emissiveIntensity={0.16}
      />
    </mesh>
  );
}

function Helix({ animated }: { animated: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (animated && ref.current) ref.current.rotation.y += delta * 0.22;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 34 }, (_, i) => {
        const y = -1.35 + i * 0.082;
        const angle = i * 0.44;
        const a: [number, number, number] = [
          Math.cos(angle) * 0.43,
          y,
          Math.sin(angle) * 0.43,
        ];
        const b: [number, number, number] = [-a[0], y, -a[2]];
        return (
          <group key={i}>
            <Bead position={a} color="#e7a8e7" radius={0.066} />
            <Bead position={b} color="#8ad4ee" radius={0.066} />
            <mesh position={[0, y, 0]} rotation={[0, -angle, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.86, 6]} />
              <meshStandardMaterial color={i % 2 ? "#f3d08e" : "#b8ddc9"} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Strand({
  progress,
  color = "#f5d189",
}: {
  progress: number;
  color?: string;
}) {
  const points = Array.from({ length: 45 }, (_, i) => {
    const t = i / 44;
    return new THREE.Vector3(
      -1.65 + t * 3.3,
      Math.sin(t * Math.PI * 7) * 0.19,
      Math.cos(t * Math.PI * 5) * 0.14,
    );
  });
  const curve = new THREE.CatmullRomCurve3(points);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 100, 0.022, 6, false]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
      <Bead
        position={
          curve.getPoint(Math.min(1, progress)).toArray() as [
            number,
            number,
            number,
          ]
        }
        color="#fff4c7"
        radius={0.12}
      />
    </group>
  );
}

function Ribosome({
  progress,
  showChain = true,
}: {
  progress: number;
  showChain?: boolean;
}) {
  return (
    <group>
      <mesh position={[0, -0.28, 0]} scale={[0.95, 0.48, 0.62]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#8bcdb7" roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.26, 0]} scale={[0.78, 0.47, 0.59]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#b5e2d2" roughness={0.54} />
      </mesh>
      {showChain &&
        Array.from(
          { length: Math.max(1, Math.round(progress * 14)) },
          (_, i) => (
            <Bead
              key={i}
              position={[
                0.23 + Math.sin(i * 0.65) * 0.23,
                0.65 + i * 0.075,
                Math.cos(i * 0.65) * 0.18,
              ]}
              color={i % 3 ? "#f1b2d4" : "#d9b4ff"}
              radius={0.095}
            />
          ),
        )}
    </group>
  );
}

// Same organic rough-ER geometry used by both cell explorers.
// The growing chain is threaded into its lumen while the ribosome docks.
function ERArrival({
  progress,
  paused,
}: {
  progress: number;
  paused: boolean;
}) {
  const ribosome = useRef<THREE.Group>(null);
  const chain = useRef<THREE.Group>(null);
  const beads = useRef<THREE.Group>(null);
  const connections = useRef<THREE.Group>(null);
  const folding = useRef(0);
  const temp = useMemo(() => new THREE.Vector3(), []);
  const points = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const t = i / 29;
        return {
          extended: new THREE.Vector3(
            -0.75 + Math.sin(t * 8) * 0.12,
            0.95 - t * 1.8,
            0,
          ),
          // Connected chain, folded into a small, irregular globular shape.
          folded: new THREE.Vector3(
            Math.sin(t * Math.PI * 5.4) * (0.25 + 0.07 * Math.cos(t * 11)),
            Math.cos(t * Math.PI * 4.3) * 0.26,
            Math.sin(t * Math.PI * 3.7 + 0.6) * 0.23,
          ),
        };
      }),
    [],
  );

  useFrame((_, delta) => {
    const dock = THREE.MathUtils.smoothstep(progress, 0.04, 0.32);
    const release = THREE.MathUtils.smoothstep(progress, 0.6, 0.92);
    const desired = THREE.MathUtils.smoothstep(progress, 0.26, 0.94);
    if (!paused)
      folding.current = THREE.MathUtils.damp(
        folding.current,
        desired,
        4.2,
        delta,
      );
    const f = folding.current;

    // Ribosome stays on the cytoplasmic face of the ER membrane;
    // it releases the completed protein and withdraws only near the end.
    if (ribosome.current) {
      ribosome.current.position.set(
        -2.55 + dock * 0.75 - release * 0.3,
        -0.22 - release * 0.2,
        1.05,
      );
      ribosome.current.scale.setScalar(0.62 - release * 0.07);
    }

    // Protein enters the *inside* of a translucent ER cisterna.
    // The local window makes the compartment clear even while orbiting.
    if (chain.current) {
      chain.current.position.set(-0.62 + f * 0.28, -0.08, 0.03);
      chain.current.rotation.set(f * 0.16, f * 0.6, f * 0.09);
    }

    const group = beads.current;
    const links = connections.current;
    if (!group) return;
    group.children.forEach((child, i) => {
      temp.copy(points[i].extended).lerp(points[i].folded, f);
      child.position.copy(temp);
    });
    if (links) {
      links.children.forEach((child, i) => {
        const a = group.children[i].position;
        const b = group.children[i + 1].position;
        child.position.copy(a).add(b).multiplyScalar(0.5);
        child.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          temp.copy(b).sub(a).normalize(),
        );
        child.scale.set(1, a.distanceTo(b), 1);
      });
    }
  });

  return (
    <group>
      <group scale={2.15}>
        <EndoplasmicReticulum
          selected={false}
          onSelect={() => {}}
          onRibosomeSelect={() => {}}
          motion={!paused}
        />
      </group>

      {/* A translucent local ER cisterna, viewed in X-ray style.
          Its enclosing membrane clarifies that folding happens in the lumen,
          not in the cytoplasm in front of the ER. */}
      <group position={[-0.35, -0.1, 0.0]}>
        <mesh scale={[1.12, 0.86, 0.58]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshPhysicalMaterial
            color="#70d0e3"
            transparent
            opacity={0.16}
            depthWrite={false}
            side={THREE.DoubleSide}
            roughness={0.22}
            metalness={0.04}
          />
        </mesh>
      </group>

      <group ref={ribosome} position={[-2.55, -0.22, 1.05]} scale={0.62}>
        <Ribosome progress={1} showChain={false} />
      </group>

      <group ref={chain} position={[-0.62, -0.08, 0.03]}>
        <group ref={beads}>
          {points.map((point, i) => (
            <Bead
              key={i}
              position={point.extended.toArray() as [number, number, number]}
              color={
                i % 5 === 0 ? "#f5d0ff" : i % 3 === 0 ? "#d9b4ff" : "#f1b2d4"
              }
              radius={0.065}
            />
          ))}
        </group>
        <group ref={connections}>
          {points.slice(1).map((_, i) => (
            <mesh key={i}>
              <cylinderGeometry args={[0.026, 0.026, 1, 7]} />
              <meshStandardMaterial color="#eab6e7" roughness={0.55} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// The actual Golgi geometry used in both cell explorers. The arriving vesicle
// travels from the ER side, docks at the cis face, and releases the cargo.
function Golgi({ progress, paused }: { progress: number; paused: boolean }) {
  const carrier = useRef<THREE.Group>(null);
  const cargo = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    if (!paused)
      t.current = THREE.MathUtils.damp(t.current, progress, 2.5, delta);
    const p = t.current;
    const travel = THREE.MathUtils.smoothstep(p, 0.03, 0.67);
    const fusion = THREE.MathUtils.smoothstep(p, 0.67, 0.88);
    const processing = THREE.MathUtils.smoothstep(p, 0.79, 1);
    if (carrier.current) {
      carrier.current.position.set(
        -2.8 + 2.02 * travel,
        0.34 - 0.32 * travel,
        0.95 - 0.3 * travel,
      );
      carrier.current.scale.setScalar(Math.max(0.001, 1 - fusion));
      carrier.current.rotation.z = travel * 0.65;
    }
    if (cargo.current) {
      cargo.current.position.set(
        -2.8 + 2.02 * travel + 1.38 * processing,
        0.34 - 0.32 * travel,
        0.95 - 0.3 * travel,
      );
      cargo.current.scale.setScalar(0.85 - 0.12 * processing);
      cargo.current.rotation.y = p * 1.4;
    }
  });
  return (
    <group>
      {/* Keep the organic, curved cisternae from the actual cell model. */}
      <group scale={2.5} position={[-2.3, 1.83, -1.25]}>
        <GolgiApparatus selected={false} onSelect={() => {}} motion={!paused} />
      </group>
      {/* Membrane carrier, not a loose protein floating through cytoplasm. */}
      <group ref={carrier} position={[-2.8, 0.34, 0.95]}>
        <mesh>
          <sphereGeometry args={[0.38, 32, 24]} />
          <meshPhysicalMaterial
            color="#e8b6d3"
            roughness={0.35}
            transparent
            opacity={0.48}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.395, 32, 24]} />
          <meshStandardMaterial
            color="#f4cde2"
            transparent
            opacity={0.22}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
      {/* Compact protein remains visible during docking and Golgi entry. */}
      <group ref={cargo} position={[-2.8, 0.34, 0.95]}>
        {Array.from({ length: 22 }, (_, i) => {
          const a = i * 2.39996;
          const r = 0.12 + 0.065 * Math.sin(i * 1.7);
          return (
            <Bead
              key={i}
              position={[
                Math.cos(a) * r,
                Math.sin(a * 0.9) * r,
                Math.sin(a) * r,
              ]}
              color={i % 3 === 0 ? "#f7d2f1" : "#dca9e4"}
              radius={0.052}
            />
          );
        })}
      </group>
    </group>
  );
}

// Exocytosis: the vesicle approaches the plasma membrane, docks,
// and its lipid envelope is incorporated into the membrane.
// This is a stylized continuous fusion, not a portal or transport ring.
function LipidBilayer() {
  const heads = useMemo(() => {
    const points: [number, number, number][] = [];
    for (let yi = -11; yi <= 11; yi++) {
      for (let zi = -6; zi <= 6; zi++) {
        const y = yi * 0.26 + (zi % 2) * 0.11;
        const z = zi * 0.23;
        const radius = Math.hypot(y, z);
        if (radius < 0.62 || radius > 1.15 || (yi + zi * 3) % 4 !== 0) continue;
        points.push([0.7, y, z]);
      }
    }
    return points;
  }, []);
  return (
    <group>
      {[-0.055, 0.055].map((offset) => (
        <mesh
          key={offset}
          position={[0.78 + offset, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[3.6, 6.4]} />
          <meshPhysicalMaterial
            color={offset < 0 ? "#74c5b5" : "#4d9e91"}
            transparent
            opacity={0.22}
            roughness={0.55}
            metalness={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
      {heads.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.032, 8, 7]} />
          <meshStandardMaterial
            color="#b2e8d9"
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Delivery({ progress, plant }: { progress: number; plant: boolean }) {
  const vesicle = useRef<THREE.Mesh>(null);
  const cargo = useRef<THREE.Group>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current = THREE.MathUtils.damp(
      time.current,
      progress,
      3.8,
      Math.min(delta, 0.05),
    );
    const p = time.current;
    const approach = THREE.MathUtils.smoothstep(p, 0.02, 0.57);
    const fusion = THREE.MathUtils.smoothstep(p, 0.57, 0.88);
    const release = THREE.MathUtils.smoothstep(p, 0.68, 0.98);
    // The cytoplasmic face of the bilayer is x ≈ 0.72.
    // A vesicle of radius 0.37 docks when its centre reaches x ≈ 0.35.
    const dockX = 0.35;
    const centerX = THREE.MathUtils.lerp(-1.65, dockX, approach);

    if (vesicle.current) {
      // Stay ROUND: do not turn into a flattened disc. At contact the
      // vesicle loses its independent outline as its lipids join the bilayer.
      vesicle.current.position.x = centerX + 0.23 * fusion;
      const radius = 0.37 * (1 - 0.15 * fusion);
      vesicle.current.scale.setScalar(radius);
      const mat = vesicle.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 0.58 * (1 - THREE.MathUtils.smoothstep(fusion, 0.02, 0.93));
      vesicle.current.visible = fusion < 0.97;
    }
    if (ripple.current) {
      // A very soft, flush patch of membrane color, never a hole or a ring.
      ripple.current.visible = fusion > 0.01 && fusion < 0.99;
      ripple.current.scale.setScalar(0.42 + 0.65 * fusion);
      (ripple.current.material as THREE.MeshBasicMaterial).opacity =
        0.065 * Math.sin(Math.PI * fusion);
    }
    if (cargo.current) {
      // Protein stays intact, then moves from cytoplasm into extracellular space.
      // The cargo begins moving only after fusion has started.
      cargo.current.position.x = centerX + 1.75 * release;
      cargo.current.rotation.y = 0.32 * release;
    }
  });

  return (
    <group>
      {/* A gentle difference between cytoplasm (left) and extracellular fluid
          (right). In plant cells this right-hand region leads into the apoplast. */}
      <mesh position={[1.15, 0, -0.22]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial
          color={plant ? "#8ebc9c" : "#78aaa2"}
          transparent
          opacity={plant ? 0.12 : 0.085}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <LipidBilayer />
      <mesh position={[0.78, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.6, 6.4]} />
        <meshPhysicalMaterial
          color="#63b7a6"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
          roughness={0.5}
        />
      </mesh>
      <mesh
        ref={ripple}
        position={[0.705, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        visible={false}
      >
        <circleGeometry args={[0.4, 48]} />
        <meshBasicMaterial
          color="#a1e6d4"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {plant && (
        <mesh position={[2.75, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.3, 6.4]} />
          <meshStandardMaterial
            color="#82b78b"
            transparent
            opacity={0.1}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      <mesh ref={vesicle} position={[-1.65, 0, 0]} scale={0.37}>
        <sphereGeometry args={[1, 40, 32]} />
        <meshPhysicalMaterial
          color="#e6b7d9"
          roughness={0.32}
          transparent
          opacity={0.58}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={cargo} position={[-1.65, 0, 0]}>
        {Array.from({ length: 22 }, (_, i) => {
          const a = i * 2.39996;
          const r = 0.13 + 0.045 * Math.sin(i * 1.7);
          return (
            <Bead
              key={i}
              position={[
                Math.cos(a) * r,
                Math.sin(a * 0.9) * r,
                Math.sin(a) * r,
              ]}
              color={i % 3 === 0 ? "#f7d2f1" : "#dca9e4"}
              radius={0.047}
            />
          );
        })}
      </group>
    </group>
  );
}

// The first two scenes deliberately share one nuclear atmosphere.
// All molecular motion happens through Three.js refs, not React state updates.
function NuclearAtmosphere({ paused }: { paused: boolean }) {
  const particles = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      const a = i * 2.399963229728653;
      const r = 1.8 + (i % 13) * 0.22;
      data[i * 3] = Math.cos(a) * r;
      data[i * 3 + 1] = Math.sin(i * 1.31) * 2.7;
      data[i * 3 + 2] = -2.2 - (i % 9) * 0.23;
    }
    return data;
  }, []);
  useFrame((_, delta) => {
    if (!paused && particles.current)
      particles.current.rotation.y += delta * 0.012;
  });
  return (
    <group>
      <mesh position={[0, 0, -4.1]} scale={[7.8, 5.2, 0.15]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshBasicMaterial
          color="#8b65b1"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[-2.9, 0.5, -2.5]} scale={[1.9, 3.7, 0.7]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshBasicMaterial
          color="#b79acb"
          transparent
          opacity={0.045}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[3.1, -0.3, -2.8]} scale={[1.7, 3.4, 0.7]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshBasicMaterial
          color="#c8a6de"
          transparent
          opacity={0.045}
          depthWrite={false}
        />
      </mesh>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#e7c9ff"
          size={0.035}
          transparent
          opacity={0.48}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <pointLight
        position={[-2.5, 2, 1]}
        color="#d9a3ff"
        intensity={4}
        distance={10}
      />
      <pointLight
        position={[2, -2, -1]}
        color="#a99bf6"
        intensity={3}
        distance={10}
      />
    </group>
  );
}

function CytoplasmAtmosphere({
  plant,
  paused,
}: {
  plant: boolean;
  paused: boolean;
}) {
  const particles = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(110 * 3);
    for (let i = 0; i < 110; i++) {
      const angle = i * 2.399963;
      const r = 1.8 + (i % 17) * 0.38;
      arr[i * 3] = 6.8 + Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(i * 1.17) * 3.8;
      arr[i * 3 + 2] = -2 - (i % 8) * 0.3;
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (!paused && particles.current)
      particles.current.rotation.z += delta * 0.004;
  });
  return (
    <group>
      <mesh position={[6.7, 0, -5]} scale={[8, 5.5, 0.2]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshBasicMaterial
          color={plant ? "#6b9d83" : "#6d9cad"}
          transparent
          opacity={0.075}
          depthWrite={false}
        />
      </mesh>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={plant ? "#b5e9c7" : "#c3e4ee"}
          size={0.035}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </points>
      <pointLight
        position={[6.8, 2, 2]}
        color={plant ? "#8fd4b1" : "#92cce2"}
        intensity={5}
        distance={8}
      />
    </group>
  );
}

function NuclearSequence({ timeline }: { timeline: React.RefObject<number> }) {
  const dna = useRef<THREE.Group>(null);
  const enzyme = useRef<THREE.Group>(null);
  const message = useRef<THREE.Group>(null);
  const envelope = useRef<THREE.Group>(null);
  const pore = useRef<THREE.Group>(null);
  const rungs = useRef<THREE.Group[]>([]);
  const strands = useRef<THREE.Group[]>([]);
  const letters = useRef<THREE.Mesh[]>([]);
  const count = 35;
  const nucleusParts = useRef<THREE.Group>(null);
  const materialBase = useRef(new WeakMap<THREE.Material, number>());

  useFrame((_, delta) => {
    const fullTime = timeline.current;
    // Nuclear DNA and envelope fade as the camera enters cytoplasm.
    // The mRNA is deliberately outside this group, so it remains visible.
    const nuclearFade = 1 - THREE.MathUtils.smoothstep(fullTime, 17.3, 20.6);
    if (nucleusParts.current) {
      nucleusParts.current.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        for (const material of materials) {
          if (!materialBase.current.has(material))
            materialBase.current.set(material, material.opacity);
          material.transparent = true;
          material.opacity =
            (materialBase.current.get(material) ?? 1) * nuclearFade;
          material.depthWrite = nuclearFade > 0.98;
        }
      });
    }
    const time = Math.min(9, fullTime);
    const exitTime = Math.max(0, fullTime - 9);
    const copied = THREE.MathUtils.clamp((time - 1.2) / 7.5, 0, 1);
    const head = Math.min(count - 1, Math.floor(copied * count));
    const opening = THREE.MathUtils.smoothstep(time, 0.4, 1.8);
    if (dna.current) dna.current.rotation.y = Math.sin(time * 0.12) * 0.12;
    for (let i = 0; i < count; i++) {
      const spread = opening * Math.max(0, 1 - Math.abs(i - head) / 6);
      if (rungs.current[i]) rungs.current[i].scale.x = 1 + spread * 0.75;
      if (strands.current[i]) strands.current[i].scale.x = 1 + spread * 0.75;
      if (letters.current[i])
        letters.current[i].visible = time > 1.2 && i <= head;
    }
    if (enzyme.current) {
      enzyme.current.position.y = -1.45 + copied * 2.9;
      enzyme.current.visible = fullTime < 9.2 && time > 0.65;
    }
    if (message.current) {
      message.current.visible = time > 1.2;
      // The exact same RNA object detaches and travels through the pore.
      const travel = THREE.MathUtils.smoothstep(exitTime, 0.35, 7.2);
      const toRibosome = THREE.MathUtils.smoothstep(exitTime, 8, 12);
      message.current.position.set(
        0.78 + travel * 3.95 + toRibosome * 2.15,
        Math.sin(travel * Math.PI) * 0.16,
        0.45,
      );
      message.current.rotation.z = (travel * -Math.PI) / 2;
      message.current.scale.setScalar(1 - travel * 0.1);
    }
    const reveal = THREE.MathUtils.smoothstep(exitTime, 0, 2.2);
    if (envelope.current) {
      envelope.current.scale.setScalar(Math.max(0.001, reveal));
      envelope.current.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        for (const material of materials) {
          if (!materialBase.current.has(material))
            materialBase.current.set(material, material.opacity);
          material.transparent = true;
          material.opacity =
            (materialBase.current.get(material) ?? 1) * nuclearFade;
          material.depthWrite = false;
        }
      });
    }
    if (pore.current)
      pore.current.rotation.y = Math.sin(exitTime * 0.24) * 0.06;
  });

  return (
    <group>
      <group ref={nucleusParts}>
        <group ref={dna} position={[-0.75, 0, 0]}>
          {Array.from({ length: count }, (_, i) => {
            const y = -1.45 + i * (2.9 / (count - 1));
            const angle = i * 0.39;
            const x = Math.cos(angle) * 0.43;
            const z = Math.sin(angle) * 0.43;
            return (
              <group key={i}>
                <group
                  ref={(el) => {
                    if (el) strands.current[i] = el;
                  }}
                >
                  <Bead position={[x, y, z]} color="#edb6e8" radius={0.065} />
                  <Bead position={[-x, y, -z]} color="#a1dcf1" radius={0.065} />
                </group>
                <group
                  ref={(el) => {
                    if (el) rungs.current[i] = el;
                  }}
                >
                  <mesh
                    position={[0, y, 0]}
                    rotation={[0, -angle, Math.PI / 2]}
                  >
                    <cylinderGeometry args={[0.019, 0.019, 0.86, 6]} />
                    <meshStandardMaterial
                      color={i % 2 ? "#f4d8a6" : "#c7e2cc"}
                    />
                  </mesh>
                </group>
              </group>
            );
          })}
        </group>
        <group ref={enzyme} position={[-0.75, -1.45, 0.2]} visible={false}>
          <mesh scale={[0.55, 0.36, 0.52]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial
              color="#edc4ff"
              emissive="#b768ef"
              emissiveIntensity={0.5}
            />
          </mesh>
          <pointLight color="#e6a9ff" intensity={4} distance={2} />
        </group>
      </group>
      <group ref={message} position={[0.78, 0, 0.45]} visible={false}>
        {Array.from({ length: count }, (_, i) => {
          const y = -1.45 + i * (2.9 / (count - 1));
          return (
            <mesh
              key={i}
              ref={(el) => {
                if (el) letters.current[i] = el;
              }}
              position={[
                Math.sin(i * 0.62) * 0.17,
                y,
                Math.cos(i * 0.62) * 0.12,
              ]}
            >
              <sphereGeometry args={[0.075, 10, 8]} />
              <meshStandardMaterial
                color="#ffe6a0"
                emissive="#f7b64d"
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
        <pointLight color="#ffda88" intensity={2.5} distance={3} />
      </group>
      <group ref={envelope} position={[3.45, 0, -0.3]} scale={0.001}>
        {/* A ring-shaped nuclear envelope with an actual opening for the pore.
            Its plane is perpendicular to the RNA travel direction (X). */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.84, 3.6, 64]} />
          <meshStandardMaterial
            color="#bba1d4"
            transparent
            opacity={0.17}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0.12, 0, 0]}>
          <ringGeometry args={[0.84, 3.6, 64]} />
          <meshStandardMaterial
            color="#bba1d4"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <group ref={pore} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <torusGeometry args={[0.67, 0.14, 16, 48]} />
            <meshStandardMaterial
              color="#d5b1f0"
              emissive="#8e53c1"
              emissiveIntensity={0.38}
            />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <Bead
              key={i}
              position={[
                Math.cos((i * Math.PI) / 4) * 0.67,
                Math.sin((i * Math.PI) / 4) * 0.67,
                0,
              ]}
              color="#e7c6ff"
              radius={0.075}
            />
          ))}
        </group>
        <pointLight color="#d5a2ff" intensity={6} distance={3.2} />
      </group>
    </group>
  );
}

function CinematicCamera({
  stage,
  paused,
  timeline,
}: {
  stage: number;
  paused: boolean;
  timeline: React.RefObject<number>;
}) {
  const elapsed = useRef(0);
  const previousStage = useRef(stage);
  useFrame(({ camera }, delta) => {
    if (stage <= 2) {
      const returningFromLaterOrganelle =
        previousStage.current > 2 && stage === 2;
      previousStage.current = stage;
      const t = timeline.current;
      const follow = THREE.MathUtils.smoothstep(Math.max(0, t - 9), 0.35, 7.2);
      const approach = THREE.MathUtils.smoothstep(t, 0, 2.2);
      const x =
        THREE.MathUtils.lerp(
          0,
          0.8 + follow * 3.1,
          THREE.MathUtils.smoothstep(t, 8.6, 10.0),
        ) +
        THREE.MathUtils.smoothstep(t, 17, 21) * 2.55;
      const desired = new THREE.Vector3(
        x,
        0.12,
        THREE.MathUtils.lerp(8.5, 5.4, approach) + follow * 1.1,
      );
      if (returningFromLaterOrganelle) {
        camera.position.copy(desired);
      } else {
        camera.position.lerp(desired, Math.min(1, delta * 2.5));
      }
      camera.lookAt(x, 0, 0);
      return;
    }
    if (previousStage.current !== stage) {
      previousStage.current = stage;
      elapsed.current = 0;
    }
    if (!paused) elapsed.current += Math.min(delta, 0.05);
    const t = elapsed.current;
    const entrance = THREE.MathUtils.smoothstep(t, 0, 2.2);
    const orbit = Math.sin(t * 0.22 + stage * 0.8);
    const distance = THREE.MathUtils.lerp(8.5, 5.1, entrance);
    const desired = new THREE.Vector3(
      orbit * 0.55,
      0.12 + Math.sin(t * 0.17) * 0.22,
      distance,
    );
    camera.position.lerp(
      desired,
      Math.min(1, delta * (stage === 3 ? 0.85 : 2.2)),
    );
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function MolecularScene({
  stage,
  paused,
  cellType,
}: {
  stage: number;
  paused: boolean;
  cellType: CellType;
}) {
  const elapsed = useRef(0);
  const timeline = useRef(0);
  const previousNuclearStage = useRef(stage);
  const nuclearDirection = useRef(1);
  const [progress, setProgress] = useState(0);
  const sceneLight = useRef<THREE.PointLight>(null);
  const nuclearColor = useMemo(() => new THREE.Color("#241a39"), []);
  const cytoplasmColor = useMemo(
    () => new THREE.Color(cellType === "plant" ? "#294e49" : "#253f4c"),
    [cellType],
  );
  useFrame(({ scene }, delta) => {
    // Keep the nucleus purple while the mRNA exits. Only then blend
    // gradually into the surrounding animal/plant cytoplasm.
    const blend =
      stage < 2
        ? 0
        : stage === 2
          ? THREE.MathUtils.smoothstep(timeline.current, 17, 21)
          : 1;
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(nuclearColor).lerp(cytoplasmColor, blend);
    }
    if (sceneLight.current) {
      sceneLight.current.color
        .set("#c28bea")
        .lerp(
          new THREE.Color(cellType === "plant" ? "#8cd5ac" : "#82c9d6"),
          blend,
        );
      sceneLight.current.intensity = THREE.MathUtils.lerp(4, 7, blend);
    }
    // The timeline belongs to this component, so React does not see a
    // mutation of a ref passed through props.
    if (stage < 2) {
      if (previousNuclearStage.current !== stage) {
        nuclearDirection.current = stage === 0 ? -1 : 1;
        previousNuclearStage.current = stage;
      }
      if (!paused) {
        const limit = nuclearDirection.current > 0 ? (stage === 0 ? 9 : 17) : 0;
        const speed = nuclearDirection.current < 0 ? 1.5 : 1;
        timeline.current = THREE.MathUtils.clamp(
          timeline.current +
            Math.min(delta, 0.05) * speed * nuclearDirection.current,
          0,
          17,
        );
        if (nuclearDirection.current > 0 && timeline.current > limit) {
          timeline.current = limit;
        }
      }
    }
    if (stage === 2) {
      // Stage 3 begins AFTER nuclear export, even when the visitor skips ahead.
      // The scene stays mounted, preserving the RNA rather than replaying DNA.
      if (previousNuclearStage.current !== stage) {
        // Returning from ER/Golgi should show the already-docked mRNA,
        // never replay the nuclear sequence.
        timeline.current =
          previousNuclearStage.current > 2
            ? 28
            : Math.max(17, timeline.current);
        previousNuclearStage.current = stage;
        elapsed.current = 0;
      }
      if (!paused) {
        timeline.current = Math.min(
          28,
          timeline.current + Math.min(delta, 0.05),
        );
      }
    }
    if (stage > 2 && previousNuclearStage.current !== stage) {
      elapsed.current = 0;
      previousNuclearStage.current = stage;
    }
    if (!paused) {
      elapsed.current += Math.min(delta, 0.05);
      // Translation begins only once the mRNA has docked with the ribosome.
      const next =
        stage === 2
          ? THREE.MathUtils.clamp((timeline.current - 21) / 7, 0, 1)
          : Math.min(1, elapsed.current / 7);
      if (stage >= 2)
        setProgress((old) => (Math.abs(old - next) > 0.025 ? next : old));
    }
  });
  return (
    <>
      <color attach="background" args={["#241a39"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <pointLight
        ref={sceneLight}
        position={[-3, -2, 4]}
        intensity={4}
        color="#c28bea"
      />
      {stage < 2 && <NuclearAtmosphere paused={paused} />}
      {stage === 2 && (
        <CytoplasmAtmosphere plant={cellType === "plant"} paused={paused} />
      )}
      <group scale={stage < 2 ? 0.94 : 1}>
        {stage <= 2 && <NuclearSequence timeline={timeline} />}
        {stage === 2 && (
          <group position={[6.85, 0, 0]}>
            <Ribosome progress={progress} />
          </group>
        )}
        {stage === 3 && <ERArrival progress={progress} paused={paused} />}
        {stage === 4 && <Golgi progress={progress} paused={paused} />}
        {stage === 5 && (
          <Delivery progress={progress} plant={cellType === "plant"} />
        )}
      </group>
      <CinematicCamera stage={stage} paused={paused} timeline={timeline} />
      <OrbitControls enablePan={false} enableZoom={false} enableDamping />
    </>
  );
}

export default function ProteinJourneyExplorer({ cellType, onClose }: Props) {
  const [stage, setStage] = useState(0);
  const [restartCount, setRestartCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  // Desktop always displays the explanation. Mobile/tablet may collapse it.
  // Landscape phones start collapsed to preserve room for the animation.
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1023px)");
    const landscape = window.matchMedia(
      "(orientation: landscape) and (max-height: 520px)",
    );
    const sync = () => {
      setIsDesktop(!mobile.matches);
      if (!mobile.matches) setExpanded(true);
      else if (landscape.matches) setExpanded(false);
    };
    sync();
    mobile.addEventListener("change", sync);
    landscape.addEventListener("change", sync);
    return () => {
      mobile.removeEventListener("change", sync);
      landscape.removeEventListener("change", sync);
    };
  }, []);
  const [advanced, setAdvanced] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<number | null>(null);
  const transitionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const changeStage = (next: number) => {
    if (transitioning || (next === stage && next !== 0)) return;
    // Tuck away the explanation whenever an animation starts or changes stage.
    if (window.matchMedia("(max-width: 1023px)").matches) setExpanded(false);
    transitionTimers.current.forEach(clearTimeout);
    // Keep the Canvas and RNA molecule alive between the DNA and pore stages.
    // A normal stage switch would reset the molecule and hide the journey.
    if (stage < 3 && next < 3 && next !== stage) {
      setStage(next);
      setPaused(false);
      setAdvanced(false);
      return;
    }
    // The protein chain remains in view between ribosome and rough ER.
    // No full-screen title or reset in either direction.
    if ((stage === 2 && next === 3) || (stage === 3 && next === 2)) {
      setStage(next);
      setPaused(false);
      setAdvanced(false);
      return;
    }
    // The folded protein travels in a vesicle directly to Golgi.
    // Do not interrupt the journey with the old pink title tunnel.
    if ((stage === 3 && next === 4) || (stage === 4 && next === 3)) {
      setStage(next);
      setPaused(false);
      setAdvanced(false);
      return;
    }
    // Golgi to secretion (and back): keep the molecular scene visible.
    // No flashy title tunnel interrupts the vesicle's journey.
    if ((stage === 4 && next === 5) || (stage === 5 && next === 4)) {
      setStage(next);
      setPaused(false);
      setAdvanced(false);
      return;
    }
    // Other later transitions retain their existing overlay.
    setTransitioning(true);
    setTransitionTarget(next);
    setPaused(false);
    transitionTimers.current = [
      setTimeout(() => {
        setStage(next);
        if (next === stage) setRestartCount((n) => n + 1);
        setAdvanced(false);
      }, 500),
      setTimeout(() => {
        setTransitioning(false);
        setTransitionTarget(null);
      }, 1550),
    ];
  };
  useEffect(() => () => transitionTimers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  const current = STEPS[stage];
  const location = LOCATIONS[stage];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Proteinets resa"
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#241a39] text-[#eaf4f4]"
      style={{ height: "100dvh" }}
    >
      <header className="protein-header z-20 flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#1a1b31] px-3 py-2 sm:px-6 sm:py-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-amber-200/80">
            The Unfolding Universe ·{" "}
            {cellType === "plant" ? "Växtcellen" : "Djurcellen"}
          </p>
          <h2 className="truncate font-serif text-lg sm:text-2xl">
            Proteinets resa
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Stäng proteinets resa"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </header>
      <div className="protein-main relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="protein-viewport relative min-h-0 flex-1 overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 5.8], fov: 42 }}
            dpr={[1, 1.6]}
            gl={{ antialias: true, alpha: false }}
          >
            <MolecularScene
              key={`protein-journey-${restartCount}`}
              stage={stage}
              paused={paused}
              cellType={cellType}
            />
          </Canvas>
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                stage < 3
                  ? "radial-gradient(ellipse at center, transparent 25%, rgba(38,35,57,.12) 100%)"
                  : `radial-gradient(ellipse at center, transparent 25%, ${location.tint}15 100%)`,
            }}
          />
          {stage !== 5 && (
            <div
              key={`place-${stage}`}
              className="protein-place pointer-events-none absolute left-3 top-3 z-20 max-w-[calc(100%-24px)] rounded-2xl border border-white/20 bg-[#21182f]/85 px-4 py-3 shadow-2xl backdrop-blur-lg sm:left-6 sm:top-6 sm:px-6 sm:py-4"
            >
              <div
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em]"
                style={{ color: location.tint }}
              >
                <span
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{ background: location.tint }}
                />
                DU BEFINNER DIG I
              </div>
              <div
                className="protein-place-title mt-1 font-serif text-[clamp(19px,3.2vw,36px)] font-bold tracking-[.04em] text-white"
                style={{ textShadow: `0 0 28px ${location.tint}88` }}
              >
                {location.place}
              </div>
              <div className="protein-place-action mt-1 text-xs text-slate-200 sm:text-sm">
                {location.action}
              </div>
            </div>
          )}
          <div className="protein-viewport-hint pointer-events-none absolute bottom-4 left-4 z-20 rounded-full border border-white/10 bg-[#071725]/70 px-3 py-1.5 text-[10px] text-slate-200">
            {location.number} / 06 · Dra för att rotera
          </div>
          {transitioning && (
            <div
              className="protein-transition pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden"
              style={
                {
                  "--travel-color": LOCATIONS[transitionTarget ?? stage].tint,
                } as React.CSSProperties
              }
            >
              <div className="protein-tunnel absolute inset-[-70%]" />
              <div className="protein-transition-label relative z-10 px-5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[.35em] text-white/75">
                  Vi reser vidare till
                </p>
                <p className="mt-3 font-serif text-[clamp(24px,5vw,56px)] font-bold uppercase tracking-wider text-white">
                  {(transitionTarget ?? stage) === 5
                    ? "PROTEINET LEVERERAS"
                    : LOCATIONS[transitionTarget ?? stage].place}
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {LOCATIONS[transitionTarget ?? stage].action}
                </p>
              </div>
            </div>
          )}
        </div>
        <aside className="protein-aside relative z-40 flex max-h-[min(48dvh,340px)] min-h-0 shrink-0 flex-col border-t border-white/15 bg-[#1c2134]/95 lg:max-h-none lg:w-[min(390px,34vw)] lg:border-l lg:border-t-0">
          <div className="protein-aside-heading flex shrink-0 items-center justify-between gap-2 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                {current.short}
              </p>
              <h3 className="font-serif text-base sm:text-xl">
                {current.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={expanded ? "Dölj förklaring" : "Visa förklaring"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 lg:hidden"
            >
              {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
          {(expanded || isDesktop) && (
            <div className="protein-aside-body min-h-0 overflow-y-auto overscroll-contain px-4 pb-3 text-sm leading-relaxed">
              <p className="text-slate-200">{current.simple}</p>
              <button
                type="button"
                onClick={() => setAdvanced((v) => !v)}
                className="relative z-50 mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg px-1 text-xs font-semibold text-teal-200 hover:bg-white/10"
              >
                <Info size={14} />
                {advanced ? "Dölj fördjupning" : "Lär dig mer"}
              </button>
              {advanced && (
                <p className="mt-2 text-xs leading-5 text-slate-300">
                  {current.detail}
                </p>
              )}
              <p className="mt-3 border-l-2 border-amber-300/50 pl-3 text-xs leading-5 text-amber-100/85">
                {current.note}
              </p>
            </div>
          )}
        </aside>
      </div>
      <footer className="protein-footer relative z-40 shrink-0 border-t border-white/10 bg-[#191e31] px-3 py-2 sm:px-6 sm:py-3">
        <div className="protein-stage-tabs mx-auto flex max-w-5xl items-center gap-1.5 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button
              key={s.short}
              type="button"
              onClick={() => changeStage(i)}
              disabled={transitioning}
              aria-current={i === stage ? "step" : undefined}
              className={`min-w-0 flex-1 whitespace-nowrap rounded-lg px-2 py-2 text-[10px] font-semibold sm:text-xs ${i === stage ? "bg-teal-300 text-[#09242b]" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
            >
              {s.short}
            </button>
          ))}
        </div>
        <div className="protein-footer-controls mx-auto mt-2 flex max-w-5xl items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => changeStage(Math.max(0, stage - 1))}
            disabled={stage === 0 || transitioning}
            aria-label="Föregående steg"
            className="protein-prev inline-flex min-h-10 items-center gap-1 rounded-xl border border-white/20 px-3 text-xs disabled:opacity-35"
          >
            <ArrowLeft size={15} />{" "}
            <span className="protein-prev-label">Föregående</span>
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (paused && window.matchMedia("(max-width: 1023px)").matches)
                  setExpanded(false);
                setPaused((v) => !v);
              }}
              aria-label={paused ? "Fortsätt animation" : "Pausa animation"}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20"
            >
              {paused ? <Play size={17} /> : <Pause size={17} />}
            </button>
            <button
              type="button"
              onClick={() => changeStage(0)}
              aria-label="Börja om"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20"
            >
              <RotateCcw size={17} />
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              changeStage(stage === STEPS.length - 1 ? 0 : stage + 1)
            }
            disabled={transitioning}
            aria-label={
              stage === STEPS.length - 1 ? "Börja om från DNA" : "Nästa steg"
            }
            className="protein-next inline-flex min-h-10 items-center gap-1 rounded-xl bg-teal-300 px-3 text-xs font-bold text-[#09242b]"
          >
            <span className="protein-next-label">
              {stage === STEPS.length - 1 ? "Börja om" : "Nästa steg"}
            </span>
            <ArrowRight size={15} />
          </button>
        </div>
      </footer>
      <style jsx global>{`
        @keyframes proteinArrival {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.92);
            filter: blur(9px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        .protein-place {
          animation: proteinArrival 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        @keyframes proteinTravel {
          0% {
            opacity: 0;
            transform: scale(0.35) rotate(-20deg);
          }
          22% {
            opacity: 1;
          }
          65% {
            opacity: 1;
            transform: scale(1.5) rotate(12deg);
          }
          100% {
            opacity: 0;
            transform: scale(3.5) rotate(28deg);
          }
        }
        .protein-tunnel {
          background:
            repeating-conic-gradient(
              from 0deg,
              transparent 0deg 14deg,
              var(--travel-color) 17deg 20deg,
              transparent 24deg 36deg
            ),
            radial-gradient(
              circle,
              #ffffff 0%,
              var(--travel-color) 12%,
              #091723 58%
            );
          filter: blur(12px);
          animation: proteinTravel 1.55s ease-in-out both;
        }
        @keyframes proteinTransitionLabel {
          0% {
            opacity: 0;
            transform: scale(0.6);
            filter: blur(12px);
          }
          28%,
          65% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
            filter: blur(10px);
          }
        }
        .protein-transition-label {
          animation: proteinTransitionLabel 1.55s ease-in-out both;
          text-shadow: 0 3px 35px #000;
        }
        @media (prefers-reduced-motion: reduce) {
          .protein-place,
          .protein-tunnel,
          .protein-transition-label {
            animation: none;
          }
        }
        /* Portrait phones: prioritize the molecular scene, not the location banner. */
        @media (max-width: 767px) and (orientation: portrait) {
          .protein-header {
            padding: 6px 12px;
          }
          .protein-header h2 {
            font-size: 17px;
            line-height: 1.2;
          }
          .protein-header button {
            width: 34px;
            height: 34px;
          }
          .protein-place {
            left: 10px;
            top: 10px;
            padding: 8px 11px;
            max-width: min(70%, 240px);
            border-radius: 12px;
            background: rgba(33, 24, 47, 0.72);
          }
          .protein-place > div:first-child {
            font-size: 8px;
            letter-spacing: 0.12em;
          }
          .protein-place-title {
            font-size: 16px !important;
            line-height: 1.1;
            letter-spacing: 0;
          }
          .protein-place-action {
            font-size: 10px;
            line-height: 1.3;
          }
          .protein-viewport-hint {
            bottom: 7px;
            left: 9px;
            font-size: 9px;
          }
          .protein-aside {
            max-height: min(29dvh, 205px);
          }
          .protein-aside-heading {
            padding: 7px 12px;
          }
          .protein-aside-heading h3 {
            font-size: 15px;
            line-height: 1.2;
          }
          .protein-aside-heading button {
            width: 30px;
            height: 30px;
          }
          .protein-aside-body {
            padding: 0 12px 8px;
            font-size: 12px;
            line-height: 1.45;
          }
          .protein-aside-body button {
            margin-top: 4px;
            min-height: 26px;
          }
          .protein-aside-body p:last-child {
            margin-top: 5px;
          }
          .protein-footer {
            padding: 5px 8px;
          }
          .protein-stage-tabs {
            gap: 4px;
          }
          .protein-stage-tabs button {
            padding: 7px 4px;
            font-size: 9px;
          }
          .protein-footer-controls {
            margin-top: 4px;
          }
          .protein-footer-controls button {
            min-height: 34px;
          }
          .protein-footer-controls > div > button[aria-label] {
            width: 34px;
            height: 34px;
            flex-shrink: 0;
          }
          .protein-prev,
          .protein-next {
            padding-left: 8px;
            padding-right: 8px;
            width: auto;
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
        /* Landscape phones: make the 3D scene the full main area.
           Information becomes a small overlay instead of consuming its height. */
        @media (max-height: 520px) and (orientation: landscape) {
          .protein-header {
            padding: 3px 12px;
            min-height: 37px;
          }
          .protein-header p {
            font-size: 8px;
          }
          .protein-header h2 {
            font-size: 15px;
            line-height: 1.1;
          }
          .protein-header button {
            width: 30px;
            height: 30px;
          }
          .protein-main {
            display: block;
            position: relative;
          }
          .protein-viewport {
            position: absolute;
            inset: 0;
          }
          .protein-place {
            left: 8px;
            top: 8px;
            max-width: 210px;
            padding: 6px 9px;
            border-radius: 10px;
            background: rgba(33, 24, 47, 0.68);
          }
          .protein-place > div:first-child {
            font-size: 8px;
            letter-spacing: 0.1em;
          }
          .protein-place-title {
            font-size: 15px !important;
            line-height: 1.1;
          }
          .protein-place-action {
            font-size: 9px;
            line-height: 1.2;
          }
          .protein-viewport-hint {
            left: 8px;
            bottom: 6px;
            padding: 3px 7px;
            font-size: 8px;
          }
          .protein-aside {
            position: absolute;
            top: 7px;
            right: 8px;
            width: min(38vw, 265px);
            max-height: calc(100% - 14px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            background: rgba(28, 33, 52, 0.88);
            backdrop-filter: blur(10px);
            overflow: hidden;
          }
          .protein-aside-heading {
            padding: 5px 8px;
          }
          .protein-aside-heading p {
            font-size: 8px;
          }
          .protein-aside-heading h3 {
            font-size: 12px;
            line-height: 1.2;
          }
          .protein-aside-heading button {
            width: 26px;
            height: 26px;
          }
          .protein-aside-body {
            padding: 0 8px 6px;
            font-size: 10px;
            line-height: 1.3;
          }
          .protein-aside-body button {
            margin-top: 2px;
            min-height: 22px;
            font-size: 10px;
          }
          .protein-aside-body p:last-child {
            margin-top: 3px;
          }
          /* Single compact footer row: navigation no longer steals a second
             full row from the animation on a real landscape phone. */
          .protein-footer {
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 5px 9px;
          }
          .protein-stage-tabs {
            display: flex;
            flex: 1 1 auto;
            min-width: 0;
            max-width: none;
            gap: 3px;
            padding: 0;
            margin: 0;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .protein-stage-tabs::-webkit-scrollbar {
            display: none;
          }
          .protein-stage-tabs button {
            flex: 1 0 auto;
            padding: 6px 5px;
            font-size: 9px;
            min-height: 30px;
          }
          .protein-footer-controls {
            display: flex;
            flex: 0 0 auto;
            width: auto;
            margin: 0;
            gap: 5px;
          }
          .protein-footer-controls > div {
            gap: 4px;
          }
          .protein-footer-controls button {
            height: 30px;
            min-height: 30px;
            font-size: 10px;
            border-radius: 9px;
          }
          .protein-footer-controls > div > button[aria-label] {
            width: 30px;
            height: 30px;
            flex-shrink: 0;
          }
          .protein-prev,
          .protein-next {
            padding-left: 7px;
            padding-right: 7px;
            width: auto;
            white-space: nowrap;
          }
          .protein-prev-label,
          .protein-next-label {
            display: none;
          }
          .protein-aside-body {
            overflow-y: auto;
          }
          .protein-aside:not(:has(.protein-aside-body)) {
            max-height: 54px;
          }
        }
      `}</style>
    </div>
  );
}
