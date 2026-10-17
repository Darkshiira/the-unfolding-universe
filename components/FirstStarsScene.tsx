"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type SceneProps = {
  progress: React.RefObject<number>;
};

const STAR_COUNT = 850;
const DEBRIS_COUNT = 2200;

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function smooth(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

const starVertex = `
  attribute float aSize;
  attribute float aPhase;
  varying float vPhase;
  uniform float uTime;
  uniform float uReveal;

  void main() {
    vPhase = aPhase;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float twinkle = 0.9 + 0.1 * sin(uTime * 1.3 + aPhase * 15.0);
    gl_PointSize = min(75.0,
      aSize * twinkle * (35.0 / max(1.0, -mvPosition.z))
    ) * uReveal;
  }
`;

const starFragment = `
  varying float vPhase;
  uniform float uOpacity;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);

    float core = exp(-r * r * 180.0);
    float halo = exp(-r * r * 18.0);

    vec3 whiteBlue = vec3(0.72, 0.85, 1.0);
    vec3 warmWhite = vec3(1.0, 0.91, 0.76);

    vec3 tint = mix(whiteBlue, warmWhite, vPhase);
    vec3 color = tint * (core * 1.8 + halo * 0.5);

    float alpha = (core + halo * 0.45) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

function Stars({ progress }: SceneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const phases = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = (random(i * 7 + 1) - 0.5) * 65;
      positions[i * 3 + 1] = (random(i * 7 + 2) - 0.5) * 38;
      positions[i * 3 + 2] = -random(i * 7 + 3) * 35;

      sizes[i] = 2 + random(i * 7 + 4) * 8;
      phases[i] = random(i * 7 + 5);
    }

    return { positions, sizes, phases };
  }, []);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    const p = progress.current;
    const reveal = smooth(0.13, 0.48, p);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uReveal.value = reveal;
    material.uniforms.uOpacity.value = reveal * (1 - smooth(0.88, 1, p) * 0.45);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertex}
        fragmentShader={starFragment}
        uniforms={{
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uOpacity: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function Supernova({ progress }: SceneProps) {
  const shellRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const directions = useMemo(() => {
    const values = new Float32Array(DEBRIS_COUNT * 3);

    for (let i = 0; i < DEBRIS_COUNT; i++) {
      const theta = random(i * 3 + 50) * Math.PI * 2;
      const z = random(i * 3 + 51) * 2 - 1;
      const r = Math.sqrt(1 - z * z);

      values[i * 3] = r * Math.cos(theta);
      values[i * 3 + 1] = r * Math.sin(theta);
      values[i * 3 + 2] = z;
    }

    return values;
  }, []);

  const positions = useMemo(() => new Float32Array(DEBRIS_COUNT * 3), []);

  useFrame(() => {
    const shell = shellRef.current;
    const material = materialRef.current;
    if (!shell || !material) return;

    const p = progress.current;
    const explosion = smooth(0.73, 0.96, p);
    const radius = explosion * 13;

    const attribute = shell.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    for (let i = 0; i < DEBRIS_COUNT; i++) {
      const variation = 0.75 + random(i + 100) * 0.5;
      const distance = radius * variation;

      attribute.setXYZ(
        i,
        directions[i * 3] * distance,
        directions[i * 3 + 1] * distance,
        directions[i * 3 + 2] * distance,
      );
    }

    attribute.needsUpdate = true;

    material.opacity = smooth(0.72, 0.79, p) * (1 - smooth(0.9, 1, p) * 0.65);
  });

  return (
    <points ref={shellRef} position={[4, 1, -9]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffcc91"
        size={0.095}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function FirstStarsScene({ progress }: SceneProps) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 22],
        fov: 65,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#000000"]} />
      <Stars progress={progress} />
      <Supernova progress={progress} />
    </Canvas>
  );
}
