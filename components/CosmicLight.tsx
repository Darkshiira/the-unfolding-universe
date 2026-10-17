"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type CosmicLightProps = {
  progress: React.RefObject<number>;
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
  uniform float uTime;
  uniform float uProgress;

  varying vec2 vUv;

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // Very subtle organic movement
    float pulse =
      1.0 +
      sin(uTime * 1.6) * 0.025;

    dist *= pulse;

    // White-hot center
    float core = exp(-dist * dist * 950.0);

    // Warm inner glow
    float innerGlow = exp(-dist * dist * 110.0);

    // Large atmospheric halo
    float outerGlow = exp(-dist * dist * 18.0);

    // Soft light extending into darkness
    float atmosphere = exp(-dist * dist * 5.0);

    vec3 coreColor = vec3(1.0, 0.98, 0.93);
    vec3 innerColor = vec3(1.0, 0.72, 0.35);
    vec3 outerColor = vec3(0.75, 0.32, 0.10);

    vec3 color =
      coreColor * core * 2.0 +
      innerColor * innerGlow * 0.8 +
      outerColor * outerGlow * 0.28 +
      outerColor * atmosphere * 0.04;

    // Brighten as the expansion begins
    float ignition = smoothstep(
      0.0,
      0.22,
      uProgress
    );

    color *= 1.0 + ignition * 2.5;

    // Dissolve as the universe expands
    float fade = 1.0 - smoothstep(
      0.18,
      0.55,
      uProgress
    );

    float alpha =
      (core * 1.4 +
       innerGlow * 0.8 +
       outerGlow * 0.25 +
       atmosphere * 0.04) * fade;

    gl_FragColor = vec4(
      color,
      clamp(alpha, 0.0, 1.0)
    );
  }
`;

export default function CosmicLight({ progress }: CosmicLightProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    // Update shader uniforms through the material ref
    material.uniforms.uTime.value = state.clock.elapsedTime;

    material.uniforms.uProgress.value = p;

    // Increase the size as the universe ignites
    const scale = 2.5 + Math.pow(p, 1.5) * 12;

    mesh.scale.setScalar(scale);

    // Keep the glowing plane facing the camera
    mesh.quaternion.copy(state.camera.quaternion);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.5]}>
      <planeGeometry args={[1, 1]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
