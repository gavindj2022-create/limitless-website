"use client";

import { useEffect, useRef } from "react";

/**
 * The living layer over the hero film: leads (points of light) flow along
 * curved paths into a central agent node and are captured with a soft ping.
 * The pointer gently bends nearby paths. Pure canvas, ~60 particles,
 * disabled entirely for prefers-reduced-motion.
 */
export default function AgentField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      W = canvas.width = rect.width;
      H = canvas.height = rect.height;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    // The agent node sits low-center, below the CTA, where the film's weave converges.
    const node = () => ({ x: W * 0.5, y: H * 0.88 });

    interface Lead {
      t: number;      // progress 0→1 along its path
      speed: number;
      side: number;   // -1 from left, 1 from right
      lift: number;   // arc height factor
      y0: number;     // entry height factor
      captured: boolean;
    }

    const N = 26;
    const leads: Lead[] = [];
    const spawn = (l?: Lead): Lead => {
      const fresh: Lead = l ?? ({} as Lead);
      fresh.t = 0;
      fresh.speed = 0.0016 + Math.random() * 0.0028;
      fresh.side = Math.random() > 0.5 ? 1 : -1;
      fresh.lift = 0.1 + Math.random() * 0.35;
      fresh.y0 = 0.15 + Math.random() * 0.6;
      fresh.captured = false;
      return fresh;
    };
    for (let i = 0; i < N; i++) {
      const l = spawn();
      l.t = Math.random(); // stagger initial positions
      leads.push(l);
    }

    interface Ping {
      r: number;
      a: number;
    }
    const pings: Ping[] = [];

    let px = -1e4;
    let py = -1e4;
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
    };
    const onLeave = () => {
      px = -1e4;
      py = -1e4;
    };
    canvas.parentElement?.addEventListener("pointermove", onPointer);
    canvas.parentElement?.addEventListener("pointerleave", onLeave);

    let pulse = 0;

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const { x: nx, y: ny } = node();
      pulse += 0.03;

      // agent node: a quiet breathing ring
      const nr = 7 + Math.sin(pulse) * 1.5;
      ctx.beginPath();
      ctx.arc(nx, ny, nr, 0, 7);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.shadowColor = "rgba(170,180,255,0.9)";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(nx, ny, nr + 10 + Math.sin(pulse * 0.7) * 3, 0, 7);
      ctx.strokeStyle = "rgba(190,198,255,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      for (const l of leads) {
        l.t += l.speed;
        if (l.t >= 1) {
          pings.push({ r: 4, a: 0.55 });
          spawn(l);
          continue;
        }
        // quadratic path from off-screen edge to the node
        const sx = l.side === 1 ? W + 30 : -30;
        const sy = H * l.y0;
        const cx = (sx + nx) / 2;
        const cy = Math.min(sy, ny) - H * l.lift;
        const t = l.t;
        const u = 1 - t;
        let x = u * u * sx + 2 * u * t * cx + t * t * nx;
        let y = u * u * sy + 2 * u * t * cy + t * t * ny;

        // pointer bends nearby travellers
        const dx = x - px;
        const dy = y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = ((16000 - d2) / 16000) * 26;
          const d = Math.sqrt(d2) + 0.01;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }

        const fade = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
        // trail
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, 7);
        ctx.fillStyle = `rgba(214,220,255,${0.75 * fade})`;
        ctx.shadowColor = "rgba(170,180,255,0.8)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // capture pings ripple out from the node
      for (let i = pings.length - 1; i >= 0; i--) {
        const p = pings[i];
        p.r += 1.4;
        p.a -= 0.012;
        if (p.a <= 0) {
          pings.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(nx, ny, p.r, 0, 7);
        ctx.strokeStyle = `rgba(190,198,255,${p.a})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("pointermove", onPointer);
      canvas.parentElement?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="xp-agent-field" aria-hidden="true" />;
}
