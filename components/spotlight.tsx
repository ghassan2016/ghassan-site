"use client";

import { ReactNode, useRef } from "react";

/**
 * Pointer-follow glow for a grid of cards. Children opt in with
 * `data-spot` + the `.spotlight` class; this just feeds them --x / --y.
 */
export function SpotlightGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    ref.current?.querySelectorAll<HTMLElement>("[data-spot]").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - r.left}px`);
      card.style.setProperty("--y", `${e.clientY - r.top}px`);
    });
  }

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={`spotlight-grid ${className}`}>
      {children}
    </div>
  );
}
