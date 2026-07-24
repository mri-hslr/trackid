// src/sections/03-TheMoment/TheMoment.jsx
// CHAPTER TWO — THE MOMENT (poster rebuild, matching The Vows style)
// The twelve minutes told as full-bleed "shouted" poster panels, each
// with its own stunt — the same visual language as the post-chapter-6
// Vows run, but cold and escalating:
//   1. "3:42 PM" — giant timestamp poster, eyebrow "A Tuesday"
//   2. the four beats, each a big line that pops in on its own panel
//   3. "SHE ISN'T HOME YET" — the split-slab stunt in brand pink
//   4. NOTHING / EVERYTHING — filled vs outline word pair
//   5. the resolution + bridge, quiet close
// whileInView + scroll-scrubbed, fully reversible, reduced-motion safe.

import { motion } from 'framer-motion';
import { COPY } from '../../content/copy';
import { EASE } from '../../motion/variants';
import ChapterMarker from '../../components/ChapterMarker';
import CornerLabels from '../../components/CornerLabels';
import { KineticParagraph } from '../../components/Kinetic';

const { moment } = COPY.story;

const wordPop = {
  initial: { opacity: 0, scale: 1.22, filter: 'blur(10px)' },
  whileInView: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  viewport: { once: false, amount: 0.5 },
  transition: { duration: 0.7, ease: EASE },
};

const lineIn = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.6 },
  transition: { duration: 0.55, ease: EASE, delay: 0.2 },
};

// Render a segment array as text with inline sticker chips
function Segments({ segments }) {
  return segments.map((seg, i) => (
    <span
      key={i}
      className={
        seg.sticker === 'pink'
          ? 'text-accentDeep'
          : seg.sticker === 'ghost'
            ? 'text-slate'
            : ''
      }
    >
      {seg.t}
      {i < segments.length - 1 ? ' ' : ''}
    </span>
  ));
}

// Escalating type scale for the four beats
const BEAT_SIZE = [
  'text-[9vw] md:text-[7vw]',
  'text-[9vw] md:text-[7vw]',
  'text-[10vw] md:text-[8vw]',
  'text-[12vw] md:text-[9vw]',
];

export default function TheMoment() {
  return (
    <section id="the-moment" className="relative">

      {/* ---------- Panel 1 · the timestamp ---------- */}
      <div className="relative bg-parchment min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(30,20,40,0.6) 0%, transparent 72%)' }}
        />
        <span aria-hidden className="absolute top-14 left-1/2 -translate-x-1/2 font-display font-black text-[40vw] md:text-[24vw] leading-none text-ink/[0.035] pointer-events-none select-none">02</span>
        <CornerLabels labels={{ tl: 'School’s Out', tr: 'Home By Four', bl: 'Twelve Minutes', br: 'Every Parent Knows' }} tone="text-slate/50" />

        <ChapterMarker className="mb-8">{moment.marker}</ChapterMarker>
        <motion.span {...lineIn} className="font-mono text-[11px] md:text-xs uppercase tracking-kicker text-slate mb-6">
          {moment.day}
        </motion.span>
        <motion.h2 {...wordPop} className="font-display font-black text-ink text-[24vw] md:text-[18vw] leading-none tracking-tighter tabular-nums">
          3:42<span className="text-gold">.</span>
        </motion.h2>
        <motion.p {...lineIn} className="font-body font-semibold text-slate text-base md:text-xl mt-8">
          The twelve minutes every parent knows.
        </motion.p>
      </div>

      {/* ---------- Panels 2 · the four beats ---------- */}
      {moment.beats.map((beat, i) => (
        <div
          key={beat.time}
          className="relative bg-parchment min-h-[88vh] flex flex-col items-center justify-center px-6 overflow-hidden text-center"
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                i === moment.beats.length - 1
                  ? 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(168,28,75,0.15) 0%, rgba(201,166,107,0.05) 45%, transparent 78%)'
                  : 'radial-gradient(ellipse 65% 50% at 50% 45%, rgba(30,20,40,0.5) 0%, transparent 72%)',
            }}
          />
          <motion.span {...lineIn} className="font-mono text-xs md:text-sm uppercase tracking-kicker text-gold tabular-nums mb-8">
            {beat.time}
          </motion.span>
          <motion.h3
            {...wordPop}
            className={`font-display font-black text-ink tracking-tighter leading-[0.98] max-w-6xl ${BEAT_SIZE[i]}`}
          >
            <Segments segments={beat.segments} />
          </motion.h3>
        </div>
      ))}

      {/* ---------- Panel 3 · the split-slab climax ---------- */}
      <div className="relative bg-parchment min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-y-0 left-0 w-[66%] origin-left bg-accentDeep"
        />
        <motion.h2
          {...wordPop}
          className="relative z-10 font-display font-black uppercase tracking-tighter text-ink text-[13vw] md:text-[10vw] leading-[0.9] text-center"
        >
          She isn’t<br />home yet.
        </motion.h2>
      </div>

      {/* ---------- Panel 4 · nothing / everything (both fly in from the right) ----------
           A STATIC wrapper is what triggers whileInView (it never moves, so it
           reliably enters view); the two lines slide in via variants. Without
           this, animating each line's own x pushed it off-screen and its
           in-view trigger never fired — leaving the text invisible. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        className="relative bg-parchment min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden gap-6 md:gap-12"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(42,17,34,0.6) 0%, transparent 74%)' }}
        />

        {/* "nothing." — slides in from the right, dim and struck through */}
        <motion.h2
          variants={{
            hidden: { opacity: 0, x: 220, filter: 'blur(12px)' },
            show:   { opacity: 0.55, x: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
          }}
          className="relative z-10 font-display font-black uppercase tracking-tighter text-slate text-[11vw] md:text-[8vw] leading-none text-center"
        >
          Twelve minutes is{' '}
          <span className="relative inline-block">
            nothing.
            <motion.span
              aria-hidden
              variants={{
                hidden: { scaleX: 0 },
                show:   { scaleX: 1, transition: { duration: 0.5, ease: EASE, delay: 0.7 } },
              }}
              className="absolute left-0 right-0 top-1/2 h-[4px] bg-slate origin-left rounded-full"
            />
          </span>
        </motion.h2>

        {/* "everything." — slides in from further right, later, bigger, gold */}
        <motion.h2
          variants={{
            hidden: { opacity: 0, x: 320, filter: 'blur(14px)' },
            show:   { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: EASE, delay: 0.4 } },
          }}
          className="relative z-10 font-display font-black uppercase tracking-tighter text-ink text-[13vw] md:text-[9.5vw] leading-none text-center"
        >
          Twelve minutes is{' '}
          <motion.span
            variants={{
              hidden: { scale: 0.8, color: 'rgb(201,166,107)' },
              show:   { scale: 1, transition: { duration: 0.6, ease: EASE, delay: 1.05 } },
            }}
            className="text-gold inline-block"
          >
            everything.
          </motion.span>
        </motion.h2>
      </motion.div>

      {/* ---------- Panel 5 · the quiet turn ---------- */}
      <div className="relative bg-parchment min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
        <KineticParagraph
          text={moment.resolution}
          accents={moment.resolutionAccents}
          className="font-display text-2xl md:text-4xl font-semibold text-ink leading-snug max-w-3xl mb-12"
        />
        <motion.p {...lineIn} className="font-mono text-[11px] md:text-xs uppercase tracking-kicker text-gold/80">
          {moment.bridge}
        </motion.p>
      </div>
    </section>
  );
}
