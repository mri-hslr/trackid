// src/sections/01-Hero/Hero.jsx
// Scroll-driven product showcase wrapper.
//
// Current state:
//   - Full-viewport container, pinned via GSAP ScrollTrigger for ~550vh
//   - PendantScene (R3F canvas) fills the section, moving from center to left,
//     then left to right on cinematic curved paths.
//   - Wordmark + tagline fade out in staggered overlap
//   - Info panel 1 fades in on the right, then fades out later
//   - Info panel 2 fades in on the left when pendant arrives on the right
//   - Sound toggle stays interactive throughout
//   - Pendant rotation shifts subtly during travel, handled inside R3F
//   - Reduced-motion fallback skips all animation, shows final symmetric state
//
// The 3D mechanics (auto-rotation, cursor parallax, mobile fallback)
// live entirely inside PendantScene — this file only orchestrates
// the scroll timeline on the DOM layer and passes rotation coordinates to R3F.

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PendantScene from './PendantScene';
import SoundToggle from '../../components/SoundToggle';
import { COPY } from '../../content/copy';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════
// Scroll-showcase constants — tune these to adjust the scroll feel.
// All values are intentionally co-located for easy art-direction.
// ═══════════════════════════════════════════════════════════════════════

/** Total scroll runway in vh. The hero stays pinned for this distance. */
const PIN_DISTANCE_VH = 550;

/** Positions for the first showcase state (pendant left, panel right) */
const PENDANT_X_OFFSET_VW_1 = -25;
const PENDANT_ARC_PEAK_VH_1 = -3;
const PENDANT_ROTATE_Y_DEG_1 = 8;
const PENDANT_ROTATE_X_DEG_1 = -3;

/** Positions for the second showcase state (pendant right, panel left) */
const PENDANT_X_OFFSET_VW_2 = 25;
const PENDANT_ARC_PEAK_VH_2 = -3;
const PENDANT_ROTATE_Y_DEG_2 = -12;
const PENDANT_ROTATE_X_DEG_2 = 2;

/** Scrub smoothing — higher = more lag/weight, lower = snappier. */
const SCRUB_SMOOTHING = 1.2;

// ═══════════════════════════════════════════════════════════════════════
// Timeline phase boundaries (as fractions of total scroll progress 0→1).
// Overlapping ranges are deliberate — creates the cinematic feel.
// ═══════════════════════════════════════════════════════════════════════

const PHASES = {
  // Phase 1: Text departure
  scrollCue:    { start: 0.00, end: 0.04 },
  wordmark:     { start: 0.02, end: 0.15 },
  tagline:      { start: 0.04, end: 0.18 },

  // Phase 2: Pendant journey 1 (center to left)
  pendantX1:    { start: 0.08, end: 0.33 },
  pendantArc1:  { start: 0.10, end: 0.28 },
  pendantRot1:  { start: 0.11, end: 0.30 },

  // Phase 3: Panel 1 entrance (on right)
  panel1:       { start: 0.34, end: 0.39 },
  panel1Line1:  { start: 0.36, end: 0.41 },
  panel1Line2:  { start: 0.38, end: 0.43 },
  panel1Line3:  { start: 0.40, end: 0.45 },

  // Phase 4: Panel 1 departure
  panel1Exit:   { start: 0.52, end: 0.58 },

  // Phase 5: Pendant journey 2 (left to right)
  pendantX2:    { start: 0.55, end: 0.80 },
  pendantArc2:  { start: 0.57, end: 0.75 },
  pendantRot2:  { start: 0.58, end: 0.77 },

  // Phase 6: Panel 2 entrance (on left)
  panel2:       { start: 0.82, end: 0.87 },
  panel2Line1:  { start: 0.84, end: 0.89 },
  panel2Line2:  { start: 0.86, end: 0.91 },
  panel2Line3:  { start: 0.88, end: 0.93 },
};

// ═══════════════════════════════════════════════════════════════════════
// Helper — converts phase {start, end} to GSAP timeline position/duration
// relative to a total duration of 1 (normalized scroll progress).
// ═══════════════════════════════════════════════════════════════════════

function phaseDuration(phase) {
  return phase.end - phase.start;
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  // DOM refs for GSAP targeting
  const wrapperRef   = useRef(null);
  const sectionRef   = useRef(null);
  const pendantRef   = useRef(null);
  const wordmarkRef  = useRef(null);
  const taglineRef   = useRef(null);
  const scrollCueRef = useRef(null);
  
  // Panel 1 Refs
  const panelRef     = useRef(null);
  const panelLine0   = useRef(null);
  const panelLine1   = useRef(null);
  const featureRefs  = useRef([]);
  const setFeatureRef = useCallback((index) => (el) => {
    featureRefs.current[index] = el;
  }, []);

  // Panel 2 Refs
  const panel2Ref    = useRef(null);
  const panel2Line0  = useRef(null);
  const panel2Line1  = useRef(null);
  const feature2Refs = useRef([]);
  const setFeature2Ref = useCallback((index) => (el) => {
    feature2Refs.current[index] = el;
  }, []);

  // Rotation ref passed directly to R3F
  const scrollRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip all scroll animation for reduced-motion users
    if (prefersReducedMotion) return;

    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    // Master timeline — scrubbed to scroll progress (0 → 1)
    const tl = gsap.timeline();

    // ── Phase 1: Text departure ──────────────────────────────────
    // Scroll cue disappears quickly
    tl.fromTo(
      scrollCueRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: 12,
        ease: 'power2.in',
        duration: phaseDuration(PHASES.scrollCue),
      },
      PHASES.scrollCue.start
    );

    // Wordmark drifts up and fades
    tl.fromTo(
      wordmarkRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -20,
        ease: 'power2.inOut',
        duration: phaseDuration(PHASES.wordmark),
      },
      PHASES.wordmark.start
    );

    // Tagline follows slightly later
    tl.fromTo(
      taglineRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -16,
        ease: 'power2.inOut',
        duration: phaseDuration(PHASES.tagline),
      },
      PHASES.tagline.start
    );

    // ── Phase 2: Pendant journey 1 (Center to Left) ──────────────
    // Horizontal travel
    tl.fromTo(
      pendantRef.current,
      { xPercent: 0, x: 0 },
      {
        x: () => window.innerWidth * (PENDANT_X_OFFSET_VW_1 / 100),
        ease: 'power2.inOut',
        duration: phaseDuration(PHASES.pendantX1),
      },
      PHASES.pendantX1.start
    );

    // Vertical arc
    tl.fromTo(
      pendantRef.current,
      { y: 0 },
      {
        keyframes: [
          {
            y: () => window.innerHeight * (PENDANT_ARC_PEAK_VH_1 / 100),
            ease: 'sine.in',
            duration: phaseDuration(PHASES.pendantArc1) * 0.5,
          },
          {
            y: 0,
            ease: 'sine.out',
            duration: phaseDuration(PHASES.pendantArc1) * 0.5,
          },
        ],
      },
      PHASES.pendantArc1.start
    );

    // Orientation shift (Animated into a plain object, read continuously by R3F)
    tl.fromTo(
      scrollRotationRef.current,
      { y: 0, x: 0 },
      {
        y: PENDANT_ROTATE_Y_DEG_1 * (Math.PI / 180),
        x: PENDANT_ROTATE_X_DEG_1 * (Math.PI / 180),
        ease: 'power1.inOut',
        duration: phaseDuration(PHASES.pendantRot1),
      },
      PHASES.pendantRot1.start
    );

    // ── Phase 3: Panel 1 entrance ────────────────────────────────
    tl.fromTo(
      panelRef.current,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        ease: 'power2.out',
        duration: phaseDuration(PHASES.panel1),
      },
      PHASES.panel1.start
    );

    tl.fromTo(
      panelLine0.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: phaseDuration(PHASES.panel1Line1),
      },
      PHASES.panel1Line1.start
    );

    tl.fromTo(
      panelLine1.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: phaseDuration(PHASES.panel1Line2),
      },
      PHASES.panel1Line2.start
    );

    const features1 = featureRefs.current.filter(Boolean);
    if (features1.length > 0) {
      tl.fromTo(
        features1,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: phaseDuration(PHASES.panel1Line3),
          stagger: 0.02,
        },
        PHASES.panel1Line3.start
      );
    }

    // ── Phase 4: Panel 1 departure ───────────────────────────────
    tl.to(
      panelRef.current,
      {
        opacity: 0,
        x: 30, // Drift slightly right on exit
        ease: 'power2.inOut',
        duration: phaseDuration(PHASES.panel1Exit),
      },
      PHASES.panel1Exit.start
    );

    // ── Phase 5: Pendant journey 2 (Left to Right) ───────────────
    // Horizontal travel to the right
    tl.to(
      pendantRef.current,
      {
        x: () => window.innerWidth * (PENDANT_X_OFFSET_VW_2 / 100),
        ease: 'power2.inOut',
        duration: phaseDuration(PHASES.pendantX2),
      },
      PHASES.pendantX2.start
    );

    // Vertical arc
    tl.fromTo(
      pendantRef.current,
      { y: 0 },
      {
        keyframes: [
          {
            y: () => window.innerHeight * (PENDANT_ARC_PEAK_VH_2 / 100),
            ease: 'sine.in',
            duration: phaseDuration(PHASES.pendantArc2) * 0.5,
          },
          {
            y: 0,
            ease: 'sine.out',
            duration: phaseDuration(PHASES.pendantArc2) * 0.5,
          },
        ],
      },
      PHASES.pendantArc2.start
    );

    // Second orientation shift
    tl.to(
      scrollRotationRef.current,
      {
        y: PENDANT_ROTATE_Y_DEG_2 * (Math.PI / 180),
        x: PENDANT_ROTATE_X_DEG_2 * (Math.PI / 180),
        ease: 'power1.inOut',
        duration: phaseDuration(PHASES.pendantRot2),
      },
      PHASES.pendantRot2.start
    );

    // ── Phase 6: Panel 2 entrance (Left side) ────────────────────
    tl.fromTo(
      panel2Ref.current,
      { opacity: 0, x: -30 }, // Slide in gently from the left
      {
        opacity: 1,
        x: 0,
        ease: 'power2.out',
        duration: phaseDuration(PHASES.panel2),
      },
      PHASES.panel2.start
    );

    tl.fromTo(
      panel2Line0.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: phaseDuration(PHASES.panel2Line1),
      },
      PHASES.panel2Line1.start
    );

    tl.fromTo(
      panel2Line1.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: phaseDuration(PHASES.panel2Line2),
      },
      PHASES.panel2Line2.start
    );

    const features2 = feature2Refs.current.filter(Boolean);
    if (features2.length > 0) {
      tl.fromTo(
        features2,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: phaseDuration(PHASES.panel2Line3),
          stagger: 0.02,
        },
        PHASES.panel2Line3.start
      );
    }

    // ── ScrollTrigger — pins the hero and scrubs the timeline ────
    const scrollTrigger = ScrollTrigger.create({
      trigger: wrapper,
      pin: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: SCRUB_SMOOTHING,
      animation: tl,
    });

    // Recalculate dynamic values (vw/vh) on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scrollTrigger.kill();
      tl.kill();
    };
  }, [prefersReducedMotion]);

  // Showcase copy from centralized content
  const { showcase, showcaseSecondary } = COPY.hero;

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${PIN_DISTANCE_VH}vh` }}
    >
      <section
        ref={sectionRef}
        id="hero"
        className="relative w-full h-screen overflow-hidden bg-ink"
      >
        {/* R3F canvas — wrapped in a div for GSAP X/Y translation.
            Rotation is now passed directly into R3F via scrollRotationRef. */}
        <div
          ref={pendantRef}
          className="absolute inset-0"
        >
          <PendantScene scrollRotationRef={scrollRotationRef} />
        </div>

        {/* HTML overlay (wordmark, tagline, scroll cue, info panel) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between py-12 md:py-16">

          {/* Top bar (Sound Toggle) */}
          <div className="w-full px-6 flex justify-end pointer-events-auto">
            <SoundToggle />
          </div>

          {/* Center content — wordmark + tagline */}
          <div className="flex flex-col items-center text-center">
            <h1
              ref={wordmarkRef}
              className="font-display text-6xl md:text-8xl font-medium text-parchment mb-4 tracking-tight drop-shadow-xl"
            >
              {COPY.hero.wordmark}
            </h1>
            <p
              ref={taglineRef}
              className="font-body text-base md:text-lg text-parchment/80 max-w-md mx-auto drop-shadow-md px-6"
            >
              {COPY.hero.tagline}
            </p>
          </div>

          {/* Bottom scroll cue */}
          <div ref={scrollCueRef} className="flex flex-col items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-parchment/60">
              {COPY.hero.scrollCue}
            </span>
            {/* Subtle scroll line */}
            <div className="w-px h-12 bg-gradient-to-b from-parchment/60 to-transparent" />
          </div>
        </div>

        {/* ── Showcase Info Panel 1 (Right Side) ──────────────────── */}
        <div
          ref={panelRef}
          className="absolute right-[8%] md:right-[12%] top-1/2 -translate-y-1/2 pointer-events-none max-w-xs md:max-w-sm"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <h2
            ref={panelLine0}
            className="font-display text-2xl md:text-3xl font-medium text-parchment mb-3 tracking-tight"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            {showcase.productName}
          </h2>
          <p
            ref={panelLine1}
            className="font-body text-sm md:text-base text-parchment/70 mb-6 leading-relaxed"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            {showcase.description}
          </p>
          <div className="w-12 h-px bg-parchment/20 mb-5" />
          <div className="flex flex-col gap-2.5">
            {showcase.features.map((feature, i) => (
              <span
                key={feature}
                ref={setFeatureRef(i)}
                className="font-mono text-xs uppercase tracking-[0.2em] text-parchment/50"
                style={{ opacity: prefersReducedMotion ? 1 : 0 }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* ── Showcase Info Panel 2 (Left Side) ───────────────────── */}
        <div
          ref={panel2Ref}
          className="absolute left-[8%] md:left-[12%] top-1/2 -translate-y-1/2 pointer-events-none max-w-xs md:max-w-sm text-left"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <h2
            ref={panel2Line0}
            className="font-display text-2xl md:text-3xl font-medium text-parchment mb-3 tracking-tight"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            {showcaseSecondary.productName}
          </h2>
          <p
            ref={panel2Line1}
            className="font-body text-sm md:text-base text-parchment/70 mb-6 leading-relaxed"
            style={{ opacity: prefersReducedMotion ? 1 : 0 }}
          >
            {showcaseSecondary.description}
          </p>
          <div className="w-12 h-px bg-parchment/20 mb-5" />
          <div className="flex flex-col gap-2.5">
            {showcaseSecondary.features.map((feature, i) => (
              <span
                key={feature}
                ref={setFeature2Ref(i)}
                className="font-mono text-xs uppercase tracking-[0.2em] text-parchment/50"
                style={{ opacity: prefersReducedMotion ? 1 : 0 }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
