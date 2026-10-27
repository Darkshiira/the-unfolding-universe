"use client";

import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import {
  RotateCcw,
  X,
  Wind,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TimelineBackLink from "@/components/TimelineBackLink";
import * as THREE from "three";

type OrganelleId = "nucleus" | "mitochondria" | "er" | "golgi";

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
}: {
  selected: boolean;
  onSelect: () => void;
  motion?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(0);
  const pores = useMemo(
    () =>
      Array.from({ length: 63 }, (_, i) => {
        // Deterministic jitter breaks the artificial golden-angle dot pattern.
        const hash = (n: number) => {
          const v = Math.sin(n * 127.1 + 78.233) * 43758.5453;
          return v - Math.floor(v);
        };
        const y = THREE.MathUtils.clamp(
          1 - (2 * (i + 0.5)) / 63 + (hash(i * 3 + 1) - 0.5) * 0.115,
          -0.985,
          0.985,
        );
        const a = i * 2.399963229728653 + (hash(i * 3 + 2) - 0.5) * 0.85;
        const r = Math.sqrt(1 - y * y);
        return {
          position: [
            0.786 * r * Math.cos(a),
            0.733 * y,
            0.748 * r * Math.sin(a),
          ] as [number, number, number],
          size: 0.008 + hash(i * 3 + 3) * 0.006,
        };
      }),
    [],
  );
  const chromatin = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => {
        const golden = i * 2.39996323;
        const r = 0.15 + 0.46 * Math.pow((i + 0.5) / 64, 0.72);
        const y = 1 - (2 * (((i * 37) % 64) + 0.5)) / 64;
        const radial = Math.sqrt(1 - y * y);
        const center = new THREE.Vector3(
          r * radial * Math.cos(golden),
          r * y * 0.92,
          r * radial * Math.sin(golden) * 0.94,
        );
        const points: THREE.Vector3[] = [];
        for (let j = 0; j <= 16; j++) {
          const t = j / 16;
          const a = golden + t * (2.4 + (i % 4) * 0.7);
          points.push(
            new THREE.Vector3(
              center.x + 0.035 * Math.sin(a * 2.1) + (t - 0.5) * 0.07,
              center.y +
                0.035 * Math.cos(a * 1.8) +
                0.018 * Math.sin(t * 14 + i),
              center.z + 0.038 * Math.sin(a * 1.3) + (t - 0.5) * 0.045,
            ),
          );
        }
        return new THREE.CatmullRomCurve3(points);
      }),
    [],
  );
  const chromatinGranules = useMemo(
    () =>
      Array.from({ length: 95 }, (_, i) => {
        const a = i * 2.399963;
        const r = 0.18 + (i % 9) * 0.037;
        return [
          r * Math.cos(a),
          r * Math.sin(a * 1.31) * 0.84,
          r * Math.sin(a * 0.79),
        ] as [number, number, number];
      }),
    [],
  );
  useFrame((_, delta) => {
    if (motion) phase.current += Math.min(delta, 0.05);
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(phase.current * 0.17) * 0.045;
    ref.current.rotation.z = Math.sin(phase.current * 0.11 + 1) * 0.012;
  });
  return (
    <group ref={ref} position={[-0.35, 0.2, 0]}>
      <mesh
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onSelect();
        }}
        scale={[1, 0.93, 0.95]}
      >
        <sphereGeometry args={[0.78, 56, 40]} />
        <meshPhysicalMaterial
          color={selected ? "#C9A5F0" : "#9478B5"}
          roughness={0.57}
          transparent
          opacity={0.78}
          depthWrite={false}
          emissive={selected ? "#8D60D3" : "#29153D"}
          emissiveIntensity={selected ? 0.4 : 0.07}
        />
      </mesh>
      {/* The darker inner volume adds depth without obscuring the chromatin. */}
      <mesh scale={[0.955, 0.885, 0.9]} raycast={() => null}>
        <sphereGeometry args={[0.78, 40, 32]} />
        <meshStandardMaterial
          color="#654987"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>
      {chromatin.map((curve, i) => (
        <mesh key={`chromatin-${i}`} raycast={() => null}>
          <tubeGeometry
            args={[curve, 22, 0.0028 + (i % 4) * 0.0008, 4, false]}
          />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#E0B9EF" : "#A98ACB"}
            transparent
            opacity={i % 5 === 0 ? 0.54 : 0.31}
            depthWrite={false}
            roughness={0.9}
          />
        </mesh>
      ))}
      {chromatinGranules.map((position, i) => (
        <mesh
          key={`chromatin-granule-${i}`}
          position={position}
          raycast={() => null}
        >
          <sphereGeometry args={[0.006 + (i % 3) * 0.003, 6, 5]} />
          <meshBasicMaterial
            color={i % 4 === 0 ? "#D6B3E8" : "#9D80BE"}
            transparent
            opacity={0.38}
            depthWrite={false}
          />
        </mesh>
      ))}
      {pores.map((position, i) => (
        <mesh
          key={`pore-${i}`}
          position={position.position}
          raycast={() => null}
        >
          <sphereGeometry args={[position.size, 7, 6]} />
          <meshStandardMaterial
            color="#61457F"
            transparent
            opacity={0.82}
            roughness={0.85}
          />
        </mesh>
      ))}
      {Array.from({ length: 38 }, (_, i) => {
        const y = 1 - (2 * (i + 0.5)) / 38;
        const r = Math.sqrt(1 - y * y);
        const a = i * 2.399963;
        return (
          <mesh
            key={`nucleolus-grain-${i}`}
            position={[
              0.14 + 0.204 * r * Math.cos(a),
              0.05 + 0.204 * y,
              0.43 + 0.204 * r * Math.sin(a),
            ]}
            raycast={() => null}
          >
            <sphereGeometry args={[0.009, 6, 5]} />
            <meshBasicMaterial
              color="#A879C7"
              transparent
              opacity={0.6}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      <mesh position={[0.14, 0.05, 0.43]} raycast={() => null}>
        <sphereGeometry args={[0.205, 28, 22]} />
        <meshStandardMaterial
          color="#C8A1E1"
          roughness={0.72}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
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
type ERPatch = {
  angle: number;
  radius: number;
  phase: number;
  width: number;
  halfSpan: number;
  depth: number;
  folds: number;
  drift: number;
};

// Uneven angular spacing, widths, radial offsets and numbers of turns.
const ER_PATCHES: ERPatch[] = [
  // Intentionally uneven: two regions crowd together at upper-left,
  // one reaches outward at the right, and two differ below the nucleus.
  {
    angle: 2.63,
    radius: 0.76,
    phase: 0.31,
    width: 0.43,
    halfSpan: 0.39,
    depth: 0.37,
    folds: 8,
    drift: -0.075,
  },
  {
    angle: 1.83,
    radius: 0.81,
    phase: 2.13,
    width: 0.29,
    halfSpan: 0.25,
    depth: 0.26,
    folds: 5,
    drift: 0.055,
  },
  {
    angle: 0.19,
    radius: 0.88,
    phase: 3.77,
    width: 0.46,
    halfSpan: 0.43,
    depth: 0.41,
    folds: 9,
    drift: -0.035,
  },
  {
    angle: -1.04,
    radius: 0.79,
    phase: 5.13,
    width: 0.33,
    halfSpan: 0.28,
    depth: 0.31,
    folds: 6,
    drift: 0.082,
  },
  {
    angle: -2.49,
    radius: 0.85,
    phase: 6.54,
    width: 0.38,
    halfSpan: 0.36,
    depth: 0.35,
    folds: 7,
    drift: -0.055,
  },
];

function makeERPath(patch: ERPatch) {
  const points: THREE.Vector3[] = [];
  const n = patch.folds;
  const lanes = Array.from(
    { length: n + 1 },
    (_, i) =>
      0.012 + patch.depth * (i / n) + 0.009 * Math.sin(i * 1.83 + patch.phase),
  );
  const lefts = Array.from(
    { length: n + 1 },
    (_, i) =>
      patch.drift -
      patch.halfSpan *
        (0.64 + 0.34 * (0.5 + 0.5 * Math.sin(i * 1.71 + patch.phase))),
  );
  const rights = Array.from(
    { length: n + 1 },
    (_, i) =>
      patch.drift +
      patch.halfSpan *
        (0.6 + 0.39 * (0.5 + 0.5 * Math.sin(i * 1.37 + patch.phase * 0.71))),
  );

  // Each lane travels tangentially along the nucleus. A smooth U-turn
  // joins it to the next lane farther from the nucleus.
  for (let i = 0; i <= n; i++) {
    const goingRight = i % 2 === 0;
    const startX = goingRight ? lefts[i] : rights[i];
    const endX = goingRight ? rights[i] : lefts[i];
    const y = lanes[i];
    for (let j = 0; j <= 28; j++) {
      if (i > 0 && j === 0) continue;
      const u = j / 28;
      points.push(
        new THREE.Vector3(
          THREE.MathUtils.lerp(startX, endX, u),
          y +
            (0.004 + 0.003 * Math.sin(i * 1.29 + patch.phase)) *
              Math.sin(u * Math.PI * 2 + patch.phase + i * 0.63) *
              Math.sin(u * Math.PI),
          0,
        ),
      );
    }
    if (i === n) break;

    // Rounded hairpin with a gently drifting tip. Unlike the previous
    // geometry, there is no long, flat bridge at the turn.
    const nextX = goingRight ? rights[i + 1] : lefts[i + 1];
    const nextY = lanes[i + 1];
    const tipX = goingRight ? Math.max(endX, nextX) : Math.min(endX, nextX);
    const direction = goingRight ? 1 : -1;
    const bulge = 0.018 + 0.01 * (0.5 + 0.5 * Math.sin(i * 2.17 + patch.phase));
    const turn = new THREE.CubicBezierCurve3(
      new THREE.Vector3(endX, y, 0),
      new THREE.Vector3(tipX + direction * bulge, y + 0.003, 0),
      new THREE.Vector3(tipX + direction * bulge, nextY - 0.003, 0),
      new THREE.Vector3(nextX, nextY, 0),
    );
    for (let j = 1; j <= 20; j++) points.push(turn.getPoint(j / 20));
  }
  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.3);
}

function makeERMembrane(patch: ERPatch) {
  const along = patch.folds * 100;
  const across = 16;
  const ring = across + 1;
  const count = (along + 1) * ring;
  const centers: THREE.Vector3[] = [];
  const path = makeERPath(patch);
  for (let i = 0; i <= along; i++) {
    const t = i / along;
    const pt = path.getPoint(t);
    const theta = patch.angle + pt.x / patch.radius;
    const radius = patch.radius + pt.y;
    // An undulating silhouette, with rounded, softly narrowing tips.
    // Width does not collapse into sharp points or identical straight edges.
    const endTaper = 1 - 0.4 * Math.pow(Math.abs(t * 2 - 1), 6);
    const breadth =
      patch.width *
      endTaper *
      (0.8 +
        0.12 * Math.sin(t * 13 + patch.phase) +
        0.09 * Math.sin(t * 29 + patch.phase * 1.7) +
        0.045 * Math.sin(t * 47 + patch.phase * 0.8));
    for (let j = 0; j <= across; j++) {
      const v = (j / across) * 2 - 1;
      // A shallow, inflated cross-section rather than a flat rectangular panel.
      // Rounded shoulders become especially visible when the cell is rotated.
      const shoulder = Math.pow(Math.abs(v), 4);
      const r =
        radius +
        0.026 * (1 - v * v) +
        0.012 * (1 - v * v) * Math.sin(t * 11 + patch.phase) +
        0.006 * Math.sin(v * 3.2 + t * 17 + patch.phase) -
        0.009 * shoulder;
      const softenedEdge = v * (1 - 0.095 * shoulder);
      centers.push(
        new THREE.Vector3(
          Math.cos(theta) * r,
          Math.sin(theta) * r * 0.96,
          -0.08 +
            softenedEdge * breadth * 0.5 +
            0.016 * Math.sin(t * 9 + patch.phase) * (1 - v * v) +
            0.008 * Math.sin(t * 21 + v * 2 + patch.phase) * (1 - shoulder),
        ),
      );
    }
  }
  const positions: number[] = [];
  const indices: number[] = [];
  for (let side = 0; side < 2; side++) {
    const sign = side === 0 ? 1 : -1;
    for (let i = 0; i <= along; i++) {
      for (let j = 0; j <= across; j++) {
        const k = i * ring + j;
        const longitudinal = centers[Math.min(along, i + 1) * ring + j]
          .clone()
          .sub(centers[Math.max(0, i - 1) * ring + j]);
        const lateral = centers[i * ring + Math.min(across, j + 1)]
          .clone()
          .sub(centers[i * ring + Math.max(0, j - 1)]);
        const normal = longitudinal.cross(lateral).normalize();
        const v = (j / across) * 2 - 1;
        const thickness = 0.01 + 0.006 * Math.pow(Math.abs(v), 6);
        const point = centers[k]
          .clone()
          .addScaledVector(normal, sign * thickness);
        positions.push(point.x, point.y, point.z);
      }
    }
  }
  for (let side = 0; side < 2; side++) {
    const offset = side * count;
    for (let i = 0; i < along; i++) {
      for (let j = 0; j < across; j++) {
        const a = offset + i * ring + j;
        const b = a + ring;
        if (side === 0) indices.push(a, b, a + 1, a + 1, b, b + 1);
        else indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  const perimeter: number[] = [];
  for (let j = 0; j <= across; j++) perimeter.push(j);
  for (let i = 1; i <= along; i++) perimeter.push(i * ring + across);
  for (let j = across - 1; j >= 0; j--) perimeter.push(along * ring + j);
  for (let i = along - 1; i >= 1; i--) perimeter.push(i * ring);
  for (let i = 0; i < perimeter.length; i++) {
    const x = perimeter[i],
      y = perimeter[(i + 1) % perimeter.length];
    indices.push(x, y, x + count, y, y + count, x + count);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function EndoplasmicReticulum({
  selected,
  onSelect,
  motion,
}: {
  selected: boolean;
  onSelect: () => void;
  motion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useRef(0);
  useFrame((_, delta) => {
    if (motion) phase.current += Math.min(delta, 0.05);
    if (!groupRef.current) return;
    const t = phase.current;
    groupRef.current.scale.set(
      1 + 0.007 * Math.sin(t * 0.38),
      1 + 0.009 * Math.sin(t * 0.29 + 1),
      1 + 0.013 * Math.sin(t * 0.33 + 2),
    );
    groupRef.current.rotation.z = 0.08 + 0.011 * Math.sin(t * 0.23);
  });
  const meshes = useMemo(() => ER_PATCHES.map(makeERMembrane), []);
  useEffect(() => () => meshes.forEach((mesh) => mesh.dispose()), [meshes]);

  const ribosomes = useMemo(() => {
    const dots: [number, number, number][] = [];
    ER_PATCHES.forEach((patch, pi) => {
      const path = makeERPath(patch);
      const count = patch.folds * 17;
      for (let j = 0; j < count; j++) {
        const t = (j + 0.5) / count;
        const v = Math.sin(j * 2.399 + pi * 1.8) * 0.83;
        const pt = path.getPoint(t);
        const theta = patch.angle + pt.x / patch.radius;
        const r =
          patch.radius +
          pt.y +
          0.012 +
          0.026 * (1 - v * v) +
          0.012 * (1 - v * v) * Math.sin(t * 11 + patch.phase) +
          0.006 * Math.sin(v * 3.2 + t * 17 + patch.phase) -
          0.009 * Math.pow(Math.abs(v), 4);
        const breadth =
          patch.width *
          (1 - 0.4 * Math.pow(Math.abs(t * 2 - 1), 6)) *
          (0.8 +
            0.12 * Math.sin(t * 13 + patch.phase) +
            0.09 * Math.sin(t * 29 + patch.phase * 1.7) +
            0.045 * Math.sin(t * 47 + patch.phase * 0.8));
        dots.push([
          Math.cos(theta) * r,
          Math.sin(theta) * r * 0.96,
          -0.08 +
            v * (1 - 0.095 * Math.pow(Math.abs(v), 4)) * breadth * 0.5 +
            0.016 * Math.sin(t * 9 + patch.phase) * (1 - v * v) +
            0.008 *
              Math.sin(t * 21 + v * 2 + patch.phase) *
              (1 - Math.pow(Math.abs(v), 4)),
        ]);
      }
    });
    return dots;
  }, []);

  // A soft membrane neck joins each pair of ER regions. Unlike a thin
  // tubular ring, these are broad, gently inflated surfaces which narrow
  // between the folds and flare into their attachment points.
  // Only two discreet local membrane necks are visible. The other regions
  // meet the nuclear envelope directly; there is deliberately NO five-sided
  // perimeter connecting every patch around the nucleus.
  const bridges = useMemo(
    () =>
      [0, 3].map((i) => {
        const patch = ER_PATCHES[i];
        const next = ER_PATCHES[(i + 1) % ER_PATCHES.length];
        const pathA = makeERPath(patch);
        const pathB = makeERPath(next);
        // Join the nearest inner corners, rather than running a bridge
        // all the way around the nuclear envelope.
        const a = pathA.getPoint(0);
        const b = pathB.getPoint(0);
        const angleA = patch.angle + a.x / patch.radius;
        const angleB = next.angle + b.x / next.radius;

        const rA = patch.radius + a.y;
        const rB = next.radius + b.y;
        const along = 44;
        const across = 12;
        const stride = across + 1;
        const vertexCount = (along + 1) * stride;
        const vertices: number[] = [];
        const indices: number[] = [];

        for (let side = 0; side < 2; side++) {
          for (let j = 0; j <= along; j++) {
            const t = j / along;
            const ease = t * t * (3 - 2 * t);
            const angle = THREE.MathUtils.lerp(angleA, angleB, ease);
            // Tuck the middle of the connector behind the nuclear envelope.
            const radial =
              THREE.MathUtils.lerp(rA, rB, ease) -
              0.17 * Math.sin(Math.PI * t) +
              0.009 *
                Math.sin(t * Math.PI * 3 + patch.phase) *
                Math.sin(Math.PI * t);
            const neck = Math.pow(Math.sin(Math.PI * t), 0.8);
            const width =
              THREE.MathUtils.lerp(patch.width, next.width, ease) *
              (1 - 0.72 * neck) *
              (0.96 + 0.04 * Math.sin(t * 15 + patch.phase));
            for (let k = 0; k <= across; k++) {
              const v = (k / across) * 2 - 1;
              const swell = Math.sin(Math.PI * t) * (1 - v * v);
              // The connector swells softly at the shoulders and sits behind
              // the visible folds, avoiding the appearance of a thin circular ring.
              const r =
                radial +
                0.02 * (1 - v * v) +
                0.012 * swell * Math.sin(t * 12 + patch.phase) +
                (side === 0 ? 0.01 : -0.01);
              const z =
                -0.08 +
                v * (1 - 0.09 * Math.pow(Math.abs(v), 4)) * width * 0.5 +
                0.012 * swell * Math.sin(t * 9 + patch.phase);
              vertices.push(Math.cos(angle) * r, Math.sin(angle) * r * 0.96, z);
            }
          }
        }
        for (let side = 0; side < 2; side++) {
          const offset = side * vertexCount;
          for (let j = 0; j < along; j++) {
            for (let k = 0; k < across; k++) {
              const a = offset + j * stride + k;
              const b = a + stride;
              if (side === 0) indices.push(a, b, a + 1, a + 1, b, b + 1);
              else indices.push(a, a + 1, b, a + 1, b + 1, b);
            }
          }
        }
        // Seal the exposed side edges to give the neck a membrane thickness.
        for (let j = 0; j < along; j++) {
          for (const k of [0, across]) {
            const a = j * stride + k;
            const b = (j + 1) * stride + k;
            indices.push(
              a,
              b,
              a + vertexCount,
              b,
              b + vertexCount,
              a + vertexCount,
            );
          }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3),
        );
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        return geometry;
      }),
    [],
  );
  useEffect(() => () => bridges.forEach((g) => g.dispose()), [bridges]);

  return (
    <group
      ref={groupRef}
      position={[-0.35, 0.12, -0.38]}
      rotation={[0.1, -0.18, 0.08]}
    >
      {bridges.map((geometry, i) => (
        <mesh key={`bridge-${i}`} geometry={geometry} raycast={() => null}>
          <meshStandardMaterial
            color={selected ? "#A9E2EA" : "#68AABE"}
            side={THREE.DoubleSide}
            roughness={0.76}
            transparent
            opacity={0.43}
            depthWrite={false}
            emissive="#163944"
            emissiveIntensity={0.09}
          />
        </mesh>
      ))}
      {meshes.map((geometry, i) => (
        <mesh
          key={i}
          geometry={geometry}
          onClick={(event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation();
            onSelect();
          }}
        >
          <meshStandardMaterial
            color={selected ? "#A9E2EA" : "#68AABE"}
            side={THREE.DoubleSide}
            roughness={0.74}
            emissive={selected ? "#317F96" : "#163944"}
            emissiveIntensity={selected ? 0.35 : 0.09}
          />
        </mesh>
      ))}
      {ribosomes.map((position, i) => (
        <mesh key={i} position={position} raycast={() => null}>
          <sphereGeometry args={[0.009, 6, 5]} />
          <meshStandardMaterial color="#D9E8E7" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// A Golgi cisterna is a closed, flattened membrane pouch — not an open ribbon.
// Seven separate sacs are nested tightly, with softly inflated rims and a
// shared shallow crescent curvature. The geometry is deterministic and light.
function makeGolgiCisterna(layer: number, count: number) {
  // A closed, gently cupped membrane sac with independently curled,
  // slightly swollen ends. Each cisterna remains a separate compartment.
  const along = 56;
  const across = 18;
  const vertices: number[] = [];
  const indices: number[] = [];
  const middle = (count - 1) / 2;
  const distance = Math.abs(layer - middle) / middle;

  // Non-identical lengths help break the perfectly aligned "pancake" silhouette.
  const length = 0.49 - distance * 0.045 + 0.022 * Math.sin(layer * 1.83);
  const breadth = 0.225 - distance * 0.014;
  const yBase = (layer - middle) * 0.075;

  const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  for (let face = 0; face < 2; face++) {
    const sign = face === 0 ? 1 : -1;
    for (let i = 0; i <= along; i++) {
      const u = i / along;
      const xNorm = u * 2 - 1;
      const endness = Math.abs(xNorm);
      // Round the footprint, without collapsing its tips into sharp triangles.
      const capRoundness = 0.095 + 0.012 * Math.sin(layer * 1.4);
      const rounded = 1 - 0.035 * smoothstep(0.76, 1, endness);
      const curl = smoothstep(0.7, 1, endness);
      const rim = smoothstep(0.76, 1, endness);
      for (let j = 0; j <= across; j++) {
        const v = (j / across) * 2 - 1;
        const sideRim = smoothstep(0.76, 1, Math.abs(v));

        // A gentle scoop across the broad face, not a flat strip.
        const cup = 0.035 * v * v;
        const crescent = 0.065 * xNorm * xNorm;
        const curlDirection = xNorm < 0 ? 0.84 : 1;
        const endCurl = 0.052 * curl * curlDirection;
        const sideCurl = 0.012 * sideRim * (0.5 + 0.5 * curl);

        // A little asymmetry between cisternae and their two tips.
        const irregular =
          0.006 * Math.sin(u * 8.2 + layer * 0.69) * (1 - 0.4 * Math.abs(v));
        // Rounded capsule-like outline: the tips keep their width and
        // curve around smoothly rather than collapsing into spikes.
        const roundedCorner =
          capRoundness * (1 - Math.sqrt(Math.max(0, 1 - v * v)));
        const x =
          (length - roundedCorner) * xNorm +
          0.009 * Math.sin(v * Math.PI + layer * 0.35) * (1 - endness);
        const z =
          breadth * rounded * v +
          0.036 * Math.sin(xNorm * Math.PI * 0.75) +
          0.008 * curl * Math.sign(xNorm);

        // The rim is thicker than the middle, like a sealed membrane pouch.
        const thickness =
          0.012 + 0.012 * sideRim + 0.01 * rim + 0.004 * (1 - v * v);

        const y =
          yBase +
          cup +
          crescent +
          endCurl +
          sideCurl +
          irregular +
          sign * thickness;
        vertices.push(x, y, z);
      }
    }
  }

  const faceSize = (along + 1) * (across + 1);
  for (let face = 0; face < 2; face++) {
    const offset = face * faceSize;
    for (let i = 0; i < along; i++) {
      for (let j = 0; j < across; j++) {
        const a = offset + i * (across + 1) + j;
        const b = a + 1;
        const c = a + across + 1;
        const d = c + 1;
        if (face === 0) indices.push(a, c, b, b, c, d);
        else indices.push(a, b, c, b, d, c);
      }
    }
  }

  // Close the entire perimeter, including the curled tips.
  const perimeter: number[] = [];
  for (let j = 0; j <= across; j++) perimeter.push(j);
  for (let i = 1; i <= along; i++) perimeter.push(i * (across + 1) + across);
  for (let j = across - 1; j >= 0; j--)
    perimeter.push(along * (across + 1) + j);
  for (let i = along - 1; i >= 1; i--) perimeter.push(i * (across + 1));
  for (let k = 0; k < perimeter.length; k++) {
    const a = perimeter[k];
    const b = perimeter[(k + 1) % perimeter.length];
    indices.push(a, b, a + faceSize, b, b + faceSize, a + faceSize);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function GolgiApparatus({
  selected,
  onSelect,
  motion,
}: {
  selected: boolean;
  onSelect: () => void;
  motion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useRef(0);
  useFrame((_, delta) => {
    if (motion) phase.current += Math.min(delta, 0.05);
    if (!groupRef.current) return;
    groupRef.current.position.y =
      -0.75 + 0.025 * Math.sin(phase.current * 0.32 + 1);
    groupRef.current.rotation.z =
      -0.24 + 0.018 * Math.sin(phase.current * 0.27);
  });
  const layers = useMemo(
    () => Array.from({ length: 7 }, (_, i) => makeGolgiCisterna(i, 7)),
    [],
  );
  useEffect(() => () => layers.forEach((g) => g.dispose()), [layers]);
  return (
    <group
      ref={groupRef}
      position={[0.92, -0.75, 0.5]}
      rotation={[0.25, -0.35, -0.24]}
    >
      {layers.map((geometry, i) => (
        <mesh
          key={i}
          geometry={geometry}
          onClick={(event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation();
            onSelect();
          }}
        >
          <meshStandardMaterial
            color={selected ? "#F5C7DD" : i % 2 ? "#CE96B4" : "#BE85A8"}
            side={THREE.DoubleSide}
            roughness={0.66}
            metalness={0.02}
            emissive={selected ? "#8D426D" : "#351D30"}
            emissiveIntensity={selected ? 0.32 : 0.07}
          />
        </mesh>
      ))}
      {/* Vesicles cluster near the outer rims of the stack. */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = i * 2.39996;
        const side = i % 2 ? 1 : -1;
        const x = side * (0.49 + (i % 3) * 0.045);
        const y = ((i % 7) - 3) * 0.074 + 0.1 + Math.sin(angle) * 0.045;
        const z = Math.sin(angle * 1.4) * 0.24;
        return (
          <mesh key={`vesicle-${i}`} position={[x, y, z]} raycast={() => null}>
            <sphereGeometry args={[0.027 + (i % 3) * 0.008, 10, 8]} />
            <meshStandardMaterial color="#D8A6C2" roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

// Cytoskeletal strands (stylized actin / microtubules) and gently drifting cytoplasmic vesicles.
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
            <sphereGeometry args={[0.047, 12, 10]} />
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
            <sphereGeometry args={[0.044, 12, 10]} />
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
      camera={{ position: [0, 0, landscape ? 6.2 : 4.15], fov: 38 }}
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
}: {
  selected: OrganelleId | null;
  onSelect: (id: OrganelleId) => void;
  motion: boolean;
  oxygen: boolean;
  oxygenStageChange: (stage: OxygenStage) => void;
  xray: boolean;
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
      {oxygen && (
        <OxygenMolecules
          enabled={oxygen}
          motion={motion}
          onStage={oxygenStageChange}
        />
      )}

      <Nucleus
        motion={motion}
        selected={selected === "nucleus"}
        onSelect={() => onSelect("nucleus")}
      />

      <EndoplasmicReticulum
        motion={motion}
        selected={selected === "er"}
        onSelect={() => onSelect("er")}
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
  landscape,
}: {
  selected: OrganelleId | null;
  onSelect: (id: OrganelleId | null) => void;
  resetKey: number;
  motion: boolean;
  oxygen: boolean;
  oxygenStageChange: (stage: OxygenStage) => void;
  xray: boolean;
  landscape: boolean;
}) {
  return (
    <Canvas
      camera={{ position: landscape ? [0, 0, 7.7] : [0, 0.2, 5.9], fov: 48 }}
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
          key={landscape ? "landscape" : "portrait"}
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
  const [oxygenCollapsed, setOxygenCollapsed] = useState(false);
  const [respirationCollapsed, setRespirationCollapsed] = useState(false);
  const [landscape, setLandscape] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      "(orientation: landscape) and (max-height: 500px)",
    );
    const update = () => setLandscape(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const [resetKey, setResetKey] = useState(0);
  const [oxygen, setOxygen] = useState(false);
  const [oxygenStage, setOxygenStage] = useState<OxygenStage>("entry");
  const [respirationPhase, setRespirationPhase] = useState<RespirationPhase>(0);
  const [respirationPhaseKey, setRespirationPhaseKey] = useState(0);
  const nextRespirationPhase = () =>
    setRespirationPhase((current) => ((current + 1) % 4) as RespirationPhase);
  function chooseRespirationPhase(next: RespirationPhase) {
    setRespirationPhase(next);
    setRespirationPhaseKey((v) => v + 1);
  }
  const [xray, setXray] = useState(false);
  const [motion, setMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function resetView() {
    setSelected(null);
    setInfoCollapsed(false);
    setXray(false);
    setResetKey((previous) => previous + 1);
  }

  const info = selected ? organelles[selected] : null;

  return (
    <div className="cell-mobile-scene relative h-full min-h-0 w-full overflow-hidden bg-[#081522] text-[#F5F2EA]">
      <style>{`
        .cell-mobile-scene .cell-mobile-info { max-height: min(65dvh, 420px); }
        .cell-mobile-scene .cell-panel-collapsed { max-height: none !important; overflow: visible !important; }
        .cell-mobile-scene .cell-mobile-respiration { max-height: min(88dvh, 680px); scrollbar-width: none; }
        .cell-mobile-scene .cell-mobile-respiration::-webkit-scrollbar { display: none; }
        .cell-mobile-scene .cell-mobile-oxygen { max-height: min(55dvh, 300px); }
        .cell-mobile-scene canvas { touch-action: none; }
        @media (min-width: 768px) and (min-height: 501px) {
          .cell-mobile-scene .cell-collapse-toggle { display: none; }
        }
        @media (max-width: 767px) {
          .cell-mobile-scene .cell-mobile-header { padding-top: max(10px, env(safe-area-inset-top)); }
          .cell-mobile-scene .cell-mobile-header h1 { font-size: 1.3rem; line-height: 1.15; }
          .cell-mobile-scene .cell-mobile-header > div > p:last-child { display: none; }
          .cell-mobile-scene .cell-mobile-header > div > p:nth-of-type(1) { margin-bottom: 5px; }
          .cell-mobile-scene .cell-mobile-controls { top: 110px; right: max(12px, env(safe-area-inset-right)); }
          .cell-mobile-scene .cell-mobile-info { bottom: max(10px, env(safe-area-inset-bottom)); }
          .cell-mobile-scene .cell-mobile-respiration { bottom: max(8px, env(safe-area-inset-bottom)); overflow-y: visible; }
          .cell-mobile-scene .cell-mobile-respiration:not(.cell-panel-collapsed) > div:first-child { padding-top: 10px; }
          .cell-mobile-scene .cell-mobile-respiration:not(.cell-panel-collapsed) > div:nth-child(2) { height: clamp(120px, 20dvh, 170px); }
          .cell-mobile-scene .cell-mobile-respiration:not(.cell-panel-collapsed) > div:nth-child(3) button { padding-top: 5px; padding-bottom: 5px; }
          .cell-mobile-scene .cell-mobile-respiration:not(.cell-panel-collapsed) > div:nth-child(4) { min-height: 0; padding-top: 7px; padding-bottom: 8px; }
          .cell-mobile-scene .cell-mobile-respiration:not(.cell-panel-collapsed) > div:nth-child(5) { padding-top: 6px; padding-bottom: 6px; }
          .cell-mobile-scene .cell-mobile-respiration:not(.cell-panel-collapsed) > div:nth-child(5) span { max-width: 55%; }
          @media (max-height: 700px) and (orientation: portrait) {
            .cell-mobile-scene .cell-mobile-respiration:not(.cell-panel-collapsed) { max-height: calc(100dvh - 75px); overflow-y: auto; }
          }
        }
        @media (orientation: landscape) and (max-height: 500px) {
          /* The parent page may be taller than the visual viewport. Anchor
             the scene itself to the phone's real viewport before docking cards. */
          .cell-mobile-scene {
            height: 100dvh !important;
            min-height: 0 !important;
            max-height: 100dvh !important;
            overflow: hidden !important;
          }
          .cell-mobile-scene .cell-mobile-header { padding-top: max(6px, env(safe-area-inset-top)); padding-left: max(12px, env(safe-area-inset-left)); }
          .cell-mobile-scene .cell-mobile-header > div > p { display: none; }
          .cell-mobile-scene .cell-mobile-header h1 { font-size: 1rem; line-height: 1.1; }
          .cell-mobile-scene .cell-mobile-header a { margin-bottom: 3px; }
          .cell-mobile-scene .cell-mobile-controls { top: 48px; right: max(10px, env(safe-area-inset-right)); gap: 4px; }
          .cell-mobile-scene .cell-mobile-controls button { padding: 5px 10px; }
          /* Landscape phone: bottom-docked panels, never a left sidebar. */
          .cell-mobile-scene .cell-mobile-info,
          .cell-mobile-scene .cell-mobile-oxygen,
          .cell-mobile-scene .cell-mobile-respiration {
            position: absolute;
            top: auto;
            bottom: max(8px, env(safe-area-inset-bottom));
            left: max(10px, env(safe-area-inset-left));
            right: auto;
            margin: 0;
            max-height: min(56dvh, 218px) !important;
            overflow-x: hidden;
            overflow-y: auto;
            border-radius: 14px;
            scrollbar-width: thin;
          }
          .cell-mobile-scene .cell-mobile-info {
            width: min(390px, 62vw);
            padding: 10px 13px;
          }
          .cell-mobile-scene .cell-mobile-info h2 { font-size: 1rem; line-height: 1.15; }
          .cell-mobile-scene .cell-mobile-info p { font-size: 11px; line-height: 1.4; margin-bottom: 5px; }
          .cell-mobile-scene .cell-mobile-info button { padding: 5px 8px; }
          .cell-mobile-scene .cell-mobile-oxygen {
            width: min(480px, 73vw);
            padding: 10px 13px;
          }
          .cell-mobile-scene .cell-mobile-oxygen > div { margin-bottom: 6px; }
          .cell-mobile-scene .cell-mobile-oxygen > div[aria-label="Resans tre steg"] { gap: 3px; }
          .cell-mobile-scene .cell-mobile-oxygen > div[aria-label="Resans tre steg"] > div { padding: 4px; font-size: 10px; }
          .cell-mobile-scene .cell-mobile-oxygen p { font-size: 11px; line-height: 1.4; }
          .cell-mobile-scene .cell-mobile-respiration {
            width: min(690px, 84vw);
            height: min(56dvh, 218px);
            padding: 10px;
            display: grid;
            grid-template-columns: minmax(0, 42%) minmax(0, 58%);
            grid-template-rows: auto auto minmax(0, 1fr) auto;
            gap: 5px 9px;
            align-content: stretch;
            overflow: hidden;
          }
          .cell-mobile-scene .cell-mobile-respiration > div:first-child {
            grid-column: 1; grid-row: 1; padding: 0 3px;
          }
          .cell-mobile-scene .cell-mobile-respiration > div:first-child h3 { font-size: 13px; margin-top: 1px; }
          .cell-mobile-scene .cell-mobile-respiration > div:first-child p { font-size: 9px; }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(2) {
            grid-column: 2; grid-row: 1 / 5;
            height: 100%; min-height: 0; width: 100%; overflow: hidden;
          }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(2) > div { font-size: 9px; }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(3) {
            grid-column: 1; grid-row: 2; padding: 0; gap: 3px;
          }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(3) button {
            padding: 3px 1px; font-size: 9px; line-height: 1.15;
          }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(4) {
            grid-column: 1; grid-row: 3; min-height: 0;
            padding: 0 3px; overflow-y: auto; scrollbar-width: thin;
          }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(4) p {
            font-size: 10px; line-height: 1.3;
          }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(5) {
            grid-column: 1; grid-row: 4;
            display: flex; padding: 3px 0 0; gap: 5px;
            align-items: center;
          }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(5) span { display: none; }
          .cell-mobile-scene .cell-mobile-respiration > div:nth-child(5) button {
            margin-left: auto; padding: 5px 12px;
          }
          .cell-mobile-scene .cell-mobile-respiration.cell-panel-collapsed {
            display: block; height: auto; width: min(300px, 58vw);
            max-height: none !important; overflow: visible;
          }
          .cell-mobile-scene .cell-mobile-info.cell-panel-collapsed,
          .cell-mobile-scene .cell-mobile-oxygen.cell-panel-collapsed {
            height: auto; max-height: none !important; overflow: visible;
          }
          /* Collapsed cards must remain visible, too. */
          .cell-mobile-scene .cell-panel-collapsed {
            bottom: max(8px, env(safe-area-inset-bottom)) !important;
          }
          .cell-mobile-scene .cell-mobile-hint { bottom: 6px; right: 10px; left: auto; max-width: 42vw; }
          .cell-mobile-scene .cell-mobile-hint p { font-size: 10px; }
        }
      `}</style>
      {/* 3D environment */}
      <div className="absolute inset-0">
        <CellWorld
          selected={selected}
          onSelect={(id) => {
            setSelected(id);
            if (id) setInfoCollapsed(false);
          }}
          resetKey={resetKey}
          motion={motion}
          oxygen={oxygen}
          oxygenStageChange={setOxygenStage}
          xray={xray}
          landscape={landscape}
        />
      </div>

      {/* Atmospheric vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,8,16,0.6)_100%)]" />

      {oxygen && oxygenStage === "respiration" && (
        <div className="pointer-events-none absolute inset-0 z-[5] bg-[#020914]/45 transition-opacity duration-700" />
      )}

      {/* Header */}
      <header className="cell-mobile-header pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 px-4 pt-5 sm:px-8 sm:pt-8">
        <div className="pointer-events-auto max-w-[75%]">
          <TimelineBackLink
            compact={false}
            className="mb-4 inline-flex items-center gap-2 text-xs text-[#B6CBD0] transition hover:text-white"
          ></TimelineBackLink>

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

        <button
          type="button"
          onClick={resetView}
          aria-label="Återställ vyn"
          className="pointer-events-auto rounded-full border border-white/15 bg-[#102638]/75 p-3 text-[#D5E5EA] backdrop-blur-md transition hover:bg-white/15"
        >
          <RotateCcw size={18} />
        </button>
      </header>

      {/* Activity controls */}
      <div className="cell-mobile-controls absolute right-4 top-24 z-20 flex flex-col gap-2 sm:right-8 sm:top-28">
        <button
          type="button"
          onClick={() => {
            // Keep the oxygen journey and organelle information mutually exclusive.
            if (!oxygen) {
              setSelected(null);
              setInfoCollapsed(false);
              setOxygenCollapsed(false);
              setRespirationCollapsed(false);
            }
            setOxygen((v) => !v);
            setOxygenStage("entry");
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
      {oxygen && oxygenStage === "respiration" && (
        <section
          className={`${respirationCollapsed ? "cell-panel-collapsed" : ""} cell-mobile-respiration pointer-events-auto absolute inset-x-3 bottom-4 z-20 mx-auto max-w-[620px] overflow-x-hidden overflow-y-auto rounded-2xl border border-rose-300/30 bg-[#0B1726]/95 shadow-[0_0_50px_rgba(225,115,169,0.16)] backdrop-blur-xl sm:bottom-7`}
          aria-label="Cellandning inuti mitokondrien"
        >
          <div className="flex items-center justify-between gap-2 px-4 pt-4">
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
            <>
              <div className="relative h-[185px] w-full sm:h-[230px]">
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
                className="grid grid-cols-4 gap-1.5 px-3 sm:gap-2"
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
              <div className="min-h-[116px] px-4 pb-3 pt-3" aria-live="polite">
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
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
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
                    chooseRespirationPhase(0);
                  }}
                  className="ml-auto shrink-0 rounded-full border border-white/20 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  Avsluta
                </button>
              </div>
            </>
          )}
        </section>
      )}
      {oxygen && oxygenStage !== "respiration" && (
        <section
          className={`${oxygenCollapsed ? "cell-panel-collapsed" : ""} cell-mobile-oxygen pointer-events-auto absolute inset-x-3 bottom-5 z-20 mx-auto max-w-[440px] overflow-hidden rounded-2xl border border-sky-300/30 bg-[#0B1D2D]/95 px-4 py-4 text-sky-100 shadow-[0_0_32px_rgba(56,189,248,0.12)] backdrop-blur-xl sm:bottom-8`}
          aria-label="Följ syremolekylen"
        >
          <div
            className={`flex items-center justify-between gap-3 ${oxygenCollapsed ? "" : "mb-3"}`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              Följ syrets resa
            </span>
            <button
              type="button"
              onClick={() => setOxygenCollapsed((v) => !v)}
              aria-expanded={!oxygenCollapsed}
              aria-label={
                oxygenCollapsed ? "Visa syrets resa" : "Minimera syrets resa"
              }
              className="cell-collapse-toggle flex items-center gap-1 rounded-full border border-sky-300/30 px-3 py-2 text-xs text-sky-100"
            >
              {oxygenCollapsed ? (
                <ChevronUp size={17} />
              ) : (
                <ChevronDown size={17} />
              )}
            </button>
          </div>
          {!oxygenCollapsed && (
            <>
              <div
                className="mb-3 flex items-center gap-2"
                aria-label="Resans tre steg"
              >
                {OXYGEN_PHASES.map((stage, index) => {
                  const active = oxygenStage === stage;
                  const labels = ["Kommer in", "Sprids", "Används"];
                  return (
                    <div
                      key={stage}
                      className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-lg px-2 py-2 text-[10px] sm:text-xs ${active ? "bg-sky-400/15 text-white" : "text-slate-400"}`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-sky-200 bg-sky-300 text-slate-950" : "border-white/20"}`}
                      >
                        {index + 1}
                      </span>
                      <span className="truncate">{labels[index]}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="relative mt-1 flex h-11 w-14 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="absolute h-10 w-12 rounded-full bg-sky-400/25 blur-md" />
                  <span className="relative flex items-center text-3xl font-bold tracking-[-0.28em] text-sky-100 drop-shadow-[0_0_10px_#67e8f9]">
                    ●●
                  </span>
                </div>
                <div className="min-w-0 text-xs leading-relaxed sm:text-[13px]">
                  <p className="mb-1 font-semibold text-white">
                    {oxygenStage === "entry"
                      ? "1. Syret kommer in"
                      : oxygenStage === "diffusion"
                        ? "2. Syret sprids i cellen"
                        : "3. Syret används i mitokondrien"}
                  </p>
                  <p className="text-sky-100/85">
                    {oxygenStage === "entry"
                      ? "Följ den lysande, förstorade syremolekylen (O₂). Den består av två syreatomer och visas större än i verkligheten för att du lätt ska se den."
                      : oxygenStage === "diffusion"
                        ? "Syre sprids genom diffusion. Det betyder att molekyler rör sig slumpmässigt och sprids från områden med mer syre till områden med mindre syre. Den lysande molekylens resa är förenklad."
                        : "I mitokondrien används syre i slutet av cellandningen. Syret tar emot elektroner och vätejoner och bildar vatten. Samtidigt hjälper processen cellen att tillverka ATP – energi som cellen behöver för att fungera."}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-center text-[10px] text-sky-200/65">
                {motion
                  ? "Resan upprepas automatiskt · Pausa när du vill"
                  : "Resan är pausad"}
              </p>
            </>
          )}
        </section>
      )}

      {/* Organelle information */}
      {info && (
        <aside
          className={`${infoCollapsed ? "cell-panel-collapsed" : ""} cell-mobile-info absolute inset-x-3 bottom-4 z-30 overflow-hidden rounded-2xl border border-white/15 bg-[#0B1D2D]/95 p-5 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:bottom-8 sm:left-8 sm:w-[350px] sm:p-6`}
        >
          <div
            className={`flex items-start justify-between gap-3 ${infoCollapsed ? "" : "mb-3"}`}
          >
            <div>
              <p
                className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: info.color }}
              >
                Cellens delar
              </p>

              <h2 className="font-serif text-2xl text-white">{info.title}</h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setInfoCollapsed((v) => !v)}
                aria-expanded={!infoCollapsed}
                aria-label={
                  infoCollapsed ? "Visa information" : "Minimera information"
                }
                className="cell-collapse-toggle rounded-full p-2 text-[#B6CBD0] hover:bg-white/10 hover:text-white"
              >
                {infoCollapsed ? (
                  <ChevronUp size={19} />
                ) : (
                  <ChevronDown size={19} />
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

          {!infoCollapsed && (
            <>
              <p
                className="mb-3 text-sm font-medium"
                style={{ color: info.color }}
              >
                {info.subtitle}
              </p>

              <p className="text-sm leading-7 text-[#C2D3DD]">
                {info.description}
              </p>
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
            </>
          )}
        </aside>
      )}

      {/* Instructions */}
      {!selected && (
        <div className="cell-mobile-hint pointer-events-none absolute inset-x-4 bottom-8 z-10 text-center">
          <p className="text-xs tracking-wide text-[#B6CBD0] sm:text-sm">
            Dra för att rotera · Zooma för att utforska
          </p>
          <p className="mt-2 text-xs text-[#D8C18D]">
            Tryck på en del av cellen för att lära dig mer
          </p>
        </div>
      )}
    </div>
  );
}
