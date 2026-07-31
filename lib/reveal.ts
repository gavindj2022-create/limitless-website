import type { CSSProperties } from "react";

/**
 * Stagger helper for `[data-reveal]` elements. Sets the `--rd` custom property
 * that globals.css uses as the reveal transition-delay.
 *
 * Plain module (no "use client") so server components can call it directly.
 */
export const revealDelay = (seconds: number): CSSProperties =>
  ({ "--rd": `${seconds}s` }) as CSSProperties;
