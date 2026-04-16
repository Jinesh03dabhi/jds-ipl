import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/intent/JsonLd";
import MatchCard from "@/components/MatchCard";
import Section from "@/components/Section";
import styles from "@/components/seo-ui.module.css";
import { getAllVenues } from "@/lib/data-helpers";
import { generateFAQSchema, generateMetadata as createMetadata, generateSportsSchema } from "@/lib/seo";
import { getVenueStats } from "@/lib/stats-engine";

const StatsTable = dynamic(() => import("@/components/StatsTable"));

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllVenues().map((venue) => ({
    slug: venue.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const venueData = getVenueStats(slug);

  if (!venueData) {
    return {};
  }

  return createMetadata({
    title: `${venueData.venue.name} IPL Stats - Avg Score, Toss Impact, Winning Pattern`,
    description: `${venueData.venue.name} venue stats page with average score, toss impact, chasing trend and recent matches.`,
    slug: `/venue/${slug}/stats`,
    keywords: [
      `${venueData.venue.name} IPL stats`,
      `${venueData.venue.name} average score`,
      `${venueData.venue.name} toss impact`,
    ],
  });
}

export default async function VenueStatsPage({ params }: PageProps) {
  const { slug } = await params;
  const venueData = getVenueStats(slug);

  if (!venueData) {
    notFound();
  }

  const faqs = [
    {
      question: `What is the average first-innings score at ${venueData.venue.name}?`,
      answer: `${venueData.averageFirstInningsScore} is the current average first-innings score in the local venue dataset.`,
    },
    {
      question: `Does the toss matter at ${venueData.venue.name}?`,
      answer: `Yes. Toss winners have turned that edge into wins ${venueData.tossImpact}% of the time in this local match sample.`,
    },
    {
      question: `Which teams have the best record at ${venueData.venue.name}?`,
      answer: `${venueData.topTeams.map((team) => team.teamName).join(", ")} lead the current venue win table.`,
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          generateFAQSchema(faqs),
          generateSportsSchema({
            type: "SportsOrganization",
            name: `${venueData.venue.name} IPL Venue Stats`,
            description: `${venueData.venue.name} venue analytics on IPL Scorebook.`,
            url: `/venue/${slug}/stats`,
            locationName: venueData.venue.name,
          }),
        ]}
      />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Venue Stats</span>
        <h1 className={styles.heroTitle}>{venueData.venue.name} IPL Stats</h1>
        <p className={styles.heroText}>
          Venue pages turn generic pitch content into a structured analytics route. This page combines average scores,
          toss conversion, winning pattern notes and recent fixtures at the ground.
        </p>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>{venueData.venue.city}</span>
          <span className={styles.badge}>{venueData.matches.length} matches</span>
          <span className={styles.badge}>{venueData.venue.homeTeamIds.join(", ").toUpperCase()}</span>
        </div>
      </section>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Avg 1st Inns</div>
          <div className={styles.statValue}>{venueData.averageFirstInningsScore}</div>
          <div className={styles.statNote}>Useful baseline for preview pages and score expectations.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Avg 2nd Inns</div>
          <div className={styles.statValue}>{venueData.averageSecondInningsScore}</div>
          <div className={styles.statNote}>Highlights whether chasing totals stay reachable at this venue.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Toss Impact</div>
          <div className={styles.statValue}>{venueData.tossImpact}%</div>
          <div className={styles.statNote}>Share of matches won by the toss-winning side.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Chasing Win Rate</div>
          <div className={styles.statValue}>{venueData.chasingWinRate}%</div>
          <div className={styles.statNote}>Helps prediction routes frame toss and innings decisions.</div>
        </article>
      </div>

      <Section title="Pitch and Winning Pattern" description="Static venue notes make the page useful even outside a live match window.">
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Pitch Summary</h3>
            <p className={styles.muted}>{venueData.venue.pitchSummary}</p>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Winning Pattern</h3>
            <p className={styles.muted}>{venueData.winningPattern}</p>
            <div className={styles.pills}>
              <span className={styles.pill}>Bat first {venueData.battingFirstWinRate}%</span>
              <span className={styles.pill}>Chase {venueData.chasingWinRate}%</span>
            </div>
          </article>
        </div>
      </Section>

      <Section title="Best Teams At This Venue" description="Venue pages also work as internal link targets for team and match pages.">
        <article className={styles.card}>
          <StatsTable
            columns={[
              { key: "teamName", label: "Team" },
              { key: "wins", label: "Wins" },
              { key: "matches", label: "Matches" },
            ]}
            rows={venueData.topTeams.map((team) => ({
              teamName: team.teamName,
              wins: team.wins,
              matches: team.matches,
            }))}
          />
        </article>
      </Section>

      <Section title="Recent Matches" description="Recent venue-linked matches are a natural next click from ground-specific searches.">
        <div className={styles.cardsGrid}>
          {venueData.recentMatches.map((match) => (
            <MatchCard
              key={match.slug}
              href={`/match/${match.slug}`}
              title={`${match.label} Match`}
              summary={match.result}
              meta={[`Season ${match.season}`, venueData.venue.city]}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
