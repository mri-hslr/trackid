// src/components/IntroCurtain.jsx
// OSOS-style intro: near-black curtain, floating iridescent bubbles,
// and a neon-glowing wordmark at center. The pendant (z-55) still drops
// in front of the curtain (z-50), landing over the glow.
// All refs and the slide-up handoff remain identical — only the look
// changed, none of the useIntroSequence timeline logic.

import { forwardRef } from 'react';
import { COPY } from '../content/copy';
import IntroLoader from './IntroLoader';
import IntroBubbles from './IntroBubbles';

const IntroCurtain = forwardRef(
  ({ smokeVideoRef, loaderRef, cornerTagRef, cornerCollectionRef, cornerFeatureRef, cornerStatusRef }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute inset-0 z-50 overflow-hidden"
        style={{
          willChange: 'transform',
          background:
            'radial-gradient(ellipse 80% 65% at 50% 42%, #170a13 0%, #0a040a 55%, #050205 100%)',
        }}
      >
        {/* Iridescent bubbles drifting up through the dark */}
        <IntroBubbles />

        {/* Optional smoke layer — kept for the timeline's opacity tween.
            On the dark curtain it blends additively instead of multiply. */}
        <div
          ref={smokeVideoRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.08,
            background:
              'radial-gradient(ellipse 60% 45% at 50% 55%, rgba(168,28,75,0.35) 0%, transparent 70%)',
          }}
        />

        {/* The glowing wordmark — the OSOS logo moment */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="intro-glow-wordmark font-display font-bold text-6xl md:text-8xl lg:text-9xl tracking-tight select-none">
            {COPY.hero.wordmark}
          </span>
        </div>

        {/* Loading strip — top center, quiet */}
        <IntroLoader ref={loaderRef} />

        {/* Four-column header row — now light-on-dark */}
        <div className="absolute top-8 left-8 right-8 z-10 flex justify-between pointer-events-none">

          {/* Column 1: brand + tagline */}
          <div ref={cornerTagRef} className="max-w-[200px]" style={{ opacity: 0 }}>
            <div className="font-mono text-sm uppercase tracking-premium text-ink font-bold mb-1.5">
              {COPY.hero.wordmark}
            </div>
            <div className="font-mono text-xs uppercase tracking-normal text-slate leading-relaxed font-medium">
              {COPY.hero.tagline}
            </div>
          </div>

          {/* Column 2: collection marker */}
          <div ref={cornerCollectionRef} className="max-w-[200px] hidden md:block" style={{ opacity: 0 }}>
            <div className="font-mono text-sm uppercase tracking-premium text-ink font-bold mb-1.5">
              The Collection
            </div>
            <div className="font-mono text-xs uppercase tracking-normal text-slate leading-relaxed font-medium">
              {COPY.hero.showcase.productName}
            </div>
          </div>

          {/* Column 3: feature/spec line */}
          <div ref={cornerFeatureRef} className="max-w-[200px] hidden md:block" style={{ opacity: 0 }}>
            <div className="font-mono text-sm uppercase tracking-premium text-ink font-bold mb-1.5">
              Inside
            </div>
            <div className="font-mono text-xs uppercase tracking-normal text-slate leading-relaxed font-medium">
              {COPY.hero.showcase.features.join(' · ')}
            </div>
          </div>

          {/* Column 4: status cluster, right-aligned */}
          <div ref={cornerStatusRef} className="text-right" style={{ opacity: 0 }}>
            <div className="font-mono text-sm uppercase tracking-premium text-ink font-bold mb-1">
              Unveiling
            </div>
            <div className="font-mono text-xs uppercase tracking-normal text-slate font-medium">
              Est. 2026
            </div>
          </div>

        </div>
      </div>
    );
  }
);

IntroCurtain.displayName = 'IntroCurtain';
export default IntroCurtain;
