// src/components/CornerLabels.jsx
// Four short phrases anchored in the corners of a poster panel — the
// reference's Party-slogan layout, in TrakID's voice. Each fades in
// with a small stagger. Pass any subset; missing corners are skipped.
// Parent must be `relative`.

import { motion } from 'framer-motion';
import { EASE } from '../motion/variants';

const POSITIONS = {
  tl: 'top-6 left-6 md:top-8 md:left-10 text-left',
  tr: 'top-6 right-6 md:top-8 md:right-10 text-right',
  bl: 'bottom-6 left-6 md:bottom-8 md:left-10 text-left',
  br: 'bottom-6 right-6 md:bottom-8 md:right-10 text-right',
};

const ORDER = ['tl', 'tr', 'bl', 'br'];

export default function CornerLabels({ labels = {}, tone = 'text-gold/70' }) {
  return (
    <>
      {ORDER.map((pos, i) =>
        labels[pos] ? (
          <motion.span
            key={pos}
            initial={{ opacity: 0, y: pos.startsWith('t') ? -8 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.1 }}
            className={`corner-label ${POSITIONS[pos]} ${tone}`}
          >
            {labels[pos]}
          </motion.span>
        ) : null
      )}
    </>
  );
}
