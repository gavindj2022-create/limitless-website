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
    const mq = window.matchMedia("(max-width: 768px)");
    let teardown: (() => void) | null = null;

    // Observe a hero-height sentinel instead of listening to scroll, and only
    // on the small screens this bar is visible on (CSS hides it above 768px).
    const attach = () => {
      if (teardown) return;
      const sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText =
        "position:absolute;top:0;left:0;width:1px;height:90vh;pointer-events:none;";
      document.body.appendChild(sentinel);

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) setShown(!entry.isIntersecting);
        },
        { threshold: 0 }
      );
      io.observe(sentinel);

      teardown = () => {
        io.disconnect();
        sentinel.remove();
        teardown = null;
      };
    };

    const sync = () => {
      if (mq.matches) attach();
      else {
        teardown?.();
        setShown(false);
      }
    };
    sync();
    mq.addEventListener("change", sync);

    return () => {
      document.body.classList.remove("sticky-cta-active");
      mq.removeEventListener("change", sync);
      teardown?.();
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
