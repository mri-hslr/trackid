// src/components/IntroSmoke.jsx
// The original project smoke — the smoke.mp4 loop, screen-blended over
// the dark intro so it reads as luminous drifting mist. Used by both the
// Preloader and the IntroCurtain. Muted + loop + playsInline for autoplay.

export default function IntroSmoke({ opacity = 0.5 }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{ mixBlendMode: 'screen', opacity }}
    >
      <source src="/assets/video/smoke.mp4" type="video/mp4" />
    </video>
  );
}
