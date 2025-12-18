"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type PixelGlitchBackgroundProps = {
  /** id de la section active (le même que celui déjà utilisé pour la navbar) */
  activeSection: string;
};

// Configuration simple de quelques colonnes de "gros pixels"
const COLUMNS = [
  { left: "6%", width: 34 },
  { left: "22%", width: 22 },
  { left: "38%", width: 28 },
  { left: "54%", width: 20 },
  { left: "70%", width: 30 },
  { left: "86%", width: 24 },
];

export default function PixelGlitchBackground({
  activeSection,
}: PixelGlitchBackgroundProps) {
  // section d'accueil (Hero) : adapte la valeur si ton id est différent
  const isHero = activeSection === "live";

  const [isBoosted, setIsBoosted] = useState(false);

  // Quand la section active change (et qu'on n'est pas sur le Hero),
  // on déclenche un "boost" de glitch pendant quelques centaines de ms
  useEffect(() => {
    if (isHero) return;

    setIsBoosted(true);
    const timeout = setTimeout(() => setIsBoosted(false), 350);

    return () => clearTimeout(timeout);
  }, [activeSection, isHero]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isHero ? 0 : isBoosted ? 0.38 : 0.22,
      }}
      transition={{ duration: 0.4 }}
    >
      {COLUMNS.map((col, index) => {
        const baseDuration = 26 + index * 4;
        const duration = isBoosted ? baseDuration * 0.45 : baseDuration;
        const delay = index * 0.6;

        return (
          <motion.div
            key={index}
            className="absolute top-[-25vh] h-[150vh]"
            style={{ left: col.left, width: col.width }}
            animate={{
              y: ["-20%", "20%"],
              x: ["-2px", "2px", "-1px", "1px"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear",
              duration,
              delay,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="mb-5 h-16 w-full rounded-[3px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.7))",
                  boxShadow:
                    "0 0 14px rgba(255,255,255,0.25), 4px 0 0 rgba(0,255,255,0.35), -4px 0 0 rgba(255,0,128,0.35)",
                }}
                animate={
                  isBoosted
                    ? {
                        opacity: [0.95, 0.6, 1],
                        scaleX: [1, 1.06, 0.94, 1],
                        scaleY: [1, 0.94, 1.05, 1],
                      }
                    : {
                        opacity: [0.65, 0.4, 0.75],
                        scaleX: [1, 1.015, 0.985, 1],
                        scaleY: [1, 0.99, 1.01, 1],
                      }
                }
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  duration: isBoosted ? 0.35 : 1.1 + i * 0.25,
                }}
              />
            ))}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
