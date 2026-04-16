import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/intent/JsonLd";
import PlayerCard from "@/components/PlayerCard";
import Section from "@/components/Section";
import TeamCard from "@/components/TeamCard";
import styles from "@/components/seo-ui.module.css";
import { getAllPlayers } from "@/lib/data-helpers";
import { generateFAQSchema, generateMetadata as createMetadata, generateSportsSchema } from "@/lib/seo";
import { getPlayerStats } from "@/lib/stats-engine";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPlayers().map((player) => ({
    slug: player.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const playerData = getPlayerStats(slug);

  if (!playerData) {
    return {};
  }

  return createMetadata({
    title: `${playerData.player.name} IPL Stats 2026 - Runs, Average, Strike Rate`,
    description: `${playerData.player.name} IPL 2026 stats page with runs, batting average, strike rate, team links and similar player comparisons.`,
    slug: `/player/${slug}/stats`,
    keywords: [
      `${playerData.player.name} IPL stats`,
      `${playerData.player.name} runs average strike rate`,
      `${playerData.team?.name ?? "IPL"} squad analytics`,
    ],
  });
}

export default async function PlayerStatsPage({ params }: PageProps) {
  const { slug } = await params;
  const playerData = getPlayerStats(slug);

  if (!playerData || !playerData.team) {
    notFound();
  }

  const faqs = [
    {
      question: `How many runs has ${playerData.player.name} scored in the IPL 2026 squad dataset?`,
      answer: `${playerData.player.name} has ${playerData.totalRuns} runs recorded in the current local IPL 2026 player dataset.`,
    },
    {
      question: `What is ${playerData.player.name}'s strike rate?`,
      answer: `${playerData.player.name} has a strike rate of ${playerData.strikeRate}.`,
    },
    {
      question: `Which IPL team does ${playerData.player.name} represent?`,
      answer: `${playerData.player.name} is listed in the ${playerData.team.name} squad.`,
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          generateFAQSchema(faqs),
          generateSportsSchema({
            type: "SportsOrganization",
            name: `${playerData.player.name} IPL 2026 Stats`,
            description: `${playerData.player.name} IPL stats profile on IPL Scorebook.`,
            url: `/player/${slug}/stats`,
          }),
        ]}
      />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Player Stats</span>
        <h1 className={styles.heroTitle}>{playerData.player.name} IPL 2026 Stats</h1>
        <p className={styles.heroText}>
          This player stats page is generated from local TypeScript data and focuses on the numbers users search first:
          runs, average, strike rate, current team context and comparable IPL profiles.
        </p>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>{playerData.team.name}</span>
          <span className={styles.badge}>{playerData.player.role}</span>
          <span className={styles.badge}>Auction Price {playerData.price}</span>
        </div>
      </section>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Total Runs</div>
          <div className={styles.statValue}>{playerData.totalRuns}</div>
          <div className={styles.statNote}>Current season batting output from the local player dataset.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Average</div>
          <div className={styles.statValue}>{playerData.average}</div>
          <div className={styles.statNote}>Useful for measuring how often innings convert into match-shaping scores.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Strike Rate</div>
          <div className={styles.statValue}>{playerData.strikeRate}</div>
          <div className={styles.statNote}>Shows scoring speed, which matters heavily in IPL intent pages.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Wickets / Matches</div>
          <div className={styles.statValue}>
            {playerData.wickets}/{playerData.player.stats.matches}
          </div>
          <div className={styles.statNote}>Adds role context for all-rounders and bowlers.</div>
        </article>
      </div>

      <Section
        title="Team Link"
        description="Internal linking from player pages into the relevant team hub helps both users and crawl depth."
      >
        <div className={styles.cardsGrid}>
          <TeamCard
            href={playerData.teamStatsUrl ?? "#"}
            logoUrl={playerData.team.logoUrl}
            name={playerData.team.name}
            shortName={playerData.team.shortName}
            summary={`${playerData.player.name} is part of the ${playerData.team.name} IPL 2026 squad and links directly into the team analytics layer.`}
            meta={[
              `Captain: ${playerData.team.captain}`,
              `Venue: ${playerData.team.venue}`,
              `${playerData.team.titles.length} titles`,
            ]}
          />
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Team Hub Links</h3>
            <div className={styles.list}>
              <div className={styles.listItem}>
                <Link href={playerData.teamStatsUrl ?? "#"} className={styles.link}>
                  Open team stats page
                </Link>
              </div>
              <div className={styles.listItem}>
                <Link href={playerData.teamSquadUrl ?? "#"} className={styles.link}>
                  Open squad and predicted XI page
                </Link>
              </div>
            </div>
          </article>
        </div>
      </Section>

      <Section
        title="Similar Players"
        description="The comparison block keeps long-tail player pages from feeling thin by connecting nearby roles and performance profiles."
      >
        <div className={styles.cardsGrid}>
          {playerData.similarPlayers.map((similarPlayer) => (
            <PlayerCard
              key={similarPlayer.id}
              href={`/player/${similarPlayer.slug}/stats`}
              name={similarPlayer.name}
              role={similarPlayer.role}
              teamName={similarPlayer.teamName}
              statLine={similarPlayer.statLine}
              avatarUrl={getAllPlayers().find((player) => player.id === similarPlayer.id)?.avatarUrl}
            />
          ))}
        </div>
      </Section>

      <Section title="Player FAQ" description="Structured answers for common search intents on this player profile.">
        <div className={styles.list}>
          {faqs.map((faq) => (
            <article key={faq.question} className={styles.listItem}>
              <strong>{faq.question}</strong>
              <p className={styles.muted} style={{ marginTop: "8px" }}>
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
