"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { hero, site } from "@/lib/data";
import { Magnetic } from "@/components/ui/magnetic";
import { HeroCanvas } from "./hero-canvas";
import { NameReveal } from "./name-reveal";
import { RotatingText } from "./rotating-text";

const fadeUp = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Parallax: as the user scrolls past the hero, the 3D blob drifts
  // downward and fades. Foreground text drifts up slightly for depth.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const blobY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const blobOpacity = useTransform(scrollYProgress, [0, 0.8], [0.6, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16"
    >
      {/* 3D blob — sits behind the text, parallax-drifts on scroll */}
      <motion.div
        style={{ y: blobY, opacity: blobOpacity }}
        className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_40%,transparent_75%)]"
      >
        <HeroCanvas />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
        >
          {site.role}
        </motion.p>

        <div className="mt-8">
          <NameReveal name={site.name} />
        </div>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-lg text-muted sm:text-xl"
        >
          {hero.taglineLead}{" "}
          <RotatingText words={hero.rotatingWords} />
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Magnetic className="inline-block">
            <a
              href={hero.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
            >
              {hero.primaryCta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
          <Magnetic className="inline-block">
            <a
              href={hero.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-foreground/5"
            >
              {hero.secondaryCta.label}
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
