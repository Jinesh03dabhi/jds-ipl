export default function BowlingTable({ innings }) {

  if (!innings) return null;

  return (
    <div className="glass-card fade-in table-card">

      <h3 className="table-title">
        {innings.title} Bowling
      </h3>

      <div className="table-wrapper">
        <table className="responsive-table">

          <thead>
            <tr>
              <th>Bowler</th>
              <th>Overs</th>
              <th>Runs</th>
              <th>Wickets</th>
            </tr>
          </thead>

         <tbody>
            {innings.bowling?.map((p, i) => {

              // Current bowler usually first entry
              const isCurrentBowler = i === 0;

              return (
                <tr
                  key={i}
                  className={isCurrentBowler ? "current-bowler-row" : ""}
                >
                  <td>
                    {isCurrentBowler && <span className="bowler-dot">●</span>}{" "}
                    {p?.bowler?.name}
                  </td>
                  <td>{p?.o}</td>
                  <td>{p?.r}</td>
                  <td>{p?.w}</td>
                </tr>
              );
            })}
          </tbody>



        </table>
      </div>

    </div>
  );
}
