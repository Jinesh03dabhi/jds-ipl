"use client";

import { getMatchState } from "@/utils/getMatchState";
import WinnerCard from "@/components/WinnerCard";

export default function MatchSituation({ data }) {

  const matchState = getMatchState(data);

  if (matchState !== "live" && matchState !== "completed") return null;

  const status = (data?.match?.status || "").toLowerCase();

  // ⭐ Finished Match Detection
  if (
    status.includes("won") ||
    status.includes("tie") ||
    status.includes("no result") ||
    status.includes("abandoned")
  ) {
    return <WinnerCard teamName={data?.match?.status} />;
  }

  /* ----------------------------------------------------
     USE match.score FOR SITUATION (NOT scorecard.scorecard)
  ---------------------------------------------------- */

  const scores = data?.match?.score || [];

  if (!scores.length) {
    return (
      <div className="glass-card">
        Waiting for innings to begin…
      </div>
    );
  }

  // ⭐ If only 1 innings → first innings in progress
  if (scores.length < 2) {
    return (
      <div className="glass-card">
        <h3>Match Situation</h3>
        <div style={{ opacity: 0.7 }}>
          First innings in progress
        </div>
      </div>
    );
  }

  const firstInnings = scores[0];
  const secondInnings = scores[1];

  const target = firstInnings?.r
    ? Number(firstInnings.r) + 1
    : null;

  if (!target) {
    return (
      <div className="glass-card">
        Match in progress
      </div>
    );
  }

  const runsScored = Number(secondInnings?.r ?? 0);
  const oversValue = secondInnings?.o ?? 0;

  const convertOversToBalls = (overs) => {
    if (!overs && overs !== 0) return 0;
    const [full, balls] = overs.toString().split(".");
    return Number(full) * 6 + Number(balls || 0);
  };

  const ballsBowled = convertOversToBalls(oversValue);

  const format = data?.match?.matchType?.toLowerCase();

  let totalBalls = null;

  if (format === "t20") totalBalls = 20 * 6;
  if (format === "odi") totalBalls = 50 * 6;

  if (!totalBalls) {
    return (
      <div className="glass-card">
        Match in progress
      </div>
    );
  }

  const ballsRemaining = Math.max(totalBalls - ballsBowled, 0);
  const runsNeeded = Math.max(target - runsScored, 0);

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
          <span style={{margin:"5px"}} className=" value">{target}</span>
        </div>

        <div className="situation-box">
          <span className="label">Runs Needed</span>
          <span style={{margin:"5px"}} className="value">{runsNeeded}</span>
        </div>

        <div className="situation-box">
          <span className="label">Balls Left</span>
          <span style={{margin:"5px"}} className="value">{ballsRemaining}</span>
        </div>

        <div className="situation-box">
          <span className="label">Req. Run Rate</span>
          <span style={{margin:"5px"}} className="value">{requiredRR}</span>
        </div>

      </div>

    </div>
  );
}