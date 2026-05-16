"use client";

import { useState } from "react";
import Image from "next/image";
import { profile } from "@/lib/data";

/**
 * Portrait with graceful fallback. If /portrait.jpg is missing or fails
 * to load, shows a clean dark card with "GA" monogram instead of an
 * Image component error.
 */
export function Portrait() {
  const [errored, setErrored] = useState(false);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      {!errored ? (
        <Image
          src="/portrait.png"
          alt={`${profile.name} — ${profile.role}`}
          fill
          priority
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 380px, 90vw"
          className="object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[var(--color-surface-2)] via-[var(--color-surface)] to-[var(--color-bg)]">
          <div className="font-serif text-7xl font-light tracking-tight text-[var(--color-fg)]">
            GA
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-subtle)]">
            Add /public/portrait.png
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/40 via-transparent to-transparent" />
    </div>
  );
}
