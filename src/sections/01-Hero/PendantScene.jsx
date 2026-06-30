// src/sections/01-Hero/PendantScene.jsx
// The React Three Fiber scene containing the pendant.
//
// Current state (WebGL foundation):
//   - Placeholder pendant from primitives (no GLB yet)
//   - MeshPhysicalMaterial for silver body and sapphire gem
//   - Environment + directional light for realistic reflections
//   - Slow automatic Y-axis rotation
//
// Future iterations will add:
//   - Cursor-reactive tilt via useCursorParallax
//   - Real GLB model swap (path from assets.js)
//   - Reduced-motion handling (freeze rotation)
//   - Mobile fallback logic

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import useCursorParallax from './useCursorParallax';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// ═══════════════════════════════════════════════════════════════════════
// Scene-level constants — tune these instead of hunting for magic
// numbers in the JSX tree. Grouped by concern.
//
// ART DIRECTION: Khyati — tweak the values in this block to adjust
// lighting, materials, camera, and cursor feel. The WebGL architecture
// below reads from these constants; you shouldn't need to touch the
// component code for visual tuning.
// ═══════════════════════════════════════════════════════════════════════

// -- Camera ---------------------------------------------------------------
const CAMERA_POSITION = [0, 0.5, 4.5];
const CAMERA_FOV = 35;

// -- Renderer -------------------------------------------------------------
const TONE_MAPPING_EXPOSURE = 1.2;
const DEVICE_PIXEL_RATIO = [1, 2]; // [min, max] — clamp for perf on hi-DPI

// -- Rotation -------------------------------------------------------------
/** Radians/sec on the Y axis. ~0.35 ≈ one full revolution every ~18 s. */
const AUTO_ROTATE_SPEED = 0.35;

// -- Cursor parallax (art direction) --------------------------------------
/** Max cursor-driven tilt in radians — pitch (up/down from cursor Y). */
const MAX_TILT_X = 0.3;
/** Max cursor-driven tilt in radians — roll (left/right from cursor X). */
const MAX_TILT_Z = 0.3;
/** Lerp speed for cursor tilt — higher = snappier, lower = heavier feel. */
const CURSOR_LERP_SPEED = 3;

// -- Mobile fallback ------------------------------------------------------
/** Matches Tailwind's `md:` breakpoint. Below this AND touch → no cursor. */
const MOBILE_BREAKPOINT = 768;

// -- Pendant geometry -----------------------------------------------------
const BAIL_POSITION    = [0, 1.55, 0];
const BAIL_ROTATION    = [Math.PI / 2, 0, 0];
const BAIL_RADIUS      = 0.15;
const BAIL_TUBE_RADIUS = 0.035;
const BAIL_RADIAL_SEGMENTS = 16;
const BAIL_TUBULAR_SEGMENTS = 32;

const BODY_POSITION = [0, 0, 0];
/** Number of profile-curve sample points for the teardrop LatheGeometry. */
const TEARDROP_PROFILE_SEGMENTS = 32;
/** Number of radial segments when revolving the profile around Y. */
const TEARDROP_RADIAL_SEGMENTS  = 64;
const TEARDROP_MAX_RADIUS = 0.55;     // widest point of the bulge
const TEARDROP_HEIGHT_SCALE = 3;      // stretches the profile vertically
const TEARDROP_HEIGHT_OFFSET = -0.6;  // shifts the profile down
const TEARDROP_TAPER_FACTOR = 0.4;    // how sharply the top narrows

const GEM_POSITION = [0, 0.15, 0.35];
const GEM_RADIUS   = 0.28;
const GEM_DETAIL   = 64; // width and height segments for the sphere

// -- Materials (art direction) --------------------------------------------
// Shared silver properties (bail + body use identical metal, except the
// body adds envMapIntensity for stronger reflections on the larger surface).
// NOTE: The color '#C0C0C0' is a temporary placeholder metal color. It does
// not exist in the Tailwind design system because the final material will be
// defined within the actual GLB model. Thus, it remains hardcoded here.
const SILVER_MATERIAL = {
  color:             '#C0C0C0',
  metalness:         0.92,
  roughness:         0.18,
  reflectivity:      1,
  clearcoat:         0.3,
  clearcoatRoughness: 0.1,
};

const BODY_ENV_MAP_INTENSITY = 1.5;

// NOTE: The color '#2855A0' is a temporary placeholder sapphire color. Like
// the silver above, it represents a placeholder material until the final
// GLB asset is integrated. It is deliberately outside the Tailwind config.
const SAPPHIRE_MATERIAL = {
  color:              '#2855A0',
  metalness:          0.05,
  roughness:          0.05,
  transmission:       0.6,
  thickness:          1.2,
  ior:                1.77,   // real sapphire IOR
  reflectivity:       0.5,
  clearcoat:          1,
  clearcoatRoughness: 0,
  envMapIntensity:    2,
  transparent:        true,
  opacity:            0.92,
  side:               THREE.DoubleSide,
};

// -- Lighting (art direction) ---------------------------------------------
const AMBIENT_INTENSITY = 0.15;

const KEY_LIGHT_POSITION  = [3, 5, 4];
const KEY_LIGHT_INTENSITY = 1.8;
const KEY_LIGHT_COLOR     = '#FFFFFF';

// Rim light uses the brand accent color for a subtle sapphire-tinted fill.
const RIM_LIGHT_POSITION  = [-2, 3, -2];
const RIM_LIGHT_INTENSITY = 0.6;
const RIM_LIGHT_COLOR     = '#9DB4C7'; // matches Tailwind `accent` token

const ENV_PRESET    = 'studio';
const ENV_INTENSITY = 0.8;

// ═══════════════════════════════════════════════════════════════════════
// Teardrop profile — memoized so the Vector2 array is computed once.
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates the 2D profile curve for the pendant's LatheGeometry.
 * Pure function with no dependencies — safe to call once and cache.
 */
function computeTeardropProfile() {
  const points = [];

  for (let i = 0; i <= TEARDROP_PROFILE_SEGMENTS; i++) {
    const t = i / TEARDROP_PROFILE_SEGMENTS;

    // Vertical position along the profile
    const y = t * TEARDROP_HEIGHT_SCALE + TEARDROP_HEIGHT_OFFSET;

    // Radius: a sin-bulge that tapers asymmetrically toward the top
    const r =
      TEARDROP_MAX_RADIUS *
      Math.sin(Math.PI * t) *
      (1 - TEARDROP_TAPER_FACTOR * t);

    points.push(new THREE.Vector2(Math.max(r, 0), y));
  }

  return points;
}

// ═══════════════════════════════════════════════════════════════════════
// PlaceholderPendant — primitive stand-in for the real GLB model.
// Will be replaced by a useGLTF-loaded mesh (path from assets.js)
// once the 3D model is ready — no structural changes needed.
// ═══════════════════════════════════════════════════════════════════════

function PlaceholderPendant({ scrollRotationRef }) {
  const groupRef = useRef();
  const scrollGroupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Mobile touch detection — re-evaluated on viewport changes
  // (e.g. tablet rotation, browser resize) so parallax toggles correctly.
  const [isMobileTouch, setIsMobileTouch] = useState(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isTouch && window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    function checkMobileTouch() {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobileTouch(isTouch && isMobile);
    }

    window.addEventListener('resize', checkMobileTouch);
    window.addEventListener('orientationchange', checkMobileTouch);

    return () => {
      window.removeEventListener('resize', checkMobileTouch);
      window.removeEventListener('orientationchange', checkMobileTouch);
    };
  }, []);

  const parallaxEnabled = !prefersReducedMotion && !isMobileTouch;
  const cursor = useCursorParallax(parallaxEnabled);

  // Memoize the teardrop profile so it isn't recomputed on every render
  const teardropPoints = useMemo(computeTeardropProfile, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (prefersReducedMotion) {
      // Reduced motion: freeze in a nice static 3/4 angle
      groupRef.current.rotation.set(0, Math.PI / 4, 0);
      return;
    }

    // Auto-rotation runs continuously on Y axis
    groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED;

    // Apply cursor parallax (always lerp to target).
    // If parallax is disabled, cursor.current resets to (0,0),
    // and this continuously lerps the pendant back to an upright neutral position.
    
    // Lerp X rotation based on cursor Y (pitch up/down)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      cursor.current.y * MAX_TILT_X,
      delta * CURSOR_LERP_SPEED
    );
    
    // Lerp Z rotation based on cursor X (subtle roll left/right)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -cursor.current.x * MAX_TILT_Z,
      delta * CURSOR_LERP_SPEED
    );

    // Apply scroll-driven rotation (controlled by GSAP in Hero.jsx)
    if (scrollGroupRef.current && scrollRotationRef?.current) {
      scrollGroupRef.current.rotation.set(
        scrollRotationRef.current.x,
        scrollRotationRef.current.y,
        0
      );
    }
  });

  return (
    <group ref={scrollGroupRef}>
      <group ref={groupRef}>
        {/* ── Bail / ring at the top ── */}
      <mesh position={BAIL_POSITION} rotation={BAIL_ROTATION}>
        <torusGeometry
          args={[
            BAIL_RADIUS,
            BAIL_TUBE_RADIUS,
            BAIL_RADIAL_SEGMENTS,
            BAIL_TUBULAR_SEGMENTS,
          ]}
        />
        <meshPhysicalMaterial {...SILVER_MATERIAL} />
      </mesh>

      {/* ── Silver teardrop body ── */}
      <mesh position={BODY_POSITION}>
        <latheGeometry args={[teardropPoints, TEARDROP_RADIAL_SEGMENTS]} />
        <meshPhysicalMaterial
          {...SILVER_MATERIAL}
          envMapIntensity={BODY_ENV_MAP_INTENSITY}
        />
      </mesh>

      {/* ── Sapphire gem inset ── */}
      <mesh position={GEM_POSITION}>
        <sphereGeometry args={[GEM_RADIUS, GEM_DETAIL, GEM_DETAIL]} />
        <meshPhysicalMaterial {...SAPPHIRE_MATERIAL} />
      </mesh>
      </group>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PendantScene — the exported Canvas wrapper.
// Hero.jsx renders this as its only child. The Canvas fills the
// parent section via absolute positioning; Hero owns the layout.
// ═══════════════════════════════════════════════════════════════════════

export default function PendantScene({ scrollRotationRef }) {
  return (
    <Canvas
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: TONE_MAPPING_EXPOSURE,
      }}
      dpr={DEVICE_PIXEL_RATIO}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {/* Ambient fill — very low, lets Environment do the heavy lifting */}
      <ambientLight intensity={AMBIENT_INTENSITY} />

      {/* Key directional light — studio key from upper-right */}
      <directionalLight
        position={KEY_LIGHT_POSITION}
        intensity={KEY_LIGHT_INTENSITY}
        color={KEY_LIGHT_COLOR}
        castShadow={false}
      />

      {/* Rim / fill from the left — accent-tinted for sapphire warmth */}
      <directionalLight
        position={RIM_LIGHT_POSITION}
        intensity={RIM_LIGHT_INTENSITY}
        color={RIM_LIGHT_COLOR}
      />

      {/* HDRI environment for realistic reflections on metal/gem */}
      <Environment preset={ENV_PRESET} environmentIntensity={ENV_INTENSITY} />

      <PlaceholderPendant scrollRotationRef={scrollRotationRef} />
    </Canvas>
  );
}
