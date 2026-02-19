'use client';

import { TEAMS } from '@/lib/data';
import Link from 'next/link';
import { Award, Target, Users } from 'lucide-react';

export default function TeamsList() {
  return (
    <div className="container" style={{ paddingBottom: '80px' }}>

      <header className="teams-header">
        <h1 className="teams-title">
          IPL Franchises
        </h1>
        <p className="teams-subtitle">
          Explore the powerhouse teams of the Indian Premier League, their history, and world-class rosters.
        </p>
      </header>

      <div className="teams-grid">
        {TEAMS.map(team => (
          <Link
            href={`/teams/${team.id}`}
            key={team.id}
            className="glass-card team-card"
            style={{
              borderTop: `4px solid ${team.color}`
            }}
          >
            <div className="team-card-header">
              <div className="team-logo-box">
                <img
                  src={team.logoUrl}
                  alt={team.name}
                />
              </div>

              <div>
                <h2 className="team-name">{team.name}</h2>
                <div
                  className="team-abbr"
                  style={{ color: team.color }}
                >
                  {team.abbreviation}
                </div>
              </div>
            </div>

            <div className="team-stats">
              <div className="team-stat-box">
                <div className="stat-label">TITLES</div>
                <div className="stat-value">
                  <Award size={16} color="gold" /> {team.titles.length}
                </div>
              </div>

              <div className="team-stat-box">
                <div className="stat-label">2025 RANK</div>
                <div className="stat-value">
                  #{team.lastYearRank}
                </div>
              </div>
            </div>

            <div className="team-meta">
              <div>
                <Target size={14} /> {team.venue.split(',')[0]}
              </div>
              <div>
                <Users size={14} /> {team.owner}
              </div>
            </div>

          </Link>
        ))}
      </div>

    </div>
  );
}
