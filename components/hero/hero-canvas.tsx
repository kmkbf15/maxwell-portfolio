"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ pointer, clock }) => {
    if (!meshRef.current) return;
    // Drift slowly + lean toward the cursor.
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.y * 0.3,
      0.05,
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      pointer.x * 0.3 + clock.elapsedTime * 0.08,
      0.05,
    );
  });

  return (
    <Sphere ref={meshRef} args={[1, 96, 96]} scale={2.6}>
      <MeshDistortMaterial
        color="#ff4d2e"
        distort={0.55}
        speed={2.2}
        roughness={0.15}
        metalness={0.1}
      />
    </Sphere>
  );
}

export function HeroCanvas() {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 5]} intensity={1.4} />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#ffffff" />
      <Blob />
    </Canvas>
  );
}
