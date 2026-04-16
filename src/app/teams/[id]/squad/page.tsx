import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/intent/JsonLd";
import PlayerCard from "@/components/PlayerCard";
import Section from "@/components/Section";
import styles from "@/components/seo-ui.module.css";
import { getAllTeams } from "@/lib/data-helpers";
import { generateFAQSchema, generateMetadata as createMetadata, generateSportsSchema } from "@/lib/seo";
import { getTeamStats } from "@/lib/stats-engine";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
    return getAllTeams().map((team) => ({
        id: team.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const teamData = getTeamStats(id);

    if (!teamData) {
        return {};
    }

    return createMetadata({
        title: `${teamData.team.name} Squad 2026 - Playing XI, Strengths, Weaknesses`,
        description: `${teamData.team.name} squad page with full player list, predicted playing XI, team strengths and weakness analysis.`,
        slug: `/teams/${id}/squad`,
        keywords: [
            `${teamData.team.name} squad 2026`,
            `${teamData.team.name} playing XI`,
            `${teamData.team.shortName} predicted XI`,
        ],
    });
}

export default async function TeamSquadPage({ params }: PageProps) {
    const { id } = await params;
    const teamData = getTeamStats(id);

    if (!teamData) {
        notFound();
    }

    const faqs = [
        {
            question: `Who is in the ${teamData.team.name} squad?`,
            answer: `${teamData.team.squad.length} players are linked to the ${teamData.team.name} squad in the local TypeScript dataset.`,
        },
        {
            question: `What is the predicted ${teamData.team.name} playing XI?`,
            answer: `${teamData.predictedXI.map((player) => player.name).join(", ")} form the current predicted XI.`,
        },
        {
            question: `What are ${teamData.team.name}'s main strengths and weaknesses?`,
            answer: `${teamData.strengths[0]} ${teamData.weaknesses[0]}`,
        },
    ];

    return (
        <div className={`container ${styles.page}`}>
            <JsonLd
                data={[
                    generateFAQSchema(faqs),
                    generateSportsSchema({
                        type: "SportsTeam",
                        name: `${teamData.team.name} Squad`,
                        description: `${teamData.team.name} squad route on IPL Scorebook.`,
                        url: `/teams/${id}/squad`,
                    }),
                ]}
            />

            <section className={styles.hero}>
                <span className={styles.eyebrow}>Squad Page</span>
                <h1 className={styles.heroTitle}>{teamData.team.name} Squad 2026</h1>
                <p className={styles.heroText}>
                    This squad route turns one team page into multiple search targets by separating lineup-focused intent from
                    broad stats intent. It keeps the player list, predicted XI and strength notes all in one static route.
                </p>
                <div className={styles.badgeRow}>
                    <span className={styles.badge}>{teamData.team.shortName}</span>
                    <span className={styles.badge}>Captain {teamData.team.captain}</span>
                    <span className={styles.badge}>Coach {teamData.team.coach ?? "TBA"}</span>
                </div>
            </section>

            <Section title="Predicted Playing XI" description="The predicted XI is derived from the local player status and impact data.">
                <div className={styles.cardsGrid}>
                    {teamData.predictedXI.map((player) => (
                        <PlayerCard
                            key={player.id}
                            href={`/players/${player.slug}/stats`}
                            name={player.name}
                            role={player.role}
                            teamName={teamData.team.name}
                            statLine={`${player.stats.matches} matches · ${player.stats.runs ?? 0} runs · ${player.stats.wickets ?? 0} wickets`}
                            avatarUrl={player.avatarUrl}
                        />
                    ))}
                </div>
            </Section>

            <Section title="Full Squad" description="Every player entry links back into the player stats route for better internal linking depth.">
                <div className={styles.cardsGrid}>
                    {teamData.squad.map((player) => (
                        <PlayerCard
                            key={player.id}
                            href={`/players/${player.slug}/stats`}
                            name={player.name}
                            role={player.role}
                            teamName={teamData.team.name}
                            statLine={`${player.status} · ${player.stats.matches} matches`}
                            avatarUrl={player.avatarUrl}
                        />
                    ))}
                </div>
            </Section>

            <Section title="Strengths and Weaknesses" description="Simple roster logic makes this page useful even before matchday prediction routes are opened.">
                <div className={styles.splitGrid}>
                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Strengths</h3>
                        <div className={styles.list}>
                            {teamData.strengths.map((item) => (
                                <div key={item} className={styles.listItem}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </article>
                    <article className={styles.card}>
                        <h3 className={styles.cardTitle}>Weaknesses</h3>
                        <div className={styles.list}>
                            {teamData.weaknesses.map((item) => (
                                <div key={item} className={styles.listItem}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            </Section>

            <Section title="Next Links" description="Team routes should flow naturally into the stats and comparison pages.">
                <div className={styles.list}>
                    <div className={styles.listItem}>
                        <Link href={`/teams/${teamData.team.slug}/stats`} className={styles.link}>
                            Back to team stats page
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
            </Section>
        </div>
    );
}
