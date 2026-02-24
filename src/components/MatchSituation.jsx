"use client";

import { getMatchState } from "@/utils/getMatchState";
import WinnerCard from "@/components/WinnerCard";

export default function MatchSituation({ data }) {

  const matchState = getMatchState(data);

  if (matchState !== "live") return null;

  const inningsList = data?.scorecard?.scorecard || [];

  if (!inningsList.length) {
    return (
      <div className="glass-card">
        Match has not started yet
      </div>
    );
  }

  // ⭐ First innings totals
  const firstTotals = inningsList[0]?.totals || {};

  // ⭐ Current innings totals
  const currentTotals =
    inningsList[inningsList.length - 1]?.totals || {};

  const target = firstTotals?.r ? firstTotals.r + 1 : null;

  // ⭐ If still first innings
  if (inningsList.length < 2 || !target) {
    return (
      <div className="glass-card">
        <h3>Match Situation</h3>
        <div style={{ opacity: 0.7 }}>
          First innings in progress
        </div>
      </div>
    );
  }

  const runsScored = currentTotals?.r ?? 0;
  const oversValue = currentTotals?.o ?? 0;

  // 🧠 Convert overs to balls safely
  const convertOversToBalls = (overs) => {
    const [full, balls] = overs.toString().split(".");
    return Number(full) * 6 + Number(balls || 0);
  };

  const ballsBowled = convertOversToBalls(oversValue);

  // ⭐ Detect match format
  const format = data?.match?.matchType?.toLowerCase();

  let totalBalls;

  if (format === "t20") totalBalls = 20 * 6;
  else if (format === "odi") totalBalls = 50 * 6;
  else totalBalls = 90 * 6; // fallback for tests

  const ballsRemaining = Math.max(totalBalls - ballsBowled, 0);

  const runsNeeded = Math.max(target - runsScored, 0);

  const status = data?.match?.status?.toLowerCase();

if (status.includes("won")) {
  const winner = status.split("won")[0];
  return <WinnerCard teamName={winner} />;
}

  const requiredRR =
    ballsRemaining > 0
      ? ((runsNeeded / ballsRemaining) * 6).toFixed(2)
      : "-";

  return (
    <div className="glass-card">

      <h3 style={{ marginBottom: 16 }}>Match Situation</h3>

      <div className="situation-grid">

        <div className="situation-box">
          <span className="label">Target</span>
          <span className="value">{target}</span>
        </div>

        <div className="situation-box">
          <span className="label">Runs Needed</span>
          <span className="value">{runsNeeded}</span>
        </div>

        <div className="situation-box">
          <span className="label">Balls Left</span>
          <span className="value">{ballsRemaining}</span>
        </div>

        <div className="situation-box">
          <span className="label">Req. Run Rate</span>
          <span className="value">{requiredRR}</span>
        </div>

      </div>

    </div>
  );
}