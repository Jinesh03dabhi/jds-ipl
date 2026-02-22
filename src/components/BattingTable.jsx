export default function BattingTable({ innings }) {

  if (!innings) return null;

  const batting = innings?.batting || [];

  const sortedBatting = [...batting].sort((a, b) => {
    const aCurrent = (a?.["dismissal-text"] || "").toLowerCase().includes("not out");
    const bCurrent = (b?.["dismissal-text"] || "").toLowerCase().includes("not out");
    return bCurrent - aCurrent;
  });

  return (
    <div className="glass-card fade-in table-card">

      <h3 className="table-title">
        {innings.title}
      </h3>

      <div className="table-wrapper">

        {!batting.length && (
          <div style={{ opacity: 0.6, padding: 12 }}>
            No batting data yet
          </div>
        )}

        {!!batting.length && (
          <table className="responsive-table">

            <thead>
              <tr>
                <th>Player</th>
                <th>Runs</th>
                <th>Balls</th>
                <th>SR</th>
              </tr>
            </thead>

            <tbody>
              {sortedBatting.map((p, i) => {

                const dismissal = (p?.["dismissal-text"] || "").toLowerCase();
                const isCurrent = dismissal.includes("not out");

                return (
                  <tr
                    key={p?.batsman?.id || i}
                    className={isCurrent ? "current-batsman-row" : ""}
                  >

                    <td>
                      {isCurrent && <span className="live-dot">●</span>}
                      {p?.batsman?.name || "Unknown"}

                      {!isCurrent && p?.["dismissal-text"] && (
                        <div className="dismissal-text">
                          {p["dismissal-text"]}
                        </div>
                      )}
                    </td>

                    <td>{p?.r ?? "-"}</td>
                    <td>{p?.b ?? "-"}</td>
                    <td>{p?.sr ?? "-"}</td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}