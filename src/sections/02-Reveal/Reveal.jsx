import { useEffect, useRef, useState } from 'react';
import { COPY } from '../../content/copy';
import RevealScene2D from './RevealScene2D';

const { eyebrow } = COPY.reveal;

export default function Reveal() {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);

  // Temporary manual scroll driver — Harsha replaces this with GSAP ScrollTrigger
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(scrolled / total, 0), 1);
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-parchment"
      style={{ height: '300vh' }} // tall section so scroll has room
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-12 px-6">

        <span className="font-mono text-xs uppercase tracking-widest text-accentDeep">
          {eyebrow}
        </span>

        <RevealScene2D progress={progress} />

        {/* Scroll progress indicator — remove later */}
        <span className="font-mono text-xs text-slate/40">
          {Math.round(progress * 100)}%
        </span>

      </div>
    </section>
  );
}