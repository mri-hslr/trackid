import {
  Gem,
  Shield,
  Check,
  Zap,
  Link2,
} from "lucide-react";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";

import SectionWrapper from "../../components/SectionWrapper";
import Divider from "../../components/Divider";

import { COPY } from "../../content/copy";
import { fadeUp, staggerContainer, EASE } from "../../motion/variants";

// ============================================================
// PRIMITIVES (Aceternity-inspired, hand-rolled, no new deps)
// ============================================================

function FloatPendant({ children, reducedMotion }) {
  return (
    <motion.div
      animate={reducedMotion ? {} : { y: [-8, 8, -8] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function AccentBar() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{ originX: 0 }}
      className="h-[2px] w-12 rounded-full bg-gold mb-6"
    />
  );
}

// ─── Sparkles — cheap scattered particle field, no canvas ─────────────────
function Sparkles({ count = 18, className = "" }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 2.5 + 2,
      })),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          style={{ top: `${p.top}%`, left: `${p.left}%`, width: p.size, height: p.size }}
          className="absolute rounded-full bg-gold"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Text Generate Effect — words flip in on a 3D axis, staggered ─────────
function TextGenerate({ text, className = "" }) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ perspective: 800 }}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.28em] align-bottom">
          <motion.span
            initial={{ opacity: 0, rotateX: 70, y: 24 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            style={{ transformOrigin: "50% 100%", display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Moving Border Button — rotating conic-gradient border ────────────────
function MovingBorderButton({ children, className = "", onClick }) {
  return (
    <button onClick={onClick} className={`group relative overflow-hidden rounded-full p-[1.5px] ${className}`}>
      <span
        className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, transparent 0%, #C9A66B 35%, #C9A66B 45%, transparent 65%)",
        }}
      />
      <span className="relative flex items-center justify-center rounded-full bg-ink text-parchment px-8 py-3.5 text-sm font-body font-medium transition-colors duration-200 group-hover:bg-ink/85">
        {children}
      </span>
    </button>
  );
}

// ─── 3D Tilt Card — cursor-driven tilt + glare, dims siblings ──────────────
function TiltCard({ children, className = "", onHoverChange, dimmed, reducedMotion }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const handleMouseMove = (e) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    animate(rotateY, (px - 0.5) * 14, { duration: 0.2, ease: EASE });
    animate(rotateX, (0.5 - py) * 14, { duration: 0.2, ease: EASE });
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const handleMouseLeave = () => {
    animate(rotateX, 0, { duration: 0.4, ease: EASE });
    animate(rotateY, 0, { duration: 0.4, ease: EASE });
    onHoverChange?.(false);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      animate={{
        scale: dimmed ? 0.98 : 1,
        opacity: dimmed ? 0.55 : 1,
        filter: dimmed ? "blur(1.5px)" : "blur(0px)",
      }}
      transition={{ duration: 0.3, ease: EASE }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {!reducedMotion && (
        <motion.div
          style={{
            background: `radial-gradient(220px circle at ${glareX.get()}% ${glareY.get()}%, rgba(201,166,107,0.16), transparent 70%)`,
          }}
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity"
        />
      )}
      {children}
    </motion.div>
  );
}

// ─── Scramble / decode text — random glyphs lock into place left→right ─────
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$@*+=-";

function ScrambleText({ text, className = "", trigger = true, speed = 30 }) {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, " "));

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const totalIterations = text.length * 3;
    let timeoutId;

    const tick = () => {
      iteration += 1;
      const progress = iteration / totalIterations;
      const lockedCount = Math.floor(progress * text.length);

      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < lockedCount) return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration < totalIterations) {
        timeoutId = setTimeout(tick, speed);
      } else {
        setDisplay(text);
      }
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, [trigger, text, speed]);

  return <span className={`font-mono tabular-nums ${className}`}>{display}</span>;
}

// ─── True magnetic button — cursor-distance pull, spring return ───────────
function MagneticButton({ children, className = "", radius = 90, strength = 0.4 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });
  const labelX = useTransform(springX, (v) => v * 0.4);
  const labelY = useTransform(springY, (v) => v * 0.4);

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`relative rounded-full px-10 py-4 font-body text-sm font-medium overflow-hidden ${className}`}
    >
      <motion.span style={{ x: labelX, y: labelY }} className="relative z-10 inline-block">
        {children}
      </motion.span>
    </motion.button>
  );
}

// ─── Infinite marquee — duplicated track, pure CSS loop ────────────────────
function Marquee({ items, reverse = false, className = "" }) {
  const track = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`flex w-max gap-10 ${reverse ? "animate-[marqueeR_28s_linear_infinite]" : "animate-[marquee_28s_linear_infinite]"}`}>
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-4 font-display text-4xl md:text-6xl text-ink/10 whitespace-nowrap select-none">
            {item}
            <span className="text-gold/30 text-3xl">✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

// ─── Radar Pulse — expanding ring "signal" pulses, on-theme for a GPS tracker ─
function RadarPulse({ tone = "gold", size = 340, ringCount = 3, reducedMotion }) {
  const toneClass =
    tone === "alert" ? "border-alert/50" : tone === "safe" ? "border-safe/50" : "border-gold/50";
  if (reducedMotion) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.span
          key={i}
          style={{ width: size, height: size }}
          className={`absolute rounded-full border ${toneClass}`}
          animate={{ scale: [0.55, 1.35], opacity: [0.55, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: i * 1 }}
        />
      ))}
    </div>
  );
}

// ─── 3D Tilt wrapper driven by external normalized mouse coords (-0.5 → 0.5) ─
function MouseTilt({ children, mouseX, mouseY, intensity = 14, className = "" }) {
  return (
    <motion.div
      animate={{ rotateX: mouseY * -intensity, rotateY: mouseX * intensity }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      style={{ transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
// ─── Card Carousel — infinite looping row, pauses on hover, edge-fades ────
function CardCarousel({ cards, hoveredCard, setHoveredCard, reducedMotion }) {
  const [paused, setPaused] = useState(false);
  const track = [...cards, ...cards];
  const icons = {
    Acceptance: <Check size={22} strokeWidth={2.3} className="text-safe" />,
    "Daily Wear": <Gem size={20} strokeWidth={1.8} className="text-accent" />,
    "Continuous Safety": <Shield size={20} strokeWidth={1.8} className="text-accent" />,
  };

  return (
    <div className="relative mt-24 -mx-6 overflow-hidden lg:-mx-20">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-parchment to-transparent lg:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-parchment to-transparent lg:w-32" />

      <div
        className="flex w-max gap-6 px-6 lg:px-20"
        style={{
          animation: reducedMotion ? "none" : "valueCardsScroll 30s linear infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {track.map((card, idx) => (
          <div key={`${card.title}-${idx}`} className="w-[320px] flex-shrink-0 lg:w-[360px]">
            <TiltCard
              reducedMotion={reducedMotion}
              dimmed={hoveredCard !== null && hoveredCard !== idx}
              onHoverChange={(isHovering) => setHoveredCard(isHovering ? idx : null)}
              className="group overflow-hidden rounded-3xl border border-stone bg-white/80 p-8 backdrop-blur-xl shadow-sm transition-shadow duration-300 hover:shadow-xl hover:border-gold/30"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
              <AccentBar />
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-parchment text-xl">
                {icons[card.title] ?? "✦"}
              </div>
              <h4 className="font-display text-2xl text-ink">{card.title}</h4>
              <p className="mt-4 leading-7 text-slate">{card.description}</p>
            </TiltCard>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes valueCardsScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Pendant Illustration — hand-drawn SVG, gold gradient teardrop + facet ─
function PendantIllustration({ size = 200, className = "" }) {
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={className}
      style={{ filter: "drop-shadow(0 18px 30px rgba(120,90,40,0.28))" }}
    >
      <defs>
        <linearGradient id="pendantGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3E3C3" />
          <stop offset="45%" stopColor="#C9A66B" />
          <stop offset="100%" stopColor="#8A6E3F" />
        </linearGradient>
        <linearGradient id="pendantGoldEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF6E0" />
          <stop offset="100%" stopColor="#B8944F" />
        </linearGradient>
        <radialGradient id="stoneGlow" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="55%" stopColor="#EAD9AE" />
          <stop offset="100%" stopColor="#B48F52" />
        </radialGradient>
      </defs>

      {/* Chain */}
      <path
        d="M60 8 C 60 30, 140 30, 140 8"
        fill="none"
        stroke="url(#pendantGoldEdge)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Bail (loop connecting chain to pendant) */}
      <rect x="90" y="26" width="20" height="24" rx="9" fill="none" stroke="url(#pendantGoldEdge)" strokeWidth="4" />

      {/* Teardrop body */}
      <path
        d="M100 48
           C 138 78, 158 118, 158 152
           C 158 190, 132 214, 100 214
           C 68 214, 42 190, 42 152
           C 42 118, 62 78, 100 48 Z"
        fill="url(#pendantGold)"
        stroke="#A9834A"
        strokeWidth="1.5"
      />

      {/* Inner faceted stone */}
      <path
        d="M100 74
           C 124 96, 138 122, 138 150
           C 138 176, 121 194, 100 194
           C 79 194, 62 176, 62 150
           C 62 122, 76 96, 100 74 Z"
        fill="url(#stoneGlow)"
        opacity="0.9"
      />

      {/* Facet lines */}
      <path d="M100 74 L100 194" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.2" />
      <path d="M100 108 L62 150" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1" />
      <path d="M100 108 L138 150" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1" />

      {/* Catch-light highlight */}
      <ellipse cx="80" cy="108" rx="12" ry="20" fill="#FFFFFF" opacity="0.55" />
    </svg>
  );
}

export default function ComplianceCase() {
  const data = COPY.complianceCase;
  const reducedMotion = useReducedMotion();
  const percentage = useMotionValue(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [journeyMouse, setJourneyMouse] = useState({ x: 0, y: 0 });
  const [assemblyMouse, setAssemblyMouse] = useState({ x: 0, y: 0 });

  // Scroll progress for the Compliance Journey traveling indicator
  const journeyRef = useRef(null);
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ["start end", "end start"],
  });
  const journeyDotLeft = useTransform(journeyProgress, [0.15, 0.85], ["0%", "100%"]);

  const rounded = useTransform(percentage, (latest) => `${Math.round(latest)}%`);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [40, -40]);

  // ---------- Pinned assembly sequence (scroll-scrubbed) ----------
  const assemblyRef = useRef(null);
  const { scrollYProgress: assemblyProgress } = useScroll({
    target: assemblyRef,
    offset: ["start start", "end end"],
  });

  const trakX = useTransform(assemblyProgress, [0, 0.28], reducedMotion ? [0, 0] : [-400, 0]);
  const idX = useTransform(assemblyProgress, [0, 0.28], reducedMotion ? [0, 0] : [400, 0]);
  const wordmarkOpacity = useTransform(assemblyProgress, [0, 0.05, 0.3, 0.38], [0, 1, 1, 0]);
  const wordmarkScale = useTransform(assemblyProgress, [0.28, 0.38], [1, 0.85]);

  const partTL = useTransform(assemblyProgress, [0.3, 0.55], reducedMotion ? [0, 0] : [-260, 0]);
  const partTR = useTransform(assemblyProgress, [0.3, 0.55], reducedMotion ? [0, 0] : [260, 0]);
  const partBL = useTransform(assemblyProgress, [0.34, 0.6], reducedMotion ? [0, 0] : [-260, 0]);
  const partBR = useTransform(assemblyProgress, [0.34, 0.6], reducedMotion ? [0, 0] : [260, 0]);
  const partsOpacity = useTransform(assemblyProgress, [0.3, 0.4, 0.62, 0.7], [0, 1, 1, 0]);
  const partsRotate = useTransform(assemblyProgress, [0.3, 0.6], [reducedMotion ? 0 : -25, 0]);
  const ringScale = useTransform(assemblyProgress, [0.4, 0.62], [0.6, 1]);

  const statementClip = useTransform(assemblyProgress, [0.5, 0.64], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const statementOpacity = useTransform(assemblyProgress, [0.48, 0.54], [0, 1]);

  // ---------- Horizontal scroll gallery ----------
  const galleryRef = useRef(null);
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start start", "end end"],
  });

 const panels = [
  {
    image: "/assets/images/impact-rated.png",
    title: "Impact Rated",
    desc: "Reinforced housing survives daily drops, play, and roughhousing without cracking.",
  },
  {
    image: "/assets/images/battery.png",
    title: "7-Day Battery",
    desc: "A single charge outlasts the week — no daily habit for a parent to forget.",
  },
  {
    image: "/assets/images/clasp.png",
    title: "Clasp-Locked",
    desc: "A tamper-aware clasp that resists idle fiddling but opens instantly for a caregiver.",
  },
  {
    image: "/assets/images/jewellery-grade.png",
    title: "Jewellery Grade",
    desc: "14k gold-plated finish indistinguishable from the pendant a child already wants to wear.",
  },
];

  const galleryX = useTransform(
    galleryProgress,
    [0, 1],
    reducedMotion ? ["0%", "0%"] : ["2%", `-${(panels.length - 1) * 92}%`]
  );

  return (
    <SectionWrapper id="compliance-case"  className="pt-12 pb-24">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.3, 0.18] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-52 top-20 h-[650px] w-[650px] rounded-full bg-gold/10 blur-[180px]"
        />
        <motion.div
          animate={{ x: [-60, 60, -60], y: [0, 40, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[160px]"
        />
      </div>
       {/* ================================================================
          🔥 CINEMATIC SECTION — pinned assembly + marquee + horizontal gallery
      ================================================================ */}
      <div className="relative mt-36 -mx-6 lg:-mx-20">
        {/* A) Pinned assembly sequence */}
        <div ref={assemblyRef} className="relative h-[700vh]">
          <div
            className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setAssemblyMouse({
                x: (e.clientX - rect.left) / rect.width - 0.5,
                y: (e.clientY - rect.top) / rect.height - 0.5,
              });
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />

            {/* Diagonal light sweep — a moving studio light instead of a flat backdrop */}
            {!reducedMotion && (
              <motion.div
                animate={{ x: ["-30%", "130%"] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                className="absolute top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-gold/[0.06] to-transparent pointer-events-none"
              />
            )}

            <Sparkles count={22} className="opacity-70" />

            <motion.div
              animate={reducedMotion ? {} : { rotate: 360, opacity: [0.08, 0.2, 0.08] }}
              transition={{
                rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute h-[900px] w-[900px] rounded-full border border-gold/10"
            />
            <motion.div
              animate={reducedMotion ? {} : { rotate: -360, scale: [1, 1.04, 1] }}
              transition={{
                rotate: { duration: 80, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute h-[650px] w-[650px] rounded-full border border-dashed border-gold/10"
            />

            {/* Phase 1: wordmark slam */}
            <motion.div
              style={{ opacity: wordmarkOpacity, scale: wordmarkScale }}
              className="absolute flex items-center font-display text-7xl md:text-9xl tracking-tight"
            >
              <motion.div
                animate={{ rotateY: assemblyMouse.x * 10, rotateX: assemblyMouse.y * -10 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{ transformPerspective: 1000 }}
                className="relative flex items-center"
              >
                {/* Soft glow duplicate behind the text so it breathes even before scroll/hover */}
                <div className="absolute inset-0 flex items-center blur-2xl opacity-40 text-gold select-none" aria-hidden="true">
                  TRAKID
                </div>

                <motion.span
                  style={{ x: trakX }}
                  animate={reducedMotion ? {} : { y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative inline-block text-parchment"
                >
                  TRAK
                </motion.span>
                <motion.span
                  style={{ x: idX }}
                  animate={reducedMotion ? {} : { y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className="relative inline-block text-gold"
                >
                  ID
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Phase 2: parts assembling into a pendant */}
            <motion.div style={{ opacity: partsOpacity }} className="absolute">
              <motion.div
                style={{ scale: ringScale, rotate: partsRotate }}
                className="relative h-72 w-72 rounded-full border border-gold/25 bg-white/5 backdrop-blur-xl flex items-center justify-center"
              >
                <div className="absolute inset-6 rounded-full border border-gold/15" />
                <Gem size={56} strokeWidth={1.3} className="text-gold" />

                <motion.div style={{ x: partTL }} className="absolute -left-16 -top-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-white/10 backdrop-blur-md">
                  <Shield size={22} className="text-parchment" />
                </motion.div>
                <motion.div style={{ x: partTR }} className="absolute -right-16 -top-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-white/10 backdrop-blur-md">
                  <Zap size={22} className="text-parchment" />
                </motion.div>
                <motion.div style={{ x: partBL }} className="absolute -left-16 -bottom-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-white/10 backdrop-blur-md">
                  <Link2 size={22} className="text-parchment" />
                </motion.div>
                <motion.div style={{ x: partBR }} className="absolute -right-16 -bottom-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-white/10 backdrop-blur-md">
                  <Gem size={22} className="text-parchment" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Phase 3: statement mask reveal */}
            <motion.div style={{ opacity: statementOpacity }} className="absolute px-6 max-w-4xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.5em] text-gold/70 mb-6">
                Assembled for one job
              </p>
              <motion.h3
                style={{ clipPath: statementClip }}
                className="font-display text-4xl md:text-6xl leading-tight text-parchment"
              >
                Every part exists so a child forgets it's even there.
              </motion.h3>
            </motion.div>
          </div>
        </div>

        {/* B) Marquee strip */}
        <div className="border-y border-stone bg-parchment py-8">
          <Marquee items={["ALWAYS WORN", "NEVER REMOVED", "TRAKID", "QUIETLY PROTECTED"]} />
        </div>

        {/* C) Horizontal scroll gallery */}
        <div ref={galleryRef} className="relative h-[350vh] bg-parchment">
          <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
            <div className="mb-10 px-6 lg:px-20">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">Engineered Detail</p>
              <h2 className="mt-4 font-display text-4xl md:text-6xl text-ink max-w-2xl">
                Built like jewellery. Tested like hardware.
              </h2>
            </div>

            <motion.div style={{ x: galleryX }} className="flex gap-8 px-6 lg:px-20 will-change-transform">
              {panels.map((panel, i) => {
                
                return (
                  <div
                    key={panel.title}
                    className="relative flex-shrink-0 w-[82vw] md:w-[38vw] lg:w-[26vw] aspect-[4/5] rounded-[2.5rem] border border-stone bg-white/80 backdrop-blur-xl shadow-xl p-10 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
                    <span className="font-mono text-xs text-gold/70">0{i + 1}</span>
                    <div>
                      <div className="mb-8 overflow-hidden rounded-2xl">
  <img
    src={panel.image}
    alt={panel.title}
    className="h-56 w-full object-contain"
  />
</div>
                      <h4 className="font-display text-2xl text-ink">{panel.title}</h4>
                      <p className="mt-3 text-sm leading-6 text-slate">{panel.desc}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* D) Closing — scramble stat + magnetic CTA */}
        <div className="relative py-20 px-6 text-center overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[160px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ScrambleText
              text="96% COMPLIANCE"
              trigger
              className="text-5xl md:text-7xl font-display text-ink tracking-tight block"
            />
            <p className="mt-6 text-slate text-lg max-w-md mx-auto">
              Not a feature. An outcome — measured across a full pilot cohort.
            </p>
            <div className="mt-12 flex justify-center">
              <MagneticButton className="bg-ink text-parchment shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                Get TrakID
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>



      {/* ================================================================
          HERO — headline + pendant timeline
      ================================================================ */}
      <div
        ref={heroRef}
        className="relative mt-20"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          setMouse({ x, y });
        }}
      >
        <motion.div
          style={{ y: glowY }}
          className="pointer-events-none absolute -right-32 -top-20 h-[520px] w-[520px] rounded-full bg-gold/8 blur-[160px]"
        />
        <motion.div
          animate={{ x: mouse.x * 120, y: mouse.y * 120 }}
          transition={{ type: "spring", stiffness: 45, damping: 18 }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[170px]"
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-80px" }}
          className="relative grid gap-20 lg:grid-cols-[1fr_600px] items-center"
        >
          <motion.div variants={fadeUp} className="relative z-10">
            <p className="font-mono uppercase tracking-[0.45em] text-accent text-xs">{data.eyebrow}</p>

            <div className="relative mt-6 max-w-xl">
              <Sparkles count={16} className="-inset-x-6 -top-6 h-[140%]" />
              <h2 className="relative font-display text-5xl md:text-7xl xl:text-[82px] leading-[0.93] tracking-tight text-ink">
                <TextGenerate text={data.headline} />
              </h2>
            </div>

            <p className="mt-8 max-w-md text-lg leading-8 text-slate">{data.body}</p>

            <div className="mt-12 flex flex-wrap gap-4">
              <MovingBorderButton>Explore Solution</MovingBorderButton>
              <button className="rounded-full border border-ink/30 text-ink px-8 py-3.5 text-sm font-body font-medium hover:bg-ink/5 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-[240px_1fr] items-start gap-8">
            <FloatPendant reducedMotion={reducedMotion}>
              <MouseTilt mouseX={mouse.x} mouseY={mouse.y} intensity={10} className="relative">
                <RadarPulse tone="gold" size={420} reducedMotion={reducedMotion} />
                <div className="absolute inset-0 rounded-full bg-gold/15 blur-[80px]" />

                {/* Rotating conic-gradient bezel — reads as brushed metal catching light */}
                <div className="absolute inset-[-3px] rounded-[104px] overflow-hidden">
                  <motion.div
                    animate={reducedMotion ? {} : { rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-50%]"
                    style={{
                      background:
                        "conic-gradient(from 0deg, transparent 0%, #C9A66B 12%, transparent 24%, transparent 50%, #C9A66B 62%, transparent 74%)",
                    }}
                  />
                </div>

                <div className="relative h-[400px] rounded-[100px] border border-gold/25 bg-gradient-to-b from-white/85 to-white/60 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.14)] flex items-center justify-center overflow-hidden">
                  {/* Faint engraved concentric texture instead of a flat void */}
                  <div
                    className="absolute inset-0 opacity-[0.35]"
                    style={{
                      backgroundImage:
                        "repeating-radial-gradient(circle at 50% 42%, transparent 0, transparent 18px, rgba(201,166,107,0.08) 19px)",
                    }}
                  />

                  {/* Diagonal shimmer sweep across the glass */}
                  {!reducedMotion && (
                    <motion.div
                      animate={{ x: ["-120%", "220%"] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.4 }}
                      className="absolute top-0 h-full w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                    />
                  )}

                  {/* Orbiting feature chips */}
                  {!reducedMotion &&
                    ["GPS", "24/7", "IP68"].map((label, i) => (
                      <motion.div
                        key={label}
                        className="absolute h-9 px-3 flex items-center justify-center rounded-full border border-gold/30 bg-parchment/95 shadow-sm font-mono text-[9px] tracking-[0.15em] text-accentDeep"
                        style={{ top: "50%", left: "50%" }}
                        animate={{
                          x: [
                            Math.cos((i * 2 * Math.PI) / 3) * 118,
                            Math.cos((i * 2 * Math.PI) / 3 + Math.PI * 2) * 118,
                          ],
                          y: [
                            Math.sin((i * 2 * Math.PI) / 3) * 150,
                            Math.sin((i * 2 * Math.PI) / 3 + Math.PI * 2) * 150,
                          ],
                        }}
                        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                      >
                        {label}
                      </motion.div>
                    ))}

                  <div className="relative text-center px-6">
                    <motion.div
                      animate={reducedMotion ? {} : { rotate: [0, 3, 0, -3, 0], y: [0, -4, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="mx-auto"
                    >
                      <PendantIllustration size={128} />
                    </motion.div>
                    <h4 className="mt-4 font-display text-xl text-ink">Classic Teardrop</h4>
                    <p className="mt-1.5 font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
                      14k Gold-Plated
                    </p>
                  </div>
                </div>
              </MouseTilt>
            </FloatPendant>

            <div className="relative pt-10">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ originY: 0 }}
                className="absolute left-[19px] top-14 bottom-8 w-px bg-gradient-to-b from-gold/50 via-gold/25 to-transparent"
              />

              {[
                { title: "Acceptance", desc: "Children naturally choose to wear TrakID — it looks like a gift, not a gadget.", icon: Gem },
                { title: "Daily Wear", desc: "Comfortable enough to forget it's there. Worn continuously, not reluctantly.", icon: Check },
                { title: "Continuous Safety", desc: "Protection only works when it stays on. TrakID stays on.", icon: Shield },
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={reducedMotion ? {} : { opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
                    whileHover={reducedMotion ? {} : { x: 10, scale: 1.03 }}
                    className="group relative mb-7 ml-9 overflow-hidden rounded-2xl border border-stone bg-white/90 p-6 shadow-sm transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] hover:border-gold/30"
                  >
                    {/* Gold top hairline that grows in on hover */}
                    <motion.div
                      variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                      initial="rest"
                      whileHover="hover"
                      transition={{ duration: 0.4, ease: EASE }}
                      style={{ originX: 0 }}
                      className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-gold to-transparent"
                    />

                    <div className="absolute -left-[34px] top-6 h-4 w-4">
                      {!reducedMotion && (
                        <motion.span
                          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.4 }}
                          className="absolute inset-0 rounded-full bg-gold/60"
                        />
                      )}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.18 + 0.5, duration: 0.4, type: "spring", stiffness: 180 }}
                        className="relative h-4 w-4 rounded-full border-4 border-parchment bg-gold shadow-sm"
                      />
                    </div>

                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={reducedMotion ? {} : { rotate: 8, scale: 1.08 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gradient-to-b from-parchment to-white shadow-sm"
                      >
                        <ItemIcon size={18} strokeWidth={1.8} className="text-accent" />
                      </motion.div>
                      <div>
                        <h4 className="font-display text-xl text-ink">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ================================================================
          STATISTIC CALLOUT
      ================================================================ */}
      <motion.div
        {...fadeUp}
        initial={fadeUp.initial}
        whileInView={fadeUp.whileInView}
        viewport={fadeUp.viewport}
        transition={fadeUp.transition}
        className="relative mt-32 overflow-hidden rounded-3xl border border-gold/20 bg-white/80 backdrop-blur-xl shadow-[0_35px_90px_rgba(0,0,0,0.12)]"
      >
        <div className="absolute inset-0 rounded-3xl border border-gold/20 opacity-0 transition-opacity duration-500 hover:opacity-100" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/8 blur-[90px] pointer-events-none" />

        <div className="relative grid items-center gap-6 p-8 lg:p-10 lg:grid-cols-[80px_200px_1fr]">
          <div className="hidden lg:flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-parchment">
              <span className="text-3xl">🛡</span>
            </div>
          </div>

          <div className="lg:border-r lg:border-gold/15 lg:pr-8">
            <motion.p
              className="font-display text-7xl leading-none text-accent"
              onViewportEnter={() => {
                animate(percentage, 96, { duration: 2, ease: "easeOut" });
              }}
            >
              {rounded}
            </motion.p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-gold">Compliance Gain</p>
          </div>

          <div className="lg:pl-4">
            <h3 className="font-display text-2xl text-ink">{data.statistic.title}</h3>
            <p className="mt-3 max-w-lg leading-7 text-slate">{data.statistic.subtitle}</p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-slate">
              Internal Pilot Evaluation
            </p>
          </div>
        </div>
      </motion.div>

      {/* ================================================================
          VALUE CARDS — infinite carousel, pauses on hover
      ================================================================ */}
      <CardCarousel
        cards={data.valueCards}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
        reducedMotion={reducedMotion}
      />

      {/* ================================================================
          COMPLIANCE JOURNEY
      ================================================================ */}
      <motion.section
        ref={journeyRef}
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-36"
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="font-mono uppercase tracking-[0.35em] text-accent text-xs">Compliance Journey</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl text-ink">
            Behaviour matters more than technology.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate max-w-xl mx-auto">
            Traditional trackers fail because children stop wearing them.
            TrakID is designed to become part of everyday life.
          </p>
        </motion.div>

        <div
          className="relative mt-20 grid lg:grid-cols-[1fr_240px_1fr] gap-10 items-center"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            setJourneyMouse({ x, y });
          }}
        >
          {/* Converging signal beam — two pulses travel from the edges toward the pendant, looping */}
          {!reducedMotion && (
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-alert/25 via-transparent to-safe/25" />
              <motion.span
                animate={{ left: ["2%", "44%"], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-alert/70 shadow-[0_0_8px_rgba(200,80,60,0.6)]"
              />
              <motion.span
                animate={{ left: ["98%", "56%"], opacity: [0, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-safe/70 shadow-[0_0_8px_rgba(90,150,110,0.6)]"
              />
            </div>
          )}

          <div className="space-y-8">
            {["Removed", "Hidden", "Forgotten"].map((item, i) => (
              <motion.div
                key={item}
                initial={reducedMotion ? {} : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="relative mt-1.5 h-3 w-3 flex-shrink-0">
                  {!reducedMotion && (
                    <motion.span
                      animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: i * 0.3 }}
                      className="absolute inset-0 rounded-full bg-alert/70"
                    />
                  )}
                  <div className="relative h-3 w-3 rounded-full bg-alert/70" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-ink">{item}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate">
                    Traditional trackers frequently end up {item.toLowerCase()}.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <FloatPendant reducedMotion={reducedMotion}>
            <MouseTilt mouseX={journeyMouse.x} mouseY={journeyMouse.y} intensity={12} className="relative flex justify-center">
              <RadarPulse tone="gold" size={280} reducedMotion={reducedMotion} />
              <div className="absolute h-64 w-64 rounded-full bg-gold/12 blur-[80px]" />
              <div className="relative flex h-[380px] w-[220px] items-center justify-center rounded-[90px] border border-gold/20 bg-white/70 shadow-xl backdrop-blur-xl">
                <div className="text-center">
                  <motion.div
                    animate={reducedMotion ? {} : { scale: [1, 1.05, 1], y: [0, -5, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <PendantIllustration size={110} />
                  </motion.div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">Pendant</p>
                </div>
              </div>
            </MouseTilt>
          </FloatPendant>

          <div className="space-y-8">
            {["Comfortable", "Always On", "Jewellery First"].map((item, i) => (
              <motion.div
                key={item}
                initial={reducedMotion ? {} : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.1 }}
                className="flex items-start gap-4 justify-end text-right"
              >
                <div>
                  <h3 className="font-display text-2xl text-ink">{item}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate">
                    Designed to encourage continuous everyday wear.
                  </p>
                </div>
                <div className="relative mt-1.5 h-3 w-3 flex-shrink-0">
                  {!reducedMotion && (
                    <motion.span
                      animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: i * 0.3 }}
                      className="absolute inset-0 rounded-full bg-safe/80"
                    />
                  )}
                  <div className="relative h-3 w-3 rounded-full bg-safe/80" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 px-4">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-alert/30 via-gold/30 to-safe/50" />
            {/* Scroll-linked traveling indicator — tracks how far you've scrolled through the section */}
            {!reducedMotion && (
              <motion.div
                style={{ left: journeyDotLeft }}
                className="absolute top-1/2 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(201,166,107,0.7)]"
              />
            )}
            {["Removed", "Hidden", "Forgotten", "Always Worn"].map((item, i) => (
              <div key={item} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`h-5 w-5 rounded-full border-2 border-parchment shadow-sm ${i === 3 ? "bg-safe" : "bg-gold/60"}`} />
                <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${i === 3 ? "text-safe" : "text-slate"}`}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      
      {/* ================================================================
          BENEFITS GRID
      ================================================================ */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-32"
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">Why TrakID Works</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl text-ink">
            Designed around behaviour, not just technology.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {data.benefits.map((benefit, idx) => (
            <motion.div key={benefit.title} variants={fadeUp}>
              <TiltCard
                reducedMotion={reducedMotion}
                dimmed={hoveredBenefit !== null && hoveredBenefit !== idx}
                onHoverChange={(isHovering) => setHoveredBenefit(isHovering ? idx : null)}
                className="group rounded-3xl border border-stone bg-white/70 p-8 backdrop-blur shadow-sm transition-shadow duration-300 hover:shadow-lg hover:border-gold/30"
              >
                <AccentBar />
                <motion.div
                  whileHover={reducedMotion ? {} : { rotate: 12, scale: 1.08 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-parchment text-lg"
                >
                  ✦
                </motion.div>
                <h3 className="font-display text-2xl text-ink">{benefit.title}</h3>
                <p className="mt-4 leading-7 text-slate">{benefit.description}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

     
      {/* ================================================================
          CLOSING QUOTE
      ================================================================ */}
      <motion.section
        {...fadeUp}
        initial={fadeUp.initial}
        whileInView={fadeUp.whileInView}
        viewport={fadeUp.viewport}
        transition={fadeUp.transition}
        className="mt-36"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-display text-6xl text-gold/35 select-none leading-none">❝</span>
          <p className="mt-2 font-display text-2xl md:text-4xl leading-relaxed text-ink italic">
            {data.quote}
          </p>
          <span className="font-display text-6xl text-gold/35 select-none leading-none">❞</span>
          <div className="mx-auto mt-8 h-px w-24 bg-gold/35 rounded-full" />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
            Continuous Protection Through Better Compliance
          </p>
        </div>
      </motion.section>

      <Divider />
    </SectionWrapper>
  );
}