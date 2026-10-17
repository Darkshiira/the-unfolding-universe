"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type GalaxyCoreProps = {
  progress: React.RefObject<number>;
  size?: number;
  color?: string;
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uOpacity;
  uniform vec3 uColor;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;
    float d = length(uv);

    float core = exp(-d * d * 150.0);
    float glow = exp(-d * d * 22.0);
    float halo = exp(-d * d * 7.0);

    vec3 color =
      vec3(1.0, 0.97, 0.9) * core * 1.7 +
      uColor * glow * 0.75 +
      uColor * halo * 0.12;

    float alpha =
      (core + glow * 0.55 + halo * 0.08) *
      uOpacity;

    gl_FragColor = vec4(
      color,
      clamp(alpha, 0.0, 1.0)
    );
  }
`;

export default function GalaxyCore({
  progress,
  size = 5,
  color = "#ffc785",
}: GalaxyCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    const reveal = THREE.MathUtils.smoothstep(p, 0.05, 0.3);

    const fade = 1 - THREE.MathUtils.smoothstep(p, 0.88, 1);

    material.uniforms.uOpacity.value = reveal * fade * 0.38;

    // Billboard: face camera
    mesh.quaternion.copy(state.camera.quaternion);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.05]}>
      <planeGeometry args={[size, size]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uOpacity: { value: 0 },
          uColor: {
            value: new THREE.Color(color),
          },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
