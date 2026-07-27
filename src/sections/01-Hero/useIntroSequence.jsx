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
  const [introActive, setIntroActive] = useState(!prefersReducedMotion);
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
    if (prefersReducedMotion) {
      Object.assign(scrollTransformRef.current, HERO_REST);
      setIntroActive(false);
      return;
    }

    const tf = scrollTransformRef.current;

    tf.lightIntensity = HERO_REST.lightIntensity;
    tf.x = START_POSE.x;
    tf.y = START_POSE.y;
    tf.z = START_POSE.z;
    tf.rotX = START_POSE.rotX;
    tf.scale = START_POSE.scale;

    // Pendant parked above stage; the sequence itself waits for the
    // Preloader's handoff.
    if (!enabled) return;

    const tl = gsap.timeline({
      onComplete: () => setIntroActive(false),
    });

    // ── LOADER PHASE: 0 → 100, accelerate then decelerate.
    // Pendant/corner text stay untouched/invisible during this window —
    // the reveal timeline below doesn't start until LOADER_DURATION.
    // ── LOADER PHASE: hold at 0 briefly (breathing room), then
    // accelerate/decelerate up to 100. Pendant/corner text stay
    // untouched/invisible during this whole window.
    const HOLD_AT_ZERO = 0.9; // seconds sitting at "0" before counting starts
    const COUNT_DURATION = LOADER_DURATION - HOLD_AT_ZERO;

    const counter = { value: 0 };
    if (loaderRef.current) {
      // Nothing to tween during the hold — the number is already "0" on
      // mount — so this is just empty time on the timeline.
      tl.to(counter, {
        value: 100,
        duration: COUNT_DURATION,
        ease: 'power2.inOut',
        onUpdate: () => {
          loaderRef.current.textContent = Math.round(counter.value);
        },
      }, HOLD_AT_ZERO);

      // Quick fade-out right as it completes
      tl.to(loaderRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power1.out',
      }, LOADER_DURATION - 0.1);
    }

    // Smoke: quiet during loading, steps up to full reveal opacity
    // the moment the loader completes.
    if (smokeVideoRef.current) {
      tl.to(smokeVideoRef.current, {
        opacity: 0.2,
        duration: 0.5,
        ease: 'power2.out',
      }, LOADER_DURATION);
    }

    // ── Everything below is your existing reveal sequence, entirely
    // unchanged in its own internal timing — just shifted to start at
    // LOADER_DURATION instead of 0.
    const T = LOADER_DURATION;

    // Pendant: diagonal glide toward center (x/z/rotX/scale)
    // ── Pendant: diagonal glide toward center (x/z/rotX/scale) —
    // now spans the full, slower bounce window
    tl.to(tf, {
      x: CENTER_POSE.x,
      z: CENTER_POSE.z,
      rotX: CENTER_POSE.rotX,
      scale: CENTER_POSE.scale,
      duration: BOUNCE_SETTLE_AT,
      ease: 'power1.inOut',
    }, T + 0);

    // ── Pendant: the bounce itself — fall kept long enough to read as
    // real descent, everything after tightened back up
    tl.to(tf, { y: FLOOR_Y,       duration: 1.15, ease: 'power1.in'  }, T + 0.00); // initial fall
    tl.to(tf, { y: BOUNCE_PEAK_1, duration: 0.4,  ease: 'power2.out' }, T + 1.15); // bounce 1
    tl.to(tf, { y: FLOOR_Y,       duration: 0.35, ease: 'power1.in'  }, T + 1.55); // fall
    tl.to(tf, { y: BOUNCE_PEAK_2, duration: 0.35, ease: 'power2.out' }, T + 1.90); // bounce 2
    tl.to(tf, { y: FLOOR_Y,       duration: 0.3,  ease: 'power1.in'  }, T + 2.25); // small fall
    tl.to(tf, { y: CENTER_POSE.y, duration: 0.45, ease: 'power2.out' }, T + 2.55); // rise to center

    // Corner text: simple fades, staggered left-to-right
    if (cornerTagRef.current) {
      tl.to(cornerTagRef.current, { opacity: 1, duration: 0.6, ease: 'power1.out' }, T + 0.3);
      tl.to(cornerTagRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out' }, T + SPIN_STOP_AT);
    }
    if (cornerCollectionRef.current) {
      tl.to(cornerCollectionRef.current, { opacity: 1, duration: 0.6, ease: 'power1.out' }, T + 0.55);
      tl.to(cornerCollectionRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out' }, T + SPIN_STOP_AT);
    }
    if (cornerFeatureRef.current) {
      tl.to(cornerFeatureRef.current, { opacity: 1, duration: 0.6, ease: 'power1.out' }, T + 0.8);
      tl.to(cornerFeatureRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out' }, T + SPIN_STOP_AT);
    }
    if (cornerStatusRef.current) {
      tl.to(cornerStatusRef.current, { opacity: 1, duration: 0.6, ease: 'power1.out' }, T + 1.05);
      tl.to(cornerStatusRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out' }, T + SPIN_STOP_AT);
    }

    // Spin settle
    tl.call(() => {
      spinningRef.current = false;
      const current = tf.rotY;
      const target = Math.ceil(current / (Math.PI * 2)) * Math.PI * 2;
      gsap.to(tf, { rotY: target, duration: 1.2, ease: 'power3.inOut' });
    }, null, T + SPIN_STOP_AT);

    // Curtain slide + pendant settle into HERO_REST
    tl.to(curtainRef.current, { yPercent: -100, duration: 1.2, ease: 'power3.inOut' }, T + SPIN_STOP_AT);
    tl.to(tf, {
      x: HERO_REST.x,
      y: HERO_REST.y,
      z: HERO_REST.z,
      rotX: HERO_REST.rotX,
      scale: HERO_REST.scale,
      duration: 1.2,
      ease: 'power3.inOut',
    }, T + SPIN_STOP_AT);

    if (wordmarkRef.current) {
      // GSAP kinetic reveal — the wordmark's letters rise in, staggered.
      const letters = wordmarkRef.current.querySelectorAll('.hero-letter');
      if (letters.length) {
        tl.fromTo(
          letters,
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: 'power3.out' },
          T + SPIN_STOP_AT + 0.4
        );
      } else {
        tl.fromTo(wordmarkRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, T + SPIN_STOP_AT + 0.4);
      }
    }
    if (taglineRef.current) {
      tl.fromTo(taglineRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, T + SPIN_STOP_AT + 0.6);
    }

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, enabled]);

  return introActive;
}