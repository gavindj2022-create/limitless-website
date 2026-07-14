"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import DemoCard, { type Demo } from "@/components/DemoCard";
import RevealOnScroll from "@/components/RevealOnScroll";

const GALLERY_URL = "https://fable25-9qg.pages.dev/";

const demos: Demo[] = [
  {
    name: "CÉLESTE",
    slug: "01-celeste",
    live: "https://fable25-9qg.pages.dev/01-celeste/",
    guide: "https://fable25-9qg.pages.dev/01-celeste/guide/",
    blurb: "Haute perfumery house — AI-filmed silk chapters.",
    tag: "Cinematic film",
  },
  {
    name: "EMBER & OAK",
    slug: "10-ember-oak",
    live: "https://fable25-9qg.pages.dev/10-ember-oak/",
    guide: "https://fable25-9qg.pages.dev/10-ember-oak/guide/",
    blurb: "Wood-fired restaurant — drifting ember particles.",
    tag: "Canvas particles",
  },
  {
    name: "AURUM",
    slug: "19-aurum",
    live: "https://fable25-9qg.pages.dev/19-aurum/",
    guide: "https://fable25-9qg.pages.dev/19-aurum/guide/",
    blurb: "Private wealth firm — art-deco gold and foil.",
    tag: "SVG deco",
  },
  {
    name: "NEON DYNASTY",
    slug: "17-neon-dynasty",
    live: "https://fable25-9qg.pages.dev/17-neon-dynasty/",
    guide: "https://fable25-9qg.pages.dev/17-neon-dynasty/guide/",
    blurb: "Game studio — glitch effects and CRT haze.",
    tag: "Glitch · CRT",
  },
  {
    name: "POLYFORM",
    slug: "13-polyform",
    live: "https://fable25-9qg.pages.dev/13-polyform/",
    guide: "https://fable25-9qg.pages.dev/13-polyform/guide/",
    blurb: "Generative art gallery — four live algorithms.",
    tag: "Generative art",
  },
  {
    name: "ALPENGLOW",
    slug: "24-alpenglow",
    live: "https://fable25-9qg.pages.dev/24-alpenglow/",
    guide: "https://fable25-9qg.pages.dev/24-alpenglow/guide/",
    blurb: "Mountain lodge — a day-to-night parallax scroll.",
    tag: "Scroll · parallax",
  },
];

export default function DemosPage() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <section className="section demos-intro">
          <div className="wrap">
            <RevealOnScroll animation="blurUp">
              <div className="section-head center">
                <span className="eyebrow">Our work</span>
                <h2>Sites our agents built.</h2>
                <p className="lead">
                  These are live, in-browser — not screenshots. Each one was
                  designed and built end-to-end by our agents. Scroll through,
                  then open any of them full-screen.
                </p>
                <div className="demos-intro-cta">
                  <a href="/build" className="btn btn-primary">
                    Build My Agent
                  </a>
                  <a
                    href={GALLERY_URL}
                    className="btn btn-ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See all 25 ↗
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            <div className="demos-grid">
              {demos.map((demo, i) => (
                <RevealOnScroll
                  key={demo.slug}
                  animation="fadeUp"
                  delay={(i % 2) * 0.08}
                >
                  <DemoCard demo={demo} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="section demos-outro">
          <div className="wrap">
            <RevealOnScroll animation="fadeScale">
              <div className="demos-outro-card">
                <span className="eyebrow">Want this for your business?</span>
                <h3>We build the site. You run the business.</h3>
                <p>
                  Same team, same speed — pointed at your brand. Tell us about
                  your business and we&rsquo;ll show you what your site could
                  look like.
                </p>
                <div className="demos-intro-cta">
                  <a href="/build" className="btn btn-primary">
                    Build My Agent
                  </a>
                  <a href="/book?service=website" className="btn btn-ghost">
                    Book a Build
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-bottom">
            <div className="footer-meta">
              <span>&copy; 2026 Limitless. All rights reserved.</span>
            </div>
            <div className="footer-meta">
              <Link href="/">Home</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          <span>LIMITLESS</span>
        </div>
      </footer>
    </>
  );
}
