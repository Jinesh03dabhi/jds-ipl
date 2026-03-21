import type { PointsTableRow } from "@/lib/ipl-data";
import styles from "./intent.module.css";

type PointsTablePanelProps = {
  rows: PointsTableRow[];
};

const formTone = (token: "W" | "L" | "NR" | "T") => {
  if (token === "W") return styles.formWin;
  if (token === "L") return styles.formLoss;
  return styles.formNeutral;
};

export default function PointsTablePanel({ rows }: PointsTablePanelProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>IPL 2026 Points Table</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>L</th>
              <th>NR</th>
              <th>Pts</th>
              <th>NRR</th>
              <th>Form</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.team.name}>
                <td>{index + 1}</td>
                <td className={styles.teamCell}>{row.team.name}</td>
                <td>{row.played}</td>
                <td className={styles.positive}>{row.wins}</td>
                <td className={styles.negative}>{row.losses}</td>
                <td>{row.noResult}</td>
                <td>{row.points}</td>
                <td className={row.nrr > 0 ? styles.positive : row.nrr < 0 ? styles.negative : styles.neutral}>
                  {row.nrr > 0 ? "+" : ""}
                  {row.nrr.toFixed(3)}
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
        NRR is derived from completed match scorelines available in the current schedule feed. If the season has not started yet, every team remains on zero points.
      </div>
    </section>
  );
}
