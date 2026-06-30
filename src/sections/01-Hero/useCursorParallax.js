// src/sections/01-Hero/useCursorParallax.js
// Tracks normalized mouse position (-1 to 1 on both axes).
// Returns a ref (not state) so consumers can read the latest value
// inside useFrame without triggering React re-renders on every
// mousemove event. This is the standard R3F pattern for per-frame data.
//
// Integration with PendantScene is deferred to a later iteration —
// this hook exists now so the architecture is in place and no
// restructuring is needed when cursor movement is wired up.

import { useRef, useEffect, useCallback } from 'react';

/** @type {{ x: number, y: number }} */
const ORIGIN = Object.freeze({ x: 0, y: 0 });

/**
 * @param {boolean} [enabled=true] — pass false to disable tracking
 *   (e.g. on touch-only devices or when prefers-reduced-motion is on).
 * @returns {React.MutableRefObject<{ x: number, y: number }>}
 *   A ref whose `.current` holds the normalized cursor position:
 *   (0, 0) = viewport center, (-1, -1) = top-left, (1, 1) = bottom-right.
 *   Read this inside useFrame — it updates without re-rendering.
 */
export default function useCursorParallax(enabled = true) {
  const positionRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    // Normalize to -1…1 range centered at viewport midpoint
    positionRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    positionRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Reset to center when disabled
      positionRef.current.x = ORIGIN.x;
      positionRef.current.y = ORIGIN.y;
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, handleMouseMove]);

  return positionRef;
}
