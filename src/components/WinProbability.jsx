export default function WinProbability({ status }) {

  const calculateProbability = () => {

    if (!status) return 50;

    const scoreMatch = status.match(/(\d+)\/(\d+)/);
    const oversMatch = status.match(/\((\d+\.?\d*)\)/);

    if (!scoreMatch || !oversMatch) return 50;

    const runs = Number(scoreMatch[1]);
    const wickets = Number(scoreMatch[2]);
    const overs = Number(oversMatch[1]);

    // Simple cricket logic formula
    let probability = (runs / (overs * 6)) * 10;

    probability -= wickets * 2;

    probability = Math.max(5, Math.min(95, probability));

    return Math.round(probability);
  };

  const team1Chance = calculateProbability();
  const team2Chance = 100 - team1Chance;

  return (
    <div className="glass-card fade-in" style={{ marginTop: 20 }}>

      <div style={{ marginBottom: 10, fontWeight: 700 }}>
        Win Probability
      </div>

      <div style={{
        height: 12,
        borderRadius: 10,
        overflow: "hidden",
        background: "rgba(255,255,255,0.08)",
        display: "flex"
      }}>
        <div style={{
          width: `${team1Chance}%`,
          background: "#22c55e"
        }} />
        <div style={{
          width: `${team2Chance}%`,
          background: "#ef4444"
        }} />
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 6,
        fontSize: 12,
        color: "#94a3b8"
      }}>
        <span>{team1Chance}%</span>
        <span>{team2Chance}%</span>
      </div>

    </div>
  );
}