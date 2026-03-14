import type { Metadata } from "next";
import LiveScoreClient from "./LiveScoreClient";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL 2026 Live Score - Ball by Ball Updates | IPL Scorebook",
  description:
    "Follow IPL 2026 live cricket score coverage with IPL match today details, ball by ball commentary and real-time updates for every over. Check now.",
  keywords: [
    "ipl 2026 live score",
    "live cricket score",
    "ipl match today",
    "real-time updates",
    "ball by ball commentary",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/live-score`,
    languages: {
      en: `${baseUrl}/live-score`,
    },
  },
  openGraph: {
    title: "IPL 2026 Live Score - Ball by Ball Updates | IPL Scorebook",
    description:
      "Follow IPL 2026 live cricket score coverage with IPL match today details, ball by ball commentary and real-time updates for every over. Check now.",
    url: `${baseUrl}/live-score`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL 2026 live score preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Live Score - Ball by Ball Updates | IPL Scorebook",
    description:
      "Follow IPL 2026 live cricket score coverage with IPL match today details, ball by ball commentary and real-time updates for every over. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function LiveScorePage() {
  return <LiveScoreClient />;
}
