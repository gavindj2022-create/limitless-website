"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Anchor targets live on the homepage. Links are always absolute (`/#id`) so a
// tab click works from any route (e.g. /book, /build) — not just the homepage.
// A link may instead carry an explicit `href` to point at a real route (e.g.
// /demos), in which case scroll-spy highlighting does not apply.
const NAV_LINKS: { label: string; id?: string; href?: string }[] = [
  { label: "Bella", id: "bella" },
  { label: "Websites", id: "websites" },
  { label: "Demos", href: "/demos" },
  { label: "Leak audit", href: "/leak-audit" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
];

const SECTION_IDS = ["bella", "websites", "how-it-works", "pricing"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // A sentinel at the top of the document tells us when we've scrolled past it.
  // This replaces a scroll listener that re-rendered the whole nav on every
  // scroll tick; the observer fires twice per crossing instead.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none;";
    document.body.appendChild(sentinel);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(sentinel);

    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <nav className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap nav-inner">
          <Link href="/" className="brand" aria-label="Limitless home">
            <span className="brand-mark">
              {/* The real brushstroke mark, extracted from app/icon.png by
                  scripts/extract-logo.py. Decorative: "Limitless" is right
                  there in text, and the link already has an aria-label. */}
              {/* unoptimized: the source is only 4.9 KB, and letting the
                  optimizer emit a 48px variant made the browser downscale
                  twice, which mushed the fine brush strokes. One clean
                  downscale from the full 319px source is sharper at every DPR. */}
              <Image
                src="/brand/mark-white.webp"
                alt=""
                width={319}
                height={152}
                unoptimized
                aria-hidden="true"
              />
            </span>
            Limitless
          </Link>

          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href ?? `/#${link.id}`}
                className={
                  link.id && activeSection === link.id ? "active" : undefined
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-right">
            <Link
              href="/build"
              className="btn btn-primary"
              style={{ padding: "10px 18px", fontSize: "14px" }}
            >
              Build My Agent
            </Link>
            <button
              className="hamburger"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`drawer${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      >
        <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href ?? `/#${link.id}`}
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
          <Link
            href="/build"
            className="btn btn-primary"
            onClick={() => setDrawerOpen(false)}
          >
            Build My Agent
          </Link>
        </div>
      </div>
    </>
  );
}
