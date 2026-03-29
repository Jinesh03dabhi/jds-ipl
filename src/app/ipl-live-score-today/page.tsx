import type { Metadata } from "next";
import LiveScoreClient from "@/app/live-score/LiveScoreClient";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import MatchContent from "@/components/intent/MatchContent";
import styles from "@/components/intent/intent.module.css";
import {
  formatIndiaDateLong,
  formatIndiaDateTime,
  getIndiaDateKey,
  getIplLiveSnapshot,
  getIplSchedule,
  getKeyPlayers,
  getMatchesForIndiaDate,
  getPredictionForMatch,
} from "@/lib/ipl-data";
import { SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/ipl-live-score-today`;

function buildFaqs(todayLabel: string, hasMatch: boolean, nextMatchText: string): FaqItem[] {
  return [
    {
      question: "Is there an IPL live score today match update on this page?",
      answer: hasMatch
        ? `Yes. This page is built for the real IPL live score today match intent and updates the toss, score status and quick links for ${todayLabel}.`
        : `There is no IPL match scheduled for ${todayLabel}. The page still tracks the next confirmed fixture so users searching for today's IPL status get an honest answer quickly.`,
    },
    {
      question: "Where will the today match playing 11 appear?",
      answer:
        "The today match playing 11 block appears here after the official toss update. If the source has not published lineups yet, the page shows a lineup status note instead of guessing the XI.",
    },
    {
      question: "Does this page show the IPL toss winner today?",
      answer:
        "Yes. The toss winner section updates only when the live source provides a confirmed toss outcome, so the page avoids filling in unverified information.",
    },
    {
      question: "What if there is no IPL game today?",
      answer: nextMatchText,
    },
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  const snapshot = await getIplLiveSnapshot();
  const todayKey = getIndiaDateKey(new Date());
  const isTodayMatch =
    snapshot.match && getIndiaDateKey(snapshot.match.dateTimeGMT) === todayKey;

  const title = isTodayMatch
    ? `${snapshot.match?.team1.shortName} vs ${snapshot.match?.team2.shortName} IPL Live Score Today Match | IPL Scorebook`
    : "IPL Live Score Today Match | Toss, Playing 11 and Live Update Hub";

  const description = isTodayMatch
    ? `${snapshot.match?.team1.name} vs ${snapshot.match?.team2.name} IPL live score today match page with toss status, today match playing 11 tracker and quick links to the live center.`
    : "IPL live score today match page with verified today status, toss and playing 11 tracker, plus the next confirmed IPL fixture when there is no match scheduled.";

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
      siteName: "IPL Scorebook",
      locale: "en_IN",
      type: "website",
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

export default async function IplLiveScoreTodayPage() {
  const [snapshot, schedule] = await Promise.all([getIplLiveSnapshot(), getIplSchedule()]);
  const todayKey = getIndiaDateKey(new Date());
  const todayLabel = formatIndiaDateLong(todayKey);
  const todayMatches = getMatchesForIndiaDate(schedule.matches, todayKey);
  const focusMatch =
    snapshot.match && getIndiaDateKey(snapshot.match.dateTimeGMT) === todayKey
      ? snapshot.match
      : todayMatches[0] || null;
  const nextMatch =
    schedule.matches.find((match) => new Date(match.dateTimeGMT).getTime() > Date.now()) || null;
  const prediction = focusMatch ? getPredictionForMatch(focusMatch) : null;
  const faqs = buildFaqs(
    todayLabel,
    Boolean(focusMatch),
    nextMatch
      ? `There is no IPL fixture on ${todayLabel}. The next confirmed game is ${nextMatch.team1.name} vs ${nextMatch.team2.name} on ${formatIndiaDateTime(nextMatch.dateTimeGMT)} IST.`
      : `There is no confirmed IPL fixture on ${todayLabel} in the current schedule feed.`
  );

  const structuredData = [
    buildFaqSchema(faqs),
    focusMatch
      ? {
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: `${focusMatch.team1.name} vs ${focusMatch.team2.name}`,
          sport: "Cricket",
          eventStatus:
            snapshot.type === "live"
              ? "https://schema.org/EventInProgress"
              : snapshot.type === "completed"
              ? "https://schema.org/EventCompleted"
              : "https://schema.org/EventScheduled",
          startDate: focusMatch.dateTimeGMT,
          location: {
            "@type": "Place",
            name: focusMatch.venue,
          },
          url: pageUrl,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd data={structuredData} />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Search Intent Hub</div>
          <h1 className={styles.title}>IPL Live Score Today Match</h1>
          <p className={styles.subtitle}>
            This page is built for the real-world query "ipl live score today match". It gives a fast answer first, then layers in toss status, today match playing 11 guidance, quick prediction context and direct paths into the full live center without stuffing duplicate content.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{todayLabel}</span>
            <span className={styles.metaBadge}>
              {focusMatch
                ? `${focusMatch.team1.shortName} vs ${focusMatch.team2.shortName}`
                : "No IPL match scheduled today"}
            </span>
            <span className={styles.metaBadge}>{snapshot.message}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Today&apos;s Status</h2>
            <div className={styles.textBlock}>
              {focusMatch ? (
                <>
                  <p>
                    {focusMatch.team1.name} vs {focusMatch.team2.name} is the IPL fixture attached to today&apos;s search intent. The confirmed start time is {formatIndiaDateTime(focusMatch.dateTimeGMT)} IST at {focusMatch.venue}. If the match is live, this route acts as the short-answer landing page and pushes users into the full score center below.
                  </p>
                  <p>
                    The copy here stays intentionally compact: searchers looking for "ipl toss winner today" or "today match playing 11" usually want the current state quickly, not a wall of generic cricket text. That is why the toss and lineup blocks below only fill in once the source is ready.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    There is no IPL match scheduled for {todayLabel}. Instead of pretending there is live action, this page tells users that clearly and points them to the next confirmed fixture, which is better for trust and better for long-term search performance than a thin or misleading live page.
                  </p>
                  <p>
                    The current official 2026 schedule window in this project begins on March 28, 2026, so before the tournament starts the best user experience is a verified "no match today" response plus the upcoming fixture path.
                  </p>
                </>
              )}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Fast Facts</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Today Match</div>
                <div className={styles.statValue}>
                  {focusMatch ? `${focusMatch.team1.shortName} vs ${focusMatch.team2.shortName}` : "None"}
                </div>
                <div className={styles.statSubtext}>
                  {focusMatch ? focusMatch.venue : "No IPL fixture is listed for today in the current schedule feed."}
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Toss Winner</div>
                <div className={styles.statValue}>
                  {focusMatch?.tossWinner ? focusMatch.tossWinner : "Pending"}
                </div>
                <div className={styles.statSubtext}>Updated only when the source confirms the toss.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Playing XI</div>
                <div className={styles.statValue}>Tracker</div>
                <div className={styles.statSubtext}>No guessed lineups. Official teams only.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Next Fixture</div>
                <div className={styles.statValue}>
                  {nextMatch ? `${nextMatch.team1.shortName} vs ${nextMatch.team2.shortName}` : "TBD"}
                </div>
                <div className={styles.statSubtext}>
                  {nextMatch ? formatIndiaDateTime(nextMatch.dateTimeGMT) : "Waiting for the next schedule update."}
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
                <span className={`${styles.pill} ${snapshot.type === "live" ? styles.livePill : ""}`}>
                  {snapshot.type === "live" ? <span className={styles.liveDot} /> : null}
                  {snapshot.type === "live" ? "Live now" : "Upcoming match card"}
                </span>
              </div>

              <div className={styles.matchTeams}>
                <div className={styles.teamPanel}>
                  <div className={styles.teamLabel}>Team 1</div>
                  <div className={styles.teamName}>{focusMatch.team1.name}</div>
                  <div className={styles.teamScore}>{focusMatch.score.team1 || "Score pending"}</div>
                </div>
                <div className={styles.vsBlock}>
                  <div className={styles.vsText}>vs</div>
                  <div className={styles.vsHint}>
                    {snapshot.type === "live"
                      ? "Real-time updates continue below"
                      : "Preview blocks update as match time gets closer"}
                  </div>
                </div>
                <div className={styles.teamPanel}>
                  <div className={styles.teamLabel}>Team 2</div>
                  <div className={styles.teamName}>{focusMatch.team2.name}</div>
                  <div className={styles.teamScore}>{focusMatch.score.team2 || "Score pending"}</div>
                </div>
              </div>
            </div>
          </section>

          <MatchContent
            match={focusMatch}
            quickSummary={[
              `${focusMatch.team1.name} vs ${focusMatch.team2.name} starts at ${formatIndiaDateTime(focusMatch.dateTimeGMT)} IST.`,
              focusMatch.tossWinner
                ? `${focusMatch.tossWinner} have already won the toss.`
                : "The toss winner section will update here as soon as the coin flip is official.",
              focusMatch.score.team1 || focusMatch.score.team2
                ? "Live score strings are already available for at least one innings."
                : "No innings score has been posted yet, so this is still a pre-match state.",
            ]}
            tossText={
              focusMatch.tossWinner
                ? `${focusMatch.tossWinner} won the toss and chose to ${focusMatch.tossChoice || "make the first call"}.`
                : `The IPL toss winner today for ${focusMatch.team1.shortName} vs ${focusMatch.team2.shortName} is still pending.`
            }
            playingXiText={`The confirmed playing XI for ${focusMatch.team1.shortName} and ${focusMatch.team2.shortName} has not been published in the current live source yet, so this page keeps the lineup status honest and focuses on key squad names instead of inventing an XI.`}
            predictionTitle="Match Prediction"
            predictionText={
              prediction
                ? `${prediction.confidence}: ${prediction.winner.name}. ${prediction.reasons.join(" ")}`
                : "Prediction notes will appear once a valid match card is available."
            }
            team1Players={getKeyPlayers(focusMatch.team1.name)}
            team2Players={getKeyPlayers(focusMatch.team2.name)}
          />

          {snapshot.type === "live" || snapshot.type === "upcoming" ? (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Live Center</h2>
              <LiveScoreClient showHeading={false} />
            </section>
          ) : null}
        </>
      ) : (
        <section className={styles.section}>
          <div className={styles.emptyState}>
            No IPL match is scheduled for {todayLabel}. Search-intent pages still need to answer the query cleanly, so this page now works as a verified status hub instead of a fake live layer.
          </div>
        </section>
      )}

      <InternalLinkGrid
        title="Explore More IPL Pages"
        links={[
          {
            href: "/live-score",
            label: "Full Live Score Center",
            description: "Ball-by-ball coverage and live scorecards when the match is underway.",
          },
          {
            href: "/points-table",
            label: "IPL 2026 Points Table",
            description: "Track standings, points and NRR in the season table.",
          },
          {
            href: "/predictions",
            label: "Match Prediction Hub",
            description: "Browse upcoming match previews and prediction pages.",
          },
          {
            href: "/schedule",
            label: "IPL 2026 Schedule",
            description: "See fixture dates, venues and the current confirmed match list.",
          },
        ]}
      />

      <FaqSection title="IPL Live Score Today FAQ" faqs={faqs} />
    </div>
  );
}
