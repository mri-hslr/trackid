import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, BadgeCheck, ArrowUpRight, RotateCw } from "lucide-react";

import { ASSETS } from "../../content/assets";
import { EASE, fadeUp } from "../../motion/variants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Three-dot cluster — a small recurring brand mark used the same way a
// jeweller's hallmark or a studio's signature dots would sit beside a title.
function BrandDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-gold" />
      <span className="h-2 w-2 rounded-full bg-accentDeep" />
      <span className="h-2 w-2 rounded-full bg-safe" />
    </div>
  );
}

export default function PendantCard({ item, index = 1, total = 4 }) {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [showBack, setShowBack] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const image =
    ASSETS.pendants[item.id]?.heroImage ||
    ASSETS.pendants.classicTeardrop.heroImage;
  const backImage =
    ASSETS.pendants[item.id]?.backImage || image;

  function handleMouseLeave() {
    setIsHovering(false);
  }

  // Alternate sides card-to-card: odd pieces show the image on the left,
  // even pieces show it on the right — order controls grid placement,
  // not just visual position, so this actually swaps which track each
  // panel lands in at the lg breakpoint.
  const imageOnLeft = index % 2 === 1;
  const textOrderClass = imageOnLeft ? "lg:order-2" : "lg:order-1";
  const imageOrderClass = imageOnLeft ? "lg:order-1" : "lg:order-2";

  return (
    <motion.article
      ref={cardRef}
      {...fadeUp}
      onMouseLeave={handleMouseLeave}
      whileHover={shouldReduceMotion ? undefined : { y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="
        group
        relative
        grid
        h-full
        grid-cols-1
        overflow-hidden
        rounded-[32px]
        border
        border-gold/20
        bg-white/70
        backdrop-blur
        p-6
        shadow-sm
        backdrop-blur
        transition-[border-color,box-shadow]
        duration-300
        hover:border-gold/50
        hover:shadow-2xl
        lg:grid-cols-2
      "
    >
      {/* ============================================================
                TEXT PANEL — name, tags, description, CTA
      ============================================================ */}
      <div className={`relative z-10 order-2 flex flex-col justify-between gap-10 p-8 ${textOrderClass} lg:p-14`}>
        <div>
          <div className="flex items-center justify-between">
            <BrandDots />
            <span className="font-mono text-sm uppercase tracking-[0.3em] text-accentDeep/70">
              {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Hallmark stamp */}
          <motion.div
            initial={shouldReduceMotion ? false : { scale: 1.8, opacity: 0, rotate: -18 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-parchment/90 px-3.5 py-2"
          >
            <BadgeCheck size={14} strokeWidth={2} className="text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Hallmarked
            </span>
          </motion.div>

          <h3 className="mt-8 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-stone lg:text-6xl xl:text-[4rem]">
            {item.name}
          </h3>

          <p className="mt-5 max-w-lg text-lg leading-8 text-slate">{item.description}</p>

          {/* Full motif list — each piece's title AND its description,
              not just a condensed one-line tag row. */}
          <div className="mt-8 space-y-5">
            {item.motifNotes.map((note, noteIndex) => (
              <motion.div
                key={note.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: noteIndex * 0.08, ease: EASE }}
                className="flex items-start gap-4"
              >
                <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-125" />
                <div>
                  <p className="font-display text-lg font-medium tracking-tight text-stone">
                    {note.title}
                  </p>
                  <p className="mt-1 text-base leading-7 text-slate">{note.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-3 text-left"
            >
              <span className="font-mono text-sm uppercase tracking-[0.3em] text-accentDeep">
                {expanded ? "Hide specs" : "Tech specs"}
              </span>
              <motion.span
                animate={{ rotate: expanded ? 45 : 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30"
              >
                <Plus size={14} strokeWidth={2} className="text-accentDeep" />
              </motion.span>
            </button>

            <motion.button
              type="button"
              onClick={() => setShowBack((v) => !v)}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Flip pendant"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-parchment shadow-sm"
            >
              <ArrowUpRight size={20} strokeWidth={2} />
            </motion.button>
          </div>

          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-wider text-slate">
              {(item.specs || []).map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={false}
                  animate={
                    expanded
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: shouldReduceMotion ? 0 : 6 }
                  }
                  transition={{ duration: 0.3, ease: EASE, delay: expanded ? i * 0.05 : 0 }}
                  className="flex flex-col gap-1"
                >
                  <dt className="text-accentDeep/70">{spec.label}</dt>
                  <dd className="text-stone normal-case tracking-normal text-sm font-body">
                    {spec.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
                IMAGE PANEL — the piece fills its own showcase space,
                mirroring a framed product shot rather than floating
                in a corner of a mostly-empty card.
      ============================================================ */}
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative order-1 h-[420px] overflow-hidden bg-parchment ${imageOrderClass} lg:h-full`}
      >
        {/* Ambient glow behind the piece — kept subtle so the panel still reads as void-black */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl" />

        {/* Rotating bezel ring */}
        {!shouldReduceMotion && (
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: isHovering ? 7 : 18, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, rgba(201,166,107,0.55) 12%, transparent 24%, transparent 50%, rgba(201,166,107,0.4) 62%, transparent 74%)",
              WebkitMaskImage:
                "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100% - 2px) calc(100% - 1px), transparent 100%)",
              maskImage:
                "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100% - 2px) calc(100% - 1px), transparent 100%)",
            }}
          />
        )}

        {/* Holographic foil sweep on hover */}
        {!shouldReduceMotion && (
          <motion.div
            aria-hidden="true"
            initial={{ x: "-130%" }}
            animate={isHovering ? { x: "130%" } : { x: "-130%" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 z-20 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.5) 45%, rgba(201,166,107,0.4) 55%, transparent 80%)",
            }}
          />
        )}

      <div className="relative flex justify-center overflow-hidden py-2 mb-2" style={{ transformStyle: "preserve-3d" }}>
        <button
          type="button"
          onClick={() => setShowBack((v) => !v)}
          className="relative z-10 [perspective:1000px]"
          aria-label={showBack ? "Show front of pendant" : "Show back of pendant"}
        >
          <div className="h-px w-8 bg-gold/50" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/70">
            {item.motifNotes[0].title}
          </span>
        </motion.div>

        {/* Bottom-right annotation */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute bottom-6 right-6 z-30 flex items-center gap-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/70">
            {item.motifNotes[1].title}
          </span>
          <div className="h-px w-8 bg-gold/50" />
        </motion.div>

        {/* The pendant itself — fills almost the entire showcase, leaving
            only a thin border of black at the panel's edges */}
        <div className="relative flex h-full w-full items-center justify-center p-6 [perspective:1200px] lg:p-10">
          <motion.div
            animate={{ rotateY: showBack ? 180 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
  width: 220,
  height: 220,
}}
className="relative overflow-hidden rounded-3xl lg:!h-[240px] lg:!w-[240px]"
          >
            <motion.img
              src={image}
              alt={item.name}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [-4, 4, -4], rotate: [-1.5, 1.5, -1.5] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: EASE }}
              style={{ backfaceVisibility: "hidden", objectFit: "contain" }}
              className="absolute inset-0 h-full w-full drop-shadow-[0_18px_34px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105"
            />
            <img
              src={backImage}
              alt={`${item.name} — reverse`}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                objectFit: "contain",
              }}
              className="absolute inset-0 h-full w-full drop-shadow-[0_18px_34px_rgba(0,0,0,0.45)]"
            />
          </motion.div>

        {/* Bottom Annotation */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute right-0 bottom-6 text-right"
        >
          <div className="flex items-center justify-end gap-3">
            <div className="h-px w-12 bg-gold/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              {item.motifNotes[1].title}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Growable middle content — flex-1 lets this stretch so the footer
          below always lands at the same y across cards, regardless of how
          long each pendant's description or motif list is. */}
      <div className="flex-1">
        {/* Name */}
        <h3 className="mt-2 font-display text-3xl text-ink leading-tight">
          {item.name}
        </h3>

        {/* Description */}
        <p className="mt-3 text-[17px] leading-7 text-slate line-clamp-2">{item.description}</p>

        {/* Motifs */}
        <div className="mt-6 space-y-2">
          {item.motifNotes.map((note, index) => (
            <motion.div
              key={note.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
              className="flex items-start gap-4"
            >
              <div className="mt-2 h-2 w-2 rounded-full bg-gold transition-transform duration-300 group-hover:scale-125" />
              <div>
                <p className="font-display text-base text-ink">{note.title}</p>
                <p className="text-sm text-slate">
                  {note.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Footer — now an actual disclosure trigger, not just static text */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex w-full items-center justify-between border-t border-gold/15 pt-5 text-left"
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Craft Collection
        </span>
        <span className="flex items-center gap-2 font-body text-sm text-slate">
          {expanded ? "Hide specs" : "Tech specs"}
          <motion.span
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Plus size={14} strokeWidth={2} className="text-accent" />
          </motion.span>
        </span>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: EASE }}
        className="overflow-hidden"
      >
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-wider text-slate">
          {(item.specs || []).map((spec, index) => (
            <motion.div
              key={spec.label}
              initial={false}
              animate={
                expanded
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: shouldReduceMotion ? 0 : 6 }
              }
              transition={{ duration: 0.3, ease: EASE, delay: expanded ? index * 0.05 : 0 }}
              className="flex flex-col gap-1"
            >
              <dt className="text-accent/70">{spec.label}</dt>
              <dd className="text-ink normal-case tracking-normal text-sm font-body">
                {spec.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>
    </motion.article>
  );
}
