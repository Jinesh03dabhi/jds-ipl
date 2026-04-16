import Image from "next/image";
import Link from "next/link";
import styles from "./seo-ui.module.css";

type TeamCardProps = {
  href: string;
  logoUrl: string;
  name: string;
  shortName: string;
  summary: string;
  meta: string[];
};

export default function TeamCard({
  href,
  logoUrl,
  name,
  shortName,
  summary,
  meta,
}: TeamCardProps) {
  return (
    <Link href={href} className={styles.link}>
      <article className={styles.card}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <Image src={logoUrl} alt={`${name} logo`} width={52} height={52} />
          <div>
            <h3 className={styles.cardTitle} style={{ marginBottom: "4px" }}>
              {name}
            </h3>
            <p className={styles.muted}>{shortName}</p>
          </div>
        </div>
        <p className={styles.muted} style={{ marginTop: "14px" }}>
          {summary}
        </p>
        <div className={styles.pills}>
          {meta.map((item) => (
            <span key={item} className={styles.pill}>
              {item}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
