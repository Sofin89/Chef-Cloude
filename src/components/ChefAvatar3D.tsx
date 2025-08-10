import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChefHatProps {
  isGenerating: boolean;
}

function ChefHat({ isGenerating }: ChefHatProps) {
  const hatRef = useRef<THREE.Group>(null);
  const cookingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (hatRef.current) {
      if (isGenerating) {
        hatRef.current.rotation.y += 0.05;
        hatRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        hatRef.current.rotation.y += 0.01;
        hatRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
      }
    }
    
    if (cookingRef.current) {
      cookingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={hatRef}>
      {/* Chef Hat Base */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 32]} />
        <meshPhongMaterial color="#ffffff" />
      </mesh>
      
      {/* Chef Hat Top */}
      <mesh position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 16]} />
        <meshPhongMaterial color="#ffffff" />
      </mesh>
      
      {/* Chef Hat Pleats */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 1.1, 0.15, Math.sin(i * Math.PI / 4) * 1.1]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.05]} />
          <meshPhongMaterial color="#f0f0f0" />
        </mesh>
      ))}
      
      {/* Cooking Utensils */}
      <group ref={cookingRef} position={[1.5, -0.5, 0]}>
        {/* Spoon */}
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
          <meshPhongMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 8]} />
          <meshPhongMaterial color="#C0C0C0" />
        </mesh>
      </group>
      
      {/* Steam particles when generating */}
      {isGenerating && (
        <group position={[0, 2, 0]}>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[Math.random() * 0.4 - 0.2, Math.random() * 0.5, Math.random() * 0.4 - 0.2]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshPhongMaterial color="#ffffff" opacity={0.6} transparent />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

interface ChefAvatar3DProps {
  isGenerating?: boolean;
  className?: string;
}

export default function ChefAvatar3D({ isGenerating = false, className = "" }: ChefAvatar3DProps) {
  return (
    <div className={`w-32 h-32 ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ff6b35" />
        
        <ChefHat isGenerating={isGenerating} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={!isGenerating}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}