import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FaqAsk from "@/components/FaqAsk";
import { faqItems } from "@/content/faq";
import styles from "@/app/consulting.module.css";

export const metadata: Metadata = {
  title: "FAQ | Limitless",
  description: "Plain answers about Limitless AI audits, builds, training, data, tools, cost, and timing.",
  alternates: { canonical: "/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main" className={styles.pageMain}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
        />
        <section className={styles.sectionSmall}>
          <div className={styles.narrow}>
            <div className={`${styles.pageHead} ${styles.pageHeadCentered}`}>
              <span className={styles.kicker}>FAQ</span>
              <h1>Plain answers.</h1>
            </div>
            <div className={styles.faqAsk}><FaqAsk /></div>
            <div className={styles.faqList}>
              {faqItems.map((item) => (
                <details key={item.id}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                  {item.id === "data" && (
                    <Link href="/privacy-security" className={styles.pill}>Read our privacy and security →</Link>
                  )}
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className={`${styles.section} ${styles.endCta}`}>
          <div className={styles.container}>
            <h2>Still have a question? Let&apos;s talk.</h2>
            <div className={styles.actions}>
              <Link href="/book" className={styles.pill}>Book a free audit</Link>
            </div>
            <Link href="/" className={styles.backHome}>Back to home</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
