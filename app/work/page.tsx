import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WorkTiles from "@/components/WorkTiles";
import styles from "@/app/consulting.module.css";

export const metadata: Metadata = { title: "Our work | Limitless", description: "Real websites, agents, and business systems built by Limitless.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  return <>
    <a href="#main" className="skip">Skip to content</a><Nav />
    <main id="main" className={styles.pageMain}>
      <section className={styles.sectionSmall}><div className={styles.container}>
        <div className={styles.pageHead}><span className={styles.kicker}>Our work</span><h1>Real things we’ve built.</h1><p>Built for owners like these.</p></div>
        <div className={styles.workBanner}>
          <Image
            src="/consulting/work-banner-team.webp"
            alt="Business owners reviewing a plan together at a laptop"
            fill
            sizes="(max-width: 760px) 100vw, 1200px"
            preload
          />
        </div>
        <WorkTiles />
      </div></section>
      <section className={`${styles.section} ${styles.endCta}`}><div className={styles.container}><h2>Want something like this for your business?</h2><div className={styles.actions}><Link href="/book" className={styles.pill}>Book a free audit</Link></div><Link href="/" className={styles.backHome}>Back to home</Link></div></section>
    </main><Footer />
  </>;
}
