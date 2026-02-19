export default function BattingTable({ innings }) {

  if (!innings) return null;

  return (
    <div className="glass-card fade-in table-card">

      <h3 className="table-title">
        {innings.title}
      </h3>

      <div className="table-wrapper">
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
            {innings.batting?.map((p, i) => {

              // Detect current batsman (not out)
              const isCurrent =
                (p?.["dismissal-text"] || "").toLowerCase().includes("not out");

              return (
                <tr
                  key={i}
                  className={isCurrent ? "current-batsman-row" : ""}
                >
                  <td>
                    {isCurrent && <span className="live-dot">●</span>}{" "}
                    {p?.batsman?.name}
                  </td>
                  <td>{p?.r}</td>
                  <td>{p?.b}</td>
                  <td>{p?.sr}</td>
                </tr>
              );
            })}
          </tbody>



        </table>
      </div>

    </div>
  );
}
