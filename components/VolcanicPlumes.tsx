"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  radius?: number;
};

const ERUPTIONS = 9;
const PARTICLES_PER_ERUPTION = 160;
const COUNT = ERUPTIONS * PARTICLES_PER_ERUPTION;

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mv;

    gl_PointSize = clamp(
      aSize * 90.0 / max(0.3, -mv.z),
      1.0,
      45.0
    );

    vColor = color;
    vAlpha = aAlpha;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);

    float cloud = 1.0 -
      smoothstep(0.22, 0.5, r);

    float wisps =
      0.85 +
      0.15 * sin(
        uv.x * 19.0 +
        uv.y * 13.0
      );

    float alpha = cloud * wisps * vAlpha;

    if (alpha < 0.005) discard;

    gl_FragColor = vec4(
      vColor,
      alpha
    );
  }
`;

export default function VolcanicPlumes({ radius = 0.55 }: Props) {
  const pointsRef = useRef<THREE.Points>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);

    const directions: THREE.Vector3[] = [];
    const tangentA: THREE.Vector3[] = [];
    const tangentB: THREE.Vector3[] = [];

    // Deterministic eruption locations
    for (let i = 0; i < ERUPTIONS; i++) {
      const theta = random(i * 19 + 1) * Math.PI * 2;
      const y = random(i * 19 + 2) * 1.7 - 0.85;
      const horizontal = Math.sqrt(1 - y * y);

      const normal = new THREE.Vector3(
        Math.cos(theta) * horizontal,
        y,
        Math.sin(theta) * horizontal,
      ).normalize();

      const tangent = new THREE.Vector3().crossVectors(
        normal,
        new THREE.Vector3(0, 1, 0),
      );

      if (tangent.lengthSq() < 0.001) {
        tangent.set(1, 0, 0);
      }

      tangent.normalize();

      const bitangent = new THREE.Vector3()
        .crossVectors(normal, tangent)
        .normalize();

      directions.push(normal);
      tangentA.push(tangent);
      tangentB.push(bitangent);
    }

    for (let i = 0; i < COUNT; i++) {
      const n = i * 23 + 31;
      const hot = random(n + 1) > 0.83;

      const color = new THREE.Color(
        hot ? "#ff8c36" : random(n + 2) > 0.5 ? "#514443" : "#292b31",
      );

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = hot
        ? 0.015 + random(n + 3) * 0.018
        : 0.04 + random(n + 3) * 0.065;

      alphas[i] = 0;
    }

    return {
      positions,
      colors,
      sizes,
      alphas,
      directions,
      tangentA,
      tangentB,
    };
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const time = state.clock.elapsedTime;

    const positionAttribute = points.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    const alphaAttribute = points.geometry.getAttribute(
      "aAlpha",
    ) as THREE.BufferAttribute;

    const normal = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const bitangent = new THREE.Vector3();
    const position = new THREE.Vector3();

    for (let i = 0; i < COUNT; i++) {
      const eruption = Math.floor(i / PARTICLES_PER_ERUPTION);

      const n = i * 23 + 31;

      const phase = random(n + 4);
      const speed = 0.11 + random(n + 5) * 0.11;

      // Each particle repeats its own eruption cycle.
      const age = (time * speed + phase + eruption * 0.13) % 1;

      normal.copy(data.directions[eruption]);
      tangent.copy(data.tangentA[eruption]);
      bitangent.copy(data.tangentB[eruption]);

      const height = age * (0.18 + random(n + 6) * 0.34);

      // Smoke expands as it rises.
      const spread = 0.012 + age * age * 0.15;

      const angle = random(n + 7) * Math.PI * 2 + age * 2.5;

      const sideways = Math.sqrt(random(n + 8)) * spread;

      position
        .copy(normal)
        .multiplyScalar(radius + height)
        .addScaledVector(tangent, Math.cos(angle) * sideways)
        .addScaledVector(bitangent, Math.sin(angle) * sideways);

      // Slow sideways drift of the plume.
      position.addScaledVector(
        tangent,
        Math.sin(time * 0.3 + eruption) * age * 0.035,
      );

      positionAttribute.setXYZ(i, position.x, position.y, position.z);

      const fadeIn = Math.min(1, age * 9);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(age, 0.55, 1);

      const hot = random(n + 1) > 0.83;

      alphaAttribute.setX(i, fadeIn * fadeOut * (hot ? 0.85 : 0.24));
    }

    positionAttribute.needsUpdate = true;
    alphaAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[data.alphas, 1]} />
      </bufferGeometry>

      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        vertexColors
        depthWrite={false}
        depthTest
        blending={THREE.NormalBlending}
        toneMapped={false}
      />
    </points>
  );
}
