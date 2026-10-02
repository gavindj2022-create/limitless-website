"use client";

import { useEffect, useRef } from "react";

export default function CountUpValue({
  end,
  prefix = "",
  suffix = "",
}: {
  end: number;
  prefix?: string;
  suffix?: string;
}) {
  const valueRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const value = valueRef.current;
    if (!value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const duration = 1200;

      const paint = (now: number) => {
        const elapsed = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        value.textContent = `${prefix}${Math.round(end * eased).toLocaleString()}${suffix}`;
        if (elapsed < 1) frame = requestAnimationFrame(paint);
      };

      value.textContent = `${prefix}0${suffix}`;
      frame = requestAnimationFrame(paint);
      observer.disconnect();
    }, { threshold: 0.45 });

    observer.observe(value);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, prefix, suffix]);

  return <strong ref={valueRef}>{prefix}{end.toLocaleString()}{suffix}</strong>;
}
