export default function MatchProgressBar({ status }) {

  const getProgress = () => {

    if (!status) return { percent: 0, label: "Waiting for match…" };

    // Extract overs like (15.3)
    const oversMatch = status.match(/\((\d+\.?\d*)\)/);

    if (!oversMatch) {
      if (status.toLowerCase().includes("break"))
        return { percent: 100, label: "Innings Break" };

      if (status.toLowerCase().includes("won"))
        return { percent: 100, label: "Match Completed" };

      return { percent: 0, label: status };
    }

    const overs = parseFloat(oversMatch[1]);

    // T20 total overs = 20
    const percent = Math.min((overs / 20) * 100, 100);

    return {
      percent,
      label: `${overs} overs`
    };
  };

  const { percent, label } = getProgress();

  return (
    <div className="glass-card fade-in" style={{ marginTop: 20 }}>

      <div style={{ marginBottom: 10, fontWeight: 700 }}>
        Match Progress
      </div>

      <div style={{
        height: 10,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 10,
        overflow: "hidden"
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: "linear-gradient(to right, #2563eb, #22c55e)",
          transition: "width 0.6s ease"
        }}></div>
      </div>

      <div style={{
        marginTop: 6,
        fontSize: 12,
        color: "#94a3b8"
      }}>
        {label} • {Math.round(percent)}%
      </div>

    </div>
  );
}