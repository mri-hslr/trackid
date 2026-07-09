import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, BadgeCheck } from "lucide-react";

import { ASSETS } from "../../content/assets";
import { EASE, fadeUp } from "../../motion/variants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function PendantCard({ item }) {
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

  return (
    <motion.article
      ref={cardRef}
      {...fadeUp}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.015 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[32px]
        border
        border-gold/20
        bg-white/70
        backdrop-blur
        p-6
        shadow-sm
        transition-[border-color,box-shadow]
        duration-300
        hover:border-gold/50
        hover:shadow-2xl
      "
    >
      {/* Cursor-following glow, replaced with a centered glow that fades in on hover */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Holographic foil sweep — a jewellery-counter sheen that crosses the
          whole card diagonally on hover, on top of the cursor glow */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ x: "-130%" }}
          animate={isHovering ? { x: "130%" } : { x: "-130%" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 z-20 mix-blend-overlay"
          style={{
            background:
              "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.55) 45%, rgba(201,166,107,0.4) 55%, transparent 80%)",
          }}
        />
      )}

      {/* Hallmark stamp — a small jeweller's mark that "stamps" into place
          when the card enters view, echoing the engraving on the reverse */}
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 1.8, opacity: 0, rotate: -18 }}
        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
        className="absolute right-8 top-8 z-30 flex items-center gap-1.5 rounded-full border border-gold/30 bg-parchment/90 px-3 py-1.5 shadow-sm"
      >
        <BadgeCheck size={13} strokeWidth={2} className="text-accent" />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
          Hallmarked
        </span>
      </motion.div>

      {/* Image — click to flip to the back / engraving side */}

      <div className="relative flex justify-center overflow-hidden py-2 mb-2" style={{ transformStyle: "preserve-3d" }}>
        <button
          type="button"
          onClick={() => setShowBack((v) => !v)}
          className="relative z-10 [perspective:1000px]"
          aria-label={showBack ? "Show front of pendant" : "Show back of pendant"}
        >
          {/* Rotating bezel ring — a slow, jeweller's-loupe halo that frames
              the piece and quickens gently on hover */}
          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: isHovering ? 6 : 16, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute -inset-4 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, rgba(201,166,107,0.5) 12%, transparent 24%, transparent 50%, rgba(201,166,107,0.35) 62%, transparent 74%)",
                WebkitMaskImage:
                  "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100% - 2px) calc(100% - 1px), transparent 100%)",
                maskImage:
                  "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100% - 2px) calc(100% - 1px), transparent 100%)",
              }}
            />
          )}

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
                  : { y: [-3, 3, -3], rotate: [-1, 1, -1] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: EASE }}
              style={{ backfaceVisibility: "hidden", objectFit: "contain" }}
              className="h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
            <img
              src={backImage}
              alt={`${item.name} — reverse`}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                objectFit: "contain",
              }}
              className="absolute inset-0 h-full w-full"
            />
          </motion.div>
          <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
            {showBack ? "← front" : "engraving →"}
          </span>
        </button>

        {/* Top Annotation */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute left-0 top-5"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              {item.motifNotes[0].title}
            </span>
            <div className="h-px w-12 bg-gold/40" />
          </div>
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