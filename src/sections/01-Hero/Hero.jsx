// src/sections/01-Hero/Hero.jsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PendantScene from './PendantScene';
import AnimatedMeshBackground from './AnimatedMeshBackground';
import IntroCurtain from '../../components/IntroCurtain';
import { useIntroSequence } from './useIntroSequence';
import SoundToggle from '../../components/SoundToggle';
import { COPY } from '../../content/copy';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PIN_DISTANCE_VH = 550;

const PHASES = {
  scrollCue:    { start: 0.00, end: 0.04 },
  wordmark:     { start: 0.02, end: 0.15 },
  tagline:      { start: 0.04, end: 0.18 },
  pendantMove1: { start: 0.08, end: 0.33 },
  panel1:       { start: 0.34, end: 0.39 },
  panel1Exit:   { start: 0.52, end: 0.58 },
  pendantMove2: { start: 0.55, end: 0.80 },
  panel2:       { start: 0.82, end: 0.87 },
};

function phaseDuration(phase) {
  return phase.end - phase.start;
}

export default function Hero({ start = true }) {
  const prefersReducedMotion = useReducedMotion();

  const wrapperRef   = useRef(null);
  const sectionRef   = useRef(null);
  const wordmarkRef  = useRef(null);
  const taglineRef   = useRef(null);
  const scrollCueRef = useRef(null);
  const panelRef     = useRef(null);
  const panel2Ref    = useRef(null);

  // Intro-only refs
  const curtainRef       = useRef(null);
  const cornerTagRef     = useRef(null);
  const cornerStatusRef  = useRef(null);
  const cornerCollectionRef = useRef(null);
  const cornerFeatureRef    = useRef(null);
  const smokeVideoRef = useRef(null);
  const loaderRef     = useRef(null);

  const scrollTransformRef = useRef({
    x: 0,
    y: 1.5,
    z: 0,
    rotX: 0.2,
    rotY: 0,
    rotZ: 0,
    scale: 1,
    lightIntensity: 1,
  });

  const introActive = useIntroSequence({
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
    enabled: start,   // Preloader hands off → unveiling begins
  });

  // FIX: lock scroll during the intro, restore it after.
  // Without this, scrolling while the loader plays leaves the page
  // mid-scroll when the pin below is created — every ScrollTrigger on
  // the page then measures against the wrong layout and sections
  // appear frozen/stuck after the intro.
  useEffect(() => {
    const lenis = window.lenis;
    if (introActive) {
      lenis?.scrollTo(0, { immediate: true });
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, [introActive]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (introActive) return;

    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const tl = gsap.timeline();

    tl.to(scrollCueRef.current, { opacity: 0, y: 12, ease: 'power2.in', duration: phaseDuration(PHASES.scrollCue) }, PHASES.scrollCue.start);
    tl.to(wordmarkRef.current, { opacity: 0, y: -20, ease: 'power2.inOut', duration: phaseDuration(PHASES.wordmark) }, PHASES.wordmark.start);
    tl.to(taglineRef.current, { opacity: 0, y: -16, ease: 'power2.inOut', duration: phaseDuration(PHASES.tagline) }, PHASES.tagline.start);

    tl.to(
      scrollTransformRef.current,
      { x: -1.2, y: -0.2, rotY: Math.PI / 6, rotX: 0.1, scale: 1.5, ease: 'power2.inOut', duration: phaseDuration(PHASES.pendantMove1) },
      PHASES.pendantMove1.start
    );

    tl.fromTo(panelRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, ease: 'power2.out', duration: phaseDuration(PHASES.panel1) }, PHASES.panel1.start);
    tl.to(panelRef.current, { opacity: 0, x: 30, ease: 'power2.inOut', duration: phaseDuration(PHASES.panel1Exit) }, PHASES.panel1Exit.start);

    tl.to(
      scrollTransformRef.current,
      { x: 1.4, y: 0.2, rotY: -Math.PI / 4, rotX: -0.1, scale: 2.5, ease: 'power2.inOut', duration: phaseDuration(PHASES.pendantMove2) },
      PHASES.pendantMove2.start
    );

    tl.fromTo(panel2Ref.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, ease: 'power2.out', duration: phaseDuration(PHASES.panel2) }, PHASES.panel2.start);

    const scrollTrigger = ScrollTrigger.create({
      trigger: wrapper,
      pin: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      animation: tl,
    });

    // FIX: the pin above just inserted a 550vh spacer into the document —
    // every trigger measured before this moment (Reveal, kinetic chapters)
    // is now offset. Recalculate them all against the final layout.
    ScrollTrigger.refresh();

    return () => {
      scrollTrigger.kill();
      tl.kill();
    };
  }, [prefersReducedMotion, introActive]);

  const { showcase, showcaseSecondary } = COPY.hero;

  return (
    <div ref={wrapperRef} style={{ height: `${PIN_DISTANCE_VH}vh` }}>
      <section ref={sectionRef} id="hero" className="relative w-full h-screen overflow-hidden">
        <AnimatedMeshBackground />

        {/* The 3D Scene — elevated above the curtain (z-50) only during intro */}
        <div className={`absolute inset-0 ${introActive ? 'z-[55]' : ''}`}>
          <PendantScene scrollTransformRef={scrollTransformRef} />
        </div>

        {/* Curtain — hides text/panels until intro hands off. Smoke video
            and both corner text blocks now live INSIDE this component so
            they all move together when the curtain slides up. */}
        {introActive && (
          <IntroCurtain
            ref={curtainRef}
            smokeVideoRef={smokeVideoRef}
            loaderRef={loaderRef}
            cornerTagRef={cornerTagRef}
            cornerCollectionRef={cornerCollectionRef}
            cornerFeatureRef={cornerFeatureRef}
            cornerStatusRef={cornerStatusRef}
          />
        )}

        {/* HTML UI OVERLAYS */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-8 md:pb-12">
          {/* Main copy block — positioned at ~55% from top to sit below pendant */}
          <div className="flex flex-col items-center text-center mb-auto" style={{ marginTop: '52vh' }}>
            <h1
              ref={wordmarkRef}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
              className="font-display text-7xl md:text-[9rem] lg:text-[12rem] font-black text-white mb-5 tracking-tighter leading-none"
            >
              {COPY.hero.wordmark}
            </h1>
            <p
              ref={taglineRef}
              style={{ opacity: prefersReducedMotion ? 1 : 0 }}
              className="font-body text-base md:text-lg text-slate/90 max-w-md mx-auto drop-shadow-md px-6 leading-relaxed"
            >
              Beautiful enough to wear.<br />
              Smart enough to never lose.
            </p>
          </div>

          {/* Scroll cue — anchored at bottom */}
          <div ref={scrollCueRef} className="flex flex-col items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-kicker text-slate/70 font-semibold">
              {COPY.hero.scrollCue}
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent hero-scroll-line" />
          </div>
        </div>

        {/* Panel 1 */}
        <div
          ref={panelRef}
          className="absolute right-[8%] md:right-[12%] top-1/2 -translate-y-1/2 pointer-events-none max-w-xs md:max-w-sm"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{showcase.productName}</h2>
          <p className="font-body text-sm md:text-base text-slate mb-6 leading-relaxed">{showcase.description}</p>
          <div className="w-12 h-px bg-white/20 mb-5" />
          <div className="flex flex-col gap-2.5">
            {showcase.features.map((feature) => (
              <span key={feature} className="font-mono text-[10px] uppercase tracking-premium text-white/60 font-medium">{feature}</span>
            ))}
          </div>
        </div>

        {/* Panel 2 */}
        <div
          ref={panel2Ref}
          className="absolute left-[8%] md:left-[12%] top-1/2 -translate-y-1/2 pointer-events-none max-w-xs md:max-w-sm text-left"
          style={{ opacity: prefersReducedMotion ? 1 : 0 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{showcaseSecondary.productName}</h2>
          <p className="font-body text-sm md:text-base text-slate mb-6 leading-relaxed">{showcaseSecondary.description}</p>
          <div className="w-12 h-px bg-white/20 mb-5" />
          <div className="flex flex-col gap-2.5">
            {showcaseSecondary.features.map((feature) => (
              <span key={feature} className="font-mono text-[10px] uppercase tracking-premium text-white/60 font-medium">{feature}</span>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}