import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookOptions from "@/components/BookOptions";
import styles from "./book.module.css";

export const metadata: Metadata = {
  title: "Talk with Gavin | Limitless",
  description: "Book a free 30-minute strategy call with Gavin Johnson, ask for a call back, or send a text.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <main id="main" className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo} aria-label="Limitless home">
          <Image src="/brand/mark-ink.webp" alt="Limitless" width={319} height={152} priority unoptimized />
        </Link>
        <h1 className={styles.hello}>Hey, it&apos;s Gavin.</h1>
        <p className={styles.sub}>Sorry I missed you. Pick whatever&apos;s easiest.</p>
        <p className={styles.client}>Already a client? <a href="sms:+13093402657">Text me</a></p>
        <BookOptions />
        <p className={styles.foot}>Limitless · Peoria, IL · <Link href="/privacy">Privacy</Link></p>
      </div>
    </main>
  );
}
