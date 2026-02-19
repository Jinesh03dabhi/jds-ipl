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

export default async function TeamDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

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

  return (
    <div className="container team-detail-container">

      <Link
        href="/teams"
        className="btn btn-primary team-back-btn"
      >
        <ArrowLeft size={16} /> Back to Teams
      </Link>

      {/* HEADER */}
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

        {/* TITLES */}
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

      {/* MAIN GRID */}
      <div className="team-detail-layout">

        {/* ROSTER */}
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

        {/* STATS */}
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
