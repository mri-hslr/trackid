import { useEffect, useRef, useState } from "react";
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
  useSpring,
  useTransform,
  useInView,
  animate,
} from "framer-motion";

import SectionWrapper from "../../components/SectionWrapper";
import Divider from "../../components/Divider";
import PendantCard from "./PendantCard";
import TopographyBackground from "../../components/TopographyBackground";

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
  const filteredItems = data.collectionItems.filter(
    (item) => activeFilter === "All" || item.tag === activeFilter
  );

  const stripRef = useRef(null);
  const stripInView = useInView(stripRef, { once: true, margin: "-80px" });

  // ----- hero pendant parallax, follows cursor across the whole hero -----
  const heroRef = useRef(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const px = useSpring(useTransform(mvX, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 16 });
  const py = useSpring(useTransform(mvY, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 16 });

  function handleHeroMove(e) {
    if (shouldReduceMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <SectionWrapper id="anatomy" className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <TopographyBackground />
      </div>

      {/* ==========================================================
                            HERO
      ========================================================== */}

      <motion.div
        {...staggerContainer}
        onMouseMove={handleHeroMove}
        onMouseLeave={() => { mvX.set(0); mvY.set(0); }}
        className="grid items-center gap-20 lg:grid-cols-[1.1fr_0.9fr]"
      >
        {/* LEFT */}
        <motion.div {...fadeUp} className="space-y-8">
          <p className="font-mono uppercase tracking-[0.35em] text-accent text-sm">
            {data.eyebrow}
          </p>

          <h2 className="font-display text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-ink max-w-xl">
            Crafted for every personality.
            <br />
            Designed for everyday protection.
          </h2>

          <p className="max-w-lg text-lg leading-8 text-slate">
            Explore our collection of premium smart pendants where timeless
            craftsmanship meets intelligent protection.
          </p>
        </motion.div>

        {/* RIGHT — now tracks the cursor across the whole hero, not just a fixed wobble */}
        <motion.div {...fadeUp} ref={heroRef} className="relative flex justify-center">
          <motion.div
            style={shouldReduceMotion ? undefined : { x: px, y: py }}
            animate={
              shouldReduceMotion ? undefined : { rotate: [-1, 1, -1] }
            }
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            transition={{ duration: 5, repeat: Infinity, ease: EASE }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-3xl scale-110" />
            <div className="absolute inset-x-8 bottom-8 h-8 rounded-full bg-ink/10 blur-xl opacity-40" />

            <img
              src={ASSETS.pendants.classicTeardrop.heroImage}
              alt="TrakID Pendant"
              className="relative z-10 w-[340px] lg:w-[430px]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ==========================================================
                      COLLECTION TITLE + FILTER
      ========================================================== */}

      <motion.div {...fadeUp} className="mt-36 text-center">
        <p className="font-mono uppercase tracking-[0.35em] text-accent text-sm">
          Our Collection
        </p>

        <h2 className="mt-6 font-display text-5xl md:text-6xl text-ink">
          Four Designs.
          <br />
          Endless Stories.
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate">
          Every TrakID pendant blends premium jewellery craftsmanship with
          discreet smart safety technology.
        </p>

        {/* Filter pills — actual interaction, the grid below responds to it */}
        <div className="mt-10 flex justify-center gap-3">
          {FILTERS.map((label) => {
            const active = activeFilter === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveFilter(label)}
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
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ==========================================================
                          COLLECTION GRID
      ========================================================== */}

      <motion.div
        layout
        {...staggerContainer}
        className="mt-20 mb-28 grid gap-10 lg:grid-cols-2"
      >
        {filteredItems.map((item) => (
          <motion.div key={item.id} layout>
            <PendantCard item={item} />
          </motion.div>
        ))}
        {filteredItems.length === 0 && (
          <p className="col-span-2 py-16 text-center font-mono text-sm uppercase tracking-[0.2em] text-slate">
            No pieces in this category yet
          </p>
        )}
      </motion.div>

      {/* ==========================================================
                    FEATURE INTRO
      ========================================================== */}

      <div className="mt-32">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="font-mono uppercase tracking-[0.35em] text-accent text-sm">
            ENGINEERED FOR EVERYDAY LIFE
          </p>

          <h3 className="mt-5 font-display text-4xl text-ink">
            Built for comfort. Designed for protection.
          </h3>

          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-slate">
            Every TrakID pendant combines premium materials with reliable
            technology, making it comfortable enough to wear and dependable
            enough to protect.
          </p>
        </motion.div>

        {/* ==========================================================
                    FEATURE STRIP — now with count-up stats
        ========================================================== */}

        <motion.div
          ref={stripRef}
          {...fadeUp}
          className="group relative rounded-[32px] border border-gold/20 bg-white/60 backdrop-blur-md overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-70" />

          <div className="grid md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-gold/10">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
                  className="group p-8 text-center transition-colors duration-300 hover:bg-gold/5"
                >
                  <div className="mb-5 flex justify-center">
                    <motion.div
                      animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
                      transition={{
                        duration: 3.5,
                        delay: index * 0.18,
                        repeat: Infinity,
                        ease: EASE,
                      }}
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold/5 transition-all duration-300 group-hover:border-gold/40 group-hover:bg-gold/10"
                    >
                      <Icon size={24} strokeWidth={1.75} className="text-accent" />
                    </motion.div>
                  </div>

                  <StatNumber value={feature.stat} suffix={feature.suffix} inView={stripInView} />

                  <h4 className="mt-2 font-display text-xl text-ink">{feature.title}</h4>

                  <p className="mt-2 leading-7 text-slate text-sm">{feature.subtitle}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <Divider />
    </SectionWrapper>
  );
}
