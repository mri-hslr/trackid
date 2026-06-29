import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { COPY } from '../../content/copy';

const { annotations } = COPY.reveal;

// Dummy colored layers — replace src with real images from assets.js later
const LAYERS = [
  { key: 'shell',   label: 'Shell',       color: '#C9A66B', dy: -120, dx: 0   },
  { key: 'pcb',     label: 'PCB',         color: '#5C7691', dy: 0,    dx: -100 },
  { key: 'battery', label: 'Battery',     color: '#4C7A63', dy: 0,    dx: 100  },
  { key: 'gps',     label: 'GPS Antenna', color: '#9DB4C7', dy: 120,  dx: 0   },
];

export default function RevealScene2D({ progress = 0 }) {
  const layerRefs = useRef([]);
  const labelRefs = useRef([]);

  useEffect(() => {
    LAYERS.forEach((layer, i) => {
      const el = layerRefs.current[i];
      if (!el) return;
      el.style.transform = `translate(${layer.dx * progress}px, ${layer.dy * progress}px)`;
    });

    labelRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = progress > 0.5 ? (progress - 0.5) * 2 : 0;
    });
  }, [progress]);

  return (
    <div className="relative w-64 h-64 mx-auto">

      {LAYERS.map((layer, i) => (
        <div
          key={layer.key}
          ref={el => layerRefs.current[i] = el}
          className="absolute inset-0 flex items-center justify-center transition-none"
          style={{ willChange: 'transform' }}
        >
          {/* Dummy colored block — swap for <img src={ASSETS.exploded[layer.key]} /> later */}
          <div
            className="w-24 h-24 rounded-xl opacity-80"
            style={{ backgroundColor: layer.color }}
          />

          {/* Annotation label */}
          <span
            ref={el => labelRefs.current[i] = el}
            className="absolute -right-28 font-mono text-xs uppercase tracking-widest text-accentDeep whitespace-nowrap"
            style={{ opacity: 0 }}
          >
            {layer.label}
          </span>
        </div>
      ))}

    </div>
  );
}