"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export const RandomPoints = () => {
  const points = useMemo(
    () =>
      [...Array(2000)].map(() => ({
        size: Math.min(3, Math.floor(Math.random() * 4 + 1)),
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 10 + 10,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/1 to-gray-100/1">
        {points.map((point, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gray-400/30"
            style={{
              width: `${point.size}px`,
              height: `${point.size}px`,
            }}
            initial={{
              top: `${point.top}%`,
              left: `${point.left}%`,
              opacity: point.opacity,
            }}
            animate={{
              top: [`${point.top}%`, `${(point.top + 5) % 100}%`],
              left: [`${point.left}%`, `${(point.left + 5) % 100}%`],
            }}
            transition={{
              duration: point.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};
