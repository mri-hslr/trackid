// src/components/TopographyBackground.jsx
// Reusable animated SVG background: dashed topographic contour lines,
// dashed guide lines, concentric rotating ripple rings, a crosshair
// marker, small arrowheads traveling along the contours, extra
// scattered static arrow glyphs, and dotted square markers. Rendered
// in black for visibility against the site's light (parchment)
// sections.
//
// Motion sources, all respecting prefers-reduced-motion:
//   1. A continuous CSS dash-flow/pulse loop (always running).
//   2. A slow circular rotation on the concentric ring cluster.
//   3. A cursor-reactive parallax offset — contour+arrow+ring layer
//      drifts more, guide+square layer drifts less — computed from
//      the pointer's position relative to this component's own
//      bounding box, throttled to one update per animation frame.
//
// Opacity is kept moderate (not as heavy as a solid black line, but
// clearly visible) and a soft center mask fades the pattern out
// directly behind the main content column so it reads as ambient
// background texture rather than competing with text/cards.

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function TopographyBackground() {
  const wrapperRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    let frameId = null;

    function handlePointerMove(e) {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        const el = wrapperRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        // Skip work while this instance is off-screen.
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        setOffset({
          x: Math.max(-0.5, Math.min(0.5, x)),
          y: Math.max(-0.5, Math.min(0.5, y)),
        });
      });
    }

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [shouldReduceMotion]);

  // Near layer (contours + rings + arrowheads) drifts further than
  // the far layer (guides + squares) for a subtle sense of depth.
  const nearLayerStyle = shouldReduceMotion
    ? undefined
    : { transform: `translate(${offset.x * 28}px, ${offset.y * 28}px)` };
  const farLayerStyle = shouldReduceMotion
    ? undefined
    : { transform: `translate(${offset.x * 12}px, ${offset.y * 12}px)` };

  // Fades the pattern out behind the main content column (center)
  // and keeps it visible toward the edges — prevents the lines from
  // visually competing with headlines/cards/images placed centrally.
  const maskStyle = {
    maskImage:
      "radial-gradient(ellipse 72% 68% at center, transparent 25%, black 78%)",
    WebkitMaskImage:
      "radial-gradient(ellipse 72% 68% at center, transparent 25%, black 78%)",
  };

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 h-full w-full pointer-events-none select-none"
      style={maskStyle}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full text-black/35"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <style>
          {`
            .topo-contour {
              stroke-dasharray: 6 7;
              animation: topo-dash-flow 18s linear infinite;
            }
            .topo-ring {
              stroke-dasharray: 5 6;
              animation: topo-dash-flow 24s linear infinite;
            }
            .topo-guide {
              stroke-dasharray: 2 9;
            }
            .topo-square {
              stroke-dasharray: 2 3;
              animation: topo-pulse 6s ease-in-out infinite;
            }
            .topo-layer {
              transition: transform 0.35s ease-out;
            }
            .topo-ring-cluster {
              transform-box: fill-box;
              transform-origin: center;
              animation: topo-rotate 100s linear infinite;
            }
            .topo-ring-cluster-reverse {
              transform-box: fill-box;
              transform-origin: center;
              animation: topo-rotate 140s linear infinite reverse;
            }
            .topo-crosshair {
              stroke-dasharray: 3 4;
            }
            @keyframes topo-dash-flow {
              to { stroke-dashoffset: -260; }
            }
            @keyframes topo-pulse {
              0%, 100% { opacity: 0.35; }
              50% { opacity: 0.85; }
            }
            @keyframes topo-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>

        {/* far layer — guide lines + square markers, subtle parallax */}
        <g className="topo-layer" style={farLayerStyle}>
          <line x1="40" y1="0" x2="40" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="100" y1="0" x2="100" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="160" y1="0" x2="160" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="240" y1="0" x2="240" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="720" y1="0" x2="720" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="1200" y1="0" x2="1200" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="1280" y1="0" x2="1280" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="1340" y1="0" x2="1340" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="1400" y1="0" x2="1400" y2="900" stroke="currentColor" strokeWidth="1" className="topo-guide" />

          <line x1="0" y1="180" x2="1440" y2="180" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="0" y1="500" x2="1440" y2="500" stroke="currentColor" strokeWidth="1" className="topo-guide" />
          <line x1="0" y1="760" x2="1440" y2="760" stroke="currentColor" strokeWidth="1" className="topo-guide" />

          <rect x="236" y="176" width="9" height="9" stroke="currentColor" strokeWidth="1" className="topo-square" />
          <rect x="716" y="496" width="9" height="9" stroke="currentColor" strokeWidth="1" className="topo-square" style={{ animationDelay: "1.5s" }} />
          <rect x="1196" y="756" width="9" height="9" stroke="currentColor" strokeWidth="1" className="topo-square" style={{ animationDelay: "3s" }} />
          <rect x="1196" y="176" width="9" height="9" stroke="currentColor" strokeWidth="1" className="topo-square" style={{ animationDelay: "2.2s" }} />

          {/* crosshair marker */}
          <g className="topo-crosshair" stroke="currentColor" strokeWidth="1">
            <line x1="980" y1="770" x2="980" y2="810" />
            <line x1="960" y1="790" x2="1000" y2="790" />
          </g>
        </g>

        {/* near layer — contour lines, concentric rings, traveling + scattered arrowheads, stronger parallax */}
        <g className="topo-layer" style={nearLayerStyle}>
          <path
            id="topo-path-1"
            className="topo-contour"
            d="M -50 220 C 260 120, 560 320, 860 190 S 1320 260, 1500 200"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            id="topo-path-2"
            className="topo-contour"
            d="M -50 470 C 300 560, 620 380, 940 510 S 1330 420, 1500 480"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ animationDuration: "22s", animationDirection: "reverse" }}
          />
          <path
            id="topo-path-3"
            className="topo-contour"
            d="M -50 690 C 280 750, 660 630, 980 720 S 1340 660, 1500 710"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ animationDuration: "26s" }}
          />

          {/* concentric ripple rings — slow circular rotation, like a topo elevation cluster */}
          <g className="topo-ring-cluster" stroke="currentColor" strokeWidth="1.25">
            <circle cx="1040" cy="230" r="60" className="topo-ring" />
            <circle cx="1040" cy="230" r="105" className="topo-ring" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
            <circle cx="1040" cy="230" r="150" className="topo-ring" style={{ animationDuration: "34s" }} />
            <circle cx="1040" cy="230" r="195" className="topo-ring" style={{ animationDuration: "38s", animationDirection: "reverse" }} />
          </g>
          <g className="topo-ring-cluster-reverse" stroke="currentColor" strokeWidth="1.25">
            <circle cx="1040" cy="230" r="240" className="topo-ring" style={{ animationDuration: "42s" }} />
          </g>

          {/* scattered static arrow glyphs, independent of the traveling ones below */}
          <g fill="currentColor">
            <polygon points="0,-4 8,0 0,4" transform="translate(845,235) rotate(-70)" />
            <polygon points="0,-4 8,0 0,4" transform="translate(1160,150) rotate(120)" />
            <polygon points="0,-4 8,0 0,4" transform="translate(1225,220) rotate(160)" />
            <polygon points="0,-4 8,0 0,4" transform="translate(1055,730) rotate(20)" />
            <polygon points="0,-4 8,0 0,4" transform="translate(895,845) rotate(-150)" />
            <polygon points="0,-4 8,0 0,4" transform="translate(735,880) rotate(200)" />
            <polygon points="0,-4 8,0 0,4" transform="translate(600,935) rotate(140)" />
          </g>

          <g fill="currentColor">
            <polygon points="0,-3.5 7,0 0,3.5">
              <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
                <mpath href="#topo-path-1" />
              </animateMotion>
            </polygon>
            <polygon points="0,-3.5 7,0 0,3.5">
              <animateMotion dur="19s" repeatCount="indefinite" rotate="auto" keyPoints="1;0" keyTimes="0;1">
                <mpath href="#topo-path-2" />
              </animateMotion>
            </polygon>
            <polygon points="0,-3.5 7,0 0,3.5">
              <animateMotion dur="23s" repeatCount="indefinite" rotate="auto">
                <mpath href="#topo-path-3" />
              </animateMotion>
            </polygon>
          </g>
        </g>
      </svg>
    </div>
  );
}
