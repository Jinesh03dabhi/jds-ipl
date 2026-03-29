import type { Metadata } from "next";
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
import { CONTACT_EMAIL, DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: "About IPL Scorebook | Cricket Data, Context and Matchday Coverage",
  description:
    "Learn how IPL Scorebook approaches live scores, player research, franchise pages and matchday context as an independent cricket platform.",
  alternates: {
    canonical: pageUrl,
  },
};

export default function AboutPage() {
  const missionParagraphs = [
    "IPL Scorebook was built to solve a common problem with cricket websites: too many pages answer the what, but not enough explain the why. Fans can usually find a score somewhere, but a score alone does not tell them how a team has been constructed, why a venue matters, or which players are shaping a season in ways that survive beyond a single evening. Our goal is to turn that thin information layer into a richer cricket research experience built around context, trust and reusable matchday pages.",
    "That is why the site is designed as a content platform rather than only an API shell. A match page should stay useful before the toss, during the game and after the result. A player directory should connect auction price, role and season performance. A points-table route should explain NRR honestly instead of borrowing old rankings. We treat those pages as editorial assets, not placeholders, because useful sports coverage is built from repeatable context rather than one-time novelty.",
  ];

  const editorialParagraphs = [
    "The site is independent and not affiliated with the IPL, BCCI or any franchise. That independence matters because it shapes how we write. We avoid pretending to have official access when we do not, and we avoid publishing made-up playing XIs, fake toss calls or thin recap pages that only exist to catch search traffic. If live fields are unavailable, we say so. If a page is early in the match loop, we explain what is confirmed and what is still pending.",
    `Our publishing model is centered on useful connected pages: previews, live routes, result pages, team hubs, player directories, venue notes, table coverage and leaderboard pages. The aim is to help a reader move naturally from one question to the next without landing on dead ends. If someone starts with a team search, they should be able to reach players, standings and match previews easily. If they start with a live score route, they should be able to step into player and venue context without leaving the site. That is how we think about value, session depth and topical authority.`,
    `We also believe visible trust signals matter. Pages should show who maintains them, when they were updated and what kind of source data they rely on. For general support or editorial questions, readers can always reach us at ${CONTACT_EMAIL}. That level of openness is part of how we want IPL Scorebook to grow: not as a black-box score widget, but as a dependable cricket information project with a clear editorial posture.`,
  ];

  const faqs: FaqItem[] = [
    {
      question: "What is IPL Scorebook?",
      answer:
        "IPL Scorebook is an independent cricket platform focused on IPL live coverage, player research, franchise context and richer matchday pages.",
    },
    {
      question: "Is IPL Scorebook an official IPL website?",
      answer:
        "No. It is an independent platform and is not affiliated with the IPL, BCCI or any franchise.",
    },
    {
      question: "How does IPL Scorebook try to improve match coverage?",
      answer:
        "By combining live information with original editorial sections, venue notes, player comparisons and connected routes that stay useful before and after the game.",
    },
  ];

  const wordCount = countWords(missionParagraphs, editorialParagraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "About IPL Scorebook",
            description:
              "How IPL Scorebook approaches live scores, player research and content-first cricket coverage.",
            path: "/about",
            keywords: ["about ipl scorebook", "ipl cricket platform", "ipl editorial site"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>About The Platform</div>
          <h1 className={styles.title}>About IPL Scorebook</h1>
          <p className={styles.subtitle}>
            An independent IPL content platform focused on live match context, player research,
            franchise structure and high-trust editorial pages.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>Independent cricket platform</span>
            <span className={styles.metaBadge}>Content-first match coverage</span>
            <span className={styles.metaBadge}>Contact: {CONTACT_EMAIL}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Why We Built This</h2>
            <div className={styles.textBlock}>
              {missionParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>What Users Should Expect</h2>
            <div className={styles.summaryList}>
              <div className={styles.summaryItem}>
                <span>Original match summaries and analysis blocks alongside score-driven pages.</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Connected player, team, venue and leaderboard routes instead of isolated pages.</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Clear disclosures when a live field or official lineup has not been confirmed yet.</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Trust signals such as visible last-updated timestamps and contact details.</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>How The Editorial Model Works</h2>
          <div className={styles.textBlock}>
            {editorialParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <InternalLinkGrid
        title="Explore IPL Scorebook"
        links={[
          {
            href: "/ipl-live-score-today",
            label: "Live Score Today",
            description: "See the matchday route that connects live state with editorial context.",
          },
          {
            href: "/players",
            label: "Player Directory",
            description: "Browse player profiles, roles and performance context.",
          },
          {
            href: "/ipl-teams",
            label: "IPL Teams",
            description: "Open the richer franchise hub with venues, titles and squad context.",
          },
          {
            href: "/contact",
            label: "Contact",
            description: "Reach out with feedback, support needs or partnership questions.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="About-page content reflects IPL Scorebook's editorial approach, publishing standards and internal data usage across the site."
        wordCount={wordCount}
      />

      <FaqSection title="About IPL Scorebook FAQ" faqs={faqs} />
    </div>
  );
}
