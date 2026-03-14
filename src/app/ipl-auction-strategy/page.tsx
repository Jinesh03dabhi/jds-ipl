import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";
const publishedTime = "2025-12-05T00:00:00.000Z";
const modifiedTime = new Date().toISOString();

export const metadata: Metadata = {
  title: "IPL Auction Strategy Guide | IPL Scorebook",
  description:
    "Learn how IPL auction strategy works with retention rules, budget planning, and squad balance tactics for IPL 2026. Check now.",
  keywords: [
    "ipl auction strategy",
    "ipl auction rules",
    "ipl retention strategy",
    "ipl budget planning",
    "ipl squad building",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/ipl-auction-strategy`,
    languages: {
      en: `${baseUrl}/ipl-auction-strategy`,
    },
  },
  openGraph: {
    title: "IPL Auction Strategy Guide | IPL Scorebook",
    description:
      "Learn how IPL auction strategy works with retention rules, budget planning, and squad balance tactics for IPL 2026. Check now.",
    url: `${baseUrl}/ipl-auction-strategy`,
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
        alt: "IPL auction strategy preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Auction Strategy Guide | IPL Scorebook",
    description:
      "Learn how IPL auction strategy works with retention rules, budget planning, and squad balance tactics for IPL 2026. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function AuctionStrategyPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "IPL Auction Strategy Guide",
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
    mainEntityOfPage: `${baseUrl}/ipl-auction-strategy`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is IPL auction strategy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "IPL auction strategy combines budget planning, retention decisions and role-based squad building to maximize team balance.",
        },
      },
      {
        "@type": "Question",
        name: "Why do IPL teams prioritize all-rounders?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All-rounders provide flexibility and impact in multiple roles, making them valuable in auction strategy.",
        },
      },
    ],
  };

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]) }}
      />
      <h1>IPL Auction Strategy Guide</h1>

      <p>
        IPL auction strategy focuses on budget planning, role balance and long-term squad building for IPL 2026 success. Check now.
      </p>

      <h2>IPL Auction Budget Allocation</h2>
      <p>
        Each franchise operates under a salary cap. Teams distribute budgets across marquee players, role specialists and backup options.
      </p>

      <h2>IPL Role-Based Player Selection</h2>
      <p>
        Teams identify needs such as power hitters, death bowlers, spin specialists and wicketkeepers to build balanced lineups.
      </p>

      <h2>IPL Retention vs Fresh Bidding Strategy</h2>
      <p>
        Retaining core players ensures stability while fresh signings bring tactical flexibility and new matchups.
      </p>

      <h2>IPL Impact Player and Flex Strategy</h2>
      <p>
        With evolving IPL rules, franchises prioritize versatile players who can contribute in multiple roles and game states.
      </p>

      <p>
        Successful IPL auction strategy often determines a teams success long before the season begins.
      </p>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>Related IPL Resources</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/auction" className="btn-primary">IPL 2026 auction results</Link>
          <Link href="/top-10-expensive-ipl-players" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            Top 10 most expensive IPL players
          </Link>
          <Link href="/teams" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL teams and squads
          </Link>
        </div>
      </section>
    </div>
  );
}
