import { memo } from 'react';

function ShowroomAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ backgroundColor: '#050103' }}>
      
      {/* 
        LAYER 1: Ambient Background Glow 
        Slightly asymmetrical to establish a non-mirrored light source.
      */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 48% 45%, rgba(60, 20, 45, 0.25) 0%, rgba(20, 5, 15, 0.4) 40%, transparent 70%)'
        }}
      />

      {/* 
        LAYER 2: Sculptural Walls / Folds 
        Using a 120% sized container with CSS blur to prevent any bounding-box clipping.
        The paths are highly asymmetrical to break the mirrored look.
      */}
      <svg
        className="absolute"
        style={{
          width: '120%',
          height: '120%',
          left: '-10%',
          top: '-10%',
          filter: 'blur(60px)', 
          mixBlendMode: 'screen',
          opacity: 0.9
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <defs>
          <linearGradient id="wall-left" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7a2a50" stopOpacity="0.45" />
            <stop offset="25%" stopColor="#3a0f25" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#050103" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="wall-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a1f44" stopOpacity="0.35" />
            <stop offset="35%" stopColor="#2a0e22" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#050103" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* LEFT WALL: Steep, high sweep originating from the top corner */}
        <path 
          d="M 0,0 L 400,0 C 250,300 300,700 480,1000 L 0,1000 Z" 
          fill="url(#wall-left)" 
        />
        
        {/* RIGHT WALL: Lower, wider, softer sweep originating further down (Breaking Symmetry) */}
        <path 
          d="M 1000,150 L 600,150 C 850,450 750,750 520,1000 L 1000,1000 Z" 
          fill="url(#wall-right)" 
        />
      </svg>

      {/* 
        LAYER 3: The Floor Plane (Perspective)
        Masked radically so it fades perfectly into the walls and void,
        eliminating the artificial horizontal line.
      */}
      <div 
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: '45%',
          // Radial mask fades the floor out horizontally (left/right) and vertically (top).
          maskImage: 'radial-gradient(ellipse 80% 100% at 50% 100%, black 15%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 50% 100%, black 15%, transparent 70%)',
        }}
      >
        {/* The 3D perspective grid/ripples to pull the eye inward */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(138, 53, 96, 0.18) 3px, transparent 5px)',
            transform: 'perspective(400px) rotateX(78deg) scale(2.5)',
            transformOrigin: 'top center'
          }}
        />
        
        {/* The floor reflection highlight stretching toward the viewer */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 120% at 50% 0%, rgba(138, 53, 96, 0.25) 0%, rgba(74, 21, 53, 0.1) 40%, transparent 80%)',
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* 
        LAYER 4: Heavy Vignette (Foreground Framing) 
        Pushes the corners back into deep shadow.
      */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, #030002 100%)'
        }}
      />
    </div>
  );
}

export default memo(ShowroomAtmosphere);
