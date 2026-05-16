"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Full-width "How I work" section featuring the workspace shot with the
 * "Divide and conquer" quote baked into the image. Falls back to a clean
 * dark card with the quote rendered in HTML if /workspace.jpg is missing.
 */
export function Philosophy() {
  const [errored, setErrored] = useState(false);

  return (
    <section
      id="philosophy"
      className="border-t border-[var(--color-border)] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            How I work
          </div>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            Ship in focused steps, not heroic sprints.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
            National-scale platforms aren&apos;t built by accident. Every system I&apos;ve
            shipped — PalAI, ArabTalents, the Ministry CMS — got there the same way:
            decompose, design, prototype, ship a small slice, iterate.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          {!errored ? (
            <div className="relative aspect-[16/10] sm:aspect-[16/9]">
              <Image
                src="/workspace.jpg"
                alt="Ghassan at work — sticky-note philosophy on the wall: Work, Solve, Learn, Repeat."
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
                onError={() => setErrored(true)}
              />
              {/* gentle vignette so the image blends with the dark page */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/30 via-transparent to-transparent" />
            </div>
          ) : (
            <PhilosophyFallback />
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--color-subtle)]">
          <div className="font-mono uppercase tracking-wider">
            Work · Solve · Learn · Repeat
          </div>
          <div className="font-mono uppercase tracking-wider">
            Focus · Discipline · Consistency
          </div>
        </div>
      </div>
    </section>
  );
}

function PhilosophyFallback() {
  return (
    <div className="relative grid aspect-[16/10] place-items-center bg-gradient-to-br from-[var(--color-surface-2)] via-[var(--color-surface)] to-[var(--color-bg)] p-8 sm:aspect-[16/9]">
      <div className="max-w-xl text-center">
        <p className="text-balance font-serif text-2xl font-light leading-snug text-[var(--color-fg)] sm:text-3xl lg:text-4xl">
          Divide and conquer. Every complex challenge yields to a series of smart,
          focused steps.
        </p>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-subtle)]">
          Add /public/workspace.jpg
        </div>
      </div>
    </div>
  );
}
