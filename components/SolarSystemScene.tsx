"use client";

import ProtoplanetaryGas from "./ProtoplanetaryGas";
import PlanetCollisions from "./PlanetCollisions";
import RadiantSun from "./RadiantSun";
import PrimordialEarth from "./PrimordialEarth";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  progress: React.RefObject<number>;
};

function smooth(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function random(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const PLANETS = [
  { name: "Mercury", orbit: 3.2, size: 0.14, color: "#a99d91" },
  { name: "Venus", orbit: 5.1, size: 0.34, color: "#d9b58c" },
  { name: "Earth", orbit: 7.2, size: 0.55, color: "#ab6650" },
  { name: "Mars", orbit: 9.5, size: 0.29, color: "#bd684c" },
  { name: "Jupiter", orbit: 13, size: 1.05, color: "#cda88c" },
  { name: "Saturn", orbit: 16, size: 0.86, color: "#d7c6a4" },
  { name: "Uranus", orbit: 19, size: 0.57, color: "#a4cbd1" },
  { name: "Neptune", orbit: 22, size: 0.54, color: "#658bc9" },
] as const;

// The planet positions are deliberately fixed at the end
// of formation so the camera can find Earth precisely.
function planetPosition(index: number, p: number) {
  const planet = PLANETS[index];
  const angle =
    index * 2.39996 + smooth(0.34, 0.76, p) * (0.65 / Math.sqrt(planet.orbit));

  return new THREE.Vector3(
    Math.cos(angle) * planet.orbit,
    0,
    Math.sin(angle) * planet.orbit,
  );
}

// --------------------------------------------------
// THE SUN
// --------------------------------------------------

// const sunVertex = `
//   varying vec3 vPosition;
//   varying vec3 vNormal;

//   void main() {
//     vPosition = position;
//     vNormal = normal;

//     gl_Position =
//       projectionMatrix *
//       modelViewMatrix *
//       vec4(position, 1.0);
//   }
// `;

// const sunFragment = `
//   uniform float uTime;

//   varying vec3 vPosition;
//   varying vec3 vNormal;

//   void main() {
//     vec3 p = normalize(vPosition);

//     float waves =
//       sin(p.x * 21.0 + uTime * 0.32) *
//       sin(p.y * 24.0 - uTime * 0.24);

//     float detail =
//       sin(p.z * 47.0 + p.y * 18.0 + uTime * 0.16) *
//       sin(p.x * 41.0 - uTime * 0.22);

//     float granulation =
//       waves * 0.28 + detail * 0.12;

//     float heat = clamp(
//       0.55 + granulation,
//       0.0,
//       1.0
//     );

//     vec3 deepOrange = vec3(0.95, 0.19, 0.025);
//     vec3 gold = vec3(1.0, 0.56, 0.11);
//     vec3 bright = vec3(1.0, 0.94, 0.62);

//     vec3 color = mix(deepOrange, gold, heat);
//     color = mix(
//       color,
//       bright,
//       smoothstep(0.62, 0.9, heat)
//     );

//     // Slight limb darkening at the edge
//     float facing = abs(dot(
//       normalize(vNormal),
//       vec3(0.0, 0.0, 1.0)
//     ));

//     color *= 0.82 + facing * 0.18;

//     gl_FragColor = vec4(color, 1.0);
//   }
// `;

// function Sun() {
//   const materialRef = useRef<THREE.ShaderMaterial>(null);
//   const haloRef = useRef<THREE.SpriteMaterial>(null);

//   const halo = useMemo(() => {
//     const size = 128;
//     const data = new Uint8Array(size * size * 4);

//     for (let y = 0; y < size; y++) {
//       for (let x = 0; x < size; x++) {
//         const dx = (x - size / 2) / (size / 2);
//         const dy = (y - size / 2) / (size / 2);
//         const r = Math.sqrt(dx * dx + dy * dy);

//         const index = (y * size + x) * 4;

//         data[index] = 255;
//         data[index + 1] = 156;
//         data[index + 2] = 58;
//         data[index + 3] = Math.round(Math.exp(-r * r * 6) * 255);
//       }
//     }

//     const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);

//     texture.needsUpdate = true;
//     return texture;
//   }, []);

//   useFrame((state) => {
//     if (materialRef.current) {
//       materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
//     }

//     if (haloRef.current) {
//       haloRef.current.opacity = 0.48;
//     }
//   });

//   return (
//     <group>
//       <mesh>
//         <sphereGeometry args={[1.8, 96, 96]} />
//         <shaderMaterial
//           ref={materialRef}
//           vertexShader={sunVertex}
//           fragmentShader={sunFragment}
//           uniforms={{ uTime: { value: 0 } }}
//           toneMapped={false}
//         />
//       </mesh>

//       <sprite scale={[8.8, 8.8, 1]}>
//         <spriteMaterial
//           ref={haloRef}
//           map={halo}
//           color="#ffad52"
//           transparent
//           depthWrite={false}
//           blending={THREE.AdditiveBlending}
//           toneMapped={false}
//         />
//       </sprite>

//       <pointLight color="#ffe6b9" intensity={120} distance={100} decay={2} />
//     </group>
//   );
// }

// --------------------------------------------------
// ACCRETION DISK
// --------------------------------------------------

const DUST_COUNT = 32000;

const dustVertex = `
  attribute float aRadius;
  attribute float aAngle;
  attribute float aHeight;
  attribute float aSize;
  attribute float aSeed;
  attribute float aPlanet;

  uniform float uProgress;
  uniform float uOpacity;

  varying float vOpacity;
  varying float vHeat;
  varying float vImpact;

  void main() {
    float p = uProgress;

    // ------------------------------------
    // 1. ORBITAL MOTION AROUND THE SUN
    // ------------------------------------

    float orbitalSpeed =
      2.2 / sqrt(max(aRadius, 1.0));

    float angle =
      aAngle +
      p * 17.0 * orbitalSpeed;

    // A slight radial ripple creates
    // layered, spiral-like dust structures.
    float spiralWave =
      sin(angle * 3.0 - aRadius * 1.7);

    float diskRadius =
      aRadius +
      spiralWave * 0.22;

    vec3 diskPos = vec3(
      cos(angle) * diskRadius,
      aHeight,
      sin(angle) * diskRadius
    );

    // ------------------------------------
    // 2. FIND THE FUTURE PLANET
    // ------------------------------------

    float planetOrbit = 3.2;

    if (aPlanet < 0.5) planetOrbit = 3.2;
    else if (aPlanet < 1.5) planetOrbit = 5.1;
    else if (aPlanet < 2.5) planetOrbit = 7.2;
    else if (aPlanet < 3.5) planetOrbit = 9.5;
    else if (aPlanet < 4.5) planetOrbit = 13.0;
    else if (aPlanet < 5.5) planetOrbit = 16.0;
    else if (aPlanet < 6.5) planetOrbit = 19.0;
    else planetOrbit = 22.0;

    float planetAngle =
      aPlanet * 2.39996 +
      smoothstep(0.34, 0.76, p) *
      (0.65 / sqrt(planetOrbit));

    vec3 planetCenter = vec3(
      cos(planetAngle) * planetOrbit,
      0.0,
      sin(planetAngle) * planetOrbit
    );

    // ------------------------------------
    // 3. FORMING A LOCAL ACCRETION SPIRAL
    // ------------------------------------

    // Each particle begins gathering at
    // a slightly different scroll position.
    float formationStart =
      0.38 + aSeed * 0.13;

    float gather = smoothstep(
      formationStart,
      formationStart + 0.25,
      p
    );

    // The dust initially orbits in a broad
    // cloud surrounding its future planet.
    float initialCloudRadius =
      0.8 + aSeed * 1.7;

    // Spiral tightens toward the planet.
    float contraction =
      pow(1.0 - gather, 1.8);

    float localRadius =
      initialCloudRadius * contraction;

    // Multiple turns around the planet
    // before material reaches the surface.
    float localAngle =
      aAngle +
      gather * 24.0 +
      aSeed * 6.28318;

    vec3 localSpiral = vec3(
      cos(localAngle) * localRadius,
      (aSeed - 0.5) *
        localRadius * 0.25,
      sin(localAngle) * localRadius
    );

    vec3 accretionPos =
      planetCenter + localSpiral;

    // ------------------------------------
    // 4. TRANSITION FROM DISK TO PLANET
    // ------------------------------------

    // Some dust continues in the disk;
    // some becomes part of the planets.
    float joinsPlanet = step(0.30, aSeed);

    float blend =
      gather * joinsPlanet;

    vec3 finalPos = mix(
      diskPos,
      accretionPos,
      blend
    );

    // ------------------------------------
    // 5. PARTICLE SIZE AND BRIGHTNESS
    // ------------------------------------

    vec4 mv = modelViewMatrix *
      vec4(finalPos, 1.0);

    gl_Position =
      projectionMatrix * mv;

    gl_PointSize = clamp(
      aSize * 44.0 / max(1.0, -mv.z),
      0.5,
      8.0
    );

    // Remaining disk gradually disappears.
    float diskFade =
      1.0 - smoothstep(0.63, 0.82, p);

    // Accreting dust stays visible longer,
    // then vanishes into the growing planet.
    float accretionFade =
      1.0 - smoothstep(0.72, 0.85, p);

    vOpacity =
      uOpacity *
      mix(diskFade, accretionFade, joinsPlanet);

    vHeat =
      1.0 - smoothstep(3.0, 22.0, aRadius);

    // Brighter particles near impact.
    vImpact = gather * joinsPlanet *
      (1.0 - smoothstep(0.8, 1.0, gather));
  }
`;

const dustFragment = `
  varying float vOpacity;
  varying float vHeat;
  varying float vImpact;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);

    float core = exp(-r * r * 150.0);
    float halo = exp(-r * r * 20.0);

    vec3 coolDust = vec3(0.42, 0.55, 0.76);
    vec3 warmDust = vec3(1.0, 0.59, 0.23);
    vec3 hotDust = vec3(1.0, 0.92, 0.65);

    vec3 color = mix(
      coolDust,
      warmDust,
      vHeat
    );

    // Dust glows more intensely while
    // gathering into a forming planet.
    color = mix(
      color,
      hotDust,
      vImpact * 0.75
    );

    float brightness =
      core * 1.2 +
      halo * 0.22;

    brightness *=
      1.0 + vImpact * 1.5;

    gl_FragColor = vec4(
      color * brightness,
      clamp(
        (core + halo * 0.25) *
        vOpacity *
        (1.0 + vImpact),
        0.0,
        1.0
      )
    );
  }
`;

function AccretionDisk({ progress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const radii = new Float32Array(DUST_COUNT);
    const angles = new Float32Array(DUST_COUNT);
    const heights = new Float32Array(DUST_COUNT);
    const sizes = new Float32Array(DUST_COUNT);
    const seeds = new Float32Array(DUST_COUNT);
    const planetIndices = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      const n = i * 17 + 19;

      const r1 = random(n + 1);
      const r2 = random(n + 2);
      const r3 = random(n + 3);
      const r4 = random(n + 4);
      const r5 = random(n + 5);

      const planetIndex = i % PLANETS.length;

      // A mix of continuous disk dust and denser
      // material near future planetary orbits.
      const radius =
        r5 < 0.58
          ? PLANETS[planetIndex].orbit + (r1 - 0.5) * 2.5
          : 2.3 + Math.sqrt(r1) * 21;

      const angle = r2 * Math.PI * 2;
      const height = (r3 - 0.5) * 0.32;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      radii[i] = radius;
      angles[i] = angle;
      heights[i] = height;
      sizes[i] = 1.0 + Math.pow(r4, 5) * 4;
      seeds[i] = r5;
      planetIndices[i] = planetIndex;
    }

    return {
      positions,
      radii,
      angles,
      heights,
      sizes,
      seeds,
      planetIndices,
    };
  }, []);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    material.uniforms.uProgress.value = p;
    material.uniforms.uOpacity.value = smooth(0.12, 0.28, p) * 0.9;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute attach="attributes-aRadius" args={[data.radii, 1]} />
        <bufferAttribute attach="attributes-aAngle" args={[data.angles, 1]} />
        <bufferAttribute attach="attributes-aHeight" args={[data.heights, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
        <bufferAttribute
          attach="attributes-aPlanet"
          args={[data.planetIndices, 1]}
        />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={{
          uProgress: { value: 0 },
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

// --------------------------------------------------
// THE YOUNG EARTH
// --------------------------------------------------

// const earthVertex = `
//   varying vec3 vPosition;
//   varying vec3 vNormal;

//   void main() {
//     vPosition = position;
//     vNormal = normalize(normalMatrix * normal);

//     gl_Position =
//       projectionMatrix *
//       modelViewMatrix *
//       vec4(position, 1.0);
//   }
// `;

// const earthFragment = `
//   varying vec3 vPosition;
//   varying vec3 vNormal;

//   void main() {
//     vec3 p = normalize(vPosition);

//     float large =
//       sin(p.x * 9.0 + sin(p.z * 6.0)) *
//       sin(p.y * 11.0 - p.x * 5.0);

//     float detail =
//       sin(p.x * 39.0 + p.z * 15.0) *
//       sin(p.y * 35.0 - p.z * 18.0);

//     float terrain =
//       large * 0.7 + detail * 0.3;

//     float lava =
//       1.0 - smoothstep(-0.15, 0.18, terrain);

//     vec3 darkRock = vec3(0.09, 0.07, 0.075);
//     vec3 warmRock = vec3(0.34, 0.20, 0.14);
//     vec3 molten = vec3(1.0, 0.27, 0.025);

//     vec3 color = mix(
//       darkRock,
//       warmRock,
//       smoothstep(-0.4, 0.7, terrain)
//     );

//     color = mix(color, molten, lava * 0.85);

//     float illumination = 0.24 + 0.76 *
//       max(
//         dot(normalize(vNormal),
//         normalize(vec3(-0.6, 0.4, 0.7))),
//         0.0
//       );

//     color *= illumination;
//     color += molten * pow(lava, 3.0) * 0.25;

//     gl_FragColor = vec4(color, 1.0);
//   }
// `;

// --------------------------------------------------
// FORMING PLANETS
// --------------------------------------------------

function FormingPlanet({
  index,
  progress,
}: {
  index: number;
  progress: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const planet = PLANETS[index];
  const isEarth = planet.name === "Earth";

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    const start = 0.47 + index * 0.012;
    const growth = smooth(start, start + 0.27, p);

    const position = planetPosition(index, p);
    group.position.copy(position);

    group.visible = growth > 0.001;
    group.scale.setScalar(Math.max(0.001, growth));

    group.rotation.y = p * 0.4;

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = (1 - growth) * 0.45;
    }
  });

  
return (
  <group ref={groupRef} visible={false}>
    {isEarth ? (
      <PrimordialEarth radius={planet.size} />
    ) : (
      <mesh>
        <sphereGeometry
          args={[planet.size, 48, 48]}
        />
        <meshStandardMaterial
          ref={materialRef}
          color={planet.color}
          roughness={0.9}
          emissive="#ff6228"
          emissiveIntensity={0}
        />
      </mesh>
    )}

    {planet.name === "Saturn" && (
      <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
        <ringGeometry
          args={[
            planet.size * 1.4,
            planet.size * 2.2,
            96,
          ]}
        />
        <meshBasicMaterial
          color="#c5ad87"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    )}
  </group>
);
}

function PlanetFormation({ progress }: Props) {
  return (
    <>
      {PLANETS.map((planet, index) => (
        <FormingPlanet key={planet.name} index={index} progress={progress} />
      ))}
    </>
  );
}

function CameraJourney({ progress }: Props) {
  useFrame((state) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    // -----------------------------------------
    // STAGE 1: Begin with a small, distant Sun
    // -----------------------------------------

    const distantSun = new THREE.Vector3(0, 0.2, 32);

    // -----------------------------------------
    // STAGE 2: Zoom toward the Sun
    // -----------------------------------------

    const sunClose = new THREE.Vector3(0, 0.2, 5.8);

    // -----------------------------------------
    // STAGE 3: Pull back to reveal the disk
    // -----------------------------------------

    const diskView = new THREE.Vector3(0, 23, 36);

    // -----------------------------------------
    // STAGE 4: Show the forming solar system
    // -----------------------------------------

    const wideView = new THREE.Vector3(0, 31, 43);

    // -----------------------------------------
    // STAGE 5: Approach the young Earth
    // -----------------------------------------

    const earth = planetPosition(2, p);

    const earthClose = earth.clone().add(new THREE.Vector3(0.25, 0.35, 1.35));

    // -----------------------------------------
    // SCROLL TIMING
    // -----------------------------------------

    const zoomIn = smooth(0.0, 0.16, p);
    const zoomOut = smooth(0.18, 0.38, p);
    const widen = smooth(0.38, 0.6, p);
    const approachEarth = smooth(0.77, 1.0, p);

    // -----------------------------------------
    // CAMERA POSITION
    // -----------------------------------------

    const cameraPosition = distantSun
      .clone()
      .lerp(sunClose, zoomIn)
      .lerp(diskView, zoomOut)
      .lerp(wideView, widen)
      .lerp(earthClose, approachEarth);

    // -----------------------------------------
    // CAMERA TARGET
    // -----------------------------------------

    const target = new THREE.Vector3(0, 0, 0).lerp(earth, approachEarth);

    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(target);
  });

  return null;
}

// --------------------------------------------------
// FINAL SCENE
// --------------------------------------------------

export default function SolarSystemScene({ progress }: Props) {
  return (
    <Canvas
      camera={{
        position: [0, 0.2, 32],
        fov: 55,
        near: 0.05,
        far: 200,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#010208"]} />
      <ambientLight intensity={0.12} />

      <CameraJourney progress={progress} />

      <RadiantSun />

      {/* Soft glowing gas beneath the dust */}
      <ProtoplanetaryGas progress={progress} />

      {/* Existing swirling dust */}
      <AccretionDisk progress={progress} />

      {/* Growing planets */}
      <PlanetFormation progress={progress} />

      {/* New impact flashes and debris */}
      <PlanetCollisions progress={progress} />
    </Canvas>
  );
}
