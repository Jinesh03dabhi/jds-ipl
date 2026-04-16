import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/intent/JsonLd";
import MatchCard from "@/components/MatchCard";
import Section from "@/components/Section";
import styles from "@/components/seo-ui.module.css";
import { getAllSeoMatches } from "@/lib/data-helpers";
import { generateFAQSchema, generateMetadata as createMetadata, generateSportsSchema } from "@/lib/seo";
import { getMatchPredictionData } from "@/lib/stats-engine";

const StatsTable = dynamic(() => import("@/components/StatsTable"));

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSeoMatches().map((match) => ({
    slug: match.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const predictionData = getMatchPredictionData(slug);

  if (!predictionData) {
    return {};
  }

  return createMetadata({
    title: `${predictionData.team1.shortName} vs ${predictionData.team2.shortName} Prediction ${predictionData.match.season}`,
    description: `${predictionData.team1.name} vs ${predictionData.team2.name} prediction page with head-to-head stats, venue pitch angle and win probabilities.`,
    slug: `/match/${slug}/prediction`,
    keywords: [
      `${predictionData.team1.shortName} vs ${predictionData.team2.shortName} prediction`,
      `${predictionData.team1.name} vs ${predictionData.team2.name} win probability`,
      `${predictionData.venue.name} pitch and toss impact`,
    ],
  });
}

export default async function MatchPredictionPage({ params }: PageProps) {
  const { slug } = await params;
  const predictionData = getMatchPredictionData(slug);

  if (!predictionData || !predictionData.headToHeadRecord) {
    notFound();
  }

  const faqs = [
    {
      question: `Who had the pre-match edge in ${predictionData.team1.name} vs ${predictionData.team2.name}?`,
      answer: `${predictionData.predictedWinner.name} led the local model with a ${predictionData.team1WinProbability > predictionData.team2WinProbability ? predictionData.team1WinProbability : predictionData.team2WinProbability}% win probability.`,
    },
    {
      question: `Does the prediction page use head-to-head and venue data?`,
      answer: "Yes. The model blends recent form, prior head-to-head results, venue record and overall squad impact.",
    },
    {
      question: `Can I move from the prediction page to the full match page?`,
      answer: "Yes. Every prediction page links directly to the match route, team routes and venue route.",
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          generateFAQSchema(faqs),
          generateSportsSchema({
            type: "SportsEvent",
            name: `${predictionData.team1.name} vs ${predictionData.team2.name} Prediction`,
            description: `Local pre-match model for ${predictionData.team1.name} vs ${predictionData.team2.name}.`,
            url: `/match/${slug}/prediction`,
            startDate: predictionData.match.date,
            locationName: predictionData.venue.name,
            competitors: [
              { name: predictionData.team1.name, url: `/team/${predictionData.team1.slug}/stats` },
              { name: predictionData.team2.name, url: `/team/${predictionData.team2.slug}/stats` },
            ],
          }),
        ]}
      />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Prediction Page</span>
        <h1 className={styles.heroTitle}>
          {predictionData.team1.name} vs {predictionData.team2.name} Prediction
        </h1>
        <p className={styles.heroText}>
          This route packages the main prediction ingredients users search for: head-to-head history, venue behavior,
          recent form and a simple win-probability model that runs entirely on local data files.
        </p>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>
            {predictionData.team1.shortName} {predictionData.team1WinProbability}%
          </span>
          <span className={styles.badge}>
            {predictionData.team2.shortName} {predictionData.team2WinProbability}%
          </span>
          <span className={styles.badge}>{predictionData.venue.name}</span>
        </div>
      </section>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Projected Winner</div>
          <div className={styles.statValue}>{predictionData.predictedWinner.shortName}</div>
          <div className={styles.statNote}>{predictionData.predictedWinner.name} held the stronger pre-match profile.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Actual Winner</div>
          <div className={styles.statValue}>{predictionData.actualWinner?.shortName ?? "N/A"}</div>
          <div className={styles.statNote}>The page can compare model output with the completed result.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Recent Form</div>
          <div className={styles.statValue}>
            {predictionData.team1RecentWins}-{predictionData.team2RecentWins}
          </div>
          <div className={styles.statNote}>Wins from each side’s pre-match five-game window.</div>
        </article>
      </div>

      <Section title="Prediction Logic" description="The model stays intentionally simple so it is explainable on-page.">
        <div className={styles.list}>
          {predictionData.reasons.map((reason) => (
            <div key={reason} className={styles.listItem}>
              {reason}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Head to Head" description="This section reuses the shared head-to-head engine so comparison pages stay consistent across routes.">
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Overall Record</h3>
            <div className={styles.list}>
              <div className={styles.listItem}>
                {predictionData.team1.shortName}: {predictionData.headToHeadRecord.team1Wins} wins
              </div>
              <div className={styles.listItem}>
                {predictionData.team2.shortName}: {predictionData.headToHeadRecord.team2Wins} wins
              </div>
              <div className={styles.listItem}>
                Total meetings: {predictionData.headToHeadRecord.totalMatches}
              </div>
            </div>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Last Five Meetings</h3>
            <div className={styles.list}>
              {predictionData.headToHeadRecord.lastFive.map((match) => (
                <div key={`${match.slug}-${match.season}`} className={styles.listItem}>
                  Season {match.season}: {match.result}
                </div>
              ))}
            </div>
          </article>
        </div>
      </Section>

      <Section title="Venue Breakdown" description="Venue summaries make prediction pages much more useful than generic team-vs-team copy.">
        <div className={styles.grid}>
          <article className={styles.callout}>
            {predictionData.venue.pitchSummary} {predictionData.venue.tossImpact}
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Venue Record Table</h3>
            <StatsTable
              columns={[
                { key: "venueName", label: "Venue" },
                { key: "matches", label: "Matches" },
                { key: "team1Wins", label: `${predictionData.team1.shortName} Wins` },
                { key: "team2Wins", label: `${predictionData.team2.shortName} Wins` },
              ]}
              rows={predictionData.headToHeadRecord.venueBreakdown.map((row) => ({
                venueName: row.venueName,
                matches: row.matches,
                team1Wins: row.team1Wins,
                team2Wins: row.team2Wins,
              }))}
            />
          </article>
        </div>
      </Section>

      <Section title="Internal Links" description="Prediction pages should always feed traffic into match, team and head-to-head pages.">
        <div className={styles.cardsGrid}>
          <MatchCard
            href={`/match/${predictionData.match.slug}`}
            title="Open Match Page"
            summary="Jump to the full scorecard, top performers and timeline."
            meta={[predictionData.match.label, "Match page"]}
          />
          <MatchCard
            href={`/${predictionData.headToHeadRecord.slug}`}
            title="Head to Head Page"
            summary="Open the standalone franchise-vs-franchise comparison page."
            meta={[predictionData.team1.shortName, predictionData.team2.shortName, "Head to head"]}
          />
          <MatchCard
            href={`/venue/${predictionData.venue.slug}/stats`}
            title="Venue Stats"
            summary="See average scores, toss impact and winning pattern for this ground."
            meta={[predictionData.venue.city, "Venue", "Stats"]}
          />
        </div>
      </Section>
    </div>
  );
}
