"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { hero, site } from "@/lib/data";
import { Magnetic } from "@/components/ui/magnetic";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { LampContainer } from "./lamp-container";
import { LayoutTextFlip } from "./layout-text-flip";
import { ScrollIndicator } from "./scroll-indicator";

const fadeUp = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Parallax: as the user scrolls past the hero, the foreground content
  // drifts up slightly and fades — adds depth into the next section.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section ref={ref} className="relative">
      <LampContainer
        startDelay={2.4}
        backdrop={
          <TextHoverEffect text="MAX" duration={0.3} startDelay={2.0} />
        }
      >
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto max-w-5xl text-center"
        >
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/80"
          >
            <EncryptedText
              text={site.role}
              revealDelayMs={60}
              flipDelayMs={40}
              startDelayMs={400}
            />
          </motion.p>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[0.95] tracking-tight sm:mt-8 sm:text-6xl md:text-7xl lg:text-8xl">
            <TextGenerateEffect words={site.name} startDelay={0.8} />
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
            <TextGenerateEffect
              words={hero.taglineLead}
              startDelay={1.4}
              className="text-xl font-bold tracking-tight drop-shadow-lg sm:text-2xl md:text-4xl"
            />
            <motion.div
              {...fadeUp}
              transition={{
                duration: 0.6,
                delay: 1.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <LayoutTextFlip words={hero.rotatingWords} duration={1500} />
            </motion.div>
          </div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 3.2, ease: [0.16, 1, 0.3, 1] }}
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
      </LampContainer>
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 3.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScrollIndicator />
        </motion.div>
      </motion.div>
    </section>
  );
}
