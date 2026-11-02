import type { CSSProperties } from "react";

/** Stagger helper for `.intro` / `[data-reveal]` animations. */
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
