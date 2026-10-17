"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  progress: React.RefObject<number>;
};

const GALAXY_COUNT = 2400;
const STAR_COUNT = 3300;

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const galaxyVertex = `
  attribute float aSize;
  attribute float aType;
  attribute float aSeed;
  attribute float aRotation;
  attribute vec3 aColor;
  attribute float aBrightness;

  uniform float uOpacity;

  varying float vType;
  varying float vSeed;
  varying float vRotation;
  varying vec3 vColor;
  varying float vBrightness;
  varying float vOpacity;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mv;

    gl_PointSize = clamp(
      aSize * (100.0 / max(1.0, -mv.z)),
      1.0,
      34.0
    );

    vType = aType;
    vSeed = aSeed;
    vRotation = aRotation;
    vColor = aColor;
    vBrightness = aBrightness;
    vOpacity = uOpacity;
  }
`;

const galaxyFragment = `
  varying float vType;
  varying float vSeed;
  varying float vRotation;
  varying vec3 vColor;
  varying float vBrightness;
  varying float vOpacity;

  float hash(vec2 p) {
    return fract(
      sin(dot(p, vec2(127.1, 311.7))) * 43758.5453
    );
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;

    float c = cos(vRotation);
    float s = sin(vRotation);

    uv = mat2(c, -s, s, c) * uv;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    float intensity = 0.0;

    if (vType < 0.42) {
      // Tiny spiral galaxy
      float arms = cos(angle * 2.0 - r * 19.0 + vSeed * 6.28);

      float disk = exp(-r * r * 24.0);
      float spiral = pow(max(0.0, arms), 3.0);

      float core = exp(-r * r * 130.0);

      intensity =
        disk * (0.3 + spiral * 0.7) +
        core * 0.9;

    } else if (vType < 0.82) {
      // Elliptical galaxy
      vec2 stretched = vec2(uv.x, uv.y * 1.5);

      float d = length(stretched);

      intensity =
        exp(-d * d * 26.0) * 0.7 +
        exp(-d * d * 140.0);

    } else {
      // Irregular galaxy
      float clump1 = exp(
        -length(uv - vec2(0.1, 0.05)) *
        length(uv - vec2(0.1, 0.05)) * 80.0
      );

      float clump2 = exp(
        -length(uv + vec2(0.12, 0.07)) *
        length(uv + vec2(0.12, 0.07)) * 100.0
      );

      float cloud = exp(-r * r * 22.0);

      intensity =
        clump1 * 0.7 +
        clump2 * 0.8 +
        cloud * 0.25;
    }

    // Subtle grain and texture
    float grain = 0.85 + hash(
      floor(gl_PointCoord.xy * 2.0) + vSeed * 50.0
    ) * 0.3;

    intensity *= grain;

    float alpha =
      intensity * vBrightness * vOpacity;

    if (alpha < 0.005) discard;

    gl_FragColor = vec4(
      vColor * intensity,
      clamp(alpha, 0.0, 1.0)
    );
  }
`;

const starVertex = `
  attribute float aSize;
  attribute float aBrightness;
  attribute vec3 aColor;

  uniform float uOpacity;

  varying vec3 vColor;
  varying float vBrightness;
  varying float vOpacity;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mv;

    gl_PointSize = clamp(
      aSize * (100.0 / max(1.0, -mv.z)),
      0.8,
      5.0
    );

    vColor = aColor;
    vBrightness = aBrightness;
    vOpacity = uOpacity;
  }
`;

const starFragment = `
  varying vec3 vColor;
  varying float vBrightness;
  varying float vOpacity;

  void main() {
    float r = length(gl_PointCoord - 0.5);

    float core = exp(-r * r * 200.0);
    float halo = exp(-r * r * 30.0) * 0.1;

    float alpha =
      (core + halo) * vBrightness * vOpacity;

    gl_FragColor = vec4(
      vColor,
      clamp(alpha, 0.0, 1.0)
    );
  }
`;

function DistantGalaxies({ progress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(GALAXY_COUNT * 3);
    const sizes = new Float32Array(GALAXY_COUNT);
    const types = new Float32Array(GALAXY_COUNT);
    const seeds = new Float32Array(GALAXY_COUNT);
    const rotations = new Float32Array(GALAXY_COUNT);
    const brightness = new Float32Array(GALAXY_COUNT);
    const colors = new Float32Array(GALAXY_COUNT * 3);

    const palette = [
      new THREE.Color("#ffe4b9"),
      new THREE.Color("#d9e4ff"),
      new THREE.Color("#e9bd9e"),
      new THREE.Color("#b4cfff"),
      new THREE.Color("#f3d6ce"),
      new THREE.Color("#fff4df"),
    ];

    for (let i = 0; i < GALAXY_COUNT; i++) {
      const n = i * 31 + 1000;

      const theta = random(n + 1) * Math.PI * 2;
      const z = random(n + 2) * 2 - 1;
      const r = Math.sqrt(1 - z * z);

      const distance = 105 + random(n + 3) * 40;

      positions[i * 3] = Math.cos(theta) * r * distance;

      positions[i * 3 + 1] = Math.sin(theta) * r * distance;

      positions[i * 3 + 2] = z * distance;

      const sizeRandom = random(n + 4);

      // Most galaxies tiny, a few more prominent
      sizes[i] = 3 + Math.pow(sizeRandom, 5) * 24;

      types[i] = random(n + 5);
      seeds[i] = random(n + 6);
      rotations[i] = random(n + 7) * Math.PI * 2;

      brightness[i] = 0.45 + Math.pow(random(n + 8), 2) * 1.2;

      const colorIndex = Math.floor(random(n + 9) * palette.length);

      const color = palette[colorIndex];

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return {
      positions,
      sizes,
      types,
      seeds,
      rotations,
      brightness,
      colors,
    };
  }, []);

  useFrame(() => {
    const material = materialRef.current;
    const group = groupRef.current;

    if (!material || !group) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    material.uniforms.uOpacity.value =
      THREE.MathUtils.smoothstep(p, 0.04, 0.25) * 1.05;

    group.rotation.y = p * 0.025;
    group.rotation.x = p * 0.01;
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
          />
          <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
          <bufferAttribute attach="attributes-aType" args={[data.types, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
          <bufferAttribute
            attach="attributes-aRotation"
            args={[data.rotations, 1]}
          />
          <bufferAttribute
            attach="attributes-aBrightness"
            args={[data.brightness, 1]}
          />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
        </bufferGeometry>

        <shaderMaterial
          ref={materialRef}
          vertexShader={galaxyVertex}
          fragmentShader={galaxyFragment}
          uniforms={{
            uOpacity: { value: 0 },
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

function BackgroundStars({ progress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const brightness = new Float32Array(STAR_COUNT);
    const colors = new Float32Array(STAR_COUNT * 3);

    const white = new THREE.Color("#e1e7f4");
    const warm = new THREE.Color("#ead6bd");
    const blue = new THREE.Color("#a9bfed");

    for (let i = 0; i < STAR_COUNT; i++) {
      const n = i * 23 + 101;

      const theta = random(n + 1) * Math.PI * 2;
      const z = random(n + 2) * 2 - 1;
      const r = Math.sqrt(1 - z * z);

      const distance = 95 + random(n + 3) * 25;

      positions[i * 3] = Math.cos(theta) * r * distance;

      positions[i * 3 + 1] = Math.sin(theta) * r * distance;

      positions[i * 3 + 2] = z * distance;

      const sizeRandom = random(n + 4);

      sizes[i] = 1.5 + Math.pow(sizeRandom, 5) * 5;

      brightness[i] = 0.3 + Math.pow(sizeRandom, 2) * 0.8;

      const color = sizeRandom < 0.2 ? warm : sizeRandom > 0.8 ? blue : white;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, sizes, brightness, colors };
  }, []);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    material.uniforms.uOpacity.value =
      THREE.MathUtils.smoothstep(p, 0.02, 0.2) * 0.75;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute
          attach="attributes-aBrightness"
          args={[data.brightness, 1]}
        />
        <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertex}
        fragmentShader={starFragment}
        uniforms={{
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

export default function DeepSpaceBackground({ progress }: Props) {
  return (
    <>
      <DistantGalaxies progress={progress} />
      <BackgroundStars progress={progress} />
    </>
  );
}
