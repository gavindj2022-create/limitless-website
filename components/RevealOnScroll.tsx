"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Animation = "fadeUp" | "fadeIn" | "fadeScale";

interface RevealOnScrollProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  threshold?: number;
}

const INITIAL_STATES: Record<Animation, gsap.TweenVars> = {
  fadeUp: { opacity: 0, y: 40 },
  fadeIn: { opacity: 0 },
  fadeScale: { opacity: 0, scale: 0.95 },
};

const ANIMATE_TO: Record<Animation, gsap.TweenVars> = {
  fadeUp: { opacity: 1, y: 0 },
  fadeIn: { opacity: 1 },
  fadeScale: { opacity: 1, scale: 1 },
};

export default function RevealOnScroll({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 0.8,
  stagger = 0,
  className,
  threshold = 0.2,
}: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      // Respect prefers-reduced-motion
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        // Show everything immediately, no animation
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Set initial invisible state
      gsap.set(el, INITIAL_STATES[animation]);

      // Convert threshold (0-1) to a ScrollTrigger start string
      // threshold 0.2 => trigger when top of element is at 80% of viewport
      const startPercent = Math.round((1 - threshold) * 100);

      ScrollTrigger.create({
        trigger: el,
        start: `top ${startPercent}%`,
        once: true,
        onEnter: () => {
          const targets = stagger > 0 ? el.children : el;
          gsap.to(targets, {
            ...ANIMATE_TO[animation],
            duration,
            delay,
            stagger: stagger > 0 ? stagger : undefined,
            ease: "power2.out",
          });
        },
      });
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
