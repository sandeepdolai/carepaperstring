"use client";

import { motion } from "framer-motion";

/** CSS torus echoing the reference gold ring. Spins slowly. */
export function GoldRing() {
  return (
    <motion.div
      aria-hidden
      className="gold-ring-box pointer-events-none fixed left-1/2 top-1/2 z-30"
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.86 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        x: "-50%",
        y: "-50%",
      }}
    >
      <div className="gold-ring relative size-full" />
    </motion.div>
  );
}
