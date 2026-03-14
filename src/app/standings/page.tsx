import type { Metadata } from "next";
import Standings from "@/app/teams/standings/StandingsPage";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL 2026 Points Table & Standings | IPL Scorebook",
  description:
    "View the IPL 2026 points table with team standings, wins, losses, net run rate and updated rankings across every franchise. Check now.",
  keywords: [
    "ipl 2026 points table",
    "ipl standings",
    "ipl net run rate",
    "ipl team rankings",
    "ipl table",
  ],
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
  },
  alternates: {
    canonical: `${baseUrl}/standings`,
    languages: {
      en: `${baseUrl}/standings`,
    },
  },
  openGraph: {
    title: "IPL 2026 Points Table & Standings | IPL Scorebook",
    description:
      "View the IPL 2026 points table with team standings, wins, losses, net run rate and updated rankings across every franchise. Check now.",
    url: `${baseUrl}/standings`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL 2026 points table preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Points Table & Standings | IPL Scorebook",
    description:
      "View the IPL 2026 points table with team standings, wins, losses, net run rate and updated rankings across every franchise. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function StandingsPage() {
  return <Standings />;
}
