"use client";

import { getMatchState } from "@/utils/getMatchState";

export default function LiveBowlingSection({ data }) {

  const matchState = getMatchState(data);

  // ⭐ Hide when no score available
  if (matchState === "upcoming" || matchState === "waiting") {
    return null;
  }

  const inningsList = data?.scorecard?.scorecard || [];

  // ⭐ Filter valid innings
  const validInnings = inningsList.filter(
    inn => inn?.bowling && inn.bowling.length
  );

  if (!validInnings.length) {
    return (
      <div className="glass-card">
        <h3>Bowling</h3>
        <div style={{ opacity: 0.6 }}>No bowling data available</div>
      </div>
    );
  }

  const latestInnings = validInnings[validInnings.length - 1];
  const bowling = latestInnings?.bowling || [];

  // 🧠 Convert overs safely
  const convertOversToBalls = (overs) => {
    if (!overs && overs !== 0) return 0;

    const [full, balls] = overs.toString().split(".");
    return Number(full) * 6 + Number(balls || 0);
  };

  return (
    <div className="glass-card table-card">

      <h3 style={{ marginBottom: 16 }}>
        {matchState === "live" ? "Live Bowling" : "Bowling Scorecard"}
      </h3>

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

              const runs = Number(player?.r ?? 0);
              const overs = player?.o ?? 0;
              const ballsBowled = convertOversToBalls(overs);

              const economy =
                ballsBowled > 0
                  ? ((runs / ballsBowled) * 6).toFixed(2)
                  : "-";

              return (
                <tr key={player?.bowler?.id || index}>

                  <td style={{ textAlign: "left" }}>
                    {player?.bowler?.name || "Unknown"}
                  </td>

                  <td>{overs}</td>
                  <td>{player?.m ?? 0}</td>
                  <td>{runs}</td>
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