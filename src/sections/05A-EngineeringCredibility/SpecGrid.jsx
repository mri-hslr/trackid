import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../motion/variants';

function SpecCard({ icon, label }) {
  const LucideIcon = Icons[icon];

  return (
    <motion.div
      variants={fadeUp}
      className="group flex flex-col items-center gap-4 p-6 
        bg-stone border border-stone 
        hover:border-accent hover:bg-parchment
        hover:shadow-[0_8px_32px_rgba(157,180,199,0.2)]
        hover:-translate-y-1 
        rounded-lg transition-all duration-300 cursor-default"
    >
      {LucideIcon && (
        <div className="p-3 rounded-full bg-parchment group-hover:bg-accent/10 transition-colors duration-300">
          <LucideIcon size={20} className="text-slate group-hover:text-accentDeep transition-colors duration-300" />
        </div>
      )}
      <span className="font-mono text-xs tracking-widest uppercase text-slate group-hover:text-ink transition-colors duration-300 text-center">
        {label}
      </span>
    </motion.div>
  );
}

export default function SpecGrid({ specs }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {specs.map((spec) => (
        <SpecCard key={spec.label} icon={spec.icon} label={spec.label} />
      ))}
    </motion.div>
  );
}