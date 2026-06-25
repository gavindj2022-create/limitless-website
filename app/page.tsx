"use client";

import Nav from "@/components/Nav";
import HeroDemoPanel from "@/components/HeroDemoPanel";
import PricingCard from "@/components/PricingCard";
import TeamCard from "@/components/TeamCard";
import FAQSection from "@/components/FAQSection";
import RevealOnScroll from "@/components/RevealOnScroll";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollParallax from "@/components/ScrollParallax";

const flowSteps = [
  {
    label: "Step 1",
    title: "Book a call",
    copy: "A quick, no-pressure call to understand your business and where time and money quietly leak out.",
    visual: "ring",
  },
  {
    label: "Step 2",
    title: "We find the gaps",
    copy: "We look at how leads come in, how calls get handled, and what slows you down — then pinpoint exactly what AI can fix.",
    visual: "chat",
  },
  {
    label: "Step 3",
    title: "We build it for you",
    copy: "We build the full system — receptionist, website, automations — done-for-you, not a DIY toolkit you have to figure out.",
    visual: "summary",
  },
  {
    label: "Step 4",
    title: "You run leaner",
    copy: "You go live with AI handling the busywork, and we keep it tuned as your business grows.",
    visual: "voice",
  },
];

const addOns = [
  {
    title: "Olivia follow-ups",
    copy: "Invoices, reminders, review requests, and customer follow-up when you are ready for more automation.",
  },
  {
    title: "Simple dashboards",
    copy: "Weekly snapshots of calls, bookings, leads, and the work that needs attention.",
  },
  {
    title: "Custom workflows",
    copy: "Lightweight automations for the tools you already use, built around your day-to-day process.",
  },
];

export default function Home() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>

      <ScrollProgress />

      <Nav />

      <main id="main">
        <section className="hero world-hero">
          <ScrollParallax distance={140} className="hero-world" aria-hidden="true">
            <span className="world-glow" />
            <span className="world-sphere" />
            <span className="world-ring" />
          </ScrollParallax>

          <div className="wrap">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="dot" />
                AI Automation Company
              </div>
              <h1>
                Less busywork.
                <br />
                Limitless growth.
              </h1>
              <p className="sub">
                We hand the repetitive stuff to AI so you can spend your time on
                the work that actually grows the business.
              </p>
              <div className="ctas">
                <a href="/book?service=system" className="btn btn-world">
                  Build My AI
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
              <a href="#how-it-works" className="hero-scroll-hint">
                See how it works
              </a>
            </div>
          </div>
        </section>

        <section className="mission-band">
          <div className="wrap">
            <RevealOnScroll animation="blurUp">
              <p className="mission-eyebrow">Our mission</p>
              <p className="mission-statement">
                We make AI <em>practical</em> for everyday businesses — so the
                phone gets answered, the leads get captured, and growth is never
                capped by hours in the day.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        <section className="demo-showcase">
          <div className="wrap">
            <RevealOnScroll animation="fadeScale">
              <HeroDemoPanel />
            </RevealOnScroll>
          </div>
        </section>

        <section className="section" id="services">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">Two Clear Offers</span>
                <h2>
                  Front desk and web presence, built to work together.
                </h2>
                <p className="lead">
                  The first version stays simple: make the business easier to
                  reach, easier to understand, and easier to book.
                </p>
              </div>
            </RevealOnScroll>

            <div className="offer-pillars">
              <RevealOnScroll animation="fadeUp" delay={0}>
                <article className="pillar-card bella-card" id="bella">
                  <div className="pillar-visual phone-visual" aria-hidden="true">
                    <span className="live-dot" />
                    <span className="call-ring call-ring-one" />
                    <span className="call-ring call-ring-two" />
                    <div className="mini-phone">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mini-calendar">
                      <strong>2:00</strong>
                      <small>Booked</small>
                    </div>
                  </div>
                  <span className="svc-eyebrow">AI Receptionist</span>
                  <h3>Bella answers when you cannot.</h3>
                  <p>
                    Natural phone answering for missed calls, appointment
                    booking, lead capture, simple questions, and follow-up
                    messages.
                  </p>
                  <ul className="clean-list">
                    <li>Answers calls day or night</li>
                    <li>Books appointments and sends confirmations</li>
                    <li>Captures leads instead of losing them to voicemail</li>
                    <li>Sends you a short summary after every call</li>
                  </ul>
                </article>
              </RevealOnScroll>

              <RevealOnScroll animation="fadeUp" delay={0.12}>
                <article className="pillar-card website-card" id="websites">
                  <div className="pillar-visual website-visual" aria-hidden="true">
                    <span className="site-spark site-spark-one" />
                    <span className="site-spark site-spark-two" />
                    <div className="mini-browser">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mini-page">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="site-cursor" />
                    <div className="mini-chat">
                      <strong>AI</strong>
                      <small>Ready</small>
                    </div>
                  </div>
                  <span className="svc-eyebrow">AI-powered web presence</span>
                  <h3>A clean website that starts conversations.</h3>
                  <p>
                    Fast, polished websites for local businesses with mobile
                    layouts, AI chatbots, lead forms, and a brand that looks
                    like it belongs.
                  </p>
                  <ul className="clean-list">
                    <li>Simple modern website built quickly</li>
                    <li>AI chatbot embedded into the experience</li>
                    <li>Contact forms and booking paths that are easy to use</li>
                    <li>Ongoing updates without the agency headache</li>
                  </ul>
                </article>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section className="section visual-section" id="how-it-works">
          <div className="wrap">
            <RevealOnScroll animation="blurUp">
              <div className="section-head center">
                <span className="eyebrow">How It Works</span>
                <h2>From first call to fully built — done for you.</h2>
                <p className="lead">
                  You book a call, we find what is slowing your business down,
                  and we build the AI that fixes it. No DIY, no busywork.
                </p>
              </div>
            </RevealOnScroll>

            <div className="visual-flow">
              {flowSteps.map((step, index) => (
                <RevealOnScroll animation="fadeScale" delay={index * 0.08} key={step.label}>
                  <div className={`flow-card flow-${step.visual}`}>
                    <span className="flow-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flow-picture" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <small>{step.label}</small>
                    <h3>{step.title}</h3>
                    <p className="flow-copy">{step.copy}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="section addon-section">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head">
                <span className="eyebrow">Add-on automation suite</span>
                <h2>More help when the basics are humming.</h2>
                <p className="lead">
                  Olivia and the extra systems stay on the back burner until a
                  business is ready for more. Then we add only what saves time.
                </p>
              </div>
            </RevealOnScroll>
            <div className="addon-grid">
              {addOns.map((item, index) => (
                <RevealOnScroll animation="fadeUp" delay={index * 0.08} key={item.title}>
                  <article className="addon-tile">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="pricing">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">Pricing</span>
                <h2>Start with the part your business needs most.</h2>
                <p className="lead">
                  Keep it focused: website, receptionist, or the full front
                  door system with the add-ons connected.
                </p>
              </div>
            </RevealOnScroll>
            <div className="pricing-grid">
              <RevealOnScroll animation="fadeUp" delay={0}>
                <PricingCard
                  tier="Website Starter"
                  price="$29"
                  period="/mo"
                  description="A clean online presence for businesses that need to look real, capture leads, and stay easy to contact."
                  features={[
                    "Simple website foundation",
                    "Mobile-first layout",
                    "Lead form or chat starter",
                    "Basic updates and support",
                  ]}
                  cta="Build My Website"
                  plan="starter"
                  href="/book?service=website"
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.15}>
                <PricingCard
                  tier="Bella Receptionist"
                  price="$199"
                  period="/mo"
                  description="AI phone answering for businesses that miss calls, lose leads, or need help booking appointments."
                  features={[
                    "24/7 phone answering",
                    "Booking and confirmation flow",
                    "Missed-call follow-up",
                    "Simple call summaries",
                  ]}
                  cta="Book With Bella"
                  featured
                  badge="MAIN OFFER"
                  plan="growth"
                  href="/book?service=bella"
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.3}>
                <PricingCard
                  tier="Full Presence"
                  price="$499"
                  period="/mo"
                  description="Website, Bella, AI chat, lead capture, and the practical automations that keep the front office moving."
                  features={[
                    "Website build included",
                    "Bella and AI chatbot",
                    "Olivia follow-ups",
                    "Dashboards and custom workflows",
                  ]}
                  cta="Build The System"
                  plan="full_ops"
                  href="/book?service=system"
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section className="section" id="testimonials">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">What This Fixes</span>
                <h2>Fewer missed chances. Cleaner first impressions.</h2>
              </div>
            </RevealOnScroll>
            <div className="testimonial-grid">
              <RevealOnScroll animation="fadeUp" delay={0}>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    &quot;We stopped sending new customers to voicemail. Bella
                    answers, books, and sends the summary before I even check my
                    phone.&quot;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">BT</div>
                    <div>
                      <div className="testimonial-name">Becky Thompson</div>
                      <div className="testimonial-role">
                        Salon owner - Peoria, IL
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.1}>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    &quot;The website finally explains what we do without feeling
                    busy. People can ask questions, request a quote, and move on
                    fast.&quot;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">MR</div>
                    <div>
                      <div className="testimonial-name">Marcus Reyes</div>
                      <div className="testimonial-role">
                        Home service owner - Phoenix, AZ
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.2}>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    &quot;The AI chat catches the easy questions and the form sends
                    clean leads. It feels like a front desk, not a contact page.&quot;
                  </p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">JW</div>
                    <div>
                      <div className="testimonial-name">Jordan Williams</div>
                      <div className="testimonial-role">
                        Gym owner - Galena, IL
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">About</span>
                <h2>Built for businesses that need help, not hype.</h2>
                <p className="lead">
                  Limitless brings practical AI to local businesses: answer the
                  phone, make the website clearer, capture the lead, and keep
                  the owner informed.
                </p>
              </div>
            </RevealOnScroll>
            <div className="team-grid" style={{ margin: "0 auto" }}>
              <RevealOnScroll animation="fadeUp" delay={0}>
                <TeamCard
                  name="Gavin Johnson"
                  role="Founder"
                  bio="AI builder and business operator focused on simple systems that help local companies look sharper, answer faster, and waste less time."
                  initials="GJ"
                  gradient={["#C2997A", "#8A6A4F"]}
                  tags={["AI Receptionists", "Web Design", "Automation"]}
                  location="Illinois, USA"
                  linkedin="https://www.linkedin.com/in/gavin-johnson-lkdn/"
                />
              </RevealOnScroll>
              <RevealOnScroll animation="fadeUp" delay={0.15}>
                <TeamCard
                  name="Fabian"
                  role="Customer Relations"
                  bio="Fabian helps clients get onboarded, keeps communication simple, and makes sure the system stays useful after launch."
                  initials="F"
                  gradient={["#7A93C2", "#4F648A"]}
                  tags={["Onboarding", "Support", "Client Care"]}
                  location="Illinois, USA"
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="wrap">
            <RevealOnScroll animation="fadeUp">
              <div className="section-head center">
                <span className="eyebrow">FAQ</span>
                <h2>Plain answers.</h2>
              </div>
            </RevealOnScroll>
            <RevealOnScroll animation="fadeUp" delay={0.1}>
              <FAQSection />
            </RevealOnScroll>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <RevealOnScroll animation="fadeScale">
              <div className="cta-banner">
                <span className="eyebrow">Ready?</span>
                <h2>Make your business easier to reach.</h2>
                <p className="lead">
                  Start with Bella, a sharper website, or both. Keep it clean,
                  useful, and easy for customers to act.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                  <a href="/book?service=bella" className="btn btn-primary">
                    Book With Bella
                  </a>
                  <a href="/book?service=website" className="btn btn-ghost">
                    Build My Website
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-col footer-about">
              <span
                className="brand"
                style={{ marginBottom: 8, display: "inline-flex" }}
              >
                <span className="brand-mark">
                  <span className="infinity-mark" aria-hidden="true">
                    &infin;
                  </span>
                </span>
                Limitless
              </span>
              <p>
                Bella, clean websites, AI chat, and practical automation for
                local businesses.
              </p>
            </div>
            <div className="footer-col">
              <h5>Offers</h5>
              <ul>
                <li>
                  <a href="#bella">Bella Receptionist</a>
                </li>
                <li>
                  <a href="#websites">Web Design</a>
                </li>
                <li>
                  <a href="#how-it-works">How It Works</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
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
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Next</h5>
              <ul>
                <li>
                  <a href="/book?service=website">Book a Build</a>
                </li>
                <li>
                  <a href="#faq">Questions</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#main">Back to Top</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-meta">
              <span>&copy; 2026 Limitless. All rights reserved.</span>
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
