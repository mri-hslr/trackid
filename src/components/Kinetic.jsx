// src/components/Kinetic.jsx
// GSAP-homepage-style kinetic typography, in TrakID's brand palette.
// Two primitives, both driven by GSAP ScrollTrigger with scrub (scroll
// position IS the timeline — same mechanism as the Reveal section):
//
//   <KineticLine>      giant display text that reveals word-by-word as it
//                      scrolls into view; segments can be wrapped in
//                      rotated "sticker" chips (gold / pink / ghost).
//   <KineticParagraph> a paragraph whose words brighten one-by-one with
//                      scroll; accent words take the safe-green color.
//
// Reduced motion: both render their final state with no animation.

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Sticker chips — brand tokens only, no arbitrary colors.
const STICKER_STYLES = {
  gold:  'bg-gold text-parchment shadow-[0_6px_24px_rgba(201,166,107,0.35)]',
  pink:  'bg-accentDeep text-ink shadow-[0_6px_24px_rgba(168,28,75,0.35)]',
  safe:  'bg-safe text-parchment',
  ghost: 'glass-card text-slate',
};

// Alternating tilts give the tossed-sticker feel from the reference.
const STICKER_TILT = ['-rotate-3', 'rotate-2', '-rotate-2', 'rotate-3'];

/**
 * KineticLine — giant scroll-scrubbed display text.
 * @param {Array<{t: string, sticker?: 'gold'|'pink'|'safe'|'ghost'}>} segments
 */
export function KineticLine({ segments, className = '' }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll('.kw-inner');
    const tween = gsap.fromTo(
      words,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 42%',
          scrub: 0.6,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion]);

  let tilt = 0;

  return (
    <div ref={ref} className={className}>
      {segments.flatMap((seg, si) =>
        seg.t.split(' ').map((word, wi) => {
          const key = `${si}-${wi}`;
          const inner = seg.sticker ? (
            <span
              className={`kw-inner inline-block rounded-xl md:rounded-2xl px-[0.32em] py-[0.02em] ${
                STICKER_STYLES[seg.sticker]
              } ${STICKER_TILT[tilt++ % STICKER_TILT.length]}`}
            >
              {word}
            </span>
          ) : (
            <span className="kw-inner inline-block">{word}</span>
          );
          return (
            <span
              key={key}
              className="inline-block overflow-hidden align-bottom mr-[0.26em] pb-[0.1em]"
            >
              {inner}
            </span>
          );
        })
      )}
    </div>
  );
}

/**
 * KineticParagraph — words brighten with scroll; accent words go safe-green.
 * @param {string} text
 * @param {string[]} accents - exact words (with punctuation) to color
 */
export function KineticParagraph({ text, accents = [], className = '' }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll('.kp-word');
    const tween = gsap.fromTo(
      words,
      { opacity: 0.16 },
      {
        opacity: 1,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end: 'top 38%',
          scrub: 0.6,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={`kp-word ${accents.includes(word) ? 'text-safe' : ''}`}
        >
          {word}{' '}
        </span>
      ))}
    </p>
  );
}
