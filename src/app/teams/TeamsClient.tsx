'use client';

import { TEAMS } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Award, Target, Users } from "lucide-react";

type TeamsClientProps = {
  showHeader?: boolean;
};

export default function TeamsClient({ showHeader = true }: TeamsClientProps) {
  return (
    <div
      className="container"
      style={{ marginTop: showHeader ? "80px" : "32px", paddingBottom: "80px" }}
    >
      {showHeader ? (
        <header className="teams-header">
          <h1 className="teams-title">IPL 2026 Teams and Franchises</h1>
          <p className="teams-subtitle">
            The IPL 2026 teams list covers every franchise, squad core, home venue and historical title count. Check now.
          </p>
        </header>
      ) : null}

      <div className="teams-grid">
        {TEAMS.map((team) => (
          <Link
            href={`/teams/${team.id}`}
            key={team.id}
            className="glass-card team-card"
            style={{ borderTop: `4px solid ${team.color}` }}
          >
            <div className="team-card-header">
              <div className="team-logo-box">
                <Image
                  src={team.logoUrl || "/team-placeholder.png"}
                  alt={`${team.name} IPL team logo`}
                  width={56}
                  height={56}
                />
              </div>

              <div>
                <h2 className="team-name">{team.name} IPL team</h2>
                <div className="team-abbr" style={{ color: team.color }}>
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
                <div className="stat-value">#{team.lastYearRank}</div>
              </div>
            </div>

            <div className="team-meta">
              <div>
                <Target size={14} /> {team.venue.split(",")[0]}
              </div>
              <div>
                <Users size={14} /> {team.owner}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "22px" }}>Explore More IPL 2026 Insights</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/points-table" className="btn-primary">IPL points table and standings</Link>
          <Link href="/players" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL player stats directory
          </Link>
          <Link href="/ipl-live-score-today" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL live score today
          </Link>
        </div>
      </section>
    </div>
  );
}
