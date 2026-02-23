import OverLine from "./OverLine";

export default function CurrentPlayers({ batting = [], bowling = [], balls = []  }) {

  const current = [...batting].sort((a,b)=>b.b-a.b).slice(0,2);

  const bowler = bowling?.[0];

  return (
    <div className="glass-card">
      <h3>Live Players</h3>

      <div className="current-grid">

        <div>
          <h4>Batsmen</h4>
          {current.map(p => (
            <div style={{padding:"10px"}} key={p.batsman?.id}>
              {current && <span className="live-dot">●</span>}
              {p.batsman?.name} — {p.r} ({p.b})
              
            </div>
          ))}
        </div>

        <div >
          <h4>Bowler</h4>
          <div style={{padding:"10px"}}><span className="live-dot">●</span>{bowler?.bowler?.name || "-"}</div>
          <OverLine balls={balls} />
        </div>

      </div>
    </div>
  );
}