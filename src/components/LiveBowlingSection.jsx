"use client";

import { getMatchState } from "@/utils/getMatchState";
import Link from "next/link";

function convertOversToBalls(overs) {
  if (!overs && overs !== 0) return 0;

  const [completedOvers, balls] = String(overs).split(".");
  return Number(completedOvers) * 6 + Number(balls || 0);
}

function isActiveBowler(overs) {
  if (!overs) return false;

  const normalizedOvers = String(overs);
  return normalizedOvers.includes(".") && !normalizedOvers.endsWith(".0");
}

function formatEconomy(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "-";
}

export default function LiveBowlingSection({ data }) {
  const matchState = getMatchState(data);

  if (matchState === "upcoming" || matchState === "waiting") return null;

  const inningsList = data?.scorecard?.scorecard || [];
  const liveBowler = data?.match?.liveContext?.currentBowler || null;
  const validInnings = inningsList.filter(
    (innings) => innings?.bowling && innings.bowling.length,
  );
  const latestInnings = validInnings[validInnings.length - 1];
  const bowling = latestInnings?.bowling || [];
  const useLiveContextFallback = !bowling.length && Boolean(liveBowler);

  if (!bowling.length && !liveBowler) {
    return (
      <div className="glass-card">
        {matchState === "completed"
          ? "Detailed bowling figures are not available right now."
          : "Waiting for bowling to begin..."}
      </div>
    );
  }

  const sortedBowling = [...bowling].sort((left, right) => {
    const wicketsDiff = (right?.w ?? 0) - (left?.w ?? 0);
    if (wicketsDiff !== 0) {
      return wicketsDiff;
    }

    const leftEconomy =
      convertOversToBalls(left?.o) > 0
        ? (left?.r ?? 0) / convertOversToBalls(left?.o)
        : Infinity;
    const rightEconomy =
      convertOversToBalls(right?.o) > 0
        ? (right?.r ?? 0) / convertOversToBalls(right?.o)
        : Infinity;

    return leftEconomy - rightEconomy;
  });

  return (
    <div className="glass-card table-card">
      <h3 style={{ marginBottom: 16 }}>
        {matchState === "live" ? "Live Bowling" : "Bowling Scorecard"}
      </h3>

      <div className="table-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Bowler</th>
              <th>O</th>
              <th>M</th>
              <th>R</th>
              <th>W</th>
              <th>Econ</th>
            </tr>
          </thead>

          <tbody>
            {useLiveContextFallback
              ? (
                  <tr className="current-bowler-row">
                    <td style={{ textAlign: "left" }}>
                      <span
                        style={{
                          color: "#22c55e",
                          marginRight: 6,
                          fontWeight: 700,
                        }}
                      >
                        *
                      </span>
                      <Link href="/players" style={{ textDecoration: "none", color: "inherit" }}>
                        {liveBowler.name || "Unknown"}
                      </Link>
                    </td>
                    <td>{liveBowler.overs ?? "-"}</td>
                    <td>{liveBowler.maidens ?? "-"}</td>
                    <td>{liveBowler.runs ?? "-"}</td>
                    <td>{liveBowler.wickets ?? "-"}</td>
                    <td>{formatEconomy(liveBowler.economy)}</td>
                  </tr>
                )
              : sortedBowling.map((player, index) => {
                  const runs = Number(player?.r ?? 0);
                  const overs = player?.o ?? 0;
                  const ballsBowled = convertOversToBalls(overs);
                  const economy =
                    ballsBowled > 0
                      ? ((runs / ballsBowled) * 6).toFixed(2)
                      : "0.00";
                  const active = isActiveBowler(overs);

                  return (
                    <tr
                      key={player?.bowler?.id || index}
                      className={active ? "current-bowler-row" : ""}
                    >
                      <td style={{ textAlign: "left" }}>
                        {active && (
                          <span
                            style={{
                              color: "#22c55e",
                              marginRight: 6,
                              fontWeight: 700,
                            }}
                          >
                            *
                          </span>
                        )}
                        <Link href="/players" style={{ textDecoration: "none", color: "inherit" }}>
                          {player?.bowler?.name || "Unknown"}
                        </Link>
                      </td>
                      <td>{overs}</td>
                      <td>{player?.m ?? 0}</td>
                      <td>{runs}</td>
                      <td>{player?.w ?? 0}</td>
                      <td>{economy}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
