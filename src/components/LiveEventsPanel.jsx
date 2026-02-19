export default function LiveEventsPanel({ inningsList = [] }) {

  const generateEvents = () => {

    if (!inningsList.length) return [];

    const lastInnings = inningsList[inningsList.length - 1];
    const batters = lastInnings?.batting || [];

    const events = [];

    batters.forEach(b => {

      const name = b?.batsman?.name || b?.batsmanName || "Player";

      // Boundary detection
      if (b["6s"] > 0) {
        events.push({
          type: "6",
          player: name,
          text: `${b["6s"]} sixes smashed`
        });
      }

      if (b["4s"] > 0) {
        events.push({
          type: "4",
          player: name,
          text: `${b["4s"]} fours played`
        });
      }

      // Wicket
      if ((b.dismissal || "").toLowerCase().includes("catch") ||
          (b.dismissal || "").toLowerCase().includes("bowled")) {
        events.push({
          type: "wicket",
          player: name,
          text: "WICKET!"
        });
      }

      // Milestone
      if (b.r >= 50) {
        events.push({
          type: "info",
          player: name,
          text: "Reached fifty"
        });
      }

    });

    return events.slice(0, 6);
  };

  const events = generateEvents();

  const fallbackEvents = [
    { type: "info", player: "", text: "Waiting for live events..." },
    { type: "info", player: "", text: "Events will appear automatically" }
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  const getColor = (type) => {
    if (type === "4") return "#22c55e";
    if (type === "6") return "#a855f7";
    if (type === "wicket") return "#ef4444";
    return "#64748b";
  };

  return (
    <div className="glass-card fade-in" style={{ marginTop: 24 }}>

      <h3 style={{ marginBottom: 16 }}>Live Events</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {displayEvents.map((e, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.03)"
          }}>

            <div>
              <strong>{e.player}</strong> — {e.text}
            </div>

            <div style={{
              background: getColor(e.type),
              padding: "4px 10px",
              borderRadius: 6,
              fontWeight: 700,
              color: "#fff"
            }}>
              {e.type?.toUpperCase?.() || ""}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
