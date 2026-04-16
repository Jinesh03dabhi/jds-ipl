import Link from "next/link";
import styles from "./seo-ui.module.css";

type MatchCardProps = {
  href: string;
  title: string;
  summary: string;
  meta: string[];
};

export default function MatchCard({ href, title, summary, meta }: MatchCardProps) {
  return (
    <Link href={href} className={styles.link}>
      <article className={styles.card}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.muted}>{summary}</p>
        <div className={styles.badgeRow}>
          {meta.map((item) => (
            <span key={item} className={styles.badge}>
              {item}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
