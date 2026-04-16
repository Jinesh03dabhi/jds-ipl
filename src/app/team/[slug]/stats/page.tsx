import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/intent/JsonLd";
import MatchCard from "@/components/MatchCard";
import PlayerCard from "@/components/PlayerCard";
import Section from "@/components/Section";
import styles from "@/components/seo-ui.module.css";
import { getAllTeams } from "@/lib/data-helpers";
import { generateFAQSchema, generateMetadata as createMetadata, generateSportsSchema } from "@/lib/seo";
import { getTeamStats } from "@/lib/stats-engine";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllTeams().map((team) => ({
    slug: team.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const teamData = getTeamStats(slug);

  if (!teamData) {
    return {};
  }

  return createMetadata({
    title: `${teamData.team.name} IPL Stats 2026 - Wins, Losses, Top Players`,
    description: `${teamData.team.name} IPL team stats page with win-loss record, top players, recent matches and head-to-head links.`,
    slug: `/team/${slug}/stats`,
    keywords: [
      `${teamData.team.name} IPL stats`,
      `${teamData.team.name} wins losses`,
      `${teamData.team.shortName} team analysis`,
    ],
  });
}

export default async function TeamStatsPage({ params }: PageProps) {
  const { slug } = await params;
  const teamData = getTeamStats(slug);

  if (!teamData) {
    notFound();
  }

  const faqs = [
    {
      question: `What is ${teamData.team.name}'s IPL 2026 record?`,
      answer: `${teamData.team.name} have ${teamData.wins} wins and ${teamData.losses} losses in the local 2026 match dataset.`,
    },
    {
      question: `Who are the top players for ${teamData.team.name}?`,
      answer: `${teamData.topPlayers.map((player) => player.name).join(", ")} headline the current team impact list.`,
    },
    {
      question: `Does this page link to squad and head-to-head pages?`,
      answer: `Yes. The team stats route links directly into the squad route and multiple head-to-head pages for the same franchise.`,
    },
  ];

  return (
    <div className={`container ${styles.page}`}>
      <JsonLd
        data={[
          generateFAQSchema(faqs),
          generateSportsSchema({
            type: "SportsTeam",
            name: `${teamData.team.name} IPL Stats`,
            description: `${teamData.team.name} analytics page on IPL Scorebook.`,
            url: `/team/${slug}/stats`,
            competitors: teamData.headToHeadLinks.map((link) => ({
              name: link.name.replace(" Head to Head", ""),
              url: link.href,
            })),
          }),
        ]}
      />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Team Stats</span>
        <h1 className={styles.heroTitle}>{teamData.team.name} IPL 2026 Team Stats</h1>
        <p className={styles.heroText}>
          This team hub summarizes the current win-loss record, the highest-impact players, recent fixtures and the
          internal links that matter most for team-level search intent.
        </p>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>{teamData.team.shortName}</span>
          <span className={styles.badge}>{teamData.team.venue}</span>
          <span className={styles.badge}>{teamData.team.titles.length} IPL titles</span>
        </div>
      </section>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Wins</div>
          <div className={styles.statValue}>{teamData.wins}</div>
          <div className={styles.statNote}>Current season wins from the local match file.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Losses</div>
          <div className={styles.statValue}>{teamData.losses}</div>
          <div className={styles.statNote}>Loss count built from the same static match dataset.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Win Rate</div>
          <div className={styles.statValue}>{teamData.winRate}%</div>
          <div className={styles.statNote}>A simple signal for comparing team momentum across routes.</div>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statLabel}>Predicted XI</div>
          <div className={styles.statValue}>{teamData.predictedXI.length}</div>
          <div className={styles.statNote}>Linked from the squad page and reused in prediction routes.</div>
        </article>
      </div>

      <Section title="Top Players" description="High-impact players are calculated from the local player and squad dataset.">
        <div className={styles.cardsGrid}>
          {teamData.topPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              href={`/player/${player.slug}/stats`}
              name={player.name}
              role={player.role}
              teamName={teamData.team.name}
              statLine={`${player.stats.runs ?? 0} runs · ${player.stats.wickets ?? 0} wickets`}
              avatarUrl={player.avatarUrl}
            />
          ))}
        </div>
      </Section>

      <Section title="Recent Matches" description="Recent fixtures help connect the team hub to match-level pages.">
        <div className={styles.cardsGrid}>
          {teamData.recentMatches.map((match) => (
            <MatchCard
              key={match.slug}
              href={`/match/${match.slug}`}
              title={`${teamData.team.shortName} vs ${match.opponentName}`}
              summary={match.result}
              meta={[`Season ${match.season}`, match.venueName, match.outcome]}
            />
          ))}
        </div>
      </Section>

      <Section title="Team Routing" description="These internal links push users from the broad team query into deeper comparison pages.">
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Direct Team Links</h3>
            <div className={styles.list}>
              <div className={styles.listItem}>
                <Link href={`/team/${teamData.team.slug}/squad`} className={styles.link}>
                  Open squad and predicted XI page
                </Link>
              </div>
              {teamData.headToHeadLinks.map((link) => (
                <div key={link.href} className={styles.listItem}>
                  <Link href={link.href} className={styles.link}>
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </article>
          <article className={styles.callout}>
            {teamData.strengths[0]} {teamData.weaknesses[0]}
          </article>
        </div>
      </Section>
    </div>
  );
}
