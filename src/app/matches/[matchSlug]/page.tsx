import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import EngagementPanel from "@/components/intent/EngagementPanel";
import MatchContent from "@/components/intent/MatchContent";
import MatchEditorialSections from "@/components/intent/MatchEditorialSections";
import TrustSignals from "@/components/intent/TrustSignals";
import styles from "@/components/intent/intent.module.css";
import {
  formatIndiaDateTime,
  getIplSchedule,
  getKeyPlayers,
  getMatchByDetailSlug,
  getPredictionForMatch,
} from "@/lib/ipl-data";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  formatEditorialTimestamp,
} from "@/lib/content";
import { buildMatchEditorial } from "@/lib/match-editorial";
import { DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

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

  const title = `${match.team1.name} vs ${match.team2.name} Preview | IPL 2026 Match Guide`;
  const description = `${match.team1.name} vs ${match.team2.name} preview with match guide, toss tracker, key players and links to live and result pages.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/matches/${matchSlug}`,
    },
  };
}

export default async function MatchPreviewPage({ params }: PageProps) {
  const { matchSlug } = await params;
  const [match, schedule] = await Promise.all([
    getMatchByDetailSlug(matchSlug),
    getIplSchedule(),
  ]);

  if (!match) {
    notFound();
  }

  const prediction = getPredictionForMatch(match);
  const editorial = buildMatchEditorial(match, "preview");
  const relatedMatches = schedule.matches
    .filter((candidate) => {
      if (candidate.id === match.id) {
        return false;
      }

      return (
        candidate.venueSlug === match.venueSlug ||
        candidate.team1.name === match.team1.name ||
        candidate.team1.name === match.team2.name ||
        candidate.team2.name === match.team1.name ||
        candidate.team2.name === match.team2.name
      );
    })
    .slice(0, 3);
  const faqs: FaqItem[] = [
    {
      question: `When is ${match.team1.name} vs ${match.team2.name}?`,
      answer: `${match.team1.name} vs ${match.team2.name} is scheduled for ${formatIndiaDateTime(match.dateTimeGMT)} IST.`,
    },
    {
      question: "Will this preview page update into live and result coverage?",
      answer:
        "Yes. This preview is the first page in the content loop for the fixture, and it links directly to the dedicated live page and the result page for the same match.",
    },
    {
      question: "Does this page guess the playing XI?",
      answer:
        "No. It keeps a lineup tracker because that is a real search need, but it avoids publishing made-up XIs before the official team sheets are available.",
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: `${match.team1.name} vs ${match.team2.name} Preview`,
            description:
              `${match.team1.name} vs ${match.team2.name} preview with match summary, player analysis, venue insights and FAQ coverage.`,
            path: `/matches/${matchSlug}`,
            keywords: [
              `${match.team1.name} vs ${match.team2.name} preview`,
              `${match.team1.shortName} vs ${match.team2.shortName} prediction`,
              "ipl match preview",
            ],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Predictions", path: "/predictions" },
            {
              name: `${match.team1.shortName} vs ${match.team2.shortName} Preview`,
              path: `/matches/${matchSlug}`,
            },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: `${match.team1.name} vs ${match.team2.name}`,
            sport: "Cricket",
            startDate: match.dateTimeGMT,
            location: {
              "@type": "Place",
              name: match.venue,
            },
            url: `${SITE_URL}/matches/${matchSlug}`,
          },
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Preview Loop</div>
          <h1 className={styles.title}>
            {match.team1.name} vs {match.team2.name} Preview
          </h1>
          <p className={styles.subtitle}>
            This preview page is the evergreen home for the fixture before the live score takes over. It gives the schedule details, pitch and toss context, key players and the cleanest internal links for users who want to follow one match from preview to result.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{match.matchNumber}</span>
            <span className={styles.metaBadge}>{formatIndiaDateTime(match.dateTimeGMT)} IST</span>
            <span className={styles.metaBadge}>{match.venue}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Fixture Preview</h2>
            <div className={styles.textBlock}>
              <p>
                This fixture page is built to stay useful before first ball. Instead of mixing generic IPL copy with a schedule card, the preview focuses on what users usually need before the game: start time, toss expectations, which team may have the early edge and where to go once the game turns live.
              </p>
              <p>
                The current editorial lean is toward {prediction.winner.name}. That is a reasoned preview call, not a data-fake certainty. As the match gets closer, the toss and lineup blocks become more important than the original pre-match edge.
              </p>
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Preview Call</h2>
            <div className={styles.summaryList}>
              <div className={styles.summaryItem}>
                <span>{prediction.confidence}: {prediction.winner.name}</span>
              </div>
              {prediction.reasons.map((reason) => (
                <div key={reason} className={styles.summaryItem}>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <MatchContent
        match={match}
        quickSummary={[
          `${match.team1.name} vs ${match.team2.name} starts at ${formatIndiaDateTime(match.dateTimeGMT)} IST.`,
          `${prediction.winner.name} hold the ${prediction.confidence.toLowerCase()} in the current preview model.`,
          "This preview page connects directly to the live page and post-match result page for the same fixture.",
        ]}
        tossText={
          match.tossWinner
            ? `${match.tossWinner} won the toss and chose to ${match.tossChoice || "make the first call"}.`
            : "The toss has not happened yet, so the toss section stays in preview mode."
        }
        playingXiText={`This preview keeps the playing XI section visible because users search for it directly. When official XIs are not available yet, the section stays as a status tracker instead of filling in speculative names.`}
        predictionTitle="Match Prediction"
        predictionText={`${prediction.confidence}: ${prediction.winner.name}. ${prediction.reasons.join(" ")}`}
        team1Players={getKeyPlayers(match.team1.name)}
        team2Players={getKeyPlayers(match.team2.name)}
      />

      <MatchEditorialSections editorial={editorial} />

      {relatedMatches.length ? (
        <InternalLinkGrid
          title="Related Matches"
          links={relatedMatches.map((candidate) => ({
            href: `/matches/${candidate.detailSlug}`,
            label: `${candidate.team1.shortName} vs ${candidate.team2.shortName}`,
            description: `${candidate.matchNumber} • ${formatIndiaDateTime(candidate.dateTimeGMT)} IST • ${candidate.venue}`,
          }))}
        />
      ) : null}

      <EngagementPanel
        pageKey={`match-preview:${match.id}`}
        title={`${match.team1.name} vs ${match.team2.name} Preview`}
        path={`/matches/${matchSlug}`}
      />

      <InternalLinkGrid
        title="This Match Loop"
        links={[
          {
            href: `/${match.predictionSlug}`,
            label: "Prediction Page",
            description: "Open the search-intent head-to-head prediction page.",
          },
          {
            href: `/matches/${matchSlug}/live`,
            label: "Live Page",
            description: "Switch to the live route when the match starts.",
          },
          {
            href: `/matches/${matchSlug}/result`,
            label: "Result Page",
            description: "Open the post-match result page after the fixture ends.",
          },
          {
            href: `/${match.venueSlug}`,
            label: "Pitch Report",
            description: "Read the venue-specific pitch report for this match.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote={editorial.sourcesNote}
        wordCount={editorial.contentWordCount}
      />

      <FaqSection title="Match Preview FAQ" faqs={faqs} />
    </div>
  );
}
