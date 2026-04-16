import Link from "next/link";
import PlayerAvatar from "@/components/PlayerAvatar";
import styles from "./seo-ui.module.css";

type PlayerCardProps = {
  href: string;
  name: string;
  role: string;
  teamName: string;
  statLine: string;
  avatarUrl?: string;
};

export default function PlayerCard({
  href,
  name,
  role,
  teamName,
  statLine,
  avatarUrl,
}: PlayerCardProps) {
  return (
    <Link href={href} className={styles.link}>
      <article className={styles.card}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <PlayerAvatar name={name} src={avatarUrl} size={52} />
          <div>
            <h3 className={styles.cardTitle} style={{ marginBottom: "4px" }}>
              {name}
            </h3>
            <p className={styles.muted}>
              {role} · {teamName}
            </p>
          </div>
        </div>
        <div className={styles.pills}>
          <span className={styles.pill}>{statLine}</span>
        </div>
      </article>
    </Link>
  );
}
