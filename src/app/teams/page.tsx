import type { Metadata } from "next";
import TeamsClient from "./TeamsClient";
import { TEAMS } from "@/lib/data";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL Teams 2026: Franchises & Squads | IPL Scorebook",
  description:
    "Explore all 10 IPL 2026 teams, their squads, home venues, titles won, and performance history in IPL Scorebook. Check now.",
  keywords: [
    "ipl 2026 teams",
    "ipl franchises",
    "ipl squads",
    "ipl team stats",
    "ipl team standings",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/teams`,
    languages: {
      en: `${baseUrl}/teams`,
    },
  },
  openGraph: {
    title: "IPL Teams 2026: Franchises & Squads | IPL Scorebook",
    description:
      "Explore all 10 IPL 2026 teams, their squads, home venues, titles won, and performance history in IPL Scorebook. Check now.",
    url: `${baseUrl}/teams`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL teams and franchises preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Teams 2026: Franchises & Squads | IPL Scorebook",
    description:
      "Explore all 10 IPL 2026 teams, their squads, home venues, titles won, and performance history in IPL Scorebook. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function TeamsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IPL 2026 Teams",
    itemListElement: TEAMS.map((team, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SportsTeam",
        name: team.name,
        sport: "Cricket",
        url: `${baseUrl}/teams/${team.id}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TeamsClient />
    </>
  );
}
