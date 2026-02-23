"use client";

export default function LiveBowlingSection({ data }) {

  if (!data || data.type !== "live") return null;

  const inningsList = data?.scorecard?.scorecard || [];

  if (!inningsList.length) return null;

  const latestInnings = inningsList[inningsList.length - 1];

  const bowling = latestInnings?.bowling || [];

  if (!bowling.length) {
    return (
      <div className="glass-card">
        <h3>Bowling</h3>
        <div style={{ opacity: 0.6 }}>No bowling data yet</div>
      </div>
    );
  }

  // 🧠 Convert overs like 1.3 → 1 over + 3 balls
  const convertOversToBalls = (overs) => {
    if (!overs && overs !== 0) return 0;

    const parts = overs.toString().split(".");
    const fullOvers = Number(parts[0]);
    const balls = parts[1] ? Number(parts[1]) : 0;

    return fullOvers * 6 + balls;
  };

  return (
    <div className="glass-card table-card">

      <h3 style={{ marginBottom: 16 }}>Live Bowling</h3>

      <div className="table-wrapper">

        <table className="responsive-table">

          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Bowler</th>
              <th>O</th>
              <th>M</th>
              <th>R</th>
              <th>W</th>
              <th>Econ</th>
            </tr>
          </thead>

          <tbody>
            {bowling.map((player, index) => {

              const ballsBowled = convertOversToBalls(player?.o);
              const economy =
                ballsBowled > 0
                  ? ((player?.r / ballsBowled) * 6).toFixed(2)
                  : "-";

              return (
                <tr key={player?.bowler?.id || index}>

                  <td style={{ textAlign: "left" }}>
                    {player?.bowler?.name || "Unknown"}
                  </td>

                  <td>{player?.o ?? "-"}</td>
                  <td>{player?.m ?? 0}</td>
                  <td>{player?.r ?? 0}</td>
                  <td>{player?.w ?? 0}</td>
                  <td>{economy}</td>

                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

    </div>
  );
}