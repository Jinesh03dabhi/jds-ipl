"use client";

import { getMatchState } from "@/utils/getMatchState";
import Link from "next/link";

export default function LiveBattingSection({ data }) {

  const matchState = getMatchState(data);

  if (matchState === "upcoming" || matchState === "waiting") return null;

  const inningsList = data?.scorecard?.scorecard || [];

  if (!inningsList.length) {
    return (<div className="glass-card">
      Waiting for batting to begin… </div>
    );
  }

  const validInnings = inningsList.filter(
    inn => inn?.batting && inn.batting.length
  );

  if (!validInnings.length) {
    return (<div className="glass-card">
      Scorecard not available yet </div>
    );
  }

  const latestInnings = validInnings[validInnings.length - 1];
  const batting = latestInnings?.batting || [];

  const isActive = (player) => {
    const text = player?.["dismissal-text"];

    if (!text) return false;

    const t = text.toLowerCase();

    return t.includes("batting");
  };
  const sortedBatting = [...batting].sort((a, b) => {

    const aActive = isActive(a);
    const bActive = isActive(b);
    if (aActive !== bActive) return Number(bActive) - Number(aActive);

    return (b?.r ?? 0) - (a?.r ?? 0);


  });

  return (<div className="glass-card table-card">


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

            const dismissal = (player?.["dismissal-text"] || "").toLowerCase();
            const isNotOut = isActive(player);

            const balls = player?.b ?? 0;
            const runs = player?.r ?? 0;

            const strikeRate =
              balls > 0
                ? ((runs / balls) * 100).toFixed(2)
                : player?.sr ?? 0;

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

                  <Link href="/players" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                        whiteSpace: "nowrap"
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
