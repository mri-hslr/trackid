import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import SectionWrapper from "../../components/SectionWrapper";
import Divider from "../../components/Divider";
import TopographyBackground from "../../components/TopographyBackground";

import { COPY } from "../../content/copy";
import { fadeUp, staggerContainer, EASE } from "../../motion/variants";

// ─── Shared float animation (no spring, uses EASE, respects reduced motion) ──
function FloatPendant({ children, reducedMotion }) {
  return (
    <motion.div
      animate={reducedMotion ? {} : { y: [-8, 8, -8] }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut", // sinusoidal float — not EASE cubic, which is for entrances
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Thin gold accent bar used before section headings ────────────────────────
function AccentBar() {
  return <div className="h-[2px] w-12 rounded-full bg-gold mb-6" />;
}

export default function ComplianceCase() {
  const data = COPY.complianceCase;
  const reducedMotion = useReducedMotion();

  // Parallax on the decorative glow blobs
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [40, -40]);

  return (
    <SectionWrapper id="compliance-case" className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <TopographyBackground />
      </div>

      {/* ================================================================
          HERO — headline + pendant timeline
      ================================================================ */}
      <div ref={heroRef} className="relative">

        {/* Ambient glow — parallax */}
        <motion.div
          style={{ y: glowY }}
          className="pointer-events-none absolute -right-32 -top-20 h-[520px] w-[520px] rounded-full bg-gold/8 blur-[160px]"
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-80px" }}
          className="relative grid gap-20 lg:grid-cols-[1fr_600px] items-center"
        >

          {/* LEFT — headline */}
          <motion.div variants={fadeUp} className="relative z-10">
            <p className="font-mono uppercase tracking-[0.45em] text-accent text-xs">
              {data.eyebrow}
            </p>

            <h2 className="mt-6 font-display text-5xl md:text-7xl xl:text-[82px] leading-[0.93] tracking-tight text-ink max-w-xl">
              {data.headline}
            </h2>

            <p className="mt-8 max-w-md text-lg leading-8 text-slate">
              {data.body}
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <button className="rounded-full bg-ink text-parchment px-8 py-3.5 text-sm font-body font-medium hover:bg-ink/85 transition-colors duration-200">
                Explore Solution
              </button>
              <button className="rounded-full border border-ink/30 text-ink px-8 py-3.5 text-sm font-body font-medium hover:bg-ink/5 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* RIGHT — pendant + timeline */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-[240px_1fr] items-start gap-8"
          >

            {/* Pendant placeholder */}
            <FloatPendant reducedMotion={reducedMotion}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/15 blur-[80px]" />
                <div className="relative h-[400px] rounded-[100px] border border-gold/20 bg-white/70 backdrop-blur-xl shadow-xl flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/25 bg-parchment shadow-sm">
                      <span className="text-3xl">💎</span>
                    </div>
                    <h4 className="mt-5 font-display text-xl text-ink">Classic Teardrop</h4>
                    <p className="mt-1.5 font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
                      Image Coming Soon
                    </p>
                  </div>
                </div>
              </div>
            </FloatPendant>

            {/* Timeline */}
            <div className="relative pt-10">
              <div className="absolute left-[19px] top-14 bottom-8 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />

              {[
                { title: "Acceptance", desc: "Children naturally choose to wear TrakID — it looks like a gift, not a gadget." },
                { title: "Daily Wear", desc: "Comfortable enough to forget it's there. Worn continuously, not reluctantly." },
                { title: "Continuous Safety", desc: "Protection only works when it stays on. TrakID stays on." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={reducedMotion ? {} : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
                  whileHover={reducedMotion ? {} : { x: 6 }}
                  className="relative mb-7 ml-9 rounded-2xl border border-stone bg-white/90 p-6 shadow-sm
                             transition-shadow duration-300 hover:shadow-md hover:border-gold/30"
                >
                  <div className="absolute -left-[34px] top-6 h-4 w-4 rounded-full border-4 border-parchment bg-gold shadow-sm" />
                  <h4 className="font-display text-xl text-ink">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.desc}</p>
                </motion.div>
              ))}
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
        className="relative mt-32 overflow-hidden rounded-3xl border border-gold/20 bg-white/80 backdrop-blur-xl shadow-lg"
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/8 blur-[90px] pointer-events-none" />

        <div className="relative grid items-center gap-6 p-8 lg:p-10 lg:grid-cols-[80px_200px_1fr]">

          {/* Shield icon */}
          <div className="hidden lg:flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-parchment">
              <span className="text-3xl">🛡</span>
            </div>
          </div>

          {/* Big number */}
          <div className="lg:border-r lg:border-gold/15 lg:pr-8">
            <p className="font-display text-7xl leading-none text-accent">
              {data.statistic.value}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
              Compliance Gain
            </p>
          </div>

          {/* Text */}
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
          VALUE CARDS
      ================================================================ */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-24 grid gap-6 lg:grid-cols-3"
      >
        {data.valueCards.map((card) => {
          const icons = { Acceptance: "✓", "Daily Wear": "◉", "Continuous Safety": "🛡" };
          return (
            <motion.div
              key={card.title}
              variants={fadeUp}
              whileHover={reducedMotion ? {} : { y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="group relative overflow-hidden rounded-3xl border border-stone bg-white/80 p-8
                         backdrop-blur-xl shadow-sm transition-shadow duration-300
                         hover:shadow-xl hover:border-gold/30"
            >
              {/* Glow on hover */}
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/10 blur-2xl
                              opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

              <AccentBar />

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full
                              border border-gold/25 bg-parchment text-xl">
                {icons[card.title] ?? "✦"}
              </div>

              <h4 className="font-display text-2xl text-ink">{card.title}</h4>
              <p className="mt-4 leading-7 text-slate">{card.description}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ================================================================
          COMPLIANCE JOURNEY
      ================================================================ */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-36"
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="font-mono uppercase tracking-[0.35em] text-accent text-xs">
            Compliance Journey
          </p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl text-ink">
            Behaviour matters more than technology.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate max-w-xl mx-auto">
            Traditional trackers fail because children stop wearing them.
            TrakID is designed to become part of everyday life.
          </p>
        </motion.div>

        {/* Three-column layout */}
        <div className="mt-20 grid lg:grid-cols-[1fr_240px_1fr] gap-10 items-center">

          {/* Left — failure states */}
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
                <div className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full bg-alert/70" />
                <div>
                  <h3 className="font-display text-2xl text-ink">{item}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate">
                    Traditional trackers frequently end up {item.toLowerCase()}.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center pendant */}
          <FloatPendant reducedMotion={reducedMotion}>
            <div className="relative flex justify-center">
              <div className="absolute h-64 w-64 rounded-full bg-gold/12 blur-[80px]" />
              <div className="relative flex h-[380px] w-[220px] items-center justify-center
                              rounded-[90px] border border-gold/20 bg-white/70 shadow-xl backdrop-blur-xl">
                <div className="text-center">
                  <span className="text-6xl">💎</span>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">Pendant</p>
                </div>
              </div>
            </div>
          </FloatPendant>

          {/* Right — success states */}
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
                <div className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full bg-safe/80" />
              </motion.div>
            ))}
          </div>

        </div>

        {/* Progress timeline */}
        <div className="mt-20 px-4">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-alert/30 via-gold/30 to-safe/50" />
            {["Removed", "Hidden", "Forgotten", "Always Worn"].map((item, i) => (
              <div key={item} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`h-5 w-5 rounded-full border-2 border-parchment shadow-sm ${
                  i === 3 ? "bg-safe" : "bg-gold/60"
                }`} />
                <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                  i === 3 ? "text-safe" : "text-slate"
                }`}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

      </motion.section>

      {/* ================================================================
          COMPARISON TABLE
      ================================================================ */}
      <motion.div
        {...fadeUp}
        initial={fadeUp.initial}
        whileInView={fadeUp.whileInView}
        viewport={fadeUp.viewport}
        transition={fadeUp.transition}
        className="mt-32 rounded-3xl border border-stone bg-white/80 backdrop-blur-xl shadow-lg overflow-hidden"
      >
        {/* Header row */}
        <div className="grid lg:grid-cols-2">
          <div className="bg-stone/40 p-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-slate">Traditional</p>
            <h3 className="mt-3 font-display text-3xl text-slate">GPS Tracker</h3>
          </div>
          <div className="border-l border-stone bg-gold/5 p-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accentDeep">TrakID</p>
            <h3 className="mt-3 font-display text-3xl text-ink">Jewellery First</h3>
          </div>
        </div>

        {/* Comparison rows */}
        {data.comparison.map((item, i) => (
          <motion.div
            key={i}
            whileHover={reducedMotion ? {} : { backgroundColor: "rgba(201,166,107,0.04)" }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-2 border-t border-stone/60"
          >
            <div className="flex items-center gap-4 p-6 lg:p-7">
              <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center
                               rounded-full bg-alert/10 text-alert text-xs">✕</span>
              <p className="text-slate text-base">{item.traditional}</p>
            </div>
            <div className="border-l border-stone/60 flex items-center gap-4 p-6 lg:p-7">
              <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center
                               rounded-full bg-safe/10 text-safe text-xs">✓</span>
              <p className="text-ink text-base font-medium">{item.trakid}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

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
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
            Why TrakID Works
          </p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl text-ink">
            Designed around behaviour, not just technology.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {data.benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={fadeUp}
              whileHover={reducedMotion ? {} : { y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="group rounded-3xl border border-stone bg-white/70 p-8 backdrop-blur
                         shadow-sm transition-shadow duration-300 hover:shadow-lg hover:border-gold/30"
            >
              <AccentBar />
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full
                              border border-gold/20 bg-parchment text-lg">
                ✦
              </div>
              <h3 className="font-display text-2xl text-ink">{benefit.title}</h3>
              <p className="mt-4 leading-7 text-slate">{benefit.description}</p>
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