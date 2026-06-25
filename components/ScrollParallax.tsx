"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ScrollParallaxProps extends ComponentPropsWithoutRef<"div"> {
  /** How far the element drifts as it scrolls through the viewport, in px. */
  distance?: number;
}

/**
 * Wraps content and gently drifts it on the Y axis as the page scrolls,
 * scrubbed to the scroll position. Adds a subtle, premium sense of depth
 * to hero visuals. No-ops for prefers-reduced-motion users.
 */
export default function ScrollParallax({
  children,
  distance = 60,
  className,
  ...rest
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      gsap.fromTo(
        el,
        { y: distance * 0.5 },
        {
          y: -distance * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [] }
  );

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
