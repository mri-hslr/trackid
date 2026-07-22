// src/components/IntroBubbles.jsx
// The floating iridescent soap bubbles for the intro curtain (OSOS-style).
// Pure CSS — each bubble is a div with layered radial gradients and a
// hue-rotate so no two look alike. Deterministic pseudo-random layout
// (seeded by index) so renders are stable. Reduced motion: the global
// prefers-reduced-motion rule freezes the float animation.

import { useMemo } from 'react';

const BUBBLE_COUNT = 18;

// Deterministic 0..1 "random" from an index — stable across renders.
const rand = (i, salt) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export default function IntroBubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
        size: 14 + rand(i, 1) * 76,                    // 14–90px
        left: rand(i, 2) * 100,                        // vw %
        delay: -rand(i, 3) * 22,                       // negative → mid-flight on mount
        duration: 14 + rand(i, 4) * 18,                // 14–32s float
        swayDuration: 3.5 + rand(i, 5) * 4,
        hue: Math.round(rand(i, 6) * 300),
        opacity: 0.5 + rand(i, 7) * 0.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="intro-bubble-track"
          style={{
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        >
          <div
            className="intro-bubble"
            style={{
              width: b.size,
              height: b.size,
              filter: `hue-rotate(${b.hue}deg)`,
              animationDuration: `${b.swayDuration}s`,
              animationDelay: `${b.delay / 2}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
