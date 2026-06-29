import { motion } from 'framer-motion';
import { fadeUp } from '../../motion/variants';
import { COPY } from '../../content/copy';
import * as Icons from 'lucide-react';
import Divider from '../../components/Divider';

const { brandStatement, tagline, footerColumns, socialLinks, copyright } = COPY.closing;

export default function Closing() {
  return (
    <section className="bg-parchment pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">

        <motion.div {...fadeUp} className="flex flex-col gap-4 items-center text-center">
          <h2 className="font-display text-5xl md:text-7xl text-ink">
            {brandStatement}
          </h2>
          <p className="font-body text-base text-slate max-w-md leading-relaxed">
            {tagline}
          </p>
        </motion.div>

        <Divider />

        <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {footerColumns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-accentDeep">
                {col.heading}
              </span>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="font-body text-sm text-slate hover:text-ink transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accentDeep">
              
            </span>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="font-body text-sm text-slate hover:text-ink transition-colors duration-200">
                  Track your device
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-slate hover:text-ink transition-colors duration-200">
                  Share your location
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accentDeep">
              Follow
            </span>
            <ul className="flex flex-col gap-2">
              {socialLinks.map((s) => {
                const LucideIcon = Icons[s.icon];
                return (
                  <li key={s.label}>
                    <a href={s.href} className="inline-flex items-center gap-2 font-body text-sm text-slate hover:text-ink transition-colors duration-200">
                      {LucideIcon && <LucideIcon size={14} />}
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

        </motion.div>

        <p className="font-mono text-xs text-slate/60 text-center border-t border-stone pt-8">
          {copyright}
        </p>

      </div>
    </section>
  );
}