import type { Metadata } from "next";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import MatchContent from "@/components/intent/MatchContent";
import styles from "@/components/intent/intent.module.css";
import {
  formatIndiaDateLong,
  formatIndiaDateTime,
  getIndiaDateKey,
  getIplSchedule,
  getKeyPlayers,
  getLatestCompletedMatch,
  getMatchesForIndiaDate,
  getPredictionForMatch,
  shiftIndiaDate,
} from "@/lib/ipl-data";
import { SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/ipl-match-result-yesterday`;

export async function generateMetadata(): Promise<Metadata> {
  const schedule = await getIplSchedule();
  const yesterdayKey = shiftIndiaDate(getIndiaDateKey(new Date()), -1);
  const yesterdayMatch = getMatchesForIndiaDate(
    schedule.matches.filter((match) => match.status === "completed"),
    yesterdayKey
  )[0];

  const title = yesterdayMatch
    ? `IPL Match Result Yesterday: ${yesterdayMatch.team1.shortName} vs ${yesterdayMatch.team2.shortName}`
    : "IPL Match Result Yesterday | Verified Result Tracker";
  const description = yesterdayMatch
    ? `${yesterdayMatch.team1.name} vs ${yesterdayMatch.team2.name} IPL match result yesterday, with winner, scoreline and result summary.`
    : "Verified IPL match result yesterday page that reports when there was no completed IPL fixture instead of inventing a recap.";

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      locale: "en_IN",
      siteName: "IPL Scorebook",
      images: [`${SITE_URL}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function IplMatchResultYesterdayPage() {
  const schedule = await getIplSchedule();
  const todayKey = getIndiaDateKey(new Date());
  const yesterdayKey = shiftIndiaDate(todayKey, -1);
  const yesterdayLabel = formatIndiaDateLong(yesterdayKey);
  const completedYesterday = getMatchesForIndiaDate(
    schedule.matches.filter((match) => match.status === "completed"),
    yesterdayKey
  );
  const focusMatch = completedYesterday[0] || null;
  const latestCompleted = getLatestCompletedMatch(schedule.matches);
  const nextMatch =
    schedule.matches.find((match) => new Date(match.dateTimeGMT).getTime() > Date.now()) || null;
  const prediction = focusMatch ? getPredictionForMatch(focusMatch) : null;

  const faqs: FaqItem[] = [
    {
      question: "What was the IPL match result yesterday?",
      answer: focusMatch
        ? `${focusMatch.team1.name} vs ${focusMatch.team2.name} was the completed IPL match on ${yesterdayLabel}, and the result was ${focusMatch.result || "recorded in the score feed"}.`
        : `There was no completed IPL match on ${yesterdayLabel} in the current schedule feed.`,
    },
    {
      question: "Why does this page sometimes say there was no IPL match yesterday?",
      answer:
        "Because the page is tied to the exact previous day in India time. If the league was off, before the season start, or between matchdays, the page reports that truthfully rather than recycling an older result as if it happened yesterday.",
    },
    {
      question: "Can I open the latest completed match if yesterday had no game?",
      answer:
        latestCompleted
          ? `Yes. The latest completed fixture currently available is ${latestCompleted.team1.name} vs ${latestCompleted.team2.name}.`
          : "Once completed matches are present in the schedule feed, this page will point directly to the latest result page as well.",
    },
    {
      question: "Does this page also link to live score and predictions?",
      answer:
        "Yes. Result pages are linked back to live score, points table and prediction routes so users can move between recap, context and the next upcoming fixture.",
    },
  ];

  const structuredData = [
    buildFaqSchema(faqs),
    focusMatch
      ? {
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: `${focusMatch.team1.name} vs ${focusMatch.team2.name}`,
          sport: "Cricket",
          eventStatus: "https://schema.org/EventCompleted",
          startDate: focusMatch.dateTimeGMT,
          location: {
            "@type": "Place",
            name: focusMatch.venue,
          },
          url: pageUrl,
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "IPL Match Result Yesterday",
          url: pageUrl,
        },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd data={structuredData} />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Result Intent</div>
          <h1 className={styles.title}>IPL Match Result Yesterday</h1>
          <p className={styles.subtitle}>
            This route is for users who search "ipl match result yesterday" and want one clear answer. It checks the previous day in India time first, then either shows the actual winner and scoreline or states plainly that there was no IPL match on that date.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{yesterdayLabel}</span>
            <span className={styles.metaBadge}>
              {focusMatch
                ? `${focusMatch.team1.shortName} vs ${focusMatch.team2.shortName}`
                : "No completed IPL match"}
            </span>
            <span className={styles.metaBadge}>
              {focusMatch ? focusMatch.result || "Completed" : "Verified no-result state"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Yesterday&apos;s Answer</h2>
            <div className={styles.textBlock}>
              {focusMatch ? (
                <>
                  <p>
                    The completed IPL fixture on {yesterdayLabel} was {focusMatch.team1.name} vs {focusMatch.team2.name}. The official result line currently available in the schedule feed is {focusMatch.result || "recorded in the match center"}, with score strings of {focusMatch.score.team1 || "pending"} and {focusMatch.score.team2 || "pending"}.
                  </p>
                  <p>
                    This page deliberately keeps the recap short and useful. Searchers using "ipl match result yesterday" usually want the winner, the margin and the next click path into standings or the next fixture, not a generic essay that repeats the score ten times.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    There was no completed IPL match on {yesterdayLabel}. That can happen before the tournament starts, on scheduled off-days, or when the current public schedule feed has not yet entered a completed match for the previous date.
                  </p>
                  <p>
                    Saying "no match yesterday" is the correct SEO answer here. It is better for trust, avoids stale result pages, and still lets users move into the live page, the schedule or the next match prediction instead of bouncing away.
                  </p>
                </>
              )}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Result Snapshot</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Yesterday</div>
                <div className={styles.statValue}>{focusMatch ? "Match played" : "No match"}</div>
                <div className={styles.statSubtext}>{yesterdayLabel}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Winner</div>
                <div className={styles.statValue}>{focusMatch?.winner || "N/A"}</div>
                <div className={styles.statSubtext}>
                  {focusMatch ? focusMatch.result || "Result stored in feed." : "No completed result to report for yesterday."}
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Latest Completed</div>
                <div className={styles.statValue}>
                  {latestCompleted ? `${latestCompleted.team1.shortName} vs ${latestCompleted.team2.shortName}` : "Pending"}
                </div>
                <div className={styles.statSubtext}>
                  {latestCompleted ? latestCompleted.result || "Completed IPL fixture." : "No completed match available yet."}
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Next Match</div>
                <div className={styles.statValue}>
                  {nextMatch ? `${nextMatch.team1.shortName} vs ${nextMatch.team2.shortName}` : "TBD"}
                </div>
                <div className={styles.statSubtext}>
                  {nextMatch ? formatIndiaDateTime(nextMatch.dateTimeGMT) : "Waiting for next confirmed fixture."}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {focusMatch ? (
        <>
          <section className={styles.section}>
            <div className={styles.matchCard}>
              <div className={styles.matchHeader}>
                <div>
                  <h2 className={styles.matchTitle}>
                    {focusMatch.team1.name} vs {focusMatch.team2.name}
                  </h2>
                  <div className={styles.matchMeta}>
                    <span className={styles.pill}>{focusMatch.matchNumber}</span>
                    <span className={styles.pill}>{formatIndiaDateTime(focusMatch.dateTimeGMT)} IST</span>
                    <span className={styles.pill}>{focusMatch.venue}</span>
                  </div>
                </div>
                <span className={styles.pill}>Completed match</span>
              </div>

              <div className={styles.matchTeams}>
                <div className={styles.teamPanel}>
                  <div className={styles.teamLabel}>Team 1</div>
                  <div className={styles.teamName}>{focusMatch.team1.name}</div>
                  <div className={styles.teamScore}>{focusMatch.score.team1 || "Score unavailable"}</div>
                </div>
                <div className={styles.vsBlock}>
                  <div className={styles.vsText}>Result</div>
                  <div className={styles.vsHint}>{focusMatch.result || "Completed fixture"}</div>
                </div>
                <div className={styles.teamPanel}>
                  <div className={styles.teamLabel}>Team 2</div>
                  <div className={styles.teamName}>{focusMatch.team2.name}</div>
                  <div className={styles.teamScore}>{focusMatch.score.team2 || "Score unavailable"}</div>
                </div>
              </div>
            </div>
          </section>

          <MatchContent
            match={focusMatch}
            quickSummary={[
              `${focusMatch.team1.name} vs ${focusMatch.team2.name} was the IPL result page target for ${yesterdayLabel}.`,
              focusMatch.winner
                ? `${focusMatch.winner} were recorded as the winners in the result feed.`
                : "The winner field is not available yet, but the result string is still shown above.",
              focusMatch.score.team1 && focusMatch.score.team2
                ? "Both innings score strings are available for the match."
                : "At least one innings score string is still missing from the current feed.",
            ]}
            tossText={
              focusMatch.tossWinner
                ? `${focusMatch.tossWinner} won the toss and chose to ${focusMatch.tossChoice || "make the first call"}.`
                : "The toss winner is not present in the current result feed for this completed match."
            }
            playingXiText={`The result page keeps the playing XI block visible for search intent, but it does not fake lineups after the fact. When official XI data is not available in the source, the page falls back to a clear status message and key player context.`}
            predictionTitle="Pre-Match Prediction Lens"
            predictionText={
              prediction
                ? `Editorial prediction before the game would have leaned ${prediction.confidence.toLowerCase()} toward ${prediction.winner.name}, based on venue and team context rather than made-up lineup data.`
                : "No pre-match prediction note is available for this result page."
            }
            team1Players={getKeyPlayers(focusMatch.team1.name)}
            team2Players={getKeyPlayers(focusMatch.team2.name)}
          />
        </>
      ) : (
        <section className={styles.section}>
          <div className={styles.emptyState}>
            No completed IPL fixture is attached to {yesterdayLabel}. This page now behaves as a verified no-result answer rather than recycling an older score as if it happened yesterday.
          </div>
        </section>
      )}

      <InternalLinkGrid
        title="Follow the Next Step"
        links={[
          {
            href: "/ipl-live-score-today",
            label: "IPL Live Score Today",
            description: "Move from yesterday&apos;s answer into today&apos;s verified match status.",
          },
          {
            href: "/ipl-points-table-2026",
            label: "Points Table 2026",
            description: "See whether the latest result changed points and NRR.",
          },
          {
            href: "/predictions",
            label: "Prediction Pages",
            description: "Open preview pages for the next set of confirmed fixtures.",
          },
          {
            href: "/schedule",
            label: "IPL Schedule",
            description: "Check the next confirmed matchday and venue list.",
          },
        ]}
      />

      <FaqSection title="IPL Match Result Yesterday FAQ" faqs={faqs} />
    </div>
  );
}
