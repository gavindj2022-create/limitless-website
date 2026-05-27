"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessLine() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;

      const path = svg.querySelector("path");
      if (!path) return;

      // Respect prefers-reduced-motion
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) return;

      // Get the total length of the dashed path
      const totalLength = path.getTotalLength();

      // Set up the stroke-dashoffset for draw-on effect
      // We keep the original dasharray pattern but overlay a large offset
      gsap.set(path, {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: svg,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: svgRef, dependencies: [] }
  );

  return (
    <div className="process-line">
      <svg ref={svgRef} viewBox="0 0 800 20" preserveAspectRatio="none">
        <path d="M0 10 H800" />
      </svg>
    </div>
  );
}
