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
// STORY MODE — the page is one linear narrative, read top to bottom:
//
//   Prologue    Hero            (intro + pendant — untouched)
//   Chapter 1   Reveal          The Secret (what's inside the jewel)
//   Chapter 2   TheMoment       3:42 PM — the fear every parent knows
//   Chapter 3   TheBelief       A refused tracker protects no one
//   Chapter 4   Anatomy         The Companions (the collection)
//   Chapter 5   WatchedOver     The same day, retold with TrakID
//   Chapter 6   FeatureShowcase The Promise, Kept (proof/specs)
//   Chapter 7   TheInvitation   One form, both audiences
//   Epilogue    Closing
//
// The old Fork / two-track sections remain on disk but are no longer
// rendered — the story replaces the branch with a single path.
// -------------------------------------------------------------------
import Hero from './sections/01-Hero/Hero';
import Reveal from './sections/02-Reveal/Reveal';
import TheMoment from './sections/03-TheMoment/TheMoment';
import TheBelief from './sections/04-TheBelief/TheBelief';
import Anatomy from './sections/04B-Anatomy/Anatomy';
import WatchedOver from './sections/05-WatchedOver/WatchedOver';
import FeatureShowcase from './sections/04C-FeatureShowcase/FeatureShowcase';
import TheInvitation from './sections/06-TheInvitation/TheInvitation';
import Closing from './sections/07-Closing/closing';

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

    // ADDED: Expose Lenis globally so Hero.jsx can pause it during the intro sequence
    window.lenis = lenis;

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
      
      // ADDED: Clean up the global reference on unmount
      delete window.lenis; 
    };
  }, []);

  return (
    <TrackProvider>
      <div className="bg-parchment text-ink font-body antialiased min-h-screen">

        {/* ============================================================ */}
        {/* SECTION SLOTS — uncomment as each section is built.          */}
        {/* The Divider component goes between each section boundary.    */}
        {/* ============================================================ */}

        {/* Prologue */}
        <Hero />

        {/* Chapter 1 — The Secret */}
        <Reveal />
        <Divider className="text-gold/60" />

        {/* Chapter 2 — The Moment */}
        <TheMoment />
        <Divider className="text-gold/60" />

        {/* Chapter 3 — The Truth */}
        <TheBelief />
        <Divider className="text-gold/60" />

        {/* Chapter 4 — The Companions */}
        <Anatomy />
        <Divider className="text-gold/60" />

        {/* Chapter 5 — The Day, Watched Over */}
        <WatchedOver />
        <Divider className="text-gold/60" />

        {/* Chapter 6 — The Promise, Kept */}
        <FeatureShowcase />
        <Divider className="text-gold/60" />

        {/* Chapter 7 — The Beginning */}
        <TheInvitation />

        {/* Epilogue */}
        <Closing />

      </div>
    </TrackProvider>
  );
}

export default App;