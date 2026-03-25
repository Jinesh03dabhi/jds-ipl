import type { Metadata } from "next";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import PointsTablePanel from "@/components/intent/PointsTablePanel";
import styles from "@/components/intent/intent.module.css";
import {
  buildPointsTable,
  formatIndiaDateTime,
  getIplSchedule,
} from "@/lib/ipl-data";
import { SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/ipl-points-table-2026`;

export const metadata: Metadata = {
  title: "IPL Points Table 2026 | Live Standings, Points and NRR",
  description:
    "IPL points table 2026 page with live standings, points, wins, losses and NRR logic. Built to answer real search intent without fake rankings.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "IPL Points Table 2026 | Live Standings, Points and NRR",
    description:
      "Follow the IPL 2026 points table with points, recent form and NRR-aware standings.",
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
      "Follow the IPL 2026 points table with points, recent form and NRR-aware standings.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default async function IplPointsTable2026Page() {
  const schedule = await getIplSchedule();
  const tableRows = buildPointsTable(schedule.matches);
  const completedMatches = schedule.matches.filter((match) => match.status === "completed");
  const topTeam = tableRows[0];
  const nextMatch = schedule.matches.find(
    (match) => new Date(match.dateTimeGMT).getTime() >= Date.now()
  );

  const faqs: FaqItem[] = [
    {
      question: "How is this IPL points table 2026 page updated?",
      answer:
        "The table is built from completed match results in the current 2026 schedule feed, then ordered by points and NRR. If the season has not started yet, every team remains on zero and the page says so clearly.",
    },
    {
      question: "Does this table use fake pre-season rankings?",
      answer:
        "No. This page avoids presenting last year's finishing order as the current 2026 table. Until matches are completed, all teams stay level on points.",
    },
    {
      question: "How is NRR handled here?",
      answer:
        "NRR is computed from completed scorelines available in the schedule feed. It is shown as a live working table metric, and it becomes more useful once teams have played multiple matches.",
    },
    {
      question: "Why are all teams on zero points right now?",
      answer:
        completedMatches.length === 0
          ? "Because the current 2026 schedule feed does not contain a completed IPL match yet."
          : "The table updates only from completed matches, so teams that have not finished a game can still show zero points.",
    },
  ];

  const structuredData = [
    buildFaqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "IPL Points Table 2026",
      url: pageUrl,
      description:
        "Live IPL 2026 points table with team standings, points, form and NRR-aware rankings.",
    },
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
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd data={structuredData} />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Intent Page</div>
          <h1 className={styles.title}>IPL Points Table 2026</h1>
          <p className={styles.subtitle}>
            This route is built for the exact query pattern people actually use: "ipl points table 2026". The key difference is that it no longer pretends last season&apos;s rank is the live table. Instead, it shows an honest season state, then explains how points and NRR will move once results start coming in.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{completedMatches.length} completed matches</span>
            <span className={styles.metaBadge}>
              {nextMatch
                ? `Next: ${nextMatch.team1.shortName} vs ${nextMatch.team2.shortName}`
                : "Waiting for next fixture"}
            </span>
            <span className={styles.metaBadge}>
              Source: {schedule.source === "cricapi" ? "live schedule feed" : "official phase-one seed"}
            </span>
          </div>
        </div>
      </section>

      <PointsTablePanel rows={tableRows} />

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>What This Table Means Right Now</h2>
            <div className={styles.textBlock}>
              <p>
                The IPL 2026 points table only becomes meaningful when teams start completing matches. That sounds obvious, but many sports pages still fill this screen with historical ranks or editorial guesses. This version does the opposite: it treats the table as a live competition object and keeps every team level until the schedule feed contains real results.
              </p>
              <p>
                Once results begin to land, the ordering logic is straightforward: points first, then NRR, then recent form. That means searchers looking for a fast answer still get the core table instantly, while power users can understand how the table is being calculated underneath the surface.
              </p>
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Fast Table View</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Top Side</div>
                <div className={styles.statValue}>{topTeam?.team.shortName || "TBD"}</div>
                <div className={styles.statSubtext}>
                  {completedMatches.length
                    ? `${topTeam?.team.name} currently leads the live table.`
                    : "No completed IPL match yet, so the table is still level."}
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Points Shown</div>
                <div className={styles.statValue}>
                  {tableRows.reduce((total, row) => total + row.points, 0)}
                </div>
                <div className={styles.statSubtext}>Points are assigned only from completed match outcomes.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>NRR Status</div>
                <div className={styles.statValue}>{completedMatches.length ? "Live" : "Pending"}</div>
                <div className={styles.statSubtext}>Net run rate becomes useful after teams have enough sample size.</div>
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
          <h2 className={styles.sectionTitle}>Search Intent Notes</h2>
          <div className={styles.textBlock}>
            <p>
              Users who search for the IPL 2026 points table usually want one of three things: the current top four, the points gap to qualification, or the NRR picture. That is why this page keeps the table itself prominent and avoids cluttering the top of the route with unrelated franchise history.
            </p>
            <p>
              Internal links from here go directly into live score, schedule and prediction pages so table readers can move deeper into the exact match that is about to change the standings. That supports both user flow and stronger topical linking between results, previews and league-state pages.
            </p>
          </div>
        </div>
      </section>

      <InternalLinkGrid
        title="Connected IPL Pages"
        links={[
          {
            href: "/ipl-live-score-today",
            label: "IPL Live Score Today",
            description: "Check today&apos;s match status, toss and live score entry point.",
          },
          {
            href: "/schedule",
            label: "IPL Schedule",
            description: "See which upcoming fixtures can change the points table next.",
          },
          {
            href: "/predictions",
            label: "Prediction Hub",
            description: "Open fixture-based prediction pages tied to upcoming matches.",
          },
          {
            href: "/teams",
            label: "Team Pages",
            description: "Move from the live table into franchise profiles and squads.",
          },
        ]}
      />

      <FaqSection title="IPL 2026 Points Table FAQ" faqs={faqs} />
    </div>
  );
}
