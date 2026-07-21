import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  BatteryCharging, 
  Droplets, 
  Magnet, 
  Gem, 
  Lock, 
  AlertCircle, 
  CheckCircle2,
  MapPin,
  Wifi,
  KeySquare,
  Vibrate
} from "lucide-react";

// Expanded 12-feature set
const ALL_FEATURES = [
  { id: "f1", icon: Shield, title: "Impact Rated", desc: "Reinforced housing survives daily drops, play, and roughhousing without cracking." },
  { id: "f2", icon: BatteryCharging, title: "7-Day Battery", desc: "A single charge outlasts the week — no daily habit for a parent to forget." },
  { id: "f3", icon: Droplets, title: "Water Resistant", desc: "Fully sealed architecture ready for splashes, spills, and everyday adventures." },
  { id: "f4", icon: Magnet, title: "Magnetic Charging", desc: "Snap-on magnetic charging makes powering up effortless and secure." },
  { id: "f5", icon: Gem, title: "Looks Like Jewellery", desc: "Designed as an accessory children genuinely enjoy wearing every day." },
  { id: "f6", icon: Lock, title: "Clasp-Locked", desc: "A tamper-aware clasp that resists idle fiddling but opens instantly for a caregiver." },
  { id: "f7", icon: AlertCircle, title: "SOS Emergency", desc: "One-touch emergency alert system for immediate peace of mind." },
  { id: "f8", icon: CheckCircle2, title: "Better Compliance", desc: "96% higher daily wear compliance compared to traditional plastic trackers." },
  { id: "f9", icon: MapPin, title: "Pinpoint Accuracy", desc: "Global LTE-M integration ensures you know exactly where they are, anywhere." },
  { id: "f10", icon: Wifi, title: "Safe Zones", desc: "Custom geofencing instantly alerts you the moment they step out of bounds." },
  { id: "f11", icon: KeySquare, title: "Encrypted Data", desc: "Bank-level AES-256 encryption ensures location data stays strictly family-only." },
  { id: "f12", icon: Vibrate, title: "Haptic Feedback", desc: "Gentle vibration patterns communicate with the child without screen distraction." },
];

// 7 Working High-Quality Images
const IMAGES = [
  "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"  
];

// Premium Typing Effect Component
const TypewriterWords = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em] whitespace-nowrap"
          initial={{ opacity: 0, filter: "blur(4px)", y: 2 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.3, delay: delay + i * 0.04 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Extracted feature content block
const AnimatedFeatureContent = ({ feature }) => {
  const Icon = feature.icon;
  return (
    <div className="flex flex-col gap-4 w-full">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-12 h-12 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mb-1"
      >
        <Icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
      </motion.div>

      <h3 className="font-display text-2xl text-ink leading-tight">
        <TypewriterWords text={feature.title} delay={0.1} />
      </h3>
      
      <p className="text-slate text-base leading-relaxed max-w-[320px]">
        <TypewriterWords text={feature.desc} delay={0.3} />
      </p>
    </div>
  );
};

export default function FeatureShowcase() {
  const [activeSlots, setActiveSlots] = useState([
    ALL_FEATURES[0],
    ALL_FEATURES[1],
    ALL_FEATURES[2],
    ALL_FEATURES[3],
  ]);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Pointers to track the infinite loop
  const nextFeatureIdx = useRef(4); 
  const nextSlotIdx = useRef(0);    

  // --- Feature Text Cycle (Updates EXACTLY ONE feature every 2.5 seconds) ---
  useEffect(() => {
    const featureTimer = setInterval(() => {
      setActiveSlots((prev) => {
        const newSlots = [...prev];
        newSlots[nextSlotIdx.current] = ALL_FEATURES[nextFeatureIdx.current];
        return newSlots;
      });

      nextSlotIdx.current = (nextSlotIdx.current + 1) % 4;
      nextFeatureIdx.current = (nextFeatureIdx.current + 1) % ALL_FEATURES.length;
    }, 2500); 

    return () => clearInterval(featureTimer);
  }, []);

  // --- Fast Image Cycle (Updates every 6 seconds) ---
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % IMAGES.length);
    }, 6000); 

    return () => clearInterval(imageTimer);
  }, []);

  return (
    <section className="bg-parchment py-32 px-6 overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        
        <div className="text-center mb-24">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-gold">
            Chapter Six — The Promise, Kept
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink mt-6 tracking-tight">
            Built like jewellery. <br className="hidden sm:block"/> Tested like hardware.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
          
          {/* LEFT FEATURES */}
          <div className="order-2 lg:order-1 flex flex-col gap-6 lg:gap-8 justify-center">
            <div className="h-[220px] flex items-start w-full">
              <AnimatedFeatureContent key={activeSlots[0].id} feature={activeSlots[0]} />
            </div>
            <div className="h-[220px] flex items-start w-full">
              <AnimatedFeatureContent key={activeSlots[1].id} feature={activeSlots[1]} />
            </div>
          </div>

          {/* CENTER IMAGE: Nested Cinematic Frame Effect */}
          <div className="order-1 lg:order-2 flex justify-center w-full">
            {/* Outer Frame with Constant Background */}
            <div className="relative w-full max-w-[460px] aspect-square rounded-[36px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] p-6 lg:p-8 flex items-center justify-center border border-white/5">
              
              {/* Static Outer Landscape Background */}
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop" // Atmospheric mountain landscape
                alt="Atmospheric Background"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              
              {/* Dimming and Blur Overlay to push the background back */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

              {/* Inner Animated Container */}
              <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#0f0f0f] border border-white/20 shadow-2xl z-10">
                <div key={`image-${currentImageIdx}`} className="relative w-full h-full bg-ink">
                  
                  {/* Layer 1: Base Grayscale Image */}
                  <motion.img
                    src={IMAGES[currentImageIdx]}
                    alt="TrakID Hardware Grayscale"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 mix-blend-luminosity"
                  />

                  {/* Layer 2: Color Reveal Wipe (Left to Right) */}
                  <motion.img
                    src={IMAGES[currentImageIdx]}
                    alt="TrakID Hardware Color"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ 
                      duration: 3, 
                      ease: [0.25, 1, 0.5, 1], 
                      delay: 0.5 
                    }}
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-10 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10 pointer-events-none z-10" />
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT FEATURES */}
          <div className="order-3 lg:order-3 flex flex-col gap-6 lg:gap-8 justify-center lg:items-start">
            <div className="h-[220px] flex items-start w-full">
              <AnimatedFeatureContent key={activeSlots[2].id} feature={activeSlots[2]} />
            </div>
            <div className="h-[220px] flex items-start w-full">
              <AnimatedFeatureContent key={activeSlots[3].id} feature={activeSlots[3]} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}