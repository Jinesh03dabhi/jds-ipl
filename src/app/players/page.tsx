'use client';

import { useState, useMemo } from 'react';
import { PLAYERS, TEAMS } from '@/lib/data';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import PlayerAvatar from '@/components/PlayerAvatar';

export default function PlayerDirectory() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const roles = ['All', 'Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

  const filteredPlayers = useMemo(() => {
    return PLAYERS.filter(player => {
      const matchesSearch =
        player.name.toLowerCase().includes(search.toLowerCase()) ||
        player.currentTeam.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === 'All' || player.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find(t => t.name === teamName)?.logoUrl || '/team-placeholder.png';
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="directory-title">
          Player Directory
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Search and filter through the complete IPL player database
        </p>
      </header>

      {/* FILTER BAR */}
      <div className="glass-card filter-bar">

        <div className="search-box">
          <Search size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name or team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="role-buttons">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`role-btn ${roleFilter === role ? 'active' : ''}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* PLAYER LIST */}
      <div className="player-list">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <Link
              href={`/players/${player.id}`}
              key={player.id}
              className="glass-card player-row"
            >
              <div className="player-info">
                <PlayerAvatar name={player.name} src={player.avatarUrl} />
                <div>
                  <div className="player-name">
                    {player.name}
                  </div>
                  <div className="player-nationality">
                    {player.nationality}
                  </div>
                </div>
              </div>

              <div className="team-info">
                <img
                  src={getTeamLogo(player.currentTeam)}
                  alt={player.currentTeam}
                  className="team-logo"
                />
                <span>{player.currentTeam}</span>
              </div>

              <div>
                <div className="label">Role</div>
                <div className="value">{player.role}</div>
              </div>

              <div>
                <div className="label">Sold Price</div>
                <div className="price-value">
                  {player.soldPrice}
                </div>
              </div>

              <ChevronRight size={20} color="#64748b" className="chevron" />
            </Link>
          ))
        ) : (
          <div className="no-result">
            No players found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
