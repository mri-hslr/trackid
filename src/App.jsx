// src/App.jsx
// Top-level layout: wraps everything in TrackProvider, initializes Lenis
// smooth scroll, renders section slots in order. Section developers
// uncomment their imports as they build.

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrackProvider } from './context/TrackContext';
import Divider from './components/Divider';

gsap.registerPlugin(ScrollTrigger);

// -------------------------------------------------------------------
// Section imports — uncomment as each section is built.
// Do NOT reorder: this IS the page's visual sequence.
// -------------------------------------------------------------------
import Hero from './sections/01-Hero/Hero';
import Reveal from './sections/02-Reveal/Reveal';
// import Fork from './sections/03-Fork/Fork';
import ComplianceCase from './sections/04A-ComplianceCase/ComplianceCase';
import Anatomy from './sections/04B-Anatomy/Anatomy';
import EngineeringCredibility from './sections/05A-EngineeringCredibility/EngineeringCredibility';
// import PeaceOfMind from './sections/05B-PeaceOfMind/PeaceOfMind';
import InstitutionalAsk from './sections/06A-InstitutionalAsk/InstitutionalAsk';
// import Invitation from './sections/06B-Invitation/Invitation';
import Closing from './sections/07-Closing/Closing';

function App() {
  // ---------------------------------------------------------------
  // Lenis smooth-scroll — initialized once at the App root.
  // Synced with GSAP ScrollTrigger so pinning and scrubbed timelines
  // receive smooth scroll position updates. This replaces the manual
  // rAF loop with GSAP's ticker driving Lenis — the standard
  // integration pattern that prevents double-RAF loops.
  // ---------------------------------------------------------------
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,         // scroll duration for smooth feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Push Lenis scroll events to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Let GSAP's ticker drive Lenis's frame loop (replaces manual rAF)
    const tickerCallback = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);

    // Prevent GSAP's lag correction from fighting Lenis's own smoothing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
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

        <Hero />
        {/* <Divider /> */}
        <Reveal />
        {/* <Divider /> */}
        {/* <Fork /> */}
        {/* <Divider /> */}

        {/* --- Institutional Track --- */}
        <ComplianceCase />
        {/* <Divider /> */}
        <EngineeringCredibility />
        <Divider />
        <InstitutionalAsk />
        {/* <Divider /> */}

        {/* --- Family Track --- */}
        <Anatomy />
        {/* <Divider /> */}
        {/* <PeaceOfMind /> */}
        {/* <Divider /> */}
        {/* <Invitation /> */}
        {/* <Divider /> */}

        {/* --- Shared Closing --- */}
        <Closing />

        {/* ============================================================ */}
        {/* Phase 1 infrastructure verification — removed as actual      */}
        {/* sections are now being built and integrated above.           */}
        {/* ============================================================ */}
      </div>
    </TrackProvider>
  );
}

export default App;
