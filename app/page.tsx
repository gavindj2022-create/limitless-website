import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import Chapter from "@/components/experience/Chapter";
import DotCloud from "@/components/experience/DotCloud";
import { AskBellaButton } from "@/components/WorkTiles";
import styles from "./consulting.module.css";

export const metadata: Metadata = {
  title: "Limitless | AI. Made Simple.",
  description: "Founder-led AI audits, done-for-you agentic solutions, and one-on-one training for small-business owners.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main" className={styles.homeMain}>
        <section className={`${styles.hero} ${styles.founderHero}`} aria-labelledby="hero-title">
          <Image
            src="/consulting/hero-city-bg.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroCityBg}
          />
          <div className={styles.founderStage}>
            <Image
              src="/consulting/gav-founder-city.webp"
              alt="Gavin Johnson, founder of Limitless"
              fill
              priority
              sizes="(max-width: 767px) 70vw, 45vw"
              className={styles.founderPhoto}
            />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>Agentic solutions</span>
              <h1 id="hero-title">AI. Made Simple.</h1>
              <p>We find the busywork, build agents to handle it, and teach your team to run them.</p>
              <div className={styles.actions}>
                <Link href="/book" className={styles.lightPill}>Book a free audit</Link>
                <AskBellaButton className={styles.outlinePill}>Ask Bella</AskBellaButton>
              </div>
            </div>
          </div>
          <div className={styles.dotCorner} data-dotcloud-zone><DotCloud /></div>
        </section>

        <section className={styles.choiceSection} aria-labelledby="where-title">
          <div className={styles.container}>
            <span className={styles.kicker}>A place to start</span>
            <h2 id="where-title">Where are you with AI?</h2>
            <div className={styles.choiceList}>
              <div className={styles.choiceItem}><h3>I don’t know where to start.</h3><Link href="/book" className={styles.pill}>Start with an audit →</Link></div>
              <div className={styles.choiceItem}><h3>I’m buried in busywork.</h3><Link href="/how-we-help" className={styles.pill}>See how we help →</Link></div>
              <div className={styles.choiceItem}><h3>I want my team to use it.</h3><Link href="/how-we-help#train" className={styles.pill}>Learn about training →</Link></div>
            </div>
          </div>
        </section>

        <Chapter film="/media/dawn" poster="/media/dawn-poster-v2.jpg" className="xp-dawn" scrim="center">
          <div className={styles.dawnCopy}>
            <span className="xp-kicker">7:00 AM · YOUR DESK</span>
            <h2>Wake up ahead.</h2>
            <p className="lead">The busywork moved overnight. Now your morning starts with room to think.</p>
            <div className={styles.actions}>
              <Link href="/book" className={styles.lightPill}>Book a free audit</Link>
              <AskBellaButton className={styles.outlinePill}>Ask Bella</AskBellaButton>
            </div>
          </div>
        </Chapter>

        <section className={`${styles.section} ${styles.contact}`} aria-labelledby="contact-title">
          <div className={`${styles.container} ${styles.contactGrid}`}>
            <div><span className={styles.kicker}>Contact</span><h2 id="contact-title">Let’s talk.</h2><p>Tell us what takes too much of your time. We’ll help you find a clear first step.</p></div>
            <div className={styles.contactDetails}>
              <div className={styles.actions}><Link href="/book" className={styles.pill}>Book a free audit</Link><AskBellaButton className={styles.textButton}>Ask Bella</AskBellaButton></div>
              <a href="mailto:limitlessgav@gmail.com">limitlessgav@gmail.com</a>
              <a href="tel:+13123131478" className={styles.pill}>Call our Front Desk Agent: (312) 313-1478</a>
              <SocialLinks />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
