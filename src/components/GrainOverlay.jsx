// src/components/GrainOverlay.jsx
// Site-wide film grain — a fixed, pointer-through SVG-noise layer that
// gives every section a tactile, cinematic texture (the reference's raw
// poster feel) without touching any colours. Very low opacity, overlay
// blend so it reads on both the dark chapters and the light posters.
// Animated grain flicker is CSS; reduced motion freezes it.

export default function GrainOverlay() {
  return (
    <div className="grain-overlay" aria-hidden />
  );
}
