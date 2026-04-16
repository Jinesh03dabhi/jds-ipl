import JsonLd from "@/components/intent/JsonLd";
import MatchCard from "@/components/MatchCard";
import Section from "@/components/Section";
import StatsTable from "@/components/StatsTable";
import TeamCard from "@/components/TeamCard";
import styles from "@/components/seo-ui.module.css";
import { generateFAQSchema, generateSportsSchema } from "@/lib/seo";
import type { getHeadToHeadBySlug } from "@/lib/stats-engine";

type HeadToHeadData = NonNullable<ReturnType<typeof getHeadToHeadBySlug>>;

type HeadToHeadPageProps = {
  data: HeadToHeadData;
};

export default function HeadToHeadPage({ data }: HeadToHeadPageProps) {
  const faqs = [
    {
      question: `What is the overall ${data.team1.shortName} vs ${data.team2.shortName} head-to-head record?`,
      answer: `${data.team1.name} have ${data.team1Wins} wins and ${data.team2.name} have ${data.team2Wins} wins in the local match archive.`,
    },
    {
      question: `Does this page include the last five matches?`,
      answer: "Yes. The page includes the latest five meetings plus venue-by-venue record splits.",
    },
    {
      question: `Can I open each historical match from this page?`,
      answer: "Yes. Every archived meeting links to both a match page and its prediction page.",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateFAQSchema(faqs),
          generateSportsSchema({
            type: "SportsEvent",
            name: `${data.team1.name} vs ${data.team2.name} Head to Head`,
            description: `${data.team1.name} vs ${data.team2.name} comparison page on IPL Scorebook.`,
            url: `/${data.slug}`,
            competitors: [
              { name: data.team1.name, url: `/team/${data.team1.slug}/stats` },
              { name: data.team2.name, url: `/team/${data.team2.slug}/stats` },
            ],
          }),
        ]}
      />

      <div className={`container ${styles.page}`}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Head To Head</span>
          <h1 className={styles.heroTitle}>
            {data.team1.name} vs {data.team2.name} Head to Head
          </h1>
          <p className={styles.heroText}>
            This comparison page is generated from the local multi-season match archive. It combines total wins, recent
            meetings, venue splits and direct links into the match and prediction routes for every recorded fixture.
          </p>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{data.totalMatches} matches</span>
            <span className={styles.badge}>
              {data.team1.shortName} {data.team1Wins} wins
            </span>
            <span className={styles.badge}>
              {data.team2.shortName} {data.team2Wins} wins
            </span>
          </div>
        </section>

        <div className={styles.splitGrid}>
          <TeamCard
            href={`/team/${data.team1.slug}/stats`}
            logoUrl={data.team1.logoUrl}
            name={data.team1.name}
            shortName={data.team1.shortName}
            summary={`${data.team1.name} have ${data.team1Wins} wins in this head-to-head sample.`}
            meta={[`Titles ${data.team1.titles.length}`, data.team1.venue]}
          />
          <TeamCard
            href={`/team/${data.team2.slug}/stats`}
            logoUrl={data.team2.logoUrl}
            name={data.team2.name}
            shortName={data.team2.shortName}
            summary={`${data.team2.name} have ${data.team2Wins} wins in this head-to-head sample.`}
            meta={[`Titles ${data.team2.titles.length}`, data.team2.venue]}
          />
        </div>

        <Section title="Last Five Matches" description="Recent meetings are the fastest way to answer franchise-vs-franchise search intent.">
          <div className={styles.cardsGrid}>
            {data.lastFive.map((match) => (
              <MatchCard
                key={match.slug}
                href={`/match/${match.slug}`}
                title={`Season ${match.season}`}
                summary={match.result}
                meta={[match.venueName, match.winnerName]}
              />
            ))}
          </div>
        </Section>

        <Section title="Venue Split" description="Venue context helps separate strong overall rivalries from ground-specific edges.">
          <article className={styles.card}>
            <StatsTable
              columns={[
                { key: "venueName", label: "Venue" },
                { key: "matches", label: "Matches" },
                { key: "team1Wins", label: `${data.team1.shortName} Wins` },
                { key: "team2Wins", label: `${data.team2.shortName} Wins` },
              ]}
              rows={data.venueBreakdown.map((row) => ({
                venueName: row.venueName,
                matches: row.matches,
                team1Wins: row.team1Wins,
                team2Wins: row.team2Wins,
              }))}
            />
          </article>
        </Section>

        <Section title="All Meetings" description="Each archived meeting links down into both the match page and the prediction page.">
          <div className={styles.cardsGrid}>
            {data.matchSlugs.map((match) => (
              <MatchCard
                key={`${match.slug}-${match.season}`}
                href={match.matchSlug}
                title={match.label}
                summary="Open the static match page for scorecard and timeline coverage."
                meta={[`Season ${match.season}`, "Match page"]}
              />
            ))}
          </div>
        </Section>

        <Section title="Comparison FAQ" description="Structured answers for the most common rivalry searches.">
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
    </>
  );
}
