import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "@/app/consulting.module.css";

export const metadata: Metadata = {
  title: "Privacy and security | Limitless",
  description: "A plain-English summary of how Limitless handles website leads, Bella questions, and client data.",
  alternates: { canonical: "/privacy-security" },
};

const blocks = [
  ["What we collect", "Only what you type in the form or chat: your name, email, phone number, and message."],
  ["Who sees it", "Gavin only. We never sell it or share it for advertising."],
  ["Tools that touch it", "Anthropic may process Bella's mini-audit answers, Resend sends email, Google can store lead-sheet entries, and Vercel hosts the site and analytics."],
  ["How long we keep it", "We keep lead information until you ask us to delete it. Chat questions are stored without names or email addresses. You can ask for deletion at any time."],
  ["Your client data", "When we build for you, we connect only what the agent needs, use your own accounts where possible, and let you switch it off at any time."],
] as const;

export default function PrivacySecurityPage() {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main" className={styles.pageMain}>
        <section className={styles.sectionSmall}>
          <div className={styles.narrow}>
            <div className={styles.pageHead}>
              <span className={styles.kicker}>Privacy and security</span>
              <h1>Your data stays yours.</h1>
            </div>
            <div className={styles.plainBlocks}>
              {blocks.map(([title, copy]) => (
                <article key={title}>
                  <h2>{title}</h2>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <div className={styles.actions}>
              <a className={styles.pill} href="mailto:limitlessgav@gmail.com?subject=Delete%20my%20Limitless%20data">Ask us to delete your data</a>
            </div>
            <p className={styles.legalLinks}>
              Read the full <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
            </p>
            <Link href="/" className={styles.backHome}>Back to home</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
