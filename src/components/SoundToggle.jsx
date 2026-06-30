import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundToggle() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    // In a full implementation with an actual audio file:
    // if (audioRef.current) {
    //   if (isMuted) audioRef.current.play();
    //   else audioRef.current.pause();
    // }
  };

  return (
    <button
      onClick={toggleSound}
      className="p-3 bg-ink/20 backdrop-blur-md rounded-full border border-parchment/10 text-parchment hover:bg-ink/40 transition-colors duration-300"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {/* <audio ref={audioRef} src="/assets/audio/ambient.mp3" loop /> */}
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
