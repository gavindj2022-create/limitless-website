import Link from "next/link";
import Nav from "@/components/Nav";
import Reveals from "@/components/Reveals";
import { revealDelay } from "@/lib/reveal";
import DemoCard, { type Demo } from "@/components/DemoCard";

const GALLERY_URL = "https://limitless-demo-websites.pages.dev/";

function demoUrl(slug: string, section = "") {
  return `${GALLERY_URL}${slug}/${section}`;
}

const demos: Demo[] = [
  {
    name: "CÉLESTE",
    slug: "01-celeste",
    live: demoUrl("01-celeste"),
    guide: demoUrl("01-celeste", "guide/"),
    blurb: "Haute perfumery house — AI-filmed silk chapters.",
    tag: "Cinematic film",
  },
  {
    name: "EMBER & OAK",
    slug: "10-ember-oak",
    live: demoUrl("10-ember-oak"),
    guide: demoUrl("10-ember-oak", "guide/"),
    blurb: "Wood-fired restaurant — drifting ember particles.",
    tag: "Canvas particles",
  },
  {
    name: "AURUM",
    slug: "19-aurum",
    live: demoUrl("19-aurum"),
    guide: demoUrl("19-aurum", "guide/"),
    blurb: "Private wealth firm — art-deco gold and foil.",
    tag: "SVG deco",
  },
  {
    name: "NEON DYNASTY",
    slug: "17-neon-dynasty",
    live: demoUrl("17-neon-dynasty"),
    guide: demoUrl("17-neon-dynasty", "guide/"),
    blurb: "Game studio — glitch effects and CRT haze.",
    tag: "Glitch · CRT",
  },
  {
    name: "POLYFORM",
    slug: "13-polyform",
    live: demoUrl("13-polyform"),
    guide: demoUrl("13-polyform", "guide/"),
    blurb: "Generative art gallery — four live algorithms.",
    tag: "Generative art",
  },
  {
    name: "ALPENGLOW",
    slug: "24-alpenglow",
    live: demoUrl("24-alpenglow"),
    guide: demoUrl("24-alpenglow", "guide/"),
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
            <div data-reveal>
              <div className="section-head center">
                <span className="eyebrow">Our work</span>
                <h2>Limitless Demo Websites.</h2>
                <p className="lead">
                  These are live, in-browser — not screenshots. Each demo was
                  created with AI by Limitless, then reviewed and refined for
                  layout, copy, motion, and mobile.
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
                    View all 25 ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="demos-grid">
              {demos.map((demo, i) => (
                <div data-reveal key={demo.slug} style={revealDelay((i % 2) * 0.08)}>
                  <DemoCard demo={demo} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section demos-outro">
          <div className="wrap">
            <div data-reveal="scale">
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
            </div>
          </div>
        </section>
        <Reveals />
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
