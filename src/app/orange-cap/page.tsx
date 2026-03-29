import type { Metadata } from "next";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import LeadersTable from "@/components/intent/LeadersTable";
import TrustSignals from "@/components/intent/TrustSignals";
import styles from "@/components/intent/intent.module.css";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  countWords,
  formatEditorialTimestamp,
} from "@/lib/content";
import { getOrangeCapLeaders } from "@/lib/leaderboards";
import { DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/orange-cap`;

export const metadata: Metadata = {
  title: "Orange Cap 2026 | IPL Top Run Scorers",
  description:
    "Track the IPL 2026 Orange Cap race with batting leaders, strike-rate context and high-value scoring analysis.",
  alternates: {
    canonical: pageUrl,
  },
};

export default function OrangeCapPage() {
  const leaders = getOrangeCapLeaders(12);
  const leader = leaders[0];

  const paragraphs = [
    "The Orange Cap race is one of the clearest ways to understand which batters are actually shaping an IPL season. A raw run total is only the starting point. The more useful question is how those runs are being scored, in what role, and how much pressure they remove from the rest of the lineup. An opener who dominates the powerplay can change the entire tempo of a chase, while a middle-order batter may build equal value by rescuing collapsing innings and finishing games under scoreboard stress.",
    `${leader ? `${leader.name} currently leads the batting pack in the stored dataset with ${leader.runs} runs for ${leader.team}.` : "The current dataset is ready to track batting leaders as the season develops."} That matters because the Orange Cap is rarely won by accident. It usually sits with a player who combines volume with clarity of role, whether that means setting platforms early, controlling spin through the middle overs or accelerating once wickets are still in hand at the death. The table below is therefore designed to be a useful performance page, not just a trivia widget.`,
    "A good Orange Cap page should also connect users back into team and match context. Batting leaders do not operate in isolation. Their runs influence points-table position, change how opponents use bowlers, and often explain why a franchise's match previews feel more confident from one week to the next. This route keeps the leaderboard visible while also making it easy to move back into player profiles, team pages and live-score coverage.",
  ];

  const faqs: FaqItem[] = [
    {
      question: "What does this Orange Cap page measure?",
      answer:
        "It ranks batters by run output in the IPL Scorebook dataset, then uses strike rate as a supporting context metric rather than the primary ranking field.",
    },
    {
      question: "Why is strike rate shown with the runs?",
      answer:
        "Because run volume alone can hide how a batter shapes the innings. Strike rate adds useful context without replacing the core scoring leaderboard.",
    },
    {
      question: "Can I move from this page into player profiles?",
      answer:
        "Yes. Every listed batter links directly into the player directory so the leaderboard remains part of a broader player-research flow.",
    },
  ];

  const wordCount = countWords(paragraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "Orange Cap 2026",
            description:
              "IPL 2026 Orange Cap leaderboard with top run-scorers and batting context.",
            path: "/orange-cap",
            keywords: ["orange cap", "ipl top run scorers", "ipl batting leaders"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Orange Cap", path: "/orange-cap" },
          ]),
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Batting Leaders</div>
          <h1 className={styles.title}>Orange Cap 2026</h1>
          <p className={styles.subtitle}>
            Follow the leading IPL run-scorers with context on tempo, role and why their output
            matters to the wider season story.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{leaders.length} tracked batting leaders</span>
            <span className={styles.metaBadge}>
              {leader ? `Current leader: ${leader.name}` : "Leaderboard active"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Why The Orange Cap Matters</h2>
          <div className={styles.textBlock}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <LeadersTable title="Top Run Scorers" leaders={leaders} variant="orange" />

      <InternalLinkGrid
        title="More Batting Context"
        links={[
          {
            href: "/players",
            label: "Player Directory",
            description: "Open full player profiles for the names leading the batting race.",
          },
          {
            href: "/purple-cap",
            label: "Purple Cap",
            description: "Compare batting leadership with the season's strike bowlers.",
          },
          {
            href: "/points-table",
            label: "Points Table",
            description: "See how big batting seasons are influencing team results.",
          },
          {
            href: "/ipl-teams",
            label: "IPL Teams",
            description: "Move back into the franchise layer behind the leading run-scorers.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="Orange Cap rankings are calculated from the batting statistics stored in IPL Scorebook and refreshed whenever the player dataset is updated."
        wordCount={wordCount}
      />

      <FaqSection title="Orange Cap FAQ" faqs={faqs} />
    </div>
  );
}
