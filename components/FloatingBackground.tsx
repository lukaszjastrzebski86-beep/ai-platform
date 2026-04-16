"use client";

import { motion } from "framer-motion";

type FloatingBackgroundProps = {
  tone?: string;
};

const particles = [
  { left: "6%", top: "14%", size: 180, delay: 0, duration: 18 },
  { left: "22%", top: "58%", size: 120, delay: 1.2, duration: 14 },
  { left: "40%", top: "8%", size: 220, delay: 0.4, duration: 20 },
  { left: "56%", top: "44%", size: 130, delay: 1.8, duration: 16 },
  { left: "74%", top: "18%", size: 190, delay: 0.8, duration: 19 },
  { left: "84%", top: "68%", size: 150, delay: 0.2, duration: 17 },
];

export default function FloatingBackground({
  tone = "home",
}: FloatingBackgroundProps) {
  return (
    <div className={`floating-background tone-${tone}`}>
      {particles.map((particle, index) => (
        <motion.div
          key={`${tone}-${index}`}
          className="floating-orb"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [0, 18, -12, 0],
            y: [0, -18, 14, 0],
            scale: [1, 1.08, 0.96, 1],
            opacity: [0.32, 0.54, 0.28, 0.32],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
