"use client";

import SolarFlares from "./SolarFlares";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vPosition = position;

    vec4 viewPosition =
      modelViewMatrix * vec4(position, 1.0);

    vViewPosition = viewPosition.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position =
      projectionMatrix * viewPosition;
  }
`;

const noiseFunctions = `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z *
      (p.x + p.y + p.z));
  }

  float noise3(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)),
            hash(i + vec3(1,1,0)), f.x),
        f.y
      ),
      mix(
        mix(hash(i + vec3(0,0,1)),
            hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)),
            hash(i + vec3(1,1,1)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise3(p);
      p = p * 2.03 + 7.1;
      amplitude *= 0.5;
    }

    return value;
  }
`;

const surfaceFragment = `
  uniform float uTime;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  ${noiseFunctions}

  void main() {
    vec3 p = normalize(vPosition);

    
    // Large convection currents moving
    // across the solar surface
    vec3 flow = p * 5.0;

    float swirl = fbm(
      p * 3.0 + vec3(uTime * 0.12)
    );

    flow += vec3(
      sin(p.y * 7.0 + uTime * 0.35),
      cos(p.z * 6.0 - uTime * 0.28),
      sin(p.x * 8.0 + uTime * 0.24)
    ) * (0.35 + swirl * 0.4);

    flow += vec3(
      uTime * 0.13,
      -uTime * 0.09,
      uTime * 0.055
    );


    float large = fbm(flow);
    float fine = fbm(
      p * 34.0 +
      vec3(large * 4.0) +
      vec3(
        sin(uTime * 0.25),
        cos(uTime * 0.20),
        sin(uTime * 0.18)
      ) * 1.5
    );


    float turbulence =
      large * 0.56 + fine * 0.44;

    // Dark convection channels and bright cells
    float cells = smoothstep(
      0.31, 0.73, turbulence
    );

    vec3 darkPlasma = vec3(0.75, 0.14, 0.015);
    vec3 orange = vec3(1.0, 0.37, 0.045);
    vec3 gold = vec3(1.0, 0.71, 0.23);
    vec3 hot = vec3(1.0, 0.96, 0.77);

    vec3 color = mix(darkPlasma, orange, cells);
    color = mix(
      color, gold,
      smoothstep(0.45, 0.76, turbulence)
    );

    float hotCells = smoothstep(
      0.66, 0.87, fine
    );

    color = mix(color, hot, hotCells * 0.85);

    // Camera-facing rim enhancement
    vec3 viewDir = normalize(-vViewPosition);
    float rim = pow(
      1.0 - abs(dot(normalize(vNormal), viewDir)),
      2.0
    );

    color += vec3(0.38, 0.15, 0.025) * rim;

    gl_FragColor = vec4(color * 1.2, 1.0);
  }
`;

const coronaFragment = `
  uniform float uTime;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  ${noiseFunctions}

  void main() {
    vec3 p = normalize(vPosition);

    float variation = fbm(
      p * 9.0 + vec3(uTime * 0.025)
    );

    // Transparent near the center,
    // luminous around the silhouette
    float facing = abs(dot(
      normalize(vNormal),
      normalize(-vViewPosition)
    ));

    float rim = pow(1.0 - facing, 3.2);

    float alpha = rim *
      (0.14 + variation * 0.25);

    vec3 color = mix(
      vec3(1.0, 0.27, 0.035),
      vec3(1.0, 0.76, 0.28),
      variation
    );

    gl_FragColor = vec4(color, alpha);
  }
`;

function createGlowTexture() {
  const size = 256;
  const pixels = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x + 0.5 - size / 2) / (size / 2);
      const dy = (y + 0.5 - size / 2) / (size / 2);
      const r = Math.sqrt(dx * dx + dy * dy);

      const inner = Math.exp(-r * r * 13);
      const outer = Math.exp(-r * r * 3.5);

      const index = (y * size + x) * 4;

      pixels[index] = 255;
      pixels[index + 1] = 198;
      pixels[index + 2] = 104;
      pixels[index + 3] = Math.round(
        Math.min(1, inner * 0.75 + outer * 0.22) * 255,
      );
    }
  }

  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);

  texture.needsUpdate = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// function SolarProminences() {
//   const groupRef = useRef<THREE.Group>(null);

//   const arcs = useMemo(() => {
//     return Array.from({ length: 9 }, (_, i) => {
//       const angle = (i / 9) * Math.PI * 2;
//       const radius = 1.82;

//       const start = new THREE.Vector3(
//         Math.cos(angle) * radius,
//         Math.sin(angle) * radius,
//         0,
//       );

//       const endAngle = angle + 0.19 + (i % 3) * 0.07;

//       const end = new THREE.Vector3(
//         Math.cos(endAngle) * radius,
//         Math.sin(endAngle) * radius,
//         0,
//       );

//       const middle = new THREE.Vector3(
//         Math.cos((angle + endAngle) / 2) * (2.15 + (i % 3) * 0.18),
//         Math.sin((angle + endAngle) / 2) * (2.15 + (i % 3) * 0.18),
//         0,
//       );

//       const curve = new THREE.QuadraticBezierCurve3(start, middle, end);

//       return new THREE.TubeGeometry(
//         curve,
//         32,
//         0.012 + (i % 3) * 0.005,
//         5,
//         false,
//       );
//     });
//   }, []);

//   useEffect(() => {
//     return () => {
//       arcs.forEach((geometry) => geometry.dispose());
//     };
//   }, [arcs]);

//   useFrame((state) => {
//     const group = groupRef.current;
//     if (!group) return;

//     group.quaternion.copy(state.camera.quaternion);
//     group.rotation.z += 0.0002;
//   });

//   return (
//     <group ref={groupRef}>
//       {arcs.map((geometry, i) => (
//         <mesh key={i} geometry={geometry}>
//           <meshBasicMaterial
//             color={i % 3 === 0 ? "#ffb04c" : "#f36a24"}
//             transparent
//             opacity={0.22}
//             depthWrite={false}
//             blending={THREE.AdditiveBlending}
//             toneMapped={false}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }

export default function RadiantSun() {
  const surfaceRef = useRef<THREE.ShaderMaterial>(null);
  const coronaRef = useRef<THREE.ShaderMaterial>(null);

  const glowTexture = useMemo(() => createGlowTexture(), []);

  useEffect(() => {
    return () => glowTexture.dispose();
  }, [glowTexture]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (surfaceRef.current) {
      surfaceRef.current.uniforms.uTime.value = time;
    }

    if (coronaRef.current) {
      coronaRef.current.uniforms.uTime.value = time;
    }
  });

  return (
    <group>
      {/* Outer atmospheric light */}
      <sprite scale={[11, 11, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* Inner warm halo */}
      <sprite scale={[6, 6, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#ffb74c"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* Turbulent solar surface */}
      <mesh>
        <sphereGeometry args={[1.8, 128, 128]} />
        <shaderMaterial
          ref={surfaceRef}
          vertexShader={vertexShader}
          fragmentShader={surfaceFragment}
          uniforms={{ uTime: { value: 0 } }}
          toneMapped={false}
        />
      </mesh>

      {/* Transparent corona */}
      {/* <mesh>
        <sphereGeometry args={[2.05, 96, 96]} />
        <shaderMaterial
          ref={coronaRef}
          vertexShader={vertexShader}
          fragmentShader={coronaFragment}
          uniforms={{ uTime: { value: 0 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh> */}

      <SolarFlares />

      <pointLight color="#fff0c9" intensity={160} distance={110} decay={2} />
    </group>
  );
}
