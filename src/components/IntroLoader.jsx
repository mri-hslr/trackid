// src/components/IntroLoader.jsx
// OSOS-style "Loading .." strip at the top of the intro curtain.
// The forwarded ref MUST stay on the number span — useIntroSequence
// writes the counter into it via textContent and fades it on complete.

import { forwardRef } from 'react';

const IntroLoader = forwardRef((props, ref) => (
  <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-center py-5">
    <span className="font-mono text-[11px] md:text-xs uppercase tracking-premium text-slate">
      Loading&nbsp;·&nbsp;
    </span>
    <span
      ref={ref}
      className="font-mono text-[11px] md:text-xs uppercase tracking-premium text-ink tabular-nums"
    >
      0
    </span>
  </div>
));

IntroLoader.displayName = 'IntroLoader';
export default IntroLoader;
