import type { Metadata } from "next";
import ScheduleClient from "./ScheduleClient";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL 2026 Schedule & Fixtures | IPL Scorebook",
  description:
    "Complete IPL 2026 schedule with match dates, IST start times, venues, live scores and results. Never miss a fixture list update today. Check now.",
  keywords: [
    "ipl 2026 schedule",
    "ipl fixtures",
    "ipl match dates",
    "ipl time table",
    "ipl venues",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/schedule`,
    languages: {
      en: `${baseUrl}/schedule`,
    },
  },
  openGraph: {
    title: "IPL 2026 Full Schedule & Fixtures",
    description: "Match-by-match IPL 2026 timetable with scores, results and venues.",
    url: `${baseUrl}/schedule`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL 2026 schedule preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Full Schedule & Fixtures",
    description: "Match-by-match IPL 2026 timetable with scores, results and venues.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

const getSchedule = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/schedule`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { matches: [] };
    return res.json();
  } catch {
    return { matches: [] };
  }
};

export default async function SchedulePage() {
  const data = await getSchedule();
  const matches = data?.matches || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IPL 2026 Match Schedule",
    description: "Complete fixture list for IPL 2026 season",
    itemListElement: matches.map((match: any, index: number) => ({
      "@type": "SportsEvent",
      position: index + 1,
      name: `${match.team1?.name} vs ${match.team2?.name}`,
      startDate: match.dateTimeGMT,
      location: { "@type": "Place", name: match.venue },
      sport: "Cricket",
      competitor: [
        { "@type": "SportsTeam", name: match.team1?.name },
        { "@type": "SportsTeam", name: match.team2?.name },
      ],
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ScheduleClient />
    </>
  );
}
