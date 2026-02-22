export default function MatchTimeline({ status }) {

  const getPhase = () => {

    if (!status) return "Waiting";

    if (status.toLowerCase().includes("break")) return "Innings Break";

    const oversMatch = status.match(/\((\d+\.?\d*)\)/);

    if (!oversMatch) return "Pre Match";

    const overs = Number(oversMatch[1]);

    if (overs <= 6) return "Powerplay";
    if (overs <= 15) return "Middle Overs";
    if (overs <= 20) return "Death Overs";

    return "Completed";
  };

  const phase = getPhase();

  return (
    <div className="glass-card fade-in" style={{ marginTop: 20 }}>

      <div style={{ marginBottom: 10, fontWeight: 700 }}>
        Match Phase
      </div>

      <div style={{
        padding: "10px 14px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.04)",
        fontSize: 14
      }}>
        {phase}
      </div>

    </div>
  );
}