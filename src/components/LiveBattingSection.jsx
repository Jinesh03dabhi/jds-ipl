"use client";

import { getMatchState } from "@/utils/getMatchState";
import Link from "next/link";

function formatStrikeRate(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "-";
}

export default function LiveBattingSection({ data }) {
  const matchState = getMatchState(data);

  if (matchState === "upcoming" || matchState === "waiting") return null;

  const inningsList = data?.scorecard?.scorecard || [];
  const liveBatters = data?.match?.liveContext?.currentBatters || [];
  const validInnings = inningsList.filter(
    (innings) => innings?.batting && innings.batting.length,
  );
  const latestInnings = validInnings[validInnings.length - 1];
  const batting = latestInnings?.batting || [];
  const useLiveContextFallback = !batting.length && liveBatters.length > 0;

  if (!batting.length && !liveBatters.length) {
    return (
      <div className="glass-card">
        {matchState === "completed"
          ? "Detailed batting scorecard is not available right now."
          : "Waiting for batting to begin..."}
      </div>
    );
  }

  const isActive = (player) => {
    const dismissalText = player?.["dismissal-text"];
    return Boolean(dismissalText && dismissalText.toLowerCase().includes("batting"));
  };

  const sortedBatting = [...batting].sort((left, right) => {
    const leftActive = isActive(left);
    const rightActive = isActive(right);

    if (leftActive !== rightActive) {
      return Number(rightActive) - Number(leftActive);
    }

    return (right?.r ?? 0) - (left?.r ?? 0);
  });

  return (
    <div className="glass-card table-card">
      <h3 style={{ marginBottom: 16 }}>
        {matchState === "live" ? "Live Batting" : "Batting Scorecard"}
      </h3>

      <div className="table-wrapper">
        <table className="responsive-table batting-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Batsman</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>

          <tbody>
            {useLiveContextFallback
              ? liveBatters.map((player, index) => (
                  <tr
                    key={`${player.name}-${index}`}
                    className="current-batsman-row"
                  >
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
                        {player.name || "Unknown"}
                      </Link>
                    </td>
                    <td>{player.runs ?? "-"}</td>
                    <td>{player.balls ?? "-"}</td>
                    <td>{player.fours ?? "-"}</td>
                    <td>{player.sixes ?? "-"}</td>
                    <td>{formatStrikeRate(player.strikeRate)}</td>
                  </tr>
                ))
              : sortedBatting.map((player, index) => {
                  const isNotOut = isActive(player);
                  const balls = player?.b ?? 0;
                  const runs = player?.r ?? 0;
                  const strikeRate =
                    balls > 0
                      ? ((runs / balls) * 100).toFixed(2)
                      : formatStrikeRate(player?.sr);

                  return (
                    <tr
                      key={player?.batsman?.id || index}
                      className={isNotOut ? "current-batsman-row" : ""}
                    >
                      <td style={{ textAlign: "left" }}>
                        {isNotOut && (
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
                          {player?.batsman?.name || "Unknown"}
                        </Link>

                        {!isNotOut && player?.["dismissal-text"] && (
                          <div
                            style={{
                              fontSize: 12,
                              opacity: 0.6,
                              marginTop: 4,
                              maxWidth: 220,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {player["dismissal-text"]}
                          </div>
                        )}
                      </td>

                      <td>{runs}</td>
                      <td>{balls}</td>
                      <td>{player?.["4s"] ?? 0}</td>
                      <td>{player?.["6s"] ?? 0}</td>
                      <td>{strikeRate}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
