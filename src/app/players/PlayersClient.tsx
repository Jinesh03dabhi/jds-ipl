'use client';

import { useState, useMemo } from "react";
import { PLAYERS, TEAMS } from "@/lib/data";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PlayerAvatar from "@/components/PlayerAvatar";

type PlayersClientProps = {
  showHeader?: boolean;
};

export default function PlayersClient({ showHeader = true }: PlayersClientProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const roles = ["All", "Batsman", "Bowler", "All-rounder", "Wicket-keeper"];

  const filteredPlayers = useMemo(() => {
    return PLAYERS.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(search.toLowerCase()) ||
        player.currentTeam.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "All" || player.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find((t) => t.name === teamName)?.logoUrl || "/team-placeholder.png";
  };

  return (
    <div
      className="container"
      style={{ marginTop: showHeader ? "80px" : "32px", paddingBottom: "80px" }}
    >
      {showHeader ? (
        <header style={{ marginBottom: "40px" }}>
          <h1 className="directory-title">IPL 2026 Player Directory</h1>
          <p style={{ color: "#94a3b8" }}>
            The IPL 2026 player directory lets you search by name, role, or franchise to discover the latest player stats and auction prices. Check now.
          </p>
        </header>
      ) : null}

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
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`role-btn ${roleFilter === role ? "active" : ""}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="player-list">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <Link href={`/players/${player.id}`} key={player.id} className="glass-card player-row">
              <div className="player-info">
                <PlayerAvatar name={player.name} src={player.avatarUrl} alt={`${player.name} IPL player avatar`} />
                <div>
                  <div className="player-name">{player.name}</div>
                  <div className="player-nationality">{player.nationality}</div>
                </div>
              </div>

              <div className="team-info">
                <Image
                  src={getTeamLogo(player.currentTeam)}
                  alt={`${player.currentTeam} IPL team logo`}
                  width={28}
                  height={28}
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
                <div className="price-value">{player.soldPrice}</div>
              </div>

              <ChevronRight size={20} color="#64748b" className="chevron" />
            </Link>
          ))
        ) : (
          <div className="no-result">No players found matching your criteria.</div>
        )}
      </div>

      <section style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "22px" }}>Explore Related IPL 2026 Pages</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/ipl-teams" className="btn-primary">IPL teams and squads</Link>
          <Link href="/auction" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL 2026 auction results
          </Link>
          <Link href="/ipl-live-score-today" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL live score today
          </Link>
        </div>
      </section>
    </div>
  );
}
