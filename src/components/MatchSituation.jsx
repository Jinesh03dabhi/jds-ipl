"use client";

import { getMatchState } from "@/utils/getMatchState";
import WinnerCard from "@/components/WinnerCard";

function parseScore(scoreText) {
  if (!scoreText) {
    return null;
  }

  const match = String(scoreText).match(/(\d+)\/(\d+)\s+\(([\d.]+)\)/);
  if (!match) {
    return null;
  }

  return {
    runs: Number(match[1]),
    wickets: Number(match[2]),
    overs: match[3],
  };
}

function oversToBalls(overs) {
  const [full, balls] = String(overs || "0").split(".");
  return Number(full) * 6 + Number(balls || 0);
}

export default function MatchSituation({ data }) {
  const matchState = getMatchState(data);

  if (matchState !== "live" && matchState !== "completed") return null;

  const match = data?.match;
  const score1 = parseScore(match?.score?.team1);
  const score2 = parseScore(match?.score?.team2);
  const summaryLine = match?.liveContext?.chaseText || match?.liveContext?.commentary || data?.message;

  if (matchState === "completed") {
    return <WinnerCard teamName={match?.result || match?.winner || "Match completed"} />;
  }

  if (!score1 && !score2) {
    return <div className="glass-card">{summaryLine || "Waiting for innings to begin..."}</div>;
  }

  if (score1 && !score2) {
    return (
      <div className="glass-card">
        <h3 style={{ marginBottom: 16 }}>Match Situation</h3>
        <div style={{ opacity: 0.7 }}>
          {summaryLine || `${match?.team2?.shortName || "Chasing side"} have not started the chase yet.`}
        </div>
      </div>
    );
  }

  if (!score1 || !score2) {
    return <div className="glass-card">{summaryLine || "Match in progress"}</div>;
  }

  const target = score1.runs + 1;
  const ballsBowled = oversToBalls(score2.overs);
  const totalBalls = 20 * 6;
  const ballsRemaining = Math.max(totalBalls - ballsBowled, 0);
  const runsNeeded = Math.max(target - score2.runs, 0);
  const requiredRR = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : "-";

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: 16 }}>Match Situation</h3>

      <div className="situation-grid">
        <div className="situation-box">
          <span className="label">Target</span>
          <span style={{ margin: "5px" }} className="value">{target}</span>
        </div>

        <div className="situation-box">
          <span className="label">Runs Needed</span>
          <span style={{ margin: "5px" }} className="value">{runsNeeded}</span>
        </div>

        <div className="situation-box">
          <span className="label">Balls Left</span>
          <span style={{ margin: "5px" }} className="value">{ballsRemaining}</span>
        </div>

        <div className="situation-box">
          <span className="label">Req. Run Rate</span>
          <span style={{ margin: "5px" }} className="value">{requiredRR}</span>
        </div>
      </div>

      {summaryLine && (
        <div style={{ marginTop: 16, opacity: 0.7 }}>
          {summaryLine}
        </div>
      )}
    </div>
  );
}
