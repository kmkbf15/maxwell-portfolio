"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Reusable scratch objects — composing matrices fresh every frame inside a
// loop allocates garbage; reusing these avoids GC pauses.
const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();

// Camera parallax via a window-level pointer listener (R3F's built-in pointer
// only updates while the cursor is over the canvas — text overlays would
// freeze the parallax). framerate-independent damping keeps it smooth on
// any refresh rate.
function CameraRig() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, clock }, delta) => {
    const lerp = 1 - Math.pow(0.0001, delta);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      target.current.x * 1.3,
      lerp,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      target.current.y * 0.85,
      lerp,
    );
    // Continuous tiny dolly so the scene breathes even when the cursor is still.
    camera.position.z = 6 + Math.sin(clock.elapsedTime * 0.17) * 0.22;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Dust field: tiny bright spheres scattered in 3D, drift independently.
// Each one passes the bloom luminance threshold so they read as glowing
// fireflies, not flat dots. Single instanced draw call.
function DustField({ count = 90 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const seeds = useMemo(() => {
    const arr: {
      x: number; y: number; z: number;
      scale: number; offset: number; speed: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi) - 4,
        scale: 0.018 + Math.random() * 0.04,
        offset: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
      });
    }
    return arr;
  }, [count]);

  const matrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      _v.set(
        s.x + Math.sin(t * 0.1 * s.speed + s.offset) * 0.3,
        s.y + Math.cos(t * 0.12 * s.speed + s.offset) * 0.3,
        s.z,
      );
      _q.identity();
      _s.setScalar(s.scale);
      matrix.compose(_v, _q, _s);
      ref.current.setMatrixAt(i, matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      {/* toneMapped=false keeps the color above 1.0 so bloom picks it up */}
      <meshBasicMaterial color="#ff7a55" toneMapped={false} />
    </instancedMesh>
  );
}

// Three chrome/accent satellites. Higher subdivision + low roughness gives
// real reflections instead of the "default Blender primitive" look.
function FloatingShapes() {
  return (
    <>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9} position={[-2.9, 1.5, -1.5]}>
        <mesh>
          <icosahedronGeometry args={[0.55, 2]} />
          <meshStandardMaterial color="#fafaf7" roughness={0.08} metalness={0.95} />
        </mesh>
      </Float>
      <Float speed={1.7} rotationIntensity={0.5} floatIntensity={1.2} position={[2.7, -1.4, -0.8]}>
        <mesh>
          <icosahedronGeometry args={[0.42, 3]} />
          <meshStandardMaterial
            color="#ff4d2e"
            emissive="#ff4d2e"
            emissiveIntensity={1.1}
            roughness={0.25}
            metalness={0.55}
            toneMapped={false}
          />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.7} position={[2.9, 1.8, -2.6]}>
        <mesh>
          <icosahedronGeometry args={[0.32, 2]} />
          <meshStandardMaterial color="#fafaf7" roughness={0.04} metalness={1} />
        </mesh>
      </Float>
    </>
  );
}

// Signature focal piece — distorted sphere with metallic accent. Bloom picks
// up the emissive rim and gives the "molten" glow look.
function HeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.12;
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.12;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.0}>
      <MeshDistortMaterial
        color="#ff4d2e"
        distort={0.5}
        speed={1.6}
        roughness={0.16}
        metalness={0.7}
        emissive="#ff4d2e"
        emissiveIntensity={0.32}
      />
    </Sphere>
  );
}

export function HeroCanvas({ active = true }: { active?: boolean }) {
  // Theme-reactive fog so depth fades to the page background in both themes.
  const { resolvedTheme } = useTheme();
  const fogColor = resolvedTheme === "light" ? "#fafaf7" : "#0a0a0a";

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      // "never" stops the render loop entirely while the hero is off-screen,
      // so bloom + the rest of the scene stop burning GPU on every frame.
      // The canvas stays mounted so scrolling back up resumes instantly.
      frameloop={active ? "always" : "never"}
      gl={{
        // Bloom does its own filtering — turning off MSAA keeps highlights crisp.
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
    >
      <fog attach="fog" args={[fogColor, 6, 16]} />

      {/* Lighting: dim ambient + warm key + cool rim + accent fill — the
          contrast between warm/cool is what makes chrome surfaces read as
          real instead of flat-shaded. */}
      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 4, 5]} intensity={0.7} />
      <pointLight position={[-4, 2, 2]} intensity={3.5} color="#ff4d2e" distance={14} />
      <pointLight position={[4, -2, 3]} intensity={2.2} color="#5b9eff" distance={14} />
      <pointLight position={[0, 0, 4]} intensity={1.5} color="#ff7a55" distance={8} />

      <CameraRig />
      <HeroBlob />
      <FloatingShapes />
      <DustField count={90} />

      {/* Bloom is the single biggest "polish" upgrade — it picks up emissive
          surfaces (the accent shapes, dust, blob rim) and gives them a soft
          glow that makes the whole scene feel cinematic instead of stiff. */}
      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
