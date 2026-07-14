"use client";

import { useEffect, useRef, useState } from "react";

export interface Demo {
  /** Display name, e.g. "CÉLESTE". */
  name: string;
  /** Static demo slug, used for the poster filename. */
  slug: string;
  /** Full live demo URL. */
  live: string;
  /** Short AI-build note URL. */
  guide: string;
  /** One-line industry / description. */
  blurb: string;
  /** Short technique tag chip. */
  tag: string;
}

/**
 * A single demo tile. At rest it shows a static poster screenshot of the real
 * site, so the page looks fully populated and light. On desktop (with motion
 * allowed), hovering or focusing the card mounts a scaled-down live <iframe> of
 * the actual site over the poster — a live, non-interactive preview — and it is
 * unmounted again on mouse-leave/blur. Only one iframe is ever live at a time,
 * which keeps the page fast and avoids overwhelming the renderer. On mobile or
 * under prefers-reduced-motion, only the poster is ever shown.
 */
export default function DemoCard({ demo }: { demo: Demo }) {
  const [allowLive, setAllowLive] = useState(false);
  const [live, setLive] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poster = `/demos/${demo.slug}.jpg`;

  // Live embeds only on wider viewports with motion allowed.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compute = () => setAllowLive(wide.matches && !reduce.matches);
    compute();
    wide.addEventListener("change", compute);
    reduce.addEventListener("change", compute);
    return () => {
      wide.removeEventListener("change", compute);
      reduce.removeEventListener("change", compute);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const goLive = () => {
    if (!allowLive) return;
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setLive(true);
  };

  const goRest = () => {
    // Small delay so a quick pointer cross doesn't thrash the iframe.
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setLive(false);
      setFrameLoaded(false);
    }, 180);
  };

  return (
    <article
      className="demo-card"
      onMouseEnter={goLive}
      onMouseLeave={goRest}
      onFocusCapture={goLive}
      onBlurCapture={goRest}
    >
      <a
        className="demo-frame"
        href={demo.live}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View the ${demo.name} demo site (opens in a new tab)`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="demo-poster"
          src={poster}
          alt={`${demo.name} website preview`}
          data-faded={live && frameLoaded ? "true" : undefined}
        />
        {live && (
          <iframe
            className="demo-iframe"
            src={demo.live}
            title={`${demo.name} live preview`}
            sandbox="allow-scripts allow-same-origin"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => setFrameLoaded(true)}
          />
        )}
        <span className="demo-frame-badge">
          <span className="demo-frame-dot" aria-hidden="true" />
          {allowLive ? "Hover to preview" : "Live site"}
        </span>
        <span className="demo-frame-cta">Open demo ↗</span>
      </a>

      <div className="demo-meta">
        <div className="demo-meta-head">
          <h3 className="demo-name">{demo.name}</h3>
          <span className="demo-tag">{demo.tag}</span>
        </div>
        <p className="demo-blurb">{demo.blurb}</p>
        <div className="demo-links">
          <a href={demo.live} target="_blank" rel="noopener noreferrer">
            Open demo ↗
          </a>
          <a href={demo.guide} target="_blank" rel="noopener noreferrer">
            Built with AI ↗
          </a>
        </div>
      </div>
    </article>
  );
}
