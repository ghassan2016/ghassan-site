"use client";

import { useState } from "react";
import Image from "next/image";
import { steps } from "@/lib/data";
import { delay } from "@/lib/style";
import { SectionHeading } from "./section";

/**
 * "How I work" — the workspace shot (its "Divide and conquer" quote is baked
 * into the image) plus the four-step process. Falls back to the quote in
 * HTML if /workspace.jpeg is missing.
 */
export function Philosophy() {
  const [errored, setErrored] = useState(false);

  return (
    <section id="process" className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          index="05"
          eyebrow="How I work"
          title={
            <>
              Divide and conquer. <em>Ship in focused steps.</em>
            </>
          }
          description="National-scale platforms aren't built by accident. Everything I've shipped got there the same way — and it's literally written on my wall."
        />

        <div data-reveal className="ring-glow rounded-[2rem]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-surface)]">
            {!errored ? (
              <div className="relative aspect-[16/10] sm:aspect-[3/2]">
                <Image
                  src="/workspace.jpeg"
                  alt="Ghassan at work — sticky-note philosophy on the wall: Work, Solve, Learn, Repeat."
                  fill
                  sizes="(min-width: 1152px) 1088px, 100vw"
                  className="object-cover"
                  onError={() => setErrored(true)}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060609]/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-[#0d0d14]/80 px-3 py-1.5 text-xs text-[var(--color-muted)] backdrop-blur sm:bottom-6 sm:left-6">
                  <span className="text-[var(--color-fg)]">Yes</span> — that&apos;s BrightGaza on the laptop.
                </span>
              </div>
            ) : (
              <PhilosophyFallback />
            )}
          </div>
        </div>

        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={delay(i * 90)}
              className="relative rounded-3xl border border-white/[0.07] bg-[var(--color-surface)] p-7"
            >
              <span className="text-gradient font-serif text-5xl italic leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.015em] text-[var(--color-fg)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{step.body}</p>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[var(--color-bg)] text-xs text-[var(--color-muted)] lg:grid"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PhilosophyFallback() {
  return (
    <div className="relative grid aspect-[16/10] place-items-center bg-gradient-to-br from-[var(--color-surface-2)] via-[var(--color-surface)] to-[var(--color-bg)] p-8 sm:aspect-[3/2]">
      <p className="max-w-xl text-balance text-center font-serif text-3xl italic leading-snug text-[var(--color-fg)] sm:text-4xl">
        Divide and conquer. Every complex challenge yields to a series of smart, focused steps.
      </p>
    </div>
  );
}
