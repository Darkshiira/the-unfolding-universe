"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

// Shared original animal-cell ER and Golgi geometry; scene-specific positioning
// is handled by a parent group in the plant or animal scene.
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
  { angle: 2.63, radius: 0.76, phase: 0.31, width: 0.43, halfSpan: 0.39, depth: 0.37, folds: 8, drift: -0.075 },
  { angle: 1.83, radius: 0.81, phase: 2.13, width: 0.29, halfSpan: 0.25, depth: 0.26, folds: 5, drift: 0.055 },
  { angle: 0.19, radius: 0.88, phase: 3.77, width: 0.46, halfSpan: 0.43, depth: 0.41, folds: 9, drift: -0.035 },
  { angle: -1.04, radius: 0.79, phase: 5.13, width: 0.33, halfSpan: 0.28, depth: 0.31, folds: 6, drift: 0.082 },
  { angle: -2.49, radius: 0.85, phase: 6.54, width: 0.38, halfSpan: 0.36, depth: 0.35, folds: 7, drift: -0.055 },
];

function makeERPath(patch: ERPatch) {
  const points: THREE.Vector3[] = [];
  const n = patch.folds;
  const lanes = Array.from({ length: n + 1 }, (_, i) =>
    0.012 + patch.depth * (i / n) + 0.009 * Math.sin(i * 1.83 + patch.phase),
  );
  const lefts = Array.from({ length: n + 1 }, (_, i) =>
    patch.drift - patch.halfSpan * (0.64 + 0.34 * (0.5 + 0.5 * Math.sin(i * 1.71 + patch.phase))),
  );
  const rights = Array.from({ length: n + 1 }, (_, i) =>
    patch.drift + patch.halfSpan * (0.60 + 0.39 * (0.5 + 0.5 * Math.sin(i * 1.37 + patch.phase * 0.71))),
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
      points.push(new THREE.Vector3(
        THREE.MathUtils.lerp(startX, endX, u),
        y + (0.004 + 0.003 * Math.sin(i * 1.29 + patch.phase)) * Math.sin(u * Math.PI * 2 + patch.phase + i * 0.63) * Math.sin(u * Math.PI),
        0,
      ));
    }
    if (i === n) break;

    // Rounded hairpin with a gently drifting tip. Unlike the previous
    // geometry, there is no long, flat bridge at the turn.
    const nextX = goingRight ? rights[i + 1] : lefts[i + 1];
    const nextY = lanes[i + 1];
    const tipX = goingRight ? Math.max(endX, nextX) : Math.min(endX, nextX);
    const direction = goingRight ? 1 : -1;
    const bulge = 0.018 + 0.010 * (0.5 + 0.5 * Math.sin(i * 2.17 + patch.phase));
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
    const endTaper = 1 - 0.40 * Math.pow(Math.abs(t * 2 - 1), 6);
    const breadth = patch.width * endTaper *
      (0.80 + 0.12 * Math.sin(t * 13 + patch.phase) +
       0.09 * Math.sin(t * 29 + patch.phase * 1.7) +
       0.045 * Math.sin(t * 47 + patch.phase * 0.8));
    for (let j = 0; j <= across; j++) {
      const v = (j / across) * 2 - 1;
      // A shallow, inflated cross-section rather than a flat rectangular panel.
      // Rounded shoulders become especially visible when the cell is rotated.
      const shoulder = Math.pow(Math.abs(v), 4);
      const r = radius +
        0.026 * (1 - v * v) +
        0.012 * (1 - v * v) * Math.sin(t * 11 + patch.phase) +
        0.006 * Math.sin(v * 3.2 + t * 17 + patch.phase) -
        0.009 * shoulder;
      const softenedEdge = v * (1 - 0.095 * shoulder);
      centers.push(
        new THREE.Vector3(
          Math.cos(theta) * r,
          Math.sin(theta) * r * 0.96,
          -0.08 + softenedEdge * breadth * 0.5 +
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
        const thickness = 0.010 + 0.006 * Math.pow(Math.abs(v), 6);
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

export function EndoplasmicReticulum({
  selected,
  onSelect,
  motion,
  onRibosomeSelect,
}: {
  selected: boolean;
  onSelect: () => void;
  motion: boolean;
  onRibosomeSelect: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useRef(0);
  useFrame((_, delta) => {
    if (motion) phase.current += Math.min(delta, 0.05);
    if (!groupRef.current) return;
    const t = phase.current;
    groupRef.current.scale.set(1 + 0.007 * Math.sin(t * 0.38), 1 + 0.009 * Math.sin(t * 0.29 + 1), 1 + 0.013 * Math.sin(t * 0.33 + 2));
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
        const r = patch.radius + pt.y + 0.012 +
          0.026 * (1 - v * v) +
          0.012 * (1 - v * v) * Math.sin(t * 11 + patch.phase) +
          0.006 * Math.sin(v * 3.2 + t * 17 + patch.phase) -
          0.009 * Math.pow(Math.abs(v), 4);
        const breadth = patch.width *
          (1 - 0.40 * Math.pow(Math.abs(t * 2 - 1), 6)) *
          (0.80 + 0.12 * Math.sin(t * 13 + patch.phase) +
           0.09 * Math.sin(t * 29 + patch.phase * 1.7) +
           0.045 * Math.sin(t * 47 + patch.phase * 0.8));
        dots.push([
          Math.cos(theta) * r,
          Math.sin(theta) * r * 0.96,
          -0.08 + v * (1 - 0.095 * Math.pow(Math.abs(v), 4)) * breadth * 0.5 +
            0.016 * Math.sin(t * 9 + patch.phase) * (1 - v * v) +
            0.008 * Math.sin(t * 21 + v * 2 + patch.phase) *
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
  const bridges = useMemo(() => [0, 3].map((i) => {
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
        const radial = THREE.MathUtils.lerp(rA, rB, ease)
          - 0.17 * Math.sin(Math.PI * t)
          + 0.009 * Math.sin(t * Math.PI * 3 + patch.phase) * Math.sin(Math.PI * t);
        const neck = Math.pow(Math.sin(Math.PI * t), 0.8);
        const width = THREE.MathUtils.lerp(patch.width, next.width, ease) *
          (1 - 0.72 * neck) *
          (0.96 + 0.04 * Math.sin(t * 15 + patch.phase));
        for (let k = 0; k <= across; k++) {
          const v = k / across * 2 - 1;
          const swell = Math.sin(Math.PI * t) * (1 - v * v);
          // The connector swells softly at the shoulders and sits behind
          // the visible folds, avoiding the appearance of a thin circular ring.
          const r = radial + 0.020 * (1 - v * v) +
            0.012 * swell * Math.sin(t * 12 + patch.phase) +
            (side === 0 ? 0.010 : -0.010);
          const z = -0.08 + v * (1 - 0.09 * Math.pow(Math.abs(v), 4)) * width * 0.5
            + 0.012 * swell * Math.sin(t * 9 + patch.phase);
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
        indices.push(a, b, a + vertexCount, b, b + vertexCount, a + vertexCount);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }), []);
  useEffect(() => () => bridges.forEach((g) => g.dispose()), [bridges]);

  return (
    <group ref={groupRef} position={[-0.35, 0.12, -0.38]} rotation={[0.1, -0.18, 0.08]}>
      {bridges.map((geometry, i) => (
        <mesh key={`bridge-${i}`} geometry={geometry} raycast={() => null}>
          <meshStandardMaterial color={selected ? "#A9E2EA" : "#68AABE" } side={THREE.DoubleSide} roughness={0.76} transparent opacity={0.43} depthWrite={false} emissive="#163944" emissiveIntensity={0.09} />
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
        <group key={i} position={position}>
          <mesh raycast={() => null}>
            <sphereGeometry args={[0.012, 7, 6]} />
            <meshStandardMaterial color="#C4E4DB" emissive="#426F6D" emissiveIntensity={0.16} roughness={0.85} />
          </mesh>
          {/* Invisible but generous pointer target for tiny bound ribosomes. */}
          <mesh onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onRibosomeSelect(); }}>
            <sphereGeometry args={[0.026, 6, 5]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </group>
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

export function GolgiApparatus({
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
    groupRef.current.position.y = -0.75 + 0.025 * Math.sin(phase.current * 0.32 + 1);
    groupRef.current.rotation.z = -0.24 + 0.018 * Math.sin(phase.current * 0.27);
  });
  const layers = useMemo(
    () => Array.from({ length: 7 }, (_, i) => makeGolgiCisterna(i, 7)),
    [],
  );
  useEffect(() => () => layers.forEach((g) => g.dispose()), [layers]);
  return (
    <group ref={groupRef} position={[0.92, -0.75, 0.5]} rotation={[0.25, -0.35, -0.24]}>
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

