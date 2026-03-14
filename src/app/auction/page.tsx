import type { Metadata } from "next";
import AuctionClient from "./AuctionClient";
import { PLAYERS } from "@/lib/data";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL 2026 Auction Results & Sold Prices | IPL Scorebook",
  description:
    "See IPL 2026 auction results with sold prices, highest bids, team spend totals and player roles in one dashboard. Check now.",
  keywords: [
    "ipl 2026 auction",
    "ipl auction results",
    "ipl sold prices",
    "ipl team spending",
    "ipl player bids",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/auction`,
    languages: {
      en: `${baseUrl}/auction`,
    },
  },
  openGraph: {
    title: "IPL 2026 Auction Results & Sold Prices | IPL Scorebook",
    description:
      "See IPL 2026 auction results with sold prices, highest bids, team spend totals and player roles in one dashboard. Check now.",
    url: `${baseUrl}/auction`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL auction analytics preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Auction Results & Sold Prices | IPL Scorebook",
    description:
      "See IPL 2026 auction results with sold prices, highest bids, team spend totals and player roles in one dashboard. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function AuctionDashboard() {
  const topBuys = [...PLAYERS]
    .sort((a, b) => parseFloat(b.soldPrice) - parseFloat(a.soldPrice))
    .slice(0, 10);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "IPL 2026 Auction Results",
      description:
        "IPL 2026 auction results dataset with sold prices, team spending, and player roles.",
      url: `${baseUrl}/auction`,
      creator: {
        "@type": "Organization",
        name: "IPL Scorebook",
        url: baseUrl,
      },
      license: `${baseUrl}/terms-conditions`,
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Top IPL 2026 Auction Buys",
      itemListElement: topBuys.map((player, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: player.name,
        description: `${player.soldPrice} - ${player.currentTeam}`,
        url: `${baseUrl}/players/${player.id}`,
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AuctionClient />
    </>
  );
}
