import type { Metadata } from "next";
import Link from "next/link";
import { PLAYERS } from "@/lib/data";

const baseUrl = "https://jds-ipl.vercel.app";
const publishedTime = "2025-12-01T00:00:00.000Z";
const modifiedTime = new Date().toISOString();

const expensivePlayers = [
  { name: "Rishabh Pant", price: "27.00 Cr", year: 2025, team: "LSG", role: "Wicketkeeper-Batsman" },
  { name: "Shreyas Iyer", price: "26.75 Cr", year: 2025, team: "PBKS", role: "Batter (Captain)" },
  { name: "Cameron Green", price: "25.20 Cr", year: 2026, team: "KKR", role: "All-Rounder" },
  { name: "Mitchell Starc", price: "24.75 Cr", year: 2024, team: "KKR", role: "Fast Bowler" },
  { name: "Venkatesh Iyer", price: "23.75 Cr", year: 2025, team: "KKR", role: "All-Rounder" },
  { name: "Pat Cummins", price: "20.50 Cr", year: 2024, team: "SRH", role: "Fast Bowler" },
  { name: "Sam Curran", price: "18.50 Cr", year: 2023, team: "PBKS", role: "All-Rounder" },
  { name: "Arshdeep Singh", price: "18.00 Cr", year: 2025, team: "PBKS", role: "Fast Bowler" },
  { name: "Yuzvendra Chahal", price: "18.00 Cr", year: 2025, team: "PBKS", role: "Spin Bowler" },
  { name: "Cameron Green", price: "17.50 Cr", year: 2023, team: "MI", role: "All-Rounder" },
];

export const metadata: Metadata = {
  title: "Top 10 Most Expensive IPL Players | IPL Scorebook",
  description:
    "Explore the top 10 most expensive IPL players with auction prices, teams, roles and year-by-year records. Updated list for 2026. Check now.",
  keywords: [
    "most expensive IPL players",
    "ipl auction records",
    "ipl highest bids",
    "ipl auction prices",
    "ipl 2026 auction",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/top-10-expensive-ipl-players`,
    languages: {
      en: `${baseUrl}/top-10-expensive-ipl-players`,
    },
  },
  openGraph: {
    title: "Top 10 Most Expensive IPL Players | IPL Scorebook",
    description:
      "Explore the top 10 most expensive IPL players with auction prices, teams, roles and year-by-year records. Updated list for 2026. Check now.",
    url: `${baseUrl}/top-10-expensive-ipl-players`,
    type: "article",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    publishedTime,
    modifiedTime,
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Top 10 most expensive IPL players preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 10 Most Expensive IPL Players | IPL Scorebook",
    description:
      "Explore the top 10 most expensive IPL players with auction prices, teams, roles and year-by-year records. Updated list for 2026. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function TopExpensivePlayers() {
  const playerIds = new Map(PLAYERS.map((player) => [player.name, player.id]));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top 10 Most Expensive IPL Players",
    itemListElement: expensivePlayers.map((player, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: player.name,
      description: `${player.price} - ${player.team} - ${player.year}`,
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Top 10 Most Expensive IPL Players",
    author: {
      "@type": "Organization",
      name: "IPL Scorebook",
    },
    publisher: {
      "@type": "Organization",
      name: "IPL Scorebook",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/jds-ipl-logo-1.png`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    mainEntityOfPage: `${baseUrl}/top-10-expensive-ipl-players`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is the most expensive IPL player ever?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rishabh Pant is listed as the most expensive IPL player with a record auction price.",
        },
      },
      {
        "@type": "Question",
        name: "Which team spent the most in the IPL 2025 auction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Punjab Kings and Lucknow Super Giants were among the top spenders in the IPL 2025 auction cycle.",
        },
      },
    ],
  };

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([itemListSchema, articleSchema, faqSchema]) }}
      />

      <h1>Top 10 Most Expensive IPL Players in History</h1>

      <p>
        The top 10 most expensive IPL players list highlights record auction prices, team bids and marquee signings from recent seasons. Check now.
      </p>

      <div className="table-wrapper">
        <table className="expensive-table">
          <caption>IPL All-Time Record Auction Prices</caption>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Price</th>
              <th>Year</th>
              <th>Team</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {expensivePlayers.map((player, index) => {
              const playerId = playerIds.get(player.name);
              return (
                <tr key={`${player.name}-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    <Link href={`/players/${playerId}`}>{player.name}</Link>
                  </td>
                  <td>Rs {player.price}</td>
                  <td>{player.year}</td>
                  <td>{player.team}</td>
                  <td>{player.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: "40px" }}>IPL Auction Trends and Price Analysis</h2>
      <p>
        IPL auction trends show record prices rising for all-rounders, fast bowlers and franchise captains as teams compete for impact players.
      </p>

      <h2 style={{ marginTop: "40px" }}>Why IPL Auction Prices Are Increasing</h2>
      <p>Several factors contribute to rising IPL auction prices:</p>

      <ul style={{ lineHeight: "1.8", marginLeft: "10px" }}>
        <li>Growing media revenue and broadcast deals</li>
        <li>Salary cap expansion and team rebuilding cycles</li>
        <li>Demand for match-winning all-rounders and pace bowlers</li>
        <li>Scarcity of elite Indian talent in the auction pool</li>
      </ul>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>Related IPL Pages</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/players" className="btn-primary">IPL player stats directory</Link>
          <Link href="/auction" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL 2026 auction results
          </Link>
          <Link href="/ipl-winners" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL winners list and champions
          </Link>
        </div>
      </section>
    </div>
  );
}
