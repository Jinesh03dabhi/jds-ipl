export default function MatchProgressBar() {
  return (
    <div className="glass-card fade-in" style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 10, fontWeight: 700 }}>Match Progress</div>

      <div style={{
        height: 10,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 10,
        overflow: "hidden"
      }}>
        <div style={{
          width: "72%",
          height: "100%",
          background: "linear-gradient(to right, #2563eb, #22c55e)"
        }}></div>
      </div>
    </div>
  );
}
