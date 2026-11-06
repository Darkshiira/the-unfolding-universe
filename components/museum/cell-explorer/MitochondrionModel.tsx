"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Stage = 0 | 1 | 2 | 3;
type Props = { stage: Stage; paused: boolean; oxygen: number; fuel: number };

// Continuous cristae with individually varied upper folds.
// It is a closed, thin membrane pocket, curved through depth, rather than
// a squashed sphere or a repeated row of identical objects.

function makeSingleCrista(
  position: "lower" | "upper" = "lower",
  lowerProfile?: readonly number[],
) {
  // Available throughout the entire function.
  const isUpper = position === "upper";

  const samples = 480;
  const profile: number[] = [];
  if (isUpper && (!lowerProfile || lowerProfile.length !== samples + 1)) {
    throw new Error("Upper crista requires the sampled lower membrane profile");
  }

  const centers: THREE.Vector3[] = [];
  const anchors: THREE.Vector3[] = [];

  const smoothstep = (t: number) => t * t * (3 - 2 * t);
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  // Maximum height of the folds.
  // The red line is approximately at y = 0.
  const MAX_Y = -0.025;

  // A deliberate mix of short, medium, and deep upper folds.
  // Index by crest number, not by x, so each fold has a consistent height.
  const upperFoldHeights = [
    0.44, 0.83, 0.28, 0.98, 0.53, 0.31, 0.86, 0.39, 0.69, 0.36,
  ] as const;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = -2.3 + 4.6 * t;

    // Follow the curved lower inner membrane,
    // including its rising left and right edges.
    const edgeY = -1.055 * Math.sqrt(Math.max(0, 1 - (x / 2.36) ** 2));

    const anchorY = edgeY + 0.018;

    // Very short fade at the endpoints.
    // This allows folds to extend onto both curved edges.
    // Longer, smoother attachment zones prevent tiny hooked ends.
    // This only affects the outer ~6% of each crista.
    const fadeIn = smoothstep(clamp01(t / 0.06));
    const fadeOut = smoothstep(clamp01((1 - t) / 0.06));
    const envelope = fadeIn * fadeOut;

    // Keep the lower folds exactly as they are.
    // Shift the upper fold pattern by approximately
    // half a cycle, without moving its attachment points.
    const cycles =
      8.0 * t +
      0.13 * Math.sin(2 * Math.PI * 1.7 * t + 0.35) +
      0.065 * Math.sin(2 * Math.PI * 4.1 * t + 0.9);

    // The upper mesh is rotated 180 degrees in JSX. Its local X is
    // therefore reversed relative to the lower mesh. Sample the lower
    // fold rhythm at the corresponding WORLD X, then shift by half a
    // cycle: upper peaks fall into lower valleys.
    const oppositeT = 1 - t;
    const oppositeCycles =
      8.0 * oppositeT +
      0.13 * Math.sin(2 * Math.PI * 1.7 * oppositeT + 0.35) +
      0.065 * Math.sin(2 * Math.PI * 4.1 * oppositeT + 0.9);
    const phase = 2 * Math.PI * (isUpper ? oppositeCycles + 0.5 : cycles);

    // Cosine gives us a naturally smooth periodic curve.

    // Rounded, bulbous tips with slightly narrower necks.
    // Keep the valleys soft and naturally curved.

    // Broad, rounded valleys with softly bulbous crests.
    // The width varies naturally between folds.

    const cosine = Math.cos(phase);
    const baseWave = 0.5 + 0.5 * cosine;

    // Widen the bottom of the valleys.
    // Higher values make the valleys broader.
    const valleyRoundness = 1.65 + 0.25 * Math.sin(2 * Math.PI * 2.3 * t + 0.8);

    // Shape the lower half while retaining smooth curvature.
    const wideValley = Math.pow(baseWave, Math.max(1.2, valleyRoundness));

    // Keep the upper tips broad and softly rounded.
    const tipRoundness =
      0.48 +
      0.07 * Math.sin(2 * Math.PI * 2.1 * t + 0.4) +
      0.04 * Math.sin(2 * Math.PI * 3.7 * t + 1.2);

    const roundedTip = Math.pow(
      baseWave,
      Math.max(0.36, Math.min(0.62, tipRoundness)),
    );

    // Blend the broad valley into the bulbous tip.
    const tipBlend = smoothstep(
      Math.max(0, Math.min(1, (baseWave - 0.38) / 0.42)),
    );

    const wave = wideValley * (1 - tipBlend) + roundedTip * tipBlend;

    // Taller folds with intentionally uneven heights.

    // Each fold has its own height.
    // Some are tall, some medium, and some noticeably shorter.

    // Upper crests are centered at integer values of the shifted cycle.
    // The 180° JSX rotation is already accounted for by oppositeCycles.
    // Choosing a height per crest avoids the repeating, comb-like look.
    const upperCrestIndex = Math.max(
      0,
      Math.min(upperFoldHeights.length - 1, Math.round(oppositeCycles + 0.5)),
    );

    // Blend neighboring heights only near the valleys. This avoids sudden
    // steps when the crest index changes while preserving individual tips.
    const upperCycle = oppositeCycles + 0.5;
    const nearestCrest = Math.round(upperCycle);
    const distanceToCrest = Math.abs(upperCycle - nearestCrest);
    const neighborIndex = Math.max(
      0,
      Math.min(
        upperFoldHeights.length - 1,
        nearestCrest + (upperCycle > nearestCrest ? 1 : -1),
      ),
    );
    const heightBlend = smoothstep(clamp01((distanceToCrest - 0.28) / 0.22));
    const upperHeight =
      upperFoldHeights[upperCrestIndex] * (1 - heightBlend) +
      upperFoldHeights[neighborIndex] * heightBlend;

    const height = isUpper
      ? upperHeight
      : // Preserve the lower folds exactly as before.
        0.9 +
        0.23 * Math.sin(2 * Math.PI * 2.1 * t + 0.5) +
        0.16 * Math.sin(2 * Math.PI * 4.3 * t + 1.7) +
        0.08 * Math.cos(2 * Math.PI * 7.1 * t);

    const desiredY =
      anchorY + envelope * Math.max(isUpper ? 0.2 : 0.58, height) * wave;

    const rise = Math.max(0, desiredY - anchorY);
    let cappedRise: number;

    if (isUpper) {
      // After the 180-degree rotation, upper world Y = -local Y.
      // The lower profile is indexed in the opposite direction because
      // rotating the upper mesh also reverses its horizontal axis.
      const lowerY = lowerProfile![samples - i];
      const upperWallY = -anchorY;

      // Clearance measured between the CENTERLINES. Include enough
      // space for the rounded lip on both membranes.
      const CENTERLINE_GAP = 0.19;
      const maximumRise = Math.max(0, upperWallY - lowerY - CENTERLINE_GAP);

      // Unlike the old MAX_Y cap, this permits the upper folds to
      // cross the middle into actual pockets of the lower membrane.
      // A smooth clearance cap avoids flattening tips abruptly.
      // Short folds stay short; only the deepest approach the lower lip.
      const softness = Math.max(0.001, maximumRise * 0.16);
      const startCap = Math.max(0, maximumRise - softness);
      cappedRise =
        rise <= startCap
          ? rise
          : startCap + softness * Math.tanh((rise - startCap) / softness);
      cappedRise = Math.min(cappedRise, maximumRise);
    } else {
      // Preserve the existing lower crista height behavior.
      const availableHeight = Math.max(0, MAX_Y - anchorY);
      const softLimit = availableHeight * 0.78;
      const hardLimit = availableHeight * 0.97;
      cappedRise = rise;

      if (rise > softLimit && availableHeight > 0) {
        const excess = rise - softLimit;
        const remaining = hardLimit - softLimit;
        cappedRise = softLimit + remaining * Math.tanh(excess / remaining);
      }
      cappedRise = Math.max(0, Math.min(cappedRise, hardLimit));
    }

    const y = anchorY + cappedRise;
    profile.push(y);

    // Keep the folded membrane aligned with its attachment wall.
    const z = -0.28 + 0.025 * Math.sin(2 * Math.PI * t * 1.4);

    centers.push(new THREE.Vector3(x, y, z));
    anchors.push(new THREE.Vector3(x, anchorY, z - 0.025));
  }

  // Rounded membrane lip.
  const path = new THREE.CatmullRomCurve3(centers, false, "centripetal");

  const along = 720;
  const around = 20;
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= along; i++) {
    const t = i / along;
    const center = path.getPoint(t);
    const tangent = path.getTangent(t).normalize();

    const nx = -tangent.y;
    const ny = tangent.x;

    // Rounded lip fades into the wall at each end instead of ending
    // in a visible nub. Keep full thickness across the main folds.
    const endFade = smoothstep(clamp01(Math.min(t, 1 - t) / 0.055));
    const taper = 0.015 + 0.985 * endFade;

    // Slightly bulbous membrane tips.
    // The lip grows thicker near the fold crests,
    // while the lower sections stay slimmer.

    const lipCycles =
      8.0 * t +
      0.13 * Math.sin(2 * Math.PI * 1.7 * t + 0.35) +
      0.065 * Math.sin(2 * Math.PI * 4.1 * t + 0.9);

    const reflectedT = 1 - t;
    const reflectedCycles =
      8.0 * reflectedT +
      0.13 * Math.sin(2 * Math.PI * 1.7 * reflectedT + 0.35) +
      0.065 * Math.sin(2 * Math.PI * 4.1 * reflectedT + 0.9);
    const lipPhase =
      2 * Math.PI * (isUpper ? reflectedCycles + 0.5 : lipCycles);

    const crestAmount = Math.pow(Math.max(0, Math.cos(lipPhase)), 4);

    const halfThickness = (0.049 + 0.03 * crestAmount) * taper;

    // Slightly thicker, less ribbon-like lip with uneven depth.
    const depthVariation = 1 + 0.1 * Math.sin(2 * Math.PI * 2.3 * t + 0.7);
    const halfDepth = (0.15 + 0.05 * crestAmount) * taper * depthVariation;

    for (let j = 0; j <= around; j++) {
      const angle = (j / around) * Math.PI * 2;

      vertices.push(
        center.x + nx * Math.cos(angle) * halfThickness,
        center.y + ny * Math.cos(angle) * halfThickness,
        center.z + Math.sin(angle) * halfDepth,
      );
    }
  }

  for (let i = 0; i < along; i++) {
    for (let j = 0; j < around; j++) {
      const p = i * (around + 1) + j;

      indices.push(
        p,
        p + 1,
        p + around + 1,
        p + 1,
        p + around + 2,
        p + around + 1,
      );
    }
  }

  const lip = new THREE.BufferGeometry();

  lip.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  lip.setIndex(indices);
  lip.computeVertexNormals();

  // A shallow, enclosed membrane pocket, rather than a single flat sheet.
  // The two surfaces have gently varying depth and meet at the fold lip.
  const sheetVertices: number[] = [];
  const sheetIndices: number[] = [];
  const rows = 20;
  const stride = rows + 1;
  const surfaceSize = (samples + 1) * stride;

  for (let face = 0; face < 2; face++) {
    const side = face === 0 ? 1 : -1;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const center = centers[i];
      const anchor = anchors[i];

      for (let j = 0; j <= rows; j++) {
        const v = j / rows;
        const eased = smoothstep(v);
        const fullness = Math.sin(Math.PI * v);
        const depthWave =
          0.65 * Math.sin(2 * Math.PI * (1.35 * t + 0.21 * v)) +
          0.35 * Math.sin(2 * Math.PI * (3.1 * t - 0.32 * v) + 0.8);

        // Membrane sheets curve slightly across their depth. The width
        // shrinks at the wall and at the rounded exposed edge.
        const halfPocketDepth =
          (0.045 + 0.065 * fullness) *
          (1 + 0.13 * Math.sin(2 * Math.PI * 2.2 * t + 0.4));

        const endBlend = smoothstep(clamp01(Math.min(t, 1 - t) / 0.075));
        sheetVertices.push(
          anchor.x + 0.025 * fullness * depthWave * endBlend,
          anchor.y +
            (center.y - anchor.y) * eased +
            0.012 * fullness * depthWave * endBlend,
          anchor.z +
            (center.z - anchor.z) * eased -
            0.05 * fullness +
            side * halfPocketDepth * endBlend,
        );
      }
    }
  }

  for (let face = 0; face < 2; face++) {
    const offset = face * surfaceSize;
    for (let i = 0; i < samples; i++) {
      for (let j = 0; j < rows; j++) {
        const a = offset + i * stride + j;
        const b = a + stride;
        if (face === 0) {
          sheetIndices.push(a, b, a + 1, a + 1, b, b + 1);
        } else {
          sheetIndices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
  }

  const sheet = new THREE.BufferGeometry();
  sheet.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(sheetVertices, 3),
  );
  sheet.setIndex(sheetIndices);
  sheet.computeVertexNormals();

  return { lip, sheet, profile };
}

function makeCutawayShell(rx: number, ry: number, rz: number, cutZ: number) {
  // The back and sides are solid; the open front is a clean circular cut,
  // not a transparent overlay or a rectangular sheet.
  const longitude = 128;
  const latitude = 64;
  const vertices: number[] = [];
  const indices: number[] = [];
  const maxTheta = Math.acos(cutZ / rz);
  for (let j = 0; j <= latitude; j++) {
    const theta = Math.PI - ((Math.PI - maxTheta) * j) / latitude;
    const rr = Math.sin(theta);
    for (let i = 0; i <= longitude; i++) {
      const phi = (2 * Math.PI * i) / longitude;
      vertices.push(
        rx * rr * Math.cos(phi),
        ry * rr * Math.sin(phi),
        rz * Math.cos(theta),
      );
    }
  }
  for (let j = 0; j < latitude; j++)
    for (let i = 0; i < longitude; i++) {
      const a = j * (longitude + 1) + i;
      indices.push(
        a,
        a + longitude + 1,
        a + 1,
        a + 1,
        a + longitude + 1,
        a + longitude + 2,
      );
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

// Seal the opening between the two shells at one shared cut plane.
// Without this ring, oblique views can reveal the hollow gap between
// the outer and inner shells as dark crescents.
function makeMembraneRim(cutZ: number) {
  const segments = 128;
  const vertices: number[] = [];
  const indices: number[] = [];
  const outerScale = Math.sqrt(1 - (cutZ / 1.12) ** 2);
  const innerScale = Math.sqrt(1 - (cutZ / 0.95) ** 2);

  for (let i = 0; i <= segments; i++) {
    const a = (2 * Math.PI * i) / segments;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    vertices.push(2.65 * outerScale * c, 1.4 * outerScale * sn, cutZ);
    vertices.push(2.47 * innerScale * c, 1.22 * innerScale * sn, cutZ);
  }
  for (let i = 0; i < segments; i++) {
    const n = 2 * i;
    indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
  }
  const rim = new THREE.BufferGeometry();
  rim.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  rim.setIndex(indices);
  rim.computeVertexNormals();
  return rim;
}

export default function MitochondrionModel({
  stage,
  paused,
  oxygen,
  fuel,
}: Props) {
  const particles = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const activity = Math.min(oxygen, fuel) / 100;

  const geometry = useMemo(() => {
    // Build the lower membrane first so the upper membrane can use its
    // exact sampled contour to find the open pockets between folds.
    const lowerCrista = makeSingleCrista("lower");
    const upperCrista = makeSingleCrista("upper", lowerCrista.profile);

    return {
      // Both shell boundaries end at exactly the same Z plane.
      outer: makeCutawayShell(2.65, 1.4, 1.12, 0.22),
      inner: makeCutawayShell(2.47, 1.22, 0.95, 0.22),
      rim: makeMembraneRim(0.22),
      lowerCrista,
      upperCrista,
    };
  }, []);

  useEffect(
    () => () => {
      geometry.outer.dispose();
      geometry.inner.dispose();
      geometry.rim.dispose();

      geometry.lowerCrista.lip.dispose();
      geometry.lowerCrista.sheet.dispose();

      geometry.upperCrista.lip.dispose();
      geometry.upperCrista.sheet.dispose();
    },
    [geometry],
  );

  useFrame((_, delta) => {
    if (!paused) clock.current += Math.min(delta, 0.05);
    particles.current?.children.forEach((p, i) => {
      const t = clock.current * (0.12 + activity * 0.8) + i * 2.399963;
      const r =
        stage === 0
          ? 2.85
          : stage === 1
            ? 1.2
            : stage === 2
              ? 1.75
              : 1.3 + ((clock.current * 0.2 + i * 0.12) % 1) * 1.65;
      p.position.set(
        Math.cos(t) * r,
        Math.sin(t * 1.2) * (stage === 0 ? 1.4 : 0.68),
        0.72 + 0.09 * Math.sin(t * 1.7),
      );
    });
  });

  const particleColor =
    stage === 0
      ? "#ffae69"
      : stage === 1
        ? "#ff987d"
        : stage === 2
          ? "#7de8f7"
          : "#ffe27e";

  return (
    <group rotation={[0.05, -0.12, -0.035]}>
      <mesh geometry={geometry.outer}>
        <meshStandardMaterial
          color="#95695b"
          roughness={0.91}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={geometry.inner}>
        <meshStandardMaterial
          color="#b77d73"
          roughness={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Continuous, closed cut edge between the two membranes. */}
      <mesh geometry={geometry.rim}>
        <meshStandardMaterial
          color="#a87569"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Dark matrix provides separation and depth behind the cristae. */}
      <mesh position={[0, 0, -0.67]} scale={[2.28, 1.09, 0.17]}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial color="#6e4246" roughness={0.96} />
      </mesh>

      {/* LOWER CRISTA — original continuous membrane */}
      <group>
        <mesh geometry={geometry.lowerCrista.sheet}>
          <meshStandardMaterial
            color="#bf8980"
            roughness={0.92}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh geometry={geometry.lowerCrista.lip}>
          <meshStandardMaterial
            color={stage === 2 ? "#e6b1a4" : "#cf9285"}
            roughness={0.78}
            side={THREE.DoubleSide}
            emissive={stage === 2 ? "#803e3b" : "#241516"}
            emissiveIntensity={stage === 2 ? 0.2 : 0.025}
          />
        </mesh>
      </group>

      {/* UPPER CRISTA — independent interlocking folds */}
      <group position={[0, 0, -0.035]} rotation={[0, 0, Math.PI]}>
        <mesh geometry={geometry.upperCrista.sheet}>
          <meshStandardMaterial
            color="#bf8980"
            roughness={0.92}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh geometry={geometry.upperCrista.lip}>
          <meshStandardMaterial
            color={stage === 2 ? "#e6b1a4" : "#cf9285"}
            roughness={0.78}
            side={THREE.DoubleSide}
            emissive={stage === 2 ? "#803e3b" : "#241516"}
            emissiveIntensity={stage === 2 ? 0.2 : 0.025}
          />
        </mesh>
      </group>

      <group ref={particles} visible={stage === 0 || stage === 1}>
        {Array.from({ length: stage === 3 ? 30 : 18 }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[stage === 3 ? 0.064 : 0.047, 10, 8]} />
            <meshBasicMaterial
              color={particleColor}
              transparent
              opacity={0.15 + activity * 0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
