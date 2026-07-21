// src/components/ChapterMarker.jsx
// The recurring chapter eyebrow for the story flow — mono, tracked-out,
// with short hairlines either side. Use at the top of every chapter
// section so the page reads as one continuous book.

import { motion } from 'framer-motion';
import { fadeUp } from '../motion/variants';

export default function ChapterMarker({ children, className = '' }) {
  return (
    <motion.div
      {...fadeUp}
      className={`flex items-center justify-center gap-4 ${className}`}
    >
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
      <span className="font-mono text-[10px] md:text-xs uppercase tracking-kicker text-gold whitespace-nowrap">
        {children}
      </span>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
    </motion.div>
  );
}
