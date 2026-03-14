import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e293b 100%)",
          color: "#e2e8f0",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.35), transparent 45%), radial-gradient(circle at 80% 30%, rgba(234, 179, 8, 0.3), transparent 40%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#93c5fd",
            }}
          >
            IPL Scorebook
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, color: "#f8fafc" }}>
            IPL 2026 Analytics
          </div>
          <div style={{ fontSize: 28, color: "#cbd5f5" }}>
            Live Scores, Auction Data, Player Stats
          </div>
        </div>
      </div>
    ),
    size
  );
}
