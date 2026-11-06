"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

type Props = {
  target: [number, number, number];
  onArrive: () => void;
  duration?: number;
};

type CameraSnapshot = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number | null;
};

export default function ProteinNucleusApproach({
  target,
  onArrive,
  duration = 4.6,
}: Props) {
  const getThree = useThree((state) => state.get);

  const elapsed = useRef(0);
  const finished = useRef(false);

  const original = useRef<CameraSnapshot | null>(null);

  const destination = useRef(new THREE.Vector3());

  const focus = useRef(new THREE.Vector3(target[0], target[1], target[2]));

  const onArriveRef = useRef(onArrive);

  useEffect(() => {
    onArriveRef.current = onArrive;
  }, [onArrive]);

  // Restore the camera when the approach component unmounts.
  useEffect(() => {
    return () => {
      const snapshot = original.current;
      if (!snapshot) return;

      const state = getThree();
      const camera = state.camera;
      const controls = state.controls as OrbitControlsImpl | null;

      camera.position.copy(snapshot.position);

      if (camera instanceof THREE.PerspectiveCamera && snapshot.fov !== null) {
        camera.fov = snapshot.fov;
        camera.updateProjectionMatrix();
      }

      if (controls) {
        controls.target.copy(snapshot.target);
        controls.enabled = true;
        controls.update();
      }
    };
  }, [getThree]);

  useFrame((state, delta) => {
    const camera = state.camera;
    const controls = state.controls as OrbitControlsImpl | null;

    if (!controls || finished.current) return;

    // Save the original camera position once.
    if (!original.current) {
      original.current = {
        position: camera.position.clone(),
        target: controls.target.clone(),
        fov: camera instanceof THREE.PerspectiveCamera ? camera.fov : null,
      };

      controls.enabled = false;

      // Approach the nucleus from the current viewing direction.
      const direction = camera.position.clone().sub(focus.current);

      if (direction.lengthSq() < 0.000001) {
        direction.set(0, 0, 1);
      }

      direction.normalize();

      destination.current.copy(focus.current).addScaledVector(direction, 0.88);
    }

    const snapshot = original.current;
    if (!snapshot) return;

    elapsed.current = Math.min(
      duration,
      elapsed.current + Math.min(delta, 0.05),
    );

    const t = duration > 0 ? Math.min(1, elapsed.current / duration) : 1;

    // Smooth cinematic ease-in/ease-out.
    const smooth = t * t * (3 - 2 * t);

    camera.position.copy(snapshot.position).lerp(destination.current, smooth);

    controls.target.copy(snapshot.target).lerp(focus.current, smooth);

    camera.lookAt(controls.target);

    if (camera instanceof THREE.PerspectiveCamera && snapshot.fov !== null) {
      camera.fov = THREE.MathUtils.lerp(snapshot.fov, 47, smooth);

      camera.updateProjectionMatrix();
    }

    if (t >= 1) {
      finished.current = true;
      onArriveRef.current();
    }
  });

  return null;
}
