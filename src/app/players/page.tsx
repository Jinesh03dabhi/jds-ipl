import type { Metadata } from "next";
import PlayersClient from "./PlayersClient";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import TrustSignals from "@/components/intent/TrustSignals";
import styles from "@/components/intent/intent.module.css";
import { PLAYERS } from "@/lib/data";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  countWords,
  formatEditorialTimestamp,
} from "@/lib/content";
import { getOrangeCapLeaders, getPurpleCapLeaders } from "@/lib/leaderboards";
import { DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/players`;

export const metadata: Metadata = {
  title: "IPL 2026 Player Stats Directory | IPL Scorebook",
  description:
    "Browse the IPL 2026 player directory with roles, auction prices, team details, leaders and performance context across every franchise.",
  keywords: [
    "ipl 2026 players",
    "ipl player stats",
    "ipl player directory",
    "ipl auction prices",
    "orange cap leaders",
    "purple cap leaders",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: pageUrl,
    languages: {
      en: pageUrl,
    },
  },
  openGraph: {
    title: "IPL 2026 Player Stats Directory | IPL Scorebook",
    description:
      "Browse the IPL 2026 player directory with roles, auction prices, team details, leaders and performance context across every franchise.",
    url: pageUrl,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL player directory preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Player Stats Directory | IPL Scorebook",
    description:
      "Browse the IPL 2026 player directory with roles, auction prices, team details, leaders and performance context across every franchise.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default function PlayersPage() {
  const orangeLeader = getOrangeCapLeaders(1)[0];
  const purpleLeader = getPurpleCapLeaders(1)[0];
  const overseasPlayers = PLAYERS.filter((player) => player.nationality === "Overseas").length;
  const highestAuction = [...PLAYERS].sort(
    (left, right) => parseFloat(right.soldPrice) - parseFloat(left.soldPrice),
  )[0];

  const introParagraphs = [
    "The IPL 2026 player directory needs to do more than list names in alphabetical order. Serious cricket readers want to understand how a squad is shaped, which players are driving the season narrative, where auction money has been concentrated, and how batting and bowling output compare across franchises. That is why this page works as a searchable database and as an editorial guide to the player market at the same time.",
    "A useful player hub also reduces the distance between raw stats and actual context. Runs, wickets and strike rates become more meaningful when they are tied back to role, team environment and auction value. Some players are retained because they define a side's identity at the top of the order, some because they close out overs under pressure, and some because their flexibility changes how captains build a matchday XI. This page is designed to surface those differences instead of flattening every player into the same generic card.",
  ];

  const analysisParagraphs = [
    `The current directory contains ${PLAYERS.length} listed players, including ${overseasPlayers} overseas options, which makes it a practical snapshot of squad building across the league. ${highestAuction ? `${highestAuction.name} currently stands out as the highest-priced name in the dataset at ${highestAuction.soldPrice}, a reminder that the auction still shapes expectation before a ball is bowled.` : "Auction value remains one of the clearest signals of how franchises prioritize roles and experience."} At the same time, price is only one layer of the story. The more important question is whether that spend translates into role clarity and output once the season moves through powerplays, middle overs and death overs.`,
    `${orangeLeader ? `${orangeLeader.name} currently sets the batting reference point in the stored dataset with ${orangeLeader.runs} runs, while` : "The batting leaderboards help explain who is controlling scoring tempo across franchises, while"} ${purpleLeader ? `${purpleLeader.name} leads the wicket-taking conversation with ${purpleLeader.wickets} wickets.` : "the bowling table highlights who is creating breakthroughs and controlling economy under pressure."} Together, those two lenses make the player directory more valuable than a thin roster page because users can move from a name search into season context, then out again into orange-cap, purple-cap, team and live-match pages without losing the plot.`,
  ];

  const usageParagraphs = [
    "Use the filters below to narrow by role or search directly by franchise and player name. That workflow is especially useful when you want to compare how teams have balanced specialist bowlers, wicket-keepers and all-rounders rather than jumping between disconnected pages. The directory also helps when a user lands with a very specific search such as a player transfer, a sold price, or a leadership question and then wants to browse sideways into the rest of the squad.",
    "From an editorial point of view, the page is intentionally built around utility and trust. It avoids invented form claims, keeps role labels simple, and links every visible player into a dedicated profile page where available. That means the directory can support search intent, internal navigation and ad safety at the same time because the page has meaningful written content before any monetization element is even considered.",
  ];

  const faqs: FaqItem[] = [
    {
      question: "What does this IPL player directory include?",
      answer:
        "It combines player names, roles, current teams, auction prices and profile links with editorial context on why those details matter in the 2026 season.",
    },
    {
      question: "Can I search by team or role on this page?",
      answer:
        "Yes. The directory supports name and team search plus role filters so users can quickly move from a broad squad view into individual player pages.",
    },
    {
      question: "Does this page help with Orange Cap and Purple Cap research?",
      answer:
        "Yes. The player hub connects directly to the dedicated Orange Cap and Purple Cap routes so batting and bowling leaderboards remain part of the same content loop.",
    },
  ];

  const playerList = PLAYERS.slice(0, 20).map((player, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: player.name,
    url: `${SITE_URL}/players/${player.id}`,
  }));

  const wordCount = countWords(introParagraphs, analysisParagraphs, usageParagraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "IPL 2026 Player Stats Directory",
            description:
              "IPL 2026 player directory with roles, auction prices, squad context and leaderboard links.",
            path: "/players",
            keywords: ["ipl players", "ipl player stats", "orange cap", "purple cap"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Players", path: "/players" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "IPL 2026 Player Directory",
            url: pageUrl,
            description:
              "Browse IPL 2026 players, auction prices, roles and performance context across every franchise.",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "IPL 2026 Player Directory",
            itemListElement: playerList,
          },
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Player Hub</div>
          <h1 className={styles.title}>IPL 2026 Player Directory</h1>
          <p className={styles.subtitle}>
            A content-first player hub for IPL 2026: searchable profiles, auction context, batting
            and bowling leaders, and practical analysis on how each squad is built.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{PLAYERS.length} listed players</span>
            <span className={styles.metaBadge}>
              {orangeLeader ? `Top run-scorer: ${orangeLeader.name}` : "Batting leaders tracked"}
            </span>
            <span className={styles.metaBadge}>
              {purpleLeader ? `Top wicket-taker: ${purpleLeader.name}` : "Bowling leaders tracked"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Why This Player Hub Matters</h2>
            <div className={styles.textBlock}>
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Quick Player Snapshot</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Players</div>
                <div className={styles.statValue}>{PLAYERS.length}</div>
                <div className={styles.statSubtext}>Current squad dataset across the league.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Overseas Players</div>
                <div className={styles.statValue}>{overseasPlayers}</div>
                <div className={styles.statSubtext}>Imported talent and specialist depth.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Orange Cap Lead</div>
                <div className={styles.statValue}>{orangeLeader?.runs ?? "--"}</div>
                <div className={styles.statSubtext}>{orangeLeader?.name || "Leader pending"}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Purple Cap Lead</div>
                <div className={styles.statValue}>{purpleLeader?.wickets ?? "--"}</div>
                <div className={styles.statSubtext}>{purpleLeader?.name || "Leader pending"}</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>How To Read The Directory</h2>
          <div className={styles.textBlock}>
            {analysisParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {usageParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <PlayersClient showHeader={false} />

      <InternalLinkGrid
        title="Player Research Paths"
        links={[
          {
            href: "/orange-cap",
            label: "Orange Cap",
            description: "See the top run-scorers and batting leaders in one focused table.",
          },
          {
            href: "/purple-cap",
            label: "Purple Cap",
            description: "Review wicket-taking leaders and bowling efficiency context.",
          },
          {
            href: "/ipl-teams",
            label: "IPL Teams",
            description: "Move from individual profiles back into squad and franchise structure.",
          },
          {
            href: "/ipl-live-score-today",
            label: "Live Score Today",
            description: "Track the current match while keeping player research routes nearby.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="Player listings and stat lines are based on the curated IPL Scorebook dataset, which is used across squad pages, team pages and leaderboard routes."
        wordCount={wordCount}
      />

      <FaqSection title="Player Directory FAQ" faqs={faqs} />
    </div>
  );
}
