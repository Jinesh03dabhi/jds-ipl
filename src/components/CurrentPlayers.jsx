"use client";

import { getMatchState } from "@/utils/getMatchState";
import { useState } from "react";
import Link from "next/link";

function getCurrentBowlerFromScorecard(bowling, balls) {
  if (balls?.length) {
    const lastBall = balls[balls.length - 1];
    const bowlerFromBall = lastBall?.bowler;

    const matchedBowler = bowling.find(
      (player) => player?.bowler?.name === bowlerFromBall,
    );

    if (matchedBowler) {
      return matchedBowler;
    }
  }

  const activeBowler = bowling.find((player) => {
    const overs = player?.o?.toString();
    return overs?.includes(".") && !overs.endsWith(".0");
  });

  if (activeBowler) {
    return activeBowler;
  }

  return [...bowling].sort((left, right) => (right.o || 0) - (left.o || 0))[0] || null;
}

export default function CurrentPlayers({ data, balls = [] }) {
  const [showHistory, setShowHistory] = useState(false);

  const matchState = getMatchState(data);
  const inningsList = data?.scorecard?.scorecard || [];
  const validInnings = inningsList.filter(
    (innings) => innings?.batting && innings?.bowling,
  );
  const latestInnings = validInnings[validInnings.length - 1];
  const batting = latestInnings?.batting || [];
  const bowling = latestInnings?.bowling || [];
  const liveBatters = data?.match?.liveContext?.currentBatters || [];
  const liveBowler = data?.match?.liveContext?.currentBowler || null;
  const hasScorecardContext = validInnings.length > 0;

  const scorecardBatters = batting.filter((player) =>
    (player?.["dismissal-text"] || "").toLowerCase().includes("batting"),
  );

  const displayBatsmen = hasScorecardContext
    ? scorecardBatters.length
      ? scorecardBatters
      : batting.slice(-2)
    : liveBatters;

  const currentBowler = hasScorecardContext
    ? getCurrentBowlerFromScorecard(bowling, balls)
    : liveBowler;

  const sortedBowling = hasScorecardContext
    ? [...bowling].sort((left, right) => (right.o || 0) - (left.o || 0))
    : [];

  if (matchState !== "live") return null;
  if (!displayBatsmen.length && !currentBowler) return null;

  return (
    <div className="glass-card">
      <h3>Live Players</h3>

      <div className="current-grid">
        <div>
          <h4>Batsmen</h4>

          {displayBatsmen.length ? (
            displayBatsmen.map((player, index) => (
              <div
                style={{ padding: "10px" }}
                key={player?.batsman?.id || player?.name || index}
              >
                <span className="live-dot">*</span>
                <Link href="/players" style={{ textDecoration: "none", color: "inherit" }}>
                  {player?.batsman?.name || player?.name || "Unknown"}
                </Link>{" "}
                - {player?.r ?? player?.runs ?? "-"} ({player?.b ?? player?.balls ?? "-"})
              </div>
            ))
          ) : (
            <div style={{ opacity: 0.6 }}>
              No batsmen yet
            </div>
          )}
        </div>

        <div>
          <h4>Current Bowler</h4>

          <div style={{ padding: "10px" }}>
            <span className="live-dot">*</span>
            <Link href="/players" style={{ textDecoration: "none", color: "inherit" }}>
              {currentBowler?.bowler?.name || currentBowler?.name || "-"}
            </Link>

            {currentBowler && (
              <div style={{ fontSize: 14, opacity: 0.8, marginTop: 6 }}>
                Over: {currentBowler?.o ?? currentBowler?.overs ?? "-"} |
                Run: {currentBowler?.r ?? currentBowler?.runs ?? "-"} |
                Wickets: {currentBowler?.w ?? currentBowler?.wickets ?? "-"}
              </div>
            )}
          </div>
        </div>
      </div>

      {sortedBowling.length > 0 && showHistory && (
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

      {sortedBowling.length > 0 && (
        <button
          className="btn-primary"
          onClick={() => setShowHistory(!showHistory)}
          style={{ marginTop: 24, width: "100%" }}
        >
          {showHistory
            ? "Hide Bowling History"
            : "Show Bowling History"}
        </button>
      )}
    </div>
  );
}
