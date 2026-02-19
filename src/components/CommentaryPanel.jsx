export default function CommentaryPanel({ inningsList }) {

  const generateCommentary = () => {
    if (!inningsList?.length) return [];

    const lastInnings = inningsList[inningsList.length - 1];
    const batters = lastInnings?.batting || [];

    return batters.slice(0, 5).map(b => {
      const runs = b.r || b.runs || 0;

      if (runs >= 50) return `${b.batsman?.name || b.batsmanName} reaches fifty`;
      if (runs >= 30) return `${b.batsman?.name || b.batsmanName} looking solid`;
      if ((b.dismissal || "").includes("catch")) return `${b.batsman?.name} OUT caught`;

      return `${b.batsman?.name || b.batsmanName} rotating strike`;
    });
  };

  const commentary = generateCommentary();

  if (!commentary.length) return null;

  return (
    <div className="glass-card fade-in" style={{ marginTop: 24 }}>

      <h3 style={{ marginBottom: 16 }}>Live Commentary</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {commentary.map((c, i) => (
          <div key={i} style={{ fontSize: 14, color: "#94a3b8" }}>
            {c}
          </div>
        ))}
      </div>

    </div>
  );
}
