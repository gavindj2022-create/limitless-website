"use client";

import { useEffect } from "react";

/**
 * One observer for every `[data-reveal]` element on the page, replacing the
 * 26 individual GSAP ScrollTrigger instances this site used to create.
 *
 * The no-flash contract: CSS leaves `[data-reveal]` fully visible by default,
 * and the hidden-then-animate state only applies once this component adds
 * `.reveal-ready` to <html>. Anything already inside the first viewport is
 * revealed in that same paint, so content never appears and then blanks out.
 *
 * Mount once per page, anywhere.
 */
export default function Reveals() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Arm the CSS, then immediately settle anything already on screen.
    document.documentElement.classList.add("reveal-ready");
    const viewportH = window.innerHeight;
    for (const el of els) {
      if (el.getBoundingClientRect().top < viewportH * 0.9) {
        el.classList.add("in");
        el.removeAttribute("data-reveal");
      }
    }

    const pending = els.filter((el) => el.hasAttribute("data-reveal"));
    if (!pending.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
