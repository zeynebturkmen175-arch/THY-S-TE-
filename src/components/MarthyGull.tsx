import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows, 
  PresentationControls,
  MeshWobbleMaterial,
  Sparkles,
  useCursor
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';

interface MascotProps {
  className?: string;
  mood?: 'happy' | 'thinking' | 'waving';
}

const GullModel = ({ isHovered, isClicked, ...props }: any) => {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    if (headRef.current) {
      // Head follows mouse with smoothing
      const targetRotationX = (mouse.y * viewport.height) / 8;
      const targetRotationY = (mouse.x * viewport.width) / 8;
      
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -targetRotationX, 0.1);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotationY, 0.1);
    }

    // Wings flap
    if (leftWingRef.current && rightWingRef.current) {
      const time = state.clock.getElapsedTime();
      const flapSpeed = isClicked ? 15 : 2;
      const flapRange = isClicked ? 0.5 : 0.1;
      
      leftWingRef.current.rotation.z = Math.PI / 4 + Math.sin(time * flapSpeed) * flapRange;
      rightWingRef.current.rotation.z = -Math.PI / 4 - Math.sin(time * flapSpeed) * flapRange;
    }

    // Body bounce on click
    if (bodyRef.current && isClicked) {
      bodyRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 20) * 0.2;
    } else if (bodyRef.current) {
       bodyRef.current.position.y = 0;
    }
  });

  // Blink logic
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group {...props} ref={bodyRef}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Wings */}
      <mesh ref={leftWingRef} position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.2, 0.8, 4, 16]} />
        <meshStandardMaterial color="#f0f4f8" />
      </mesh>
      <mesh ref={rightWingRef} position={[0.7, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.2, 0.8, 4, 16]} />
        <meshStandardMaterial color="#f0f4f8" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, -0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0.3, -0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Pilot Jacket / Uniform */}
      <group position={[0, -0.2, 0]}>
        {/* Main Jacket Body - Using a more structured shape */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.78, 0.4, 4, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        
        {/* V-Neck opening for the shirt */}
        <mesh position={[0, 0.4, 0.65]} rotation={[-0.4, 0, 0]}>
          <planeGeometry args={[0.5, 0.6]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>

        {/* Officer Pilot Wings (Breast Badge) */}
        <group position={[0.25, 0.35, 0.72]} rotation={[0, -0.2, 0]}>
           {/* Center Shield */}
           <mesh>
              <sphereGeometry args={[0.02, 16, 16]} scale={[1, 1.2, 0.5]} />
              <meshStandardMaterial color="#eab308" metalness={1} />
           </mesh>
           {/* Wings */}
           <mesh position={[-0.08, 0, 0]}>
              <boxGeometry args={[0.15, 0.02, 0.01]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} />
           </mesh>
           <mesh position={[0.08, 0, 0]}>
              <boxGeometry args={[0.15, 0.02, 0.01]} />
              <meshStandardMaterial color="#eab308" metalness={0.9} />
           </mesh>
        </group>

        {/* Golden Buttons */}
        {[0.1, -0.1, -0.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0.78]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshStandardMaterial color="#eab308" metalness={1} roughness={0} />
          </mesh>
        ))}

        {/* Golden Stripes on Arms/Wings base */}
        <group position={[-0.65, 0.35, 0.1]} rotation={[0, 0.5, 0.8]}>
           {[0, 0.05, 0.1].map((oy) => (
             <mesh key={oy} position={[0, oy, 0]}>
               <boxGeometry args={[0.3, 0.02, 0.3]} />
               <meshStandardMaterial color="#eab308" metalness={0.8} />
             </mesh>
           ))}
        </group>
        <group position={[0.65, 0.35, 0.1]} rotation={[0, -0.5, -0.8]}>
           {[0, 0.05, 0.1].map((oy) => (
             <mesh key={oy} position={[0, oy, 0]}>
               <boxGeometry args={[0.3, 0.02, 0.3]} />
               <meshStandardMaterial color="#eab308" metalness={0.8} />
             </mesh>
           ))}
        </group>

        {/* Red Tie - Refined */}
        <group position={[0, 0.3, 0.71]} rotation={[-0.1, 0, 0]}>
          <mesh>
             <coneGeometry args={[0.04, 0.25, 3]} />
             <meshStandardMaterial color="#dc2626" />
          </mesh>
          {/* Tie Knot */}
          <mesh position={[0, 0.13, 0.02]}>
             <boxGeometry args={[0.06, 0.06, 0.04]} />
             <meshStandardMaterial color="#b91c1c" />
          </mesh>
        </group>
      </group>

      {/* Head Group */}
      <group position={[0, 0.6, 0.2]} ref={headRef}>
        {/* Head Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        {/* Pilot Hat */}
        <group position={[0, 0.45, 0]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow>
             <cylinderGeometry args={[0.45, 0.45, 0.25, 32]} />
             <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
             <cylinderGeometry args={[0.46, 0.46, 0.05, 32]} />
             <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.1} />
          </mesh>
          {/* Hat Emblem - Officer Wreath Style */}
          <group position={[0, 0, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
             <mesh>
                <circleGeometry args={[0.12, 16]} />
                <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.2} metalness={0.9} />
             </mesh>
             {/* Laurel Wreath Approximation */}
             {[...Array(8)].map((_, i) => (
                <mesh 
                  key={i} 
                  position={[Math.cos((i * Math.PI) / 4) * 0.1, Math.sin((i * Math.PI) / 4) * 0.1, 0.01]}
                  rotation={[0, 0, (i * Math.PI) / 4]}
                >
                   <sphereGeometry args={[0.02, 8, 8]} scale={[1, 2, 0.5]} />
                   <meshStandardMaterial color="#eab308" />
                </mesh>
             ))}
          </group>
        </group>

        {/* Eyes - Enhanced with pupils and highlights */}
        <group position={[0, 0.12, 0.48]}>
          <group position={[-0.22, 0, 0]} scale={[1, blink ? 0.1 : 1, 1]}>
             <mesh>
                <sphereGeometry args={[0.09, 24, 24]} />
                <meshStandardMaterial color="#000000" roughness={0.1} />
             </mesh>
             {/* Sparkle/Highlight */}
             <mesh position={[0.03, 0.03, 0.06]}>
                <sphereGeometry args={[0.025, 12, 12]} />
                <meshStandardMaterial color="#ffffff" />
             </mesh>
          </group>
          <group position={[0.22, 0, 0]} scale={[1, blink ? 0.1 : 1, 1]}>
             <mesh>
                <sphereGeometry args={[0.09, 24, 24]} />
                <meshStandardMaterial color="#000000" roughness={0.1} />
             </mesh>
              {/* Sparkle/Highlight */}
              <mesh position={[0.03, 0.03, 0.06]}>
                <sphereGeometry args={[0.025, 12, 12]} />
                <meshStandardMaterial color="#ffffff" />
             </mesh>
          </group>
        </group>

        {/* Beak */}
        <mesh position={[0, -0.1, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial color="#f97316" roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

export const MarthyGull: React.FC<MascotProps> = ({ className, mood = 'happy' }) => {
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  
  useCursor(hovered);

  const handleClick = () => {
    setClicked(true);
    setShowSparkles(true);
    
    // Sound effect
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {}

    setTimeout(() => {
      setClicked(false);
      setShowSparkles(false);
    }, 1500);
  };

  return (
    <div 
      className={cn("relative group transition-all duration-500 w-full h-full min-h-[48px]", className)}
      style={{ pointerEvents: 'auto' }}
    >
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="blue" />
        
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
              <GullModel isHovered={hovered} isClicked={clicked} />
            </PresentationControls>
          </Float>
          
          <Environment preset="city" />
          <ContactShadows 
            position={[0, -1.2, 0]} 
            opacity={0.4} 
            scale={5} 
            blur={2} 
            far={10} 
            resolution={256} 
            color="#000000" 
          />
        </Suspense>

        {showSparkles && <Sparkles count={20} scale={2} size={2} speed={0.4} color="#eab308" />}
      </Canvas>

      {/* UI Overlay */}
      <AnimatePresence>
        {hovered && !clicked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-blue-100 shadow-xl pointer-events-none"
          >
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest whitespace-nowrap">
              Selam! Haydi Geleceği Konuşalım ✈️
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Halo */}
      {clicked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <motion.div 
             initial={{ scale: 0.5, opacity: 1 }}
             animate={{ scale: 2.5, opacity: 0 }}
             className="w-32 h-32 rounded-full border-4 border-blue-400"
           />
        </div>
      )}
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
