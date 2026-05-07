"use client";

import { about } from "@/lib/data";

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

// Reduced-motion fallback — same content as the cinematic beats, zero animation.
// Chapter layout mirrors Beat 2: pull-quote dominant, then thin rule, then mono label, then body.
// Snapshot mirrors Beat 3: plain 2-col key/value list, not a card grid.
export function AboutStatic() {
  const [cueIndex, ...cueRest] = about.cue.split(" ");
  const cueTail = cueRest.join(" ");

  return (
    <section
      id="about"
      className="border-t border-border px-6 py-24 sm:py-32"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-3xl">
        {/* Cue label */}
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-muted">
          <span className="text-accent">{cueIndex}</span> {cueTail}
        </p>

        {/* MAXWELL display word */}
        <h2
          id="about-heading"
          className="mb-20 font-display font-bold text-foreground"
          style={{
            fontSize: "clamp(4rem, 14vw, 10rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {about.displayWord}
        </h2>

        {/* Three chapters — pull-quote first, then rule, then label, then body */}
        <div className="flex flex-col gap-20">
          {about.chapters.map((ch) => (
            <article key={ch.index} className="flex flex-col gap-5">
              <p
                className="font-display font-semibold text-foreground"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                {renderPullQuote(ch.pullQuote, ch.pullQuoteAccent)}
              </p>

              <hr className="border-t border-accent/40" />

              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                <span className="text-accent">{ch.index}</span> — {ch.title.toUpperCase()}
              </p>

              <p className="max-w-md font-sans text-base leading-relaxed text-foreground/70 sm:text-lg">
                {ch.body}
              </p>
            </article>
          ))}
        </div>

        {/* Snapshot — 2-col key/value list, mirrors Beat 3 */}
        <div className="mt-24 grid grid-cols-[auto_1fr] gap-x-12 gap-y-5 sm:gap-x-20 sm:gap-y-7">
          {about.snapshot.map((item) => (
            <div key={item.label} className="contents">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted self-baseline">
                {item.label}
              </p>
              <p className="font-sans text-base text-foreground sm:text-lg self-baseline">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
