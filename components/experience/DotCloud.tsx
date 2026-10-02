"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./DotCloud.module.css";

const SHAPES = ["phone", "envelope", "calendar", "star", "bar chart", "infinity"] as const;
const CYCLE_MS = 4200;
const MORPH_MS = 900;
const FRAME_MS = 1000 / 30;
const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

type Shape = (typeof SHAPES)[number];
type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const subscribeReduced = (onChange: () => void) => {
  const media = window.matchMedia(REDUCED_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getReducedServer = () => false;

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  ctx.clearRect(0, 0, 256, 256);
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (shape === "phone") {
    ctx.beginPath();
    ctx.roundRect(77, 27, 102, 202, 18);
    ctx.moveTo(110, 47);
    ctx.lineTo(146, 47);
    ctx.moveTo(123, 207);
    ctx.lineTo(133, 207);
    ctx.stroke();
  } else if (shape === "envelope") {
    ctx.beginPath();
    ctx.roundRect(30, 65, 196, 126, 12);
    ctx.moveTo(37, 76);
    ctx.lineTo(128, 143);
    ctx.lineTo(219, 76);
    ctx.stroke();
  } else if (shape === "calendar") {
    ctx.beginPath();
    ctx.roundRect(41, 48, 174, 169, 13);
    ctx.moveTo(43, 96);
    ctx.lineTo(213, 96);
    ctx.moveTo(83, 35);
    ctx.lineTo(83, 67);
    ctx.moveTo(173, 35);
    ctx.lineTo(173, 67);
    ctx.stroke();
    for (const x of [83, 128, 173]) {
      for (const y of [127, 165]) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (shape === "star") {
    ctx.beginPath();
    for (let point = 0; point < 10; point++) {
      const angle = -Math.PI / 2 + (point * Math.PI) / 5;
      const radius = point % 2 === 0 ? 105 : 48;
      const x = 128 + Math.cos(angle) * radius;
      const y = 128 + Math.sin(angle) * radius;
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  } else if (shape === "bar chart") {
    ctx.beginPath();
    ctx.moveTo(31, 216);
    ctx.lineTo(226, 216);
    ctx.stroke();
    ctx.fillRect(48, 137, 35, 72);
    ctx.fillRect(109, 92, 35, 117);
    ctx.fillRect(170, 48, 35, 161);
  } else {
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.bezierCurveTo(79, 48, 24, 91, 38, 139);
    ctx.bezierCurveTo(53, 206, 103, 177, 128, 128);
    ctx.bezierCurveTo(153, 79, 203, 50, 218, 117);
    ctx.bezierCurveTo(232, 165, 177, 208, 128, 128);
    ctx.stroke();
  }
}

function sampleShape(shape: Shape, count: number): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const points = new Float32Array(count * 2);
  if (!ctx) return points;
  drawShape(ctx, shape);
  const pixels = ctx.getImageData(0, 0, 256, 256).data;
  const candidates: number[] = [];
  for (let y = 20; y < 236; y++) {
    for (let x = 20; x < 236; x++) {
      if (pixels[(y * 256 + x) * 4 + 3] > 100) candidates.push(y * 256 + x);
    }
  }
  // A partial seeded shuffle spreads the cloud evenly without duplicate points.
  let seed = SHAPES.indexOf(shape) + 1;
  for (let i = 0; i < count; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const selected = i + (seed % (candidates.length - i));
    [candidates[i], candidates[selected]] = [candidates[selected], candidates[i]];
    const pixel = candidates[i];
    points[i * 2] = pixel % 256;
    points[i * 2 + 1] = Math.floor(pixel / 256);
  }
  return points;
}

// The on-screen movement uses the animate skill's ease-in-out curve.
function easeMorph(progress: number) {
  let low = 0;
  let high = 1;
  for (let i = 0; i < 12; i++) {
    const t = (low + high) / 2;
    const inverse = 1 - t;
    const x = 3 * inverse * inverse * t * 0.77 + 3 * inverse * t * t * 0.175 + t * t * t;
    if (x < progress) low = t;
    else high = t;
  }
  const t = (low + high) / 2;
  const inverse = 1 - t;
  return 3 * inverse * t * t + t * t * t;
}

function InfinityMark({ decorative = false }: { decorative?: boolean }) {
  return (
    <svg
      className={styles.staticMark}
      viewBox="0 0 256 256"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Limitless infinity dot cloud"}
      aria-hidden={decorative ? true : undefined}
    >
      <path
        d="M128 128 C79 48 24 91 38 139 C53 206 103 177 128 128 C153 79 203 50 218 117 C232 165 177 208 128 128"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray="0.1 4.5"
      />
    </svg>
  );
}

/** A decorative hero explanation: familiar work icons resolve into Limitless. */
export default function DotCloud() {
  const hostRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [shapeIndex, setShapeIndex] = useState(0);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);

  // Wait for both idle time and an on-screen host before creating the canvas.
  useEffect(() => {
    if (reduced || ready) return;
    const host = hostRef.current;
    if (!host) return;
    let idle = false;
    let visible = false;
    const reveal = () => {
      if (idle && visible) setReady(true);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      reveal();
    });
    observer.observe(host);
    const idleWindow = window as IdleWindow;
    const handle = idleWindow.requestIdleCallback?.(() => {
      idle = true;
      reveal();
    }, { timeout: 1600 });
    const timer = handle === undefined ? window.setTimeout(() => {
      idle = true;
      reveal();
    }, 800) : undefined;
    return () => {
      observer.disconnect();
      if (handle !== undefined) idleWindow.cancelIdleCallback?.(handle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [ready, reduced]);

  useEffect(() => {
    if (!ready || reduced) return;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { desynchronized: true });
    if (!host || !canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let rect = host.getBoundingClientRect();
    let count = 0;
    let from: Float32Array<ArrayBufferLike> = new Float32Array(0);
    let to: Float32Array<ArrayBufferLike> = new Float32Array(0);
    let index = 0;
    let morphStart = 0;
    let nextAt = 0;
    let lastFrame = 0;
    let raf = 0;
    let running = false;
    let visible = false;
    let pointerX = -1000;
    let pointerY = -1000;

    const fit = () => {
      rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const nextCount = window.matchMedia(MOBILE_QUERY).matches ? 500 : 1100;
      if (count !== nextCount) {
        count = nextCount;
        from = sampleShape(SHAPES[index], count);
        to = from;
        morphStart = 0;
      }
    };
    fit();

    const nextShape = (now: number) => {
      const progress = morphStart ? Math.min((now - morphStart) / MORPH_MS, 1) : 1;
      const eased = easeMorph(progress);
      const current = new Float32Array(count * 2);
      for (let i = 0; i < current.length; i++) {
        current[i] = from[i] + (to[i] - from[i]) * eased;
      }
      from = current;
      index = (index + 1) % SHAPES.length;
      to = sampleShape(SHAPES[index], count);
      morphStart = now;
      nextAt = now + CYCLE_MS;
      setShapeIndex(index);
    };

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      if (now >= nextAt) nextShape(now);

      const progress = morphStart ? Math.min((now - morphStart) / MORPH_MS, 1) : 1;
      const eased = easeMorph(progress);
      const scale = Math.min(width, height) / 256;
      const offsetX = (width - 256 * scale) / 2;
      const offsetY = (height - 256 * scale) / 2;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        let x = offsetX + (from[i * 2] + (to[i * 2] - from[i * 2]) * eased) * scale;
        let y = offsetY + (from[i * 2 + 1] + (to[i * 2 + 1] - from[i * 2 + 1]) * eased) * scale;
        const dx = x - pointerX;
        const dy = y - pointerY;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < 2304) {
          const distance = Math.sqrt(distanceSquared) || 1;
          const push = (1 - distance / 48) * 16;
          x += (dx / distance) * push;
          y += (dy / distance) * push;
        }
        ctx.moveTo(x + 1.05, y);
        ctx.arc(x, y, 1.05, 0, Math.PI * 2);
      }
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = "#F3D98B";
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      lastFrame = 0;
      nextAt = performance.now() + CYCLE_MS;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(host);
    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(host);
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const onPointer = (event: PointerEvent) => {
      if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointerX = pointerY = -1000;
    };
    const onScroll = () => {
      rect = host.getBoundingClientRect();
    };
    const onClick = () => nextShape(performance.now());
    host.addEventListener("click", onClick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready, reduced]);

  if (reduced) {
    return <div className={styles.cloud}><InfinityMark /></div>;
  }

  return (
    <button
      ref={hostRef}
      className={styles.cloud}
      type="button"
      aria-label={`Dot cloud showing ${SHAPES[shapeIndex]}. Show next shape`}
    >
      {ready ? <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" /> : <InfinityMark decorative />}
    </button>
  );
}
