"use client";

import { getMatchState } from "@/utils/getMatchState";
import { useState, useMemo } from "react";

export default function CurrentPlayers({ data, balls = [] }) {

  const [showHistory, setShowHistory] = useState(false);

  const matchState = getMatchState(data);
  if (matchState !== "live") return null;

  const inningsList = data?.scorecard?.scorecard || [];

  const validInnings = inningsList.filter(
    inn => inn?.batting && inn?.bowling
  );

  if (!validInnings.length) return null;

  const latestInnings = validInnings[validInnings.length - 1];

  const batting = latestInnings?.batting || [];
  const bowling = latestInnings?.bowling || [];

  /* -------------------- ACTIVE BATSMEN -------------------- */

  const currentBatsmen = batting.filter(player =>
    (player?.["dismissal-text"] || "")
      .toLowerCase()
      .includes("batting")
  );

  const displayBatsmen =
    currentBatsmen.length ? currentBatsmen : batting.slice(-2);

  /* -------------------- CURRENT BOWLER -------------------- */

  const getCurrentBowler = () => {

    // 1️⃣ Best method: Use last ball data
    if (balls?.length) {
      const lastBall = balls[balls.length - 1];
      const nameFromBall = lastBall?.bowler;

      const found = bowling.find(
        b => b.bowler?.name === nameFromBall
      );

      if (found) return found;
    }

    // 2️⃣ Fallback: detect incomplete over (e.g., 3.4)
    const active = bowling.find(b => {
      const o = b.o?.toString();
      return o?.includes(".") && !o?.endsWith(".0");
    });

    if (active) return active;

    // 3️⃣ Last fallback: highest overs
    return [...bowling].sort(
      (a, b) => (b.o || 0) - (a.o || 0)
    )[0];
  };

  const currentBowler = getCurrentBowler();

  const sortedBowling = useMemo(() => {
    return [...bowling].sort(
      (a, b) => (b.o || 0) - (a.o || 0)
    );
  }, [bowling]);

  return (
    <div className="glass-card">

      <h3>Live Players</h3>

      <div className="current-grid">

        {/* Batsmen */}
        <div>
          <h4>Batsmen</h4>

          {displayBatsmen.length ? (
            displayBatsmen.map(player => (
              <div
                style={{ padding: "10px" }}
                key={player?.batsman?.id}
              >
                <span className="live-dot">●</span>
                {player?.batsman?.name || "Unknown"} — 
                {" "}
                {player?.r ?? "-"} ({player?.b ?? "-"})
              </div>
            ))
          ) : (
            <div style={{ opacity: 0.6 }}>
              No batsmen yet
            </div>
          )}
        </div>

        {/* Current Bowler */}
        <div>
          <h4>Current Bowler</h4>

          <div style={{ padding: "10px" }}>
            <span className="live-dot">●</span>
            {currentBowler?.bowler?.name || "-"}

            {currentBowler && (
              <div style={{ fontSize: 14, opacity: 0.8, marginTop: 6 }}>
                Over: {currentBowler.o} | 
                Run: {currentBowler.r} | 
                Wickets: {currentBowler.w}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* -------------------- BOWLING HISTORY -------------------- */}

      {showHistory && (
        <div style={{ marginTop: 20 }}>

          <h4>Bowling Summary</h4>

          <div className="table-wrapper">
            <table className="responsive-table">

              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Bowler</th>
                  <th>O</th>
                  <th>R</th>
                  <th>W</th>
                  <th>M</th>
                </tr>
              </thead>

              <tbody>
                {sortedBowling.map((player, index) => (
                  <tr
                    key={player?.bowler?.id || index}
                    className={
                      player?.bowler?.name === currentBowler?.bowler?.name
                        ? "current-bowler-row"
                        : ""
                    }
                  >
                    <td style={{ textAlign: "left" }}>
                      {player?.bowler?.name}
                    </td>
                    <td>{player?.o ?? 0}</td>
                    <td>{player?.r ?? 0}</td>
                    <td>{player?.w ?? 0}</td>
                    <td>{player?.m ?? 0}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      )}

      <button
        onClick={() => setShowHistory(!showHistory)}
        style={{ marginTop: 16 }}
      >
        {showHistory
          ? "Hide Bowling History"
          : "Show Bowling History"}
      </button>

    </div>
  );
}