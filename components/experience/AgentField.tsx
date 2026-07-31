"use client";

import { useEffect, useRef } from "react";

/** ~30fps. The motion is slow and organic, so 60fps buys nothing visible. */
const FRAME_MS = 33;
/** Desktop with a real pointer only: this is a full-viewport canvas. */
const ELIGIBLE = "(min-width: 760px) and (pointer: fine)";

/**
 * Pre-render a radial-gradient glow once, then blit it with drawImage.
 * Canvas shadowBlur is a per-draw blur pass; this was costing 27 blurred
 * draws every frame. A cached sprite is roughly 20-50x cheaper.
 */
function glowSprite(radius: number, rgb: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = radius * 2;
  const g = c.getContext("2d");
  if (g) {
    const grd = g.createRadialGradient(radius, radius, 0, radius, radius, radius);
    grd.addColorStop(0, `rgba(${rgb},1)`);
    grd.addColorStop(0.4, `rgba(${rgb},0.35)`);
    grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, radius * 2, radius * 2);
  }
  return c;
}

/**
 * The living layer over the hero film: leads (points of light) flow along
 * curved paths into a central agent node and are captured with a soft ping.
 * The pointer gently bends nearby paths.
 *
 * Deliberately cheap: the animation loop only runs while the canvas is on
 * screen and the tab is visible, glows are cached sprites rather than
 * shadowBlur, it is capped to ~30fps, and it does not run at all on phones
 * or for prefers-reduced-motion.
 */
export default function AgentField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    if (!window.matchMedia(ELIGIBLE).matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { desynchronized: true });
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let rect = canvas.getBoundingClientRect();

    const fit = () => {
      rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      // Draw in CSS pixels; the transform handles the device ratio.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    // Cached glows, sized to the largest radius each is drawn at.
    const leadGlow = glowSprite(8, "214,220,255");
    const nodeGlow = glowSprite(28, "170,180,255");

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

    const N = 18;
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
    // rect is cached by fit(); no layout read per pointer event.
    const onPointer = (e: PointerEvent) => {
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
    };
    const onLeave = () => {
      px = -1e4;
      py = -1e4;
    };
    const host = canvas.parentElement;
    host?.addEventListener("pointermove", onPointer);
    host?.addEventListener("pointerleave", onLeave);
    // The canvas moves with the page, so its rect goes stale on scroll.
    const onScroll = () => {
      rect = canvas.getBoundingClientRect();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let pulse = 0;

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;

      ctx.clearRect(0, 0, W, H);
      const { x: nx, y: ny } = node();
      pulse += 0.03 * (FRAME_MS / 16.7); // keep the old cadence at half the frames

      // agent node: a quiet breathing ring
      const nr = 7 + Math.sin(pulse) * 1.5;
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(nodeGlow, nx - 28, ny - 28);
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.arc(nx, ny, nr, 0, 7);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nx, ny, nr + 10 + Math.sin(pulse * 0.7) * 3, 0, 7);
      ctx.strokeStyle = "rgba(190,198,255,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      for (const l of leads) {
        l.t += l.speed * (FRAME_MS / 16.7);
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
        // trail: cached glow, then a solid core
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.75 * fade;
        ctx.drawImage(leadGlow, x - 8, y - 8);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, 7);
        ctx.fillStyle = `rgba(214,220,255,${0.75 * fade})`;
        ctx.fill();
      }

      // capture pings ripple out from the node
      for (let i = pings.length - 1; i >= 0; i--) {
        const p = pings[i];
        p.r += 1.4 * (FRAME_MS / 16.7);
        p.a -= 0.012 * (FRAME_MS / 16.7);
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
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Only animate while the hero is actually on screen. Without this the
    // loop kept running for the entire page, all the way to the footer.
    let onScreen = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onScreen = entry.isIntersecting;
          if (onScreen) start();
          else stop();
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      host?.removeEventListener("pointermove", onPointer);
      host?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="xp-agent-field" aria-hidden="true" />;
}
