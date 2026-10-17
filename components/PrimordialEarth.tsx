"use client";

import VolcanicPlumes from "./VolcanicPlumes";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  radius?: number;
};

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
    return fract(
      p.x * p.y * p.z * (p.x + p.y + p.z)
    );
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

    for (int i = 0; i < 6; i++) {
      value += noise3(p) * amplitude;
      p = p * 2.05 + 11.7;
      amplitude *= 0.5;
    }

    return value;
  }
`;

const earthFragment = `
  uniform float uTime;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  ${noiseFunctions}

  void main() {
    vec3 p = normalize(vPosition);

    // Warp the coordinates so fractures
    // don't form obvious repeating patterns.
    vec3 warp = vec3(
      fbm(p * 3.5),
      fbm(p * 3.5 + 17.0),
      fbm(p * 3.5 + 37.0)
    );

    
    // Slowly flowing molten regions
    float magmaFlow = fbm(
      p * 4.0 +
      vec3(
        uTime * 0.07,
        -uTime * 0.045,
        uTime * 0.035
      )
    );

    // Distort the terrain boundaries
    // so magma appears to creep and spread
    vec3 flowingWarp =
      warp +
      vec3(
        sin(uTime * 0.15 + p.y * 8.0),
        cos(uTime * 0.12 + p.z * 7.0),
        sin(uTime * 0.10 + p.x * 9.0)
      ) * 0.13;

    vec3 terrainPos =
      p * 5.5 +
      (flowingWarp - 0.5) * 2.8 +
      vec3(magmaFlow * 0.35);

    float continents = fbm(terrainPos);

    float detail = fbm(
      p * 28.0 +
      flowingWarp * 3.0 +
      vec3(
        uTime * 0.09,
        -uTime * 0.06,
        uTime * 0.04
      )
    );


    // Broad magma regions between dark crust.
    float magmaField =
      continents * 0.8 + detail * 0.2;

    float molten = 1.0 -
      smoothstep(0.40, 0.54, magmaField);

    // Thin incandescent fractures in the crust.
    float cracks =
      1.0 - smoothstep(
        0.008,
        0.038,
        abs(continents - 0.54)
      );

    float fissures = max(
      molten,
      cracks * 0.85
    );

    // Subtle thermal movement, not fast animation.
    float pulse =
      0.88 +
      0.12 * sin(
        uTime * 0.65 +
        detail * 13.0
      );

    vec3 blackRock = vec3(0.025, 0.024, 0.029);
    vec3 basalt = vec3(0.12, 0.09, 0.085);
    vec3 ash = vec3(0.25, 0.15, 0.12);

    vec3 crust = mix(
      blackRock,
      basalt,
      smoothstep(0.30, 0.75, detail)
    );

    crust = mix(
      crust,
      ash,
      smoothstep(0.64, 0.83, continents) * 0.45
    );

    vec3 deepLava = vec3(0.72, 0.07, 0.012);
    vec3 orangeLava = vec3(1.0, 0.32, 0.025);
    vec3 brightLava = vec3(1.0, 0.82, 0.28);

    
    float heatVariation = fbm(
      p * 19.0 +
      flowingWarp * 4.0 +
      vec3(
        uTime * 0.18,
        -uTime * 0.12,
        uTime * 0.08
      )
    );


    vec3 lava = mix(
      deepLava,
      orangeLava,
      smoothstep(0.25, 0.7, heatVariation)
    );

    lava = mix(
      lava,
      brightLava,
      pow(
        smoothstep(0.57, 0.84, heatVariation),
        2.0
      ) * 0.75
    );

    // Dark rock receives directional sunlight.
    vec3 N = normalize(vNormal);
    vec3 lightDirection = normalize(
      vec3(-0.65, 0.25, 0.7)
    );

    float diffuse = max(
      dot(N, lightDirection),
      0.0
    );

    float illumination =
      0.07 + diffuse * 0.75;

    vec3 color = crust * illumination;

    // Lava is emissive and remains visible
    // even on the planet's dark side.
    color = mix(
      color,
      lava * pulse * 1.3,
      clamp(fissures, 0.0, 1.0)
    );

    // Subtle reddish glow at the horizon.
    vec3 viewDirection =
      normalize(-vViewPosition);

    float rim = pow(
      1.0 - max(dot(N, viewDirection), 0.0),
      3.0
    );

    color += vec3(0.32, 0.075, 0.025) * rim;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const atmosphereFragment = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(-vViewPosition);

    float rim = pow(
      1.0 - max(dot(N, V), 0.0),
      4.0
    );

    vec3 color = vec3(0.85, 0.18, 0.055);

    gl_FragColor = vec4(
      color,
      rim * 0.32
    );
  }
`;

export default function PrimordialEarth({ radius = 0.55 }: Props) {
  const surfaceRef = useRef<THREE.ShaderMaterial>(null);
  const planetRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (surfaceRef.current) {
      surfaceRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.025;
    }
  });

  return (
    <group ref={planetRef}>
      {/* Dark crust and glowing magma */}
      <mesh>
        <sphereGeometry args={[radius, 128, 128]} />
        <shaderMaterial
          ref={surfaceRef}
          vertexShader={vertexShader}
          fragmentShader={earthFragment}
          uniforms={{ uTime: { value: 0 } }}
          toneMapped={false}
        />
      </mesh>

      {/* Hot, hazy atmosphere */}
      <mesh>
        <sphereGeometry args={[radius * 1.045, 96, 96]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={atmosphereFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
      <VolcanicPlumes radius={radius} />
    </group>
  );
}
