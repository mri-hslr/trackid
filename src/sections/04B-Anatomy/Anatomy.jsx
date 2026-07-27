import { useEffect, useRef, useState, useMemo } from "react";
import {
  Feather,
  Droplets,
  BatteryFull,
  Radio,
  ShieldAlert,
  Gem,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useInView,
  useScroll,
  animate,
} from "framer-motion";

import SectionWrapper from "../../components/SectionWrapper";
import Divider from "../../components/Divider";
import ChapterMarker from "../../components/ChapterMarker";
import { KineticLine } from "../../components/Kinetic";
import PendantCard from "./PendantCard";

import { COPY } from "../../content/copy";
import { ASSETS } from "../../content/assets";

import { EASE, fadeUp, staggerContainer } from "../../motion/variants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const FEATURES = [
  { icon: Feather, title: "Lightweight", subtitle: "Everyday comfort", stat: 18, suffix: "g" },
  { icon: Droplets, title: "Water Resistant", subtitle: "Ready for adventures", stat: 50, suffix: "m" },
  { icon: BatteryFull, title: "Long Battery", subtitle: "Power that lasts", stat: 72, suffix: "hr" },
  { icon: Radio, title: "LTE Connected", subtitle: "Always reachable", stat: 99, suffix: "%" },
  { icon: ShieldAlert, title: "SOS Ready", subtitle: "One-touch emergency", stat: 1, suffix: "tap" },
  { icon: Gem, title: "Made to Wear", subtitle: "Designed with children", stat: 4, suffix: "sizes" },
];

const FILTERS = ["All", "New", "Bestseller"];

// ============================================================
// PRIMITIVES — same visual language as the Compliance section,
// new signature moves specific to this section
// ============================================================

// ─── Aceternity-Style Dot Grid Background ────────────────────────────────
// Ambience matching the rest of the site — plum radial ground + drifting
// brand orbs (replaces the old dot grid, which felt off-brand).
function DotBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(42,17,34,0.55) 0%, transparent 72%)",
        }}
      />
      <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-accentDeep/15 blur-[120px]" />
      <div className="absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-gold/[0.08] blur-[120px]" />
    </div>
  );
}

// ─── Radar Pulse — expanding GPS-signal rings, on-theme for a tracker ──────
function RadarPulse({ tone = "gold", size = 340, ringCount = 3, reducedMotion }) {
  const toneClass = tone === "gold" ? "border-gold/20" : "border-accent/20";
  if (reducedMotion) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.span
          key={i}
          style={{ width: size, height: size }}
          className={`absolute rounded-full border ${toneClass}`}
          animate={{ scale: [0.55, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: i * 1.1 }}
        />
      ))}
    </div>
  );
}

// ─── Capability Halo — feature icons orbiting the hero pendant ────────────
function CapabilityHalo({ items, radius = 210, reducedMotion }) {
  if (reducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 hidden lg:flex items-center justify-center">
        {items.map((f, i) => {
          const angle = (i / items.length) * 360;
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="absolute left-1/2 top-1/2 flex h-11 w-11 -ml-[22px] -mt-[22px] items-center justify-center rounded-full border border-gold/15 bg-white/5 backdrop-blur-md shadow-sm"
              style={{ transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)` }}
            >
              <Icon size={16} strokeWidth={1.8} className="text-gold" />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 hidden lg:block"
      animate={{ rotate: 360 }}
      transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
    >
      {items.map((f, i) => {
        const angle = (i / items.length) * 360;
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="absolute left-1/2 top-1/2 h-11 w-11 -ml-[22px] -mt-[22px]"
            style={{ transform: `rotate(${angle}deg) translate(${radius}px)` }}
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.15 }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/15 bg-white/5 backdrop-blur-md shadow-sm"
            >
              <Icon size={16} strokeWidth={1.8} className="text-gold" />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

// ─── Text Generate — words flip in on a 3D axis, staggered ────────────────
function TextGenerate({ text, className = "", highlight = [] }) {
  const words = text.split(" ");
  const highlightSet = highlight.map((w) => w.toLowerCase());

  return (
    <span className={className} style={{ perspective: 800 }}>
      {words.map((word, i) => {
        const bare = word.replace(/[.,!?]/g, "").toLowerCase();
        const isHighlighted = highlightSet.includes(bare);
        return (
          <span key={i} className="inline-block overflow-hidden mr-[0.28em] align-bottom">
            <motion.span
              initial={{ opacity: 0, rotateX: 70, y: 20 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: isHighlighted ? words.length * 0.05 + 0.1 : i * 0.05,
                ease: EASE,
              }}
              style={{ transformOrigin: "50% 100%", display: "inline-block" }}
              className={isHighlighted ? "gold-shimmer-text" : ""}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

function renderHighlightedWords(text, highlightWords = []) {
  const lower = highlightWords.map((w) => w.toLowerCase());
  const words = text.split(" ");
  const nodes = [];

  words.forEach((word, i) => {
    const bare = word.replace(/[.,!?]/g, "").toLowerCase();
    const isHighlighted = lower.includes(bare);
    nodes.push(
      isHighlighted ? (
        <span key={i} className="gold-shimmer-text">
          {word}
        </span>
      ) : (
        word
      )
    );
    if (i < words.length - 1) nodes.push(" ");
  });

  return nodes;
}

function GoldShimmerStyle() {
  return (
    <style>{`
      .gold-shimmer-text {
        background: linear-gradient(100deg, #9c7b3f 20%, #C9A66B 38%, #F3E2B8 50%, #C9A66B 62%, #9c7b3f 80%);
        background-size: 240% auto;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        animation: goldShimmer 5s linear infinite;
      }
      @keyframes goldShimmer {
        to { background-position: -240% center; }
      }
    `}</style>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$@*+=-";

function ScrambleText({ text, className = "", trigger = true, speed = 26 }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const totalIterations = text.length * 2.5;
    let timeoutId;

    const tick = () => {
      iteration += 1;
      const lockedCount = Math.floor((iteration / totalIterations) * text.length);
      setDisplay(
        text
          .split("")
          .map((char, i) => (char === " " ? " " : i < lockedCount ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (iteration < totalIterations) timeoutId = setTimeout(tick, speed);
      else setDisplay(text);
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, [trigger, text, speed]);

  return <span className={`font-mono ${className}`}>{display}</span>;
}

function Marquee({ items, className = "" }) {
  const track = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex w-max gap-10 animate-[marquee_26s_linear_infinite]">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-4 font-display text-3xl md:text-5xl text-ink/10 whitespace-nowrap select-none">
            {item}
            <span className="text-gold/30 text-2xl">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// ─── Re-instated StackCard for the Stacked Layout ────────────────────────
function StackCard({ children, index, total, progress }) {
  const segments = Math.max(total - 1, 1);
  const start = index === 0 ? -1 : (index - 1) / segments;
  const end = index === 0 ? 0 : index / segments;

  const rawY = useTransform(progress, [start, end], ["100%", "0%"]);
  const y = index === 0 ? "0%" : rawY;

  return (
    <motion.div
      style={{ y, zIndex: index }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

// ─── Restored StatNumber (from main branch) ──────────────────────────────
function StatNumber({ value, suffix, inView }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span className="font-display text-3xl text-ink">
      <span ref={ref}>0</span>
      <span className="ml-0.5 text-base text-accent">{suffix}</span>
    </span>
  );
}

// ─── Aceternity 3D TiltCard (from incoming branch) ───────────────────────
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
    animate(rotateY, (px - 0.5) * 6, { duration: 0.2, ease: EASE });
    animate(rotateX, (0.5 - py) * 6, { duration: 0.2, ease: EASE });
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
      style={{ rotateX, rotateY, transformPerspective: 2600 }}
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

export default function Anatomy() {
  const shouldReduceMotion = useReducedMotion();
  const data = COPY.anatomy;

  const [activeFilter, setActiveFilter] = useState("All");
  
  // Preserved state from main branch
  const [hoveredPendant, setHoveredPendant] = useState(null);
  
  const filteredItems = data.collectionItems.filter(
    (item) => activeFilter === "All" || item.tag === activeFilter
  );

  // Stack Scroll hooks restored so the layout component doesn't crash
  const stackScrollRef = useRef(null);
  const { scrollYProgress: stackProgress } = useScroll({
    target: stackScrollRef,
    offset: ["start start", "end end"],
  });

  const marqueeNames = useMemo(
    () => data.collectionItems.map((item) => item.name?.toUpperCase() || item.title?.toUpperCase() || "TRAKID"),
    [data.collectionItems]
  );

  // ----- hero pendant parallax -----
  const heroRef = useRef(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const px = useSpring(useTransform(mvX, [-0.5, 0.5], [-10, 10]), { stiffness: 80, damping: 16 });
  const py = useSpring(useTransform(mvY, [-0.5, 0.5], [-10, 10]), { stiffness: 80, damping: 16 });
  const tiltX = useSpring(useTransform(mvY, [-0.5, 0.5], [8, -8]), { stiffness: 90, damping: 14 });
  const tiltY = useSpring(useTransform(mvX, [-0.5, 0.5], [-8, 8]), { stiffness: 90, damping: 14 });

  function handleHeroMove(e) {
    if (shouldReduceMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  // ----- collection spotlight -----
  const collectionRef = useRef(null);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotXSpring = useSpring(spotX, { stiffness: 60, damping: 20 });
  const spotYSpring = useSpring(spotY, { stiffness: 60, damping: 20 });
  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${spotXSpring}% ${spotYSpring}%, rgba(201,166,107,0.08), transparent 62%)`;

  function handleCollectionMove(e) {
    if (shouldReduceMotion || !collectionRef.current) return;
    const rect = collectionRef.current.getBoundingClientRect();
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <SectionWrapper id="anatomy" className="relative pt-12 overflow-visible">
      <GoldShimmerStyle />
      <DotBackground />

      {/* ==========================================================
                            HERO (STACKED LAYOUT)
      ========================================================== */}

      <motion.div
        {...staggerContainer}
        onMouseMove={handleHeroMove}
        onMouseLeave={() => { mvX.set(0); mvY.set(0); }}
        className="relative z-10 flex flex-col items-center justify-center gap-16 min-h-[70vh] py-16"
      >
        {/* TOP COPY - Center Aligned, Full Width */}
        <motion.div {...fadeUp} className="space-y-8 relative z-20 flex flex-col items-center text-center w-full">
          <ChapterMarker>{data.eyebrow}</ChapterMarker>

          {/* GSAP kinetic heading — matches the rest of the site */}
          <KineticLine
            segments={[
              { t: "Crafted for every" },
              { t: "personality.", sticker: "gold" },
            ]}
            className="font-display font-black text-ink tracking-tighter leading-[1.05] text-5xl md:text-7xl xl:text-[80px] max-w-5xl mx-auto"
          />
          <KineticLine
            segments={[
              { t: "Designed for everyday" },
              { t: "protection.", sticker: "pink" },
            ]}
            className="font-display font-black text-ink tracking-tighter leading-[1.05] text-5xl md:text-7xl xl:text-[80px] max-w-5xl mx-auto"
          />

          <p className="max-w-2xl mx-auto text-lg leading-8 text-slate">
            Explore our collection of premium smart pendants where timeless
            craftsmanship meets intelligent protection.
          </p>
        </motion.div>

      </motion.div>

      {/* ==========================================================
                      COLLECTION TITLE + FILTER + GRID
      ========================================================== */}

      <div
        ref={collectionRef}
        onMouseMove={handleCollectionMove}
        className="relative mt-36 z-10"
      >
        {!shouldReduceMotion && (
          <motion.div
            style={{ background: spotlightBg }}
            className="pointer-events-none absolute -inset-x-6 -inset-y-10 lg:-inset-x-20 z-0"
          />
        )}

        <motion.div {...fadeUp} className="relative z-10 text-center">
          <p className="font-mono uppercase tracking-[0.35em] text-accent text-sm">
            Our Collection
          </p>

          <h2 className="mt-6 font-display text-5xl md:text-6xl text-ink">
            <TextGenerate text="Four Designs." />
            <br />
            <TextGenerate text="Endless Stories." />
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate">
            Every TrakID pendant blends premium jewellery craftsmanship with
            discreet smart safety technology.
          </p>

          <div className="mt-10 flex justify-center gap-3">
            {FILTERS.map((label) => {
              const active = activeFilter === label;
              return (
                <motion.button
                  key={label}
                  type="button"
                  onClick={() => setActiveFilter(label)}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                    active
                      ? "border-gold/60 text-ink"
                      : "border-gold/20 text-slate hover:border-gold/40"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill-bg"
                      className="absolute inset-0 -z-10 rounded-full bg-gold/15"
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  )}
                  {label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ==========================================================
                            COLLECTION GRID / STACK — hover-lift cards
        ========================================================== */}
        <div
          ref={stackScrollRef}
          style={{ height: `${Math.max(filteredItems.length, 1) * 100}vh` }}
          className="relative z-10 mt-20 mb-16 max-w-[1500px] mx-auto"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden px-4 py-8 lg:px-10 lg:py-12">
            {filteredItems.length === 0 && (
              <p className="flex h-full items-center justify-center py-16 text-center font-mono text-sm uppercase tracking-[0.2em] text-slate">
                No pieces in this category yet
              </p>
            )}
            {filteredItems.map((item, idx) => (
              <StackCard
                key={item.id}
                index={idx}
                total={filteredItems.length}
                progress={stackProgress}
              >
                <TiltCard
                  reducedMotion={shouldReduceMotion}
                  className="mx-auto h-full w-full max-w-[1400px] rounded-[28px]"
                  onHoverChange={(isHovering) => setHoveredPendant(isHovering ? item.id : null)}
                  dimmed={hoveredPendant && hoveredPendant !== item.id}
                >
                  <PendantCard item={item} index={idx + 1} total={filteredItems.length} />
                </TiltCard>
              </StackCard>
            ))}
          </div>
        </div>
      </div>

      <div className="border-y border-gold/15 py-6 mb-28 -mx-6 lg:-mx-20">
        <Marquee items={marqueeNames} />
      </div>

      <Divider />
    </SectionWrapper>
  );
}