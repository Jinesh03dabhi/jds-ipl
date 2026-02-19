export default function BallHistory({ balls = [] }) {

  if (!balls.length) return null;

  return (
    <div className="glass-card fade-in" style={{ marginTop: 20 }}>

      <div style={{ marginBottom: 12, fontWeight: 700 }}>
        Last Over
      </div>

      <div className="ball-history-row">
        {balls.map((ball, i) => {

          let className = "ball-dot";

          if (ball === "4") className += " four";
          if (ball === "6") className += " six";
          if (ball === "W") className += " wicket";
          if (ball === ".") className += " dot";

          return (
            <div key={i} className={className}>
              {ball}
            </div>
          );
        })}
      </div>

    </div>
  );
}
