'use client';

import { use } from 'react';
import { PLAYERS, TEAMS } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PlayerAvatar from '@/components/PlayerAvatar';
import { notFound } from 'next/navigation';

export default function PlayerProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = use(params);
  const player = PLAYERS.find(p => p.id === id);

  if (!player) return notFound();

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find(t => t.name === teamName)?.logoUrl || '/team-placeholder.png';
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>

      {/* BACK BUTTON */}
      <Link
        href="/players"
        className="btn-primary profile-back-btn"
      >
        <ArrowLeft size={24} />
        <span>Back</span>
      </Link>

      {/* MAIN GRID */}
      <div className="profile-layout">

        {/* LEFT COLUMN */}
        <div>

          {/* HEADER */}
          <div className="profile-header">
            <PlayerAvatar
              name={player.name}
              src={player.avatarUrl}
              size={160}
            />

            <div className="profile-header-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{player.name}</h1>
                <span className="profile-nationality">
                  ({player.nationality})
                </span>
              </div>

              <h3 className="profile-role">
                {player.role} 🏏
              </h3>

              <div className="profile-team">
                <Link
                  href={`/teams`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <img
                    src={getTeamLogo(player.currentTeam)}
                    alt={player.currentTeam}
                    className="profile-team-logo"
                  />
                </Link>
                <span>{player.currentTeam}</span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <h2 style={{ marginBottom: '20px' }}>Career Stats</h2>

          <div className="stats-grid">

            {player.stats?.matches !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Matches</div>
                <div className="stat-value">{player.stats.matches}</div>
              </div>
            )}

            {player.stats?.runs !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Runs</div>
                <div className="stat-value">{player.stats.runs}</div>
              </div>
            )}

            {player.stats?.wickets !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Wickets</div>
                <div className="stat-value">{player.stats.wickets}</div>
              </div>
            )}

            {player.stats?.average !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Average</div>
                <div className="stat-value">{player.stats.average}</div>
              </div>
            )}

            {player.stats?.strikeRate !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Strike Rate</div>
                <div className="stat-value">{player.stats.strikeRate}</div>
              </div>
            )}

            {player.stats?.economy !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Economy</div>
                <div className="stat-value">{player.stats.economy}</div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="glass-card market-card">
            <h3>Market Value</h3>
            <div className="market-value">
              ₹ {player.soldPrice}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
