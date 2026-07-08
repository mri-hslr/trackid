import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PremiumCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Outer Ring */}

      <motion.div
        animate={{
          x: position.x - 20,
          y: position.y - 20,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28,
          mass: 0.3,
        }}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[9999]
          h-10
          w-10
          rounded-full
          border
          border-gold/60
        "
      />

      {/* Inner Dot */}

      <motion.div
        animate={{
          x: position.x - 4,
          y: position.y - 4,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 40,
        }}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[9999]
          h-2
          w-2
          rounded-full
          bg-gold
        "
      />
    </>
  );
}