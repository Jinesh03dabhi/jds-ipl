import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";
const publishedTime = "2025-12-10T00:00:00.000Z";
const modifiedTime = new Date().toISOString();

const bowlers = [
  {
    name: "Lasith Malinga",
    headline: "Lasith Malinga - IPL's Greatest Death Bowler",
    matches: "120+",
    wickets: "170+",
    economy: "7.1",
    best: "5/13",
    summary:
      "Malinga remains one of the most feared T20 bowlers, with yorkers and death-over mastery defining his IPL legacy.",
  },
  {
    name: "Dwayne Bravo",
    headline: "Dwayne Bravo - Most Wickets in IPL History",
    matches: "160+",
    wickets: "180+",
    economy: "8.4",
    best: "4/22",
    summary:
      "Bravo's variations and slower balls earned multiple Purple Caps and match-winning spells across seasons.",
  },
  {
    name: "Bhuvneshwar Kumar",
    headline: "Bhuvneshwar Kumar - Swing King of IPL Powerplays",
    matches: "160+",
    wickets: "170+",
    economy: "7.4",
    best: "5/19",
    summary:
      "Known for swing bowling and control, Bhuvneshwar has delivered economical powerplay spells year after year.",
  },
  {
    name: "Sunil Narine",
    headline: "Sunil Narine - IPL's Premier Mystery Spinner",
    matches: "170+",
    wickets: "180+",
    economy: "6.7",
    best: "5/19",
    summary:
      "Narine's mystery spin and tight economy rates have made him a consistent match-winner in IPL history.",
  },
];

export const metadata: Metadata = {
  title: "Best IPL Bowlers of All Time | IPL Scorebook",
  description:
    "Discover the best IPL bowlers of all time with wickets, economy rates and match-winning highlights for every era. Updated list for IPL 2026. Check now.",
  keywords: [
    "best ipl bowlers",
    "ipl top wicket takers",
    "ipl bowling economy",
    "ipl death bowlers",
    "ipl spin bowlers",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/best-ipl-bowlers`,
    languages: {
      en: `${baseUrl}/best-ipl-bowlers`,
    },
  },
  openGraph: {
    title: "Best IPL Bowlers of All Time | IPL Scorebook",
    description:
      "Discover the best IPL bowlers of all time with wickets, economy rates and match-winning highlights for every era. Updated list for IPL 2026. Check now.",
    url: `${baseUrl}/best-ipl-bowlers`,
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
        alt: "Best IPL bowlers preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best IPL Bowlers of All Time | IPL Scorebook",
    description:
      "Discover the best IPL bowlers of all time with wickets, economy rates and match-winning highlights for every era. Updated list for IPL 2026. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function BestIPLBowlers() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best IPL Bowlers of All Time",
    itemListElement: bowlers.map((bowler, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: bowler.name,
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best IPL Bowlers of All Time",
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
    mainEntityOfPage: `${baseUrl}/best-ipl-bowlers`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who has taken the most wickets in IPL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dwayne Bravo is widely recognized among the top wicket takers in IPL history, with consistent Purple Cap seasons.",
        },
      },
      {
        "@type": "Question",
        name: "Who is the best spinner in IPL history?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sunil Narine is often cited as one of the best IPL spinners due to his economy and wicket-taking impact.",
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

      <h1>Best IPL Bowlers of All Time</h1>

      <p>
        The best IPL bowlers list highlights wicket takers, economy leaders and match winners who dominated the league. Check now.
      </p>

      {bowlers.map((bowler) => (
        <section key={bowler.name} style={{ marginTop: "28px" }}>
          <h2>{bowler.headline}</h2>
          <p>{bowler.summary}</p>
        </section>
      ))}

      <div className="table-wrapper" style={{ marginTop: "32px" }}>
        <table className="expensive-table">
          <caption>Best IPL bowlers stats table (career highlights)</caption>
          <thead>
            <tr>
              <th>Bowler</th>
              <th>Matches</th>
              <th>Wickets</th>
              <th>Economy</th>
              <th>Best Figures</th>
            </tr>
          </thead>
          <tbody>
            {bowlers.map((bowler) => (
              <tr key={bowler.name}>
                <td>{bowler.name}</td>
                <td>{bowler.matches}</td>
                <td>{bowler.wickets}</td>
                <td>{bowler.economy}</td>
                <td>{bowler.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>Related IPL Analytics</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/players" className="btn-primary">IPL player stats directory</Link>
          <Link href="/top-10-expensive-ipl-players" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            Top 10 most expensive IPL players
          </Link>
          <Link href="/ipl-winners" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL winners list and champions
          </Link>
        </div>
      </section>
    </div>
  );
}
