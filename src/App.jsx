// src/App.jsx
// Top-level layout: wraps everything in TrackProvider, initializes Lenis
// smooth scroll, renders section slots in order. Section developers
// uncomment their imports as they build.

import { useEffect } from 'react';
import Lenis from 'lenis';
import { TrackProvider } from './context/TrackContext';
import Divider from './components/Divider';

// -------------------------------------------------------------------
// Section imports — uncomment as each section is built.
// Do NOT reorder: this IS the page's visual sequence.
// -------------------------------------------------------------------
// import Hero from './sections/01-Hero/Hero';
import Reveal from './sections/02-Reveal/Reveal';
// import Fork from './sections/03-Fork/Fork';
import ComplianceCase from './sections/04A-ComplianceCase/ComplianceCase';
// import Anatomy from './sections/04B-Anatomy/Anatomy';
import EngineeringCredibility from './sections/05A-EngineeringCredibility/EngineeringCredibility';
// import PeaceOfMind from './sections/05B-PeaceOfMind/PeaceOfMind';
// import InstitutionalAsk from './sections/06A-InstitutionalAsk/InstitutionalAsk';
// import Invitation from './sections/06B-Invitation/Invitation';
import Closing from './sections/07-Closing/Closing';

function App() {
  // ---------------------------------------------------------------
  // Lenis smooth-scroll — initialized once at the App root.
  // Pairs natively with GSAP ScrollTrigger for the hero/reveal,
  // gives the weighted premium scroll feel across the whole page.
  // ---------------------------------------------------------------
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,         // scroll duration for smooth feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <TrackProvider>
      <div className="bg-parchment text-ink font-body antialiased min-h-screen">

        {/* ============================================================ */}
        {/* SECTION SLOTS — uncomment as each section is built.          */}
        {/* The Divider component goes between each section boundary.    */}
        {/* ============================================================ */}

        {/* <Hero /> */}
        {/* <Divider /> */}
        { <Reveal /> }
        {/* <Divider /> */}
        {/* <Fork /> */}
        {/* <Divider /> */}

        {/* --- Institutional Track --- */}
        <ComplianceCase />
        {/* <Divider /> */}
        { <EngineeringCredibility /> }
        { <Divider /> }
        {/* <InstitutionalAsk /> */}
        {/* <Divider /> */}

        {/* --- Family Track --- */}
        {/* <Anatomy /> */}
        {/* <Divider /> */}
        {/* <PeaceOfMind /> */}
        {/* <Divider /> */}
        {/* <Invitation /> */}
        {/* <Divider /> */}

        {/* --- Shared Closing --- */}
        { <Closing /> }

        {/* ============================================================ */}
        {/* Phase 1 infrastructure verification — remove after sections  */}
        {/* are built. Shows that the design system is wired correctly.   */}
        {/* ============================================================ */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-accentDeep mb-4">
            Phase 1 — Infrastructure Verification
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-medium mb-6">TrakID</h1>
          <p className="text-base font-body text-slate leading-relaxed mb-8 max-w-2xl">
            Beautiful enough to wear. Smart enough to never lose. — If you see Fraunces for
            the heading, Inter for this paragraph, and the teardrop divider below, the
            design system is wired correctly.
          </p>

          <Divider />

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-16 rounded-md bg-ink" />
            <div className="h-16 rounded-md bg-accent" />
            <div className="h-16 rounded-md bg-gold" />
            <div className="h-16 rounded-md bg-safe" />
            <div className="h-16 rounded-md bg-parchment border" />
            <div className="h-16 rounded-md bg-stone" />
            <div className="h-16 rounded-md bg-slate" />
            <div className="h-16 rounded-md bg-alert" />
          </div>

          <p className="font-mono text-xs text-slate mt-6">
            ↑ ink · accent · gold · safe — all from tailwind.config.js tokens
          </p>
        </div>

      </div>
    </TrackProvider>
  );
}

export default App;
