// src/components/SmokeLoader.jsx
// A brief smoke-only loading moment — plays once on load, then fades
// away to reveal the hero. No counter, no wordmark; just the smoke.
// Reduced motion: skips straight past (renders nothing).

import { useEffect, useState } from 'react';
import IntroSmoke from './IntroSmoke';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function SmokeLoader() {
  const prefersReducedMotion = useReducedMotion();
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t1 = setTimeout(() => setFading(true), 1600);   // hold, then fade
    const t2 = setTimeout(() => setGone(true), 2400);     // unmount
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [prefersReducedMotion]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] overflow-hidden transition-opacity duration-700 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse 80% 65% at 50% 42%, #170a13 0%, #0a040a 55%, #050205 100%)',
        pointerEvents: fading ? 'none' : 'auto',
      }}
      aria-hidden
    >
      <IntroSmoke opacity={0.6} />
    </div>
  );
}
