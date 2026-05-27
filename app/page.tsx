"use client";

import Nav from "@/components/Nav";
import HeroDemoPanel from "@/components/HeroDemoPanel";
import ServiceCard from "@/components/ServiceCard";
import PricingCard from "@/components/PricingCard";
import TeamCard from "@/components/TeamCard";
import FAQSection from "@/components/FAQSection";
import ExplainerSection from "@/components/ExplainerSection";
import RevealOnScroll from "@/components/RevealOnScroll";
import ProcessLine from "@/components/ProcessLine";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>

      {/* ───── NAV ───── */}
      <Nav />

      <main id="main">
        {/* ───── HERO ───── */}
        <section className="hero">
          <div className="hero-bg">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="hero-grid" />
          </div>
          <div className="wrap hero-split">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="dot" />
                Powered by AI — built for small business
              </div>
              <h1>
                AI that runs your{" "}
                <span className="serif-em">back office</span>
              </h1>
              <p className="sub">
                Olivia sends invoices, answers calls, books appointments, and
                follows up with customers — so you can focus on the work that
                matters. Starting at $29/month.
              </p>
              <div className="ctas">
                <a href="#pricing" className="btn btn-primary">
                  Start Free Trial
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M1 7H13M13 7L7 1M13 7L7 13"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a href="#how-it-works" className="btn btn-ghost">
                  See How It Works
                </a>
              </div>
            </div>
            <HeroDemoPanel />
          </div>
        </section>

        {/* ───── LOGO / TRUST STRIP ───── */}
        <RevealOnScroll animation="fadeIn">
          <section className="logo-strip">
            <div className="wrap logo-strip-inner">
              {[
                "QuickBooks",
                "Google Workspace",
                "HubSpot",
                "PayPal",
                "Square",
                "Canva",
                "DocuSign",
              ].map((name) => (
                <span className="logo-strip-item" key={name}>
                  {name}
                </span>
              ))}
            </div>
          </section>
        </RevealOnScroll>

        {/* ───── HOW IT WORKS ───── */}
        <section className="section" id="how-it-works">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">How It Works</span>
                <h2>
                  Up and running in{" "}
                  <span className="serif-em">minutes</span>
                </h2>
                <p className="lead">
                  No coding, no complicated setup. Connect your tools and let
                  Olivia handle the rest.
                </p>
              </div>
            </RevealOnScroll>
            <div className="process">
              <ProcessLine />
              <div className="process-track">
                <RevealOnScroll animation="fadeUp" delay={0}>
                  <div className="step-card">
                    <div className="step-num">1</div>
                    <h3>Sign Up</h3>
                    <p>
                      Create your account in 30 seconds. No credit card required
                      for the 14-day free trial. Pick the plan that fits your
                      business.
                    </p>
                  </div>
                </RevealOnScroll>
                <RevealOnScroll animation="fadeUp" delay={0.15}>
                  <div className="step-card">
                    <div className="step-num">2</div>
                    <h3>Connect Your Tools</h3>
                    <p>
                      Link Google Workspace, QuickBooks, Square, or any of our
                      supported tools. Our setup wizard handles the technical
                      stuff.
                    </p>
                  </div>
                </RevealOnScroll>
                <RevealOnScroll animation="fadeUp" delay={0.3}>
                  <div className="step-card">
                    <div className="step-num">3</div>
                    <h3>Olivia Handles the Rest</h3>
                    <p>
                      Your AI employee starts working immediately — sending
                      invoices, confirming appointments, following up with
                      customers, and more.
                    </p>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ───── SERVICES ───── */}
        <section className="section" id="services">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head">
                <span className="eyebrow">Services</span>
                <h2>
                  Everything your business needs,{" "}
                  <span className="serif-em">automated</span>
                </h2>
                <p className="lead">
                  From answering phones to sending invoices — our AI handles the
                  tasks that eat up your day.
                </p>
              </div>
            </RevealOnScroll>
            <div className="services-grid">
              <RevealOnScroll animation="fadeUp" delay={0}>
                <ServiceCard
                  eyebrow="AI ASSISTANT"
                  title="Olivia"
                  description="Your AI employee handles invoices, appointment reminders, follow-ups, and review requests — all on autopilot. She learns your business patterns and gets smarter over time."
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="24"
                        height="24"
                        rx="6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 16h8M12 12h8M12 20h5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                  features={[
                    "Invoice reminders & follow-ups",
                    "Appointment confirmations",
                    "Review request campaigns",
                    "Included in all plans",
                  ]}
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.1}>
                <ServiceCard
                  eyebrow="AI RECEPTIONIST"
                  title="Bella"
                  description="24/7 phone answering with a natural voice. Bella books appointments, remembers repeat callers, and follows up on missed calls — so you never lose a customer to voicemail."
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M8 6a2 2 0 012-2h12a2 2 0 012 2v20a2 2 0 01-2 2H10a2 2 0 01-2-2V6z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="16"
                        cy="22"
                        r="1.5"
                        fill="currentColor"
                      />
                      <path
                        d="M12 4v2M20 4v2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                  features={[
                    "24/7 natural voice answering",
                    "Appointment booking & calendar sync",
                    "Caller memory & missed-call texts",
                    "Growth & Full Ops plans",
                  ]}
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.2}>
                <ServiceCard
                  eyebrow="WEB PRESENCE"
                  title="Website & Web Presence"
                  description="A full custom website with dark luxury design, mobile-responsive layout, AI chat widget, and ongoing maintenance — all included in your plan. No $5,000 agency fees."
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <rect
                        x="3"
                        y="6"
                        width="26"
                        height="18"
                        rx="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3 11h26"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle cx="7" cy="8.5" r="1" fill="currentColor" />
                      <circle cx="10" cy="8.5" r="1" fill="currentColor" />
                      <circle cx="13" cy="8.5" r="1" fill="currentColor" />
                      <path
                        d="M10 27h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                  features={[
                    "Custom dark luxury website",
                    "Mobile-responsive & SEO-optimized",
                    "AI chat widget embedded",
                    "Full Ops plan only",
                  ]}
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.3}>
                <ServiceCard
                  eyebrow="INTELLIGENCE"
                  title="Dashboards & BI"
                  description="Automated weekly business intelligence reports with revenue trends, customer insights, cash flow projections, and custom KPI tracking — delivered straight to your inbox."
                  icon={
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M4 24V14M10 24V10M16 24V16M22 24V8M28 24V12"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                  features={[
                    "Automated weekly BI reports",
                    "Revenue & cash flow projections",
                    "Custom KPI dashboard",
                    "Full Ops plan only",
                  ]}
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ───── EXPLAINER — OLIVIA HUB ───── */}
        <section className="section" id="olivia">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">The Olivia System</span>
                <h2>
                  One AI, all your{" "}
                  <span className="serif-em">tools</span>
                </h2>
                <p className="lead">
                  Olivia sits at the center of your business — connecting your
                  tools, learning your patterns, and handling the work you
                  shouldn&apos;t have to do yourself.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll animation="fadeScale">
              <ExplainerSection />
            </RevealOnScroll>
          </div>
        </section>

        {/* ───── PRICING ───── */}
        <section className="section" id="pricing">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">Pricing</span>
                <h2>
                  Simple pricing,{" "}
                  <span className="serif-em">real value</span>
                </h2>
                <p className="lead">
                  Start with the basics and upgrade as you grow. Every plan
                  includes a 14-day free trial — no credit card required.
                </p>
              </div>
            </RevealOnScroll>
            <div className="pricing-grid">
              <RevealOnScroll animation="fadeUp" delay={0}>
                <PricingCard
                  tier="Starter"
                  price="$29"
                  period="/mo"
                  description="Perfect for solopreneurs who want to automate the basics and save a few hours every week."
                  features={[
                    "3 pre-built workflows",
                    "3 tool connections",
                    "Olivia AI assistant (email-based)",
                    "Self-serve onboarding",
                    "Email support (48hr response)",
                    "14-day free trial",
                  ]}
                  cta="Start Free Trial"
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.15}>
                <PricingCard
                  tier="Growth"
                  price="$199"
                  period="/mo"
                  description="For established businesses ready to stop losing customers after hours and automate everything."
                  features={[
                    "All 15 AI workflows",
                    "All 7 tool connections",
                    "Bella AI Receptionist — 24/7 phone",
                    "Olivia AI assistant (email + chat)",
                    "1 custom workflow per month",
                    "Monthly strategy call",
                    "Priority support (24hr)",
                  ]}
                  cta="Start Free Trial"
                  featured
                  badge="RECOMMENDED"
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.3}>
                <PricingCard
                  tier="Full Ops"
                  price="$499"
                  period="/mo"
                  description="Everything we offer. Your entire back office — phones, workflows, website, dashboards — handled."
                  features={[
                    "Unlimited workflows + custom builds",
                    "Unlimited tool connections",
                    "Full website build included",
                    "Bella + Olivia full AI suite",
                    "BI dashboards & weekly reports",
                    "Dedicated Slack channel",
                    "Quarterly business review",
                  ]}
                  cta="Start Free Trial"
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ───── TESTIMONIALS / TRUST ───── */}
        <section className="section" id="testimonials">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">Results</span>
                <h2>
                  Businesses that run on{" "}
                  <span className="serif-em">Limitless</span>
                </h2>
              </div>
            </RevealOnScroll>
            <div className="testimonial-grid">
              <RevealOnScroll animation="fadeUp" delay={0}>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    &ldquo;We were missing 40% of our after-hours calls. Bella
                    picks up every single one now — and books the appointment
                    before we even open. Revenue is up 22% in the first
                    month.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">BT</div>
                    <div>
                      <div className="testimonial-name">Becky Thompson</div>
                      <div className="testimonial-role">
                        Owner, Studio B Hair Design — Peoria, IL
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.1}>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    &ldquo;I used to spend Sunday nights sending invoices and
                    chasing late payments. Olivia handles all of it now. I
                    haven&apos;t touched an invoice in 6 weeks.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">MR</div>
                    <div>
                      <div className="testimonial-name">Marcus Reyes</div>
                      <div className="testimonial-role">
                        Owner, Reyes Plumbing — Phoenix, AZ
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.2}>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    &ldquo;The weekly BI reports alone are worth the price. I
                    can see exactly which services are driving revenue and where
                    I&apos;m losing customers. Game-changer for a gym my
                    size.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">JW</div>
                    <div>
                      <div className="testimonial-name">Jordan Williams</div>
                      <div className="testimonial-role">
                        Owner, Core Training Center — Galena, IL
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.3}>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    &ldquo;We went from juggling 4 different apps to having
                    everything in one place. Setup took 10 minutes. My only
                    regret is not doing it sooner.&rdquo;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">LD</div>
                    <div>
                      <div className="testimonial-name">Lisa Dominguez</div>
                      <div className="testimonial-role">
                        Owner, Casa Bonita Restaurant — Tucson, AZ
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ───── ABOUT / TEAM ───── */}
        <section className="section" id="about">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">About</span>
                <h2>
                  Meet the team behind{" "}
                  <span className="serif-em">Limitless</span>
                </h2>
                <p className="lead">
                  We&apos;re DAWGS AGI — a small team that believes AI should
                  work for local businesses, not just big tech. We build the
                  tools that let you compete with companies ten times your size.
                </p>
              </div>
            </RevealOnScroll>
            <div className="team-grid" style={{ margin: "0 auto" }}>
              <RevealOnScroll animation="fadeUp" delay={0}>
                <TeamCard
                  name="Gavin Johnson"
                  role="Founder & CEO"
                  bio="Entrepreneur, AI builder, and real estate investor. Gavin started DAWGS AGI to bring enterprise-grade AI to the businesses that need it most — local shops, salons, restaurants, and trades."
                  initials="GJ"
                  gradient={["#667eea", "#764ba2"]}
                  tags={["AI Strategy", "Business Operations", "Product"]}
                  location="Illinois, USA"
                  linkedin="https://linkedin.com/in/gavin-johnson"
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.15}>
                <TeamCard
                  name="Fabian"
                  role="Head of Customer Relations"
                  bio="Fabian ensures every client gets white-glove onboarding and ongoing support. He runs monthly optimization calls, handles custom workflow requests, and makes sure your AI is always working at peak performance."
                  initials="F"
                  gradient={["#f093fb", "#f5576c"]}
                  tags={["Customer Success", "Onboarding", "Support"]}
                  location="Illinois, USA"
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ───── FAQ ───── */}
        <section className="section" id="faq">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">FAQ</span>
                <h2>
                  Questions?{" "}
                  <span className="serif-em">Answers.</span>
                </h2>
              </div>
            </RevealOnScroll>
            <RevealOnScroll animation="fadeUp" delay={0.1}>
              <FAQSection />
            </RevealOnScroll>
          </div>
        </section>

        {/* ───── FOOTER CTA ───── */}
        <section className="section">
          <div className="wrap">
            <RevealOnScroll animation="fadeScale">
              <div className="cta-banner">
                <span className="eyebrow">Ready?</span>
                <h2>
                  Stop losing customers to{" "}
                  <span className="serif-em">voicemail.</span>
                </h2>
                <p className="lead">
                  Start your 14-day free trial today. No credit card required. See
                  what Olivia can do for your business in the first week.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href="#pricing" className="btn btn-primary">
                    Start Free Trial
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M1 7H13M13 7L7 1M13 7L7 13"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <a href="#how-it-works" className="btn btn-ghost">
                    See How It Works
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      {/* ───── FOOTER ───── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-col footer-about">
              <span
                className="brand"
                style={{ marginBottom: 8, display: "inline-flex" }}
              >
                <span className="brand-mark">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Limitless
              </span>
              <p>
                AI-powered automation for small businesses. Built by DAWGS AGI.
              </p>
            </div>
            <div className="footer-col">
              <h5>Product</h5>
              <ul>
                <li>
                  <a href="#how-it-works">How It Works</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <ul>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="mailto:gavindj2022@gmail.com">Contact</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Resources</h5>
              <ul>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Case Studies</a>
                </li>
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Status</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-meta">
              <span>&copy; 2026 DAWGS AGI. All rights reserved.</span>
            </div>
            <div className="footer-socials">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
