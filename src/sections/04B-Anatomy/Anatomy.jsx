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
  animate,
} from "framer-motion";

import SectionWrapper from "../../components/SectionWrapper";
import Divider from "../../components/Divider";
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

// ─── Radar Pulse — expanding GPS-signal rings, on-theme for a tracker ──────
function RadarPulse({ tone = "gold", size = 340, ringCount = 3, reducedMotion }) {
  const toneClass = tone === "gold" ? "border-gold/45" : "border-accent/45";
  if (reducedMotion) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.span
          key={i}
          style={{ width: size, height: size }}
          className={`absolute rounded-full border ${toneClass}`}
          animate={{ scale: [0.55, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: i * 1 }}
        />
      ))}
    </div>
  );
}

// ─── Capability Halo — feature icons orbiting the hero pendant ────────────
// Signature move for the hero: instead of stating the six capabilities as a
// list, they visibly encircle the physical object they belong to.
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
              className="absolute left-1/2 top-1/2 flex h-11 w-11 -ml-[22px] -mt-[22px] items-center justify-center rounded-full border border-gold/25 bg-white/85 shadow-sm"
              style={{ transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)` }}
            >
              <Icon size={16} strokeWidth={1.8} className="text-accent" />
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-white/85 backdrop-blur shadow-sm"
            >
              <Icon size={16} strokeWidth={1.8} className="text-accent" />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

// ─── Text Generate — words flip in on a 3D axis, staggered ────────────────
// `highlight` marks specific words for a gold-foil shimmer treatment instead
// of the flat ink color — used to land on the one or two words that carry
// the sentence's meaning (e.g. "personality", "protection").
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
              viewport={{ once: true, margin: "-60px" }}
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
      {highlight.length > 0 && (
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
      )}
    </span>
  );
}

// ─── Highlight helper — wraps specific words in a gold-foil shimmer span ──
// Uses real space characters between words (not CSS margin) so the browser
// still has natural line-break opportunities and wraps normally.
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

// One shared shimmer keyframe definition, rendered once wherever it's used.
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

// ─── Scramble / decode text — random glyphs settle left → right ───────────
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

// ─── Hover wrapper — simple lift, dims siblings ────────────────────────────
function TiltCard({ children, className = "", dimmed, onHoverChange, reducedMotion }) {
  return (
    <motion.div
      animate={{
        scale: dimmed ? 0.98 : 1,
        opacity: dimmed ? 0.6 : 1,
        filter: dimmed ? "blur(1px)" : "blur(0px)",
      }}
      whileHover={reducedMotion ? undefined : { y: -8 }}
      transition={{ duration: 0.3, ease: EASE }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Infinite marquee — duplicated track, pure CSS loop, edges feathered ──
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

export default function Anatomy() {
  const shouldReduceMotion = useReducedMotion();
  const data = COPY.anatomy;

  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredPendant, setHoveredPendant] = useState(null);
  const filteredItems = data.collectionItems.filter(
    (item) => activeFilter === "All" || item.tag === activeFilter
  );

  const marqueeNames = useMemo(
    () => data.collectionItems.map((item) => item.name?.toUpperCase() || item.title?.toUpperCase() || "TRAKID"),
    [data.collectionItems]
  );

  const stripRef = useRef(null);
  const stripInView = useInView(stripRef, { once: true, margin: "-80px" });

  // ----- hero pendant parallax, follows cursor across the whole hero -----
  const heroRef = useRef(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const px = useSpring(useTransform(mvX, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 16 });
  const py = useSpring(useTransform(mvY, [-0.5, 0.5], [-14, 16]), { stiffness: 80, damping: 16 });
  const tiltX = useSpring(useTransform(mvY, [-0.5, 0.5], [10, -10]), { stiffness: 90, damping: 14 });
  const tiltY = useSpring(useTransform(mvX, [-0.5, 0.5], [-10, 10]), { stiffness: 90, damping: 14 });

  function handleHeroMove(e) {
    if (shouldReduceMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  // ----- cursor spotlight over the collection section -----
  // A jeweller's loupe follows the cursor while browsing pieces closely.
  const collectionRef = useRef(null);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotXSpring = useSpring(spotX, { stiffness: 60, damping: 20 });
  const spotYSpring = useSpring(spotY, { stiffness: 60, damping: 20 });
  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${spotXSpring}% ${spotYSpring}%, rgba(201,166,107,0.10), transparent 62%)`;

  function handleCollectionMove(e) {
    if (shouldReduceMotion || !collectionRef.current) return;
    const rect = collectionRef.current.getBoundingClientRect();
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <SectionWrapper id="anatomy">
      {/* ==========================================================
                            HERO
      ========================================================== */}

      <motion.div
        {...staggerContainer}
        onMouseMove={handleHeroMove}
        onMouseLeave={() => { mvX.set(0); mvY.set(0); }}
        className="relative grid items-center gap-20 lg:grid-cols-[1.1fr_0.9fr]"
      >
        {/* LEFT */}
        <motion.div {...fadeUp} className="space-y-8">
          <ScrambleText
            text={data.eyebrow}
            className="uppercase tracking-[0.35em] text-accent text-sm block"
          />

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ originX: 0 }}
            className="h-[2px] w-12 rounded-full bg-gold"
          />

          <GoldShimmerStyle />
          <h2 className="font-display text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-ink max-w-xl">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -70, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 110, damping: 13, delay: 0 }}
            >
              {renderHighlightedWords("Crafted for every personality.", ["personality"])}
            </motion.div>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -70, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 110, damping: 13, delay: 0.18 }}
            >
              {renderHighlightedWords("Designed for everyday protection.", ["protection"])}
            </motion.div>
          </h2>

          <p className="max-w-lg text-lg leading-8 text-slate">
            Explore our collection of premium smart pendants where timeless
            craftsmanship meets intelligent protection.
          </p>
        </motion.div>

        {/* RIGHT — cursor-tracked parallax + 3D tilt + radar signal + capability halo */}
        <motion.div {...fadeUp} ref={heroRef} className="relative flex justify-center">
          <RadarPulse tone="gold" size={460} reducedMotion={shouldReduceMotion} />
          <CapabilityHalo items={FEATURES} radius={215} reducedMotion={shouldReduceMotion} />

          <motion.div
            style={shouldReduceMotion ? undefined : { x: px, y: py }}
            className="absolute inset-0 rounded-full bg-gold/10 blur-3xl scale-110"
          />
          <div className="absolute inset-x-8 bottom-8 h-8 rounded-full bg-ink/10 blur-xl opacity-40" />

          {/* Pendant photo — pivots from the top edge, where a chain would attach,
              so the loop reads as the necklace swaying on its chain rather than
              the whole card rocking around its own center. No x/y drift: the
              piece stays anchored in place, it only sways and tilts. */}
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200, transformOrigin: "50% 6%" }
            }
            animate={shouldReduceMotion ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            transition={{ duration: 5.5, repeat: Infinity, ease: EASE }}
            className="relative z-10"
          >
            <div className="relative overflow-hidden rounded-[28px]">
              <img
                src={ASSETS.pendants.classicTeardrop.heroImage}
                alt="TrakID Pendant"
                className="relative z-10 w-[340px] lg:w-[430px]"
              />
              {/* Diagonal glare sweep across the pendant, looping */}
              {!shouldReduceMotion && (
                <motion.div
                  animate={{ x: ["-150%", "150%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent z-20"
                />
              )}
            </div>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* ==========================================================
                      COLLECTION TITLE + FILTER + GRID
                      (cursor spotlight wraps this whole block)
      ========================================================== */}

      <div
        ref={collectionRef}
        onMouseMove={handleCollectionMove}
        className="relative mt-36"
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

          {/* Filter pills — magnetic hover pull + shared layout pill */}
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
                            COLLECTION GRID — hover-lift cards
        ========================================================== */}

        <motion.div
          layout
          {...staggerContainer}
          className="relative z-10 mt-20 mb-16 grid gap-12 lg:grid-cols-2 max-w-[1500px] mx-auto"
        >
          {filteredItems.map((item, idx) => (
            <motion.div key={item.id} layout className="h-full">
              <TiltCard
                reducedMotion={shouldReduceMotion}
                dimmed={hoveredPendant !== null && hoveredPendant !== idx}
                onHoverChange={(isHovering) => setHoveredPendant(isHovering ? idx : null)}
                className="h-full rounded-[28px]"
              >
                <PendantCard item={item} />
              </TiltCard>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-2 py-16 text-center font-mono text-sm uppercase tracking-[0.2em] text-slate">
              No pieces in this category yet
            </p>
          )}
        </motion.div>
      </div>

      {/* Kinetic marquee of collection names — texture between grid and features */}
      <div className="border-y border-gold/15 py-6 mb-28 -mx-6 lg:-mx-20">
        <Marquee items={marqueeNames} />
      </div>

      {/* ==========================================================
                    FEATURE INTRO
      ========================================================== */}

      <div className="mt-32">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="font-mono uppercase tracking-[0.35em] text-accent text-sm">
            ENGINEERED FOR EVERYDAY LIFE
          </p>

          <h3 className="mt-5 font-display text-4xl text-ink">
            <TextGenerate text="Built for comfort. Designed for protection." />
          </h3>

          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-slate">
            Every TrakID pendant combines premium materials with reliable
            technology, making it comfortable enough to wear and dependable
            enough to protect.
          </p>
        </motion.div>

        {/* ==========================================================
                    FEATURE STRIP — cards flow continuously left → right,
                    pausing on hover so a reader can stop and look
        ========================================================== */}

        <motion.div
          ref={stripRef}
          {...fadeUp}
          className="group relative rounded-[32px] border border-gold/20 bg-white/60 backdrop-blur-md overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-70 z-10" />

          {/* Traveling signal pulse — a data packet running the length of the strip,
              on-theme for the "LTE Connected / always reachable" feature it sits above */}
          {!shouldReduceMotion && stripInView && (
            <motion.span
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear", repeatDelay: 0.6 }}
              className="pointer-events-none absolute top-0 z-20 h-2 w-2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(201,166,107,0.85)]"
            />
          )}

          <div
            className="relative overflow-hidden"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }}
          >
            <div className={`flex w-max ${shouldReduceMotion ? "" : "trakid-feature-track"}`}>
              {(shouldReduceMotion ? FEATURES : [...FEATURES, ...FEATURES]).map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={`${feature.title}-${index}`}
                    initial="rest"
                    whileHover="hover"
                    style={{ width: 300, minWidth: 300, flexShrink: 0 }}
                    className="relative group/card border-r border-gold/15 overflow-hidden"
                  >
                    {/* Sweeping gold highlight on hover */}
                    <motion.div
                      variants={{ rest: { x: "-100%" }, hover: { x: "100%" } }}
                      transition={{ duration: 0.9, ease: EASE }}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent z-0"
                    />

                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.45, delay: (index % FEATURES.length) * 0.06, ease: EASE }}
                      className="relative z-10 px-10 py-8 text-center transition-colors duration-300 group-hover/card:bg-gold/5"
                    >
                      <div className="relative mb-5 flex justify-center">
                        {!shouldReduceMotion && (
                          <motion.span
                            animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: (index % FEATURES.length) * 0.25 }}
                            className="absolute h-14 w-14 rounded-full border border-gold/40"
                          />
                        )}
                        <motion.div
                          animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
                          transition={{
                            duration: 3.5,
                            delay: (index % FEATURES.length) * 0.18,
                            repeat: Infinity,
                            ease: EASE,
                          }}
                          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold/5 transition-all duration-300 group-hover/card:border-gold/40 group-hover/card:bg-gold/10"
                        >
                          <Icon size={24} strokeWidth={1.75} className="text-accent" />
                        </motion.div>
                      </div>

                      <StatNumber value={feature.stat} suffix={feature.suffix} inView={stripInView} />

                      <h4 className="mt-2 font-display text-xl text-ink">{feature.title}</h4>

                      <p className="mt-2 leading-7 text-slate text-sm">{feature.subtitle}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {!shouldReduceMotion && (
            <style>{`
              .trakid-feature-track {
                animation: trakidFeatureFlow 42s linear infinite;
              }
              .trakid-feature-track:hover {
                animation-play-state: paused;
              }
              @keyframes trakidFeatureFlow {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
            `}</style>
          )}
        </motion.div>
      </div>

      <Divider />
    </SectionWrapper>
  );
}