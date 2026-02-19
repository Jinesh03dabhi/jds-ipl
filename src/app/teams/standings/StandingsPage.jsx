'use client';

import { TEAMS } from '@/lib/data';
import Link from 'next/link';
import { Award, Users, MapPin, ChevronRight } from 'lucide-react';


export default function Standings() {

  const sortedTeams = [...TEAMS].sort(
    (a, b) => a.lastYearRank - b.lastYearRank
  );

  return (
    <div className="container standings-container">

      <header className="standings-header">
        <h1 className="standings-title">
          IPL League Standings
        </h1>
        <p className="standings-subtitle">
          Explore the 2024 season final rankings and historical performance of all franchises.
        </p>
      </header>

      <div className="glass-card standings-table-wrapper">

        <div className="table-scroll">

          <table className="standings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Home Venue</th>
                <th>Titles</th>
                <th>Owner</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {sortedTeams.map((team) => (
                <tr key={team.id} className="table-row-hover">

                  <td>
                    <div
                      className="rank-badge"
                      style={{
                        background:
                          team.lastYearRank <= 4
                            ? 'rgba(37, 99, 235, 0.2)'
                            : 'rgba(255,255,255,0.05)',
                        color:
                          team.lastYearRank <= 4
                            ? 'var(--primary)'
                            : 'inherit',
                        border:
                          team.lastYearRank === 1
                            ? '1px solid gold'
                            : 'none'
                      }}
                    >
                      {team.lastYearRank}
                    </div>
                  </td>

                  <td>
                    <Link
                      href={`/teams/${team.id}`}
                      className="team-link"
                    >
                      <div className="team-logo-sm">
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                        />
                      </div>

                      <div>
                        <div className="team-name">
                          {team.name}
                        </div>
                        <div className="team-abbr">
                          {team.abbreviation}
                        </div>
                      </div>
                    </Link>
                  </td>

                  <td className="venue-cell">
                    <MapPin size={14} color={team.color} />
                    {team.venue.split(',')[0]}
                  </td>

                  <td>
                    <div className="titles-cell">
                      {team.titles.length > 0 ? (
                        Array.from({ length: team.titles.length }).map((_, i) => (
                          <Award
                            key={i}
                            size={16}
                            color="gold"
                            fill="gold"
                          />
                        ))
                      ) : (
                        <span className="no-titles">-</span>
                      )}
                    </div>
                  </td>

                  <td className="owner-cell">
                    <Users size={14} />
                    {team.owner.split('(')[0]}
                  </td>

                  <td className="chevron-cell">
                    <Link href={`/teams/${team.id}`}>
                      <ChevronRight size={20} />
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

      <style jsx>{`
        .table-row-hover:hover {
          background: rgba(255,255,255,0.02);
        }
      `}</style>

    </div>
  );
}
