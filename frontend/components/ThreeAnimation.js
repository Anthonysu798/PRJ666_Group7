import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useState, useEffect } from 'react';
import { 
  ScrollControls, 
  useScroll, 
  Scroll, 
  Float, 
  Environment, 
  useGLTF,
  Html,
  Stars
} from '@react-three/drei';
import * as THREE from 'three';
import React from 'react';

// Loading spinner component
function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-sm">Loading 3D models...</p>
      </div>
    </Html>
  );
}

// Burger Model Component
function BurgerModel(props) {
  const { nodes, materials } = useGLTF('/models/burger.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes['tripo_node_d985f453-a21e-46fd-b5e2-f8ec1ea1e9bf'].geometry}
        material={materials['tripo_material_d985f453-a21e-46fd-b5e2-f8ec1ea1e9bf']}
      />
    </group>
  );
}

// Generic Model Component
function Model({ url, position, scale, rotation = [0, 0, 0] }) {
  const ref = useRef();
  const { nodes, materials } = useGLTF(url);
  const [modelScale, setModelScale] = useState(scale);
  const scroll = useScroll();

  useFrame((state) => {
    if (!ref.current) return;
    
    // Simple floating animation
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2 + position[2];
    
    // Scale based on scroll
    const scrollProgress = scroll.range(0, 1);
    setModelScale(scale * (1 + scrollProgress * 0.2));
  });

  // Get the first mesh from the loaded model
  const firstMeshKey = Object.keys(nodes).find(key => nodes[key].type === 'Mesh');
  const firstMaterialKey = Object.keys(materials)[0];

  if (!firstMeshKey || !firstMaterialKey) return null;

  return (
    <group
      ref={ref}
      position={position}
      scale={[modelScale, modelScale, modelScale]}
      rotation={rotation}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes[firstMeshKey].geometry}
        material={materials[firstMaterialKey]}
      />
    </group>
  );
}

function Scene() {
  const scroll = useScroll();
  const group = useRef();

  // Define models with their positions
  const models = [
    {
      component: BurgerModel, // Use specific component for burger
      position: [2, -1, 1],
      scale: 0.3
    },
    {
      url: '/models/man_ai_coach.glb',
      position: [-3, 0, 2],
      scale: 0.5
    },
    {
      url: '/models/food.glb',
      position: [-2, 1, -1],
      scale: 0.4
    },
    {
      url: '/models/heart.glb',
      position: [3, 0.5, -2],
      scale: 0.3
    },
    {
      url: '/models/treadmill.glb',
      position: [0, -1, 3],
      scale: 0.4
    }
  ];

  useFrame(() => {
    if (group.current) {
      // Smooth rotation based on scroll
      const targetRotation = scroll.offset * Math.PI * 2;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotation,
        0.05
      );
    }
  });

  return (
    <group ref={group}>
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1} />
      
      {models.map((model, index) => (
        <Float 
          key={index} 
          speed={1} 
          rotationIntensity={0.2} 
          floatIntensity={0.5}
          position={[0, 0, 0]}
        >
          <Suspense fallback={<LoadingSpinner />}>
            {model.component ? (
              <model.component 
                position={model.position}
                scale={[model.scale, model.scale, model.scale]}
              />
            ) : (
              <Model {...model} />
            )}
          </Suspense>
        </Float>
      ))}

      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4f46e5" />
    </group>
  );
}

// Preload all models
useGLTF.preload('/models/burger.glb');
useGLTF.preload('/models/man_ai_coach.glb');
useGLTF.preload('/models/food.glb');
useGLTF.preload('/models/heart.glb');
useGLTF.preload('/models/treadmill.glb');

export default function ThreeAnimation() {
  return (
    <div className="fixed top-0 left-0 w-full h-full" style={{ zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0A0A0F']} />
        <fog attach="fog" args={['#0A0A0F', 5, 30]} />
        
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.1} distance={1}>
            <Scene />
          </ScrollControls>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}