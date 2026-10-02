import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SocialLinks from "@/components/SocialLinks";
import CountUpValue from "@/components/CountUpValue";
import styles from "@/app/consulting.module.css";

export const metadata: Metadata = { title: "About Gavin | Limitless", description: "Meet Gavin Johnson, founder of Limitless and a Central Illinois business owner helping other owners use AI clearly and safely.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <>
    <a href="#main" className="skip">Skip to content</a><Nav />
    <main id="main" className={styles.pageMain}>
      <section className={styles.sectionSmall}><div className={`${styles.container} ${styles.aboutIntro}`}>
        <div className={styles.aboutPortrait}><Image src="/gav/gavin-johnson-hd.webp" alt="Gavin Johnson, founder of Limitless" fill sizes="(max-width: 640px) 100vw, 40vw" /></div>
        <div className={styles.aboutNote}><span className={styles.kicker}>About</span><h1>Hi, I’m Gavin.</h1><p>I graduated from Eureka College with a business degree, and I believe AI will change how every small business runs. I founded Limitless to help owners put it to work clearly, safely, and without the guesswork. Before we recommend any tool, we test it in our own rental business. Every audit is led by me personally.</p><span className={styles.signature}>Gavin Johnson · Founder, Limitless · Central Illinois</span></div>
      </div></section>
      <section className={`${styles.section} ${styles.statBand}`} aria-labelledby="our-numbers"><div className={styles.container}><span className={styles.kicker}>Our numbers · all real</span><h2 id="our-numbers">Built and tested by us.</h2><div className={styles.statGrid}>
        <div className={styles.stat}><CountUpValue end={20} suffix="+" /><span>Agents and systems built</span></div>
        <div className={styles.stat}><CountUpValue end={3} /><span>Business days to your written plan</span></div>
        <div className={styles.stat}><CountUpValue end={24} suffix="/7" /><span>Agents on shift</span></div>
        <div className={styles.stat}><CountUpValue end={92873} prefix="$" /><span>Our own rental business in 2025. We test every tool on it first.</span></div>
      </div></div></section>
      <section className={`${styles.section} ${styles.darkBand}`} aria-labelledby="why-it-matters"><div className={styles.container}><span className={styles.kicker}>Why it matters</span><h2 id="why-it-matters">The gap is real.</h2><div className={styles.statGrid}>
        <div className={styles.stat}><strong>62%</strong><span>Of small-business calls go unanswered.</span><span className={styles.source}>411 Locals, 2024 (answering-service company)</span></div>
        <div className={styles.stat}><strong>85%</strong><span>Of voicemail callers never call back.</span><span className={styles.source}>411 Locals, 2024 (answering-service company)</span></div>
        <div className={styles.stat}><strong>21×</strong><span>More likely to qualify a lead when replying within 5 minutes.</span><span className={styles.source}>MIT / InsideSales, 2007</span></div>
      </div></div></section>
      <section className={`${styles.section} ${styles.contact}`}><div className={`${styles.container} ${styles.contactGrid}`}><div><span className={styles.kicker}>Contact</span><h2>Let’s talk.</h2><p>Every audit starts with Gavin.</p></div><div className={styles.contactDetails}><Link href="/book" className={styles.pill}>Book a free audit</Link><a href="mailto:limitlessgav@gmail.com">limitlessgav@gmail.com</a><SocialLinks /><Link href="/" className={styles.backHome}>Back to home</Link></div></div></section>
    </main><Footer />
  </>;
}
