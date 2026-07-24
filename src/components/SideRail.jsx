// src/components/SideRail.jsx
// OSOS-style fixed left rail + fullscreen chapter menu.
//   Rail (desktop): hamburger up top, the studio email written
//   vertically at the bottom, a hairline border — always present.
//   Mobile: just a floating menu button.
//   Menu: fullscreen overlay of giant chapter rows — alternating
//   outline/solid type that swaps on hover (menu-item CSS) — plus a
//   snake of "TRAKID — GUARDIAN JEWELLERY" flowing along an S-curve
//   on the right (SVG textPath). Click a row → Lenis-scroll to it.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COPY } from '../content/copy';
import { EASE } from '../motion/variants';

const chapters = COPY.story.nav;
const { email, snake } = COPY.story.rail;

const SNAKE_TEXT = Array(6).fill(snake).join('');

export default function SideRail() {
  const [open, setOpen] = useState(false);

  // lock scroll while the menu is open
  useEffect(() => {
    const lenis = window.lenis;
    if (open) lenis?.stop();
    else lenis?.start();
    return () => lenis?.start();
  }, [open]);

  const jumpTo = (id) => {
    setOpen(false);
    // wait a beat for the overlay to start leaving before scrolling
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (window.lenis) window.lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  return (
    <>
      {/* ---------- The side rail (desktop) — wider ---------- */}
      <div className="fixed left-0 top-0 bottom-0 w-20 z-[66] hidden lg:flex flex-col items-center justify-between py-8 border-r border-white/[0.08] bg-parchment/70 backdrop-blur-md">
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="group flex flex-col items-center gap-2.5"
        >
          <span className="flex flex-col justify-center gap-[6px] w-7">
            <span className={`block h-[2px] bg-ink transition-all duration-300 ${open ? 'w-7 rotate-45 translate-y-[8px]' : 'w-7'}`} />
            <span className={`block h-[2px] bg-ink transition-all duration-300 ${open ? 'opacity-0' : 'w-4 group-hover:w-7'}`} />
            <span className={`block h-[2px] bg-ink transition-all duration-300 ${open ? 'w-7 -rotate-45 -translate-y-[8px]' : 'w-7'}`} />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-premium text-ink">
            {open ? 'Close' : 'Menu'}
          </span>
        </button>

        <a
          href={`mailto:${email}`}
          className="font-mono text-[10px] uppercase tracking-premium text-slate hover:text-ink transition-colors duration-300 [writing-mode:vertical-rl] rotate-180"
        >
          {email}
        </a>
      </div>

      {/* ---------- Mobile menu button ---------- */}
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="fixed top-5 left-5 z-[66] lg:hidden glass-card rounded-full w-11 h-11 flex flex-col items-center justify-center gap-[4px]"
      >
        <span className={`block h-[2px] bg-ink transition-all duration-300 ${open ? 'w-4 rotate-45 translate-y-[6px]' : 'w-4'}`} />
        <span className={`block h-[2px] bg-ink transition-all duration-300 ${open ? 'opacity-0' : 'w-3'}`} />
        <span className={`block h-[2px] bg-ink transition-all duration-300 ${open ? 'w-4 -rotate-45 -translate-y-[6px]' : 'w-4'}`} />
      </button>

      {/* ---------- Fullscreen menu ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[65] bg-parchment overflow-hidden"
          >
            {/* ambience */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 60% at 40% 50%, rgba(42,17,34,0.7) 0%, transparent 75%)',
              }}
            />

            {/* the snake — brand text flowing along an S-curve */}
            <svg
              aria-hidden
              className="absolute right-0 top-0 h-full w-[38%] hidden md:block pointer-events-none"
              viewBox="0 0 400 800"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <path
                  id="snake-path"
                  d="M 380 -40 C 120 80 520 240 240 360 C -40 480 520 620 220 860"
                  fill="none"
                />
              </defs>
              <text className="fill-current text-slate" style={{ font: '600 15px JetBrains Mono, monospace', letterSpacing: '0.2em' }} opacity="0.7">
                <textPath href="#snake-path">{SNAKE_TEXT}</textPath>
              </text>
            </svg>

            {/* chapter rows */}
            <nav className="relative z-10 h-full flex flex-col justify-center pl-8 md:pl-36 pr-6 md:pr-[40%]">
              {chapters.map((c, i) => (
                <motion.button
                  key={c.id}
                  type="button"
                  onClick={() => jumpTo(c.id)}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.05 + i * 0.045 }}
                  className="group flex items-baseline gap-4 text-left border-b border-white/[0.07] py-2.5 md:py-3"
                >
                  <span className="font-mono text-[10px] text-gold/70 tabular-nums w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`menu-item ${i % 2 === 1 ? 'menu-item-solid' : ''} font-display font-bold uppercase tracking-tight text-3xl md:text-5xl leading-tight`}
                  >
                    {c.label}
                  </span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
