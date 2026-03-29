import type { Metadata } from "next";
import LiveScoreClient from "./LiveScoreClient";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import TrustSignals from "@/components/intent/TrustSignals";
import styles from "@/components/intent/intent.module.css";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  countWords,
  formatEditorialTimestamp,
} from "@/lib/content";
import { getIplLiveSnapshot } from "@/lib/ipl-data";
import { DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/live-score`;

export const metadata: Metadata = {
  title: "IPL 2026 Live Score - Ball by Ball Updates | IPL Scorebook",
  description:
    "Follow IPL 2026 live score coverage with ball-by-ball context, match state explanation and connected routes into teams, players and standings.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "IPL 2026 Live Score - Ball by Ball Updates | IPL Scorebook",
    description:
      "Follow IPL 2026 live score coverage with ball-by-ball context, match state explanation and connected routes into teams, players and standings.",
    url: pageUrl,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [`${SITE_URL}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Live Score - Ball by Ball Updates | IPL Scorebook",
    description:
      "Follow IPL 2026 live score coverage with ball-by-ball context, match state explanation and connected routes into teams, players and standings.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default async function LiveScorePage() {
  const snapshot = await getIplLiveSnapshot();
  const paragraphs = [
    "A live-score page should not behave like a blank shell that only becomes useful once the scoreboard moves. Cricket fans often land before the toss, during a lull in the innings, or after the match has ended and still need the same route to answer practical questions quickly. IPL Scorebook therefore treats the live-score page as a durable matchday hub. It carries the real-time widget, but it also explains what users are looking at and where they should go next if they want more than the raw score.",
    "That matters because score reading is never just about the number itself. A live total can be misleading without context about venue pace, whether the batting side is ahead of the expected rate, or whether wickets have fallen at the wrong time. The live page is designed to support those reading habits by keeping related routes nearby and by preserving some editorial framing instead of dropping users into an isolated component with no supporting content.",
    `The current site-wide live snapshot says: ${snapshot.message} This broad route stays useful whether the active state is live, upcoming, completed or waiting. That approach helps both user trust and search quality because the URL can answer the query honestly on every kind of matchday instead of pretending that a score exists when the competition is between fixtures or still approaching first ball.`,
  ];

  const faqs: FaqItem[] = [
    {
      question: "What is the difference between this page and IPL Live Score Today?",
      answer:
        "This route is the broader live-score center, while IPL Live Score Today is the intent-focused page built around the most common daily search query.",
    },
    {
      question: "Will this page still work when no match is live?",
      answer:
        "Yes. It is designed to remain useful before a match starts or between fixtures, rather than acting like a dead scoreboard shell.",
    },
    {
      question: "Can I move from live score into teams, players and standings?",
      answer:
        "Yes. The live route is connected to player, team and table pages so users can research the match without losing the live context.",
    },
  ];

  const wordCount = countWords(paragraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "IPL 2026 Live Score",
            description:
              "IPL live score route with ball-by-ball context and connected research paths.",
            path: "/live-score",
            keywords: ["ipl live score", "live cricket score", "ipl match today"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Live Score", path: "/live-score" },
          ]),
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Live Match Center</div>
          <h1 className={styles.title}>IPL 2026 Live Score</h1>
          <p className={styles.subtitle}>
            Ball-by-ball coverage with enough context to stay useful before the toss, during the
            innings and after the scoreboard stops moving.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>Snapshot state: {snapshot.type}</span>
            <span className={styles.metaBadge}>{snapshot.message}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Why This Live Page Exists</h2>
          <div className={styles.textBlock}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Live Scoreboard</h2>
          <LiveScoreClient showHeading={false} />
        </div>
      </section>

      <InternalLinkGrid
        title="Matchday Research Paths"
        links={[
          {
            href: "/ipl-live-score-today",
            label: "IPL Live Score Today",
            description: "Open the daily-intent route for toss, lineup status and cleaner short answers.",
          },
          {
            href: "/points-table",
            label: "Points Table",
            description: "See how the live fixture can reshape standings and NRR.",
          },
          {
            href: "/players",
            label: "Player Directory",
            description: "Jump into the player layer behind the current live match.",
          },
          {
            href: "/ipl-teams",
            label: "IPL Teams",
            description: "Move into franchise pages and venue-aware squad context.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="Live score coverage uses the current IPL Scorebook live snapshot and keeps the surrounding editorial content honest when a match is upcoming, active, completed or still pending."
        wordCount={wordCount}
      />

      <FaqSection title="Live Score FAQ" faqs={faqs} />
    </div>
  );
}
