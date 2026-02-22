export default function CommentaryPanel({ inningsList }) {

  const generateCommentary = () => {

    if (!inningsList?.length) return [];

    const lastInnings = inningsList[inningsList.length - 1];
    const batters = lastInnings?.batting || [];

    return batters.slice(0, 5).map(b => {

      const name = b?.batsman?.name || b?.batsmanName || "Batsman";
      const runs = Number(b?.r ?? b?.runs ?? 0);
      const dismissal = (b?.["dismissal-text"] || "").toLowerCase();

      if (dismissal.includes("not out") && runs >= 100)
        return `${name} is playing a brilliant century knock`;

      if (dismissal.includes("not out") && runs >= 50)
        return `${name} reaches a well deserved fifty`;

      if (dismissal.includes("caught"))
        return `${name} OUT — taken in the deep`;

      if (dismissal.includes("bowled"))
        return `${name} clean bowled`;

      if (dismissal.includes("lbw"))
        return `${name} trapped LBW`;

      if (runs >= 30)
        return `${name} building a steady innings`;

      return `${name} rotating the strike nicely`;

    });
  };

  const commentary = generateCommentary();

  return (
    <div className="glass-card fade-in" style={{ marginTop: 24 }}>

      <h3 style={{ marginBottom: 16 }}>Live Commentary</h3>

      {!commentary.length && (
        <div style={{ opacity: 0.6, fontSize: 13 }}>
          Waiting for commentary…
        </div>
      )}

      {!!commentary.length && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {commentary.map((c, i) => (
            <div key={`${c}-${i}`} style={{ fontSize: 14, color: "#94a3b8" }}>
              {c}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}