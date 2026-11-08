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
  ThermometerSun,
  Droplets,
  Waves,
  Microscope,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";

type Part =
  | "slayer"
  | "membrane"
  | "nucleoid"
  | "ribosomes"
  | "archaella"
  | "pili";
const PART_ORDER: Part[] = [
  "slayer",
  "membrane",
  "nucleoid",
  "ribosomes",
  "archaella",
  "pili",
];
type Props = { onBack?: () => void };
const DATA: Record<
  Part,
  { name: string; subtitle: string; description: string; color: string }
> = {
  slayer: {
    name: "S-lager",
    subtitle: "Ett skyddande proteinskal",
    color: "#d7a6e8",
    description:
      "Sulfolobus har ett ytligt, regelbundet organiserat lager av proteiner (S-lager) som hjälper cellen att behålla sin form och skyddar dess yta. Det är inte en cellvägg av peptidoglykan.",
  },
  membrane: {
    name: "Cellmembran",
    subtitle: "Anpassat till värme och syra",
    color: "#edb77f",
    description:
      "Arkéers membran innehåller särskilda eterbundna lipider. Hos Sulfolobus kan många lipider bilda ett sammanhängande membran som bidrar till stabilitet i heta, sura miljöer.",
  },
  nucleoid: {
    name: "Nukleoid",
    subtitle: "Arvsmassa utan cellkärna",
    color: "#c9b4f5",
    description:
      "Sulfolobus är en arké och saknar membranomsluten cellkärna. Dess DNA finns i cellen och är organiserat med proteiner. Arkéer är en egen domän, skild från bakterier.",
  },
  ribosomes: {
    name: "Ribosomer",
    subtitle: "Cellens proteinfabriker",
    color: "#f3d995",
    description:
      "Arkéer har 70S-ribosomer. Deras proteinsyntes har samtidigt flera molekylära likheter med eukaryoters. Prickarna är förstorade för att synas.",
  },
  archaella: {
    name: "Arkaeller",
    subtitle: "Roterande rörelseorgan",
    color: "#a5e7d9",
    description:
      "Arkaeller kan hjälpa vissa Sulfolobus-celler att röra sig. De liknar bakteriella flageller till funktionen, men byggs av andra proteiner och har ett annat ursprung.",
  },
  pili: {
    name: "Pili",
    subtitle: "Kontakt med omgivningen",
    color: "#b8d5f3",
    description:
      "Sulfolobus kan ha tunna ytutskott som deltar i vidhäftning och kontakter mellan celler. Antal och utseende varierar med art och förhållanden.",
  },
};

function irregularShellGeometry(radius: number) {
  const geometry = new THREE.IcosahedronGeometry(radius, 5);
  const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
  const p = new THREE.Vector3();
  for (let i = 0; i < attr.count; i++) {
    p.fromBufferAttribute(attr, i);
    const x = p.x / radius,
      y = p.y / radius,
      z = p.z / radius;
    const waviness =
      1 +
      0.072 * Math.sin(4.1 * x + 2.8 * y) * Math.cos(3.8 * z - 1.9 * x) +
      0.038 * Math.sin(8 * y + 4 * z) * Math.cos(5 * x - 2 * z);
    p.multiplyScalar(waviness);
    attr.setXYZ(i, p.x, p.y, p.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}
function ArchaeaShell({
  radius,
  color,
  opacity,
  selected,
  onClick,
}: {
  radius: number;
  color: string;
  opacity: number;
  selected: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const geometry = useMemo(() => irregularShellGeometry(radius), [radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      geometry={geometry}
      onClick={onClick}
      renderOrder={radius > 1 ? 2 : 1}
    >
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={selected ? Math.min(0.68, opacity + 0.28) : opacity}
        roughness={0.78}
        metalness={0.02}
        clearcoat={0.12}
        clearcoatRoughness={0.6}
        depthWrite={false}
        side={THREE.DoubleSide}
        emissive={color}
        emissiveIntensity={selected ? 0.52 : 0.045}
      />
    </mesh>
  );
}
function ArchaeaDNA({
  select,
  selected,
  paused,
}: {
  select: (p: Part) => void;
  selected: boolean;
  paused: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame((_, dt) => {
    if (paused || !group.current) return;
    time.current += Math.min(dt, 0.05);
    group.current.rotation.y = 0.08 * Math.sin(time.current * 0.35);
    group.current.rotation.x = 0.05 * Math.cos(time.current * 0.45);
  });
  const strands = useMemo(
    () =>
      Array.from({ length: 5 }, (_, k) => {
        const pts = Array.from({ length: 190 }, (_, i) => {
          const t = i / 189,
            angle = t * Math.PI * (8 + k * 0.9) + k * 2.3;
          const envelope = Math.pow(Math.sin(Math.PI * t), 0.5);
          return new THREE.Vector3(
            (t - 0.5) * 1.35 + 0.11 * Math.sin(angle * 0.5) * envelope,
            envelope * (0.26 * Math.sin(angle) + 0.09 * Math.sin(angle * 2.2)),
            envelope *
              (0.27 * Math.cos(angle * 0.83) + 0.08 * Math.sin(angle * 1.5)),
          );
        });
        return new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(pts),
          210,
          0.009,
          5,
          false,
        );
      }),
    [],
  );
  useEffect(() => () => strands.forEach((g) => g.dispose()), [strands]);
  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        select("nucleoid");
      }}
    >
      {strands.map((geometry, i) => (
        <mesh key={i} geometry={geometry} userData={{ cellPart: "nucleoid" }}>
          <meshStandardMaterial
            color={selected ? "#ffe5ff" : i % 2 ? "#aa9bd9" : "#d6b8f2"}
            emissive={selected ? "#b778e0" : "#66528d"}
            emissiveIntensity={selected ? 1.2 : 0.22}
          />
        </mesh>
      ))}
    </group>
  );
}
function ArchaeaRibosomes({
  select,
  selected,
}: {
  select: (p: Part) => void;
  selected: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const points = useMemo(() => {
    const result: THREE.Vector3[] = [];
    for (let i = 0; i < 220; i++) {
      const u = (i * 0.61803398875) % 1,
        v = (i * 0.7548776662) % 1,
        w = (i * 0.569840291) % 1;
      const r = Math.cbrt(0.15 + 0.8 * u) * 0.82,
        theta = Math.acos(2 * v - 1),
        phi = 2 * Math.PI * w;
      const p = new THREE.Vector3(
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta),
      );
      if (p.length() > 0.4 || Math.abs(p.x) > 0.65) result.push(p);
    }
    return result;
  }, []);
  useEffect(() => {
    if (!mesh.current) return;
    const obj = new THREE.Object3D();
    points.forEach((p, i) => {
      obj.position.copy(p);
      obj.scale.setScalar(0.65 + (i % 5) * 0.12);
      obj.updateMatrix();
      mesh.current?.setMatrixAt(i, obj.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [points]);
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, points.length]}
      onClick={(e) => {
        e.stopPropagation();
        select("ribosomes");
      }}
      userData={{ cellPart: "ribosomes" }}
    >
      <sphereGeometry args={[0.023, 6, 5]} />
      <meshStandardMaterial
        color={selected ? "#fffbd1" : "#f3d995"}
        emissive={selected ? "#ffe78a" : "#84683e"}
        emissiveIntensity={selected ? 1.7 : 0.12}
      />
    </instancedMesh>
  );
}
function ArchaeaFibers({
  select,
  selected,
  paused,
}: {
  select: (p: Part) => void;
  selected: boolean;
  paused: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const hitRef = useRef<THREE.InstancedMesh>(null);
  const time = useRef(0);
  const acc = useRef(0);

  // A shared, gently curved tapered filament. Instancing keeps the hundreds
  // of pili inexpensive, including on mobile devices.
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.018, 0.24, 0.006),
      new THREE.Vector3(0.045, 0.57, -0.012),
      new THREE.Vector3(0.085, 0.84, 0.018),
      new THREE.Vector3(0.11, 1, 0.025),
    ]);
    const geometry = new THREE.TubeGeometry(curve, 9, 0.006, 4, false);
    // Narrow the tip; retain a soft root without sharp needle-like spikes.
    const positions = geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const center = new THREE.Vector3();
    const p = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      p.fromBufferAttribute(positions, i);
      const y = THREE.MathUtils.clamp(p.y, 0, 1);
      center.copy(curve.getPointAt(y));
      const taper = 1 - 0.76 * y * y;
      p.sub(center).multiplyScalar(taper).add(center);
      positions.setXYZ(i, p.x, p.y, p.z);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => geom.dispose(), [geom]);
  // Separate, thicker raycast-only geometry: easier to tap without changing
  // the delicate appearance of the actual pili.
  const hitGeom = useMemo(() => {
    const g = geom.clone();
    g.scale(5, 1, 5);
    return g;
  }, [geom]);
  useEffect(() => () => hitGeom.dispose(), [hitGeom]);

  const hairs = useMemo(() => {
    const count = 340;
    return Array.from({ length: count }, (_, i) => {
      // Golden-angle distribution without a conspicuous spiral band.
      const z = 1 - 2 * ((i + 0.5) / count);
      const phi = i * 2.3999632297;
      const r = Math.sqrt(1 - z * z);
      const dir = new THREE.Vector3(r * Math.cos(phi), r * Math.sin(phi), z);
      const jitter = Math.sin(i * 78.233) * 43758.5453;
      const noise = jitter - Math.floor(jitter);
      const surface =
        1.035 + 0.035 * Math.sin(dir.x * 4 + dir.y * 3) * Math.cos(dir.z * 4);
      return {
        dir,
        pos: dir.clone().multiplyScalar(surface),
        length: 0.105 + noise * 0.13,
        phase: i * 1.71,
        twist: i * 2.17,
      };
    });
  }, []);

  const scratch = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const sway = useMemo(() => new THREE.Vector3(), []);
  const update = useCallback(
    (t: number) => {
      if (!ref.current) return;
      hairs.forEach((h, i) => {
        // Subtle, asynchronous flexing, not flagellar swimming.
        sway.set(
          0.065 * Math.sin(t * 0.85 + h.phase),
          0.052 * Math.cos(t * 0.7 + h.phase * 0.9),
          0.045 * Math.sin(t * 0.65 + h.phase * 1.3),
        );
        direction.copy(h.dir).add(sway).normalize();
        scratch.position.copy(h.pos);
        scratch.quaternion.setFromUnitVectors(up, direction);
        scratch.rotateY(h.twist);
        scratch.scale.set(1, h.length, 1);
        scratch.updateMatrix();
        ref.current!.setMatrixAt(i, scratch.matrix);
        hitRef.current?.setMatrixAt(i, scratch.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
      if (hitRef.current) hitRef.current.instanceMatrix.needsUpdate = true;
    },
    [hairs, scratch, up, direction, sway],
  );
  useEffect(() => update(0), [update]);
  useFrame((_, dt) => {
    if (paused) return;
    time.current += Math.min(dt, 0.05);
    acc.current += dt;
    if (acc.current >= 1 / 24) {
      acc.current = 0;
      update(time.current);
    }
  });
  return (
    <group>
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, hairs.length]}
        geometry={geom}
        frustumCulled={false}
        onClick={(e) => {
          e.stopPropagation();
          select("pili");
        }}
        userData={{ cellPart: "pili" }}
      >
        <meshStandardMaterial
          color={selected ? "#e9f7ff" : "#b3cedd"}
          emissive={selected ? "#93cfff" : "#47778d"}
          emissiveIntensity={selected ? 0.8 : 0.075}
          transparent
          opacity={selected ? 0.96 : 0.72}
          depthWrite={false}
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </instancedMesh>
      <instancedMesh
        ref={hitRef}
        args={[undefined, undefined, hairs.length]}
        geometry={hitGeom}
        frustumCulled={false}
        onClick={(e) => {
          e.stopPropagation();
          select("pili");
        }}
        userData={{ cellPart: "pili" }}
      >
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          colorWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
}

function Archaella({
  select,
  selected,
  paused,
}: {
  select: (p: Part) => void;
  selected: boolean;
  paused: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    if (paused || !group.current) return;
    t.current += Math.min(dt, 0.05);
    group.current.rotation.y = 0.1 * Math.sin(t.current * 0.8);
    group.current.rotation.z = 0.055 * Math.sin(t.current * 0.55);
  });
  const tubes = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        const phi = i * Math.PI * 0.5 + 0.3;
        const dir = new THREE.Vector3(
          Math.cos(phi),
          Math.sin(phi),
          0.35,
        ).normalize();
        const base = dir.clone().multiplyScalar(1.02);
        const axis = dir
          .clone()
          .add(new THREE.Vector3(0.25, -0.1, 0.25))
          .normalize();
        const side = new THREE.Vector3()
          .crossVectors(axis, new THREE.Vector3(0, 0, 1))
          .normalize();
        const normal = new THREE.Vector3().crossVectors(axis, side).normalize();
        const points = Array.from({ length: 100 }, (_, j) => {
          const u = j / 99,
            ang = u * Math.PI * 7 + i * 1.7;
          return base
            .clone()
            .addScaledVector(axis, u * 1.35)
            .addScaledVector(side, 0.075 * u * Math.cos(ang))
            .addScaledVector(normal, 0.075 * u * Math.sin(ang));
        });
        return new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(points),
          110,
          0.008,
          5,
          false,
        );
      }),
    [],
  );
  useEffect(() => () => tubes.forEach((g) => g.dispose()), [tubes]);
  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        select("archaella");
      }}
    >
      {tubes.map((geometry, i) => (
        <mesh key={i} geometry={geometry} userData={{ cellPart: "archaella" }}>
          <meshStandardMaterial
            color={selected ? "#e5fff8" : "#a5e7d9"}
            emissive="#6aa99f"
            emissiveIntensity={selected ? 1 : 0.18}
          />
        </mesh>
      ))}
    </group>
  );
}
function Archaeon({
  xray,
  paused,
  select,
  selected,
}: {
  xray: boolean;
  paused: boolean;
  select: (p: Part) => void;
  selected: Part | null;
}) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    if (paused || !group.current) return;
    t.current += Math.min(dt, 0.05);
    group.current.position.y = 0.06 + 0.035 * Math.sin(t.current * 0.6);
    group.current.rotation.z = 0.045 * Math.sin(t.current * 0.3);
    group.current.rotation.y = 0.07 * Math.sin(t.current * 0.25);
  });
  const shellClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const hit = e.intersections.find((h) =>
      PART_ORDER.includes(h.object.userData.cellPart as Part),
    );
    select(hit ? (hit.object.userData.cellPart as Part) : "slayer");
  };
  return (
    <group ref={group} rotation={[0.16, -0.2, 0.1]} scale={1.25}>
      <ArchaeaShell
        radius={1.06}
        color="#d7a6e8"
        opacity={xray ? 0.055 : 0.22}
        selected={selected === "slayer"}
        onClick={shellClick}
      />
      <ArchaeaShell
        radius={0.985}
        color="#edb77f"
        opacity={xray ? 0.055 : 0.16}
        selected={selected === "membrane"}
        onClick={shellClick}
      />
      <ArchaeaDNA
        select={select}
        selected={selected === "nucleoid"}
        paused={paused}
      />
      <ArchaeaRibosomes select={select} selected={selected === "ribosomes"} />
      <ArchaeaFibers
        select={select}
        selected={selected === "pili"}
        paused={paused}
      />
      <Archaella
        select={select}
        selected={selected === "archaella"}
        paused={paused}
      />
    </group>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const distance =
      aspect < 0.75 ? 9.3 : aspect < 1.25 ? 8.2 : aspect < 1.7 ? 7.5 : 6.7;
    camera.position.set(0, 0.1, distance);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export default function ArchaeaCellScene({ onBack }: Props) {
  const [selected, setSelected] = useState<Part | null>(null);
  const [xray, setXray] = useState(false);
  const [showEnvironment, setShowEnvironment] = useState(false);
  const [environmentCardOpen, setEnvironmentCardOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [cardCollapsed, setCardCollapsed] = useState(false);
  const [environmentCollapsed, setEnvironmentCollapsed] = useState(false);
  useEffect(() => {
    if (!showIntro) return;
    const timeout = window.setTimeout(() => setShowIntro(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [showIntro]);
  useEffect(() => {
    const timeout = window.setTimeout(() => setShowHint(false), 6500);
    return () => window.clearTimeout(timeout);
  }, []);
  const controls = useRef<OrbitControlsImpl>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const selectPart = (part: Part | null) => {
    setSelected(part);
    if (part) {
      // A cell-part card takes priority over the environment card.
      // The geothermal backdrop can remain visible.
      setEnvironmentCardOpen(false);
      setCardCollapsed(false);
      setShowIntro(false);
      setShowHint(false);
      sceneRef.current?.focus({ preventScroll: true });
    }
  };
  const info = selected ? DATA[selected] : null;
  const toggleEnvironment = () => {
    const next = !showEnvironment;
    setShowEnvironment(next);
    setEnvironmentCardOpen(next);
    setEnvironmentCollapsed(false);
    if (next) {
      setSelected(null);
      setCardCollapsed(false);
      setShowIntro(false);
      setShowHint(false);
    }
  };
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
      aria-label="Utforska arkéen. Klicka på en celldel och använd Tab eller Skift plus Tab för att bläddra, Escape för att stänga."
      className="relative isolate h-full min-h-0 w-full overflow-hidden bg-[#06111d] text-[#f6f0ea]"
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_50%_45%,#18283c_0%,#101827_53%,#080e1b_100%)] ${showEnvironment ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000 ${showEnvironment ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_47%_65%,#9a5031_0%,#61392e_29%,#352832_58%,#130f20_100%)]" />
        <div className="absolute -bottom-[30%] left-[-20%] h-[78%] w-[140%] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_40%,#dc9950a8_0%,#9c4e3770_33%,#3c2b3800_72%)] blur-3xl" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_12%_82%,#efbb6b70_0%,transparent_33%),radial-gradient(ellipse_at_85%_76%,#e37b5260_0%,transparent_36%)]" />
        <div className="absolute bottom-[8%] left-[-10%] h-[33%] w-[120%] rounded-[50%] border-t border-amber-200/20 bg-[linear-gradient(180deg,#edaa6c20_0%,#723d3d08_70%)] blur-sm" />
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className="archaea-bubble absolute bottom-[-12%] rounded-full border border-amber-100/35 bg-amber-100/10 shadow-[0_0_18px_#ffba6555]"
            style={{
              left: `${5 + ((i * 37) % 90)}%`,
              width: `${5 + (i % 4) * 4}px`,
              height: `${5 + (i % 4) * 4}px`,
              animationDelay: `${-(i * 0.77)}s`,
              animationDuration: `${5 + (i % 6) * 1.15}s`,
            }}
          />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={`steam-${i}`}
            className="archaea-steam absolute bottom-[4%] h-[42%] w-[12%] rounded-full bg-gradient-to-t from-orange-100/15 via-amber-100/10 to-transparent blur-3xl"
            style={{
              left: `${7 + i * 14}%`,
              animationDelay: `${-i * 1.1}s`,
              animationDuration: `${7 + (i % 3) * 2}s`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_24%,#0d0b1b88_100%)]" />
      </div>
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.1, 6.7], fov: 42 }}
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
          <Archaeon
            xray={xray}
            paused={paused}
            selected={selected}
            select={selectPart}
          />
          <OrbitControls
            ref={controls}
            target={[0, 0, 0]}
            minDistance={3.5}
            maxDistance={15}
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            minPolarAngle={0.3}
            maxPolarAngle={2.5}
          />
        </Canvas>
      </div>

      {/* Same visual hierarchy as the animal and plant cell exhibits. */}
      <header
        className={`pointer-events-none absolute z-20 left-[76px] right-3 top-5 lg:left-7 lg:right-7 lg:top-8 max-lg:landscape:top-3 flex items-start justify-between gap-3 transition-opacity duration-700 ${showIntro ? "opacity-100" : "opacity-0"} lg:opacity-100`}
      >
        <div className="w-full max-w-[min(540px,calc(100vw-96px))] lg:max-w-[540px] max-lg:landscape:max-w-[min(440px,calc(100vw-165px))]">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#D8C18D] lg:mb-2">
            THE UNFOLDING UNIVERSE · MUSEUM
          </p>
          <h1 className="font-serif text-[clamp(23px,2.5vw,38px)] leading-tight tracking-tight text-[#F5F2EA] max-lg:landscape:text-[23px]">
            Arkéernas värld
          </h1>
          <p className="mt-1 text-[11px] leading-[1.4] text-[#B6CBD0] lg:mt-2 lg:text-sm">
            Upptäck <i>Sulfolobus acidocaldarius</i> – en arké som trivs i heta,
            sura miljöer.
          </p>
          <p className="mt-1 text-[10px] text-teal-200/80 lg:mt-2 lg:text-[11px]">
            Arkéecell · <i>Sulfolobus acidocaldarius</i> · preparat 004
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
        onParts={() => selectPart("slayer")}
        experiments={[]}
      />

      <style>{`
        /* Museum HUD anchors: one authoritative rule set per scene. */
        .museum-scene-hint { position:absolute; left:50%; bottom:90px; transform:translateX(-50%); z-index:10; width:max-content; max-width:calc(100% - 32px); pointer-events:none; }
        .museum-scene-specimen { position:absolute; left:16px; bottom:94px; z-index:10; pointer-events:none; }
        @media (max-width:1023px) and (orientation:portrait) {
          .museum-scene-hint { bottom:112px; }
          .museum-scene-specimen { bottom:84px; }
        }
        @media (max-width:1023px) and (orientation:landscape) {
          .museum-scene-hint { bottom:78px; }
          .museum-scene-specimen { bottom:18px; }
        }
      `}</style>
      {/* Top-right controls, matching the other specimens. */}
      <div className="absolute right-3 top-[140px] z-30 flex flex-col items-end gap-1.5 landscape:max-lg:top-3 lg:right-7 lg:top-[94px] lg:gap-2">
        <button
          type="button"
          onClick={toggleEnvironment}
          aria-pressed={showEnvironment}
          title="Extrema miljöer"
          aria-label={
            showEnvironment
              ? "Tillbaka till preparatet"
              : "Visa extrema miljöer"
          }
          className={`flex h-9 w-9 items-center justify-center gap-2 rounded-full border xl:w-auto px-2.5 text-xs backdrop-blur-xl transition xl:px-3 ${showEnvironment ? "border-amber-300/70 bg-amber-300/20 text-amber-100" : "border-white/20 bg-[#102a3b]/80 hover:bg-white/10"}`}
        >
          <Info size={15} />
          <span className="hidden xl:inline">
            {showEnvironment ? "Tillbaka till preparatet" : "Extrema miljöer"}
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

      {showEnvironment && environmentCardOpen && (
        <aside
          role="dialog"
          aria-label="Extrem miljö – het och sur källa"
          className={`absolute bottom-2 left-3 right-3 z-40 max-h-[min(52dvh,380px)] overflow-y-auto rounded-2xl border border-amber-200/30 bg-[#241e26]/95 p-4 text-[#fff2e5] shadow-[0_18px_70px_#160c0b99] backdrop-blur-2xl landscape:max-lg:bottom-auto landscape:max-lg:left-[70px] landscape:max-lg:right-auto landscape:max-lg:top-[12px] landscape:max-lg:w-[min(285px,42vw)] landscape:max-lg:max-h-[calc(100dvh-125px)] lg:bottom-auto lg:left-7 lg:right-auto lg:top-[205px] lg:w-[min(355px,30vw)] lg:max-h-[min(58dvh,450px)] lg:p-5 ${environmentCollapsed ? "max-lg:bottom-2 max-lg:max-h-none max-lg:overflow-hidden landscape:max-lg:bottom-2 landscape:max-lg:top-auto" : ""}`}
        >
          <div
            className={`flex justify-between gap-3 ${environmentCollapsed ? "items-center" : "items-start"}`}
          >
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-[.16em] text-amber-300 ${environmentCollapsed ? "max-lg:hidden" : ""}`}
              >
                EXTREMA MILJÖER · ARKÉER
              </p>
              <h2
                className={`font-serif leading-tight lg:text-2xl ${environmentCollapsed ? "text-base lg:mt-2" : "mt-2 text-xl"}`}
              >
                Liv i hett, surt vatten
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setEnvironmentCollapsed((v) => !v)}
                aria-expanded={!environmentCollapsed}
                aria-label={
                  environmentCollapsed
                    ? "Visa miljöinformation"
                    : "Minimera miljöinformation"
                }
                className="rounded-full p-1.5 hover:bg-white/10 lg:hidden"
              >
                {environmentCollapsed ? (
                  <ChevronUp size={19} />
                ) : (
                  <ChevronDown size={19} />
                )}
              </button>
              <button
                type="button"
                onClick={() => setEnvironmentCardOpen(false)}
                aria-label="Stäng miljöinformation"
                className="shrink-0 rounded-full p-1.5 hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>
          </div>
          <div className={environmentCollapsed ? "hidden lg:block" : ""}>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-orange-200/20 bg-orange-300/10 p-3">
                <ThermometerSun size={17} className="text-orange-200" />
                <p className="mt-1 text-lg font-bold text-orange-100">~75 °C</p>
                <p className="text-[10px] text-orange-100/75">
                  Typisk tillväxttemperatur
                </p>
              </div>
              <div className="rounded-xl border border-amber-200/20 bg-amber-300/10 p-3">
                <Droplets size={17} className="text-amber-200" />
                <p className="mt-1 text-lg font-bold text-amber-100">pH 2–3</p>
                <p className="text-[10px] text-amber-100/75">
                  Mycket surt vatten
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-orange-50/90 landscape:max-lg:text-xs">
              <i>Sulfolobus acidocaldarius</i> lever i heta, sura miljöer,
              exempelvis geotermiska källor. Där skulle många andra organismer
              ha svårt att överleva.
            </p>
            <div className="mt-3 flex gap-2 border-t border-amber-100/15 pt-3">
              <Waves size={17} className="mt-0.5 shrink-0 text-amber-200" />
              <p className="text-xs leading-relaxed text-orange-100/80">
                Cellens speciella membranlipider och skyddande S-lager hjälper
                den att fungera under extrema förhållanden.
              </p>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-orange-100/55">
              Miljön är en pedagogisk visualisering bakom mikroskoppreparatet,
              inte en bild av hur en verklig mikroskopvy ser ut.
            </p>
          </div>
        </aside>
      )}

      {showHint && !selected && !showEnvironment && (
        <div className="museum-scene-hint rounded-xl border border-white/10 bg-[#102a3b]/90 px-3 py-2 text-center text-[11px] text-slate-200 shadow-lg backdrop-blur-md lg:px-4 lg:py-3 lg:text-xs">
          Dra för att rotera · Zooma för att utforska
          <span className="mt-1 block text-[11px] text-amber-200/85">
            Tryck på en del av arkéen för att undersöka den
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes archaeaBubbleRise {
          0% {
            transform: translate3d(0, 0, 0) scale(0.65);
            opacity: 0;
          }
          12% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.38;
          }
          100% {
            transform: translate3d(18px, -95vh, 0) scale(1.35);
            opacity: 0;
          }
        }
        @keyframes archaeaSteamRise {
          0% {
            transform: translateY(15%) scaleX(0.75);
            opacity: 0.2;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-35%) scaleX(1.25);
            opacity: 0;
          }
        }
        .archaea-bubble {
          animation: archaeaBubbleRise 7s linear infinite;
        }
        .archaea-steam {
          animation: archaeaSteamRise 8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .archaea-bubble,
          .archaea-steam {
            animation: none;
            opacity: 0.2;
          }
        }
      `}</style>
      {/* A contextual card opens ONLY when a structure is clicked. */}
      {info && (
        <aside
          role="dialog"
          aria-label={info.name}
          className={`absolute left-3 right-3 z-40 overflow-y-auto rounded-2xl border border-white/15 bg-[#102735]/95 shadow-2xl backdrop-blur-2xl
            ${
              cardCollapsed
                ? "bottom-2 max-h-none overflow-hidden px-4 py-3 landscape:max-lg:bottom-2 landscape:max-lg:top-auto"
                : "bottom-2 max-h-[min(42dvh,330px)] p-4 landscape:max-lg:bottom-auto landscape:max-lg:top-[12px] landscape:max-lg:max-h-[calc(100dvh-125px)]"
            }
            landscape:max-lg:left-[70px] landscape:max-lg:right-auto landscape:max-lg:w-[min(270px,42vw)]
            lg:bottom-auto lg:left-auto lg:right-7 lg:top-[280px] lg:w-[min(340px,35vw)] lg:max-h-[min(58dvh,470px)] lg:overflow-y-auto lg:p-5`}
        >
          <div
            className={`flex justify-between gap-3 ${cardCollapsed ? "items-center lg:items-start" : "items-start"}`}
          >
            <div className="min-w-0 flex-1">
              <div className={cardCollapsed ? "hidden lg:block" : ""}>
                <>
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-teal-200/80">
                    <Info size={13} /> UNDERSÖK ARKÉEN
                  </p>
                  <div
                    className="mb-2 h-1 w-11 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                </>
              </div>
              <h2
                className={`font-serif leading-tight ${cardCollapsed ? "text-base lg:text-2xl" : "text-xl lg:text-2xl"}`}
              >
                {info.name}
              </h2>
              <p
                className={`mt-1 text-xs text-teal-200/85 ${cardCollapsed ? "hidden lg:block" : ""}`}
              >
                {info.subtitle}
              </p>
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
                className="rounded-full p-1.5 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-teal-200 lg:hidden"
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
          <div className={cardCollapsed ? "hidden lg:block" : ""}>
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
          </div>
        </aside>
      )}

      <div className="museum-scene-specimen text-[11px] text-teal-100/65">
        <i>S. acidocaldarius</i> · 004
      </div>
    </main>
  );
}
