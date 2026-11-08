"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import MuseumSceneMenu from "../../MuseumSceneMenu";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Info,
  Microscope,
  Search,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";

type Part =
  | "outer"
  | "wall"
  | "inner"
  | "nucleoid"
  | "ribosomes"
  | "plasmid"
  | "flagella"
  | "fimbriae";
const PART_ORDER: Part[] = [
  "outer",
  "wall",
  "inner",
  "nucleoid",
  "ribosomes",
  "plasmid",
  "flagella",
  "fimbriae",
];
type Props = { onBack?: () => void };
const DATA: Record<
  Part,
  { name: string; subtitle: string; description: string; color: string }
> = {
  outer: {
    name: "Yttre membran",
    subtitle: "Gramnegativt cellhölje",
    color: "#76c7d1",
    description:
      "E. coli är gramnegativ. Det yttre membranet innehåller bland annat lipopolysackarider (LPS) och bidrar till att skydda bakterien.",
  },
  wall: {
    name: "Cellvägg",
    subtitle: "Ett tunt lager peptidoglykan",
    color: "#e7bd8b",
    description:
      "Mellan de två membranen finns ett tunt lager peptidoglykan. Det hjälper bakterien att behålla formen och motstå osmotiskt tryck. Välj det sandfärgade lagret i förstoringsglaset för att undersöka cellväggen.",
  },
  inner: {
    name: "Inre membran",
    subtitle: "Cellens selektiva gräns",
    color: "#6aaea7",
    description:
      "Det inre cellmembranet reglerar transporten av ämnen. Här finns också viktiga proteiner för energiomvandling.",
  },
  nucleoid: {
    name: "Nukleoid",
    subtitle: "DNA utan cellkärna",
    color: "#d6a4f6",
    description:
      "Bakteriens kromosom ligger i en nukleoidregion. E. coli har ingen membranomsluten cellkärna. DNA:t är normalt en cirkulär dubbelsträngad kromosom.",
  },
  ribosomes: {
    name: "Ribosomer",
    subtitle: "Bygger proteiner",
    color: "#f3d891",
    description:
      "E. coli har 70S-ribosomer som bygger proteiner utifrån mRNA. Prickarna är kraftigt förstorade så att de går att se.",
  },
  plasmid: {
    name: "Plasmid",
    subtitle: "Extra DNA hos vissa stammar",
    color: "#f6a8bd",
    description:
      "Vissa E. coli-stammar bär plasmider: små DNA-molekyler som kan innehålla extra gener. Plasmiden i modellen är ett exempel, inte något som alla E. coli har.",
  },
  flagella: {
    name: "Flageller",
    subtitle: "Roterande rörelsemotorer",
    color: "#a9dbb8",
    description:
      "Många rörliga E. coli-stammar simmar med hjälp av flageller. De roterar med molekylära motorer i cellhöljet. Alla stammar är inte rörliga.",
  },
  fimbriae: {
    name: "Fimbriae",
    subtitle: "Små ytutskott",
    color: "#9fb9de",
    description:
      "Många E. coli har korta ytutskott som hjälper dem att fästa vid ytor. Typ och antal varierar mellan stammar. De korta, blåvita stråna längs cellens yta är fimbriae.",
  },
};

function capsuleGeometry(radius: number, length: number) {
  // CapsuleGeometry's long axis is Y; rotate it to the horizontal X axis.
  const g = new THREE.CapsuleGeometry(radius, length, 12, 32);
  g.rotateZ(Math.PI / 2);
  return g;
}
function strand(
  points: THREE.Vector3[],
  radius: number,
  color: string,
  opacity = 1,
) {
  const curve = new THREE.CatmullRomCurve3(points);
  return {
    geometry: new THREE.TubeGeometry(
      curve,
      Math.max(32, points.length * 3),
      radius,
      6,
      false,
    ),
    color,
    opacity,
  };
}
function Shell({
  radius,
  length,
  color,
  opacity,
  selected,
  onClick,
}: {
  radius: number;
  length: number;
  color: string;
  opacity: number;
  selected: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const geometry = useMemo(
    () => capsuleGeometry(radius, length),
    [radius, length],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      geometry={geometry}
      userData={{ cellShell: true }}
      onClick={onClick}
      renderOrder={radius > 0.8 ? 2 : 1}
    >
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={selected ? Math.min(0.65, opacity + 0.34) : opacity}
        roughness={0.48}
        metalness={0.0}
        clearcoat={0.22}
        clearcoatRoughness={0.5}
        flatShading={false}
        depthWrite={false}
        side={THREE.DoubleSide}
        emissive={color}
        emissiveIntensity={selected ? 0.8 : 0.045}
      />
    </mesh>
  );
}
function InternalDNA({
  select,
  selected,
  paused,
}: {
  select: (p: Part) => void;
  selected: boolean;
  paused: boolean;
}) {
  const nucleoidRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    if (paused || !nucleoidRef.current) return;
    elapsed.current += Math.min(delta, 0.05);
    const t = elapsed.current;
    nucleoidRef.current.rotation.x = 0.025 * Math.sin(t * 0.45);
    nucleoidRef.current.rotation.y = 0.04 * Math.sin(t * 0.3);
    nucleoidRef.current.scale.set(
      1 + 0.009 * Math.sin(t * 0.7),
      1 + 0.012 * Math.cos(t * 0.6),
      1,
    );
  });
  // Compact, irregular 3D chromosome loops: a nucleoid, not a tidy sine wave.
  // Deterministic geometry avoids flicker and hydration differences.
  const curves = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    for (let k = 0; k < 5; k++) {
      const points: THREE.Vector3[] = [];
      const phase = k * 2.39996;
      const spread = 0.28 + (k % 3) * 0.06;
      for (let i = 0; i <= 220; i++) {
        const t = i / 220;
        const theta = t * Math.PI * (4.0 + k * 0.58) + phase;
        const envelope = Math.pow(Math.sin(Math.PI * t), 0.45);
        const x =
          -0.94 + 1.88 * t + 0.1 * Math.sin(theta * 0.57 + phase) * envelope;
        const y =
          envelope *
          (spread * Math.sin(theta) + 0.105 * Math.sin(theta * 2.37 + phase));
        const z =
          envelope *
          (0.24 * Math.cos(theta * 0.79 + phase) +
            0.13 * Math.sin(theta * 1.83));
        points.push(new THREE.Vector3(x, y, z));
      }
      paths.push(points);
    }
    return paths.map((points, k) =>
      strand(
        points,
        k % 2 === 0 ? 0.01 : 0.008,
        k % 2 === 0 ? "#d7b4ec" : "#ae9dd4",
      ),
    );
  }, []);
  useEffect(() => () => curves.forEach((c) => c.geometry.dispose()), [curves]);
  return (
    <group
      ref={nucleoidRef}
      onClick={(e) => {
        e.stopPropagation();
        select("nucleoid");
      }}
    >
      {curves.map((c, i) => (
        <mesh key={i} geometry={c.geometry} userData={{ cellPart: "nucleoid" }}>
          <meshStandardMaterial
            color={selected ? "#f4d7ff" : c.color}
            emissive={selected ? "#b37cdd" : "#7b6498"}
            emissiveIntensity={selected ? 1.25 : 0.22}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function Particles({
  select,
  selected,
}: {
  select: (p: Part) => void;
  selected: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const positions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    // Deterministic distribution, excluding a central nucleoid volume.
    for (let i = 0; i < 190; i++) {
      const fract = (v: number) => v - Math.floor(v);
      const x = fract(Math.sin(i * 12.9898) * 43758.5453);
      const y = fract(Math.sin(i * 78.233) * 12578.91);
      const z = fract(Math.sin(i * 41.37) * 3264.7);
      const px = (x - 0.5) * 3.6,
        py = (y - 0.5) * 1.48,
        pz = (z - 0.5) * 1.48;
      const radial = Math.sqrt(py * py + pz * pz);
      if (radial < 0.77 && !(Math.abs(px) < 1.05 && radial < 0.43))
        arr.push(new THREE.Vector3(px, py, pz));
    }
    return arr;
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    const obj = new THREE.Object3D();
    positions.forEach((p, i) => {
      obj.position.copy(p);
      obj.scale.setScalar(0.6 + (0.4 * (i % 5)) / 4);
      obj.updateMatrix();
      ref.current!.setMatrixAt(i, obj.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [positions]);
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, positions.length]}
      userData={{ cellPart: "ribosomes" }}
      onClick={(e) => {
        e.stopPropagation();
        select("ribosomes");
      }}
    >
      <sphereGeometry args={[0.026, 6, 5]} />
      <meshStandardMaterial
        color={selected ? "#fff9cd" : "#f3d891"}
        emissive={selected ? "#ffe87a" : "#9b6c36"}
        emissiveIntensity={selected ? 2.4 : 0.15}
      />
    </instancedMesh>
  );
}
function SurfaceFibers({
  select,
  selected,
  paused,
}: {
  select: (p: Part) => void;
  selected: boolean;
  paused: boolean;
}) {
  // Dense but delicate, tapered fimbriae. These are attachment pili, not
  // flagella: the motion is a small passive flex rather than active beating.
  const COUNT = 900;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const elapsed = useRef(0);
  const accumulator = useRef(0);
  const hairs = useMemo(() => {
    // Independent deterministic samples, rather than a golden-angle helix.
    // A helix creates conspicuous diagonal bands when viewed from the side.
    const random = (n: number) => {
      const v = Math.sin(n * 127.1 + 78.233) * 43758.5453123;
      return v - Math.floor(v);
    };
    return Array.from({ length: COUNT }, (_, i) => {
      const angle = 2 * Math.PI * random(i * 5 + 1);
      const outward = new THREE.Vector3(0, Math.cos(angle), Math.sin(angle));
      const cap = random(i * 5 + 2) < 0.3;
      let base: THREE.Vector3;
      let direction: THREE.Vector3;
      if (cap) {
        const sign = random(i * 5 + 3) < 0.5 ? -1 : 1;
        // Uniformly cover each hemispherical end cap.
        const cosTheta = random(i * 5 + 4);
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
        direction = new THREE.Vector3(
          sign * cosTheta,
          outward.y * sinTheta,
          outward.z * sinTheta,
        ).normalize();
        base = new THREE.Vector3(
          sign * 1.425 + direction.x * 0.913,
          direction.y * 0.913,
          direction.z * 0.913,
        );
      } else {
        direction = outward.clone();
        base = new THREE.Vector3(
          -1.425 + 2.85 * random(i * 5 + 5),
          outward.y * 0.913,
          outward.z * 0.913,
        );
      }
      // Shorter lengths and varied curvature create a softer silhouette.
      const variation = random(i * 7 + 21);
      const length = 0.075 + 0.105 * variation + (i % 29 === 0 ? 0.035 : 0);
      const tangent = new THREE.Vector3()
        .crossVectors(direction, new THREE.Vector3(1, 0.37, 0.23))
        .normalize();
      return {
        base,
        direction,
        tangent,
        length,
        phase: i * 1.719,
        speed: 0.85 + 0.4 * random(i * 7 + 22),
        lean: 0.075 * Math.sin(i * 2.17),
      };
    });
  }, []);

  // A single smoothly curved, tapered filament reused by every instance.
  // Building rings rather than a constant-radius TubeGeometry avoids needle-
  // like straight tips and reduces the harsh "thorn" appearance.
  const geometry = useMemo(() => {
    const rings = 9;
    const sides = 5;
    const positions: number[] = [];
    const indices: number[] = [];
    for (let j = 0; j <= rings; j++) {
      const t = j / rings;
      const bend = 0.12 * t * t;
      const radius = 0.027 * Math.pow(1 - t, 0.75) + 0.0015;
      for (let k = 0; k < sides; k++) {
        const angle = (k / sides) * Math.PI * 2;
        positions.push(
          bend + radius * Math.cos(angle),
          t,
          0.035 * t * t + radius * Math.sin(angle),
        );
        if (j < rings) {
          const a = j * sides + k;
          const b = j * sides + ((k + 1) % sides);
          const c = (j + 1) * sides + k;
          const d = (j + 1) * sides + ((k + 1) % sides);
          indices.push(a, c, b, b, c, d);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const scratch = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const orientation = useMemo(() => new THREE.Quaternion(), []);
  const tilted = useMemo(() => new THREE.Vector3(), []);
  const applyMatrices = useCallback(
    (t: number) => {
      const mesh = meshRef.current;
      if (!mesh) return;
      hairs.forEach((hair, i) => {
        // Small independent oscillations in the local tangent direction are
        // visibly softer than shifting all hairs along world X.
        const flex = 0.16 * Math.sin(t * hair.speed * 1.65 + hair.phase);
        const secondary = 0.055 * Math.sin(t * 0.8 + hair.phase * 0.61);
        tilted
          .copy(hair.direction)
          .addScaledVector(hair.tangent, hair.lean + flex)
          .addScaledVector(up, secondary)
          .normalize();
        orientation.setFromUnitVectors(up, tilted);
        scratch.position.copy(hair.base);
        scratch.quaternion.copy(orientation);
        scratch.scale.setScalar(hair.length);
        scratch.updateMatrix();
        mesh.setMatrixAt(i, scratch.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
    [hairs, orientation, scratch, tilted, up],
  );

  useEffect(() => {
    applyMatrices(elapsed.current);
  }, [applyMatrices]);
  useFrame((_, delta) => {
    if (paused) return;
    const step = Math.min(delta, 0.05);
    elapsed.current += step;
    accumulator.current += step;
    if (accumulator.current < 1 / 24) return;
    accumulator.current = 0;
    applyMatrices(elapsed.current);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, COUNT]}
      geometry={geometry}
      frustumCulled={false}
      userData={{ cellPart: "fimbriae" }}
      onClick={(e) => {
        e.stopPropagation();
        select("fimbriae");
      }}
    >
      <meshStandardMaterial
        color={selected ? "#e9f9ff" : "#9fc6cf"}
        emissive={selected ? "#a9ddff" : "#537e94"}
        emissiveIntensity={selected ? 0.85 : 0.1}
        roughness={0.95}
        transparent
        opacity={selected ? 0.94 : 0.66}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

// Smooth, surface-anchored, helical flagella. Their geometry is updated at a
// capped rate, rather than triggering React renders on every animation frame.
// E. coli is peritrichous: these emerge from several positions on its surface.
function Flagella({
  paused,
  select,
  selected,
}: {
  paused: boolean;
  select: (p: Part) => void;
  selected: boolean;
}) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const time = useRef(0);
  const accumulator = useRef(0);

  const filaments = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const angle = i * 2.3999632297 + 0.3;
        const radial = new THREE.Vector3(0, Math.cos(angle), Math.sin(angle));
        const x = -1.34 + 2.68 * ((i * 0.6180339887) % 1);
        const base = new THREE.Vector3(x, radial.y * 0.917, radial.z * 0.917);
        // Some filaments trail toward +X, others toward -X. They always start
        // by leaving the membrane outward, avoiding a line through the cell.
        const trail = i % 3 === 0 ? -1 : 1;
        const axis = new THREE.Vector3(
          trail,
          radial.y * 0.26,
          radial.z * 0.26,
        ).normalize();
        const side = new THREE.Vector3().crossVectors(axis, radial).normalize();
        const normal = new THREE.Vector3().crossVectors(axis, side).normalize();
        return {
          base,
          axis,
          radial,
          side,
          normal,
          length: 1.55 + (i % 4) * 0.25,
          phase: i * 1.63,
        };
      }),
    [],
  );

  const buildGeometry = useCallback(
    (i: number, t: number) => {
      const f = filaments[i];
      const points: THREE.Vector3[] = [];
      const segments = 68;
      for (let j = 0; j <= segments; j++) {
        const u = j / segments;
        // Smooth transition from membrane attachment to free helical filament.
        const rootBlend = THREE.MathUtils.smoothstep(u, 0, 0.2);
        const helixRadius =
          0.105 * rootBlend * (0.94 + 0.06 * Math.sin(u * 5 + i));
        const theta = u * Math.PI * (5.5 + (i % 3) * 0.65) - t * 5.0 + f.phase;
        const sway = 0.055 * u * u * Math.sin(t * 1.4 + i * 1.7);
        const point = f.base
          .clone()
          .addScaledVector(f.radial, 0.22 * (1 - Math.exp(-u * 18)))
          .addScaledVector(f.axis, f.length * u)
          .addScaledVector(f.side, helixRadius * Math.cos(theta) + sway)
          .addScaledVector(f.normal, helixRadius * Math.sin(theta));
        points.push(point);
      }
      return new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        segments,
        0.008,
        5,
        false,
      );
    },
    [filaments],
  );

  const initialGeometries = useMemo(
    () => filaments.map((_, i) => buildGeometry(i, 0)),
    [buildGeometry, filaments],
  );

  // Build once on mount; the mutable meshes own their geometries thereafter.
  useEffect(() => {
    const meshRefs = meshes;
    return () => meshRefs.current.forEach((mesh) => mesh?.geometry.dispose());
  }, []);

  useFrame((_, delta) => {
    if (paused) return;
    const step = Math.min(delta, 0.05);
    time.current += step;
    accumulator.current += step;
    if (accumulator.current < 1 / 24) return;
    accumulator.current = 0;
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const next = buildGeometry(i, time.current);
      const previous = mesh.geometry;
      mesh.geometry = next;
      previous.dispose();
    });
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        select("flagella");
      }}
    >
      {filaments.map((_, i) => (
        <mesh
          key={i}
          ref={(node) => {
            meshes.current[i] = node;
          }}
          userData={{ cellPart: "flagella" }}
        >
          <primitive object={initialGeometries[i]} attach="geometry" />
          <meshStandardMaterial
            color={selected ? "#e6ffe8" : "#b4ddc7"}
            emissive="#6ab99a"
            emissiveIntensity={selected ? 1.2 : 0.16}
            roughness={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function Plasmid({
  select,
  selected,
}: {
  select: (p: Part) => void;
  selected: boolean;
}) {
  const geom = useMemo(() => {
    const points = Array.from({ length: 97 }, (_, i) => {
      const t = (i / 96) * Math.PI * 2;
      const r = 0.18 + 0.016 * Math.sin(t * 5) + 0.008 * Math.cos(t * 9);
      return new THREE.Vector3(
        r * Math.cos(t),
        r * Math.sin(t),
        0.025 * Math.sin(t * 3),
      );
    });
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points, true),
      120,
      0.015,
      7,
      true,
    );
  }, []);
  useEffect(() => () => geom.dispose(), [geom]);
  return (
    <group position={[0.78, -0.42, 0.27]} rotation={[0.6, 0.3, 0.4]}>
      <mesh
        geometry={geom}
        userData={{ cellPart: "plasmid" }}
        onClick={(e) => {
          e.stopPropagation();
          select("plasmid");
        }}
      >
        <meshStandardMaterial
          color={selected ? "#fff2a8" : "#f6a8bd"}
          emissive={selected ? "#ffb62b" : "#ff6baf"}
          emissiveIntensity={selected ? 3.5 : 0.35}
          toneMapped={!selected}
        />
      </mesh>
      {/* Larger invisible target makes the tiny DNA loop easy to click. */}
      <mesh
        userData={{ cellPart: "plasmid" }}
        onClick={(e) => {
          e.stopPropagation();
          select("plasmid");
        }}
      >
        <torusGeometry args={[0.19, 0.1, 8, 48]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {selected && (
        <>
          <mesh raycast={() => null}>
            <torusGeometry args={[0.3, 0.009, 8, 64]} />
            <meshBasicMaterial
              color="#ffe18a"
              transparent
              opacity={0.95}
              depthTest={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// Keep the magnifier in ordinary React DOM, not a Drei Html portal.
// This avoids a separate React root being unmounted during the Canvas render.
const ENVELOPE_LAYERS: { id: Part; name: string; color: string }[] = [
  { id: "outer", name: "Yttre membran", color: "#76c7d1" },
  { id: "wall", name: "Cellvägg", color: "#e7bd8b" },
  { id: "inner", name: "Inre membran", color: "#6aaea7" },
];

function EnvelopeMagnifier({
  select,
  selected,
}: {
  select: (part: Part) => void;
  selected: Part | null;
}) {
  const active = ENVELOPE_LAYERS.find((layer) => layer.id === selected);
  return (
    <div
      id="ecoli-envelope-magnifier"
      className={`pointer-events-auto absolute left-[45%] z-20 w-[104px] -translate-x-1/2 landscape:left-[43%] landscape:w-[112px] lg:left-[56%] lg:top-[19%] lg:w-[clamp(150px,16vw,210px)] ${selected ? "top-[24%] landscape:top-[20%]" : "top-[34%] landscape:top-[23%]"}`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex justify-center text-center text-[9px] font-semibold text-teal-100 lg:text-xs">
        <span className="inline-flex w-max max-w-none items-center justify-center whitespace-nowrap rounded-full border border-teal-200/40 bg-[#0d2b39]/95 px-3 py-1 shadow-lg">
          {active ? active.name : "Cellhölje · välj lager"}
        </span>
      </div>
      <div className="relative aspect-square rounded-full border-[3px] border-teal-200/80 bg-[#102d3b]/95 p-[14%] shadow-[0_0_25px_#54b8b53b]">
        <div className="flex h-full flex-col justify-center gap-[5%] overflow-hidden rounded-[45%] border border-teal-100/35 bg-[#1c3946] px-[5%]">
          {ENVELOPE_LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              aria-label={`Undersök ${layer.name.toLowerCase()}`}
              onClick={() => select(layer.id)}
              className="relative h-[22%] w-full rounded-[35%] border transition-all hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              style={{
                backgroundColor: layer.color,
                opacity: selected && selected !== layer.id ? 0.6 : 0.95,
                borderColor: selected === layer.id ? "white" : "#c7efed88",
                boxShadow:
                  selected === layer.id ? `0 0 13px ${layer.color}` : "none",
              }}
            >
              <span className="sr-only">{layer.name}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[6%] top-1/2 h-px -translate-y-1/2 bg-white/45"
              />
            </button>
          ))}
        </div>
      </div>
      {/* Decorative handle: stays attached to the lens and never blocks clicks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(100%-13%)] top-[calc(100%-17%)] z-[-1] h-[46%] w-[16%] origin-top -rotate-45 rounded-b-full border border-teal-200/30 bg-[#24495b] shadow-[0_8px_18px_#0008]"
      >
        <div className="mx-auto h-[25%] w-full rounded-t-lg bg-[#9be5e0]" />
      </div>
      <p className="mt-1 text-center text-[9px] text-teal-100/75 sm:text-[10px]">
        Tryck på ett lager
      </p>
    </div>
  );
}

// Update the arrow directly each frame; no React state updates while rotating.
function EnvelopePointer({
  pathRef,
  sceneRef,
  magnifierRef,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  sceneRef: React.RefObject<HTMLElement | null>;
  magnifierRef: React.RefObject<THREE.Group | null>;
}) {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, gl }) => {
    const path = pathRef.current;
    const scene = sceneRef.current;
    const magnifier = document.getElementById("ecoli-envelope-magnifier");
    const model = magnifierRef.current;
    if (!path || !scene || !magnifier || !model) return;
    // The anchor belongs to the actual bacterial envelope, so it follows rotation and bobbing.
    model.updateWorldMatrix(true, false);
    target
      .set(1.12, 0.68, 0.48)
      .applyMatrix4(model.matrixWorld)
      .project(camera);
    const sceneBox = scene.getBoundingClientRect();
    const canvasBox = gl.domElement.getBoundingClientRect();
    const lensBox = magnifier.getBoundingClientRect();
    const x =
      canvasBox.left - sceneBox.left + ((target.x + 1) * canvasBox.width) / 2;
    const y =
      canvasBox.top - sceneBox.top + ((1 - target.y) * canvasBox.height) / 2;
    const startX = lensBox.left - sceneBox.left + lensBox.width * 0.78;
    const startY = lensBox.top - sceneBox.top + lensBox.width * 0.83 + 22;
    path.setAttribute(
      "d",
      `M ${startX} ${startY} Q ${(startX + x) / 2 + 15} ${(startY + y) / 2 - 18} ${x} ${y}`,
    );
    path.style.opacity = target.z > 1 || target.z < -1 ? "0" : "1";
  });
  return null;
}

function Bacterium({
  xray,
  paused,
  select,
  selected,
  magnifierRef,
}: {
  xray: boolean;
  paused: boolean;
  select: (p: Part) => void;
  selected: Part | null;
  magnifierRef: React.RefObject<THREE.Group | null>;
}) {
  // Animate a locally owned ref; keep the inner group exposed to the pointer.
  const bacteriumGroup = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const bacterium = bacteriumGroup.current;

    if (!bacterium || paused) return;

    bacterium.position.y = 0.11 + Math.sin(clock.elapsedTime * 0.65) * 0.025;
    bacterium.rotation.z = 0.012 * Math.sin(clock.elapsedTime * 0.42);
    bacterium.rotation.y = 0.018 * Math.sin(clock.elapsedTime * 0.36);
  });
  // Transparent shells still participate in raycasting. Resolve a click against
  // every intersection so an outer membrane cannot hide the DNA or ribosomes.
  const handleShellClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const hit = e.intersections.find((intersection) => {
      const part = intersection.object.userData.cellPart;
      return typeof part === "string" && PART_ORDER.includes(part as Part);
    });
    if (hit) {
      select(hit.object.userData.cellPart as Part);
    } else {
      // Clicking an empty portion of the visible envelope selects its surface.
      // The two deeper envelope layers are also available in card navigation.
      select("outer");
    }
  };
  return (
    <group ref={bacteriumGroup} position={[0.5, 0.11, 0]}>
      <group ref={magnifierRef} rotation={[0.04, -0.22, 0.08]}>
        <Shell
          radius={0.91}
          length={2.85}
          color="#76c7d1"
          opacity={xray ? 0.065 : 0.24}
          selected={selected === "outer"}
          onClick={handleShellClick}
        />
        <Shell
          radius={0.855}
          length={2.85}
          color="#e7bd8b"
          opacity={xray ? 0.055 : 0.105}
          selected={selected === "wall"}
          onClick={handleShellClick}
        />
        <Shell
          radius={0.81}
          length={2.85}
          color="#6aaea7"
          opacity={xray ? 0.06 : 0.105}
          selected={selected === "inner"}
          onClick={handleShellClick}
        />

        <InternalDNA
          select={select}
          selected={selected === "nucleoid"}
          paused={paused}
        />
        <Particles select={select} selected={selected === "ribosomes"} />
        <Plasmid select={select} selected={selected === "plasmid"} />
        <SurfaceFibers
          select={select}
          selected={selected === "fimbriae"}
          paused={paused}
        />
        <Flagella
          paused={paused}
          select={select}
          selected={selected === "flagella"}
        />
      </group>
    </group>
  );
}
// Keep the entire specimen visible on narrow portrait and landscape screens.
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const distance =
      aspect < 0.75 ? 15.2 : aspect < 1.25 ? 12.2 : aspect < 1.7 ? 10.5 : 8.8;
    camera.position.set(0, 0.1, distance);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export default function EColiCellScene({ onBack }: Props) {
  const [selected, setSelected] = useState<Part | null>(null);
  const [xray, setXray] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [cardCollapsed, setCardCollapsed] = useState(false);
  useEffect(() => {
    if (!showIntro) return;
    const timeout = window.setTimeout(() => setShowIntro(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [showIntro]);
  useEffect(() => {
    const timeout = window.setTimeout(() => setShowHint(false), 6500);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    // Start with the magnifier hidden on mobile.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) return;

    const frame = requestAnimationFrame(() => {
      setShowMagnifier(false);
    });

    return () => cancelAnimationFrame(frame);
  }, []);
  const controls = useRef<OrbitControlsImpl>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const bacteriumRef = useRef<THREE.Group>(null);
  const pointerPathRef = useRef<SVGPathElement>(null);
  const selectPart = (part: Part | null) => {
    setSelected(part);
    if (part) {
      setCardCollapsed(false);
      setShowIntro(false);
      setShowHint(false);
      sceneRef.current?.focus({ preventScroll: true });
    }
  };
  const info = selected ? DATA[selected] : null;
  const handleSceneKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && selected) {
      event.preventDefault();
      selectPart(null);
      return;
    }
    // Like PlantCellScene: Tab cycles only while the scene itself owns focus.
    // Buttons and links retain normal keyboard navigation.
    if (event.key !== "Tab" || !selected || event.target !== sceneRef.current)
      return;
    event.preventDefault();
    const direction = event.shiftKey ? -1 : 1;
    const index = PART_ORDER.indexOf(selected);
    setSelected(
      PART_ORDER[(index + direction + PART_ORDER.length) % PART_ORDER.length],
    );
  };

  return (
    <main
      ref={sceneRef}
      tabIndex={0}
      onKeyDown={handleSceneKeyDown}
      aria-label="Utforska bakterien. Klicka på en celldel och använd Tab eller Skift plus Tab för att bläddra, Escape för att stänga."
      className="relative isolate h-[100dvh] min-h-[420px] w-full overflow-hidden bg-[#06111d] text-[#f6f0ea]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#122a39_0%,#081723_53%,#050e1a_100%)]" />
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.1, 8.8], fov: 42 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true }}
        >
          <ResponsiveCamera />
          <ambientLight intensity={1.45} />
          <hemisphereLight args={["#c4f6f2", "#163b50", 1.5]} />
          <directionalLight
            position={[3, 7, 5]}
            intensity={2.4}
            color="#d8f7f4"
          />
          <pointLight
            position={[-5, 1, 3]}
            intensity={17}
            distance={13}
            color="#54a9bb"
          />
          <Stars
            radius={55}
            depth={30}
            count={180}
            factor={0.65}
            saturation={0}
            fade
            speed={0.1}
          />
          <group scale={1.16}>
            <Bacterium
              xray={xray}
              paused={paused}
              selected={selected}
              select={selectPart}
              magnifierRef={bacteriumRef}
            />
          </group>
          {showMagnifier && (
            <EnvelopePointer
              pathRef={pointerPathRef}
              sceneRef={sceneRef}
              magnifierRef={bacteriumRef}
            />
          )}
          <OrbitControls
            ref={controls}
            target={[0, 0, 0]}
            minDistance={5.4}
            maxDistance={15}
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            minPolarAngle={0.3}
            maxPolarAngle={2.5}
          />
        </Canvas>
      </div>

      {/* Screen-fixed cross-section and a dynamically projected arrow to the real envelope. */}
      {showMagnifier && (
        <>
          <svg
            className="pointer-events-none absolute inset-0 z-[9] h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="ecoli-arrow-tip"
                markerWidth="7"
                markerHeight="7"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path
                  d="M0 0 L6 3 L0 6"
                  fill="none"
                  stroke="#9be5e0"
                  strokeWidth="1.2"
                />
              </marker>
            </defs>
            <path
              ref={pointerPathRef}
              fill="none"
              stroke="#9be5e0"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.8"
              markerEnd="url(#ecoli-arrow-tip)"
            />
          </svg>
          <EnvelopeMagnifier select={selectPart} selected={selected} />
        </>
      )}

      {/* Same visual hierarchy as the animal and plant cell exhibits. */}
      <header
        className={`pointer-events-none absolute z-20 left-[76px] right-3 top-5 lg:left-7 lg:right-7 lg:top-8 max-lg:landscape:top-3 flex items-start justify-between gap-3 transition-opacity duration-700 ${showIntro ? "opacity-100" : "opacity-0"} lg:opacity-100`}
      >
        <div className="w-full max-w-[min(540px,calc(100vw-96px))] lg:max-w-[540px] max-lg:landscape:max-w-[min(440px,calc(100vw-165px))]">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#D8C18D] lg:mb-2">
            THE UNFOLDING UNIVERSE · MUSEUM
          </p>
          <h1 className="font-serif text-[clamp(23px,2.5vw,38px)] leading-tight tracking-tight text-[#F5F2EA] max-lg:landscape:text-[23px]">
            Bakteriens värld
          </h1>
          <p className="mt-1 text-[11px] leading-[1.4] text-[#B6CBD0] lg:mt-2 lg:text-sm">
            Upptäck <i>Escherichia coli</i> (E. coli) – en bakterie utan
            cellkärna.
          </p>
          <p className="mt-1 text-[10px] text-teal-200/80 lg:mt-2 lg:text-[11px]">
            Bakteriecell · <i>Escherichia coli</i> · preparat 003
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="pointer-events-auto mt-12 flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-[#102a3b]/80 px-3 py-2 text-xs backdrop-blur-md transition hover:bg-white/15 lg:mt-12"
          >
            <ArrowLeft size={15} /> Tillbaka
          </button>
        )}
      </header>

      {/* Same permanent navigation as the animal and plant cell exhibits. */}
      <nav
        aria-label="Museumnavigering"
        className="pointer-events-auto absolute right-3 top-3 z-30 hidden items-center gap-2 lg:flex sm:right-7 sm:top-4"
      >
        <Link
          href="/timeline"
          aria-label="Tillbaka till tidslinjen"
          title="Tillbaka till tidslinjen"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-teal-200/25 bg-[#102638]/95 px-3 text-xs font-semibold text-teal-100 shadow-lg backdrop-blur-xl transition hover:bg-[#19384a] focus-visible:outline-2 focus-visible:outline-teal-300"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Tidslinjen</span>
        </Link>
        <Link
          href="/museum/cell-explorer/forskningsstation"
          aria-label="Besök forskningsstationen"
          title="Besök forskningsstationen"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-cyan-300/35 bg-[#16445a]/95 px-3 text-xs font-semibold text-cyan-100 shadow-lg backdrop-blur-xl transition hover:bg-[#205b70] focus-visible:outline-2 focus-visible:outline-cyan-300"
        >
          <Microscope size={16} aria-hidden="true" />
          <span>Forskningsstationen</span>
        </Link>
      </nav>
      <MuseumSceneMenu
        currentExhibitId="cell-explorer"
        className="lg:hidden"
        onExplore={() => {
          selectPart(null);
          setShowIntro(false);
        }}
        onAbout={() => {
          selectPart(null);
          setShowIntro(true);
        }}
        onParts={() => selectPart("nucleoid")}
        experiments={[]}
      />

      <style>{`
        /* Museum HUD anchors: one authoritative rule set per scene. */
        .museum-scene-hint { position:absolute; left:50%; bottom:90px; transform:translateX(-50%); z-index:10; width:max-content; max-width:calc(100% - 32px); pointer-events:none; }
        .museum-scene-specimen { position:absolute; left:16px; bottom:94px; z-index:10; pointer-events:none; }
        @media (max-width:1023px) and (orientation:portrait) {
          .museum-scene-hint { bottom:190px; }
          .museum-scene-specimen { bottom:164px; }
        }
        @media (max-width:1023px) and (orientation:landscape) {
          .museum-scene-hint { bottom:112px; max-width:min(240px, calc(100% - 32px)); }
          .museum-scene-specimen { bottom:125px; }
        }
      `}</style>
      {/* Top-right controls, matching the other specimens. */}
      <div className="absolute right-3 top-[140px] z-30 flex flex-col items-end gap-1.5 landscape:max-lg:top-3 lg:right-7 lg:top-[94px] lg:gap-2">
        <button
          type="button"
          onClick={() => setShowMagnifier((value) => !value)}
          aria-pressed={showMagnifier}
          aria-controls="ecoli-envelope-magnifier"
          title={
            showMagnifier ? "Dölj förstoringsglas" : "Visa förstoringsglas"
          }
          aria-label={
            showMagnifier ? "Dölj förstoringsglas" : "Visa förstoringsglas"
          }
          className={`flex h-9 w-9 items-center justify-center gap-2 rounded-full border xl:w-auto px-2.5 text-xs backdrop-blur-xl transition xl:px-3 ${showMagnifier ? "border-teal-300/60 bg-teal-300/20 text-teal-50" : "border-white/20 bg-[#102a3b]/80 hover:bg-white/10"}`}
        >
          <Search size={15} aria-hidden="true" />
          <span className="hidden xl:inline">
            {showMagnifier ? "Dölj förstoringsglas" : "Visa förstoringsglas"}
          </span>
        </button>
        <button
          onClick={() => setXray((v) => !v)}
          title={xray ? "Visa cellhöljet" : "Genomlysning"}
          aria-label={xray ? "Visa cellhöljet" : "Genomlysning"}
          className={`flex h-9 w-9 items-center justify-center gap-2 rounded-full border xl:w-auto px-2.5 text-xs backdrop-blur-xl transition xl:px-3 ${xray ? "border-teal-300/60 bg-teal-300/20" : "border-white/20 bg-[#102a3b]/80 hover:bg-white/10"}`}
        >
          {xray ? <EyeOff size={15} /> : <Eye size={15} />}
          <span className="hidden xl:inline">
            {xray ? "Visa cellhöljet" : "Genomlysning"}
          </span>
        </button>
        <button
          title={paused ? "Fortsätt" : "Pausa"}
          aria-label={paused ? "Fortsätt" : "Pausa"}
          onClick={() => setPaused((v) => !v)}
          className="flex h-9 w-9 items-center justify-center gap-2 rounded-full border xl:w-auto border-white/20 bg-[#102a3b]/80 px-2.5 text-xs backdrop-blur-xl hover:bg-white/10 xl:px-3"
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span className="hidden xl:inline">
            {paused ? "Fortsätt" : "Pausa"}
          </span>
        </button>
        <button
          title="Återställ vy"
          aria-label="Återställ vy"
          onClick={() => controls.current?.reset()}
          className="flex h-9 w-9 items-center justify-center gap-2 rounded-full border xl:w-auto border-white/20 bg-[#102a3b]/80 px-2.5 text-xs backdrop-blur-xl hover:bg-white/10 xl:px-3"
        >
          <RotateCcw size={14} />{" "}
          <span className="hidden xl:inline">Återställ vy</span>
        </button>
      </div>

      {showHint && !selected && (
        <div className="museum-scene-hint rounded-xl border border-white/10 bg-[#102a3b]/90 px-3 py-2 text-center text-[11px] text-slate-200 shadow-lg backdrop-blur-md lg:px-4 lg:py-3 lg:text-xs">
          Dra för att rotera · Zooma för att utforska
          <span className="mt-1 block text-[11px] text-amber-200/85">
            Tryck på en del av bakterien · undersök cellhöljets lager i
            förstoringsglaset
          </span>
        </div>
      )}

      {/* A contextual card opens ONLY when a structure is clicked. */}
      {info && (
        <aside
          role="dialog"
          aria-label={info.name}
          className={`absolute bottom-[70px] left-3 right-3 z-40 overflow-y-auto rounded-2xl border border-white/15 bg-[#102735]/95 shadow-2xl backdrop-blur-2xl landscape:max-lg:bottom-[60px] landscape:max-lg:left-auto landscape:max-lg:right-3 landscape:max-lg:top-[58px] landscape:max-lg:bottom-auto landscape:max-lg:w-[min(270px,38vw)] lg:bottom-auto lg:left-auto lg:right-7 lg:top-[205px] lg:w-[min(340px,35vw)] ${cardCollapsed ? "max-h-[72px] px-4 py-3 lg:px-5 lg:py-3 overflow-hidden" : "max-h-[min(38dvh,300px)] p-4 landscape:max-lg:max-h-[calc(100dvh-120px)] lg:max-h-[min(58dvh,470px)] lg:p-5"}`}
        >
          <div
            className={`flex justify-between gap-3 ${cardCollapsed ? "items-center" : "items-start"}`}
          >
            <div className="min-w-0 flex-1">
              {!cardCollapsed && (
                <>
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-teal-200/80">
                    <Info size={13} /> UNDERSÖK E. COLI
                  </p>
                  <div
                    className="mb-2 h-1 w-11 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                </>
              )}
              <h2
                className={`font-serif leading-tight ${cardCollapsed ? "text-base" : "text-xl lg:text-2xl"}`}
              >
                {info.name}
              </h2>
              {!cardCollapsed && (
                <p className="mt-1 text-xs text-teal-200/85">{info.subtitle}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setCardCollapsed((value) => !value)}
                aria-expanded={!cardCollapsed}
                aria-label={
                  cardCollapsed
                    ? "Expandera information"
                    : "Minimera information"
                }
                title={
                  cardCollapsed ? "Visa information" : "Minimera information"
                }
                className="rounded-full p-1.5 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-teal-200"
              >
                {cardCollapsed ? (
                  <ChevronUp size={19} />
                ) : (
                  <ChevronDown size={19} />
                )}
              </button>
              <button
                type="button"
                onClick={() => selectPart(null)}
                aria-label="Stäng information"
                className="rounded-full p-1.5 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-teal-200"
              >
                <X size={19} />
              </button>
            </div>
          </div>
          {!cardCollapsed && (
            <>
              <p className="mt-3 text-sm leading-relaxed text-slate-200 landscape:max-lg:text-xs lg:mt-4">
                {info.description}
              </p>
              <p className="mt-4 hidden border-t border-white/10 pt-3 text-[11px] text-teal-100/75 lg:block">
                Tab: nästa del · Skift+Tab: föregående · Esc: stäng
              </p>
              <p className="mt-4 hidden border-t border-white/10 pt-3 text-[11px] leading-relaxed text-slate-400 lg:block">
                Vetenskaplig 3D-modell: strukturer och storlekar är schematiska.
              </p>
            </>
          )}
        </aside>
      )}

      <div className="museum-scene-specimen text-[11px] text-teal-100/65">
        <i>E. coli</i> · 003
      </div>
    </main>
  );
}
