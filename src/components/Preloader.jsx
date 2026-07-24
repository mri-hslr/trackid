// src/components/Preloader.jsx
// The standalone loading screen — runs BEFORE the story begins.
// OSOS-style: black void, iridescent bubbles, neon wordmark, and a
// counter that rides real page load: it eases to ~92 on its own, then
// snaps to 100 the moment the window finishes loading (3.5s failsafe),
// slides up like a curtain, and hands off via onComplete — which is
// what releases the hero's pendant-drop intro.
//
// Reduced motion: completes immediately, no animation.

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { COPY } from '../content/copy';
import { useReducedMotion } from '../hooks/useReducedMotion';
import IntroSmoke from './IntroSmoke';

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null);
  const finishedRef = useRef(false);
  const [pct, setPct] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const counter = { v: 0 };
    const render = () => setPct(Math.round(counter.v));

    // Phase 1 — ease toward 92 while the page actually loads behind us
    const crawl = gsap.to(counter, {
      v: 92,
      duration: 2.1,
      ease: 'power2.inOut',
      onUpdate: render,
    });

    // Phase 2 — complete + curtain lift (guarded against double-fire)
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      crawl.kill();
      gsap.to(counter, {
        v: 100,
        duration: 0.45,
        ease: 'power1.out',
        onUpdate: render,
        onComplete: () => {
          gsap.to(rootRef.current, {
            yPercent: -100,
            duration: 1.05,
            ease: 'power3.inOut',
            delay: 0.2,
            onComplete: () => onComplete?.(),
          });
        },
      });
    };

    // Fire when the real load lands — but never before the crawl has
    // had a beat (min 1.2s), and never later than the 3.5s failsafe.
    const minTimer = setTimeout(() => {
      if (document.readyState === 'complete') finish();
      else window.addEventListener('load', finish, { once: true });
    }, 1200);
    const failsafe = setTimeout(finish, 3500);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(failsafe);
      window.removeEventListener('load', finish);
      crawl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[80] overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 65% at 50% 42%, #170a13 0%, #0a040a 55%, #050205 100%)',
      }}
    >
      <IntroSmoke />

      {/* The wordmark + tagline — big and catchy, no glow */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <span className="font-display font-black text-ink text-7xl md:text-9xl lg:text-[11rem] tracking-tighter leading-none select-none">
          {COPY.hero.wordmark}
        </span>
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-kicker text-gold mt-6">
          Guardian Jewellery
        </span>
      </div>

      {/* Loading label — bottom left */}
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-12">
        <span className="font-mono text-[11px] md:text-xs uppercase tracking-kicker text-slate">
          Loading the story
        </span>
      </div>

      {/* The counter — bottom right, oversized */}
      <div className="absolute bottom-5 right-8 md:bottom-6 md:right-12 flex items-baseline gap-1">
        <span className="font-display font-bold text-6xl md:text-8xl text-ink/90 tabular-nums leading-none">
          {pct}
        </span>
        <span className="font-mono text-sm md:text-base text-gold">%</span>
      </div>
    </div>
  );
}
