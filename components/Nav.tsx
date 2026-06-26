"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Bella", href: "#bella" },
  { label: "Websites", href: "#websites" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const SECTION_IDS = ["bella", "websites", "how-it-works", "pricing"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          <a href="#" className="brand" aria-label="Limitless home">
            <span className="brand-mark">
              <span className="infinity-mark" aria-hidden="true">
                &infin;
              </span>
            </span>
            Limitless
          </a>

          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={
                  activeSection === link.href.slice(1) ? "active" : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-right">
            <a
              href="/build"
              className="btn btn-primary"
              style={{ padding: "10px 18px", fontSize: "14px" }}
            >
              Build My AI
            </a>
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
            <a
              key={link.href}
              href={link.href}
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
            </a>
          ))}
          <a
            href="/build"
            className="btn btn-primary"
            onClick={() => setDrawerOpen(false)}
          >
            Build My AI
          </a>
        </div>
      </div>
    </>
  );
}
