"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  progress: React.RefObject<number>;
  type: "spiral" | "elliptical" | "irregular";
  seed?: number;
};

const COUNT = 480;

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function smooth(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

const vertexShader = `
  attribute float aSize;
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aKind;
  attribute float aSeed;

  uniform float uTime;
  uniform float uOpacity;

  varying float vKind;
  varying float vSeed;
  varying float vOpacity;

  void main() {
    vec3 pos = position;

    if (aSpeed > 0.0) {
      float a = aAngle + uTime * aSpeed;
      pos.xy = vec2(cos(a), sin(a)) * aRadius;
    }

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = clamp(
      aSize * (48.0 / max(1.0, -mv.z)),
      1.0,
      110.0
    );

    vKind = aKind;
    vSeed = aSeed;
    vOpacity = uOpacity;
  }
`;

const fragmentShader = `
  varying float vKind;
  varying float vSeed;
  varying float vOpacity;

  float hash(vec2 p) {
    return fract(
      sin(dot(p, vec2(127.1, 311.7))) * 43758.5453
    );
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);

    float n1 = noise(uv * 7.0 + vSeed * 17.0);
    float n2 = noise(uv * 17.0 - vSeed * 9.0);

    float distortion = (n1 - 0.5) * 0.16
                     + (n2 - 0.5) * 0.05;

    float cloud = 1.0 - smoothstep(
      0.1,
      0.47,
      r + distortion
    );

    cloud *= cloud;
    cloud *= 0.5 + n1 * 0.5;

    vec3 color;
    float alpha;

    if (vKind < 0.5) {
      // Faint cool interstellar gas
      color = vec3(0.24, 0.34, 0.53);
      alpha = cloud * 0.065;
    } else if (vKind < 1.5) {
      // Sparse hydrogen emission regions
      color = vec3(0.58, 0.25, 0.34);
      alpha = cloud * 0.045;
    } else {
      // Subtle dust-colored patches
      color = vec3(0.012, 0.013, 0.02);
      alpha = cloud * 0.13;
    }

    gl_FragColor = vec4(
      color,
      alpha * vOpacity
    );
  }
`;

export default function GalaxyNebula({ progress, type, seed = 1 }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const angles = new Float32Array(COUNT);
    const radii = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const kinds = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const n = seed * 10000 + i * 13;

      const r1 = random(n + 1);
      const r2 = random(n + 2);
      const r3 = random(n + 3);
      const r4 = random(n + 4);
      const r5 = random(n + 5);

      let x = 0;
      let y = 0;
      let z = 0;
      let radius = 0;
      let angle = 0;
      let speed = 0;

      if (type === "spiral") {
        radius = 1.2 + Math.sqrt(r1) * 4.3;

        const arm = i % 4;

        angle = (arm / 4) * Math.PI * 2 + radius * 0.72 + (r2 - 0.5) * 0.7;

        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        z = (r3 - 0.5) * 0.18;

        const velocity = 0.22 * (1 - Math.exp(-radius / 0.8));

        speed = velocity / Math.max(radius, 0.25);
      } else if (type === "elliptical") {
        radius = Math.pow(r1, 1.8) * 3.2;
        angle = r2 * Math.PI * 2;

        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius * 0.7;
        z = (r3 - 0.5) * 0.7;
      } else {
        const cluster = i % 6;
        const a = (cluster * Math.PI * 2) / 6;

        x = Math.cos(a) * 1.4 + (r1 + r2 + r3 - 1.5) * 1.7;

        y = Math.sin(a) * 1.1 + (r2 + r3 + r4 - 1.5) * 1.5;

        z = (r3 - 0.5) * 0.5;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      radii[i] = radius;
      angles[i] = angle;
      speeds[i] = speed;

      sizes[i] = 7 + r4 * 13;

      kinds[i] = type === "elliptical" ? 0 : r5 < 0.65 ? 0 : r5 < 0.83 ? 1 : 2;

      seeds[i] = r3;
    }

    return {
      positions,
      sizes,
      angles,
      radii,
      speeds,
      kinds,
      seeds,
    };
  }, [type, seed]);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    material.uniforms.uTime.value = p * 12;
    material.uniforms.uOpacity.value =
      smooth(0.12, 0.36, p) * (1 - smooth(0.9, 1, p));
  });

  return (
    <points frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aAngle" args={[data.angles, 1]} />
        <bufferAttribute attach="attributes-aRadius" args={[data.radii, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[data.speeds, 1]} />
        <bufferAttribute attach="attributes-aKind" args={[data.kinds, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uOpacity: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        toneMapped={false}
      />
    </points>
  );
}
