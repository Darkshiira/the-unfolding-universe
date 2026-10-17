"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import GalaxyCore from "./GalaxyCore";
import GalaxyNebula from "./GalaxyNebula";

export type GalaxyType = "spiral" | "elliptical" | "irregular";

type GalaxyProps = {
  type: GalaxyType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  seed?: number;
  count?: number;
  barred?: boolean;
  progress: React.RefObject<number>;
};

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function smooth(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

const vertexShader = `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aRadius;
  attribute float aAngle;
  attribute float aSpeed;
  attribute float aBrightness;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uPixelRatio;
  uniform float uSpiral;

  varying vec3 vColor;
  varying float vBrightness;
  varying float vOpacity;

  void main() {
    vec3 pos = position;

    if (uSpiral > 0.5) {
      float angle = aAngle + uTime * aSpeed;
      pos.xy = vec2(cos(angle), sin(angle)) * aRadius;
    }

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * mv;

    gl_PointSize = clamp(
      aSize * (45.0 / max(1.0, -mv.z)) * uPixelRatio,
      0.5,
      18.0
    );

    vColor = aColor;
    vBrightness = aBrightness;
    vOpacity = uOpacity;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vBrightness;
  varying float vOpacity;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);

    float core = exp(-r * r * 220.0);
    float halo = exp(-r * r * 35.0);

    float light = core + halo * 0.17;

    float alpha = light * vBrightness * vOpacity;

    gl_FragColor = vec4(
      vColor * (core * 1.15 + halo * 0.2),
      clamp(alpha, 0.0, 1.0)
    );
  }
`;

export default function Galaxy({
  type,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  seed = 1,
  count = 12000,
  barred = false,
  progress,
}: GalaxyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const radii = new Float32Array(count);
    const angles = new Float32Array(count);
    const speeds = new Float32Array(count);
    const brightness = new Float32Array(count);

    const gold = new THREE.Color("#f4d5a5");
    const cream = new THREE.Color("#fff0d8");
    const blue = new THREE.Color("#b6ccef");
    const neutral = new THREE.Color("#d7dce7");

    for (let i = 0; i < count; i++) {
      const n = seed * 100000 + i * 19;

      const r1 = random(n + 1);
      const r2 = random(n + 2);
      const r3 = random(n + 3);
      const r4 = random(n + 4);
      const r5 = random(n + 5);
      const r6 = random(n + 6);
      const r7 = random(n + 7);

      let x = 0;
      let y = 0;
      let z = 0;
      let radius = 0;
      let angle = 0;
      let speed = 0;

      let color = neutral.clone();

      if (type === "spiral") {
        const coreStar = r1 < 0.22;
        const barStar = barred && r1 >= 0.22 && r1 < 0.34;
        const armStar = !coreStar && !barStar && r2 < 0.43;

        if (coreStar) {
          radius = Math.pow(r3, 1.7) * 1.45;
          angle = r4 * Math.PI * 2;
        } else if (barStar) {
          // Elongated central stellar bar
          x = (r3 + r4 + r5 - 1.5) * 1.65;
          y = (r5 + r6 + r7 - 1.5) * 0.38;

          radius = Math.sqrt(x * x + y * y);
          angle = Math.atan2(y, x);
        } else {
          radius = 0.6 + Math.sqrt(r3) * 5.1;

          if (armStar) {
            const arm = i % 4;

            angle =
              (arm / 4) * Math.PI * 2 +
              radius * 0.72 +
              (r4 + r5 + r6 - 1.5) * 0.35;
          } else {
            // Stars between spiral arms
            angle = r4 * Math.PI * 2;
          }
        }

        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;

        const thickness = 0.07 + 0.45 * Math.exp(-radius * 1.2);

        z = (r5 + r6 + r7 - 1.5) * thickness;

        const orbitalVelocity = 0.22 * (1 - Math.exp(-radius / 0.8));

        speed = orbitalVelocity / Math.max(radius, 0.25);

        const outerBlend = smooth(0.7, 4.4, radius);

        color = gold.clone().lerp(neutral, outerBlend * 0.75);

        if (armStar && r6 > 0.48) {
          color.lerp(blue, 0.55);
        }

        if (r7 > 0.93) {
          color.lerp(cream, 0.65);
        }
      } else if (type === "elliptical") {
        radius = Math.pow(r1, 2.1) * 4.7;

        const theta = r2 * Math.PI * 2;
        const zz = r3 * 2 - 1;
        const rr = Math.sqrt(1 - zz * zz);

        x = radius * rr * Math.cos(theta);
        y = radius * rr * Math.sin(theta) * 0.75;
        z = radius * zz * 0.55;

        color = gold.clone().lerp(cream, r4 * 0.55);
      } else {
        const cluster = i % 6;
        const a = (cluster * Math.PI * 2) / 6;

        x = Math.cos(a) * (0.8 + cluster * 0.3) + (r1 + r2 + r3 - 1.5) * 1.9;

        y = Math.sin(a) * (0.7 + cluster * 0.2) + (r3 + r4 + r5 - 1.5) * 1.6;

        z = (r5 + r6 + r7 - 1.5) * 0.8;

        color = neutral.clone().lerp(blue, r6 * 0.6);
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      radii[i] = radius;
      angles[i] = angle;
      speeds[i] = speed;

      sizes[i] = 0.8 + Math.pow(r5, 5) * 5.5;
      brightness[i] = 0.25 + Math.pow(r7, 2) * 1.1;
    }

    return {
      positions,
      colors,
      sizes,
      radii,
      angles,
      speeds,
      brightness,
    };
  }, [type, seed, count, barred]);

  useFrame(() => {
    const group = groupRef.current;
    const material = materialRef.current;

    if (!group || !material) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const reveal = smooth(0.05, 0.3, p);
    const fade = 1 - smooth(0.9, 1, p);

    material.uniforms.uTime.value = p * 12;
    material.uniforms.uOpacity.value = reveal * fade * 0.9;

    group.scale.setScalar(scale * (0.6 + reveal * 0.4));
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <GalaxyCore
        progress={progress}
        size={type === "elliptical" ? 5 : 3.4}
        color={type === "irregular" ? "#aabbd9" : "#f4d3a1"}
      />

      <GalaxyNebula progress={progress} type={type} seed={seed} />

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
          />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
          <bufferAttribute attach="attributes-aRadius" args={[data.radii, 1]} />
          <bufferAttribute attach="attributes-aAngle" args={[data.angles, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[data.speeds, 1]} />
          <bufferAttribute
            attach="attributes-aBrightness"
            args={[data.brightness, 1]}
          />
        </bufferGeometry>

        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uOpacity: { value: 0 },
            uPixelRatio: { value: 1 },
            uSpiral: { value: type === "spiral" ? 1 : 0 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
