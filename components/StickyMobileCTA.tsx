"use client";

import { useEffect, useState } from "react";

/**
 * Bottom-fixed "Build My Agent" bar for small screens only.
 * Appears once the user scrolls past the full-viewport hero. Adds a body
 * class so the page can reserve matching space and the bar never covers
 * content. CSS handles the mobile-only visibility and reduced-motion
 * behaviour.
 */
export default function StickyMobileCTA() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    document.body.classList.add("sticky-cta-active");

    const onScroll = () => {
      setShown(window.scrollY > window.innerHeight * 0.9);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      document.body.classList.remove("sticky-cta-active");
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={`sticky-cta${shown ? " on" : ""}`} aria-hidden={!shown}>
      <a href="/build" className="btn btn-world sticky-cta-btn" tabIndex={shown ? 0 : -1}>
        Build My Agent
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
