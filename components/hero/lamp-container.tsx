"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Smoother, more elegant easing than the original easeInOut.
// Expo-out (cubic-bezier) — fast start, long graceful settle.
const ease = [0.16, 1, 0.3, 1] as const;
const beamDuration = 1.4;

export function LampContainer({
  children,
  className,
  backdrop,
}: {
  children: ReactNode;
  className?: string;
  backdrop?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative z-0 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background",
        className,
      )}
    >
      {/* Optional decorative backdrop — sits beneath the lamp visuals and content. */}
      {backdrop && <div className="absolute inset-0 z-0">{backdrop}</div>}

      {/* Lamp stage — scaled vertically so the cones look taller without changing layout height.
          pointer-events-none so backdrop hover effects keep working in the regions the lamp covers. */}
      <div className="pointer-events-none relative isolate z-10 flex w-full flex-1 scale-y-125 items-center justify-center">
        {/* Left light cone — conic gradient fading from accent to transparent, animates in from 0 width */}
        <motion.div
          initial={{ opacity: 0, width: "0rem" }}
          whileInView={{ opacity: 1, width: "45rem" }}
          transition={{ delay: 0.5, duration: beamDuration, ease }}
          style={{
            backgroundImage:
              "conic-gradient(var(--conic-position), var(--accent), transparent, transparent)",
          }}
          className="absolute inset-auto right-1/2 h-56 w-[45rem] overflow-visible text-foreground [--conic-position:from_70deg_at_center_top]"
        >
          {/* Masks that fade the cone's bottom and left edges into the background for a soft falloff */}
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
          {/* <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_right,white,transparent)]" /> */}
        </motion.div>

        {/* Right light cone — mirror of the left one, gradient direction reversed */}
        <motion.div
          initial={{ opacity: 0, width: "0rem" }}
          whileInView={{ opacity: 1, width: "45rem" }}
          transition={{ delay: 0.5, duration: beamDuration, ease }}
          style={{
            backgroundImage:
              "conic-gradient(var(--conic-position), transparent, transparent, var(--accent))",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[45rem] text-foreground [--conic-position:from_290deg_at_center_top]"
        >
          {/* Soft falloff masks for the right cone */}
          {/* <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_left,white,transparent)]" /> */}
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Bottom haze — wide blurred background slab that hides the bottom of the cones */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-background blur-2xl" />
        {/* Frosted layer — subtle backdrop blur over the lamp's lower half */}
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Big soft glow — large blurred accent disc that gives the lamp its ambient halo */}
        {/* <div className="absolute inset-auto z-50 h-36 w-[26rem] -translate-y-1/2 rounded-full bg-accent opacity-50 blur-3xl" /> */}

        {/* Hot spot — tighter, brighter glow at the lamp's focal point, animates wider on view */}
        <motion.div
          initial={{ width: "0rem", opacity: 0 }}
          whileInView={{ width: "16rem", opacity: 1 }}
          transition={{ delay: 0.3, duration: beamDuration, ease }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-accent blur-3xl"
        />

        {/* Light bar — thin sharp accent line that reads as the lamp's bulb / emitter edge */}
        {/* <motion.div
          initial={{ width: "0rem", opacity: 0 }}
          whileInView={{ width: "30rem", opacity: 1 }}
          transition={{ delay: 0.5, duration: beamDuration, ease }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-accent"
        /> */}

        {/* Top mask — solid background block that covers the cones' tops so they appear to start from a clean line */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-background" />
      </div>

      {/* Content layer — sits above the lamp visuals, pulled upward so children render over the glow */}
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}
