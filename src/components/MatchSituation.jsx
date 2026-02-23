"use client";

export default function MatchSituation({ data }) {

  if (!data || data.type !== "live") return null;

  const match = data?.match;
  const scores = match?.score || [];

  if (!scores.length) return null;

  // 🟢 First innings
  const firstInnings = scores[0];

  // 🟢 Current innings
  const currentInnings = scores[scores.length - 1];

  // 🎯 Only show target logic in 2nd innings
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

  const target = firstInnings.r + 1;

  const runsScored = currentInnings.r;
  const overs = Number(currentInnings.o || 0);

  // 🧠 Convert overs to balls
  const convertOversToBalls = (oversValue) => {
    const parts = oversValue.toString().split(".");
    const fullOvers = Number(parts[0]);
    const balls = parts[1] ? Number(parts[1]) : 0;
    return fullOvers * 6 + balls;
  };

  const ballsBowled = convertOversToBalls(overs);
  const totalBalls = 20 * 6; // T20
  const ballsRemaining = totalBalls - ballsBowled;

  const runsNeeded = target - runsScored;

  const requiredRR =
    ballsRemaining > 0
      ? ((runsNeeded / ballsRemaining) * 6).toFixed(2)
      : "-";

  return (
    <div className="glass-card">

      <h3 style={{ marginBottom: 16 }}>Match Situation</h3>

      <div className="situation-grid">

        <div className="situation-box">
          <span className="label" style={{marginRight:"10px"}}>Target</span>
          <span className="value">{target}</span>
        </div>

        <div className="situation-box">
          <span className="label" style={{marginRight:"10px"}}>Runs Needed</span>
          <span className="value">
            {runsNeeded > 0 ? runsNeeded : 0}
          </span>
        </div>

        <div className="situation-box">
          <span className="label" style={{marginRight:"10px"}}>Balls Left</span>
          <span className="value">
            {ballsRemaining > 0 ? ballsRemaining : 0}
          </span>
        </div>

        <div className="situation-box">
          <span className="label" style={{marginRight:"10px"}}>Req. Run Rate</span>
          <span className="value">{requiredRR}</span>
        </div>

      </div>

    </div>
  );
}