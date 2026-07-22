// src/sections/06C-Constellation/Constellation.jsx
// INTERLUDE — THE CONSTELLATION (immersive rebuild)
// TrakID's answer to the OSOS particle key: a true-3D teardrop pendant
// built from ~1000 luminous dots, slowly revolving in space. Scrolling
// assembles it from stardust, carries three statements through it, and
// re-tints the whole constellation per statement (silver → gold → safe).
// The cursor tilts the pendant — same weighted feel as the hero.
//
// Theme-matched: ChapterMarker eyebrow, brand glows, mono labels,
// gold progress rail. Canvas 2D with additive blending — no WebGL.

import { useRef, useEffect, useMemo } from 'react';
import { COPY } from '../../content/copy';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import ChapterMarker from '../../components/ChapterMarker';

const { marker, statements } = COPY.story.constellation;

const WRAPPER_VH = 340;
const SHELL_PARTICLES = 880;
const GEM_PARTICLES = 150;
const LINE_DIST = 0.085;         // 3D distance threshold for constellation lines
const MAX_LINES = 260;
const PERSPECTIVE = 3.2;

const COLOR_FOR = {
  silver: [186, 188, 198],
  gold:   [201, 166, 107],
  safe:   [52, 211, 153],
};
const GEM_COLOR = [214, 51, 108]; // brightened accentDeep for luminosity
const LABEL_CLASS = { silver: 'text-slate', gold: 'text-gold', safe: 'text-safe' };

const rand = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

// Piriform (teardrop) profile revolved around the vertical axis → 3D shell.
function shellPoint(i) {
  const t = rand(i, 1) * Math.PI * 2;          // profile parameter
  const phi = rand(i, 2) * Math.PI * 2;        // revolution angle
  const s = 0.72 + Math.pow(rand(i, 3), 1.6) * 0.28; // hug the surface
  const radius = Math.abs((1 + Math.sin(t)) * Math.cos(t)) * 0.6 * s;
  const y = (0.6 - (1 + Math.sin(t)) * 0.5) * s;
  return { x: Math.cos(phi) * radius, y, z: Math.sin(phi) * radius };
}

export default function Constellation() {
  const wrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const statementRefs = useRef([]);
  const railRefs = useRef([]);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  // ---- Particle field + precomputed constellation lines (built once) ----
  const { particles, lines } = useMemo(() => {
    const pts = [];
    for (let i = 0; i < SHELL_PARTICLES; i++) {
      const p = shellPoint(i);
      pts.push({
        ...p,
        // scattered "stardust" origin, far outside the pendant
        sx: (rand(i, 4) - 0.5) * 4.2,
        sy: (rand(i, 5) - 0.5) * 3.2,
        sz: (rand(i, 6) - 0.5) * 4.2,
        phase: rand(i, 7) * Math.PI * 2,
        speed: 0.4 + rand(i, 8) * 1.3,
        size: 0.55 + rand(i, 9) * 1.5,
        alpha: 0.3 + rand(i, 10) * 0.7,
        gem: false,
      });
    }
    // The sapphire — a dense luminous core in the drop's belly
    for (let i = 0; i < GEM_PARTICLES; i++) {
      const a = rand(i, 11) * Math.PI * 2;
      const b = Math.acos(2 * rand(i, 12) - 1);
      const r = Math.pow(rand(i, 13), 0.55) * 0.14;
      pts.push({
        x: Math.sin(b) * Math.cos(a) * r,
        y: 0.14 + Math.cos(b) * r,
        z: Math.sin(b) * Math.sin(a) * r,
        sx: (rand(i, 14) - 0.5) * 4.2,
        sy: (rand(i, 15) - 0.5) * 3.2,
        sz: (rand(i, 16) - 0.5) * 4.2,
        phase: rand(i, 17) * Math.PI * 2,
        speed: 0.8 + rand(i, 18) * 1.8,
        size: 0.7 + rand(i, 19) * 1.6,
        alpha: 0.5 + rand(i, 20) * 0.5,
        gem: true,
      });
    }

    // Nearby shell pairs become faint constellation lines
    const pairs = [];
    for (let a = 0; a < SHELL_PARTICLES && pairs.length < MAX_LINES; a += 2) {
      for (let b = a + 1; b < SHELL_PARTICLES && pairs.length < MAX_LINES; b += 3) {
        const dx = pts[a].x - pts[b].x;
        const dy = pts[a].y - pts[b].y;
        const dz = pts[a].z - pts[b].z;
        if (dx * dx + dy * dy + dz * dz < LINE_DIST * LINE_DIST) pairs.push([a, b]);
      }
    }
    return { particles: pts, lines: pairs };
  }, []);

  // ---- Scroll progress (rect-based, Lenis-friendly) ----
  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      progressRef.current = Math.min(Math.max(-rect.top / total, 0), 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---- Cursor parallax (weighted, like the hero) ----
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [prefersReducedMotion]);

  // ---- Render loop ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = null;
    let running = false;

    const current = [...COLOR_FOR[statements[0].color]];
    const rot = { y: 0, x: 0.12 };            // eased rotation state
    const projected = new Float32Array(particles.length * 3); // x, y, depthFactor

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const sizeCanvas = () => {
      const box = canvas.getBoundingClientRect();
      canvas.width = box.width * dpr;
      canvas.height = box.height * dpr;
    };
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    const draw = (now) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const p = progressRef.current;
      const time = prefersReducedMotion ? 0 : now * 0.001;
      const form = prefersReducedMotion ? 1 : smoothstep(0.0, 0.16, p);   // stardust → pendant
      const idx = Math.min(statements.length - 1, Math.floor(p * statements.length));
      const target = COLOR_FOR[statements[idx].color];
      for (let c = 0; c < 3; c++) current[c] += (target[c] - current[c]) * 0.05;

      // Statements + progress rail
      statementRefs.current.forEach((el, i) => {
        if (!el) return;
        const band = 1 / statements.length;
        const center = band * (i + 0.5);
        const o = prefersReducedMotion
          ? (i === 0 ? 1 : 0)
          : Math.max(0, 1 - Math.abs(p - center) / (band * 0.52));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((1 - o) * 18).toFixed(1)}px)`;
      });
      railRefs.current.forEach((el, i) => {
        if (!el) return;
        const active = i === idx;
        const [r, g, b] = active ? target : [255, 255, 255];
        el.style.backgroundColor = `rgba(${r},${g},${b},${active ? 0.95 : 0.18})`;
        el.style.boxShadow = active ? `0 0 12px rgba(${r},${g},${b},0.7)` : 'none';
        el.style.transform = active ? 'scale(1.5)' : 'scale(1)';
      });

      // Eased rotation: slow revolve + cursor tilt
      const targetRotY = time * 0.28 + mouseRef.current.x * 0.5;
      const targetRotX = 0.12 - mouseRef.current.y * 0.28;
      rot.y += (targetRotY - rot.y) * 0.06;
      rot.x += (targetRotX - rot.x) * 0.06;
      const cosY = Math.cos(rot.y), sinY = Math.sin(rot.y);
      const cosX = Math.cos(rot.x), sinX = Math.sin(rot.x);

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.56;

      // Project every particle once
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const wob = prefersReducedMotion ? 0 : Math.sin(time * pt.speed + pt.phase) * 0.012;
        // scatter → formed
        let x = pt.sx + (pt.x - pt.sx) * form + wob;
        let y = pt.sy + (pt.y - pt.sy) * form + (prefersReducedMotion ? 0 : Math.cos(time * pt.speed * 0.9 + pt.phase) * 0.012);
        let z = pt.sz + (pt.z - pt.sz) * form + wob;
        // rotate Y then X
        let xr = x * cosY - z * sinY;
        let zr = x * sinY + z * cosY;
        let yr = y * cosX - zr * sinX;
        zr = y * sinX + zr * cosX;
        const depth = PERSPECTIVE / (PERSPECTIVE - zr);   // ~0.75 back, ~1.4 front
        projected[i * 3]     = cx + xr * scale * depth;
        projected[i * 3 + 1] = cy + yr * scale * depth;
        projected[i * 3 + 2] = depth;
      }

      ctx.globalCompositeOperation = 'lighter';

      // Constellation lines — only once formed, whisper-faint
      if (form > 0.85) {
        const [lr, lg, lb] = current;
        ctx.lineWidth = 1 * dpr;
        ctx.strokeStyle = `rgba(${lr | 0},${lg | 0},${lb | 0},${(0.055 * (form - 0.85) / 0.15).toFixed(3)})`;
        ctx.beginPath();
        for (const [a, b] of lines) {
          ctx.moveTo(projected[a * 3], projected[a * 3 + 1]);
          ctx.lineTo(projected[b * 3], projected[b * 3 + 1]);
        }
        ctx.stroke();
      }

      // Dots: soft halo + bright core, depth-shaded
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const px = projected[i * 3];
        const py = projected[i * 3 + 1];
        const depth = projected[i * 3 + 2];
        const twinkle = prefersReducedMotion ? 0.8 : 0.55 + 0.45 * Math.sin(time * pt.speed * 1.6 + pt.phase);
        const [r, g, b] = pt.gem ? GEM_COLOR : current;
        const a = pt.alpha * twinkle * (0.35 + 0.65 * (depth - 0.7) / 0.7) * (0.25 + 0.75 * form);
        const size = pt.size * dpr * depth;

        // halo
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${(a * 0.16).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, size * 3.2, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gem bloom — a breathing light at the sapphire's heart
      {
        const pulse = prefersReducedMotion ? 0.5 : 0.4 + 0.25 * Math.sin(time * 1.4);
        const gy = cy + 0.14 * scale * Math.cos(rot.x);
        const grad = ctx.createRadialGradient(cx, gy, 0, cx, gy, scale * 0.3);
        grad.addColorStop(0, `rgba(${GEM_COLOR[0]},${GEM_COLOR[1]},${GEM_COLOR[2]},${(0.20 * pulse * form).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - scale * 0.3, gy - scale * 0.3, scale * 0.6, scale * 0.6);
      }

      ctx.globalCompositeOperation = 'source-over';

      if (running && !prefersReducedMotion) raf = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) raf = requestAnimationFrame(draw);
      else if (raf) cancelAnimationFrame(raf);
    });
    observer.observe(canvas);

    if (prefersReducedMotion) draw(0);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', sizeCanvas);
    };
  }, [particles, lines, prefersReducedMotion]);

  return (
    <section id="constellation" ref={wrapperRef} className="relative bg-parchment" style={{ height: `${WRAPPER_VH}vh` }}>
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">

        {/* Theme ambience — the same warm void as the story chapters */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 75% 60% at 50% 45%, rgba(42,17,34,0.85) 0%, rgba(20,7,14,0.5) 45%, transparent 75%)',
          }}
        />
        <div aria-hidden className="absolute top-[18%] -left-24 w-80 h-80 rounded-full bg-accentDeep/15 blur-[110px] pointer-events-none" />
        <div aria-hidden className="absolute bottom-[12%] -right-24 w-80 h-80 rounded-full bg-gold/10 blur-[110px] pointer-events-none" />

        {/* Chapter framing */}
        <div className="absolute top-14 md:top-16 inset-x-0 flex justify-center z-20">
          <ChapterMarker>{marker}</ChapterMarker>
        </div>

        {/* The constellation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-[96vmin] h-[96vmin] max-w-[720px] max-h-[720px]"
            aria-hidden
          />
        </div>

        {/* Statements — label + line, riding the scroll */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
          <div className="relative w-full max-w-3xl text-center" style={{ height: '9em' }}>
            {statements.map((s, i) => (
              <div
                key={s.text}
                ref={(el) => { statementRefs.current[i] = el; }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                style={{ opacity: 0 }}
              >
                <span className={`block font-mono text-[10px] md:text-xs uppercase tracking-kicker mb-5 ${LABEL_CLASS[s.color]}`}>
                  {String(i + 1).padStart(2, '0')} — {s.label}
                </span>
                <p className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-ink leading-snug drop-shadow-[0_2px_24px_rgba(5,2,5,0.9)]">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress rail — right edge, three steps */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
          <span className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
          {statements.map((s, i) => (
            <span
              key={s.label}
              ref={(el) => { railRefs.current[i] = el; }}
              className="w-2 h-2 rounded-full transition-transform duration-500"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            />
          ))}
          <span className="w-px h-10 bg-gradient-to-t from-transparent to-white/20" />
        </div>

        {/* Bottom vignette — melts into the next chapter */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-parchment to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
