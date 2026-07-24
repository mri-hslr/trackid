// src/components/StoryProgress.jsx
// The global story spine. Two pieces, both driven by one scroll listener:
//   1. A thin gold progress bar across the top of the viewport — how far
//      through the whole story you are.
//   2. A fixed left rail of chapter dots (desktop only) — where you are,
//      with hover labels and click-to-jump via Lenis.
// Appears only after the reader leaves the hero, so the intro stays clean.
// Sections register themselves simply by carrying the id listed in
// COPY.story.nav — fully modular, no section imports anything.

import { useEffect, useRef, useState } from 'react';
import { COPY } from '../content/copy';

const chapters = COPY.story.nav;

export default function StoryProgress() {
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);
  const barRef = useRef(null);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      ticking.current = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      setVisible(window.scrollY > window.innerHeight * 0.6);

      // Active chapter = last section whose top passed the viewport middle
      let idx = -1;
      const mid = window.innerHeight * 0.5;
      for (let i = 0; i < chapters.length; i++) {
        const el = document.getElementById(chapters[i].id);
        if (el && el.getBoundingClientRect().top <= mid) idx = i;
      }
      setActive(idx);
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.lenis) window.lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Bottom progress bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-[67] h-[3px] pointer-events-none transition-opacity duration-700 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          ref={barRef}
          className="h-full origin-left bg-gradient-to-r from-gold/40 via-gold to-gold"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Left chapter rail — desktop only */}
      <nav
        aria-label="Story chapters"
        className={`fixed left-[92px] top-1/2 -translate-y-1/2 z-[60] hidden lg:flex flex-col items-center gap-4 transition-opacity duration-700 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
        {chapters.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => jumpTo(c.id)}
            className="group relative flex items-center focus:outline-none"
            aria-label={c.label}
          >
            <span
              className={`block w-2 h-2 rounded-full transition-all duration-500 ${
                i === active
                  ? 'bg-gold scale-150 shadow-[0_0_12px_rgba(201,166,107,0.8)]'
                  : i < active
                    ? 'bg-gold/50'
                    : 'bg-white/20 group-hover:bg-white/50'
              }`}
            />
            <span className="absolute left-5 whitespace-nowrap font-mono text-[10px] uppercase tracking-premium text-slate opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
              {c.label}
            </span>
          </button>
        ))}
        <span className="w-px h-8 bg-gradient-to-t from-transparent to-white/20" />
      </nav>
    </>
  );
}
