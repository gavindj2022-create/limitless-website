import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import styles from "@/app/consulting.module.css";
import { AskBellaButton } from "@/components/WorkTiles";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerIntro}>
          <Link href="/" className={styles.footerName}>∞ Limitless</Link>
          <p>Agentic solutions, made easy for the people running a business.</p>
          <SocialLinks />
        </div>
        <div>
          <h2>Solutions</h2>
          <ul>
            <li><Link href="/how-we-help">Front desk and calls</Link></li>
            <li><Link href="/how-we-help">Lead follow-up</Link></li>
            <li><Link href="/how-we-help">Email and booking</Link></li>
            <li><Link href="/work">Websites</Link></li>
            <li><Link href="/how-we-help">Training</Link></li>
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            <li><Link href="/book">Book a free audit</Link></li>
            <li><Link href="/work">Our work</Link></li>
            <li><Link href="/about">About Gavin</Link></li>
            <li><AskBellaButton className={styles.footerTextButton}>Ask Bella</AskBellaButton></li>
            <li><Link href="/privacy-security">Privacy and security</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}><span>Central Illinois · Available online anywhere</span><span>Independent, not affiliated with any AI vendor</span></div>
      <div className={styles.footerWordmark} aria-hidden="true">LIMITLESS</div>
    </footer>
  );
}
