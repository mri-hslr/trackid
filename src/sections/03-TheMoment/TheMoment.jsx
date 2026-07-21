// src/sections/03-TheMoment/TheMoment.jsx
// CHAPTER TWO — THE MOMENT (kinetic rebuild)
// GSAP-homepage-style scroll typography: a giant clock, then four huge
// lines that assemble word-by-word as the reader scrolls, with sticker
// chips on the words that matter. Scroll position drives everything.
// The fear planted here is resolved in Chapter Five (WatchedOver).

import { motion } from 'framer-motion';
import { COPY } from '../../content/copy';
import { fadeUp } from '../../motion/variants';
import ChapterMarker from '../../components/ChapterMarker';
import { KineticLine, KineticParagraph } from '../../components/Kinetic';

const { moment } = COPY.story;

export default function TheMoment() {
  return (
    <section id="the-moment" className="relative bg-parchment overflow-hidden">
      {/* Ambient dread — a faint cold glow, deliberately NOT the warm brand pink */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(30,20,40,0.55) 0%, transparent 70%)',
        }}
      />

      {/* Ghost chapter numeral — the book motif, barely there */}
      <span
        aria-hidden
        className="absolute top-16 left-1/2 -translate-x-1/2 font-display font-bold text-[38vw] md:text-[26vw] leading-none text-ink/[0.035] pointer-events-none select-none"
      >
        02
      </span>

      {/* Drifting brand orbs — depth behind the type */}
      <div aria-hidden className="absolute top-[30%] -left-24 w-72 h-72 rounded-full bg-accentDeep/15 blur-[100px] pointer-events-none" />
      <div aria-hidden className="absolute bottom-[15%] -right-20 w-80 h-80 rounded-full bg-gold/10 blur-[110px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-44">
        <div className="flex flex-col items-center mb-20 md:mb-28">
          <ChapterMarker className="mb-14">{moment.marker}</ChapterMarker>

          {/* Day tag — a small tossed sticker */}
          <motion.span
            {...fadeUp}
            className="glass-card inline-block rounded-full px-5 py-2 -rotate-3 font-mono text-[10px] md:text-xs uppercase tracking-premium text-slate mb-10"
          >
            {moment.day}
          </motion.span>

          {/* The clock — the chapter's single image, huge */}
          <KineticLine
            segments={moment.clock}
            className="font-display font-bold text-7xl md:text-9xl lg:text-[11rem] text-ink tracking-tight leading-none text-center tabular-nums"
          />
        </div>

        {/* The narration — giant lines assembling with scroll */}
        <div className="flex flex-col gap-24 md:gap-40 items-center text-center mb-28 md:mb-40">
          {moment.lines.map((segments, i) => (
            <KineticLine
              key={i}
              segments={segments}
              className="font-display font-bold text-4xl md:text-6xl lg:text-8xl text-ink tracking-tight leading-[1.12] max-w-6xl"
            />
          ))}
        </div>

        {/* The turn — words brighten as the reader arrives at the answer */}
        <div className="flex flex-col items-center text-center">
          <KineticParagraph
            text={moment.resolution}
            accents={moment.resolutionAccents}
            className="font-display text-2xl md:text-4xl font-semibold text-ink leading-snug max-w-3xl mb-14"
          />

          <motion.p
            {...fadeUp}
            className="font-mono text-[11px] md:text-xs uppercase tracking-kicker text-gold/80"
          >
            {moment.bridge}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
