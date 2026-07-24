// src/sections/06D-TheVows/TheVows.jsx
// THE VOWS — OSOS-style poster statements, translated to TrakID.
// Four full-bleed "shouted" promises, each with its own stunt:
//   1. PEACE OF MIND — the white inversion (SATISFACTION move): the
//      dark site suddenly flips to a blinding white poster
//   2. ALWAYS ON — the split-color slab (ANTIDISCRIMINATORY move):
//      a deep-pink panel wipes in behind giant text spanning the seam
//   3. ENCRYPTED — the stamp wall (CONFIDENTIAL move): tilted rows of
//      repeated outline stamps drifting behind one quiet line
//   4. TICK TOCK — filled vs outline word pair for the 7-day battery
// All entrances are whileInView + scroll-scrubbed drifts, reversible.

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COPY } from '../../content/copy';
import { EASE } from '../../motion/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import CornerLabels from '../../components/CornerLabels';
import TiltedPoster from '../../components/TiltedPoster';

gsap.registerPlugin(ScrollTrigger);

const { vows } = COPY.story;

const wordPop = {
  initial: { opacity: 0, scale: 1.25, filter: 'blur(10px)' },
  whileInView: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  viewport: { once: false, amount: 0.5 },
  transition: { duration: 0.7, ease: EASE },
};

const lineIn = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.6 },
  transition: { duration: 0.55, ease: EASE, delay: 0.25 },
};

// Rows of drifting tilted stamps for the ENCRYPTED wall
function StampWall({ word }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const rows = ref.current?.querySelectorAll('.stamp-row');
    if (!rows?.length) return;
    const tweens = [...rows].map((row, i) =>
      gsap.fromTo(
        row,
        { xPercent: i % 2 ? -10 : -2 },
        {
          xPercent: i % 2 ? -2 : -10,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        }
      )
    );
    return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  }, [prefersReducedMotion]);

  const line = Array(6).fill(word).join('  ·  ');

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 -rotate-6 scale-125 flex flex-col justify-center gap-2 pointer-events-none select-none">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="stamp-row whitespace-nowrap font-display font-bold uppercase text-[9vw] leading-[0.95] text-outline opacity-60">
          {line}
        </div>
      ))}
    </div>
  );
}

export default function TheVows() {
  return (
    <section id="the-vows" className="relative">

      {/* ---------- VOW 1 · PEACE OF MIND — dark poster ---------- */}
      <div
        className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 42%, #2a1122 0%, #14070e 45%, #050205 100%)' }}
      >
        <CornerLabels labels={vows.peace.corners} tone="text-gold/60" />
        <div aria-hidden className="absolute -left-24 top-1/3 w-96 h-96 rounded-full bg-accentDeep/15 blur-[120px] pointer-events-none" />
        <motion.h2
          {...wordPop}
          className="font-display font-bold uppercase tracking-tight text-ink text-[11vw] md:text-[9vw] leading-[0.95] text-center"
        >
          {vows.peace.word}
        </motion.h2>
        <motion.p {...lineIn} className="font-body font-semibold text-slate text-base md:text-xl mt-8 text-center">
          {vows.peace.line}
        </motion.p>
      </div>

      {/* ---------- The Pledge — a tilted collage card ---------- */}
      <div className="relative bg-parchment min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(42,17,34,0.6) 0%, transparent 76%)' }}
        />
        <TiltedPoster tilt={-7} className="relative w-[78vw] max-w-md aspect-[3/4] rounded-2xl overflow-hidden glass-card">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
               style={{ background: 'linear-gradient(150deg, rgba(168,28,75,0.22), rgba(201,166,107,0.14))' }}>
            <span className="font-mono text-[10px] uppercase tracking-kicker text-gold mb-6">{vows.pledge.kicker}</span>
            <p className="font-display font-bold text-ink text-2xl md:text-3xl leading-snug">
              {vows.pledge.line}
            </p>
            <span className="mt-8 block w-[9px] h-[12px] bg-gold" style={{ borderRadius: '50% 50% 50% 4%' }} />
          </div>
        </TiltedPoster>
      </div>

      {/* ---------- VOW 2 · ALWAYS ON — the split slab ---------- */}
      <div className="relative bg-parchment min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* the pink panel wipes across behind the text */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-y-0 right-0 w-[68%] origin-right bg-accentDeep"
        />
        <CornerLabels labels={vows.always.corners} tone="text-ink/55" />
        <motion.h2
          {...wordPop}
          className="relative z-10 font-display font-bold uppercase tracking-tight text-ink text-[12vw] md:text-[9vw] leading-[0.95] text-center"
        >
          {vows.always.word}
        </motion.h2>
        <motion.p {...lineIn} className="relative z-10 font-body font-semibold text-ink/90 text-base md:text-xl mt-8 text-center">
          {vows.always.line}
        </motion.p>
      </div>

      {/* ---------- VOW 3 · ENCRYPTED — the stamp wall ---------- */}
      <div className="relative bg-parchment min-h-[92vh] flex items-center justify-center px-6 overflow-hidden">
        <CornerLabels labels={vows.encrypted.corners} tone="text-gold/60" />
        <StampWall word={vows.encrypted.word} />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(5,2,5,0.88) 0%, transparent 78%)' }}
        />
        <motion.p
          {...wordPop}
          className="relative z-10 font-display font-bold text-ink text-xl md:text-3xl lg:text-4xl text-center max-w-3xl leading-snug"
        >
          {vows.encrypted.line}
        </motion.p>
      </div>

      {/* ---------- VOW 4 · TICK TOCK — the word pair ---------- */}
      <div className="relative bg-parchment min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 60%, rgba(42,17,34,0.6) 0%, transparent 72%)' }}
        />
        <motion.span {...lineIn} className="relative z-10 font-mono text-[11px] md:text-xs uppercase tracking-kicker text-gold mb-8">
          {vows.time.label}
        </motion.span>
        <div className="relative z-10 flex items-baseline gap-[3vw]">
          <motion.span
            initial={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="font-display font-bold uppercase tracking-tight text-ink text-[13vw] md:text-[10vw] leading-none"
          >
            {vows.time.word1}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.12 }}
            className="text-outline-bright font-display font-bold uppercase tracking-tight text-[13vw] md:text-[10vw] leading-none"
          >
            {vows.time.word2}
          </motion.span>
        </div>
        <motion.p {...lineIn} className="relative z-10 font-body text-slate text-base md:text-xl mt-10 text-center">
          {vows.time.line}
        </motion.p>
      </div>
    </section>
  );
}
