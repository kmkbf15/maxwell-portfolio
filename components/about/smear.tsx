"use client";

import { useTransform, motion } from "framer-motion";
import { useScrollVelocity } from "@/components/about/use-scroll-velocity";

interface Props {
  children: React.ReactNode;
  isMobile?: boolean;
}

// Wraps all About typography in a single GPU transform + filter driven by
// scroll velocity. One element smears — not per-text — so it's cheap.
// overflow-visible is intentional: overflow:hidden clips skewed text edges.
export function Smear({ children, isMobile }: Props) {
  const velocity = useScrollVelocity();

  // Leans INTO the direction of motion (opposite sign to velocity).
  const skewX = useTransform(velocity, [-3000, 0, 3000], [5, 0, -4]);
  // Always stretches (≥ 1) regardless of scroll direction.
  const scaleX = useTransform(velocity, [-3000, 0, 3000], [1.02, 1, 1.06]);
  // Blur kicks in past ±500 px/s so the resting state stays razor-sharp.
  const filterDesktop = useTransform(
    velocity,
    [-2000, -1500, -500, 0, 500, 1500, 2000],
    [
      "blur(8px)",
      "blur(4px)",
      "blur(2px)",
      "blur(0px)",
      "blur(2px)",
      "blur(4px)",
      "blur(8px)",
    ],
  );
  // Mobile: no blur (GPU filter expensive on mobile). Keep skew + scale at half intensity.
  const skewXMobile = useTransform(skewX, (v) => v * 1.5);
  const scaleXMobile = useTransform(scaleX, (v) => 1 + (v - 1) * 1.7);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        skewX: isMobile ? skewXMobile : skewX,
        scaleX: isMobile ? scaleXMobile : scaleX,
        filter: isMobile ? filterDesktop : filterDesktop,
        overflow: "visible",
      }}
    >
      {children}
    </motion.div>
  );
}
