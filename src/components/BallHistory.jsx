export default function BallHistory({ balls = [] }) {

  const hasBalls = balls && balls.length > 0;

  return (
    <div className="glass-card fade-in" style={{ marginTop: 20 }}>

      <div style={{ marginBottom: 12, fontWeight: 700 }}>
        Last Over
      </div>

      {!hasBalls && (
        <div style={{ opacity: 0.6, fontSize: 13 }}>
          Waiting for live balls…
        </div>
      )}

      {hasBalls && (
        <div className="ball-history-row">

          {balls.map((ball, i) => {

            let className = "ball-dot";

            if (ball === "4") className += " four";
            else if (ball === "6") className += " six";
            else if (ball === "W") className += " wicket";
            else if (ball === ".") className += " dot";
            else className += " run";

            return (
              <div key={`${ball}-${i}`} className={`${className} pop`}>
                {ball}
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}