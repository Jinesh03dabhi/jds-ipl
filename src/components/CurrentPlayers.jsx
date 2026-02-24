"use client";

import OverLine from "./OverLine";
import { getMatchState } from "@/utils/getMatchState";

export default function CurrentPlayers({ data, balls = [] }) {

  const matchState = getMatchState(data);

  // ⭐ Only show when live
  if (matchState !== "live") return null;

  const inningsList = data?.scorecard?.scorecard || [];

  const validInnings = inningsList.filter(
    inn => inn?.batting && inn?.bowling
  );

  if (!validInnings.length) return null;

  const latestInnings = validInnings[validInnings.length - 1];

  const batting = latestInnings?.batting || [];
  const bowling = latestInnings?.bowling || [];

  // ⭐ Get current batsmen (not out)
  const currentBatsmen = batting.filter(player =>
    (player?.["dismissal-text"] || "")
      .toLowerCase()
      .includes("not out")
  );

  // fallback if API missing not-out
  const displayBatsmen =
    currentBatsmen.length ? currentBatsmen : batting.slice(-2);

  // ⭐ Detect current bowler (highest overs)
  const bowler =
    bowling.sort((a, b) => (b.o || 0) - (a.o || 0))[0];

  return (
    <div className="glass-card">

      <h3>Live Players</h3>

      <div className="current-grid">

        {/* Batsmen */}
        <div>

          <h4>Batsmen</h4>

          {displayBatsmen.length ? (
            displayBatsmen.map(player => (
              <div style={{ padding: "10px" }} key={player?.batsman?.id}>

                <span className="live-dot">●</span>

                {player?.batsman?.name || "Unknown"} — {player?.r ?? "-"} ({player?.b ?? "-"})

              </div>
            ))
          ) : (
            <div style={{ opacity: 0.6 }}>No batsmen yet</div>
          )}

        </div>

        {/* Bowler */}
        <div>

          <h4>Current Bowler</h4>

          <div style={{ padding: "10px" }}>
            <span className="live-dot">●</span>
            {bowler?.bowler?.name || "-"}
          </div>
          <div className="over-title">This Over</div>
          <OverLine balls={balls} />

        </div>

      </div>

    </div>
  );
}