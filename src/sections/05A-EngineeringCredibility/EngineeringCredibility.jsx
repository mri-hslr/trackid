// EngineeringCredibility.jsx
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, EASE } from '../../motion/variants';
import { COPY } from '../../content/copy';
import SpecGrid from './SpecGrid';
import TopographyBackground from '../../components/TopographyBackground';

const { eyebrow, headline, founders, specs } = COPY.engineeringCredibility;

const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: EASE },
};

export default function EngineeringCredibility() {
  return (
    <section className="relative isolate overflow-hidden bg-parchment py-24 px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <TopographyBackground />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-12">

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

        {/* Founder card */}
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
              {...slideInLeft}
              className="flex rounded-xl overflow-hidden border border-stone hover:border-accent/40 transition-all duration-300"
            >
              {/* Dark left strip with shimmer */}
              <div className="relative bg-ink flex flex-col items-center justify-center px-8 py-6 gap-3 flex-shrink-0 overflow-hidden">
                {/* Shimmer overlay */}
                <div className="shimmer-once absolute inset-0 pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/30 z-10" />
                <span className="font-mono text-xs text-parchment/40 tracking-widest uppercase whitespace-nowrap z-10">
                  {founder.role.split('&')[0].trim()}
                </span>
              </div>

              {/* Light right content */}
              <div className="flex flex-col justify-center gap-2 px-8 py-6 bg-stone/40">
                <span className="font-display text-xl text-ink">
                  {founder.name}
                </span>
                <span className="font-mono text-xs text-gold tracking-widest uppercase">
                  {founder.role}
                </span>
                <span className="font-body text-sm text-slate mt-1 leading-relaxed">
                  {founder.credential}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="divider-teardrop text-accentDeep">
          <span className="bullet" />
        </div>

        {/* Spec grid */}
        <motion.div {...fadeUp} className="flex flex-col gap-6">
          <span className="font-mono text-xs tracking-widest uppercase text-accentDeep">
            Technical Specifications
          </span>
          <SpecGrid specs={specs} />
        </motion.div>

      </div>
    </section>
  );
}