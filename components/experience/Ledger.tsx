"use client";

import { useEffect, useRef } from "react";

const STATS = [
  { end: 3, label: "calls answered", prefix: "", suffix: "" },
  { end: 2, label: "bookings added", prefix: "", suffix: "" },
  { end: 1140, label: "recovered overnight", prefix: "$", suffix: "" },
  { end: 0, label: "times you woke up", prefix: "", suffix: "" },
];

const format = (stat: (typeof STATS)[number], progress: number) =>
  `${stat.prefix}${Math.round(stat.end * progress).toLocaleString()}${stat.suffix}`;

/**
 * The night-shift ledger: large numerals that count up with an ease-out
 * when the strip enters the viewport.
 *
 * The count is written straight to the DOM through refs rather than through
 * state. Driving it with setState re-rendered this subtree on every animation
 * frame (~108 React renders for one 1.8s count-up). The markup ships with the
 * final numbers, so no-JS and pre-hydration views are correct, and the effect
 * resets them to zero only when it is actually about to animate.
 */
export default function Ledger() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // markup already shows the final numbers

    const paint = (progress: number) => {
      STATS.forEach((stat, i) => {
        const cell = cellRefs.current[i];
        if (cell) cell.textContent = format(stat, progress);
      });
    };

    let raf = 0;
    let started = false;

    const begin = () => {
      if (started) return;
      // Don't burn the animation in a background tab; wait until it's shown.
      if (document.hidden) {
        setTimeout(begin, 400);
        return;
      }
      started = true;
      const t0 = performance.now();
      const D = 1800;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / D);
        paint(1 - Math.pow(1 - t, 3)); // ease-out cubic
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          paint(0); // only blank the numbers once we know we'll animate them
          begin();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="night-ledger">
      <p className="night-ledger-title">Last night, while the lights were off:</p>
      <div className="night-ledger-grid">
        {STATS.map((s, i) => (
          <div className="night-stat" key={s.label}>
            <b
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
            >
              {format(s, 1)}
            </b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <p className="night-ledger-note">Illustrative night for a service business on the Bella plan.</p>
    </div>
  );
}
