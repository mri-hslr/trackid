// src/sections/04-TheBelief/TheBelief.jsx
// CHAPTER THREE — THE TRUTH (poster rebuild, site palette, dramatic)
// Full-bleed poster panels on the site's dark plum/parchment ground —
// NO stark white (bg-ink is #FFF in this project; posters use the same
// radial plum-over-parchment as every other chapter):
//   1. THESIS — big claim, four corner slogans, words punch up
//   2. THE DRIP — Removed / Hidden / Forgotten fall & melt away, then
//      ALWAYS WORN slams in with a gold shockwave
//   3. THE DIFFERENCE — a hard-tilting pledge card
//   4. THE QUOTE — closing line
// Reversible, reduced-motion safe.

import { motion } from 'framer-motion';
import { COPY } from '../../content/copy';
import { EASE } from '../../motion/variants';
import ChapterMarker from '../../components/ChapterMarker';
import CornerLabels from '../../components/CornerLabels';
import TiltedPoster from '../../components/TiltedPoster';

const { belief } = COPY.story;

// Shared dark poster ground — matches the rest of the site
const POSTER_BG = 'radial-gradient(ellipse 75% 60% at 50% 42%, #2a1122 0%, #14070e 45%, #050205 100%)';

const lineIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.6 },
  transition: { duration: 0.55, ease: EASE, delay: 0.2 },
};

// Headline: each word punches up from below with a blur + slight rotation
function DramaticHeadline({ segments, className }) {
  // flatten to words, remembering sticker
  const words = segments.flatMap((seg) =>
    seg.t.split(' ').map((w) => ({ w, sticker: seg.sticker }))
  );
  return (
    <motion.h2
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      transition={{ staggerChildren: 0.09 }}
      className={className}
    >
      {words.map(({ w, sticker }, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.22em] pb-[0.12em]">
          <motion.span
            variants={{
              hidden: { y: '115%', opacity: 0, rotate: 6, filter: 'blur(10px)' },
              show: { y: 0, opacity: 1, rotate: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
            }}
            className={`inline-block ${
              sticker === 'pink'
                ? 'sticker-shine rounded-xl md:rounded-2xl px-[0.3em] py-[0.02em] bg-accentDeep text-ink -rotate-2 shadow-[0_10px_40px_rgba(168,28,75,0.4)]'
                : sticker === 'gold'
                  ? 'sticker-shine rounded-xl md:rounded-2xl px-[0.3em] py-[0.02em] bg-gold text-parchment rotate-2 shadow-[0_10px_40px_rgba(201,166,107,0.4)]'
                  : 'text-ink'
            }`}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

export default function TheBelief() {
  const dripWords = belief.journey.slice(0, -1);
  const finalWord = belief.journey[belief.journey.length - 1];

  return (
    <section id="the-belief" className="relative">

      {/* ---------- Panel 1 · the thesis poster ---------- */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden text-center" style={{ background: POSTER_BG }}>
        <CornerLabels labels={belief.corners} tone="text-gold/60" />
        <span aria-hidden className="absolute top-14 right-4 md:right-16 font-display font-black text-[38vw] md:text-[22vw] leading-none text-ink/[0.04] pointer-events-none select-none">03</span>
        <div aria-hidden className="absolute -left-24 top-1/3 w-96 h-96 rounded-full bg-accentDeep/15 blur-[120px] pointer-events-none" />

        <ChapterMarker className="mb-10">{belief.marker}</ChapterMarker>
        <DramaticHeadline
          segments={belief.headline}
          className="font-display font-black tracking-tighter leading-[1.05] text-[8.5vw] md:text-[6vw] max-w-6xl"
        />
      </div>

      {/* ---------- Panel 2 · the drip ---------- */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden text-center" style={{ background: POSTER_BG }}>
        <motion.span {...lineIn} className="font-mono text-[11px] md:text-xs uppercase tracking-kicker text-slate mb-14">
          {belief.dripKicker}
        </motion.span>

        {/* the three fates — fall in, then melt */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.5 }}
          transition={{ staggerChildren: 0.22 }}
          className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-20"
        >
          {dripWords.map((w) => (
            <motion.span
              key={w}
              variants={{
                hidden: { opacity: 0, y: -40, rotate: -4, filter: 'blur(8px)' },
                show: { opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
              }}
              className="drip-word font-display font-black uppercase tracking-tight text-slate/60 text-[8vw] md:text-[4.5vw] leading-none"
            >
              {w}
            </motion.span>
          ))}
        </motion.div>

        {/* the one that stays — slams in with a gold shockwave */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.6 }}
          className="relative"
        >
          {/* shockwave ring */}
          <motion.span
            aria-hidden
            variants={{
              hidden: { scale: 0, opacity: 0.8 },
              show: { scale: 3.4, opacity: 0, transition: { duration: 1, ease: 'easeOut', delay: 0.15 } },
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-gold pointer-events-none"
          />
          <motion.span
            variants={{
              hidden: { scale: 2.2, opacity: 0, filter: 'blur(24px)' },
              show: { scale: 1, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="relative block font-display font-black uppercase tracking-tighter text-gold text-[14vw] md:text-[10vw] leading-none drop-shadow-[0_0_60px_rgba(201,166,107,0.45)]"
          >
            {finalWord}
          </motion.span>
        </motion.div>
      </div>

      {/* ---------- Panel 3 · the difference (tilted card) ---------- */}
      <div className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden" style={{ background: POSTER_BG }}>
        <TiltedPoster tilt={7} className="relative w-[80vw] max-w-lg aspect-[4/3] rounded-2xl overflow-hidden glass-card">
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 md:px-12"
            style={{ background: 'linear-gradient(150deg, rgba(168,28,75,0.28), rgba(201,166,107,0.16))' }}
          >
            <span className="font-mono text-[10px] uppercase tracking-kicker text-gold mb-6">{belief.pledge.kicker}</span>
            <p className="font-display font-bold text-ink text-2xl md:text-4xl leading-snug">
              {belief.pledge.line}
            </p>
          </div>
        </TiltedPoster>
      </div>

      {/* ---------- Panel 4 · the quote ---------- */}
      <div className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden text-center" style={{ background: POSTER_BG }}>
        <motion.blockquote
          initial={{ opacity: 0, scale: 1.15, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative z-10 max-w-3xl"
        >
          <p className="font-display text-2xl md:text-4xl italic text-ink leading-relaxed">
            “{belief.quote}”
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
