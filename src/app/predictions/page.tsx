import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import styles from "@/components/intent/intent.module.css";
import {
  formatIndiaDateTime,
  getIplSchedule,
  getPredictionForMatch,
} from "@/lib/ipl-data";
import { SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/predictions`;

export const metadata: Metadata = {
  title: "IPL Match Predictions | Upcoming IPL 2026 Fixtures and Picks",
  description:
    "Browse real IPL 2026 match prediction pages for upcoming fixtures, with venue angle, key players, toss context and internal links into live and result pages.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "IPL Match Predictions | Upcoming IPL 2026 Fixtures and Picks",
    description:
      "Browse real IPL 2026 match prediction pages for upcoming fixtures, with venue angle, key players and toss context.",
    url: pageUrl,
    type: "website",
    locale: "en_IN",
    siteName: "IPL Scorebook",
    images: [`${SITE_URL}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Match Predictions | Upcoming IPL 2026 Fixtures and Picks",
    description:
      "Browse real IPL 2026 match prediction pages for upcoming fixtures, with venue angle, key players and toss context.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default async function PredictionsPage() {
  const schedule = await getIplSchedule();
  const upcomingMatches = schedule.matches
    .filter((match) => match.status !== "completed")
    .sort((a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime())
    .slice(0, 12);

  const faqs: FaqItem[] = [
    {
      question: "How are these IPL prediction pages generated?",
      answer:
        "Each prediction page is tied to a real fixture in the current 2026 schedule feed. The page then adds venue context, key players, toss logic and links into the related live and result pages.",
    },
    {
      question: "Do these prediction pages use fake playing XIs?",
      answer:
        "No. The route keeps a dedicated playing XI block because users search for it, but it does not guess lineups. If the official XI is not available yet, the page says that clearly and focuses on the key players to watch.",
    },
    {
      question: "Can I move from a prediction page to live score and result pages?",
      answer:
        "Yes. Every match prediction route is internally linked to its preview, live and result pages so users can follow one fixture through the full content loop.",
    },
  ];

  const structuredData = [
    buildFaqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "IPL match predictions",
      url: pageUrl,
      description: "Upcoming IPL 2026 match predictions and preview links.",
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd data={structuredData} />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Prediction Hub</div>
          <h1 className={styles.title}>IPL Match Predictions</h1>
          <p className={styles.subtitle}>
            This page now works as a true prediction hub instead of a generic poll page. Each card below maps to a real fixture, then sends users into a full match loop: preview, live page, result page and pitch report context where relevant.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{upcomingMatches.length} fixture-led pages</span>
            <span className={styles.metaBadge}>
              Source: {schedule.source === "cricapi" ? "live schedule feed" : "official phase-one seed"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.textBlock}>
          <p>
            Users rarely search for vague "IPL predictions and polls". They search for team-vs-team prediction pages, toss angles, pitch reports and today&apos;s likely match flow. That is why this route now prioritizes upcoming fixtures and gives each one a dedicated landing page built around the actual query pattern people use.
          </p>
          <p>
            Every card below is linked to a prediction slug at the root level and then backed by deeper preview, live and result routes. That gives the site a stronger internal content loop while staying honest about what is confirmed and what is editorial inference.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Match Predictions</h2>
        <div className={styles.linkGrid}>
          {upcomingMatches.map((match) => {
            const prediction = getPredictionForMatch(match);
            return (
              <article key={match.id} className={styles.card}>
                <h3 className={styles.cardTitle}>
                  {match.team1.name} vs {match.team2.name}
                </h3>
                <div className={styles.cardNote}>
                  {match.matchNumber} - {formatIndiaDateTime(match.dateTimeGMT)} IST - {match.venue}
                </div>
                <p className={styles.cardText}>
                  {prediction.confidence}: {prediction.winner.name}. {prediction.reasons.join(" ")}
                </p>
                <div className={styles.heroActions}>
                  <Link href={`/${match.predictionSlug}`} className={styles.primaryAction}>
                    Open prediction page
                  </Link>
                  <Link href={`/matches/${match.detailSlug}`} className={styles.secondaryAction}>
                    Open preview loop
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <InternalLinkGrid
        title="Search-Intent Routes"
        links={[
          {
            href: "/ipl-live-score-today",
            label: "IPL Live Score Today",
            description: "Today-match intent route with toss, lineup status and live center links.",
          },
          {
            href: "/ipl-match-result-yesterday",
            label: "IPL Result Yesterday",
            description: "Yesterday-result route with verified no-match handling when needed.",
          },
          {
            href: "/points-table",
            label: "IPL Points Table 2026",
            description: "Standings, points and NRR without fake pre-season rankings.",
          },
          {
            href: "/schedule",
            label: "IPL Schedule",
            description: "Fixture list that feeds the preview, live and result loop pages.",
          },
        ]}
      />

      <FaqSection title="Prediction Hub FAQ" faqs={faqs} />
    </div>
  );
}
