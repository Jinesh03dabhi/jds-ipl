"use client";

import { getMatchState } from "@/utils/getMatchState";

export default function LiveBattingSection({ data }) {

  const matchState = getMatchState(data);

  // ⭐ Show only when match has score
  if (matchState === "upcoming" || matchState === "waiting") {
    return null;
  }

  const inningsList = data?.scorecard?.scorecard || [];

  // ⭐ Filter valid innings
  const validInnings = inningsList.filter(
    inn => inn?.batting && inn.batting.length
  );

  if (!validInnings.length) {
    return (
      <div className="glass-card">
        <h3>Batting</h3>
        <div style={{ opacity: 0.6 }}>No batting data available</div>
      </div>
    );
  }

  const latestInnings = validInnings[validInnings.length - 1];
  const batting = latestInnings?.batting || [];

  // ⭐ Sort current batsmen first
  const sortedBatting = [...batting].sort((a, b) => {

    const aNotOut = (a?.["dismissal-text"] || "")
      .toLowerCase()
      .includes("not out");

    const bNotOut = (b?.["dismissal-text"] || "")
      .toLowerCase()
      .includes("not out");

    return Number(bNotOut) - Number(aNotOut);
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
            {sortedBatting.map((player, index) => {

              const dismissal =
                (player?.["dismissal-text"] || "").toLowerCase();

              const isNotOut = dismissal.includes("not out");

              const strikeRate =
                player?.sr !== undefined && player?.sr !== null
                  ? player.sr
                  : "-";

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
                          fontWeight: 700
                        }}
                      >
                        ●
                      </span>
                    )}

                    {player?.batsman?.name || "Unknown"}

                    {!isNotOut && player?.["dismissal-text"] && (
                      <div
                        style={{
                          fontSize: 12,
                          opacity: 0.6,
                          marginTop: 4,
                          maxWidth: 220,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {player["dismissal-text"]}
                      </div>
                    )}

                  </td>

                  <td>{player?.r ?? "-"}</td>
                  <td>{player?.b ?? "-"}</td>
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