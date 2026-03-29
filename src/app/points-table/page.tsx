import type { Metadata } from "next";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import PointsTable from "@/components/intent/PointsTable";
import TrustSignals from "@/components/intent/TrustSignals";
import styles from "@/components/intent/intent.module.css";
import {
  formatIndiaDateTime,
  getIplSchedule,
  getLatestCompletedCurrentIplMatch,
} from "@/lib/ipl-data";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  countWords,
  formatEditorialTimestamp,
} from "@/lib/content";
import {
  applyMatchUpdate,
  createPointsTableState,
  getCompletedMatchInputs,
  parsePointsTableMatch,
} from "@/lib/points-table";
import { DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/points-table`;

export const metadata: Metadata = {
  title: "IPL Points Table 2026 | Live Standings, Points and NRR",
  description:
    "IPL points table 2026 with live standings, NRR logic, qualification context and honest season-state analysis.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "IPL Points Table 2026 | Live Standings, Points and NRR",
    description:
      "Follow the IPL 2026 points table with live standings, NRR logic and qualification context.",
    url: pageUrl,
    type: "website",
    locale: "en_IN",
    siteName: "IPL Scorebook",
    images: [`${SITE_URL}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Points Table 2026 | Live Standings, Points and NRR",
    description:
      "Follow the IPL 2026 points table with live standings, NRR logic and qualification context.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default async function PointsTablePage() {
  const [schedule, initialRealtimeMatch] = await Promise.all([
    getIplSchedule(),
    getLatestCompletedCurrentIplMatch(),
  ]);
  const baselineState = createPointsTableState(getCompletedMatchInputs(schedule.matches));
  const parsedRealtimeMatch = initialRealtimeMatch
    ? parsePointsTableMatch(initialRealtimeMatch)
    : null;
  const initialRealtimeUpdate = parsedRealtimeMatch
    ? {
        ...parsedRealtimeMatch,
        completedAt: new Date().toISOString(),
      }
    : null;
  const tableState =
    initialRealtimeUpdate && !baselineState.appliedMatchIds.includes(initialRealtimeUpdate.matchId)
      ? applyMatchUpdate(baselineState, initialRealtimeUpdate)
      : baselineState;
  const pageUpdatedAt =
    initialRealtimeUpdate && !baselineState.appliedMatchIds.includes(initialRealtimeUpdate.matchId)
      ? tableState.lastUpdated || schedule.lastUpdated
      : schedule.lastUpdated;
  const tableRows = tableState.rows;
  const completedMatchCount = tableState.appliedMatchIds.length;
  const topTeam = completedMatchCount ? tableRows[0] : null;
  const nowTime = new Date().getTime();
  const nextMatch = schedule.matches.find(
    (match) => new Date(match.dateTimeGMT).getTime() >= nowTime,
  );

  const introParagraphs = [
    "A points table page has one job above all others: tell the truth about the state of the season. That sounds obvious, but many sports sites still fill the screen with recycled rankings, preseason assumptions or vague narrative copy long before enough matches have been completed to justify a strong standings take. IPL Scorebook treats the table as a living competition object instead. Teams earn their position here through completed results, net run rate and recent form, not through leftover reputation from the previous season.",
    "That approach matters because IPL table traffic usually spikes for very practical reasons. Fans want to know who is in the top four, how many points are likely needed for qualification, and whether net run rate has become the real separator between clustered sides. A good table page therefore needs to explain the ranking logic while still putting the standings front and center. It should also connect users into the next match, the team pages and the live-score routes that are most likely to change the numbers they are looking at.",
  ];

  const analysisParagraphs = [
    `Right now the table is built from ${completedMatchCount} completed matches in the current season feed. ${completedMatchCount === 0 ? "That means every team remains level on zero points, and this page says that clearly instead of pretending the season has already produced a pecking order." : `${topTeam?.team.name} currently sits at the top of the live standings, but every new result changes both the points count and the pressure around NRR.`} That honesty is especially important early in the tournament, when a small sample can make one win feel bigger than it really is and one heavy defeat can distort net run rate for several rounds.`,
    "NRR becomes the most misunderstood part of the standings once teams are grouped on points. The basic principle is simple: it measures how quickly a team scores and how quickly it allows opponents to score, adjusted for overs faced and bowled. In practice, that means a side can win matches and still leave itself exposed if its losses are heavy or its wins are too narrow. A useful points-table page should therefore make NRR visible and explain why it matters instead of hiding it behind a thin scoreboard shell.",
    "The route also helps users read the season at a higher level. When you move from standings into team pages, live fixtures and player leaderboards, you can start to see why the table looks the way it does. Some sides climb because their top order is outrunning the par score in the powerplay. Others stay alive because their middle-overs bowlers keep them in low-margin matches. The table is not a separate part of the site; it is the summary of everything else that happens across match previews, result pages and squad construction.",
  ];

  const faqs: FaqItem[] = [
    {
      question: "How is this points table updated?",
      answer:
        "The table is built from completed match results in the current IPL schedule feed and sorted by points first, then net run rate.",
    },
    {
      question: "Does this page use fake pre-season rankings?",
      answer:
        "No. Until matches are completed, teams stay level on points. The page does not reuse last season's finishing order as the live 2026 standings.",
    },
    {
      question: "Why is NRR shown here?",
      answer:
        "Because net run rate often separates teams tied on points and becomes essential once qualification races tighten in the second half of the league stage.",
    },
  ];

  const wordCount = countWords(introParagraphs, analysisParagraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "IPL Points Table 2026",
            description:
              "Live IPL 2026 points table with standings, NRR context and qualification-focused analysis.",
            path: "/points-table",
            dateModified: pageUpdatedAt,
            keywords: ["ipl points table", "ipl standings", "ipl nrr", "ipl top four"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Points Table", path: "/points-table" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "IPL 2026 standings",
            itemListElement: tableRows.map((row, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: row.team.name,
            })),
          },
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Standings Hub</div>
          <h1 className={styles.title}>IPL Points Table 2026</h1>
          <p className={styles.subtitle}>
            Live standings with NRR logic, qualification context and honest season-state analysis,
            built for readers who want more than a copied rank list.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{completedMatchCount} completed matches</span>
            <span className={styles.metaBadge}>
              {nextMatch
                ? `Next: ${nextMatch.team1.shortName} vs ${nextMatch.team2.shortName}`
                : "Waiting for next fixture"}
            </span>
            <span className={styles.metaBadge}>
              {topTeam ? `Current leaders: ${topTeam.team.shortName}` : "Leaders pending"}
            </span>
          </div>
        </div>
      </section>

      <PointsTable
        initialMatches={schedule.matches}
        initialRealtimeMatch={initialRealtimeMatch}
        initialRealtimeUpdatedAt={tableState.lastUpdated}
        baselineUpdatedAt={schedule.lastUpdated}
      />

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>What This Table Tells You</h2>
            <div className={styles.textBlock}>
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Fast Standings Snapshot</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Top Side</div>
                <div className={styles.statValue}>{topTeam?.team.shortName || "--"}</div>
                <div className={styles.statSubtext}>
                  {topTeam ? `${topTeam.team.name} currently lead the standings.` : "Table will form after results land."}
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Points</div>
                <div className={styles.statValue}>
                  {tableRows.reduce((total, row) => total + row.points, 0)}
                </div>
                <div className={styles.statSubtext}>Only completed results affect this total.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>NRR Status</div>
                <div className={styles.statValue}>{completedMatchCount ? "Live" : "Pending"}</div>
                <div className={styles.statSubtext}>Meaningful once teams build a sample size.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Next Match</div>
                <div className={styles.statValue}>
                  {nextMatch ? `${nextMatch.team1.shortName} vs ${nextMatch.team2.shortName}` : "TBD"}
                </div>
                <div className={styles.statSubtext}>
                  {nextMatch ? formatIndiaDateTime(nextMatch.dateTimeGMT) : "Waiting for the next confirmed fixture."}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Why NRR And Form Matter</h2>
          <div className={styles.textBlock}>
            {analysisParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <InternalLinkGrid
        title="Connected League Pages"
        links={[
          {
            href: "/ipl-teams",
            label: "Team Pages",
            description: "See which franchises are driving the strongest table positions.",
          },
          {
            href: "/players",
            label: "Player Directory",
            description: "Jump into the squad and player layer behind the standings.",
          },
          {
            href: "/ipl-live-score-today",
            label: "Live Score Today",
            description: "Open the current match route that is most likely to move the table next.",
          },
          {
            href: "/predictions",
            label: "Prediction Hub",
            description: "Look ahead to the fixtures that could reshape the standings.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp(new Date(pageUpdatedAt))}
        sourcesNote="Standings are calculated from completed match results in the IPL Scorebook schedule feed, with points and net run rate updated from available scorelines."
        wordCount={wordCount}
      />

      <FaqSection title="Points Table FAQ" faqs={faqs} />
    </div>
  );
}
