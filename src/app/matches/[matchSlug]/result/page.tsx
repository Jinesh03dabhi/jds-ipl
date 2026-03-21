import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import MatchContent from "@/components/intent/MatchContent";
import styles from "@/components/intent/intent.module.css";
import {
  formatIndiaDateTime,
  getKeyPlayers,
  getMatchByDetailSlug,
  getPredictionForMatch,
} from "@/lib/ipl-data";
import { SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{
    matchSlug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { matchSlug } = await params;
  const match = await getMatchByDetailSlug(matchSlug);

  if (!match) {
    return {};
  }

  const title = `${match.team1.name} vs ${match.team2.name} Result | IPL 2026`;
  const description = `${match.team1.name} vs ${match.team2.name} result page with outcome, scoreline status and links back to live and preview pages.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/matches/${matchSlug}/result`,
    },
  };
}

export default async function MatchResultPage({ params }: PageProps) {
  const { matchSlug } = await params;
  const match = await getMatchByDetailSlug(matchSlug);

  if (!match) {
    notFound();
  }

  const prediction = getPredictionForMatch(match);
  const hasResult = match.status === "completed";
  const faqs: FaqItem[] = [
    {
      question: `Is the ${match.team1.name} vs ${match.team2.name} result available?`,
      answer: hasResult
        ? `Yes. The current match feed marks the fixture as completed and lists the result as ${match.result || "available in the score record"}.`
        : `Not yet. This result page exists early so the same URL can become the final recap destination once the match ends.`,
    },
    {
      question: "Why does the result page exist before the match is over?",
      answer:
        "Because the site is built around a content loop for every fixture: preview, live page and result page. Creating the result URL early makes internal linking stronger and gives search engines one stable destination for the recap once the match is finished.",
    },
    {
      question: "Does this page keep the pre-match prediction visible?",
      answer:
        "Yes. The result route keeps a lightweight prediction note so users can compare the pre-match angle with the final outcome without having to jump back to the preview page.",
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: `${match.team1.name} vs ${match.team2.name}`,
            sport: "Cricket",
            startDate: match.dateTimeGMT,
            eventStatus: hasResult
              ? "https://schema.org/EventCompleted"
              : "https://schema.org/EventScheduled",
            location: {
              "@type": "Place",
              name: match.venue,
            },
            url: `${SITE_URL}/matches/${matchSlug}/result`,
          },
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Result Loop</div>
          <h1 className={styles.title}>
            {match.team1.name} vs {match.team2.name} Result
          </h1>
          <p className={styles.subtitle}>
            This is the permanent recap route for the fixture. If the match is complete, it becomes the result page. If the game has not finished yet, the page stays honest about that status while keeping the same URL ready for the final outcome.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{match.matchNumber}</span>
            <span className={styles.metaBadge}>{formatIndiaDateTime(match.dateTimeGMT)} IST</span>
            <span className={styles.metaBadge}>
              {hasResult ? match.result || "Completed" : "Result pending"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Result Status</h2>
            <div className={styles.textBlock}>
              {hasResult ? (
                <>
                  <p>
                    The result for {match.team1.name} vs {match.team2.name} is now available in the current match feed. The headline outcome is {match.result || "stored in the feed"}, with scoreline strings of {match.score.team1 || "pending"} and {match.score.team2 || "pending"}.
                  </p>
                  <p>
                    Good result pages do not need to over-explain the obvious. Users mostly want the result, the scores, the winner and a quick path into the points table or the next fixture. This page is structured around exactly that behavior.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    This result page is already live, but the match itself is not complete yet. That is intentional. The site creates a stable result URL for every fixture early so the post-match recap has a permanent home as soon as the final ball is bowled.
                  </p>
                  <p>
                    Until the game ends, this route works as a result placeholder with useful context instead of pretending a completed recap exists.
                  </p>
                </>
              )}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Outcome Snapshot</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Winner</div>
                <div className={styles.statValue}>{hasResult ? match.winner || "Feed pending" : "Pending"}</div>
                <div className={styles.statSubtext}>Shown only when the source records the match as complete.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Team 1 Score</div>
                <div className={styles.statValue}>{match.score.team1 || "--"}</div>
                <div className={styles.statSubtext}>{match.team1.name}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Team 2 Score</div>
                <div className={styles.statValue}>{match.score.team2 || "--"}</div>
                <div className={styles.statSubtext}>{match.team2.name}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Pre-Match Edge</div>
                <div className={styles.statValue}>{prediction.winner.shortName}</div>
                <div className={styles.statSubtext}>{prediction.confidence}</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <MatchContent
        match={match}
        quickSummary={[
          hasResult
            ? `${match.result || "The match result is available in the current feed."}`
            : "The match result is not available yet because the fixture is not complete.",
          match.winner
            ? `${match.winner} are listed as the winning side.`
            : "The winner field is still pending in the current match feed.",
          "This result page remains linked to the original preview and live routes for the same fixture.",
        ]}
        tossText={
          match.tossWinner
            ? `${match.tossWinner} won the toss and chose to ${match.tossChoice || "make the first call"}.`
            : "The toss field is not available in the current result state."
        }
        playingXiText={`The result route keeps the playing XI search block visible, but it does not backfill lineups from thin air. If the official XI is unavailable in the source, the page says so and stays focused on player context.`}
        predictionTitle="Prediction vs Outcome"
        predictionText={`${prediction.confidence}: ${prediction.winner.name}. ${hasResult ? "This sits alongside the final result so users can compare the pre-match read with the actual outcome." : "The final result will populate here once the fixture is complete."}`}
        team1Players={getKeyPlayers(match.team1.name)}
        team2Players={getKeyPlayers(match.team2.name)}
      />

      <InternalLinkGrid
        title="Match Recap Navigation"
        links={[
          {
            href: `/matches/${matchSlug}`,
            label: "Preview Page",
            description: "Return to the original preview route for this fixture.",
          },
          {
            href: `/matches/${matchSlug}/live`,
            label: "Live Page",
            description: "Open the live route linked to the same match.",
          },
          {
            href: "/ipl-points-table-2026",
            label: "Points Table 2026",
            description: "See whether this result changes the standings and NRR.",
          },
          {
            href: `/${match.predictionSlug}`,
            label: "Prediction Page",
            description: "Compare the pre-match prediction route with the final result.",
          },
        ]}
      />

      <FaqSection title="Match Result FAQ" faqs={faqs} />
    </div>
  );
}
