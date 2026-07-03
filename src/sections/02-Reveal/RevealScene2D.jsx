// RevealScene2D.jsx
import { useEffect, useRef } from 'react';
import useCursorParallax from './useCursorParallax';

const PIECES = [
  { key: 'back',    src: '/assets/images/piece-back.png',    finalX: -300, label: 'Shell' },
  { key: 'inner',   src: '/assets/images/piece-inner.png',   finalX: -150, label: 'Inner Casing' },
  { key: 'pcb',     src: '/assets/images/piece-pcb.png',     finalX: 0,    label: 'PCB' },
  { key: 'battery', src: '/assets/images/piece-battery.png', finalX: 150,  label: 'Battery' },
  { key: 'front',   src: '/assets/images/piece-front.png',   finalX: 300,  label: 'Front Shell' },
];

export default function RevealScene2D({ progressRef }) {
  const pieceRefs = useRef([]);
  const labelRefs = useRef([]);
  const currentX = useRef(PIECES.map(() => 0));
  const currentScale = useRef(1);
  const currentCursorX = useRef(0);
  const currentCursorY = useRef(0);
  const rafRef = useRef(null);
  const cursorRef = useCursorParallax(true);

  useEffect(() => {
    function animate() {
      const p = progressRef.current;
      const cursor = cursorRef.current;

      currentCursorX.current += (cursor.x - currentCursorX.current) * 0.15;
      currentCursorY.current += (cursor.y - currentCursorY.current) * 0.15;
      currentScale.current += ((1 + currentCursorY.current * 0.03) - currentScale.current) * 0.15;

      PIECES.forEach((piece, i) => {
        const baseTargetX = piece.finalX * p;
        const depthMultiplier = 0.7 + (i + 1) * 0.12;
        const cursorDrift = currentCursorX.current * depthMultiplier * 22;
        const targetX = baseTargetX + cursorDrift;

        const lerpSpeed = 0.18 + i * 0.02;
        currentX.current[i] += (targetX - currentX.current[i]) * lerpSpeed;

        const el = pieceRefs.current[i];
        if (!el) return;

        el.style.transform = `translateX(${currentX.current[i]}px) scale(${currentScale.current})`;

        if (piece.key === 'front') {
          el.style.opacity = 1;
        } else {
          el.style.opacity = Math.min(1, p * 2);
        }
      });

      labelRefs.current.forEach((el) => {
        if (!el) return;
        const labelOpacity = Math.min(1, Math.max(0, (p - 0.7) / 0.3));
        el.style.opacity = labelOpacity;
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center" style={{ height: '380px' }}>

      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(157,180,199,0.12) 0%, transparent 70%)',
        }}
      />

      {PIECES.map((piece, i) => (
        <div
          key={piece.key}
          className="absolute flex flex-col items-center"
          ref={el => pieceRefs.current[i] = el}
          style={{ opacity: piece.key === 'front' ? 1 : 0, willChange: 'transform, opacity' }}
        >
          <img
            src={piece.src}
            alt={piece.label}
            className="h-64 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          />
          <span
            ref={el => labelRefs.current[i] = el}
            className="font-mono text-xs uppercase tracking-widest text-accentDeep whitespace-nowrap mt-4"
            style={{ opacity: 0 }}
          >
            {piece.label}
          </span>
        </div>
      ))}

    </div>
  );
}