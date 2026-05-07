"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { about } from "@/lib/data";

interface Props {
  scrollYProgress: MotionValue<number>;
}

// Splits a pull-quote on the accent substring (case-sensitive, first match)
// and wraps the match in an accent span. Returns the original string if no match.
function renderPullQuote(quote: string, accent: string) {
  const i = quote.indexOf(accent);
  if (i === -1) return quote;
  return (
    <>
      {quote.slice(0, i)}
      <span className="text-accent">{accent}</span>
      {quote.slice(i + accent.length)}
    </>
  );
}

// Beat 2 — three chapters, one at a time.
// Each chapter shows ONLY its pullQuote (dominant) + a thin rule + mono label + body.
// No horizontal drift. No background numeral. Opacity cross-fades only.
//
// Progress windows (0.16 each, 0.02 cross-fade gap):
//   Ch.01 Origin: 0.30 → 0.46  (peak 0.34–0.42)
//   Ch.02 Craft:  0.46 → 0.62  (peak 0.50–0.58)
//   Ch.03 Now:    0.62 → 0.80  (peak 0.66–0.74)
export function ActChapters({ scrollYProgress }: Props) {
  const [ch1, ch2, ch3] = about.chapters;

  const ch1Opacity = useTransform(
    scrollYProgress,
    [0.30, 0.34, 0.42, 0.46],
    [0, 1, 1, 0]
  );
  const ch2Opacity = useTransform(
    scrollYProgress,
    [0.46, 0.50, 0.58, 0.62],
    [0, 1, 1, 0]
  );
  const ch3Opacity = useTransform(
    scrollYProgress,
    [0.62, 0.66, 0.74, 0.80],
    [0, 1, 1, 0]
  );

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {[
        { ch: ch1, opacity: ch1Opacity },
        { ch: ch2, opacity: ch2Opacity },
        { ch: ch3, opacity: ch3Opacity },
      ].map(({ ch, opacity }) => (
        <motion.div
          key={ch.index}
          className="absolute inset-0 flex items-center justify-center px-10 sm:px-20"
          style={{ opacity }}
        >
          <div className="flex w-full max-w-3xl flex-col gap-6">
            {/* Pull-quote — the dominant element */}
            <p
              className="font-display font-semibold text-foreground"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.75rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {renderPullQuote(ch.pullQuote, ch.pullQuoteAccent)}
            </p>

            {/* Thin accent rule — small editorial moment */}
            <hr className="border-t border-accent/40" />

            {/* Mono index/title label — index in accent */}
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              <span className="text-accent">{ch.index}</span> — {ch.title.toUpperCase()}
            </p>

            {/* Body paragraph */}
            <p className="max-w-md font-sans text-base text-foreground/70 sm:text-lg">
              {ch.body}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
