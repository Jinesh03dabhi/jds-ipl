import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import MatchContent from "@/components/intent/MatchContent";
import styles from "@/components/intent/intent.module.css";
import {
  formatIndiaDateTime,
  getIplLiveSnapshot,
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

  return {
    title: `${match.team1.name} vs ${match.team2.name} Live Updates | IPL 2026`,
    description: `${match.team1.name} vs ${match.team2.name} live match page with toss status, live-state handoff and links into the main IPL live score center.`,
    alternates: {
      canonical: `${SITE_URL}/matches/${matchSlug}/live`,
    },
  };
}

export default async function MatchLivePage({ params }: PageProps) {
  const { matchSlug } = await params;
  const [match, liveSnapshot] = await Promise.all([
    getMatchByDetailSlug(matchSlug),
    getIplLiveSnapshot(),
  ]);

  if (!match) {
    notFound();
  }

  const isThisMatchLive = liveSnapshot.match?.id === match.id && liveSnapshot.type === "live";
  const prediction = getPredictionForMatch(match);
  const faqs: FaqItem[] = [
    {
      question: `Is ${match.team1.name} vs ${match.team2.name} live right now?`,
      answer: isThisMatchLive
        ? `Yes. ${match.team1.name} vs ${match.team2.name} is the currently active live match in the IPL live snapshot.`
        : `Not at the moment. This route still acts as the stable live-page URL for the fixture and points users to the main live center when the match goes live.`,
    },
    {
      question: "Where should I go for full live score updates?",
      answer:
        "The dedicated site-wide live center remains the best destination for ball-by-ball updates, while this page keeps the fixture-specific context and loop navigation intact.",
    },
    {
      question: "Will the toss and playing XI appear on this page?",
      answer:
        "Yes, when the source provides them. The page avoids pretending those fields exist before they are actually available.",
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
            eventStatus: isThisMatchLive
              ? "https://schema.org/EventInProgress"
              : "https://schema.org/EventScheduled",
            location: {
              "@type": "Place",
              name: match.venue,
            },
            url: `${SITE_URL}/matches/${matchSlug}/live`,
          },
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Live Loop</div>
          <h1 className={styles.title}>
            {match.team1.name} vs {match.team2.name} Live Page
          </h1>
          <p className={styles.subtitle}>
            This is the fixture-specific live route in the content loop. It stays useful before the start, during the game and after the toss because it keeps the same match URL while pointing users into the broader live score center when full ball-by-ball coverage is active.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{match.matchNumber}</span>
            <span className={styles.metaBadge}>{formatIndiaDateTime(match.dateTimeGMT)} IST</span>
            <span className={styles.metaBadge}>
              {isThisMatchLive ? "Live now" : match.status === "completed" ? "Completed" : "Not live yet"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Live-State Overview</h2>
            <div className={styles.textBlock}>
              <p>
                A good live page does not only work at the exact moment the first ball is bowled. It also needs to hold its shape before the game starts and after the toss, so users always find the same match URL again. That is why this route stays tied to the fixture itself, while the site-wide live center handles the heavier real-time scoreboard view.
              </p>
              <p>
                {isThisMatchLive
                  ? `${match.team1.name} vs ${match.team2.name} is currently the active live fixture, so this route now acts as the cleanest match-specific entry point into the live experience.`
                  : `${match.team1.name} vs ${match.team2.name} is not the currently active live IPL fixture, so this page keeps the match context ready and sends users into the main live center when the game goes live.`}
              </p>
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Live Handoff</h2>
            <div className={styles.summaryList}>
              <div className={styles.summaryItem}>
                <span>{isThisMatchLive ? "This fixture is live in the current snapshot." : "This fixture is not live in the current snapshot."}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>
                  Main live center: <Link href="/ipl-live-score-today" className={styles.secondaryAction}>IPL live score today</Link>
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span>{prediction.confidence}: {prediction.winner.name} was the pre-match editorial lean.</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <MatchContent
        match={match}
        quickSummary={[
          `${match.team1.name} vs ${match.team2.name} is mapped to this fixture-specific live route.`,
          isThisMatchLive
            ? "This match is the active IPL live fixture in the current snapshot."
            : "This match has not activated as the live IPL fixture in the current snapshot yet.",
          "The toss, playing XI and prediction blocks stay in place so the page remains useful through the full matchday window.",
        ]}
        tossText={
          match.tossWinner
            ? `${match.tossWinner} won the toss and chose to ${match.tossChoice || "make the first call"}.`
            : "The toss result is not available yet in the current match feed."
        }
        playingXiText={`This live-page route keeps the playing XI section visible because users expect it on matchday, but it does not fake a team sheet if the source has not posted the official XI.`}
        predictionTitle="Pre-Live Match Read"
        predictionText={`${prediction.confidence}: ${prediction.winner.name}. ${prediction.reasons.join(" ")}`}
        team1Players={getKeyPlayers(match.team1.name)}
        team2Players={getKeyPlayers(match.team2.name)}
      />

      <InternalLinkGrid
        title="Live Match Navigation"
        links={[
          {
            href: "/ipl-live-score-today",
            label: "Main Live Center",
            description: "Open the full live score route for the site-wide match center.",
          },
          {
            href: `/matches/${matchSlug}`,
            label: "Back to Preview",
            description: "Return to the preview page and pre-match context for this fixture.",
          },
          {
            href: `/matches/${matchSlug}/result`,
            label: "Result Page",
            description: "Switch to the result page once the match is finished.",
          },
          {
            href: `/${match.venueSlug}`,
            label: "Pitch Report",
            description: "Review the venue conditions tied to this match.",
          },
        ]}
      />

      <FaqSection title="Match Live Page FAQ" faqs={faqs} />
    </div>
  );
}
