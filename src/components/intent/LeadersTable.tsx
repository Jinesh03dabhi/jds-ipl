import Image from "next/image";
import Link from "next/link";
import styles from "./intent.module.css";
import type { LeaderboardEntry } from "@/lib/leaderboards";

type LeadersTableProps = {
  title: string;
  leaders: LeaderboardEntry[];
  variant: "orange" | "purple";
};

export default function LeadersTable({
  title,
  leaders,
  variant,
}: LeadersTableProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th>Team</th>
              <th>Matches</th>
              <th>{variant === "orange" ? "Runs" : "Wickets"}</th>
              <th>{variant === "orange" ? "Strike Rate" : "Economy"}</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => (
              <tr key={leader.id}>
                <td>{index + 1}</td>
                <td className={styles.teamCell}>
                  <Link href={`/players/${leader.id}`} className={styles.tablePlayerLink}>
                    <Image
                      src={leader.teamLogo}
                      alt={`${leader.team} logo`}
                      width={28}
                      height={28}
                      className={styles.tableTeamLogo}
                    />
                    <span>{leader.name}</span>
                  </Link>
                </td>
                <td>{leader.team}</td>
                <td>{leader.matches}</td>
                <td>{variant === "orange" ? leader.runs : leader.wickets}</td>
                <td>
                  {variant === "orange"
                    ? leader.strikeRate?.toFixed(2) || "--"
                    : leader.economy?.toFixed(2) || "--"}
                </td>
                <td>{leader.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.smallText}>
        Leaderboards are derived from the player dataset stored in IPL Scorebook and rank players by
        primary competition output first, then by supporting rate metrics.
      </div>
    </section>
  );
}
