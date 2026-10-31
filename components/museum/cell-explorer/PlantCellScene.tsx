"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import SharedNucleus from "./SharedNucleus";
import PhotosynthesisExplorer from "./PhotosynthesisExplorer";
import {
  EndoplasmicReticulum,
  GolgiApparatus,
} from "./SharedSecretoryOrganelles";
import {
  X,
  Leaf,
  Info,
  Droplets,
  Sprout,
  Menu,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Compass,
} from "lucide-react";
import Link from "next/link";
import {
  exhibitCategories,
  museumExhibits,
} from "@/app/museum/museum-exhibits";

type Part =
  | "wall"
  | "membrane"
  | "vacuole"
  | "chloroplast"
  | "nucleus"
  | "mitochondrion"
  | "cytoplasm"
  | "er"
  | "golgi"
  | "ribosomes";
type Detail = {
  title: string;
  subtitle: string;
  description: string;
  fact: string;
};
const details: Record<Part, Detail> = {
  wall: {
    title: "Cellvägg",
    subtitle: "Cellens stadiga ytterhölje",
    description:
      "Cellväggen består framför allt av cellulosa. Den ger växtcellen stadga och skydd, samtidigt som vatten och lösta ämnen kan passera genom väggen.",
    fact: "Cellväggen är inte samma sak som cellmembranet.",
  },
  membrane: {
    title: "Cellmembran",
    subtitle: "Cellens selektiva gräns",
    description:
      "Det tunna cellmembranet ligger precis innanför cellväggen. Det reglerar vilka ämnen som kommer in i och lämnar cellen.",
    fact: "Även djurceller har cellmembran – men ingen cellvägg.",
  },
  vacuole: {
    title: "Central vakuol",
    subtitle: "Vattenförråd och tryck",
    description:
      "Den stora vakuolen innehåller cellsaft och kan uppta merparten av växtcellens volym. Vattnet bidrar till turgortrycket som håller växten spänstig.",
    fact: "När vakuolen förlorar vatten kan växten sloka.",
  },
  chloroplast: {
    title: "Kloroplast",
    subtitle: "Där fotosyntesen sker",
    description:
      "Kloroplasterna fångar upp ljusenergi. I tylakoidmembranen sker ljusreaktionerna, medan koldioxid binds till organiska ämnen i stromat.",
    fact: "Kloroplaster innehåller eget DNA.",
  },
  nucleus: {
    title: "Cellkärna",
    subtitle: "Förvarar arvsmassan",
    description:
      "Cellkärnan innehåller det mesta av cellens DNA. Den omges av ett dubbelt membran med porer som möjliggör transport.",
    fact: "Växtceller är eukaryota, precis som djurceller.",
  },
  mitochondrion: {
    title: "Mitokondrie",
    subtitle: "Cellandning och ATP",
    description:
      "Mitokondrier omvandlar energi från organiska ämnen till ATP genom cellandning. Växtceller har alltså både kloroplaster och mitokondrier.",
    fact: "Fotosyntes och cellandning är två olika processer.",
  },
  er: {
    title: "Endoplasmatiskt nätverk",
    subtitle: "Cellens membranverkstad",
    description:
      "Det endoplasmatiska nätverket hänger samman med kärnmembranet. På det korniga ER sitter ribosomer som tillverkar proteiner; slätt ER deltar bland annat i lipidbildning.",
    fact: "Växtceller och djurceller har båda endoplasmatiskt nätverk.",
  },
  golgi: {
    title: "Golgiapparaten",
    subtitle: "Sorterar och skickar vidare",
    description:
      "Golgiapparaten bearbetar, sorterar och paketerar proteiner och andra ämnen i membranblåsor. I växtceller hjälper den också till att producera ämnen till cellväggen.",
    fact: "Växtceller kan ha många separata Golgistaplar, ibland kallade diktyosomer.",
  },
  ribosomes: {
    title: "Ribosomer",
    subtitle: "Cellens proteinbyggare",
    description:
      "Ribosomer bygger proteiner utifrån instruktioner i mRNA. En del finns fria i cytosolen, medan andra sitter på det korniga endoplasmatiska nätverket.",
    fact: "Ribosomer saknar eget membran och är mycket mindre än cellkärnan.",
  },
  cytoplasm: {
    title: "Cytoplasma",
    subtitle: "Den levande miljön",
    description:
      "Cytoplasman omfattar cytosolen och cellens strukturer utanför kärnan. I en mogen växtcell trängs mycket av cytoplasman ut mot kanten av den stora vakuolen.",
    fact: "Växtcellens organeller ligger ofta nära cellens ytterkant.",
  },
};

// Inset centres keep the entire chloroplast envelope inside the plasma membrane,
// including the rounded corners and a little rotational movement.
const chloroplasts: [number, number, number, number][] = [
  // A varied ring around the cytoplasm: different tilts and depths, with
  // deliberate clearance for the nucleus/ER (left) and Golgi (bottom).
  [-1.1, 1.42, -0.73, -0.6], // upper left, behind the ER
  [-1.67, -0.96, -0.73, 0.83], // lower left, outside the ER folds
  [-0.84, -1.43, -0.65, -0.28], // lower-left edge
  [1.42, 1.17, -0.53, 0.78], // upper right, diagonally tilted
  [1.66, -0.36, -0.56, -0.87], // right edge, nearly upright
  [1.19, -1.32, -0.55, 0.49], // lower right, away from Golgi
  [0.1, 1.42, -0.68, 0.16], // top centre, gently tilted
  [0.27, -1.43, -0.63, -0.48], // bottom centre, behind Golgi
];

// Every clickable mesh uses the same resolver. Transparent layers are never
// allowed to win over an organelle deeper along the pointer ray.
type PickEvent = ThreeEvent<MouseEvent>;
const tabOrder: Part[] = [
  "wall",
  "membrane",
  "cytoplasm",
  "vacuole",
  "nucleus",
  "er",
  "ribosomes",
  "golgi",
  "mitochondrion",
  "chloroplast",
];
const foregroundParts: Part[] = [
  "chloroplast",
  "nucleus",
  "mitochondrion",
  "er",
  "golgi",
  "ribosomes",
];

function resolvePlantPick(event: PickEvent): Part {
  const hits = event.intersections;
  const tagged = hits.map((hit) => {
    let object: THREE.Object3D | null = hit.object;
    while (object && !object.userData.cellPart) object = object.parent;
    return { hit, part: object?.userData.cellPart as Part | undefined };
  });
  // Choose the nearest solid organelle, even through the transparent wall.
  const solid = tagged.find(
    (item) => item.part && foregroundParts.includes(item.part),
  );
  if (solid?.part) return solid.part;
  if (tagged.some((item) => item.part === "vacuole")) return "vacuole";

  // The cell boundary is only selectable at its silhouette. The interior
  // empty space is cytoplasm, not a huge invisible wall click target.
  const outer = tagged.find((item) => item.part === "wall");
  if (outer) {
    const mesh = outer.hit.object;
    const point = mesh.worldToLocal(outer.hit.point.clone());
    const nx = Math.abs(point.x) / 2.35;
    const ny = Math.abs(point.y) / 1.825;
    if (Math.max(nx, ny) > 0.86) return "wall";
    if (Math.max(nx, ny) > 0.74) return "membrane";
  }
  return "cytoplasm";
}

function Selectable({
  id,
  onSelect,
  children,
}: {
  id: Part;
  onSelect: (id: Part) => void;
  children: React.ReactNode;
}) {
  return (
    <group
      userData={{ cellPart: id }}
      onClick={(event: PickEvent) => {
        event.stopPropagation();
        onSelect(resolvePlantPick(event));
      }}
    >
      {children}
    </group>
  );
}

function RoundedCellShape({
  scale = [1, 1, 1],
  color,
  opacity,
  wireframe = false,
  part,
  onSelect,
  highlighted = false,
}: {
  scale?: [number, number, number];
  color: string;
  opacity: number;
  wireframe?: boolean;
  part?: Part;
  onSelect?: (id: Part) => void;
  highlighted?: boolean;
}) {
  const geometry = useMemo(
    () => new THREE.BoxGeometry(4.7, 3.65, 2.65, 16, 14, 10),
    [],
  );
  useMemo(() => {
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i),
        y = position.getY(i),
        z = position.getZ(i);
      const nx = x / 2.35,
        ny = y / 1.825,
        nz = z / 1.325;
      const soften = 0.135;
      position.setXYZ(
        i,
        x * (1 - soften * Math.pow(Math.abs(ny * nz), 2)),
        y * (1 - soften * Math.pow(Math.abs(nx * nz), 2)),
        z * (1 - soften * Math.pow(Math.abs(nx * ny), 2)),
      );
    }
    geometry.computeVertexNormals();
  }, [geometry]);
  return (
    <mesh
      geometry={geometry}
      scale={scale}
      userData={part ? { cellPart: part } : undefined}
      onClick={
        part
          ? (event: PickEvent) => {
              event.stopPropagation();
              onSelect?.(resolvePlantPick(event));
            }
          : undefined
      }
      raycast={part ? undefined : () => null}
    >
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={highlighted ? 0.2 : 0}
        transparent
        opacity={opacity}
        roughness={0.49}
        metalness={0}
        transmission={0}
        depthWrite={false}
        wireframe={wireframe}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Detailed chloroplast: an identifiable emerald surface and a clean internal cutaway.
// All grana and connecting lamellae remain INSIDE the envelope.
function Chloroplast({
  position,
  angle,
  variant,
  selected,
  onSelect,
  paused,
  xray,
}: {
  position: [number, number, number];
  angle: number;
  variant: number;
  selected: boolean;
  onSelect: (id: Part) => void;
  paused: boolean;
  xray: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(0);
  useFrame((_, delta) => {
    if (!paused) phase.current += Math.min(delta, 0.05);
    if (ref.current) {
      ref.current.rotation.z =
        angle + Math.sin(phase.current * 0.31 + position[0]) * 0.045;
      ref.current.rotation.y =
        0.15 + Math.sin(phase.current * 0.19 + position[1]) * 0.07;
      // Gentle cytoplasmic drifting; small enough to preserve the carefully
      // arranged clearance around the ER, vacuole and cell membrane.
      ref.current.position.x =
        position[0] +
        Math.sin(phase.current * 0.23 + position[1] * 2.1) * 0.025;
      ref.current.position.y =
        position[1] +
        Math.cos(phase.current * 0.27 + position[0] * 1.7) * 0.028;
      ref.current.position.z =
        position[2] + Math.sin(phase.current * 0.17 + position[0]) * 0.018;
    }
  });

  // Five stable anatomical layouts: each chloroplast has its own irregular
  // collection of grana, rather than a repeated row of identical stacks.
  // x/y stay inside the ellipsoidal envelope; z is the stacking direction.
  const granaLayouts = [
    [
      [-0.31, -0.055, 7, 0.087, -0.16],
      [-0.13, 0.075, 12, 0.097, 0.1],
      [0.085, -0.085, 6, 0.08, -0.12],
      [0.285, 0.035, 9, 0.09, 0.17],
    ],
    [
      [-0.3, 0.055, 11, 0.094, 0.13],
      [-0.035, -0.08, 6, 0.087, -0.15],
      [0.275, 0.07, 9, 0.094, 0.07],
    ],
    [
      [-0.34, -0.035, 5, 0.072, -0.08],
      [-0.205, 0.09, 8, 0.077, 0.12],
      [-0.025, -0.075, 11, 0.09, -0.13],
      [0.155, 0.08, 7, 0.078, 0.1],
      [0.325, -0.025, 6, 0.075, -0.09],
    ],
    [
      [-0.295, 0.065, 8, 0.091, 0.16],
      [-0.09, -0.095, 6, 0.08, -0.11],
      [0.12, 0.055, 13, 0.099, 0.09],
      [0.305, -0.065, 7, 0.082, -0.15],
    ],
    [
      [-0.335, 0.025, 6, 0.075, -0.12],
      [-0.175, -0.085, 9, 0.081, 0.1],
      [0.015, 0.09, 5, 0.073, -0.08],
      [0.175, -0.065, 11, 0.087, 0.13],
      [0.335, 0.025, 7, 0.075, -0.1],
    ],
  ] as const;
  const stacks = granaLayouts[variant % granaLayouts.length].map(
    ([x, y, discs, width, tilt]) => ({ x, y, discs, width, tilt }),
  );
  const revealed = selected && xray;

  return (
    <Selectable id="chloroplast" onSelect={onSelect}>
      <group
        ref={ref}
        position={position}
        rotation={[0.15, 0.15, angle]}
        scale={selected ? 1.035 : 1}
      >
        {/* Double-membrane envelope. The surface is recognizable without
            hiding the grana; the cutaway keeps only a whisper of green. */}
        <mesh scale={[0.55, 0.28, 0.285]}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshPhysicalMaterial
            color="#269653"
            transparent
            opacity={revealed ? 0.045 : 0.49}
            depthWrite={false}
            side={THREE.FrontSide}
            roughness={0.42}
            metalness={0.03}
            emissive="#32a765"
            emissiveIntensity={selected ? 0.055 : 0.015}
          />
        </mesh>
        <mesh scale={[0.528, 0.265, 0.267]} raycast={() => null}>
          <sphereGeometry args={[1, 44, 28]} />
          <meshPhysicalMaterial
            color="#83d69a"
            transparent
            opacity={revealed ? 0.022 : 0.095}
            depthWrite={false}
            side={THREE.BackSide}
            roughness={0.62}
          />
        </mesh>

        {/* No equatorial torus: the actual ellipsoidal double envelope
            supplies the chloroplast silhouette from every viewing angle. */}

        {/* A slight stroma tint in surface mode; clear in the cutaway. */}
        <mesh scale={[0.485, 0.215, 0.215]} raycast={() => null}>
          <sphereGeometry args={[1, 36, 24]} />
          <meshStandardMaterial
            color="#67ac69"
            transparent
            opacity={revealed ? 0.01 : 0.055}
            depthWrite={false}
          />
        </mesh>

        {/* Grana: flattened thylakoid discs, stacked along the depth axis. */}
        {stacks.map((stack, i) => (
          <group
            key={i}
            position={[stack.x, stack.y, 0]}
            rotation={[0.08, -0.1, stack.tilt]}
          >
            {Array.from({ length: stack.discs }, (_, j) => {
              const z = (j - (stack.discs - 1) / 2) * 0.018;
              const size = 1 + Math.sin(i * 2.9 + j * 1.7) * 0.045;
              return (
                <group key={j} position={[0, 0, z]}>
                  <mesh
                    scale={[stack.width * size, 0.067 * size, 0.01]}
                    raycast={() => null}
                  >
                    <sphereGeometry args={[1, 20, 12]} />
                    <meshStandardMaterial
                      color={j % 3 === 0 ? "#b8e783" : "#2b713e"}
                      roughness={0.66}
                      emissive="#368749"
                      emissiveIntensity={selected ? 0.13 : 0.045}
                    />
                  </mesh>
                  <mesh
                    scale={[stack.width * 0.84 * size, 0.051 * size, 0.011]}
                    position={[0, 0, 0.005]}
                    raycast={() => null}
                  >
                    <sphereGeometry args={[1, 18, 10]} />
                    <meshStandardMaterial color="#8fc96d" roughness={0.75} />
                  </mesh>
                </group>
              );
            })}
          </group>
        ))}

        {/* Connected stroma lamellae: paired, gently curved strands between
            neighbouring stacks, fully inside the chloroplast envelope. */}
        {stacks.slice(0, -1).flatMap((stack, i) => {
          const next = stacks[i + 1];
          return [-0.035, 0.035].map((z, strand) => {
            const points = [
              new THREE.Vector3(stack.x + 0.07, stack.y + 0.01, z),
              new THREE.Vector3(
                (stack.x + next.x) / 2,
                (stack.y + next.y) / 2 + (strand ? -0.025 : 0.025),
                z + 0.006,
              ),
              new THREE.Vector3(next.x - 0.07, next.y + 0.01, z),
            ];
            const curve = new THREE.CatmullRomCurve3(points);
            return (
              <mesh key={`lamella-${i}-${strand}`} raycast={() => null}>
                <tubeGeometry args={[curve, 24, 0.009, 6, false]} />
                <meshStandardMaterial
                  color={strand ? "#83c66c" : "#a3db78"}
                  roughness={0.7}
                />
              </mesh>
            );
          });
        })}

        {/* Tiny granules in the stroma, not floating outside the envelope. */}
        {Array.from({ length: 10 }, (_, i) => {
          const x =
            -0.38 + (i % 5) * 0.18 + Math.sin(i * 2.17 + variant) * 0.028;
          const y =
            (i % 2 ? -0.155 : 0.145) +
            Math.sin(i * 2.4 + variant * 1.3) * 0.035;
          return (
            <mesh
              key={`granule-${i}`}
              position={[x, y, 0.055]}
              raycast={() => null}
            >
              <sphereGeometry args={[0.008 + (i % 3) * 0.003, 8, 6]} />
              <meshStandardMaterial color="#c3e8a5" roughness={0.8} />
            </mesh>
          );
        })}
      </group>
    </Selectable>
  );
}

function Nucleus({
  onSelect,
  selected,
  paused,
  showInside,
}: {
  onSelect: (id: Part) => void;
  selected: boolean;
  paused: boolean;
  showInside: boolean;
}) {
  return (
    <Selectable id="nucleus" onSelect={onSelect}>
      <SharedNucleus
        position={[-1.52, 0.2, 0.24]}
        scale={0.77}
        selected={selected}
        motion={!paused}
        showInside={showInside}
      />
    </Selectable>
  );
}

// Identical organic membrane geometry and palette to the animal-cell model.
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

function Mitochondrion({
  onSelect,
  selected,
  paused,
}: {
  onSelect: (id: Part) => void;
  selected: boolean;
  paused: boolean;
}) {
  const geometry = useMemo(() => makeMitoGeometry(), []);
  const ref = useRef<THREE.Group>(null);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!ref.current || paused) return;
    time.current += Math.min(delta, 0.05);
    const t = time.current;
    ref.current.position.y = 0.3 + Math.sin(t * 0.48 + 1.53 * 3) * 0.032;
    ref.current.rotation.z = -0.45 + Math.sin(t * 0.27 + 1.53) * 0.055;
    ref.current.rotation.y = 0.2 + Math.sin(t * 0.22 + 0.3) * 0.09;
  });
  return (
    <Selectable id="mitochondrion" onSelect={onSelect}>
      <group
        ref={ref}
        position={[1.53, 0.3, 0.8]}
        rotation={[0.1, 0.2, -0.45]}
        scale={selected ? 1.15 : 1}
      >
        <mesh geometry={geometry}>
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
      </group>
    </Selectable>
  );
}

// A subtly uneven, fluid-filled vacuole. The same geometry is used for its
// lumen and tonoplast, so the membrane always follows the liquid boundary.
function CentralVacuole({
  selected,
  onSelect,
  paused,
  hydration = 100,
}: {
  selected: boolean;
  onSelect: (id: Part) => void;
  paused: boolean;
  hydration?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, 0.05);
    if (!ref.current) return;
    const t = time.current;
    const shrink = 0.56 + (0.44 * hydration) / 100;
    const target = new THREE.Vector3(
      shrink,
      shrink,
      0.73 + (0.27 * hydration) / 100,
    );
    ref.current.scale.lerp(target, Math.min(1, delta * 2.2));
    if (hydration > 95 && !paused)
      ref.current.scale.multiplyScalar(1 + 0.003 * Math.sin(t * 0.38));
  });
  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 64, 48);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i);
      const variation =
        1 +
        0.022 * Math.sin(3.4 * x + 2.1 * y) * Math.cos(3.1 * z - 1.7 * y) +
        0.012 * Math.sin(5.1 * y - 2.2 * z);
      p.setXYZ(i, x * variation, y * variation, z * variation);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group ref={ref} position={[0.48, -0.03, -0.24]}>
      <group
        scale={[1.28, 1.24, 0.8]}
        userData={{ cellPart: "vacuole" }}
        onClick={(event: PickEvent) => {
          event.stopPropagation();
          onSelect(resolvePlantPick(event));
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        {/* Very faint internal liquid gives depth without hiding other organelles. */}
        <mesh geometry={geometry} scale={0.994} raycast={() => null}>
          <meshPhysicalMaterial
            color="#71b8b0"
            transparent
            opacity={selected ? 0.115 : 0.065}
            roughness={0.85}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Tonoplast: a thin, translucent membrane, not a hard glass shell. */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#9eddd1"
            transparent
            opacity={selected ? 0.27 : 0.125}
            emissive="#4b9b90"
            emissiveIntensity={selected ? 0.1 : 0.025}
            roughness={0.57}
            metalness={0}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

// Cytoplasmic streaming is shown as many independent, slow-moving tracers.
// The particles are distributed around a 3D shell of cytoplasm, rather than
// occupying eight synchronized circular lanes. These are NOT scale-sized ribosomes.
function CytoplasmicStreaming({ paused }: { paused: boolean }) {
  const particles = useRef<THREE.Group>(null);
  const time = useRef(0);
  // Deterministic pseudo-random values: stable across React renders/hydration.
  const hash = (n: number) => {
    const v = Math.sin(n * 127.1 + 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const paths = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => ({
        phase: hash(i * 11 + 1) * Math.PI * 2,
        direction: hash(i * 11 + 2) < 0.37 ? -1 : 1,
        speed: 0.025 + hash(i * 11 + 3) * 0.06,
        radiusX: 1.35 + hash(i * 11 + 4) * 0.54,
        radiusY: 1.03 + hash(i * 11 + 5) * 0.43,
        depth: -0.86 + hash(i * 11 + 6) * 1.72,
        wobble: hash(i * 11 + 7) * Math.PI * 2,
        drift: 0.035 + hash(i * 11 + 8) * 0.065,
        size: 0.009 + hash(i * 11 + 9) * 0.014,
        opacity: 0.3 + hash(i * 11 + 10) * 0.28,
      })),
    [],
  );

  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, 0.05);
    if (!particles.current) return;
    const t = time.current;
    particles.current.children.forEach((child, i) => {
      const p = paths[i];
      const a = p.phase + t * p.speed * p.direction;
      // Each tracer has its own distorted loop, phase, depth, and direction.
      // A tiny radial oscillation prevents the rigid 'beads on a wire' look.
      const r =
        1 +
        0.045 * Math.sin(a * 3 + p.wobble) +
        0.025 * Math.cos(t * p.drift + p.wobble);
      const x =
        Math.cos(a) * p.radiusX * r + 0.065 * Math.sin(2 * a + p.wobble);
      const y =
        Math.sin(a) * p.radiusY * r + 0.055 * Math.cos(3 * a + p.wobble);
      const z =
        p.depth +
        0.095 * Math.sin(a * 2 + p.wobble) +
        0.04 * Math.sin(t * p.drift + p.phase);
      child.position.set(x, y, z);
    });
  });

  return (
    <group ref={particles} raycast={() => null}>
      {paths.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.size, 8, 6]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#d5ead0" : "#a6d9c4"}
            transparent
            opacity={p.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function PlantModel({
  selected,
  onSelect,
  paused,
  chloroplastXray,
  nucleusXray,
  hydration = 100,
}: {
  selected: Part | null;
  onSelect: (id: Part) => void;
  paused: boolean;
  chloroplastXray: boolean;
  nucleusXray: boolean;
  hydration?: number;
}) {
  const inner = useRef<THREE.Group>(null);
  const protoplast = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, 0.05);
    if (inner.current)
      inner.current.rotation.y = Math.sin(time.current * 0.12) * 0.025;
    // At low water potential the living protoplast retracts from the rigid wall.
    // The wall stays fixed; organelles move inward with the plasma membrane.
    if (protoplast.current) {
      const stress = Math.pow(1 - hydration / 100, 1.55);
      const target = 1 - stress * 0.19;
      const next = THREE.MathUtils.damp(
        protoplast.current.scale.x,
        target,
        3.5,
        Math.min(delta, 0.05),
      );
      protoplast.current.scale.setScalar(next);
    }
  });
  return (
    <group rotation={[0.12, -0.3, 0.03]}>
      <RoundedCellShape
        color="#80a989"
        opacity={selected === "wall" ? 0.29 : 0.155}
        part="wall"
        onSelect={onSelect}
        highlighted={selected === "wall"}
      />
      <group ref={protoplast}>
        <RoundedCellShape
          scale={[0.978, 0.976, 0.973]}
          color="#9ee9c9"
          opacity={
            hydration < 50 ? 0.27 : selected === "membrane" ? 0.31 : 0.11
          }
          part="membrane"
          onSelect={onSelect}
          highlighted={selected === "membrane"}
        />
        <group ref={inner}>
          <RoundedCellShape
            scale={[0.944, 0.941, 0.936]}
            color="#427f72"
            opacity={0.038}
          />
          <CentralVacuole
            selected={selected === "vacuole"}
            onSelect={onSelect}
            paused={paused}
            hydration={hydration}
          />
          {chloroplasts.map(([x, y, z, angle], i) => (
            <Chloroplast
              key={i}
              position={[x, y, z]}
              angle={angle}
              variant={i}
              selected={selected === "chloroplast"}
              onSelect={onSelect}
              paused={paused}
              xray={chloroplastXray}
            />
          ))}
          <Nucleus
            onSelect={onSelect}
            selected={selected === "nucleus"}
            paused={paused}
            showInside={nucleusXray}
          />
          {/* The EXACT same complete ER component used by the animal cell.
          Its built-in offset is [-.35,.12,-.38]; this parent transform
          places its membrane network around the plant nucleus. */}
          <group
            position={[-1.25, 0.11, 0.51]}
            scale={0.77}
            userData={{ cellPart: "er" }}
          >
            <EndoplasmicReticulum
              selected={selected === "er"}
              onSelect={() => onSelect("er")}
              motion={!paused}
              onRibosomeSelect={() => onSelect("ribosomes")}
            />
          </group>
          {/* Plant Golgi (dictyosome): modestly enlarged and brought toward the
          viewer for a clearer silhouette, while remaining inside the cell. */}
          <group
            position={[-0.33, -0.76, 0.64]}
            rotation={[0.08, -0.14, -0.12]}
            scale={0.67}
            userData={{ cellPart: "golgi" }}
          >
            <GolgiApparatus
              selected={selected === "golgi"}
              onSelect={() => onSelect("golgi")}
              motion={!paused}
            />
          </group>

          {/* Free ribosomes: visible dots and larger invisible picking targets. */}
          {Array.from({ length: 18 }, (_, i) => {
            const angle = i * 2.399963;
            const radius = 1.35 + (i % 4) * 0.16;
            const pos: [number, number, number] = [
              Math.cos(angle) * radius,
              Math.sin(angle) * 1.14,
              0.55 + (i % 3) * 0.12,
            ];
            return (
              <group key={`free-ribosome-${i}`} position={pos}>
                <mesh raycast={() => null}>
                  <sphereGeometry args={[0.016, 8, 6]} />
                  <meshStandardMaterial
                    color={selected === "ribosomes" ? "#e3fff4" : "#b9e2d2"}
                    emissive="#3a8b78"
                    emissiveIntensity={selected === "ribosomes" ? 0.55 : 0.12}
                  />
                </mesh>
                <mesh
                  onClick={(event: PickEvent) => {
                    event.stopPropagation();
                    onSelect("ribosomes");
                  }}
                >
                  <sphereGeometry args={[0.07, 8, 6]} />
                  <meshBasicMaterial visible={false} />
                </mesh>
              </group>
            );
          })}
          <Mitochondrion
            onSelect={onSelect}
            selected={selected === "mitochondrion"}
            paused={paused}
          />
          <CytoplasmicStreaming paused={paused} />
        </group>
      </group>
      {/* The wall is deliberately translucent so the specimen can be explored without a cutaway. */}
    </group>
  );
}

export default function PlantCellScene({
  showWelcome = false,
}: {
  showWelcome?: boolean;
}) {
  const [selected, setSelected] = useState<Part | null>(null);
  const [infoCollapsed, setInfoCollapsed] = useState(false);
  const [turgorCollapsed, setTurgorCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [museumSubmenu, setMuseumSubmenu] = useState(false);
  const [experimentSubmenu, setExperimentSubmenu] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [introReplay, setIntroReplay] = useState(0);
  const sceneRef = useRef<HTMLElement>(null);
  const selectPart = (part: Part | null) => {
    setSelected(part);
    setInfoCollapsed(false);
    if (part) {
      setWelcomeVisible(false);
      sceneRef.current?.focus({ preventScroll: true });
    }
  };
  const handleSceneKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && selected) {
      event.preventDefault();
      setSelected(null);
      sceneRef.current?.focus({ preventScroll: true });
      return;
    }
    if (event.key !== "Tab" || !selected || event.target !== sceneRef.current)
      return;
    event.preventDefault();
    const index = tabOrder.indexOf(selected);
    const direction = event.shiftKey ? -1 : 1;
    setSelected(
      tabOrder[(index + direction + tabOrder.length) % tabOrder.length],
    );
  };
  const [paused, setPaused] = useState(false);
  const [turgorOpen, setTurgorOpen] = useState(false);
  const [hydration, setHydration] = useState(100);
  const [chloroplastXray, setChloroplastXray] = useState(false);
  const [photosynthesisOpen, setPhotosynthesisOpen] = useState(false);
  const [nucleusXray, setNucleusXray] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(showWelcome);
  useEffect(() => {
    if (!showWelcome) return;
    const timeout = window.setTimeout(() => setWelcomeVisible(false), 4400);
    return () => window.clearTimeout(timeout);
  }, [showWelcome]);
  useEffect(() => {
    const timeout = window.setTimeout(() => setIntroVisible(false), 4300);
    return () => window.clearTimeout(timeout);
  }, [introReplay]);
  const dismissWelcome = () => setWelcomeVisible(false);
  return (
    <section
      ref={sceneRef}
      tabIndex={0}
      onKeyDown={handleSceneKeyDown}
      aria-label="Utforska växtcellen. Klicka på en organell och använd Tab eller Skift plus Tab för att bläddra, Escape för att stänga."
      className="relative h-full w-full overflow-hidden bg-[#07131a] text-[#edf3f1]"
    >
      <div
        className="absolute inset-0"
        onPointerDown={dismissWelcome}
        onWheel={dismissWelcome}
        aria-label="Interaktiv tredimensionell växtcell"
      >
        <Canvas
          camera={{ position: [0, 0.25, 8.2], fov: 39 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={["#07131a"]} />
          <ambientLight intensity={1.3} />
          <hemisphereLight args={["#e3f8e6", "#23465a", 1.7]} />
          <directionalLight
            position={[4, 5, 7]}
            intensity={2.5}
            color="#e6f4e2"
          />
          <pointLight
            position={[-5, -2, 4]}
            intensity={24}
            distance={12}
            color="#65a4c7"
          />
          <Stars
            radius={70}
            depth={50}
            count={420}
            factor={1.1}
            saturation={0}
            fade
            speed={0.15}
          />
          <PlantModel
            selected={selected}
            onSelect={selectPart}
            paused={paused || turgorOpen}
            chloroplastXray={chloroplastXray}
            nucleusXray={nucleusXray}
            hydration={turgorOpen ? hydration : 100}
          />
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={5.7}
            maxDistance={12}
            minPolarAngle={0.3}
            maxPolarAngle={Math.PI - 0.3}
            enableDamping
            dampingFactor={0.075}
          />
        </Canvas>
      </div>
      <header
        className={`pointer-events-none absolute left-5 top-7 z-10 max-w-[min(72vw,430px)] sm:left-7 sm:top-16 max-[900px]:landscape:top-2 transition-opacity duration-700 ${introVisible ? "opacity-100" : "max-[900px]:opacity-0"}`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#d6bd83]">
          The Unfolding Universe · Museum
        </p>
        <h1 className="mt-2 font-serif text-[clamp(25px,3vw,38px)] leading-tight">
          Växtcellens värld
        </h1>
        <p className="mt-2 text-xs leading-5 text-[#abc4c8] sm:text-sm">
          Upptäck livet bakom cellväggen.
        </p>
      </header>
      {/* Compact two-level menu, matching the Water Cycle Explorer. */}
      <div className="absolute right-3 top-3 z-50 sm:right-5 sm:top-4 lg:hidden">
        {!menuOpen && (
          <button
            type="button"
            onClick={() => {
              setMenuOpen(true);
              setMuseumSubmenu(false);
              setExperimentSubmenu(false);
            }}
            aria-label="Öppna museimenyn"
            aria-expanded={false}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-teal-200/25 bg-[#102638]/95 text-teal-100 shadow-lg backdrop-blur-xl transition hover:bg-[#19384a]"
          >
            <Menu size={19} />
          </button>
        )}
        {menuOpen && (
          <div className="flex flex-col items-end gap-2">
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
                        setMenuOpen(false);
                        setExperimentSubmenu(false);
                        setSelected(null);
                        setPhotosynthesisOpen(false);
                        setTurgorOpen(true);
                        setTurgorCollapsed(false);
                        setHydration(100);
                      }}
                      className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                    >
                      <Droplets size={16} className="shrink-0 text-amber-200" />
                      <span className="min-w-0">
                        <span className="block">Vattnets kraft</span>
                        <span className="block pt-0.5 text-[10px] font-normal text-slate-300/75">
                          Undersök turgortryck och växtens spänst
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setExperimentSubmenu(false);
                        setSelected(null);
                        setTurgorOpen(false);
                        setPhotosynthesisOpen(true);
                      }}
                      className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                    >
                      <Sparkles size={16} className="shrink-0 text-amber-200" />
                      <span className="min-w-0">
                        <span className="block">Följ solljuset</span>
                        <span className="block pt-0.5 text-[10px] font-normal text-slate-300/75">
                          Utforska fotosyntesen i kloroplasten
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
                      setMenuOpen(false);
                      setSelected(null);
                      setTurgorOpen(false);
                    }}
                    className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                  >
                    <Sparkles size={15} /> Utforska
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setMuseumSubmenu(false);
                      setIntroVisible(true);
                      setIntroReplay((n) => n + 1);
                    }}
                    className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10"
                  >
                    <Info size={15} /> Om utställningen
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExperimentSubmenu(true);
                      setMuseumSubmenu(false);
                    }}
                    className="flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-xs font-semibold text-teal-100 transition hover:bg-white/10 text-[#f2e2b2]"
                  >
                    <Sprout size={15} />{" "}
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
                setMenuOpen(false);
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
      <div className="absolute right-4 top-[62px] z-20 flex flex-col gap-2 sm:right-7">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-full border border-[#547181]/60 bg-[#102735]/90 px-3 py-2 text-xs text-[#dce8e9] backdrop-blur-md hover:bg-[#1d3a48]"
        >
          {paused ? "Fortsätt" : "Pausa"}
        </button>
      </div>
      {turgorOpen && (
        <aside
          className={`plant-turgor-panel absolute bottom-[76px] left-3 right-3 z-30 rounded-2xl border border-emerald-200/30 bg-[#0b2330]/97 p-3 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-7 sm:w-[min(720px,calc(100vw-36px))] sm:p-4 ${turgorCollapsed ? "plant-panel-collapsed" : ""}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] text-[#a9d3b4]">
                Interaktivt experiment
              </p>
              <h2 className="mt-1 font-serif text-2xl">Vattnets kraft</h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setTurgorCollapsed((v) => !v)}
                aria-label={
                  turgorCollapsed
                    ? "Visa experimentet"
                    : "Fäll ned experimentet"
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
              >
                {turgorCollapsed ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              <button
                type="button"
                aria-label="Stäng experiment"
                onClick={() => {
                  setTurgorOpen(false);
                  setHydration(100);
                }}
                className="rounded-full p-1.5 text-[#c7dad9] hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {!turgorCollapsed && (
            <div className="plant-turgor-body">
              <p className="mt-1 text-xs leading-5 text-[#b8cfd0]">
                Ändra vattentillgången och se hur cellen, vävnaden och hela
                växten reagerar.
              </p>
              <div className="plant-turgor-views mt-2 grid grid-cols-2 gap-2">
                <div className="plant-turgor-plant min-w-0 rounded-xl border border-white/10 bg-[#102f34]/65 p-2">
                  <svg
                    viewBox="0 0 300 210"
                    className="mx-auto h-auto max-h-[180px] w-full"
                    role="img"
                    aria-label={
                      hydration >= 65
                        ? "Upprätt, spänstig basilika"
                        : hydration >= 35
                          ? "Basilika som börjar sloka"
                          : "Vissnande basilika med hängande blad"
                    }
                  >
                    <defs>
                      <linearGradient
                        id="turgorPot"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop stopColor="#d39b76" />
                        <stop offset=".55" stopColor="#b77353" />
                        <stop offset="1" stopColor="#764737" />
                      </linearGradient>
                      <linearGradient
                        id="turgorLeaf"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop
                          stopColor={hydration < 30 ? "#b2bb76" : "#9ce0a0"}
                        />
                        <stop
                          offset=".6"
                          stopColor={hydration < 30 ? "#849c5d" : "#48aa67"}
                        />
                        <stop offset="1" stopColor="#26784b" />
                      </linearGradient>
                    </defs>
                    <ellipse
                      cx="150"
                      cy="201"
                      rx="67"
                      ry="6"
                      fill="#010d13"
                      opacity=".5"
                    />
                    <path
                      d="M111 160 L122 198 Q150 207 178 198 L189 160 Z"
                      fill="url(#turgorPot)"
                      stroke="#e3b08b"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M118 168 Q150 178 182 168"
                      fill="none"
                      stroke="#eab18b"
                      opacity=".45"
                      strokeWidth="2"
                    />
                    <rect
                      x="106"
                      y="155"
                      width="88"
                      height="13"
                      rx="5"
                      fill="#c78a68"
                      stroke="#e6b18d"
                      strokeWidth="1.6"
                    />
                    {(() => {
                      const drought = Math.pow((100 - hydration) / 90, 1.45);
                      // Several compact basil shoots grow from the same pot. Each shoot and
                      // its leaf nodes share a Bezier curve, even while wilting.
                      const shoots = [
                        {
                          base: 149,
                          height: 112,
                          lean: -5,
                          width: 3.9,
                          leaves: 4,
                          phase: 0.2,
                        },
                        {
                          base: 139,
                          height: 91,
                          lean: -27,
                          width: 3.2,
                          leaves: 3,
                          phase: 1.3,
                        },
                        {
                          base: 159,
                          height: 97,
                          lean: 25,
                          width: 3.4,
                          leaves: 3,
                          phase: 2.5,
                        },
                        {
                          base: 146,
                          height: 72,
                          lean: -39,
                          width: 2.6,
                          leaves: 2,
                          phase: 3.6,
                        },
                        {
                          base: 156,
                          height: 77,
                          lean: 42,
                          width: 2.7,
                          leaves: 2,
                          phase: 4.4,
                        },
                      ];
                      return (
                        <g>
                          {shoots.map((shoot, si) => {
                            const baseY = 157;
                            const topY =
                              baseY - shoot.height + drought * (14 + si * 3);
                            const droop = drought * (si % 2 ? -24 : 29);
                            const tipX = shoot.base + shoot.lean + droop;
                            const p0 = { x: shoot.base, y: baseY };
                            const p1 = {
                              x: shoot.base + shoot.lean * 0.12,
                              y: baseY - shoot.height * 0.38,
                            };
                            const p2 = {
                              x: shoot.base + shoot.lean * 0.72 + droop * 0.45,
                              y: topY + shoot.height * 0.27,
                            };
                            const p3 = { x: tipX, y: topY };
                            const at = (t: number) => {
                              const u = 1 - t;
                              return {
                                x:
                                  u * u * u * p0.x +
                                  3 * u * u * t * p1.x +
                                  3 * u * t * t * p2.x +
                                  t * t * t * p3.x,
                                y:
                                  u * u * u * p0.y +
                                  3 * u * u * t * p1.y +
                                  3 * u * t * t * p2.y +
                                  t * t * t * p3.y,
                              };
                            };
                            const path = `M${p0.x} ${p0.y} C${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
                            return (
                              <g key={si}>
                                <path
                                  d={path}
                                  stroke="#275f3c"
                                  strokeWidth={shoot.width + 1.2}
                                  fill="none"
                                  strokeLinecap="round"
                                />
                                <path
                                  d={path}
                                  stroke="#80c68a"
                                  strokeWidth={shoot.width * 0.47}
                                  fill="none"
                                  strokeLinecap="round"
                                  opacity=".85"
                                />
                                {Array.from(
                                  { length: shoot.leaves },
                                  (_, level) =>
                                    [-1, 1].map((side, j) => {
                                      const id = si * 20 + level * 2 + j;
                                      const t =
                                        0.26 +
                                        level *
                                          (0.61 /
                                            Math.max(1, shoot.leaves - 1)) +
                                        (j ? 0.014 : -0.014);
                                      const node = at(Math.min(0.96, t));
                                      const variation = Math.sin(
                                        id * 2.73 + shoot.phase,
                                      );
                                      const petiole =
                                        6.5 + (2.5 * (variation + 1)) / 2;
                                      const leafLength =
                                        23 +
                                        5 * Math.sin(id * 1.73 + 1.2) +
                                        (si === 0 ? 3 : 0);
                                      const leafWidth =
                                        11 + 2.5 * Math.cos(id * 1.33);
                                      const stemEndX = node.x + side * petiole;
                                      const stemEndY =
                                        node.y -
                                        3 +
                                        drought * (5 + level * 1.2);
                                      // The leaf's local +x axis points from petiole to pointed tip.
                                      const rotation =
                                        side === 1
                                          ? -13 +
                                            variation * 14 +
                                            drought * (42 + level * 4)
                                          : 193 -
                                            variation * 13 -
                                            drought * (42 + level * 4);
                                      return (
                                        <g key={id}>
                                          <path
                                            d={`M${node.x} ${node.y} Q${node.x + side * 3} ${node.y - 5 + drought * 4} ${stemEndX} ${stemEndY}`}
                                            stroke="#77bd7d"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            fill="none"
                                          />
                                          <g
                                            transform={`translate(${stemEndX} ${stemEndY}) rotate(${rotation})`}
                                          >
                                            <path
                                              d={`M0 0 C${leafLength * 0.2} ${-leafWidth * 0.95} ${leafLength * 0.57} ${-leafWidth * 1.22} ${leafLength} 0 C${leafLength * 0.7} ${leafWidth * 0.95} ${leafLength * 0.28} ${leafWidth * 1.03} 0 0Z`}
                                              fill="url(#turgorLeaf)"
                                              stroke="#367d4c"
                                              strokeWidth="1"
                                            />
                                            <path
                                              d={`M1 0 Q${leafLength * 0.49} -1 ${leafLength - 2} 0`}
                                              stroke="#bde8a8"
                                              strokeWidth=".85"
                                              opacity=".72"
                                              fill="none"
                                            />
                                            <path
                                              d={`M${leafLength * 0.38} -.5 l${leafLength * 0.12} ${-leafWidth * 0.48} M${leafLength * 0.56} -.5 l${leafLength * 0.1} ${leafWidth * 0.42}`}
                                              stroke="#c1e8ad"
                                              strokeWidth=".65"
                                              opacity=".52"
                                              fill="none"
                                            />
                                          </g>
                                        </g>
                                      );
                                    }),
                                )}
                                {[-1, 1].map((side, j) => (
                                  <g
                                    key={`tip-${j}`}
                                    transform={`translate(${p3.x} ${p3.y}) rotate(${side === 1 ? -32 + drought * 44 : 212 - drought * 44})`}
                                  >
                                    <path
                                      d="M0 0 C5 -9 12 -10 17 0 C12 8 5 8 0 0Z"
                                      fill="url(#turgorLeaf)"
                                      stroke="#367d4c"
                                      strokeWidth=".8"
                                    />
                                  </g>
                                ))}
                              </g>
                            );
                          })}
                        </g>
                      );
                    })()}
                    <text
                      x="150"
                      y="14"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#d1ece2"
                    >
                      {hydration >= 65
                        ? "Spänstig basilika"
                        : hydration >= 35
                          ? "Börjar sloka"
                          : "Vissnande basilika"}
                    </text>
                  </svg>
                </div>
                <div className="plant-turgor-tissue min-w-0 rounded-xl border border-white/10 bg-[#102f34]/65 p-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#d9efe4]">
                      Växtvävnad · cellerna tillsammans
                    </span>
                    <span className="text-[10px] text-[#9ec6b3]">
                      {hydration > 65
                        ? "Stadig"
                        : hydration > 35
                          ? "Tappar spänst"
                          : "Böjer sig"}
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 310 136"
                    className="h-auto max-h-[145px] w-full"
                    role="img"
                    aria-label="Sammanhängande växtvävnad böjer sig när cellerna förlorar turgortryck"
                  >
                    <defs>
                      <linearGradient
                        id="tissueCellGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop stopColor="#a3d5a1" />
                        <stop offset="1" stopColor="#5c9873" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const drought = Math.pow((100 - hydration) / 90, 1.6);
                      const yAt = (x: number) =>
                        27 +
                        drought *
                          (8 * Math.sin(x / 45) + 68 * Math.pow(x / 310, 2));
                      const cells = Array.from({ length: 12 }, (_, i) => {
                        const x = 8 + i * 24.5;
                        const center = x + 12;
                        const y = yAt(center);
                        const angle =
                          (Math.atan2(yAt(center + 4) - yAt(center - 4), 8) *
                            180) /
                          Math.PI;
                        const retract = Math.max(0, (drought - 0.42) / 0.58);
                        return (
                          <g
                            key={i}
                            transform={`translate(${x} ${y}) rotate(${angle} 12 34)`}
                          >
                            <rect
                              x="0"
                              y="0"
                              width="24"
                              height="67"
                              rx="5"
                              fill="#467957"
                              stroke="#a5c68c"
                              strokeWidth="2"
                            />
                            <rect
                              x={2 + retract * 4}
                              y={2 + retract * 6}
                              width={20 - retract * 8}
                              height={63 - retract * 12}
                              rx="4"
                              fill="#a0d2ae"
                              fillOpacity=".75"
                              stroke="#c4e6bb"
                              strokeWidth="1"
                            />
                            <rect
                              x={4 + retract * 5}
                              y={6 + retract * 8}
                              width={16 - retract * 10}
                              height={52 - retract * 16}
                              rx="5"
                              fill="url(#tissueCellGradient)"
                              opacity=".95"
                            />
                            <circle
                              cx="8"
                              cy={56 - retract * 5}
                              r="2.5"
                              fill="#c3a8d7"
                            />
                          </g>
                        );
                      });
                      return (
                        <g>
                          <path
                            d={`M8 ${yAt(20) - 4} Q155 ${yAt(155) - 8} 302 ${yAt(298) - 4}`}
                            fill="none"
                            stroke="#b6d2a1"
                            strokeOpacity=".35"
                            strokeWidth="4"
                          />
                          {cells}
                        </g>
                      );
                    })()}
                    <text
                      x="155"
                      y="130"
                      fontSize="9.5"
                      textAnchor="middle"
                      fill="#a8c9bf"
                    >
                      Cellväggarna sitter ihop · vävnaden böjs som en helhet
                    </text>
                  </svg>
                  <p className="mt-1 text-[10px] leading-4 text-[#9ebbb7]">
                    När turgortrycket sjunker förlorar den sammanhängande
                    vävnaden sin stadga och böjer sig under sin egen tyngd.
                    Cellväggarna sitter fortfarande ihop.
                  </p>
                </div>
              </div>
              <div className="plant-turgor-controls">
                <div className="mt-2 flex items-center justify-between text-xs">
                  <label
                    htmlFor="plant-turgor-water"
                    className="font-semibold text-[#d9efe4]"
                  >
                    Vatten i vakuolen (modell)
                  </label>
                  <span className="tabular-nums text-[#aee3c7]">
                    {hydration}%
                  </span>
                </div>
                <input
                  id="plant-turgor-water"
                  type="range"
                  min="10"
                  max="100"
                  value={hydration}
                  onChange={(event) => setHydration(Number(event.target.value))}
                  className="mt-3 w-full accent-emerald-400"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHydration(12)}
                    className="flex-1 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                  >
                    Torka
                  </button>
                  <button
                    type="button"
                    onClick={() => setHydration(100)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-700/30 px-3 py-2 text-xs hover:bg-emerald-700/50"
                  >
                    <Droplets size={14} /> Vattna växten
                  </button>
                </div>
                <p className="mt-3 text-xs leading-5 text-[#b8cfd0]">
                  {hydration >= 65
                    ? "Vakuolen är fylld med cellsaft. Turgortrycket pressar cellinnehållet mot cellväggen och ger växten stadga."
                    : hydration >= 35
                      ? "När vatten lämnar cellen minskar vakuolens volym och turgortrycket sjunker. Blad och mjuka stjälkar börjar hänga."
                      : "Vid kraftig vattenförlust förlorar cellen sin spänst. I extrema fall kan membranet lossna från cellväggen (plasmolys)."}
                </p>
                <p className="mt-2 text-[10px] leading-4 text-[#89aaa8]">
                  Förenklad undervisningsmodell, inte en exakt mätning av
                  vattenhalt. En vissnad växt återhämtar sig bara om vävnaden
                  inte skadats permanent.
                </p>
              </div>
            </div>
          )}
        </aside>
      )}
      {selected && !turgorOpen && (
        <aside
          className={`plant-info-panel absolute bottom-[76px] left-3 right-3 z-20 rounded-2xl border border-[#729e96]/40 bg-[#0b2330]/95 p-4 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-7 sm:w-[380px] sm:p-5 ${infoCollapsed ? "plant-panel-collapsed" : ""}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] text-[#a9d3b4]">
                Växtcell · Organell
              </p>
              <h2 className="mt-1 font-serif text-2xl">
                {details[selected].title}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setInfoCollapsed((v) => !v)}
                aria-label={
                  infoCollapsed ? "Visa information" : "Fäll ned information"
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
              >
                {infoCollapsed ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full p-1.5 text-[#c7dad9] hover:bg-white/10"
                aria-label="Stäng information"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {!infoCollapsed && (
            <div className="plant-info-body">
              <p className="mt-2 hidden text-[10px] text-[#9bbdb1] md:block">
                Tab: nästa del · Skift+Tab: föregående · Esc: stäng
              </p>
              <p className="mt-1 text-xs font-medium text-[#b5d8be]">
                {details[selected].subtitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#d1dfe0]">
                {details[selected].description}
              </p>
              {selected === "nucleus" && (
                <button
                  type="button"
                  onClick={() => setNucleusXray((v) => !v)}
                  aria-pressed={nucleusXray}
                  className="mt-4 inline-flex items-center rounded-full border border-violet-300/35 bg-violet-800/35 px-4 py-2 text-xs font-semibold text-violet-100 transition hover:bg-violet-700/45"
                >
                  {nucleusXray
                    ? "Visa ytan"
                    : "Visa insidan · Kromatin & nukleol"}
                </button>
              )}
              {selected === "chloroplast" && (
                <button
                  type="button"
                  onClick={() => setChloroplastXray((value) => !value)}
                  aria-pressed={chloroplastXray}
                  className="mt-4 inline-flex items-center rounded-full border border-emerald-300/35 bg-emerald-800/35 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-700/45"
                >
                  {chloroplastXray
                    ? "Visa ytan"
                    : "Visa insidan · Tylakoider & grana"}
                </button>
              )}
              {selected === "chloroplast" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setMenuOpen(false);
                    setTurgorOpen(false);
                    setPhotosynthesisOpen(true);
                  }}
                  className="mt-3 flex items-center gap-2 rounded-full border border-amber-200/40 bg-amber-300/15 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/25"
                >
                  <Sparkles size={16} /> Följ solljuset · Starta resan
                </button>
              )}
              {selected === "vacuole" && (
                <button
                  type="button"
                  onClick={() => {
                    setTurgorOpen(true);
                    setTurgorCollapsed(false);
                    setHydration(100);
                    setSelected(null);
                  }}
                  className="mt-4 flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-800/35 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-700/45"
                >
                  <Sprout size={16} /> Utforska turgortrycket
                </button>
              )}
              <p className="mt-3 flex items-start gap-2 border-t border-white/10 pt-3 text-xs leading-5 text-[#b8cfd0]">
                <Info size={15} className="mt-0.5 shrink-0 text-[#a9d3b4]" />
                {details[selected].fact}
              </p>
            </div>
          )}
        </aside>
      )}
      {welcomeVisible && !selected && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5"
          aria-live="polite"
        >
          <div className="plant-welcome max-w-[310px] rounded-2xl border border-[#b7d6c2]/25 bg-[#0b2530]/80 px-5 py-4 text-center shadow-[0_12px_55px_rgba(0,0,0,.24)] backdrop-blur-md max-[900px]:landscape:max-w-[245px] max-[900px]:landscape:px-3 max-[900px]:landscape:py-2">
            <p className="text-[12px] font-medium text-[#e2eee9] max-[900px]:landscape:text-[11px]">
              Dra för att rotera · Zooma för att utforska
            </p>
            <p className="mt-1 text-[11px] text-[#d8c08a] max-[900px]:landscape:text-[10px]">
              Tryck på en del av cellen för att lära dig mer
            </p>
          </div>
        </div>
      )}
      {photosynthesisOpen && (
        <PhotosynthesisExplorer onClose={() => setPhotosynthesisOpen(false)} />
      )}
      <style jsx>{`
        .plant-info-panel,
        .plant-turgor-panel {
          max-height: calc(100dvh - 90px);
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .plant-panel-collapsed {
          max-height: none;
          overflow: hidden;
        }
        .plant-turgor-panel {
          max-height: calc(100dvh - 90px);
        }
        @media (orientation: landscape) and (max-height: 520px) {
          .plant-turgor-panel .plant-turgor-body {
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
            column-gap: 12px;
            align-items: center;
          }
          .plant-turgor-panel .plant-turgor-views {
            grid-column: 1;
            grid-row: 1;
          }
          .plant-turgor-panel .plant-turgor-controls {
            grid-column: 2;
            grid-row: 1;
          }
          .plant-turgor-panel .plant-turgor-controls > p {
            font-size: 10px;
            line-height: 1.35;
            margin-top: 6px;
          }
          .plant-turgor-panel .plant-turgor-controls > p:last-child {
            display: none;
          }
          .plant-turgor-panel .plant-turgor-controls > div {
            margin-top: 6px;
          }
          .plant-turgor-panel .plant-turgor-controls button {
            padding: 5px 7px;
            font-size: 10px;
          }

          .plant-info-panel,
          .plant-turgor-panel {
            top: 7px;
            bottom: auto;
            max-height: calc(100dvh - 65px);
          }
          .plant-info-panel {
            left: 12px;
            right: auto;
            width: min(390px, 56vw);
            padding: 12px 15px;
          }
          .plant-turgor-panel {
            left: 12px;
            right: auto;
            width: min(740px, calc(100vw - 85px));
            padding: 9px 12px;
          }
          .plant-turgor-panel .plant-turgor-views {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }
          .plant-turgor-panel .plant-turgor-plant svg {
            max-height: 112px;
          }
          .plant-turgor-panel .plant-turgor-tissue svg {
            max-height: 95px;
          }
          .plant-turgor-panel .plant-turgor-tissue p {
            display: none;
          }
          .plant-turgor-panel .plant-turgor-body > p:last-child {
            display: none;
          }
          .plant-turgor-panel .plant-turgor-body > p:first-child {
            display: none;
          }
          .plant-info-panel h2,
          .plant-turgor-panel h2 {
            font-size: 18px;
            line-height: 1.2;
          }
          .plant-info-panel .plant-info-body p {
            line-height: 1.45;
          }
          .plant-info-panel .plant-info-body p:last-child {
            margin-top: 8px;
            padding-top: 8px;
          }
        }
        @media (orientation: portrait) and (max-width: 600px) {
          .plant-turgor-panel .plant-turgor-views {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }
          .plant-turgor-panel .plant-turgor-plant svg {
            max-height: 160px;
          }
          .plant-turgor-panel .plant-turgor-tissue svg {
            max-height: 115px;
          }
          .plant-turgor-panel .plant-turgor-tissue p {
            display: none;
          }
          .plant-turgor-panel .plant-turgor-tissue span {
            font-size: 9px;
          }
          .plant-turgor-panel .plant-turgor-views > div {
            padding: 5px;
          }
        }

        @keyframes plantWelcome {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          12% {
            opacity: 1;
            transform: translateY(0);
          }
          75% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-5px);
          }
        }
        .plant-welcome {
          animation: plantWelcome 4.4s ease-in-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .plant-welcome {
            animation: none;
          }
        }
      `}</style>
      <div className="pointer-events-none absolute bottom-[95px] left-4 hidden items-center gap-2 text-xs text-[#9bbdb1] lg:flex">
        <Leaf size={14} /> Växtcell · 002
      </div>
    </section>
  );
}
