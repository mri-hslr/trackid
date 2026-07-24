// src/components/TiltedPoster.jsx
// A rotated poster/collage card that drifts and straightens as it
// scrolls through the viewport (the reference's tilted "THOUGHTCRIME"
// card). Scroll-scrubbed rotation + rise; content is whatever children
// you pass. Reduced motion: sits static at its resting tilt.

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function TiltedPoster({ children, tilt = -7, className = '' }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { rotate: tilt, yPercent: 12 },
      {
        rotate: tilt * -0.5,
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion, tilt]);

  return (
    <div
      ref={ref}
      style={prefersReducedMotion ? { transform: `rotate(${tilt}deg)` } : undefined}
      className={`shadow-[0_30px_80px_rgba(0,0,0,0.5)] ${className}`}
    >
      {children}
    </div>
  );
}
