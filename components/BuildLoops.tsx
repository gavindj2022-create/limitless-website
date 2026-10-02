"use client";

import { useEffect, useRef, useState } from "react";
import s from "./BuildLoops.module.css";

export type BuildKind = "site" | "memory" | "bella" | "inbox" | "gallery" | "build";

/**
 * Small looping illustration for each "Our work" tile. Pure SVG + CSS
 * (transform/opacity/stroke-dashoffset only), paused while offscreen and
 * static under prefers-reduced-motion, so it costs almost nothing.
 */
export default function BuildLoop({ kind }: { kind: BuildKind }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setPlay(entry.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={`${s.art} ${s[kind]}`} data-play={play ? "1" : "0"} aria-hidden="true">
      <svg viewBox="0 0 320 118" preserveAspectRatio="xMidYMid meet" focusable="false">{ART[kind]}</svg>
    </span>
  );
}

const ART: Record<BuildKind, React.ReactNode> = {
  site: (
    <>
      <rect className={s.frame} x="70" y="10" width="180" height="98" rx="9" />
      <line className={s.rule} x1="70" y1="24" x2="250" y2="24" />
      <circle className={s.dot} cx="80" cy="17" r="2.4" /><circle className={s.dot} cx="88" cy="17" r="2.4" /><circle className={s.dot} cx="96" cy="17" r="2.4" />
      <rect className={`${s.block} ${s.b1}`} x="82" y="31" width="156" height="7" rx="3.5" />
      <rect className={`${s.block} ${s.b2}`} x="82" y="45" width="92" height="30" rx="5" />
      <rect className={`${s.soft} ${s.b3}`} x="182" y="45" width="56" height="30" rx="5" />
      <rect className={`${s.cta} ${s.b4}`} x="89" y="64" width="38" height="7" rx="3.5" />
      <rect className={`${s.soft} ${s.b5}`} x="82" y="83" width="48" height="16" rx="4" />
      <rect className={`${s.soft} ${s.b6}`} x="136" y="83" width="48" height="16" rx="4" />
      <rect className={`${s.soft} ${s.b7}`} x="190" y="83" width="48" height="16" rx="4" />
      <path className={s.cursor} d="M0 0 L0 13 L3.6 9.6 L6.4 15.2 L8.6 14.2 L5.8 8.8 L10.6 8.4 Z" />
    </>
  ),
  memory: (
    <>
      {[[64, 30], [78, 94], [256, 26], [246, 92], [160, 12]].map(([x, y], i) => (
        <g key={i}>
          <line className={s.edge} x1={x} y1={y} x2="160" y2="60" />
          <line className={s.pulse} style={{ ["--i" as string]: i }} x1={x} y1={y} x2="160" y2="60" pathLength={100} />
          <circle className={s.node} cx={x} cy={y} r="6" />
        </g>
      ))}
      <circle className={s.halo} cx="160" cy="60" r="20" />
      <circle className={s.core} cx="160" cy="60" r="11" />
      <path className={s.coreMark} d="M154 60 h12 M160 54 v12" />
    </>
  ),
  bella: (
    <>
      <circle className={`${s.ring} ${s.r1}`} cx="92" cy="59" r="22" />
      <circle className={`${s.ring} ${s.r2}`} cx="92" cy="59" r="22" />
      <circle className={s.badge} cx="92" cy="59" r="21" />
      <path className={s.phone} d="M84.5 49.5c1.6-1.6 3.6-1.3 4.6.4l2 3.4c.8 1.4.5 2.8-.7 3.8l-1.4 1.2c1.3 2.8 3.5 5 6.3 6.3l1.2-1.4c1-1.2 2.4-1.5 3.8-.7l3.4 2c1.7 1 2 3 .4 4.6l-1.6 1.6c-2 2-5 2.3-7.6 1-6.2-3-11-7.8-14-14-1.3-2.6-1-5.6 1-7.6z" />
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} className={s.bar} style={{ ["--i" as string]: i }} x={140 + i * 12} y="39" width="6" height="40" rx="3" />
      ))}
    </>
  ),
  inbox: (
    <>
      <path className={s.tray} d="M108 74 h104 l-10 26 h-84 z" />
      <path className={s.trayLip} d="M108 74 h30 l6 9 h32 l6 -9 h30" />
      {[0, 1, 2].map((i) => (
        <g key={i} className={s.mail} style={{ ["--i" as string]: i, ["--x" as string]: `${(i - 1) * 34}px` }}>
          <rect x="143" y="18" width="34" height="23" rx="3" />
          <path d="M143 21 l17 12 l17 -12" />
        </g>
      ))}
      <circle className={s.flag} cx="182" cy="62" r="6" />
      <path className={s.reply} d="M226 58 h40 m-10 -9 l10 9 l-10 9" />
    </>
  ),
  gallery: (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} className={s.card} style={{ ["--i" as string]: i }}>
          <rect className={s.cardBody} x="122" y="16" width="76" height="86" rx="8" />
          <rect className={s.cardBar} x="130" y="25" width="60" height="6" rx="3" />
          <rect className={s.cardHero} x="130" y="37" width="60" height="28" rx="4" />
          <rect className={s.cardBar} x="130" y="72" width="40" height="5" rx="2.5" />
          <rect className={s.cardBar} x="130" y="82" width="52" height="5" rx="2.5" />
        </g>
      ))}
    </>
  ),
  build: (
    <>
      <rect className={`${s.mod} ${s.m1}`} x="126" y="24" width="32" height="32" rx="7" />
      <rect className={`${s.mod} ${s.m2}`} x="162" y="24" width="32" height="32" rx="7" />
      <rect className={`${s.mod} ${s.m3}`} x="126" y="60" width="32" height="32" rx="7" />
      <rect className={`${s.mod} ${s.accent} ${s.m4}`} x="162" y="60" width="32" height="32" rx="7" />
      <path className={s.spark} d="M218 34 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" />
      <path className={s.check} d="M170 76 l6 6 l12 -13" />
    </>
  ),
};
