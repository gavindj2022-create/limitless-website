"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "@/app/consulting.module.css";

const NAV_LINKS = [
  { label: "How we help", href: "/how-we-help" },
  { label: "Our work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className={styles.siteHeader}>
      <div className={styles.navRow}>
        <Link href="/" className={styles.navBrand} aria-label="Limitless home">
          <span className={styles.navMark}><Image src="/brand/mark-white.webp" alt="" width={319} height={152} unoptimized /></span>
          <span className={styles.brandWords}><strong>Limitless</strong><small>Agentic solutions</small></span>
        </Link>
        <nav className={styles.navTabs} aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={pathname === href ? styles.navActive : undefined} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <Link href="/book" className={`${styles.pill} ${styles.navBook} ${pathname === "/book" ? styles.bookActive : ""}`} aria-current={pathname === "/book" ? "page" : undefined}>Book a free audit</Link>
      </div>
      <nav className={styles.mobileTabs} aria-label="Main navigation, mobile">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className={pathname === href ? styles.navActive : undefined} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      <Link href="/book" className={styles.mobileSticky}>Book a free audit</Link>
    </header>
  );
}
