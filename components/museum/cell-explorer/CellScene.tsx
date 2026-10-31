"use client";

import {
  Suspense,
  useMemo,
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
} from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import {
  X,
  Wind,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
  Menu,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Compass,
  Info,
} from "lucide-react";
import Link from "next/link";
import {
  exhibitCategories,
  museumExhibits,
} from "@/app/museum/museum-exhibits";
import * as THREE from "three";
import SharedNucleus from "./SharedNucleus";
import {
  EndoplasmicReticulum,
  GolgiApparatus,
} from "./SharedSecretoryOrganelles";

type OrganelleId = "nucleus" | "mitochondria" | "er" | "golgi" | "ribosomes";

type OrganelleInfo = {
  title: string;
  subtitle: string;
  description: string;
  color: string;
};

const organelles: Record<OrganelleId, OrganelleInfo> = {
  nucleus: {
    title: "Cellkärnan",
    subtitle: "Cellens informationscentrum",
    description:
      "Cellkärnan innehåller större delen av cellens DNA, organiserat som kromatin. Kärnmembranet har porer som reglerar transporten av ämnen mellan kärnan och cytoplasman.",
    color: "#C9A5F0",
  },
  mitochondria: {
    title: "Mitokondrier",
    subtitle: "Cellens energiförsörjning",
    description:
      "I mitokondrierna sker viktiga delar av cellandningen. Energi från näringsämnen används för att bilda ATP, som cellen behöver för många av sina aktiviteter.",
    color: "#F2B27C",
  },
  er: {
    title: "Endoplasmatiskt nätverk",
    subtitle: "Cellens membrannätverk",
    description:
      "Det endoplasmatiska nätverket består av sammanhängande membran. Det korniga nätverket hjälper till att tillverka och bearbeta proteiner, medan det släta bland annat bildar lipider.",
    color: "#7DB8CE",
  },
  ribosomes: {
    title: "Ribosomer",
    subtitle: "Cellens proteinbyggare",
    description:
      "Ribosomer bygger proteiner genom att läsa instruktioner från mRNA. Fria ribosomer finns i cytosolen, medan bundna ribosomer sitter på det korniga endoplasmatiska nätverket. De saknar eget membran och är mycket mindre än de flesta andra cellstrukturer. Storleken är överdriven här för att de ska gå att upptäcka.",
    color: "#C4E4DB",
  },
  golgi: {
    title: "Golgiapparaten",
    subtitle: "Cellens sorteringsstation",
    description:
      "Golgiapparaten bearbetar, sorterar och skickar vidare proteiner och lipider till rätt platser i eller utanför cellen.",
    color: "#E6B0D2",
  },
};

function createOrganicSphere(radius: number) {
  const geometry = new THREE.SphereGeometry(radius, 64, 48);
  const position = geometry.attributes.position;

  const point = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i);

    const x = point.x / radius;
    const y = point.y / radius;
    const z = point.z / radius;

    const deformation =
      1 +
      0.045 * Math.sin(x * 5 + y * 3) * Math.cos(z * 4) +
      0.025 * Math.sin(y * 9 + z * 5);

    point.multiplyScalar(deformation);

    position.setXYZ(i, point.x, point.y, point.z);
  }

  geometry.computeVertexNormals();

  return geometry;
}

function CellMembrane({ motion }: { motion: boolean }) {
  const geometry = useMemo(() => createOrganicSphere(2.2), []);
  const shell = useRef<THREE.Mesh>(null);
  const rim = useRef<THREE.Mesh>(null);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = motion ? 1 + Math.sin(t * 0.48) * 0.008 : 1;
    const scaleY = 1 + (pulse - 1) * 0.7;
    shell.current?.scale.set(pulse, scaleY, pulse);
    rim.current?.scale.set(pulse * 1.006, scaleY * 1.006, pulse * 1.006);
  });
  return (
    <group>
      <mesh
        ref={shell}
        geometry={geometry}
        raycast={() => null}
        renderOrder={2}
      >
        <meshPhysicalMaterial
          color="#6296A5"
          transparent
          opacity={0.12}
          roughness={0.78}
          metalness={0}
          depthWrite={false}
          side={THREE.FrontSide}
          emissive="#164457"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Back-facing shell: gives the membrane a restrained peripheral rim
          without placing a bright opaque sphere in front of organelles. */}
      <mesh ref={rim} geometry={geometry} raycast={() => null} renderOrder={1}>
        <meshBasicMaterial
          color="#6DA9B6"
          transparent
          opacity={0.14}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Fine nuclear pores and softly bundled chromatin, visible through the envelope.
function Nucleus({
  selected,
  onSelect,
  motion = true,
  showInside = false,
}: {
  selected: boolean;
  onSelect: () => void;
  motion?: boolean;
  showInside?: boolean;
}) {
  return (
    <SharedNucleus
      position={[-0.35, 0.2, 0]}
      selected={selected}
      onSelect={onSelect}
      motion={motion}
      showInside={showInside}
    />
  );
}

// Complete, subtly irregular outer membrane. No permanent cutaway.
// Vertex colours create restrained biological mottling instead of a plastic egg.
function makeMitoGeometry() {
  const geometry = new THREE.SphereGeometry(1, 72, 48);
  const positions = geometry.attributes.position;
  const colors: number[] = [];
  const p = new THREE.Vector3();
  const base = new THREE.Color("#B77B72");
  for (let i = 0; i < positions.count; i++) {
    p.fromBufferAttribute(positions, i);
    const nx = p.x;
    const ny = p.y;
    const nz = p.z;
    const fine = Math.sin(nx * 19 + ny * 13) * Math.cos(nz * 17 - nx * 8);
    const broad = Math.sin(nx * 6 + nz * 4) * Math.cos(ny * 7);
    const deformation = 1 + 0.026 * broad + 0.007 * fine;
    p.set(nx * 0.49, ny * 0.245, nz * 0.275).multiplyScalar(deformation);
    positions.setXYZ(i, p.x, p.y, p.z);
    const shade = 0.91 + 0.075 * broad + 0.035 * fine;
    const c = base.clone().multiplyScalar(shade);
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

// One CONTINUOUS serpentine inner-membrane surface. Each long lamella
// connects to the next by rounding alternately at the bottom and top.
// This is a teaching visualization: real cristae connect to the inner
// boundary membrane and vary in their topology and spacing.
function makeConnectedCristae() {
  const passes = 15;
  const xStart = -0.355;
  const spacing = 0.0505;
  const top = 0.174;
  const bottom = -0.174;
  const halfDepth = 0.177;
  const path: THREE.Vector3[] = [];

  // Sample the long vertical runs and rounded U-turns separately to keep
  // the whole structure connected rather than making independent chips.
  for (let i = 0; i < passes; i++) {
    const x = xStart + i * spacing;
    const down = i % 2 === 0;
    const startY = down ? top : bottom;
    const endY = down ? bottom : top;
    for (let j = 0; j <= 22; j++) {
      const t = j / 22;
      const y = THREE.MathUtils.lerp(startY, endY, t);
      // Very restrained organic waviness, avoiding perfectly flat sheets.
      const wiggle = 0.0045 * Math.sin(t * Math.PI * 3 + i * 0.73);
      path.push(new THREE.Vector3(x + wiggle, y, 0));
    }
    if (i < passes - 1) {
      // A smooth half-turn joins this lamella to the next, alternating
      // between the lower and upper edges of the inner membrane.
      const turnY = endY;
      const radius = spacing / 2;
      const centerX = x + radius;
      for (let j = 1; j <= 14; j++) {
        const angle = Math.PI - (j / 14) * Math.PI;
        const px = centerX + radius * Math.cos(angle);
        const py = turnY + (down ? -1 : 1) * radius * Math.sin(angle);
        path.push(new THREE.Vector3(px, py, 0));
      }
    }
  }

  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const across = 24;
  for (let i = 0; i < path.length; i++) {
    const center = path[i];
    const before = path[Math.max(0, i - 1)];
    const after = path[Math.min(path.length - 1, i + 1)];
    const tangent = after.clone().sub(before).normalize();
    // Keep the membrane broad across most of each lamella. Narrow only near
    // the longitudinal ends and gently around the connecting U-turns.
    const endFalloff = Math.sqrt(Math.max(0.24, 1 - (center.x / 0.48) ** 2));
    const onTurn = Math.abs(tangent.x); // 0 on vertical runs, 1 at turn midpoint
    const turnFalloff = 1 - 0.24 * onTurn;
    const widthVariation =
      0.97 + 0.045 * Math.sin(center.x * 23 + center.y * 7);
    const localHalfDepth = 0.235 * endFalloff * turnFalloff * widthVariation;
    for (let j = 0; j <= across; j++) {
      const u = j / across;
      const side = u * 2 - 1;
      const z = side * localHalfDepth;
      // Roll the side edges into a soft taper rather than terminating each
      // fold in a straight rectangular edge. All strips remain ONE surface.
      const edge = Math.pow(Math.abs(side), 3);
      const ripple =
        0.017 * Math.sin(center.y * 13 + center.x * 11 + side * 2.2);
      const curl = 0.026 * edge * Math.sin(center.y * 9 + center.x * 8);
      const x = center.x + (1 - edge) * ripple + curl;
      const y = center.y + 0.018 * edge * Math.sin(center.x * 16 + side * 3);
      vertices.push(x, y, z);
      uvs.push(i / (path.length - 1), u);
      if (i > 0 && j > 0) {
        const a = (i - 1) * (across + 1) + j - 1;
        const b = i * (across + 1) + j - 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function CristaeNetwork({ selected }: { selected: boolean }) {
  const geometry = useMemo(() => makeConnectedCristae(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} raycast={() => null} renderOrder={1}>
      <meshStandardMaterial
        color={selected ? "#BC6B82" : "#A95D79"}
        side={THREE.DoubleSide}
        roughness={0.72}
        metalness={0}
        emissive="#54243E"
        emissiveIntensity={0.12}
        depthTest
        depthWrite
      />
    </mesh>
  );
}

function Mitochondrion({
  position,
  rotation,
  selected,
  onSelect,
  motion,
  xray,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  selected: boolean;
  onSelect: () => void;
  motion: boolean;
  xray: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const geometry = useMemo(() => makeMitoGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y =
      position[1] + (motion ? Math.sin(t * 0.48 + position[0] * 3) * 0.032 : 0);
    ref.current.rotation.z =
      rotation[2] + (motion ? Math.sin(t * 0.27 + position[0]) * 0.055 : 0);
    ref.current.rotation.y =
      rotation[1] + (motion ? Math.sin(t * 0.22 + position[1]) * 0.09 : 0);
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {xray ? (
        <>
          {/* Translucent rose outer membrane; inner cristae stay visible. */}
          <mesh geometry={geometry} renderOrder={0} raycast={() => null}>
            <meshBasicMaterial
              color="#B57F7E"
              side={THREE.BackSide}
              transparent
              opacity={0.25}
              depthWrite={false}
              depthTest
            />
          </mesh>

          <CristaeNetwork selected={selected} />
          <mesh geometry={geometry} raycast={() => null} renderOrder={2}>
            <meshPhysicalMaterial
              color="#CB8B91"
              side={THREE.FrontSide}
              transparent
              opacity={0.16}
              depthWrite={false}
              roughness={0.76}
            />
          </mesh>

          {/* Invisible picking surface: the mitochondrion remains clickable
              even when its visible outer membrane has been hidden. */}
          <mesh
            geometry={geometry}
            renderOrder={3}
            onClick={(event: ThreeEvent<MouseEvent>) => {
              event.stopPropagation();
              onSelect();
            }}
          >
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0}
              colorWrite={false}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
        </>
      ) : (
        <mesh
          geometry={geometry}
          onClick={(event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation();
            onSelect();
          }}
        >
          <meshPhysicalMaterial
            vertexColors
            color={selected ? "#FFE1CF" : "#FFFFFF"}
            roughness={0.82}
            metalness={0}
            side={THREE.FrontSide}
            emissive={selected ? "#50282B" : "#1D1116"}
            emissiveIntensity={selected ? 0.14 : 0.045}
          />
        </mesh>
      )}
    </group>
  );
}

// Five distinct-looking regions of one ER network. Each region is a single
// continuous, serpentine membrane with rounded, irregular hairpin folds.
function FreeRibosomes({
  selected,
  onSelect,
  motion,
}: {
  selected: boolean;
  onSelect: () => void;
  motion: boolean;
}) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const phase = useRef(0);
  const locations = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const a = i * 2.39996323 + 0.37;
        const r = 1.38 + (i % 5) * 0.085;
        const z = -0.52 + ((i * 7) % 11) * 0.095;
        return [Math.cos(a) * r, Math.sin(a) * r * 0.85, z] as [
          number,
          number,
          number,
        ];
      }),
    [],
  );
  useFrame((_, delta) => {
    if (motion) phase.current += Math.min(delta, 0.05);
    refs.current.forEach((g, i) => {
      if (!g) return;
      const p = locations[i];
      g.position.set(
        p[0] + 0.022 * Math.sin(phase.current * 0.26 + i),
        p[1] + 0.019 * Math.cos(phase.current * 0.23 + i * 1.3),
        p[2] + 0.018 * Math.sin(phase.current * 0.21 + i * 0.9),
      );
    });
  });
  return (
    <group>
      {locations.map((p, i) => (
        <group
          key={i}
          position={p}
          ref={(node) => {
            refs.current[i] = node;
          }}
        >
          <mesh raycast={() => null}>
            <sphereGeometry args={[0.019, 9, 7]} />
            <meshStandardMaterial
              color={selected ? "#F0FFF5" : "#B9D8CF"}
              emissive={selected ? "#7DDCC5" : "#315B58"}
              emissiveIntensity={selected ? 0.55 : 0.12}
              roughness={0.8}
            />
          </mesh>
          <mesh
            onClick={(event: ThreeEvent<MouseEvent>) => {
              event.stopPropagation();
              onSelect();
            }}
          >
            <sphereGeometry args={[0.068, 8, 6]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CellInterior({ motion }: { motion: boolean }) {
  const phase = useRef(0);
  const particleRefs = useRef<(THREE.Group | null)[]>([]);
  const transportRefs = useRef<(THREE.Group | null)[]>([]);
  const strands = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => {
        const a = i * 2.399963;
        const r = 1.08 + (i % 6) * 0.12;
        const z = -0.7 + (i % 8) * 0.18;
        const start = new THREE.Vector3(
          Math.cos(a) * r,
          Math.sin(a) * r * 0.88,
          z,
        );
        const end = new THREE.Vector3(
          Math.cos(a + 0.62) * (r + 0.22),
          Math.sin(a + 0.62) * (r + 0.12) * 0.88,
          z + 0.2,
        );
        const mid = start
          .clone()
          .lerp(end, 0.5)
          .add(
            new THREE.Vector3(
              0.08 * Math.sin(i),
              -0.09 * Math.cos(i),
              0.12 * Math.sin(i * 1.7),
            ),
          );
        const mid2 = mid
          .clone()
          .lerp(end, 0.5)
          .add(
            new THREE.Vector3(
              0.07 * Math.cos(i * 1.9),
              0.05 * Math.sin(i * 1.1),
              0.06 * Math.cos(i * 2.3),
            ),
          );
        const confine = (p: THREE.Vector3) =>
          p.length() > 1.68 ? p.normalize().multiplyScalar(1.68) : p;
        return new THREE.CatmullRomCurve3([start, mid, mid2, end].map(confine));
      }),
    [],
  );
  const particles = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => {
        const a = i * 2.399963;
        const r = 1.03 + (i % 9) * 0.115;
        const point = new THREE.Vector3(
          Math.cos(a) * r,
          Math.sin(a * 1.27) * r * 0.83,
          Math.sin(a) * r * 0.64,
        );
        point.clampLength(0, 1.64);
        return {
          position: [point.x, point.y, point.z] as [number, number, number],
          size: 0.013 + (i % 5) * 0.006,
          phase: i * 1.73,
        };
      }),
    [],
  );
  useFrame((_, delta) => {
    if (motion) phase.current += Math.min(delta, 0.05);
    const t = phase.current;
    transportRefs.current.forEach((g, i) => {
      if (!g) return;
      const curve = strands[(i * 5 + 2) % strands.length];
      const u = (0.17 * t * (0.35 + (i % 3) * 0.09) + i * 0.19) % 1;
      g.position.copy(curve.getPoint(u)).clampLength(0, 1.72);
    });
    particleRefs.current.forEach((g, i) => {
      if (!g) return;
      const p = particles[i];
      g.position.set(
        p.position[0] + 0.035 * Math.sin(t * 0.24 + p.phase),
        p.position[1] + 0.036 * Math.sin(t * 0.29 + p.phase * 0.7),
        p.position[2] + 0.027 * Math.cos(t * 0.21 + p.phase),
      );
      g.position.clampLength(0, 1.73);
    });
  });
  return (
    <group>
      {strands.map((curve, i) => (
        <mesh key={`strand-${i}`} raycast={() => null}>
          <tubeGeometry
            args={[curve, 22, i % 3 === 0 ? 0.006 : 0.0035, 5, false]}
          />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#83B4C1" : "#8C9EBD"}
            transparent
            opacity={i % 3 === 0 ? 0.27 : 0.18}
            depthWrite={false}
          />
        </mesh>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <group
          key={`transport-${i}`}
          ref={(node) => {
            transportRefs.current[i] = node;
          }}
          raycast={() => null}
        >
          <mesh raycast={() => null}>
            <sphereGeometry args={[0.021 + (i % 3) * 0.005, 10, 8]} />
            <meshStandardMaterial
              color={i % 2 ? "#CDA9C5" : "#A4D3CF"}
              roughness={0.7}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>
      ))}
      {particles.map((p, i) => (
        <group
          key={`cytoplasm-${i}`}
          position={p.position}
          raycast={() => null}
          ref={(node) => {
            particleRefs.current[i] = node;
          }}
        >
          <mesh raycast={() => null}>
            <sphereGeometry args={[p.size, 8, 6]} />
            <meshStandardMaterial
              color={i % 5 === 0 ? "#C9A4B8" : "#7FA8B6"}
              transparent
              opacity={0.48}
              roughness={0.85}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Oxygen molecules are a conceptual visualization of diffusion, not an atomistic simulation.
// The small paired blue spheres represent O2. Motion is deterministic and bounded.
type OxygenStage = "entry" | "diffusion" | "respiration";
const OXYGEN_TARGETS: [number, number, number][] = [
  [1.12, 0.48, 0.36],
  [-1.04, -0.7, 0.38],
  [0.5, 1.15, -0.38],
];
const OXYGEN_PHASES: OxygenStage[] = ["entry", "diffusion", "respiration"];
const OXYGEN_PHASE_SECONDS = [5, 10, 18] as const;
const OXYGEN_CYCLE_SECONDS = OXYGEN_PHASE_SECONDS.reduce((a, b) => a + b, 0);

function OxygenMolecules({
  enabled,
  motion,
  onStage,
}: {
  enabled: boolean;
  motion: boolean;
  onStage: (stage: OxygenStage) => void;
}) {
  const tracked = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const companions = useRef<(THREE.Group | null)[]>([]);
  const simulation = useRef({ t: 0, cycle: 0, stage: "entry" as OxygenStage });
  const targets = useMemo(
    () => OXYGEN_TARGETS.map((p) => new THREE.Vector3(...p)),
    [],
  );
  const origin = useMemo(() => new THREE.Vector3(1.63, 0.77, 0.39), []);
  const companionIds = useMemo(
    () => Array.from({ length: 13 }, (_, i) => i),
    [],
  );
  useFrame((_, delta) => {
    if (!enabled) return;
    const sim = simulation.current;
    if (motion) {
      sim.t += Math.min(delta, 0.05);
      // Hold at the mitochondrion until the visitor closes the exhibit.
      sim.t = Math.min(sim.t, OXYGEN_CYCLE_SECONDS - 1.4);
    }
    const t = sim.t;
    const entryEnd = OXYGEN_PHASE_SECONDS[0];
    const diffusionEnd = entryEnd + OXYGEN_PHASE_SECONDS[1];
    const stage: OxygenStage =
      t < entryEnd ? "entry" : t < diffusionEnd ? "diffusion" : "respiration";
    if (sim.stage !== stage) {
      sim.stage = stage;
      onStage(stage);
    }

    const target = targets[sim.cycle % targets.length];
    const start = origin
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), sim.cycle * 0.48);
    const control = start
      .clone()
      .lerp(target, 0.48)
      .add(new THREE.Vector3(-0.22, 0.28, -0.15));
    // Entry is slow, diffusion is visibly progressive, and the molecule
    // remains by the mitochondrion for the entire eight-second final phase.
    const travel =
      t < entryEnd
        ? 0.16 * (t / entryEnd)
        : t < diffusionEnd
          ? 0.16 + 0.84 * ((t - entryEnd) / OXYGEN_PHASE_SECONDS[1])
          : 1;
    const point = new THREE.QuadraticBezierCurve3(
      start,
      control,
      target,
    ).getPoint(travel);
    point.add(
      new THREE.Vector3(
        0.026 * Math.sin(t * 1.5 + sim.cycle),
        0.02 * Math.sin(t * 1.3 + 1.2),
        0.02 * Math.cos(t * 1.4 + 0.7),
      ).multiplyScalar(Math.sin(Math.PI * travel)),
    );
    if (tracked.current) {
      tracked.current.position.copy(point);
      const disappear =
        t > OXYGEN_CYCLE_SECONDS - 1.2
          ? Math.max(0.001, (OXYGEN_CYCLE_SECONDS - t) / 1.2)
          : 1;
      tracked.current.scale.setScalar(disappear);
    }
    if (glow.current) {
      const pulse = 1 + 0.12 * Math.sin(t * 3.1);
      glow.current.scale.setScalar(pulse);
    }
    companions.current.forEach((group, i) => {
      if (!group) return;
      const destination = targets[i % targets.length];
      const u = (t * (0.025 + (i % 3) * 0.005) + i * 0.17) % 1;
      const angle = i * 2.399963;
      const entry = new THREE.Vector3(
        1.62 * Math.cos(angle),
        0.75 * Math.sin(angle * 1.3),
        1.12 * Math.sin(angle),
      );
      group.position.copy(entry.lerp(destination, u * 0.88));
      group.position.x += 0.025 * Math.sin(t * 0.8 + i);
      group.position.y += 0.025 * Math.sin(t * 0.9 + i * 2);
      group.scale.setScalar(0.72);
    });
  });
  if (!enabled) return null;
  return (
    <group>
      {companionIds.map((i) => (
        <group
          key={i}
          ref={(node) => {
            companions.current[i] = node;
          }}
          raycast={() => null}
        >
          <mesh position={[-0.019, 0, 0]}>
            <sphereGeometry args={[0.025, 8, 6]} />
            <meshBasicMaterial color="#66D7FF" />
          </mesh>
          <mesh position={[0.019, 0, 0]}>
            <sphereGeometry args={[0.025, 8, 6]} />
            <meshBasicMaterial color="#66D7FF" />
          </mesh>
        </group>
      ))}
      <group ref={tracked} position={[1.63, 0.77, 0.39]} raycast={() => null}>
        <mesh ref={glow} raycast={() => null}>
          <sphereGeometry args={[0.23, 20, 16]} />
          <meshBasicMaterial
            color="#53C9FF"
            transparent
            opacity={0.13}
            depthWrite={false}
          />
        </mesh>
        <mesh raycast={() => null}>
          <sphereGeometry args={[0.16, 20, 16]} />
          <meshBasicMaterial
            color="#B5ECFF"
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
        <pointLight color="#83DDFF" intensity={1.5} distance={0.8} decay={2} />
        <mesh position={[-0.06, 0, 0]} raycast={() => null}>
          <sphereGeometry args={[0.064, 20, 16]} />
          <meshBasicMaterial color="#E7FCFF" toneMapped={false} />
        </mesh>
        <mesh position={[0.06, 0, 0]} raycast={() => null}>
          <sphereGeometry args={[0.064, 20, 16]} />
          <meshBasicMaterial color="#E7FCFF" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

// Enlarged teaching model: membrane folds, electron transfer, proton flow
// and ATP synthase are schematic, not molecular-scale geometry.
type RespirationPhase = 0 | 1 | 2 | 3;
const RESPIRATION_PHASE_SECONDS = [9, 10, 11, 14] as const;
const RESPIRATION_PHASES = [
  {
    title: "1. Elektronerna",
    short: "Elektroner",
    color: "#FFE48A",
    text: "Gula elektroner förs vidare mellan proteinkomplex i det inre membranet. Energin som frigörs används för att pumpa vätejoner (H⁺) till utrymmet mellan membranen.",
  },
  {
    title: "2. Vätejonerna",
    short: "H⁺-joner",
    color: "#85ECFF",
    text: "Blå vätejoner samlas på ena sidan av det inre membranet. När de strömmar tillbaka genom ATP-syntas får proteinet energi att tillverka ATP.",
  },
  {
    title: "3. ATP och vatten",
    short: "ATP & vatten",
    color: "#B8FFBD",
    text: "ATP-syntas använder vätejonernas flöde för att bilda ATP av ADP och fosfat. Vid slutet av elektrontransportkedjan tar syre emot elektroner och reagerar med vätejoner så att vatten bildas.",
  },
  {
    title: "4. Allt arbetar tillsammans",
    short: "Tillsammans",
    color: "#F2B2D0",
    text: "Nu ser du hela förloppet samtidigt: elektroner förflyttas, vätejoner pumpas och strömmar tillbaka, ATP bildas och syre omvandlas till vatten. Modellen är förenklad och inte skalenlig.",
  },
] as const;

function RespirationCloseupContent({
  motion,
  phase,
  onNext,
}: {
  motion: boolean;
  phase: RespirationPhase;
  onNext: () => void;
}) {
  const electrons = useRef<(THREE.Mesh | null)[]>([]);
  const protons = useRef<(THREE.Mesh | null)[]>([]);
  const atp = useRef<(THREE.Group | null)[]>([]);
  const rotor = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const onNextRef = useRef(onNext);
  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);
  useEffect(() => {
    elapsed.current = 0;
  }, [phase]);
  const electronVisible = phase === 0 || phase === 3;
  const protonVisible = phase === 1 || phase === 3;
  const productsVisible = phase === 2 || phase === 3;

  const folds = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const x = -1.17 + i * 0.34;
        const top = 0.53 - (i % 3) * 0.045;
        const bottom = -0.48 + (i % 2) * 0.07;
        const points = [
          new THREE.Vector3(x - 0.13, top, 0.16),
          new THREE.Vector3(x - 0.16, 0.12, 0.24),
          new THREE.Vector3(x - 0.12, bottom + 0.13, 0.25),
          new THREE.Vector3(x + 0.01, bottom, 0.27),
          new THREE.Vector3(x + 0.12, bottom + 0.13, 0.25),
          new THREE.Vector3(x + 0.15, 0.15, 0.23),
          new THREE.Vector3(x + 0.13, top, 0.16),
        ];
        return new THREE.CatmullRomCurve3(points, false, "centripetal");
      }),
    [],
  );

  useFrame((_, delta) => {
    if (motion) {
      elapsed.current += Math.min(delta, 0.05);
      if (elapsed.current >= RESPIRATION_PHASE_SECONDS[phase]) {
        elapsed.current = 0;
        onNextRef.current();
      }
    }
    const t = elapsed.current;
    electrons.current.forEach((mesh, i) => {
      if (!mesh) return;
      const path = folds[i % folds.length];
      mesh.position.copy(path.getPoint((t * 0.11 + i * 0.18) % 1));
      mesh.position.z += 0.08;
      mesh.visible = electronVisible;
    });
    protons.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = (t * 0.14 + i / 7) % 1;
      mesh.position.set(
        1.37 + 0.075 * Math.sin(i * 2.1),
        0.65 - phase * 1.28,
        0.45,
      );
      mesh.visible = protonVisible;
    });
    if (rotor.current) rotor.current.rotation.z = t * 0.65;
    atp.current.forEach((group, i) => {
      if (!group) return;
      const phase = (t * 0.15 + i / 4) % 1;
      group.position.set(1.55 + phase * 0.45, -0.44 - phase * 0.23, 0.45);
      group.scale.setScalar(0.65 + Math.sin(phase * Math.PI) * 0.4);
      group.visible = productsVisible;
    });
  });

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[-2, 3, 4]} intensity={2.4} color="#FFE3ED" />
      <pointLight position={[2, -1, 3]} intensity={10} color="#F7A8CB" />
      <group rotation={[0.12, -0.13, 0]}>
        {/* Translucent outer membrane, including visible rim */}
        <mesh scale={[1.75, 0.85, 0.55]}>
          <sphereGeometry args={[1, 64, 40]} />
          <meshPhysicalMaterial
            color="#A95482"
            transparent
            opacity={0.19}
            depthWrite={false}
            roughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh scale={[1.75, 0.85, 0.55]}>
          <sphereGeometry args={[1, 64, 40]} />
          <meshBasicMaterial
            color="#F2B2D0"
            transparent
            opacity={0.18}
            wireframe
            depthWrite={false}
          />
        </mesh>
        {/* Inner boundary, with folds attached to it */}
        <mesh scale={[1.54, 0.67, 0.44]}>
          <sphereGeometry args={[1, 56, 32]} />
          <meshPhysicalMaterial
            color="#723B69"
            transparent
            opacity={0.25}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {folds.map((curve, i) => (
          <group key={i}>
            <mesh>
              <tubeGeometry args={[curve, 70, 0.065, 10, false]} />
              <meshStandardMaterial
                color={i % 2 ? "#EEA4C2" : "#D887B0"}
                roughness={0.42}
                metalness={0.04}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh>
              <tubeGeometry args={[curve, 70, 0.025, 7, false]} />
              <meshBasicMaterial color="#FFDAE8" transparent opacity={0.33} />
            </mesh>
          </group>
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={`electron-${i}`}
            ref={(node) => {
              electrons.current[i] = node;
            }}
          >
            <sphereGeometry args={[0.061, 12, 10]} />
            <meshBasicMaterial color="#FFE48A" toneMapped={false} />
          </mesh>
        ))}
        {/* ATP synthase is shown schematically at one crista */}
        <group position={[1.38, -0.1, 0.38]}>
          <mesh>
            <cylinderGeometry args={[0.085, 0.085, 0.32, 14]} />
            <meshStandardMaterial
              color="#81DBD1"
              emissive="#2E7F89"
              emissiveIntensity={0.35}
            />
          </mesh>
          <group ref={rotor} position={[0, -0.22, 0]}>
            {Array.from({ length: 3 }, (_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i * Math.PI * 2) / 3) * 0.09,
                  Math.sin((i * Math.PI * 2) / 3) * 0.09,
                  0,
                ]}
              >
                <sphereGeometry args={[0.09, 12, 10]} />
                <meshStandardMaterial
                  color="#9DF7E7"
                  emissive="#237E86"
                  emissiveIntensity={0.4}
                />
              </mesh>
            ))}
          </group>
        </group>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={`proton-${i}`}
            ref={(node) => {
              protons.current[i] = node;
            }}
          >
            <sphereGeometry args={[0.058, 12, 10]} />
            <meshBasicMaterial color="#85ECFF" toneMapped={false} />
          </mesh>
        ))}
        {/* Simplified oxygen reduction: one O₂ pair, then newly formed H₂O. */}
        {productsVisible && (
          <group position={[1.17, 0.4, 0.42]}>
            <mesh position={[-0.065, 0, 0]}>
              <sphereGeometry args={[0.073, 16, 12]} />
              <meshBasicMaterial color="#B2EFFF" toneMapped={false} />
            </mesh>
            <mesh position={[0.065, 0, 0]}>
              <sphereGeometry args={[0.073, 16, 12]} />
              <meshBasicMaterial color="#B2EFFF" toneMapped={false} />
            </mesh>
          </group>
        )}
        {productsVisible && (
          <group position={[1.7, 0.1, 0.45]}>
            <mesh>
              <sphereGeometry args={[0.078, 16, 12]} />
              <meshBasicMaterial color="#9EE4FF" toneMapped={false} />
            </mesh>
            <mesh position={[-0.07, -0.065, 0]}>
              <sphereGeometry args={[0.043, 12, 10]} />
              <meshBasicMaterial color="#F4FFFF" toneMapped={false} />
            </mesh>
            <mesh position={[0.07, -0.065, 0]}>
              <sphereGeometry args={[0.043, 12, 10]} />
              <meshBasicMaterial color="#F4FFFF" toneMapped={false} />
            </mesh>
          </group>
        )}
        {Array.from({ length: 4 }, (_, i) => (
          <group
            key={`atp-${i}`}
            ref={(node) => {
              atp.current[i] = node;
            }}
          >
            <mesh>
              <sphereGeometry args={[0.052, 12, 10]} />
              <meshBasicMaterial color="#B8FFBD" toneMapped={false} />
            </mesh>
            <mesh position={[0.08, 0, 0]}>
              <sphereGeometry args={[0.025, 10, 8]} />
              <meshBasicMaterial color="#D8FFDB" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

function RespirationCloseup({
  motion,
  phase,
  onNext,
  landscape,
}: {
  motion: boolean;
  phase: RespirationPhase;
  onNext: () => void;
  landscape: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, landscape ? 4.85 : 4.15], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <RespirationCloseupContent
        motion={motion}
        phase={phase}
        onNext={onNext}
      />
    </Canvas>
  );
}

function AnimalCell({
  selected,
  onSelect,
  motion,
  oxygen,
  oxygenStageChange,
  xray,
  nucleusXray,
}: {
  selected: OrganelleId | null;
  onSelect: (id: OrganelleId) => void;
  motion: boolean;
  oxygen: boolean;
  oxygenStageChange: (stage: OxygenStage) => void;
  xray: boolean;
  nucleusXray: boolean;
}) {
  const cellRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cellRef.current) {
      const time = state.clock.elapsedTime;

      cellRef.current.position.y = motion ? Math.sin(time * 0.4) * 0.045 : 0;
      cellRef.current.rotation.z = motion ? Math.sin(time * 0.16) * 0.025 : 0;
    }
  });

  return (
    <group ref={cellRef}>
      <CellMembrane motion={motion} />
      <CellInterior motion={motion} />
      <FreeRibosomes
        motion={motion}
        selected={selected === "ribosomes"}
        onSelect={() => onSelect("ribosomes")}
      />
      <OxygenMolecules
        key={oxygen ? "oxygen-active" : "oxygen-idle"}
        enabled={oxygen}
        motion={motion}
        onStage={oxygenStageChange}
      />

      <Nucleus
        motion={motion}
        selected={selected === "nucleus"}
        showInside={nucleusXray}
        onSelect={() => onSelect("nucleus")}
      />

      <EndoplasmicReticulum
        motion={motion}
        selected={selected === "er"}
        onSelect={() => onSelect("er")}
        onRibosomeSelect={() => onSelect("ribosomes")}
      />

      <GolgiApparatus
        motion={motion}
        selected={selected === "golgi"}
        onSelect={() => onSelect("golgi")}
      />

      <Mitochondrion
        position={[1.12, 0.48, 0.36]}
        rotation={[0.2, 0.5, -0.4]}
        motion={motion}
        xray={xray && selected === "mitochondria"}
        selected={selected === "mitochondria"}
        onSelect={() => onSelect("mitochondria")}
      />

      <Mitochondrion
        position={[-1.04, -0.7, 0.38]}
        rotation={[0.3, -0.4, 0.5]}
        motion={motion}
        xray={xray && selected === "mitochondria"}
        selected={selected === "mitochondria"}
        onSelect={() => onSelect("mitochondria")}
      />

      <Mitochondrion
        position={[0.5, 1.15, -0.38]}
        rotation={[0.4, 0.8, 0.2]}
        motion={motion}
        xray={xray && selected === "mitochondria"}
        selected={selected === "mitochondria"}
        onSelect={() => onSelect("mitochondria")}
      />
    </group>
  );
}

function CellWorld({
  selected,
  onSelect,
  resetKey,
  motion,
  oxygen,
  oxygenStageChange,
  xray,
  nucleusXray,
}: {
  selected: OrganelleId | null;
  onSelect: (id: OrganelleId | null) => void;
  resetKey: number;
  motion: boolean;
  oxygen: boolean;
  oxygenStageChange: (stage: OxygenStage) => void;
  xray: boolean;
  nucleusXray: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.9], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#081522"]} />

      <ambientLight intensity={1.1} />

      <hemisphereLight args={["#B9D7ED", "#223344", 1.4]} />

      <directionalLight position={[4, 5, 6]} intensity={2.3} color="#CBE8FF" />

      <pointLight
        position={[-4, -2, 3]}
        intensity={35}
        distance={12}
        color="#7297DB"
      />

      <pointLight
        position={[2, 1, -3]}
        intensity={20}
        distance={9}
        color="#B57BAE"
      />

      <Suspense fallback={null}>
        <Stars
          radius={35}
          depth={18}
          count={350}
          factor={1.5}
          saturation={0}
          fade
          speed={0.15}
        />

        <AnimalCell
          selected={selected}
          onSelect={onSelect}
          motion={motion}
          oxygen={oxygen}
          oxygenStageChange={oxygenStageChange}
          xray={xray}
          nucleusXray={nucleusXray}
        />
      </Suspense>

      <OrbitControls
        key={resetKey}
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        minDistance={3.3}
        maxDistance={10}
        rotateSpeed={0.55}
        zoomSpeed={0.7}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI - 0.25}
      />
    </Canvas>
  );
}

export default function CellScene() {
  const [selected, setSelected] = useState<OrganelleId | null>(null);
  const [infoCollapsed, setInfoCollapsed] = useState(false);
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true);
  const [headerRevealCount, setHeaderRevealCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [museumSubmenu, setMuseumSubmenu] = useState(false);
  const [experimentSubmenu, setExperimentSubmenu] = useState(false);
  const sceneRef = useRef<HTMLElement>(null);
  const tabOrder: OrganelleId[] = [
    "nucleus",
    "mitochondria",
    "er",
    "ribosomes",
    "golgi",
  ];

  const selectOrganelle = (part: OrganelleId | null) => {
    setSelected(part);
    setInfoCollapsed(false);
    sceneRef.current?.focus({ preventScroll: true });
  };

  const handleSceneKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && selected) {
      event.preventDefault();
      setSelected(null);
      sceneRef.current?.focus({ preventScroll: true });
      return;
    }
    if (event.key !== "Tab" || !selected) return;
    // Only cycle while the 3D scene itself has focus. Buttons and links
    // must retain native Tab navigation for accessibility.
    if (event.target !== sceneRef.current) return;
    event.preventDefault();
    const index = tabOrder.indexOf(selected);
    const direction = event.shiftKey ? -1 : 1;
    setSelected(
      tabOrder[(index + direction + tabOrder.length) % tabOrder.length],
    );
  };

  const [resetKey, setResetKey] = useState(0);
  const [oxygen, setOxygen] = useState(false);
  const [oxygenStage, setOxygenStage] = useState<OxygenStage>("entry");
  const [respirationPhase, setRespirationPhase] = useState<RespirationPhase>(0);
  const [respirationPhaseKey, setRespirationPhaseKey] = useState(0);
  const [respirationCollapsed, setRespirationCollapsed] = useState(false);
  // On touch-sized screens the museum introduction fades away to free the scene.
  useEffect(() => {
    const timeout = window.setTimeout(
      () => setMobileHeaderVisible(false),
      4800,
    );
    return () => window.clearTimeout(timeout);
  }, [headerRevealCount]);
  const [landscape, setLandscape] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(
      "(orientation: landscape) and (max-height: 500px)",
    );
    const update = () => setLandscape(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const nextRespirationPhase = () =>
    setRespirationPhase((current) => ((current + 1) % 4) as RespirationPhase);
  function chooseRespirationPhase(next: RespirationPhase) {
    setRespirationPhase(next);
    setRespirationPhaseKey((previous) => previous + 1);
  }

  const [xray, setXray] = useState(false);
  const [nucleusXray, setNucleusXray] = useState(false);
  const [motion, setMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function resetView() {
    setInfoCollapsed(false);
    setSelected(null);
    setXray(false);
    setNucleusXray(false);
    setResetKey((previous) => previous + 1);
  }

  const info = selected ? organelles[selected] : null;

  return (
    <section
      ref={sceneRef}
      tabIndex={0}
      onKeyDown={handleSceneKeyDown}
      aria-label="Utforska djurcellen. Klicka på en organell, använd Tab och Skift plus Tab för att bläddra mellan organeller. Tryck Escape för att stänga informationen."
      className="relative h-full w-full overflow-hidden bg-[#081522] text-[#F5F2EA]"
    >
      <style>{`
        .oxygen-respiration-scroll { scrollbar-width: thin; overscroll-behavior: contain; }
        .cell-organelle-card { box-sizing: border-box; }
        @media (max-width: 767px), (orientation: landscape) and (max-height: 520px) {
          .cell-organelle-card:not(.cell-organelle-collapsed) {
            max-height: calc(100% - 76px); overflow-y: auto; overscroll-behavior: contain;
          }
          .cell-organelle-card.cell-organelle-collapsed { max-height: 80px; overflow: hidden; }
          .cell-organelle-collapsed .cell-collapsed-details { display: none; }
          .cell-collapse-mobile { display: inline-flex !important; }
          .cell-desktop-keyboard-help { display: none !important; }
          .oxygen-respiration-scroll:not(.oxygen-panel-collapsed) {
            max-height: calc(100% - 76px); overflow-y: auto;
          }
          .cell-mobile-header { transition: opacity 650ms ease, transform 650ms ease; }
          .cell-mobile-header.is-hidden { opacity: 0; transform: translateY(-12px); pointer-events: none; }
          .cell-mobile-header.is-hidden * { pointer-events: none !important; }
          .cell-activity-controls { top: 20px !important; }
        }
        @media (orientation: landscape) and (max-height: 520px) {
          .cell-organelle-card {
            bottom: 58px !important; left: 10px !important; right: auto !important;
            width: min(340px, 49vw) !important; padding: 12px 14px !important;
            max-height: calc(100% - 70px) !important; overflow-y: auto !important;
          }
          .cell-organelle-card.cell-organelle-collapsed {
            max-height: 74px !important; overflow: hidden !important;
          }
          .cell-organelle-card h2 { font-size: 19px; line-height: 1.15; }
          .cell-organelle-heading { position: sticky; top: -12px; z-index: 3; background: #0B1D2D; padding-top: 3px; padding-bottom: 3px; border-radius: 8px; }
          .cell-organelle-card p { line-height: 1.45; }
          .oxygen-respiration-scroll {
            bottom: 57px !important; top: auto !important;
            left: 10px !important; right: auto !important;
            width: min(385px, 53vw) !important;
            max-height: calc(100% - 66px) !important;
            overflow-y: auto !important;
          }
          .oxygen-respiration-scroll .respiration-visual { height: 90px !important; }
          .oxygen-respiration-scroll .respiration-detail { padding-top: 6px !important; padding-bottom: 6px !important; }
          .oxygen-respiration-scroll .respiration-footer { padding-top: 6px !important; padding-bottom: 6px !important; }
          .oxygen-journey-caption {
            bottom: 66px !important; left: 10px !important; right: auto !important;
            width: min(230px, 34vw) !important; margin: 0 !important;
            padding: 7px 9px !important; font-size: 10px !important; line-height: 1.3 !important;
          }
          .cell-activity-controls { right: 12px !important; top: 68px !important; }
          .cell-mobile-menu { left: 12px !important; right: auto !important; top: 10px !important; }
          .cell-mobile-menu nav { max-height: calc(100dvh - 65px) !important; }
        }
        @media (min-width: 768px) and (min-height: 521px) {
          .cell-mobile-header.is-hidden { opacity: 1; transform: none; pointer-events: auto; }
        }
        @media (max-width: 767px), (orientation: landscape) and (max-height: 520px) {
          .cell-mobile-menu { display: block; }
        }
        @media (min-width: 768px) and (min-height: 521px) {
          .cell-mobile-menu { display: none; }
        }
        /* Portrait phones: keep navigation away from the oxygen controls. */
        @media (orientation: portrait) and (max-width: 767px) {
          .cell-mobile-menu {
            left: 12px !important;
            right: auto !important;
            top: 12px !important;
          }
          .cell-mobile-menu > button { margin-left: 0 !important; }
          .cell-mobile-menu nav { max-width: calc(100vw - 24px); }
        }
        @media (orientation: landscape) and (max-height: 520px) {
          .cell-organelle-card {
            top: auto !important; bottom: 48px !important;
            max-height: calc(100% - 54px) !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            overscroll-behavior: contain;
          }
          .cell-organelle-card.cell-organelle-collapsed { overflow: hidden !important; }
          .oxygen-respiration-scroll {
            width: min(650px, calc(100vw - 105px)) !important;
            max-width: none !important;
            left: 10px !important; right: auto !important;
            bottom: 48px !important; top: auto !important;
            max-height: calc(100% - 54px) !important;
            overflow-y: auto !important;
            overscroll-behavior: contain;
            margin: 0 !important;
          }
          /* Use the free space above the navigation instead of clipping card footers. */
          .cell-organelle-card:not(.cell-organelle-collapsed) {
            padding: 11px 14px 12px !important;
            max-height: calc(100% - 54px) !important;
            overflow-y: auto !important;
          }
          .cell-organelle-card:not(.cell-organelle-collapsed) > :last-child { margin-bottom: 0 !important; }
          .oxygen-respiration-scroll:not(.oxygen-panel-collapsed) {
            max-height: calc(100% - 54px) !important;
          }
          .oxygen-respiration-scroll .respiration-visual { height: 136px !important; }
          .respiration-content {
            display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr);
            align-items: start; column-gap: 12px; padding: 0 12px 6px;
          }
          .respiration-content > .respiration-visual {
            grid-column: 2; grid-row: 1 / span 2;
            height: 136px !important; min-width: 0;
          }
          .respiration-content > [aria-label="Cellandningens fyra delar"] {
            grid-column: 1; grid-row: 1; padding: 0;
            grid-template-columns: repeat(2,minmax(0,1fr));
          }
          .respiration-content > .respiration-detail {
            grid-column: 1; grid-row: 2; padding: 8px 0 0 !important;
          }
          .respiration-content > .respiration-footer {
            grid-column: 1 / -1; grid-row: 3;
            padding: 6px 0 0 !important;
          }
          .respiration-content .respiration-detail p { font-size: 11px; line-height: 1.4; }
          .respiration-content [aria-label="Cellandningens fyra delar"] button { padding: 5px 3px; }
          .oxygen-respiration-scroll .respiration-visual { height: 136px !important; }
        }
        /* Compact landscape oxygen panel: fit the complete experiment above navigation. */
        @media (orientation: landscape) and (max-height: 520px) {
          .oxygen-respiration-scroll:not(.oxygen-panel-collapsed) {
            top: 7px !important;
            bottom: auto !important;
            max-height: calc(100% - 60px) !important;
            width: min(660px, calc(100vw - 90px)) !important;
            overflow-y: auto !important; /* only for unusually small screens */
          }
          .oxygen-respiration-scroll > .sticky {
            position: relative !important;
            padding: 7px 12px 3px !important;
            min-height: 39px;
          }
          .oxygen-respiration-scroll > .sticky p { font-size: 9px !important; line-height: 1.1 !important; }
          .oxygen-respiration-scroll > .sticky h3 { margin-top: 2px !important; font-size: 13px !important; line-height: 1.15 !important; }
          .oxygen-respiration-scroll > .sticky button { padding: 5px 8px !important; }
          .oxygen-respiration-scroll .respiration-content {
            column-gap: 10px !important;
            padding: 0 10px 4px !important;
            grid-template-rows: auto auto auto;
          }
          .oxygen-respiration-scroll .respiration-content > [aria-label="Cellandningens fyra delar"] {
            gap: 4px !important;
          }
          .oxygen-respiration-scroll [aria-label="Cellandningens fyra delar"] button {
            padding: 3px 2px !important;
            font-size: 9px !important;
            line-height: 1.2 !important;
            min-height: 32px !important;
          }
          .oxygen-respiration-scroll .respiration-content > .respiration-visual {
            height: 139px !important;
          }
          .oxygen-respiration-scroll .respiration-detail { padding: 4px 0 0 !important; }
          .oxygen-respiration-scroll .respiration-detail p:first-child {
            font-size: 10px !important; margin-bottom: 2px !important;
          }
          .oxygen-respiration-scroll .respiration-detail p:last-child {
            font-size: 10px !important; line-height: 1.27 !important;
          }
          .oxygen-respiration-scroll .respiration-footer {
            margin-top: 4px !important;
            padding: 4px 2px 2px !important;
            min-height: 28px;
          }
          .oxygen-respiration-scroll .respiration-footer span { font-size: 9px !important; }
          .oxygen-respiration-scroll .respiration-footer button { padding: 4px 10px !important; font-size: 10px !important; }
        }
        @media (orientation: landscape) and (max-height: 520px) {
          .cell-mobile-menu { left: 12px !important; right: auto !important; }
        }
      `}</style>
      {/* 3D environment */}
      <div className="absolute inset-0">
        <CellWorld
          selected={selected}
          onSelect={selectOrganelle}
          resetKey={resetKey}
          motion={motion}
          oxygen={oxygen}
          oxygenStageChange={setOxygenStage}
          xray={xray}
          nucleusXray={nucleusXray}
        />
      </div>

      {/* Atmospheric vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,8,16,0.6)_100%)]" />

      {/* Header */}
      <header
        className={`cell-mobile-header ${mobileHeaderVisible ? "" : "is-hidden"} pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-4 pt-5 sm:px-8 sm:pt-8`}
      >
        <div className="pointer-events-auto max-w-[75%]">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D8C18D] sm:text-xs">
            The Unfolding Universe · Museum
          </p>

          <h1 className="font-serif text-2xl tracking-tight text-[#F5F2EA] sm:text-4xl">
            Livets osynliga värld
          </h1>

          <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#B6CBD0] sm:text-sm">
            Utforska cellen och upptäck världen som finns inuti.
          </p>
        </div>
      </header>

      {/* Compact two-level menu, matching the Water Cycle Explorer. */}
      <div className="cell-mobile-menu absolute left-3 top-3 z-50 sm:left-5 sm:top-4">
        {!mobileMenuOpen && (
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(true);
              setMuseumSubmenu(false);
              setExperimentSubmenu(false);
            }}
            aria-label="Öppna museimenyn"
            aria-expanded={false}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-200/25 bg-[#102638]/95 text-teal-100 shadow-lg backdrop-blur-xl transition hover:bg-[#19384a]"
          >
            <Menu size={19} />
          </button>
        )}
        {mobileMenuOpen && (
          <div className="flex flex-col items-start gap-2">
            <nav
              aria-label="Museimenyn"
              className="flex w-[min(248px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-teal-200/20 bg-[#0b1d2d]/97 p-3 text-white shadow-[0_20px_60px_rgba(0,0,0,.5)] backdrop-blur-xl"
            >
              {experimentSubmenu ? (
                <>
                  <button
                    type="button"
                    onClick={() => setExperimentSubmenu(false)}
                    className="flex min-h-10 items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold text-teal-100 hover:bg-white/10"
                  >
                    <ArrowLeft size={16} /> Tillbaka till menyn
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <p className="px-2 pt-1 text-[10px] font-bold uppercase tracking-[.12em] text-amber-200">
                    Interaktiva experiment
                  </p>
                  <div className="max-h-[min(55dvh,390px)] min-h-0 space-y-1 overflow-y-auto overscroll-contain">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setExperimentSubmenu(false);
                        setSelected(null);
                        setOxygen(true);
                        setOxygenStage("entry");
                        setRespirationCollapsed(false);
                        setMotion(true);
                      }}
                      className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                    >
                      <Wind size={16} className="shrink-0 text-amber-200" />
                      <span className="min-w-0">
                        <span className="block">Följ syret</span>
                        <span className="block pt-0.5 text-[10px] font-normal text-slate-300/75">
                          Följ syrets väg till mitokondrien
                        </span>
                      </span>
                    </button>
                  </div>
                </>
              ) : museumSubmenu ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMuseumSubmenu(false)}
                    className="flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                  >
                    <ArrowLeft size={16} /> Tillbaka till menyn
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <div className="max-h-[min(55dvh,390px)] min-h-0 space-y-3 overflow-y-auto overscroll-contain px-1 py-1">
                    {exhibitCategories.map((category) => {
                      const exhibits = museumExhibits.filter(
                        (exhibit) => exhibit.category === category.id,
                      );
                      if (exhibits.length === 0) return null;
                      return (
                        <section key={category.id}>
                          <h3 className="px-2 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[.1em] text-teal-300">
                            {category.title}
                          </h3>
                          <div className="space-y-1">
                            {exhibits.map((exhibit) => {
                              const current =
                                exhibit.id === "cell-explorer" ||
                                exhibit.href === "/museum/cell-explorer";
                              const available =
                                Boolean(exhibit.href) &&
                                exhibit.status !== "planned";
                              const content = (
                                <>
                                  <span
                                    aria-hidden="true"
                                    className="shrink-0 text-base"
                                  >
                                    {exhibit.emoji}
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block break-words text-xs font-semibold leading-5">
                                      {exhibit.title}
                                    </span>
                                    <span className="mt-0.5 block text-[10px] leading-4 text-slate-300/70">
                                      {current
                                        ? "Du är här"
                                        : exhibit.status === "planned"
                                          ? "Planerad"
                                          : exhibit.status === "development"
                                            ? "Under utveckling"
                                            : "Utforska"}
                                    </span>
                                  </span>
                                </>
                              );
                              const classes =
                                "flex min-w-0 items-start gap-2 rounded-xl px-2 py-2.5 text-left text-white";
                              return current ? (
                                <div
                                  key={exhibit.id}
                                  aria-current="page"
                                  className={`${classes} bg-teal-300/10`}
                                >
                                  {content}
                                </div>
                              ) : available && exhibit.href ? (
                                <Link
                                  key={exhibit.id}
                                  href={exhibit.href}
                                  className={`${classes} transition hover:bg-white/10`}
                                >
                                  {content}
                                </Link>
                              ) : (
                                <div
                                  key={exhibit.id}
                                  className={`${classes} opacity-60`}
                                >
                                  {content}
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <p className="px-2 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-teal-300">
                    The Unfolding Universe
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSelected(null);
                      setOxygen(false);
                    }}
                    className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                  >
                    <Sparkles size={15} /> Utforska
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMuseumSubmenu(false);
                      setMobileHeaderVisible(true);
                      setHeaderRevealCount((n) => n + 1);
                    }}
                    className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                  >
                    <Info size={15} /> Om utställningen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSelected("nucleus");
                      setInfoCollapsed(false);
                    }}
                    className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                  >
                    <BookOpen size={15} /> Cellens delar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExperimentSubmenu(true);
                      setMuseumSubmenu(false);
                    }}
                    className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10 text-[#f2e2b2]"
                  >
                    <Sparkles size={15} />{" "}
                    <span className="flex-1">Experimentera</span>{" "}
                    <ChevronRight size={15} />
                  </button>
                  <div className="my-2 border-t border-white/10" />
                  <button
                    type="button"
                    onClick={() => setMuseumSubmenu(true)}
                    className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                  >
                    <Compass size={15} />{" "}
                    <span className="flex-1">Museets utställningar</span>{" "}
                    <ChevronRight size={15} />
                  </button>
                  <Link
                    href="/timeline"
                    className="flex min-h-10 items-center gap-2 rounded-xl px-2 py-2.5 text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                  >
                    <ArrowLeft size={15} /> Tidslinjen
                  </Link>
                </div>
              )}
            </nav>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setMuseumSubmenu(false);
                setExperimentSubmenu(false);
              }}
              className="rounded-full border border-[#b49b60]/40 bg-[#0b1d2d]/95 px-4 py-2 text-xs font-bold text-[#f3e0a3] shadow-lg transition hover:bg-[#19384a]"
            >
              <X size={13} className="mr-1 inline" /> Stäng
            </button>
          </div>
        )}
      </div>
      {/* Activity controls */}
      <div className="cell-activity-controls absolute right-4 top-24 z-20 flex flex-col gap-2 sm:right-8 sm:top-28">
        <button
          type="button"
          onClick={() => {
            if (!oxygen) setMotion(true);
            setOxygen((v) => !v);
            setOxygenStage("entry");
            setRespirationCollapsed(false);
            chooseRespirationPhase(0);
          }}
          aria-pressed={oxygen}
          className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs backdrop-blur-md transition ${oxygen ? "border-sky-300/50 bg-sky-700/65 text-white" : "border-white/15 bg-[#102638]/80 text-[#D5E5EA] hover:bg-white/15"}`}
        >
          <Wind size={15} /> {oxygen ? "Dölj syret" : "Följ syret"}
        </button>
        <button
          type="button"
          onClick={() => setMotion((v) => !v)}
          aria-label={motion ? "Pausa rörelsen" : "Starta rörelsen"}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-[#102638]/80 px-3 py-2 text-xs text-[#D5E5EA] backdrop-blur-md transition hover:bg-white/15"
        >
          {motion ? <Pause size={14} /> : <Play size={14} />}
          {motion ? "Pausa" : "Starta"}
        </button>
      </div>
      {oxygen && oxygenStage !== "respiration" && (
        <div
          className="oxygen-journey-caption pointer-events-none absolute inset-x-4 bottom-24 z-20 mx-auto max-w-sm rounded-xl border border-sky-300/25 bg-[#0B1D2D]/90 px-4 py-3 text-center text-xs leading-relaxed text-sky-100 backdrop-blur-md sm:bottom-24"
          aria-live="polite"
        >
          <p className="mb-1 font-semibold text-sky-200">
            {oxygenStage === "entry"
              ? "1 · Syret kommer in"
              : oxygenStage === "diffusion"
                ? "2 · Syret sprids"
                : "3 · Syret används"}
          </p>
          {oxygenStage === "entry"
            ? "Följ den ljusblå O₂-molekylen in i cellen."
            : oxygenStage === "diffusion"
              ? "Syre sprids genom diffusion. Den markerade vägen är en pedagogisk förenkling."
              : "I mitokondrien förbrukas syre vid cellandningen. Molekylen försvinner och en ny resa börjar."}
        </div>
      )}

      {oxygen && oxygenStage === "respiration" && (
        <section
          className={`${respirationCollapsed ? "oxygen-panel-collapsed max-h-none" : "max-h-[min(79dvh,680px)]"} oxygen-respiration-scroll pointer-events-auto absolute inset-x-3 bottom-3 z-20 mx-auto max-w-[620px] overflow-x-hidden overflow-y-auto rounded-2xl border border-rose-300/30 bg-[#0B1726]/95 shadow-[0_0_50px_rgba(225,115,169,0.16)] backdrop-blur-xl sm:bottom-7`}
          aria-label="Cellandning inuti mitokondrien"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-[#0B1726]/95 px-4 pb-2 pt-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-200">
                Steg 3 · Syret används
              </p>
              <h3 className="mt-1 font-semibold text-white">
                Inuti mitokondrien
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setRespirationCollapsed((v) => !v)}
              aria-expanded={!respirationCollapsed}
              aria-label={
                respirationCollapsed
                  ? "Visa mitokondriens experiment"
                  : "Minimera mitokondriens experiment"
              }
              className="cell-collapse-toggle flex shrink-0 items-center gap-1 rounded-full border border-rose-300/30 px-3 py-2 text-xs text-rose-100"
            >
              {respirationCollapsed ? (
                <ChevronUp size={17} />
              ) : (
                <ChevronDown size={17} />
              )}
            </button>
          </div>
          {!respirationCollapsed && (
            <div className="respiration-content">
              <div className="respiration-visual relative h-[145px] w-full sm:h-[215px]">
                <RespirationCloseup
                  key={respirationPhaseKey}
                  motion={motion}
                  phase={respirationPhase}
                  onNext={nextRespirationPhase}
                  landscape={landscape}
                />
                <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/10 bg-[#0B1726]/85 px-2 py-1.5 text-[10px] text-rose-100 sm:left-5">
                  Inre membranet · veck (cristae)
                </div>
                {(respirationPhase === 0 || respirationPhase === 3) && (
                  <span className="pointer-events-none absolute left-[13%] bottom-4 rounded-full bg-amber-300/15 px-2 py-1 text-[10px] font-semibold text-amber-200">
                    ● Elektroner (e⁻)
                  </span>
                )}
                {(respirationPhase === 1 || respirationPhase === 3) && (
                  <span className="pointer-events-none absolute right-[8%] top-[22%] rounded-full bg-cyan-300/15 px-2 py-1 text-[10px] font-semibold text-cyan-200">
                    ● Vätejoner (H⁺)
                  </span>
                )}
                {(respirationPhase === 2 || respirationPhase === 3) && (
                  <span className="pointer-events-none absolute right-[7%] bottom-4 rounded-full bg-emerald-300/15 px-2 py-1 text-[10px] font-semibold text-emerald-200">
                    ● ATP bildas · H₂O
                  </span>
                )}
              </div>
              <div
                className="grid grid-cols-2 gap-1.5 px-3 sm:gap-2"
                aria-label="Cellandningens fyra delar"
              >
                {RESPIRATION_PHASES.map((item, i) => (
                  <button
                    key={item.short}
                    type="button"
                    onClick={() =>
                      chooseRespirationPhase(i as RespirationPhase)
                    }
                    aria-pressed={respirationPhase === i}
                    className={`min-w-0 rounded-lg border px-1 py-2 text-center text-[10px] leading-4 transition sm:px-2 sm:text-xs ${respirationPhase === i ? "border-sky-300/60 bg-sky-300/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}
                  >
                    <span className="block font-bold">{i + 1}</span>
                    <span className="block">{item.short}</span>
                  </button>
                ))}
              </div>
              <div
                className="respiration-detail px-4 pb-3 pt-3"
                aria-live="polite"
              >
                <p
                  className="mb-1 text-sm font-semibold"
                  style={{ color: RESPIRATION_PHASES[respirationPhase].color }}
                >
                  {RESPIRATION_PHASES[respirationPhase].title}
                </p>
                <p className="text-xs leading-relaxed text-slate-200 sm:text-[13px]">
                  {RESPIRATION_PHASES[respirationPhase].text}
                </p>
              </div>
              <div className="respiration-footer flex flex-wrap items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
                <span className="text-[10px] text-slate-400">
                  Förenklad illustration ·{" "}
                  {motion
                    ? "Stegen växlar automatiskt · Välj ett steg ovan"
                    : "Animationen pausad"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOxygen(false);
                    setOxygenStage("entry");
                    setRespirationCollapsed(false);
                    chooseRespirationPhase(0);
                  }}
                  className="ml-auto shrink-0 rounded-full border border-white/20 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  Avsluta
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Organelle information */}
      {info && !(oxygen && oxygenStage === "respiration") && (
        <aside
          className={`cell-organelle-card ${infoCollapsed ? "cell-organelle-collapsed" : ""} absolute inset-x-3 bottom-4 z-30 rounded-2xl border border-white/15 bg-[#0B1D2D]/95 ${infoCollapsed ? "px-5 py-3" : "p-5"} shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:bottom-8 sm:left-8 sm:w-[350px] sm:max-h-none sm:overflow-visible sm:p-6`}
        >
          <div
            className={`cell-organelle-heading flex items-center justify-between gap-3 ${infoCollapsed ? "sm:mb-3" : "mb-3"}`}
          >
            <div>
              <p
                className={`${infoCollapsed ? "mb-1" : "mb-2"} text-[10px] font-semibold uppercase tracking-[0.2em]`}
                style={{ color: info.color }}
              >
                Cellens delar
              </p>

              <h2 className="font-serif text-2xl text-white">{info.title}</h2>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setInfoCollapsed((v) => !v)}
                aria-expanded={!infoCollapsed}
                aria-label={
                  infoCollapsed
                    ? "Visa information om organellen"
                    : "Fäll ned informationen"
                }
                className="cell-collapse-mobile hidden rounded-full border border-white/20 p-2 text-[#D5E5EA] transition hover:bg-white/10"
              >
                {infoCollapsed ? (
                  <ChevronUp size={22} />
                ) : (
                  <ChevronDown size={22} />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Stäng information"
                className="rounded-full p-2 text-[#B6CBD0] transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className={infoCollapsed ? "cell-collapsed-details" : ""}>
            <p
              className="mb-3 text-sm font-medium"
              style={{ color: info.color }}
            >
              {info.subtitle}
            </p>

            <p className="cell-desktop-keyboard-help mb-3 text-[11px] text-[#9CB8C5]">
              Tab: nästa del · Skift+Tab: föregående · Esc: stäng
            </p>
            <p className="text-sm leading-7 text-[#C2D3DD]">
              {info.description}
            </p>
            {selected === "nucleus" && (
              <button
                type="button"
                aria-pressed={nucleusXray}
                onClick={() => setNucleusXray((v) => !v)}
                className="mt-4 inline-flex items-center rounded-full border border-violet-300/40 bg-violet-800/40 px-4 py-2 text-xs font-semibold text-violet-100 transition hover:bg-violet-700/50"
              >
                {nucleusXray
                  ? "Visa ytan"
                  : "Visa insidan · Kromatin & nukleol"}
              </button>
            )}
            {selected === "mitochondria" && (
              <button
                type="button"
                aria-pressed={xray}
                onClick={() => setXray((value) => !value)}
                className="mt-4 inline-flex items-center rounded-full border border-[#D8A18F]/45 bg-[#5A343A]/60 px-4 py-2 text-xs font-semibold text-[#FFE0D0] transition hover:bg-[#76474B]/80"
              >
                {xray ? "Visa ytan" : "Visa insidan · Röntgenvy"}
              </button>
            )}
          </div>
        </aside>
      )}
    </section>
  );
}
