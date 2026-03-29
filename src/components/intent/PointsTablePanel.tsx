import Image from "next/image";
import styles from "./intent.module.css";
import type { PointsTableEntry } from "@/lib/points-table";

type PointsTablePanelProps = {
  rows: PointsTableEntry[];
  lastUpdatedLabel?: string | null;
  isRealtime?: boolean;
};

const formTone = (token: "W" | "L" | "NR" | "T") => {
  if (token === "W") return styles.formWin;
  if (token === "L") return styles.formLoss;
  return styles.formNeutral;
};

function renderPositionChange(positionChange: number) {
  if (positionChange > 0) {
    return (
      <span className={styles.positionUp}>
        {"\u2191"} {positionChange}
      </span>
    );
  }

  if (positionChange < 0) {
    return (
      <span className={styles.positionDown}>
        {"\u2193"} {Math.abs(positionChange)}
      </span>
    );
  }

  return <span className={styles.positionFlat}>-</span>;
}

export default function PointsTablePanel({
  rows,
  lastUpdatedLabel = null,
  isRealtime = false,
}: PointsTablePanelProps) {
  const hasAppliedResults = rows.some((row) => row.played > 0);

  return (
    <section className={styles.section}>
      <div className={styles.tableHeader}>
        <h2 className={styles.sectionTitle}>IPL 2026 Points Table</h2>
        <div className={styles.tableMeta}>
          <span className={styles.metaBadge}>
            {isRealtime
              ? "Live client updates active"
              : hasAppliedResults
                ? "Results synced from schedule feed"
                : "Server-seeded standings"}
          </span>
          {lastUpdatedLabel ? (
            <span className={styles.metaBadge}>Updated: {lastUpdatedLabel}</span>
          ) : null}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Team</th>
              <th>M</th>
              <th>W</th>
              <th>L</th>
              <th>NR</th>
              <th>Pts</th>
              <th>NRR</th>
              <th>Last</th>
              <th>Form</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.team.name}
                className={row.isPlayoffZone ? styles.playoffRow : undefined}
              >
                <td>
                  <div className={styles.positionCell}>
                    <span className={styles.positionBadge}>{row.position}</span>
                    {renderPositionChange(row.positionChange)}
                  </div>
                </td>
                <td className={styles.teamCell}>
                  <div className={styles.teamIdentity}>
                    <Image
                      src={row.team.logo}
                      alt={`${row.team.name} logo`}
                      width={30}
                      height={30}
                      className={styles.tableTeamLogo}
                    />
                    <div className={styles.teamIdentityText}>
                      <span>{row.team.name}</span>
                      {row.isPlayoffZone ? (
                        <span className={styles.playoffBadge}>Top 4</span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td>{row.played}</td>
                <td className={styles.positive}>{row.won}</td>
                <td className={styles.negative}>{row.lost}</td>
                <td>{row.noResult}</td>
                <td>{row.points}</td>
                <td
                  className={
                    row.netRunRate > 0
                      ? styles.positive
                      : row.netRunRate < 0
                        ? styles.negative
                        : styles.neutral
                  }
                >
                  {row.netRunRate > 0 ? "+" : ""}
                  {row.netRunRate.toFixed(3)}
                </td>
                <td>
                  <span
                    className={`${styles.formBadge} ${
                      row.lastMatchResult ? formTone(row.lastMatchResult) : styles.formNeutral
                    }`}
                  >
                    {row.lastMatchResult || "-"}
                  </span>
                </td>
                <td>
                  <div className={styles.formRow}>
                    {row.form.length ? (
                      row.form.map((token, tokenIndex) => (
                        <span
                          key={`${row.team.name}-${token}-${tokenIndex}`}
                          className={`${styles.formBadge} ${formTone(token)}`}
                        >
                          {token}
                        </span>
                      ))
                    ) : (
                      <span className={styles.muted}>No matches yet</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.smallText}>
        The table auto-applies completed matches, sorts by points and NRR, highlights the playoff
        zone, and keeps rank movement stable between updates.
      </div>
    </section>
  );
}
