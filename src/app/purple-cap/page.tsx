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
import { getPurpleCapLeaders } from "@/lib/leaderboards";
import { DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/purple-cap`;

export const metadata: Metadata = {
  title: "Purple Cap 2026 | IPL Top Wicket Takers",
  description:
    "Track the IPL 2026 Purple Cap race with wicket leaders, economy context and bowling-impact analysis.",
  alternates: {
    canonical: pageUrl,
  },
};

export default function PurpleCapPage() {
  const leaders = getPurpleCapLeaders(12);
  const leader = leaders[0];

  const paragraphs = [
    "The Purple Cap table matters because wicket-taking still decides how IPL matches swing under pressure. A side can survive one expensive over if it keeps taking wickets, but it becomes very hard to control a game when batters settle and the bowling unit cannot produce breakthroughs. That is why this page highlights wicket leaders first while still giving readers the economy context that explains whether those wickets came with control or chaos.",
    `${leader ? `${leader.name} currently leads the bowling race with ${leader.wickets} wickets for ${leader.team}.` : "The current dataset is ready to track wicket-taking leaders as the season develops."} Bowling leaderboards are especially useful because they reveal more than a single hot spell. A top Purple Cap candidate usually shapes several phases of the innings: new-ball pressure, middle-over squeeze, or death-over execution. The best seasons often come from bowlers who can own more than one of those phases, or from all-rounders who create impact without forcing the captain to protect them.`,
    "This page is designed as a real research route rather than a thin statistic block. It helps users compare bowlers across franchises, then move directly into team pages, player profiles and points-table analysis. That broader loop matters because the best bowling seasons often explain why some teams stay alive in low-margin games while others leak key overs and lose control of their qualification push.",
  ];

  const faqs: FaqItem[] = [
    {
      question: "What does this Purple Cap page rank?",
      answer:
        "It ranks bowlers by wickets in the IPL Scorebook dataset and shows economy as supporting context for how efficiently those breakthroughs were delivered.",
    },
    {
      question: "Why is economy shown with the wicket count?",
      answer:
        "Because wickets alone do not show whether a bowler is also controlling the innings. Economy helps separate disciplined impact from high-risk spells.",
    },
    {
      question: "Can this page help with team and player research?",
      answer:
        "Yes. The leaderboard links directly to player profiles and sits inside the same content loop as team hubs, live-score pages and the points table.",
    },
  ];

  const wordCount = countWords(paragraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "Purple Cap 2026",
            description:
              "IPL 2026 Purple Cap leaderboard with top wicket-takers and bowling context.",
            path: "/purple-cap",
            keywords: ["purple cap", "ipl wicket leaders", "ipl bowling leaders"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Purple Cap", path: "/purple-cap" },
          ]),
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Bowling Leaders</div>
          <h1 className={styles.title}>Purple Cap 2026</h1>
          <p className={styles.subtitle}>
            Follow the top wicket-takers in IPL 2026 with useful economy context and a clearer
            sense of which bowlers are shaping the season.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{leaders.length} tracked bowling leaders</span>
            <span className={styles.metaBadge}>
              {leader ? `Current leader: ${leader.name}` : "Leaderboard active"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Why The Purple Cap Matters</h2>
          <div className={styles.textBlock}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <LeadersTable title="Top Wicket Takers" leaders={leaders} variant="purple" />

      <InternalLinkGrid
        title="More Bowling Context"
        links={[
          {
            href: "/players",
            label: "Player Directory",
            description: "Open deeper player profiles for the bowlers leading the season.",
          },
          {
            href: "/orange-cap",
            label: "Orange Cap",
            description: "Compare wicket leadership with the top run-scoring race.",
          },
          {
            href: "/points-table",
            label: "Points Table",
            description: "See how wicket-taking depth affects league position and NRR.",
          },
          {
            href: "/ipl-teams",
            label: "IPL Teams",
            description: "Jump back into the franchise structures behind the strike bowlers.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="Purple Cap rankings are calculated from the bowling statistics stored in IPL Scorebook and refreshed whenever the player dataset is updated."
        wordCount={wordCount}
      />

      <FaqSection title="Purple Cap FAQ" faqs={faqs} />
    </div>
  );
}
