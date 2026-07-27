// src/sections/05-WatchedOver/MapScene.jsx
// The illustrated map for Chapter Five. Pure SVG — no maps API.
// A dotted route connects Home → School → Friend's house; the child's
// dot glides between them as the active timeline state changes.
// All colors come from Tailwind text-* classes via currentColor.

import { motion } from 'framer-motion';
import { EASE } from '../../motion/variants';

// Where the dot sits for each timeline state (SVG viewBox coordinates)
const DOT_POSITIONS = {
  live:   { x: 128, y: 208 },  // just left home, on the route
  safe:   { x: 318, y: 84  },  // at school
  moving: { x: 268, y: 138 },  // walking home after the bell
  detour: { x: 236, y: 206 },  // at the friend's house
  home:   { x: 72,  y: 232 },  // back home
};

// Which safe zone glows for each state
const ZONE_FOR_STATE = { safe: 'school', home: 'home', live: 'home' };

function Zone({ cx, cy, r, active }) {
  return (
    <g className={active ? 'text-safe' : 'text-slate'}>
      <circle
        cx={cx} cy={cy} r={r}
        fill="currentColor" fillOpacity={active ? 0.10 : 0.04}
        stroke="currentColor" strokeOpacity={active ? 0.55 : 0.2}
        strokeWidth="1.5" strokeDasharray="4 5"
      />
    </g>
  );
}

function Place({ x, y, label, children }) {
  return (
    <g>
      <g className="text-ink">{children}</g>
      <text
        x={x} y={y}
        textAnchor="middle"
        className="fill-current text-slate"
        style={{ font: '600 9px JetBrains Mono, monospace', letterSpacing: '0.12em' }}
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
}

export default function MapScene({ activeState, labels, prefersReducedMotion }) {
  const dot = DOT_POSITIONS[activeState] ?? DOT_POSITIONS.home;
  const activeZone = ZONE_FOR_STATE[activeState];

  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-auto rounded-[20px]"
      role="img"
      aria-label="Illustrated map showing the child's route between home, school, and a friend's house"
    >
      <defs>
        <radialGradient id="map-vignette" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="#1a0c16" />
          <stop offset="70%" stopColor="#0d0510" />
          <stop offset="100%" stopColor="#050205" />
        </radialGradient>
        <filter id="map-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Backdrop with soft vignette */}
      <rect width="400" height="300" rx="20" fill="url(#map-vignette)" />

      {/* Street grid — faint, abstract */}
      <g className="text-ink" strokeOpacity="0.05" stroke="currentColor" strokeWidth="0.75">
        {[50, 100, 150, 200, 250, 300, 350].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" />
        ))}
        {[50, 100, 150, 200, 250].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} />
        ))}
      </g>

      {/* A river of brand glow across the corner */}
      <path
        d="M 0 60 Q 90 90 60 300"
        fill="none"
        className="text-accentDeep"
        stroke="currentColor" strokeOpacity="0.22" strokeWidth="16" strokeLinecap="round"
        filter="url(#map-glow)"
      />

      {/* Safe zones */}
      <Zone cx="72"  cy="225" r="34" active={activeZone === 'home'} />
      <Zone cx="318" cy="78"  r="38" active={activeZone === 'school'} />

      {/* The route — a soft gold trail, home → school + friend branch */}
      <path
        d="M 72 225 C 130 215 150 160 200 140 C 250 120 280 100 318 78"
        fill="none"
        className="text-gold"
        stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="1.5 7" strokeLinecap="round"
      />
      <path
        d="M 268 138 C 258 165 246 185 236 199"
        fill="none"
        className="text-gold"
        stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="1.5 7" strokeLinecap="round"
      />

      {/* Places */}
      <Place x="72" y="262" label={labels.home}>
        {/* Home — little house */}
        <path
          d="M 63 228 L 72 219 L 81 228 M 66 226 L 66 234 L 78 234 L 78 226"
          fill="none" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </Place>

      <Place x="318" y="114" label={labels.school}>
        {/* School — flag building */}
        <path
          d="M 310 84 L 310 72 L 326 72 L 326 84 M 306 84 L 330 84 M 318 72 L 318 64 L 325 66 L 318 68"
          fill="none" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </Place>

      <Place x="236" y="238" label={labels.friend}>
        {/* Friend's house — smaller roof */}
        <path
          d="M 229 210 L 236 203 L 243 210 M 231 209 L 231 216 L 241 216 L 241 209"
          fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </Place>

      {/* Safe-zone caption */}
      <text
        x="318" y="36"
        textAnchor="middle"
        className={`fill-current ${activeZone === 'school' ? 'text-safe' : 'text-slate'}`}
        style={{ font: '600 8px JetBrains Mono, monospace', letterSpacing: '0.14em' }}
        opacity={activeZone === 'school' ? 1 : 0.45}
      >
        {labels.safeZone.toUpperCase()}
      </text>

      {/* THE DOT — her. Glides between moments. */}
      <motion.g
        animate={{ x: dot.x, y: dot.y }}
        initial={false}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 1.4, ease: EASE }
        }
      >
        {/* Pulse rings */}
        {!prefersReducedMotion && (
          <>
            <motion.circle
              r="8"
              className="text-gold"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              animate={{ r: [8, 18], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.circle
              r="8"
              className="text-gold"
              fill="none" stroke="currentColor" strokeWidth="1"
              animate={{ r: [8, 18], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.9 }}
            />
          </>
        )}
        <circle r="7" className="text-gold fill-current" filter="url(#map-glow)" opacity="0.9" />
        <circle r="5" className="text-gold fill-current" />
        <circle r="2" className="text-parchment fill-current" />
      </motion.g>
    </svg>
  );
}
