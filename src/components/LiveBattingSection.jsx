"use client";

export default function LiveBattingSection({ data }) {

  if (!data || data.type !== "live") return null;

  const inningsList = data?.scorecard?.scorecard || [];

  if (!inningsList.length) return null;

  // 🟢 Get latest innings (your API format)
  const latestInnings = inningsList[inningsList.length - 1];

  const batting = latestInnings?.batting || [];

  if (!batting.length) {
    return (
      <div className="glass-card">
        <h3>Batting</h3>
        <div style={{ opacity: 0.6 }}>No batting data yet</div>
      </div>
    );
  }

  // 🧠 Sort: current batsmen on top
  const sortedBatting = [...batting].sort((a, b) => {
    const aNotOut = (a?.["dismissal-text"] || "")
      .toLowerCase()
      .includes("not out");

    const bNotOut = (b?.["dismissal-text"] || "")
      .toLowerCase()
      .includes("not out");

    return bNotOut - aNotOut;
  });

  return (
    <div className="glass-card table-card">

      <h3 style={{ marginBottom: 16 }}>Live Batting</h3>

      <div className="table-wrapper">
       
        <table className="responsive-table batting-table">

          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Batsman</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>

          <tbody>
            {sortedBatting.map((player, index) => {

              const dismissal =
                (player?.["dismissal-text"] || "").toLowerCase();

              const isNotOut = dismissal.includes("not out");

              return (
                <tr
                  key={player?.batsman?.id || index}
                  className={isNotOut ? "current-batsman-row" : ""}
                >

                  <td style={{ textAlign: "left" }}>

                    {isNotOut && (
                      <span
                        style={{
                          color: "#22c55e",
                          marginRight: 6,
                          fontWeight: 700
                        }}
                      >
                        ●
                      </span>
                    )}

                    {player?.batsman?.name || "Unknown"}

                    {!isNotOut && player?.["dismissal-text"] && (
                      <div
                         style={{
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
    maxWidth: 220,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }}
                      >
                        {player["dismissal-text"]}
                      </div>
                    )}

                  </td>

                  <td>{player?.r ?? "-"}</td>
                  <td>{player?.b ?? "-"}</td>
                  <td>{player?.["4s"] ?? 0}</td>
                  <td>{player?.["6s"] ?? 0}</td>
                  <td>{player?.sr ?? "-"}</td>

                </tr>
              );
            })}
          </tbody>

        </table>
        </div>
      

    </div>
  );
}