// Reveal.jsx
import { useEffect, useRef } from 'react';
import { COPY } from '../../content/copy';
import RevealScene2D from './RevealScene2D';
import TopographyBackground from '../../components/TopographyBackground';

const { eyebrow } = COPY.reveal;

export default function Reveal() {
  const progressRef = useRef(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const raw = Math.min(Math.max(scrolled / total, 0), 1);
      const p = Math.min(1, raw / 0.8);
      progressRef.current = p;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-parchment"
      style={{ height: '500vh' }}
    >
      <div className="relative isolate overflow-hidden sticky top-0 h-screen flex flex-col items-center justify-center gap-8 px-6">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <TopographyBackground />
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-accentDeep">
          {eyebrow}
        </span>

        <h2 className="font-display text-4xl md:text-6xl text-ink text-center leading-tight">
          Engineered to disappear.
        </h2>

        <p className="font-body text-sm text-slate text-center max-w-sm leading-relaxed">
          Every component chosen so your child forgets they're wearing it — and you never forget they're safe.
        </p>

        <RevealScene2D progressRef={progressRef} />

        <p className="font-mono text-xs text-slate/50 tracking-widest uppercase">
          5 components · one promise
        </p>

      </div>
    </section>
  );
}