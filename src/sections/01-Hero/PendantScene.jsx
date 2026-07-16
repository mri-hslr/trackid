// PendantScene.jsx
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
      <primitive object={scene} scale={0.15} />
    </mesh>
  );
}

// ── ANIMATED STAGE & LIGHTING ───────────────────────────────────────────
function AnimatedStage({ scrollTransformRef }) {
  const groupRef = useRef();
  const ambientLightRef = useRef();
  const mainLightRef = useRef();
  const fillLightRef = useRef();
  
  const prefersReducedMotion = useReducedMotion();

  useFrame(() => {
    if (!scrollTransformRef?.current) return;

    const { x, y, z, rotX, rotY, rotZ, scale, lightIntensity } = scrollTransformRef.current;
    
    // 1. Move the 3D Group
    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.position.set(x, y, z);
      groupRef.current.rotation.set(rotX, rotY, rotZ);
      groupRef.current.scale.set(scale, scale, scale);
    }

    // 2. Adjust Lighting Intensity based on Intro Animation
    if (ambientLightRef.current && mainLightRef.current && fillLightRef.current) {
      const intensity = prefersReducedMotion ? 1 : (lightIntensity ?? 1);
      
      // Multipliers based on your original light settings
      ambientLightRef.current.intensity = 0.5 * intensity;
      mainLightRef.current.intensity = 2 * intensity;
      fillLightRef.current.intensity = 0.5 * intensity;
    }
  });

  return (
    <>
      {/* Studio Lighting mapped to Refs */}
      <ambientLight ref={ambientLightRef} intensity={0.5} />
      <directionalLight ref={mainLightRef} position={[3, 5, 4]} intensity={2} />
      <directionalLight ref={fillLightRef} position={[-3, -5, -4]} intensity={0.5} color="#9DB4C7" />
      <Environment preset="studio" />

      <group ref={groupRef}>
        <Center>
          <UniversalModel />
        </Center>
      </group>
    </>
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
      <Suspense fallback={null}>
        <AnimatedStage scrollTransformRef={scrollTransformRef} />
        
        {/* Minimal bloom — only catches the brightest specular highlights.
            The pendant should never appear to glow too much, just glint. */}
        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom
            luminanceThreshold={0.6}
            mipmapBlur
            intensity={0.5}
            radius={0.4}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}