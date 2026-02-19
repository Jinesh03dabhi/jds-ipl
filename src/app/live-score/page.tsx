import type { Metadata } from "next";
import LiveScoreClient from "./LiveScoreClient";

export const metadata: Metadata = {
  title: "IPL 2026 Live Score – Ball by Ball Updates & Match Stats",
  description:
    "Get IPL 2026 live score updates, ball-by-ball commentary, team stats and match analytics. Follow every over with real-time match insights on JD’s IPL.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/live-score",
  },
  openGraph: {
    title: "IPL 2026 Live Score & Match Updates",
    description:
      "Live IPL match score, over-by-over updates and team performance insights.",
    url: "https://jds-ipl.vercel.app/live-score",
    type: "website",
  },
};

export default function LiveScorePage() {
  return <LiveScoreClient />;
}
