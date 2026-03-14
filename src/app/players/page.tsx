import type { Metadata } from "next";
import PlayersClient from "./PlayersClient";
import { PLAYERS } from "@/lib/data";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL 2026 Player Stats Directory | IPL Scorebook",
  description:
    "Browse the IPL 2026 player directory with roles, auction prices, team details and performance stats across every franchise. Check now.",
  keywords: [
    "ipl 2026 players",
    "ipl player stats",
    "ipl player directory",
    "ipl auction prices",
    "ipl squads",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/players`,
    languages: {
      en: `${baseUrl}/players`,
    },
  },
  openGraph: {
    title: "IPL 2026 Player Stats Directory | IPL Scorebook",
    description:
      "Browse the IPL 2026 player directory with roles, auction prices, team details and performance stats across every franchise. Check now.",
    url: `${baseUrl}/players`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL player directory preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Player Stats Directory | IPL Scorebook",
    description:
      "Browse the IPL 2026 player directory with roles, auction prices, team details and performance stats across every franchise. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function PlayersPage() {
  const playerList = PLAYERS.slice(0, 20).map((player, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: player.name,
    url: `${baseUrl}/players/${player.id}`,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IPL 2026 Player Directory",
    itemListElement: playerList,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PlayersClient />
    </>
  );
}
