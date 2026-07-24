// src/App.jsx
// Top-level layout: wraps everything in TrackProvider, initializes Lenis
// smooth scroll, renders section slots in order. Section developers
// uncomment their imports as they build.

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrackProvider } from './context/TrackContext';
import StoryProgress from './components/StoryProgress';
import StoryThread from './components/StoryThread';
import SideRail from './components/SideRail';
import GrainOverlay from './components/GrainOverlay';
import WipeReveal from './components/WipeReveal';
import Preloader from './components/Preloader';
import { COPY } from './content/copy';

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
import TheVows from './sections/06D-TheVows/TheVows';
import Constellation from './sections/06C-Constellation/Constellation';
import TheInvitation from './sections/06-TheInvitation/TheInvitation';
import Closing from './sections/07-Closing/closing';

function App() {
  // The site mounts (and loads assets) BEHIND the preloader; the hero's
  // pendant-drop unveiling only starts once the preloader hands off.
  const [booted, setBooted] = useState(false);

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

        {/* Loading screen — sits above everything until the site is ready */}
        {!booted && <Preloader onComplete={() => setBooted(true)} />}

        {/* Site-wide film grain texture */}
        <GrainOverlay />

        {/* Global story spine: top progress bar + chapter rail */}
        <StoryProgress />

        {/* OSOS-style fixed left rail + fullscreen chapter menu */}
        <SideRail />

        {/* ============================================================ */}
        {/* SECTION SLOTS — uncomment as each section is built.          */}
        {/* The Divider component goes between each section boundary.    */}
        {/* ============================================================ */}

        {/* Prologue — unveiling starts when the preloader hands off */}
        <Hero start={booted} />

        {/* Chapter 1 — The Secret */}
        <Reveal />
        <StoryThread bridge={COPY.story.threads.toMoment} />

        {/* Chapter 2 — The Moment */}
        <TheMoment />
        <StoryThread />

        {/* Chapter 3 — The Truth */}
        <TheBelief />
        <StoryThread bridge={COPY.story.threads.toCompanions} />

        {/* Chapter 4 — The Companions */}
        <Anatomy />
        <StoryThread bridge={COPY.story.threads.toWatchedOver} />

        {/* Chapter 5 — The Day, Watched Over */}
        <WatchedOver />
        <StoryThread bridge={COPY.story.threads.toPromise} />

        {/* Chapter 6 — The Promise, Kept */}
        <FeatureShowcase />

        {/* The Vows — poster statements (OSOS-style stunts) */}
        <TheVows />
        <StoryThread />

        {/* Interlude — the particle pendant, statements riding the scroll */}
        <Constellation />

        {/* Chapter 7 — The Beginning, revealed by a deep-plum wipe */}
        <WipeReveal panelClass="bg-stone">
          <TheInvitation />
        </WipeReveal>

        {/* Epilogue */}
        <Closing />

      </div>
    </TrackProvider>
  );
}

export default App;