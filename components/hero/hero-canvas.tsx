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
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.6}>
      <MeshDistortMaterial
        color="#ff4d2e"
        distort={0.5}
        speed={1.6}
        roughness={0.2}
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
      // Cap dpr at 1.5 — at 2 the distort shader runs 4x the pixels on retina.
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 5]} intensity={1.4} />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#ffffff" />
      <Blob />
    </Canvas>
  );
}
