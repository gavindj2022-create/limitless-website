import { socials } from "@/content/socials";
import styles from "@/app/consulting.module.css";

function Icon({ name }: { name: string }) {
  switch (name) {
    case "Instagram":
      return <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>;
    case "LinkedIn":
      return <><path d="M4 9v11M4 4v.2M9 20V9h4v1.8c.8-1.3 2-2 3.4-2 2.7 0 3.6 1.7 3.6 4.5V20M9 14c0-2.1 1.1-3.4 2.9-3.4" /></>;
    case "Facebook":
      return <path d="M15.5 20v-7h2.4l.4-3h-2.8V8.2c0-.9.4-1.5 1.7-1.5H19V4.1c-.5-.1-1.5-.1-2.4-.1-2.8 0-4.6 1.7-4.6 4.7V10H9.5v3H12v7" />;
    default:
      return <path d="M13 4v10.3a4.3 4.3 0 1 1-4.3-4.3M13 4c1.1 2.3 2.9 3.7 5.8 3.9" />;
  }
}

export default function SocialLinks() {
  return (
    <div className={styles.socialLinks} aria-label="Social media">
      {socials.filter((social) => social.href).map((social) => (
        <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`Limitless on ${social.name}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><Icon name={social.name} /></svg>
        </a>
      ))}
    </div>
  );
}
