import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function noise(x: number, y: number, seed = 0): number {
  const n =
    Math.sin(x * 1.3 + seed) * Math.cos(y * 0.9 + seed) * 4 +
    Math.sin(x * 2.7 + y * 2.1 + seed) * 1.5 +
    Math.cos(x * 0.5 + y * 1.7 + seed) * 2.5;
  return n;
}

function mountainHeight(x: number, y: number): number {
  const r = Math.sqrt(x * x + y * y);
  const base = Math.exp(-r * r * 0.015) * 8;
  return (
    base + noise(x * 0.3, y * 0.3) * 1.2 + noise(x * 0.8, y * 0.8, 5) * 0.4
  );
}

function quarryHeight(x: number, y: number): number {
  const r = Math.sqrt(x * x + y * y);
  const pit = -Math.exp(-r * r * 0.02) * 7;
  const terrace = Math.sin(r * 0.8) * 0.6;
  const rim = Math.exp(-(r - 6) * (r - 6) * 0.4) * 2;
  return pit + terrace + rim + noise(x * 0.2, y * 0.2, 12) * 0.3;
}

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 40, 96, 96);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  const mountainPositions = useMemo(() => {
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const arr = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      arr[i * 3] = pos.getX(i);
      arr[i * 3 + 1] = mountainHeight(pos.getX(i), pos.getZ(i));
      arr[i * 3 + 2] = pos.getZ(i);
    }
    return arr;
  }, [geometry]);

  const quarryPositions = useMemo(() => {
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const arr = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      arr[i * 3] = pos.getX(i);
      arr[i * 3 + 1] = quarryHeight(pos.getX(i), pos.getZ(i));
      arr[i * 3 + 2] = pos.getZ(i);
    }
    return arr;
  }, [geometry]);

  useMemo(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useFrame((state, delta) => {
    timeRef.current += delta * 0.025;
    const t = (Math.sin(timeRef.current * Math.PI * 2) + 1) / 2;

    if (meshRef.current) {
      const pos = meshRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const mx = mountainPositions[i * 3 + 1];
        const qx = quarryPositions[i * 3 + 1];
        pos.setY(i, mx * (1 - t) + qx * t);
      }
      pos.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();

      meshRef.current.rotation.y += delta * 0.04;
      state.camera.position.x +=
        (mouseRef.current.x * 3 - state.camera.position.x) * 0.03;
      state.camera.position.y +=
        (-mouseRef.current.y * 2 + 10 - state.camera.position.y) * 0.03;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        color="#3a4a30"
        roughness={1}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = Math.random() * 15 - 3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let i = 0; i < 2000; i++) {
        let y = pos.getY(i) + delta * 0.15;
        if (y > 12) y = -3;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c8b89a"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#2F382A", 20, 60]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.2}
        color="#e8d5b0"
      />
      <directionalLight
        position={[-8, 5, -10]}
        intensity={0.3}
        color="#8B4513"
      />
      <Terrain />
      <Particles />
    </>
  );
}

export default function MountainHero({
  children,
}: { children: React.ReactNode }) {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a2015 0%, #2F382A 50%, #3a2a1a 100%)",
      }}
      data-ocid="hero.section"
    >
      <Canvas
        camera={{ position: [0, 10, 22], fov: 55 }}
        style={{ position: "absolute", inset: 0 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="relative z-10 max-w-4xl w-full">{children}</div>
    </section>
  );
}
