"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { end: 3, label: "calls answered", prefix: "", suffix: "" },
  { end: 2, label: "bookings added", prefix: "", suffix: "" },
  { end: 1140, label: "recovered overnight", prefix: "$", suffix: "" },
  { end: 0, label: "times you woke up", prefix: "", suffix: "" },
];

/**
 * The night-shift ledger: large numerals that count up with an ease-out
 * when the strip enters the viewport. Reduced-motion users get the final
 * numbers immediately.
 */
export default function Ledger() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const begin = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (reduced) {
        setProgress(1);
        return;
      }
      const t0 = performance.now();
      const D = 1800;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / D);
        setProgress(1 - Math.pow(1 - t, 3)); // ease-out cubic
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          begin();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="night-ledger">
      <p className="night-ledger-title">Last night, while the lights were off:</p>
      <div className="night-ledger-grid">
        {STATS.map((s) => (
          <div className="night-stat" key={s.label}>
            <b>
              {s.prefix}
              {Math.round(s.end * progress).toLocaleString()}
              {s.suffix}
            </b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <p className="night-ledger-note">Illustrative night for a service business on the Bella plan.</p>
    </div>
  );
}
