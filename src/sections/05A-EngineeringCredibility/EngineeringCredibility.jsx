import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../motion/variants';
import { COPY } from '../../content/copy';
import SpecGrid from './SpecGrid';

const { eyebrow, headline, founders, specs } = COPY.engineeringCredibility;

export default function EngineeringCredibility() {
  return (
    <section className="bg-parchment py-24 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-20">

        {/* Eyebrow + Headline */}
        <motion.div {...fadeUp} className="flex flex-col gap-3">
          <span className="font-mono text-xs tracking-widest uppercase text-accentDeep">
            {eyebrow}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
            {headline}
          </h2>
          <div className="w-12 h-px bg-accent mt-2" />
        </motion.div>

        {/* Founder strip */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col gap-4"
        >
          {founders.map((founder) => (
            <motion.div
              key={founder.name}
              variants={fadeUp}
              className="flex items-center gap-6 p-6 
                bg-stone border border-stone/60
                hover:border-accent/40
                rounded-lg transition-all duration-300"
            >
              {/* Photo placeholder */}
              <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-body text-sm font-semibold text-ink">
                  {founder.name}
                </span>
                <span className="font-mono text-xs text-accentDeep tracking-wide uppercase">
                  {founder.role}
                </span>
                <span className="font-body text-sm text-slate mt-1">
                  {founder.credential}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Spec grid */}
        <motion.div {...fadeUp} className="flex flex-col gap-6">
          <span className="font-mono text-xs tracking-widest uppercase text-slate">
            Technical Specifications
          </span>
          <SpecGrid specs={specs} />
        </motion.div>

      </div>
    </section>
  );
}