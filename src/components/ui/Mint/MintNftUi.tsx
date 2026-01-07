"use client";

import React, { useState, useRef, useEffect, Suspense } from "react"; // Suspense যোগ করা হয়েছে
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Environment,
  Float,
  Sparkles,
  PerspectiveCamera,
  ContactShadows,
  MeshTransmissionMaterial,
  Image,
  useProgress, // প্রোগ্রেস চেক করার জন্য
  Html, // লোডার দেখানোর জন্য
} from "@react-three/drei";
import * as THREE from "three";

// --- Loader Component ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#02040a] font-mono">
        <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-cyan-500 text-[10px] mt-4 tracking-[0.5em] uppercase animate-pulse">
          Initializing Protocol {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

// --- Types ---
interface NFTItem {
  name: string;
  rarity: string;
  color: string;
  icon: string;
  desc: string;
}

const NFT_DATA: NFTItem[] = [
  {
    name: "FR MYTHIC",
    rarity: "MYTHIC",
    color: "#bd00ff",
    icon: "/mytic.png",
    desc: "NEURAL NETWORK",
  },
  {
    name: "FR PLATINUM",
    rarity: "LEGENDARY",
    color: "#00d4ff",
    icon: "/legendry.png",
    desc: "QUANTUM ENCRYPTED",
  },
  {
    name: "FR GOLD",
    rarity: "EPIC",
    color: "#FFB300",
    icon: "/epic.png",
    desc: "HIGH FREQUENCY",
  },
  {
    name: "FR SILVER",
    rarity: "RARE",
    color: "#C0C0C0",
    icon: "/rare.png",
    desc: "STELLAR PULSE",
  },
  {
    name: "FR BRONZE",
    rarity: "COMMON",
    color: "#CD7F32",
    icon: "/common.png",
    desc: "CORE ACCESS",
  },
];

// --- Optimized CyberBox ---
const CyberBox = ({
  opened,
  isMobile,
  color,
}: {
  opened: boolean;
  isMobile: boolean;
  color: string;
}) => {
  const boxRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (boxRef.current) {
      boxRef.current.rotation.y = t * 0.15;
      boxRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;

      const targetY = opened ? (isMobile ? -4.5 : -3.5) : 0;
      boxRef.current.position.y = THREE.MathUtils.lerp(
        boxRef.current.position.y,
        targetY,
        0.06
      );

      const baseScale = isMobile ? 1.2 : 1.1;
      const s = opened ? 0 : baseScale;

      boxRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);

      if (opened && boxRef.current.scale.x < 0.01) {
        boxRef.current.visible = false;
      } else {
        boxRef.current.visible = true;
      }
    }
  });

  return (
    <group ref={boxRef}>
      <mesh>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial color="#02040a" metalness={1} roughness={0.3} />
      </mesh>

      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <MeshTransmissionMaterial
          backside
          samples={isMobile ? 2 : 4}
          thickness={0.1}
          chromaticAberration={0.02}
          distortion={0.2}
          color={color}
          opacity={0.3}
          transparent
        />
      </mesh>

      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[(i * Math.PI) / 2, (i * Math.PI) / 4, 0]}>
          <mesh>
            <boxGeometry args={[1.65, 0.02, 1.65]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// --- Optimized RelicCard ---
const RelicCard = ({
  opened,
  data,
  isMobile,
}: {
  opened: boolean;
  data: NFTItem;
  isMobile: boolean;
}) => {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    if (opened) {
      const targetY = isMobile ? 0.2 : 0.6;
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        targetY,
        0.08
      );
      group.current.rotation.y = Math.sin(t * 0.4) * 0.15;

      const scaleVal = isMobile ? 1.4 : 1.2;
      group.current.scale.lerp(
        new THREE.Vector3(scaleVal, scaleVal, scaleVal),
        0.1
      );
    } else {
      group.current.position.y = -5;
      group.current.scale.set(0, 0, 0);
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
          <boxGeometry args={[1.2, 1.8, 0.05]} />
          <MeshTransmissionMaterial
            backside
            samples={isMobile ? 3 : 6}
            thickness={0.2}
            color={data.color}
          />
        </mesh>
        <group position={[0, 0, 0.04]}>
          <Text
            position={[0, 0.7, 0]}
            fontSize={0.06}
            color={data.color}
            letterSpacing={0.3}
          >
            {data.rarity}
          </Text>

          <Image
            url={data.icon}
            transparent
            scale={[0.7, 0.7]}
            position={[0, 0.15, 0.01]}
          />

          <Text
            position={[0, -0.4, 0]}
            fontSize={isMobile ? 0.14 : 0.15}
            color="white"
            fontWeight="bold"
          >
            {data.name}
          </Text>
        </group>
      </Float>
    </group>
  );
};

export default function PremiumVaultPage() {
  const [opened, setOpened] = useState(false);
  const [activeNFT, setActiveNFT] = useState<NFTItem>(NFT_DATA[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleVault = () => {
    if (!opened)
      setActiveNFT(NFT_DATA[Math.floor(Math.random() * NFT_DATA.length)]);
    setOpened(!opened);
  };

  return (
    <div className="h-[80dvh] w-full flex flex-col items-center justify-between overflow-hidden font-mono selection:bg-cyan-500 relative bg-[#02040a]">
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-3 py-1.5 rounded-xl bg-red-500 text-white font-mono text-[10px] sm:text-xs tracking-widest shadow-lg select-none pointer-events-none max-w-[90vw] text-center">
        🚀 ⚠️ Mint system is currently running, but some features are still
        being finalized.
      </div>

      <div className="relative z-10 md:pt-12 text-center pointer-events-none">
        <h1 className="text-white text-2xl md:text-4xl font-black tracking-[0.15em] md:tracking-[0.2em] mb-1 opacity-90 transition-all duration-500">
          Mint Live
          <span className="animate-pulse" style={{ color: activeNFT.color }}>
            .
          </span>
        </h1>
        <p className="text-[8px] md:text-xs text-white/50 tracking-[0.4em] uppercase">
          Mint <span className="text-cyan-400">FarRewards</span> NFT
        </p>
        <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-4" />
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={<Loader />}>
            {" "}
            {/* লোডিং ম্যানেজমেন্ট */}
            <PerspectiveCamera
              makeDefault
              position={[0, 0, isMobile ? 10 : 7]}
              fov={isMobile ? 45 : 40}
            />
            <ambientLight intensity={0.4} />
            <Environment preset="city" />
            <CyberBox
              opened={opened}
              isMobile={isMobile}
              color={activeNFT.color}
            />
            <RelicCard opened={opened} data={activeNFT} isMobile={isMobile} />
            <Sparkles
              count={opened ? (isMobile ? 50 : 100) : 20}
              scale={6}
              size={2}
              color={activeNFT.color}
            />
            <ContactShadows
              position={[0, -2.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2.5}
              color={activeNFT.color}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={!opened}
              autoRotateSpeed={0.5}
              makeDefault
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 pb-10 md:pb-12 flex flex-col items-center gap-4 w-full px-6 md:px-8">
        {opened && (
          <div className="text-center mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-[10px] text-cyan-400 tracking-[0.3em] uppercase">
              {activeNFT.desc}
            </p>
          </div>
        )}

        <button
          onClick={toggleVault}
          className="group relative w-full max-w-[240px] md:max-w-[280px] py-4 md:py-5 bg-[#00050a]/80 backdrop-blur-sm border border-white/10 active:scale-95 transition-all overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/30 group-hover:bg-cyan-400 transition-colors" />
          <span className="relative text-[10px] md:text-[11px] font-bold tracking-[0.5em] uppercase text-white group-hover:text-cyan-400 transition-colors">
            {opened ? "Close Vault" : "Mint FR NFT"}
          </span>
          <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>

        <p className="text-[8px] text-white/20 uppercase tracking-widest">
          Protocol v4.0.2 - Protected
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/5 animate-scan pointer-events-none z-30" />

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
