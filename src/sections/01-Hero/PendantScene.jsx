import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Center, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// ── MODEL LOADER ────────────────────────────────────────────────────────
function UniversalModel() {
  const { scene } = useGLTF('/assets/models/pendant.glb'); 
  
  return (
    <mesh>
      {/* 
        MASTER SCALE: The model is naturally too big. 
        Adjust this number (0.15, 0.5, 2, etc.) until the model 
        looks perfectly sized when the page first loads.
      */}
      <primitive object={scene} scale={0.15} />
    </mesh>
  );
}

// ── ANIMATED STAGE ──────────────────────────────────────────────────────
function AnimatedStage({ scrollTransformRef }) {
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame(() => {
    if (!groupRef.current || prefersReducedMotion || !scrollTransformRef?.current) return;

    const { x, y, z, rotX, rotY, rotZ, scale } = scrollTransformRef.current;
    
    // Apply GSAP coordinates to the 3D group
    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.set(rotX, rotY, rotZ);
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef}>
      {/* Center without "top" forces the geometric center of the model perfectly into the middle */}
      <Center>
        <UniversalModel />
      </Center>
    </group>
  );
}

// ── CANVAS WRAPPER ──────────────────────────────────────────────────────
export default function PendantScene({ scrollTransformRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Basic Studio Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <directionalLight position={[-3, -5, -4]} intensity={0.5} color="#9DB4C7" />
      <Environment preset="studio" />

      <Suspense fallback={null}>
        <AnimatedStage scrollTransformRef={scrollTransformRef} />
        
        {/* Minimal bloom — only catches the brightest specular highlights.
            The pendant should never appear to glow too much, just glint. */}
        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom
            luminanceThreshold={0.8}
            mipmapBlur
            intensity={0.15}
            radius={0.4}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}