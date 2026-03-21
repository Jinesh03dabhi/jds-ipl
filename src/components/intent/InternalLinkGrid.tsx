import Link from "next/link";
import styles from "./intent.module.css";

export type IntentLinkItem = {
  href: string;
  label: string;
  description: string;
};

type InternalLinkGridProps = {
  title: string;
  links: IntentLinkItem[];
};

export default function InternalLinkGrid({ title, links }: InternalLinkGridProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.linkGrid}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={styles.linkCard}>
            <span className={styles.linkLabel}>{link.label}</span>
            <span className={styles.linkDescription}>{link.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
