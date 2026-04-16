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
import { getMatchData } from "@/lib/stats-engine";

const StatsTable = dynamic(() => import("@/components/StatsTable"));

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 86400;
export const dynamicParams = false;

function formatMatchDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
}

export async function generateStaticParams() {
  return getAllSeoMatches().map((match) => ({
    slug: match.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const matchData = getMatchData(slug);

  if (!matchData) {
    return {};
  }

  return createMetadata({
    title: `${matchData.team1.shortName} vs ${matchData.team2.shortName} Match Scorecard ${matchData.match.season}`,
    description: `${matchData.team1.name} vs ${matchData.team2.name} match page with scorecard, innings breakdown, timeline and prediction link.`,
    slug: `/match/${slug}`,
    keywords: [
      `${matchData.team1.shortName} vs ${matchData.team2.shortName} scorecard`,
      `${matchData.team1.name} vs ${matchData.team2.name} timeline`,
      `IPL ${matchData.match.season} match page`,
    ],
  });
}

export default async function MatchPage({ params }: PageProps) {
  const { slug } = await params;
  const matchData = getMatchData(slug);

  if (!matchData || !matchData.team1Score || !matchData.team2Score) {
    notFound();
  }

  const faqs = [
    {
      question: `Who won ${matchData.team1.name} vs ${matchData.team2.name}?`,
      answer: matchData.match.result,
    },
    {
      question: `Does this page include the scorecard and timeline?`,
      answer: "Yes. The match route includes innings scorecards, top performers and a turning-point timeline built from local match data.",
    },
    {
      question: `Is there a separate prediction page for this fixture?`,
      answer: "Yes. Every match page links directly to its corresponding prediction page.",
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          generateFAQSchema(faqs),
          generateSportsSchema({
            type: "SportsEvent",
            name: `${matchData.team1.name} vs ${matchData.team2.name}`,
            description: matchData.match.result,
            url: `/match/${slug}`,
            startDate: matchData.match.date,
            locationName: matchData.venue.name,
            competitors: [
              { name: matchData.team1.name, url: `/team/${matchData.team1.slug}/stats` },
              { name: matchData.team2.name, url: `/team/${matchData.team2.slug}/stats` },
            ],
          }),
        ]}
      />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Match Page</span>
        <h1 className={styles.heroTitle}>
          {matchData.team1.name} vs {matchData.team2.name}
        </h1>
        <p className={styles.heroText}>
          This route is the static scorecard home for the fixture. It packages match details, innings tables, timeline
          events and the next-step prediction link into one production-ready SEO page.
        </p>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>{matchData.match.label}</span>
          <span className={styles.badge}>{formatMatchDate(matchData.match.date)}</span>
          <span className={styles.badge}>{matchData.venue.name}</span>
        </div>
      </section>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>{matchData.team1.shortName}</div>
          <div className={styles.statValue}>
            {matchData.team1Score.runs}/{matchData.team1Score.wickets}
          </div>
          <div className={styles.statNote}>{matchData.team1Score.overs} overs</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>{matchData.team2.shortName}</div>
          <div className={styles.statValue}>
            {matchData.team2Score.runs}/{matchData.team2Score.wickets}
          </div>
          <div className={styles.statNote}>{matchData.team2Score.overs} overs</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Result</div>
          <div className={styles.statValue}>{matchData.match.result}</div>
          <div className={styles.statNote}>Winner and margin from the local match engine.</div>
        </article>
      </div>

      <Section title="Scorecard" description="Both innings tables are generated from the local scorecard structure in the match data file.">
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>
              {matchData.team1Score.teamId === matchData.team1.id ? matchData.team1.name : matchData.team2.name} Batting
            </h3>
            <StatsTable
              columns={[
                { key: "name", label: "Batter" },
                { key: "dismissal", label: "Dismissal" },
                { key: "runs", label: "R" },
                { key: "balls", label: "B" },
                { key: "strikeRate", label: "SR" },
              ]}
              rows={matchData.team1Score.batters.map((batter) => ({
                name: batter.name,
                dismissal: batter.dismissal,
                runs: batter.runs,
                balls: batter.balls,
                strikeRate: batter.strikeRate,
              }))}
            />
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>
              {matchData.team2Score.teamId === matchData.team2.id ? matchData.team2.name : matchData.team1.name} Batting
            </h3>
            <StatsTable
              columns={[
                { key: "name", label: "Batter" },
                { key: "dismissal", label: "Dismissal" },
                { key: "runs", label: "R" },
                { key: "balls", label: "B" },
                { key: "strikeRate", label: "SR" },
              ]}
              rows={matchData.team2Score.batters.map((batter) => ({
                name: batter.name,
                dismissal: batter.dismissal,
                runs: batter.runs,
                balls: batter.balls,
                strikeRate: batter.strikeRate,
              }))}
            />
          </article>
        </div>
      </Section>

      <Section title="Top Performers" description="These summaries help match pages connect to player and team routes.">
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Batting Leaders</h3>
            <div className={styles.list}>
              {matchData.topBatters.map((batter) => (
                <div key={`${batter.playerId}-bat`} className={styles.listItem}>
                  {batter.name} scored {batter.runs} from {batter.balls} balls.
                </div>
              ))}
            </div>
          </article>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Bowling Leaders</h3>
            <div className={styles.list}>
              {matchData.topBowlers.map((bowler) => (
                <div key={`${bowler.playerId}-bowl`} className={styles.listItem}>
                  {bowler.name} finished with {bowler.wickets}/{bowler.runsConceded} in {bowler.overs}.
                </div>
              ))}
            </div>
          </article>
        </div>
      </Section>

      <Section title="Timeline" description="The timeline turns the raw scorecard into a more readable narrative route.">
        <div className={styles.timeline}>
          {matchData.match.timeline.map((event) => (
            <article key={`${event.over}-${event.title}`} className={styles.timelineItem}>
              <span className={styles.timelineOver}>{event.over}</span>
              <h3 className={styles.timelineTitle}>{event.title}</h3>
              <p className={styles.timelineText}>{event.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Next Pages" description="Match pages should always push users toward prediction, venue and team routes.">
        <div className={styles.cardsGrid}>
          <MatchCard
            href={`/match/${matchData.match.slug}/prediction`}
            title="Prediction Page"
            summary="Open the pre-match model, head-to-head record and venue angle for this fixture."
            meta={[matchData.team1.shortName, matchData.team2.shortName, "Prediction"]}
          />
          <MatchCard
            href={`/venue/${matchData.venue.slug}/stats`}
            title={`${matchData.venue.name} Stats`}
            summary="View venue scoring trends, toss impact and winning patterns."
            meta={[matchData.venue.city, "Venue", "Stats"]}
          />
          {matchData.relatedMatches.map((match) => (
            <MatchCard
              key={match.slug}
              href={`/match/${match.slug}`}
              title={`${match.label} Related Match`}
              summary={match.result}
              meta={[`Season ${match.season}`, "Related fixture"]}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
