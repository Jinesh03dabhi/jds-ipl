export default function LiveEventsPanel({ inningsList = [] }) {

  const generateEvents = () => {

    if (!inningsList.length) return [];

    const lastInnings = inningsList[inningsList.length - 1];
    const batters = lastInnings?.batting || [];

    const events = [];

    batters.forEach(b => {

      const name = b?.batsman?.name || b?.batsmanName || "Player";
      const runs = Number(b?.r ?? 0);
      const fours = Number(b?.["4s"] ?? 0);
      const sixes = Number(b?.["6s"] ?? 0);
      const dismissal = (b?.["dismissal-text"] || "").toLowerCase();

      // Wicket event (highest priority)
      if (dismissal && !dismissal.includes("not out")) {
        events.push({
          type: "wicket",
          player: name,
          text: dismissal
        });
        return;
      }

      // Century
      if (runs >= 100) {
        events.push({
          type: "info",
          player: name,
          text: "Scored a century"
        });
        return;
      }

      // Fifty
      if (runs >= 50) {
        events.push({
          type: "info",
          player: name,
          text: "Reached fifty"
        });
        return;
      }

      // Big hitting
      if (sixes >= 3) {
        events.push({
          type: "6",
          player: name,
          text: `${sixes} sixes so far`
        });
        return;
      }

      if (fours >= 4) {
        events.push({
          type: "4",
          player: name,
          text: `${fours} fours played`
        });
      }

    });

    return events.slice(0, 5);
  };

  const events = generateEvents();

  const fallbackEvents = [
    { type: "info", player: "", text: "Waiting for live match highlights…" },
    { type: "info", player: "", text: "Events will update automatically" }
  ];

  const displayEvents = events.length ? events : fallbackEvents;

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
          <div
            key={`${e.player}-${e.text}-${i}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.03)"
            }}
          >

            <div>
              {e.player && <strong>{e.player}</strong>}
              {e.player && " — "}
              {e.text}
            </div>

            <div
              style={{
                background: getColor(e.type),
                padding: "4px 10px",
                borderRadius: 6,
                fontWeight: 700,
                color: "#fff"
              }}
            >
              {e.type?.toUpperCase?.() || ""}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}