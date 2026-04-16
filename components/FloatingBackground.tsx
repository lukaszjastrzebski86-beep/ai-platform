"use client";

import { motion } from "framer-motion";

export default function FloatingBackground() {
  const orbs = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="floating-background">
      {orbs.map((orb) => (
        <motion.div
          key={orb}
          className="floating-orb"
          style={{
            left: `${10 + orb * 10}%`,
            top: `${20 + (orb % 3) * 20}%`,
            animationDelay: `${orb * 0.5}s`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + orb * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}