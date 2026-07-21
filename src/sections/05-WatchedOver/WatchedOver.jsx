// src/sections/05-WatchedOver/WatchedOver.jsx
// CHAPTER FIVE — THE DAY, WATCHED OVER
// The payoff of Chapter Two. The same Tuesday retold as a timeline of
// five moments, each one moving a quiet dot across a stylized map.
// Auto-advances every few seconds; clicking a moment jumps to it.
// No maps API — an illustrated SVG scene, on-brand and lightweight.

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing } from 'lucide-react';
import { COPY } from '../../content/copy';
import { fadeUp, EASE } from '../../motion/variants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import ChapterMarker from '../../components/ChapterMarker';
import MapScene from './MapScene';

const { watchedOver } = COPY.story;
const ADVANCE_MS = 4200;

export default function WatchedOver() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  // Auto-advance through the day; restart the timer whenever the user
  // takes over by clicking a moment.
  useEffect(() => {
    if (prefersReducedMotion) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % watchedOver.events.length);
    }, ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, [prefersReducedMotion, activeIndex]);

  const activeEvent = watchedOver.events[activeIndex];

  return (
    <section id="watched-over" className="relative bg-parchment overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 70% 45%, rgba(168,28,75,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-40">
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <ChapterMarker className="mb-10">{watchedOver.marker}</ChapterMarker>
          <motion.h2
            {...fadeUp}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-tight max-w-3xl mb-6"
          >
            {watchedOver.headline}
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="font-body text-base md:text-lg text-slate max-w-xl leading-relaxed"
          >
            {watchedOver.subhead}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* THE TIMELINE — the day as five moments */}
          <motion.div {...fadeUp} className="lg:col-span-2 flex flex-col">
            {watchedOver.events.map((event, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={event.time}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="group relative flex gap-5 text-left focus:outline-none"
                >
                  {/* Rail + node */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1.5 w-3 h-3 rounded-full border transition-all duration-500 flex-shrink-0 ${
                        isActive
                          ? 'bg-gold border-gold shadow-[0_0_14px_rgba(201,166,107,0.6)]'
                          : 'bg-transparent border-white/25 group-hover:border-gold/50'
                      }`}
                    />
                    {i < watchedOver.events.length - 1 && (
                      <span className="w-px flex-1 bg-gradient-to-b from-white/20 to-white/5" />
                    )}
                  </div>

                  {/* Copy */}
                  <div className={`pb-8 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-45 group-hover:opacity-75'}`}>
                    <span className="font-mono text-[11px] uppercase tracking-premium text-gold tabular-nums">
                      {event.time}
                    </span>
                    <h3 className="font-display text-lg md:text-xl font-semibold text-ink mt-1 mb-1.5">
                      {event.title}
                    </h3>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="font-body text-sm text-slate leading-relaxed max-w-xs overflow-hidden"
                        >
                          {event.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* THE MAP — one quiet dot */}
          <motion.div {...fadeUp} className="lg:col-span-3">
            <div className="glass-card rounded-[28px] p-3 md:p-4">
              <MapScene
                activeState={activeEvent.state}
                labels={watchedOver.mapLabels}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </motion.div>
        </div>

        {/* SOS — the promise beneath the promise */}
        <motion.div
          {...fadeUp}
          className="mt-16 md:mt-20 max-w-2xl mx-auto glass-card glass-card-hover rounded-3xl px-8 py-7 flex items-start gap-5"
        >
          <div className="glass-icon w-12 h-12 flex-shrink-0">
            <BellRing className="w-5 h-5 text-alert" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink mb-1.5">
              {watchedOver.sos.label}
            </h3>
            <p className="font-body text-sm text-slate leading-relaxed">
              {watchedOver.sos.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
