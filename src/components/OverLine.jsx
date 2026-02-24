"use client";

export default function OverLine({ balls = [] }) {

  // ⭐ If no data
  if (!balls || balls.length === 0) {
    return (
      <div className="overline-empty">
        Waiting for over data…
      </div>
    );
  }

  // 🎨 Decide color class
  const getBallClass = (ball) => {
    if (ball === "W") return "ball wicket";
    if (ball === ".") return "ball dot";
    if (ball === "4") return "ball four";
    if (ball === "6") return "ball six";
    return "ball run";
  };

  return (
    <div className="overline">

      {balls.map((ball, index) => (
        <div key={index} className={getBallClass(ball)}>
          {ball === "." ? "•" : ball}
        </div>
      ))}

    </div>
  );
}