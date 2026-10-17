"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
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
  uniform float uProgress;

  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(
      sin(dot(p, vec2(127.1, 311.7))) *
      43758.5453
    );
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));

    return mix(
      mix(a, b, f.x),
      mix(c, d, f.x),
      f.y
    );
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;

    float r = length(p);
    float angle = atan(p.y, p.x);

    float progress = uProgress;

    // Rotating spiral pattern
    float spin = progress * 2.0;

    float spiral =
      sin(angle * 4.0 - r * 28.0 + spin);

    float secondary =
      sin(angle * 7.0 - r * 42.0 - spin * 0.4);

    float turbulence =
      smoothNoise(p * 13.0 + spin * 0.2);

    float density =
      0.45 +
      spiral * 0.20 +
      secondary * 0.10 +
      turbulence * 0.30;

    // Multiple dusty rings
    float rings =
      sin(r * 65.0 + spiral * 2.0) * 0.12;

    density += rings;

    // Central gap around the Sun
    float innerMask =
      smoothstep(0.075, 0.13, r);

    // Soft outer edge
    float outerMask =
      1.0 - smoothstep(0.68, 0.98, r);

    float mask = innerMask * outerMask;

    float heat =
      1.0 - smoothstep(0.12, 0.85, r);

    vec3 coolGas = vec3(0.20, 0.27, 0.43);
    vec3 warmGas = vec3(0.85, 0.42, 0.13);
    vec3 brightGas = vec3(1.0, 0.77, 0.38);

    vec3 color = mix(coolGas, warmGas, heat);
    color = mix(
      color,
      brightGas,
      pow(heat, 4.0) * 0.5
    );

    float reveal =
      smoothstep(0.12, 0.29, progress);

    float fade =
      1.0 - smoothstep(0.58, 0.81, progress);

    float alpha =
      density *
      mask *
      reveal *
      fade *
      0.38;

    if (alpha < 0.002) discard;

    gl_FragColor = vec4(
      color,
      clamp(alpha, 0.0, 0.5)
    );
  }
`;

export default function ProtoplanetaryGas({ progress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uProgress.value = THREE.MathUtils.clamp(
      progress.current,
      0,
      1,
    );
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[52, 52]} />

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uProgress: { value: 0 },
        }}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
