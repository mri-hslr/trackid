// src/sections/04-TheBelief/TheBelief.jsx
// CHAPTER THREE — THE TRUTH (kinetic rebuild)
// The thesis lands GSAP-homepage-style: a giant headline assembling
// word-by-word with sticker chips ("refuses" / "no one."), a paragraph
// that brightens with scroll, then the fate-of-a-gadget stickers —
// Removed, Hidden, Forgotten struck out, "Always worn" in gold.

import { motion } from 'framer-motion';
import { COPY } from '../../content/copy';
import { fadeUp, staggerContainer, EASE } from '../../motion/variants';
import ChapterMarker from '../../components/ChapterMarker';
import { KineticLine, KineticParagraph } from '../../components/Kinetic';

const { belief } = COPY.story;

const TILTS = [-4, 3, -3, 2];

const stickerPop = (tilt) => ({
  initial: { opacity: 0, scale: 0.6, rotate: tilt + 10 },
  whileInView: { opacity: 1, scale: 1, rotate: tilt },
  transition: { duration: 0.5, ease: EASE },
});

export default function TheBelief() {
  const lastIndex = belief.journey.length - 1;

  return (
    <section id="the-belief" className="relative bg-parchment overflow-hidden">
      {/* Warm brand glow returns — the answer, after the cold of Chapter Two */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 60%, rgba(168,28,75,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Ghost chapter numeral */}
      <span
        aria-hidden
        className="absolute top-16 right-4 md:right-16 font-display font-bold text-[38vw] md:text-[24vw] leading-none text-ink/[0.035] pointer-events-none select-none"
      >
        03
      </span>

      {/* Drifting brand orbs */}
      <div aria-hidden className="absolute top-[20%] -right-24 w-72 h-72 rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
      <div aria-hidden className="absolute bottom-[20%] -left-20 w-80 h-80 rounded-full bg-accentDeep/15 blur-[110px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-44 flex flex-col items-center text-center">
        <ChapterMarker className="mb-16">{belief.marker}</ChapterMarker>

        {/* The thesis — giant, assembling with scroll */}
        <KineticLine
          segments={belief.headline}
          className="font-display font-bold text-4xl md:text-6xl lg:text-8xl text-ink tracking-tight leading-[1.12] max-w-6xl mb-16 md:mb-20"
        />

        {/* The reasoning — brightens as the reader moves through it */}
        <KineticParagraph
          text={belief.body}
          accents={belief.bodyAccents}
          className="font-display text-xl md:text-3xl text-ink leading-relaxed max-w-3xl mb-24 md:mb-32"
        />

        {/* The fate of every gadget — tossed stickers, last one gold */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-wrap items-center justify-center gap-5 md:gap-8 mb-24 md:mb-28"
        >
          {belief.journey.map((step, i) => {
            const tilt = TILTS[i % TILTS.length];
            const isLast = i === lastIndex;
            return (
              <motion.span
                key={step}
                variants={stickerPop(tilt)}
                className={
                  isLast
                    ? 'inline-block rounded-2xl bg-gold text-parchment px-8 md:px-10 py-4 md:py-5 font-display font-bold text-xl md:text-3xl shadow-[0_10px_40px_rgba(201,166,107,0.35)]'
                    : 'glass-card inline-block rounded-2xl px-6 md:px-8 py-3 md:py-4 font-display font-semibold text-lg md:text-2xl text-slate line-through decoration-slate/60'
                }
              >
                {step}
              </motion.span>
            );
          })}
        </motion.div>

        {/* The quote that carries into the collection chapter */}
        <motion.blockquote {...fadeUp} className="max-w-2xl">
          <p className="font-display text-xl md:text-2xl italic text-ink/90 leading-relaxed">
            “{belief.quote}”
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
