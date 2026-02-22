export default function BowlingTable({ innings }) {

  if (!innings) return null;

  const bowling = innings?.bowling || [];

  return (
    <div className="glass-card fade-in table-card">

      <h3 className="table-title">
        {innings.title} Bowling
      </h3>

      <div className="table-wrapper">

        {!bowling.length && (
          <div style={{ opacity: 0.6, padding: 12 }}>
            No bowling data yet
          </div>
        )}

        {!!bowling.length && (
          <table className="responsive-table">

            <thead>
              <tr>
                <th>Bowler</th>
                <th>Overs</th>
                <th>Runs</th>
                <th>Wickets</th>
                <th>Econ</th>
              </tr>
            </thead>

            <tbody>
              {bowling.map((p, i) => {

                const econ = p?.o
                  ? (p?.r / p?.o).toFixed(2)
                  : "-";

                return (
                  <tr key={p?.bowler?.id || i}>

                    <td>
                      {p?.bowler?.name || "Unknown"}
                    </td>

                    <td>{p?.o ?? "-"}</td>
                    <td>{p?.r ?? "-"}</td>
                    <td>{p?.w ?? "-"}</td>
                    <td>{econ}</td>

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