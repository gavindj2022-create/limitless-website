import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Chapter from "@/components/experience/Chapter";
import { AskBellaButton } from "@/components/WorkTiles";
import styles from "@/app/consulting.module.css";

export const metadata: Metadata = { title: "How we help | Limitless", description: "A clear path from AI advice to done-for-you builds and one-on-one training.", alternates: { canonical: "/how-we-help" } };

export default function HowWeHelpPage() {
  return <>
    <a href="#main" className="skip">Skip to content</a><Nav />
    <main id="main" className={styles.pageMain}>
      <section className={styles.sectionSmall}><div className={styles.container}>
        <div className={styles.pageHead}><span className={styles.kicker}>How we help</span><h1>Plan it. Build it. Own it.</h1><p>Every engagement starts with a free audit.</p></div>
        <div className={styles.ruleRows}>
          <article className={styles.ruleRow}><span className={styles.ruleNumber}>01</span><h2>Advise</h2><p>We learn your business and show you where AI saves time and money. Written plan in 3 business days.</p><p className={styles.ruleDetail}>Free 30-minute audit · written plan · honest advice</p></article>
          <article className={styles.ruleRow}><span className={styles.ruleNumber}>02</span><h2>Build</h2><p>We set up the agentic solutions in your plan, done for you.</p><p className={styles.ruleDetail}>Phones answered · leads followed up · email sorted · bookings · reviews · reports · websites</p></article>
          <article className={styles.ruleRow} id="train"><span className={styles.ruleNumber}>03</span><h2>Train</h2><p>One-on-one until it clicks, so you can run it and use AI day to day.</p><p className={styles.ruleDetail}>Owner sessions · hand-off training after every build</p></article>
        </div>
      </div></section>
      <Chapter film="/media/night" poster="/media/night-poster-v2.jpg" className={styles.nightStrip} scrim="left"><div><span className="xp-kicker">2:47 AM</span><h2>You were asleep. The call still got answered.</h2></div></Chapter>
      <section className={`${styles.section} ${styles.endCta}`}><div className={styles.container}><h2>Not sure where you fit? That’s what the audit is for.</h2><div className={styles.actions}><Link href="/book" className={styles.pill}>Book a free audit</Link><AskBellaButton className={styles.textButton}>Ask Bella</AskBellaButton></div><Link href="/" className={styles.backHome}>Back to home</Link></div></section>
    </main><Footer />
  </>;
}
