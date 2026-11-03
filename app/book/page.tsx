import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ConsultingLeadForm from "@/components/ConsultingLeadForm";
import styles from "@/app/consulting.module.css";

const calendarUrl = "https://calendar.app.google/CaCfThGeGv6bMpXX9";

export const metadata: Metadata = {
  title: "Book a free AI audit | Limitless",
  description: "Book a free 30-minute AI audit with Gavin Johnson and receive a written plan in 3 business days.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main" className={styles.pageMain}>
        <section className={styles.sectionSmall}>
          <div className={`${styles.narrow} ${styles.bookColumn}`}>
            <div className={styles.bookBanner}>
              <Image
                src="/consulting/book-banner-planning-table-v2.webp"
                alt="Planning table with a notebook, laptop, and coffee"
                fill
                sizes="(max-width: 760px) 100vw, 760px"
                preload
                quality={90}
              />
            </div>
            <div className={`${styles.pageHead} ${styles.pageHeadCentered}`}>
              <span className={styles.kicker}>Free AI audit</span>
              <h1>Let&apos;s talk.</h1>
              <p>30-minute call. Written plan in 3 business days. No pressure.</p>
            </div>
            <ConsultingLeadForm />
            <p className={styles.calendarLink}>
              Prefer to pick a time?{" "}
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer">Open the calendar</a>
            </p>
            <Link href="/" className={styles.backHome}>Back to home</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
