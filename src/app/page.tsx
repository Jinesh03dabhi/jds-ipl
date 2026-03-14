import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL 2026 Stats, Live Score & Auction Data | IPL Scorebook",
  description:
    "Your ultimate IPL 2026 hub for live scores, auction prices, player stats, team standings and historical analytics in one place. Check now.",
  keywords: [
    "ipl 2026 stats",
    "ipl live score",
    "ipl auction data",
    "ipl player stats",
    "ipl team standings",
    "ipl analytics",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      en: baseUrl,
    },
  },
  openGraph: {
    title: "IPL 2026 Stats, Live Score & Auction Data | IPL Scorebook",
    description:
      "Your ultimate IPL 2026 hub for live scores, auction prices, player stats, team standings and historical analytics in one place. Check now.",
    url: baseUrl,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL Scorebook homepage preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Stats, Live Score & Auction Data | IPL Scorebook",
    description:
      "Your ultimate IPL 2026 hub for live scores, auction prices, player stats, team standings and historical analytics in one place. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
