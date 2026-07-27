// src/components/StackCard.jsx
// Layered pinned-scroll card (the byholm/Orwell "sticky stack" effect),
// upgraded to a real card-deck feel:
//   · the card is `sticky top-0 h-screen`, so the next card slides up
//     and covers it
//   · as it gets covered, its INNER content parallaxes up, dims and
//     scales down slightly — so the hand-off has motion and depth
//     instead of a flat cover
//   · a lit top edge + upward shadow sell the card boundary
// Driven by GSAP ScrollTrigger (scrubbed) over the existing Lenis root.
// Reduced motion: static, no deck transform.

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function StackCard({
  children,
  className = '',
  bg,
  first = false,
  deck = true,
}) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !deck) return;
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    // As the next card scrolls up over this one, drift this card's
    // content up, fade and shrink it — a receding-into-the-deck motion.
    const tween = gsap.fromTo(
      inner,
      { yPercent: 0, scale: 1, opacity: 1, filter: 'brightness(1)' },
      {
        yPercent: -10,
        scale: 0.92,
        opacity: 0.35,
        filter: 'brightness(0.5)',
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top top',
          end: '+=90%',
          scrub: 0.5,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion, deck]);

  return (
    <div
      ref={cardRef}
      className={`sticky top-0 h-screen w-full overflow-hidden ${
        first ? '' : 'rounded-t-[2rem] md:rounded-t-[3rem] shadow-[0_-32px_70px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* lit top edge — the card boundary catches a thin gold light */}
      {!first && (
        <span
          aria-hidden
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent z-30 pointer-events-none"
        />
      )}
      <div
        ref={innerRef}
        className={`relative h-full w-full origin-top ${className}`}
        style={bg ? { background: bg } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
