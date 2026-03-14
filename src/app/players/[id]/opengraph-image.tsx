import { ImageResponse } from "next/og";
import { PLAYERS } from "@/lib/data";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Props = {
  params: { id: string };
};

export default function PlayerOpenGraphImage({ params }: Props) {
  const player = PLAYERS.find((p) => p.id === params.id);
  const title = player ? player.name : "IPL Player Profile";
  const team = player?.currentTeam ?? "IPL Team";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #020617 0%, #111827 60%, #1f2937 100%)",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.4), transparent 45%), radial-gradient(circle at 85% 40%, rgba(34, 197, 94, 0.35), transparent 45%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          <div style={{ fontSize: 22, color: "#93c5fd", letterSpacing: 2 }}>
            IPL Scorebook
          </div>
          <div style={{ fontSize: 56, fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: 28, color: "#e2e8f0" }}>{team}</div>
          <div style={{ fontSize: 20, color: "#cbd5f5" }}>
            IPL player stats and auction profile
          </div>
        </div>
      </div>
    ),
    size
  );
}
