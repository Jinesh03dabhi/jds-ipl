import type { Metadata } from "next";
import { PLAYERS, TEAMS } from '@/lib/data';
import { notFound } from 'next/navigation';
import PlayerAvatar from '@/components/PlayerAvatar';
import Link from 'next/link';
import {
  Award,
  MapPin,
  Users,
  TrendingUp,
  Gavel,
  ArrowLeft
} from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const team = TEAMS.find(t => t.id === id);

  if (!team) {
    return { title: "Team Not Found" };
  }

  return {
    title: `${team.name} Squad, Players & Auction Details`,
    description: `Explore ${team.name} full IPL squad, player list, auction spending, performance history and championship titles. Complete team analysis on JD’s IPL.`,
    openGraph: {
      title: `${team.name} IPL Squad & Stats`,
      description: `Full team roster, auction stats and ranking history of ${team.name}.`,
      url: `https://jds-ipl.vercel.app/teams/${team.id}`,
      type: "website",
    },
    alternates: {
      canonical: `https://jds-ipl.vercel.app/teams/${team.id}`,
    },
  };
}

export default async function TeamDetail({ params }: Props) {

  const { id } = await params;
  const team = TEAMS.find(t => t.id === id);
  if (!team) return notFound();

  const teamPlayers = PLAYERS.filter(
    p => p.currentTeam === team.name
  );

  const parsePrice = (price: string) =>
    parseFloat(price.replace(' Cr', '') || '0');

  const totalSpend = teamPlayers.reduce(
    (acc, p) => acc + parsePrice(p.soldPrice),
    0
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    sport: "Cricket",
    member: teamPlayers.map(player => ({
      "@type": "Person",
      name: player.name
    })),
  };

  return (
    <div className="container team-detail-container">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Link
        href="/teams"
        className="btn btn-primary team-back-btn"
      >
        <ArrowLeft size={16} /> Back to Teams
      </Link>

      <div
        className="glass-card team-header-card"
        style={{ borderLeft: `8px solid ${team.color}` }}
      >
        <div className="team-header-top">

          <div className="team-logo-box-lg">
            <img
              src={team.logoUrl}
              alt={team.name}
            />
          </div>

          <div className="team-header-info">
            <h1 className="team-detail-title">
              {team.name}
            </h1>

            <div className="team-meta-row">
              <div>
                <Users size={18} color={team.color} /> {team.owner}
              </div>
              <div>
                <MapPin size={18} color={team.color} /> {team.venue}
              </div>
            </div>
          </div>

          <div className="team-rank-box">
            <div>2024 RANK</div>
            <div className="team-rank-number">
              #{team.lastYearRank}
            </div>
          </div>

        </div>

        <div className="team-titles">
          {team.titles.length > 0 ? (
            team.titles.map(year => (
              <div
                key={year}
                className="team-title-badge"
              >
                <Award size={14} /> {year} Champion
              </div>
            ))
          ) : (
            <span className="no-titles">No titles yet</span>
          )}
        </div>
      </div>

      <div className="team-detail-layout">

        <section>
          <h2 className="section-title">
            Team Roster ({teamPlayers.length})
          </h2>

          <div className="roster-list">
            {teamPlayers.map(player => (
              <Link
                href={`/players/${player.id}`}
                key={player.id}
                className="glass-card roster-row"
              >
                <PlayerAvatar
                  name={player.name}
                  src={player.avatarUrl}
                  size={60}
                />

                <div className="roster-info">
                  <div className="roster-name">
                    {player.name}
                  </div>
                  <div className="roster-sub">
                    {player.role} • {player.nationality}
                  </div>
                </div>

                <div className="roster-price">
                  <div className="price-value">
                    {player.soldPrice}
                  </div>
                  <div className="price-label">
                    SOLD PRICE
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div>
          <h2 className="section-title">
            Performance History
          </h2>

          <div className="glass-card history-card">
            <h3 className="sub-heading">
              <TrendingUp size={18} /> Ranking Trend
            </h3>

            {team.historyRankings.map(item => (
              <div
                key={item.year}
                className="history-row"
              >
                <span>{item.year}</span>
                <span>#{item.rank}</span>
              </div>
            ))}
          </div>

          <div className="glass-card auction-card">
            <h3 className="sub-heading">
              <Gavel size={18} /> Auction Stats
            </h3>

            <div className="auction-total">
              {totalSpend.toFixed(2)} Cr
            </div>

            <div className="auction-label">
              Total Squad Spend
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
