// src/sections/01-Hero/Intro.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';

export default function Intro({ onComplete }) {
  const [phase, setPhase] = useState('ready'); 
  const [lineDraw, setLineDraw] = useState(false);

  const cursorRef = useRef({ x: 0, y: 0 });

  const completeRef = useRef(onComplete);
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  const handleMouseMove = useCallback((e) => {
    cursorRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Master Cinematic Timeline
  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('sweep');
      setLineDraw(true);
    }, 100);

    const t2 = setTimeout(() => setPhase('split'), 1800);

    const t3 = setTimeout(() => {
      if (completeRef.current) completeRef.current();
    }, 3000); 

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []); 

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden pointer-events-none">
      
      {/* 
        INVISIBLE SVG MASKS
        These map exactly to the 1000x1000 dynamic curve to cut the screen.
      */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="top-curtain" clipPathUnits="objectBoundingBox">
            <path d="M -0.1,-0.1 L 1.1,-0.1 L 1.1,-0.1 C 0.7,0.1 0.65,0.4 0.5,0.5 C 0.35,0.6 0.3,0.9 -0.1,1.1 Z" />
          </clipPath>
          <clipPath id="bottom-curtain" clipPathUnits="objectBoundingBox">
            <path d="M -0.1,1.1 C 0.3,0.9 0.35,0.6 0.5,0.5 C 0.65,0.4 0.7,0.1 1.1,-0.1 L 1.1,1.1 L -0.1,1.1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* =========================================
          TOP CURTAIN 
          Slides UP and LEFT when the split happens 
          ========================================= */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#0E1116',
          clipPath: 'url(#top-curtain)',
          WebkitClipPath: 'url(#top-curtain)',
          transform: phase === 'split' ? 'translate(-5%, -100%)' : 'translate(0%, 0%)',
          transition: 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-35" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }} 
        />
        
        {/* ORIGINAL THICK, GLOWING LINE */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          preserveAspectRatio="none" 
          viewBox="0 0 1000 1000"
        >
          <path
            d="M -100,1100 C 300,900 350,600 500,500 C 650,400 700,100 1100,-100"
            fill="none"
            stroke="#9DB4C7"
            strokeWidth="2"
            strokeDasharray="2500"
            style={{
              strokeDashoffset: lineDraw ? 0 : 2500,
              transition: 'stroke-dashoffset 2s cubic-bezier(0.25, 1, 0.35, 1)',
              filter: 'drop-shadow(0px 0px 8px rgba(157,180,199,0.5))'
            }}
          />
        </svg>
      </div>

      {/* =========================================
          BOTTOM CURTAIN 
          Slides DOWN and RIGHT when the split happens 
          ========================================= */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#0E1116',
          clipPath: 'url(#bottom-curtain)',
          WebkitClipPath: 'url(#bottom-curtain)',
          transform: phase === 'split' ? 'translate(5%, 100%)' : 'translate(0%, 0%)',
          transition: 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-35" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }} 
        />
        
        {/* ORIGINAL THICK, GLOWING LINE */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          preserveAspectRatio="none" 
          viewBox="0 0 1000 1000"
        >
          <path
            d="M -100,1100 C 300,900 350,600 500,500 C 650,400 700,100 1100,-100"
            fill="none"
            stroke="#9DB4C7"
            strokeWidth="2"
            strokeDasharray="2500"
            style={{
              strokeDashoffset: lineDraw ? 0 : 2500,
              transition: 'stroke-dashoffset 2s cubic-bezier(0.25, 1, 0.35, 1)',
              filter: 'drop-shadow(0px 0px 8px rgba(157,180,199,0.5))'
            }}
          />
        </svg>
      </div>

      {/* =========================================
          GHOST COORDINATES
          ========================================= */}
      <div 
        className="absolute left-[20%] bottom-[30%] flex flex-col font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]"
        style={{
          opacity: phase === 'sweep' && lineDraw ? 0.6 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        <span>N 50.4372</span>
        <span>E 5.9713</span>
      </div>

      <div 
        className="absolute right-[25%] top-[25%] flex flex-col font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]"
        style={{
          opacity: phase === 'sweep' && lineDraw ? 0.6 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        <span>N 35.6241</span>
        <span>E 139.7753</span>
      </div>

    </div>
  );
}