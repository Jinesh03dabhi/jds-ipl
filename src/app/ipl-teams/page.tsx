import type { Metadata } from "next";
import TeamsClient from "@/app/teams/TeamsClient";
import JsonLd from "@/components/intent/JsonLd";
import FaqSection, { buildFaqSchema, type FaqItem } from "@/components/intent/FaqSection";
import InternalLinkGrid from "@/components/intent/InternalLinkGrid";
import TrustSignals from "@/components/intent/TrustSignals";
import styles from "@/components/intent/intent.module.css";
import { TEAMS } from "@/lib/data";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  countWords,
  formatEditorialTimestamp,
} from "@/lib/content";
import { DEFAULT_EDITOR_NAME, SITE_URL } from "@/lib/site";

const pageUrl = `${SITE_URL}/ipl-teams`;

export const metadata: Metadata = {
  title: "IPL Teams 2026: Franchises, Squads and Venues | IPL Scorebook",
  description:
    "Explore IPL 2026 teams, franchise history, squad structure, home venues and title context in a richer content-first team hub.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "IPL Teams 2026: Franchises, Squads and Venues | IPL Scorebook",
    description:
      "Explore IPL 2026 teams, franchise history, squad structure, home venues and title context in a richer content-first team hub.",
    url: pageUrl,
    type: "website",
    locale: "en_IN",
    siteName: "IPL Scorebook",
    images: [`${SITE_URL}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Teams 2026: Franchises, Squads and Venues | IPL Scorebook",
    description:
      "Explore IPL 2026 teams, franchise history, squad structure, home venues and title context in a richer content-first team hub.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default function IplTeamsPage() {
  const mostTitlesTeam = [...TEAMS].sort((left, right) => right.titles.length - left.titles.length)[0];
  const newestChampion = TEAMS.find((team) => team.titles.includes(2025));
  const introParagraphs = [
    "An IPL teams page should help readers understand how the league is built, not just throw ten logos onto a grid and call it content. Every franchise carries a different competitive identity shaped by ownership, home conditions, auction strategy and retained core players. Some sides are built around explosive top-order batting, some around spin-heavy control, and some around flexible all-round depth that lets captains react to changing match conditions. That bigger context is what turns a team directory into a useful research page.",
    "The 2026 season is a strong example of why franchise pages matter. Title count still shapes expectation, but recent finishing position, venue fit and squad balance often matter more once the season begins. A champion from the previous year may still be vulnerable if its bowling depth looks thin, while a team that finished lower in the table can suddenly become dangerous if its auction added a powerplay batter, a death specialist and a middle-overs all-rounder in the right places. A team hub needs to make that kind of reading possible before users ever open an individual squad page.",
  ];

  const analysisParagraphs = [
    `${mostTitlesTeam ? `${mostTitlesTeam.name} remain the benchmark for silverware with ${mostTitlesTeam.titles.length} titles,` : "IPL history still gives legacy franchises a strong reference point,"} while the rest of the league is constantly trying to close the gap through smarter roster construction and better fit-for-venue planning. ${newestChampion ? `${newestChampion.name} arrive as the most recent title winner in the stored history, which changes how every opponent reads them on a schedule page or match preview.` : "The latest title context still feeds directly into how users interpret schedule and prediction pages."} On a practical level, that means this page needs to connect brand identity with actionable squad information: who leads the side, where they play, how often they have won, and what kind of environment their home venue creates.`,
    "The other reason this route matters for AdSense and SEO quality is that franchise pages naturally anchor the rest of the site. Team hubs connect player directories, venue reports, live match loops, points-table movement and leaderboard shifts. When a user lands on a franchise route, they should be able to move deeper into squad profiles or sideways into standings without feeling like they hit a dead end. Rich team content therefore improves user trust, session depth and internal linking all at once.",
    "Use the cards below as a fast overview of each franchise, then open the deeper team pages for squad-level research. This hub is intentionally descriptive before it is promotional. It clarifies the shape of the league, the significance of titles and ownership, and the role of home venues in deciding how each franchise approaches batting tempo, bowling balance and matchday strategy.",
  ];

  const faqs: FaqItem[] = [
    {
      question: "What does this IPL teams page include?",
      answer:
        "It combines franchise names, titles, home venues, ownership and links into deeper team-specific pages so the hub stays useful for both casual and serious readers.",
    },
    {
      question: "Why are venues important on a team hub?",
      answer:
        "Home grounds shape how teams build squads and how match previews are read, especially when a venue strongly rewards batting, spin or chasing.",
    },
    {
      question: "Can I move from this hub into player and points-table pages?",
      answer:
        "Yes. The team hub acts as a central connector between squad pages, player research, points-table coverage and live-match routes.",
    },
  ];

  const wordCount = countWords(introParagraphs, analysisParagraphs);

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          buildFaqSchema(faqs),
          buildArticleSchema({
            headline: "IPL Teams 2026: Franchises, Squads and Venues",
            description:
              "Rich IPL 2026 team hub covering franchises, titles, venues and squad context.",
            path: "/ipl-teams",
            keywords: ["ipl teams", "ipl squads", "ipl franchises", "ipl venues"],
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "IPL Teams", path: "/ipl-teams" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "IPL 2026 Teams",
            itemListElement: TEAMS.map((team, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "SportsTeam",
                name: team.name,
                sport: "Cricket",
                url: `${SITE_URL}/teams/${team.id}`,
              },
            })),
          },
        ]}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>Franchise Hub</div>
          <h1 className={styles.title}>IPL Teams 2026</h1>
          <p className={styles.subtitle}>
            A content-first guide to every IPL franchise, its squad spine, venue context and
            competitive history across the modern league.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaBadge}>{TEAMS.length} active franchises</span>
            <span className={styles.metaBadge}>
              {mostTitlesTeam ? `Most titles: ${mostTitlesTeam.shortName}` : "Title history tracked"}
            </span>
            <span className={styles.metaBadge}>
              {newestChampion ? `Latest champions: ${newestChampion.shortName}` : "Current champion tracked"}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.splitGrid}>
          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>How To Read The League</h2>
            <div className={styles.textBlock}>
              {introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className={`${styles.card} ${styles.cardAlt}`}>
            <h2 className={styles.sectionTitle}>Fast Franchise Snapshot</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Teams</div>
                <div className={styles.statValue}>{TEAMS.length}</div>
                <div className={styles.statSubtext}>The full IPL franchise map for 2026.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Most Titles</div>
                <div className={styles.statValue}>{mostTitlesTeam?.shortName || "--"}</div>
                <div className={styles.statSubtext}>{mostTitlesTeam?.titles.length || 0} championships.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Latest Champion</div>
                <div className={styles.statValue}>{newestChampion?.shortName || "--"}</div>
                <div className={styles.statSubtext}>Most recent title winner in the dataset.</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Venue Impact</div>
                <div className={styles.statValue}>High</div>
                <div className={styles.statSubtext}>Home conditions still shape squad balance.</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Why Team Pages Create Value</h2>
          <div className={styles.textBlock}>
            {analysisParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <TeamsClient showHeader={false} />

      <InternalLinkGrid
        title="Connected League Pages"
        links={[
          {
            href: "/players",
            label: "Player Directory",
            description: "Move from franchise research into player-by-player profiles and filters.",
          },
          {
            href: "/points-table",
            label: "Points Table",
            description: "See how team quality translates into standings and NRR movement.",
          },
          {
            href: "/orange-cap",
            label: "Orange Cap",
            description: "Track batting leaders who drive the strongest team seasons.",
          },
          {
            href: "/purple-cap",
            label: "Purple Cap",
            description: "Review bowlers who can transform a side's match control.",
          },
        ]}
      />

      <TrustSignals
        authorName={DEFAULT_EDITOR_NAME}
        lastUpdatedLabel={formatEditorialTimestamp()}
        sourcesNote="Franchise names, ownership, titles and venue references are stored in the IPL Scorebook team dataset and connect directly into the team detail pages."
        wordCount={wordCount}
      />

      <FaqSection title="IPL Teams FAQ" faqs={faqs} />
    </div>
  );
}
