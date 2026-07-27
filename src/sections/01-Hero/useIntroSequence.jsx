// src/sections/01-Hero/useIntroSequence.jsx
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const HERO_REST = { x: 0, y: 1.5, z: 0, rotX: 0.2, rotY: 0, rotZ: 0, scale: 1, lightIntensity: 1 };

const START_POSE  = { x: 2.2, y: 4,   z: 0.4, rotX: 0.15, scale: 1.1 };
const CENTER_POSE = { x: 0,   y: 0,   z: 0.6, rotX: 0.15, scale: 1.6 };

const FLOOR_Y = -2.2;
const BOUNCE_PEAK_1 = -1.5;
const BOUNCE_PEAK_2 = -1.9;

const BOUNCE_SETTLE_AT = 3.35; // was 4.15 — trimmed back down
const SPIN_STOP_AT = 4.45;     // was 5.55 — shorter pause after settle too

// Loading now happens in the standalone <Preloader> before the site —
// this is just a short breath before the unveiling begins.
const LOADER_DURATION = 0.35;

export function useIntroSequence({
  scrollTransformRef,
  curtainRef,
  smokeVideoRef,
  loaderRef,
  cornerTagRef,
  cornerCollectionRef,
  cornerFeatureRef,
  cornerStatusRef,
  wordmarkRef,
  taglineRef,
  prefersReducedMotion,
  enabled = true,   // false while the Preloader is still up — the unveiling waits
}) {
  // Intro disabled — the site loads directly on the resting hero.
  const [introActive, setIntroActive] = useState(false);
  const rafId = useRef(null);
  const spinningRef = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let last = performance.now();

    const spin = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (scrollTransformRef.current && spinningRef.current) {
        scrollTransformRef.current.rotY += dt * 1.2;
      }
      rafId.current = requestAnimationFrame(spin);
    };

    rafId.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  useEffect(() => {
    // The site LOADS DIRECTLY on the resting hero — no curtain, no
    // pendant-drop sequence. Land the pendant at rest and reveal the
    // wordmark + tagline with a soft entrance; the ambient auto-rotation
    // (the separate spin effect) keeps the pendant alive.
    const tf = scrollTransformRef.current;
    Object.assign(tf, HERO_REST);

    const tl = gsap.timeline();

    const letters = wordmarkRef.current?.querySelectorAll('.hero-letter');
    if (letters && letters.length) {
      tl.fromTo(
        letters,
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: 'power3.out' },
        0.15
      );
    }
    if (taglineRef.current) {
      tl.fromTo(taglineRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.5);
    }

    setIntroActive(false);

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return introActive;
}