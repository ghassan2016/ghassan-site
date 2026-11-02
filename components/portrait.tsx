"use client";

import { useState } from "react";
import Image from "next/image";
import { profile } from "@/lib/data";

/**
 * Portrait with graceful fallback. If /portrait.png is missing or fails
 * to load, shows a dark card with a "GA" monogram instead.
 */
export function Portrait() {
  const [errored, setErrored] = useState(false);

  return (
    <div className="ring-glow rounded-[2rem]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[var(--color-surface)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
        {!errored ? (
          <Image
            src="/portrait.png"
            alt={`${profile.name} — ${profile.role}`}
            fill
            priority
            sizes="(min-width: 640px) 400px, 90vw"
            className="object-cover object-top"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[var(--color-surface-2)] via-[var(--color-surface)] to-[var(--color-bg)]">
            <div className="font-serif text-7xl italic tracking-tight text-[var(--color-fg)]">GA</div>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-subtle)]">
              Add /public/portrait.png
            </div>
          </div>
        )}
        {/* blend the studio backdrop into the dark page */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060609] via-[#060609]/10 via-35% to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(139,123,255,0.18),transparent_45%)] mix-blend-soft-light" />
      </div>
    </div>
  );
}
