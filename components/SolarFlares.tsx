"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SUN_RADIUS = 1.8;
const PROMINENCES = 9;
const FILAMENTS = 24;
const SEGMENTS = 65;
const PARTICLES = 1100;

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Prominence = {
  center: THREE.Vector3;
  tangent: THREE.Vector3;
  bitangent: THREE.Vector3;
  width: number;
  height: number;
  phase: number;
};

function createProminences(): Prominence[] {
  return Array.from({ length: PROMINENCES }, (_, i) => {
    const longitude = random(i * 17 + 1) * Math.PI * 2;
    const latitude = (random(i * 17 + 2) - 0.5) * Math.PI * 0.75;

    const center = new THREE.Vector3(
      Math.cos(latitude) * Math.cos(longitude),
      Math.sin(latitude),
      Math.cos(latitude) * Math.sin(longitude),
    ).normalize();

    const tangent = new THREE.Vector3().crossVectors(
      center,
      new THREE.Vector3(0, 1, 0),
    );

    if (tangent.lengthSq() < 0.001) {
      tangent.set(1, 0, 0);
    }

    tangent.normalize();

    const bitangent = new THREE.Vector3()
      .crossVectors(center, tangent)
      .normalize();

    return {
      center,
      tangent,
      bitangent,
      width: 0.16 + random(i * 17 + 3) * 0.32,
      height: 0.2 + random(i * 17 + 4) * 0.72,
      phase: random(i * 17 + 5) * Math.PI * 2,
    };
  });
}

const filamentVertex = `
  attribute float aAlpha;
  attribute float aHeat;

  varying float vAlpha;
  varying float vHeat;

  void main() {
    vAlpha = aAlpha;
    vHeat = aHeat;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const filamentFragment = `
  varying float vAlpha;
  varying float vHeat;

  void main() {
    vec3 orange = vec3(1.0, 0.27, 0.045);
    vec3 gold = vec3(1.0, 0.65, 0.19);
    vec3 white = vec3(1.0, 0.95, 0.73);

    vec3 color = mix(
      orange,
      gold,
      smoothstep(0.0, 0.65, vHeat)
    );

    color = mix(
      color,
      white,
      smoothstep(0.7, 1.0, vHeat)
    );

    gl_FragColor = vec4(
      color,
      vAlpha
    );
  }
`;

const particleVertex = `
  attribute float aSize;
  attribute float aAlpha;

  varying float vAlpha;

  void main() {
    vec4 mv =
      modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mv;

    gl_PointSize = clamp(
      aSize * 90.0 / max(0.5, -mv.z),
      1.0,
      16.0
    );

    vAlpha = aAlpha;
  }
`;

const particleFragment = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);

    // Soft round glow instead of square pixels.
    float core = exp(-r * r * 55.0);
    float halo = exp(-r * r * 11.0);

    float alpha =
      (core * 0.8 + halo * 0.25) * vAlpha;

    gl_FragColor = vec4(
      vec3(1.0, 0.72, 0.32),
      alpha
    );
  }
`;

export default function SolarFlares() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const prominences = useMemo(() => createProminences(), []);

  const lineData = useMemo(() => {
    const count = PROMINENCES * FILAMENTS * SEGMENTS * 2;

    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const heats = new Float32Array(count);

    return { positions, alphas, heats };
  }, []);

  const particleData = useMemo(() => {
    return {
      positions: new Float32Array(PARTICLES * 3),
      sizes: new Float32Array(PARTICLES),
      alphas: new Float32Array(PARTICLES),
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    const lines = linesRef.current;
    const particles = particlesRef.current;

    if (!lines || !particles) return;

    const linePosition = lines.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    const lineAlpha = lines.geometry.getAttribute(
      "aAlpha",
    ) as THREE.BufferAttribute;

    const lineHeat = lines.geometry.getAttribute(
      "aHeat",
    ) as THREE.BufferAttribute;

    let index = 0;

    const point = new THREE.Vector3();
    const previous = new THREE.Vector3();

    function filamentPoint(
      prominence: Prominence,
      filament: number,
      t: number,
      out: THREE.Vector3,
    ) {
      const spread = filament / (FILAMENTS - 1) - 0.5;

      const width = prominence.width * (1 + spread * 0.3);

      const arch = Math.sin(t * Math.PI);

      const height = prominence.height * (1 + spread * 0.25) * arch;

      const sideways = (t - 0.5) * width * 2;

      // Organic twisting and turbulence
      const twist =
        Math.sin(
          t * Math.PI * 3.0 + prominence.phase + time * 0.45 + filament * 0.17,
        ) *
        arch *
        0.075;

      const flutter =
        Math.sin(t * 17.0 + time * 0.7 + filament * 1.3) * arch * 0.025;

      out
        .copy(prominence.center)
        .multiplyScalar(SUN_RADIUS + height)
        .addScaledVector(prominence.tangent, sideways + twist)
        .addScaledVector(prominence.bitangent, spread * 0.085 + flutter);
    }

    for (let i = 0; i < PROMINENCES; i++) {
      const prominence = prominences[i];

      for (let f = 0; f < FILAMENTS; f++) {
        for (let s = 0; s < SEGMENTS; s++) {
          const t0 = s / SEGMENTS;
          const t1 = (s + 1) / SEGMENTS;

          filamentPoint(prominence, f, t0, previous);

          filamentPoint(prominence, f, t1, point);

          const alpha0 = Math.pow(Math.sin(t0 * Math.PI), 0.6);

          const alpha1 = Math.pow(Math.sin(t1 * Math.PI), 0.6);

          const pulse = 0.55 + 0.45 * Math.sin(time * 0.9 + i * 1.7 + f * 0.13);

          const intensity = 0.025 + pulse * 0.065;

          linePosition.setXYZ(index, previous.x, previous.y, previous.z);
          lineAlpha.setX(index, alpha0 * intensity);
          lineHeat.setX(index, 0.35 + random(f * 11 + i) * 0.6);
          index++;

          linePosition.setXYZ(index, point.x, point.y, point.z);
          lineAlpha.setX(index, alpha1 * intensity);
          lineHeat.setX(index, 0.35 + random(f * 11 + i) * 0.6);
          index++;
        }
      }
    }

    linePosition.needsUpdate = true;
    lineAlpha.needsUpdate = true;
    lineHeat.needsUpdate = true;

    const particlePosition = particles.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    const particleSize = particles.geometry.getAttribute(
      "aSize",
    ) as THREE.BufferAttribute;

    const particleAlpha = particles.geometry.getAttribute(
      "aAlpha",
    ) as THREE.BufferAttribute;

    for (let i = 0; i < PARTICLES; i++) {
      const prominence = prominences[i % PROMINENCES];

      const filament = i % FILAMENTS;

      const speed = 0.035 + random(i * 13 + 1) * 0.06;

      const t = (random(i * 13 + 2) + time * speed) % 1;

      filamentPoint(prominence, filament, t, point);

      particlePosition.setXYZ(i, point.x, point.y, point.z);

      particleSize.setX(i, 0.025 + random(i * 13 + 3) * 0.04);

      particleAlpha.setX(i, Math.pow(Math.sin(t * Math.PI), 1.2) * 0.45);
    }

    particlePosition.needsUpdate = true;
    particleSize.needsUpdate = true;
    particleAlpha.needsUpdate = true;
  });

  return (
    <group>
      {/* Thousands of fine plasma filaments */}
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lineData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aAlpha"
            args={[lineData.alphas, 1]}
          />
          <bufferAttribute
            attach="attributes-aHeat"
            args={[lineData.heats, 1]}
          />
        </bufferGeometry>

        <shaderMaterial
          vertexShader={filamentVertex}
          fragmentShader={filamentFragment}
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>

      {/* Soft glowing plasma particles */}
      <points ref={particlesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[particleData.sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-aAlpha"
            args={[particleData.alphas, 1]}
          />
        </bufferGeometry>

        <shaderMaterial
          vertexShader={particleVertex}
          fragmentShader={particleFragment}
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
