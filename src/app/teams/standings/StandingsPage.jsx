'use client';

import { TEAMS } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Award, Users, MapPin, ChevronRight } from "lucide-react";

const baseUrl = "https://jds-ipl.vercel.app";

export default function Standings() {
  const sortedTeams = [...TEAMS].sort((a, b) => a.lastYearRank - b.lastYearRank);
  const topTeam = sortedTeams[0];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Teams", item: `${baseUrl}/teams` },
      { "@type": "ListItem", position: 3, name: "Standings", item: `${baseUrl}/standings` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IPL 2026 Points Table",
    itemListElement: sortedTeams.map((team, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: team.name,
      url: `${baseUrl}/teams/${team.id}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which team is top of the IPL 2026 table?",
        acceptedAnswer: {
          "@type": "Answer",
          text: topTeam ? `${topTeam.name} is currently top of the IPL 2026 points table.` : "The IPL 2026 points table is updated after each match.",
        },
      },
      {
        "@type": "Question",
        name: "How is NRR calculated in IPL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Net Run Rate (NRR) is calculated as the average runs scored per over minus the average runs conceded per over across the tournament.",
        },
      },
    ],
  };

  const structuredData = [breadcrumbSchema, itemListSchema, faqSchema];

  return (
    <div style={{ marginTop: "80px" }} className="container standings-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="standings-header">
        <h1 className="standings-title">IPL 2026 Points Table and Standings</h1>
        <p className="standings-subtitle">
          IPL 2026 points table highlights team rankings, home venues and title history so you can track standings in one view. Check now.
        </p>
      </header>

      <div className="glass-card standings-table-wrapper">
        <div className="table-scroll">
          <table className="standings-table">
            <caption>IPL 2026 Points Table - Updated Standings</caption>
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
                            ? "rgba(37, 99, 235, 0.2)"
                            : "rgba(255,255,255,0.05)",
                        color: team.lastYearRank <= 4 ? "var(--primary)" : "inherit",
                        border: team.lastYearRank === 1 ? "1px solid gold" : "none",
                      }}
                    >
                      {team.lastYearRank}
                    </div>
                  </td>

                  <td>
                    <Link href={`/teams/${team.id}`} className="team-link">
                      <div className="team-logo-sm">
                        <Image
                          src={team.logoUrl}
                          alt={`${team.name} IPL team logo`}
                          width={32}
                          height={32}
                        />
                      </div>

                      <div>
                        <div className="team-name">{team.name}</div>
                        <div className="team-abbr">{team.abbreviation}</div>
                      </div>
                    </Link>
                  </td>

                  <td className="venue-cell">
                    <MapPin size={14} color={team.color} />
                    {team.venue.split(",")[0]}
                  </td>

                  <td>
                    <div className="titles-cell">
                      {team.titles.length > 0 ? (
                        Array.from({ length: team.titles.length }).map((_, i) => (
                          <Award key={i} size={16} color="gold" fill="gold" />
                        ))
                      ) : (
                        <span className="no-titles">-</span>
                      )}
                    </div>
                  </td>

                  <td className="owner-cell">
                    <Users size={14} />
                    {team.owner.split("(")[0]}
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

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>IPL 2026 Standings FAQ</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          <div className="glass-card" style={{ padding: "16px" }}>
            <strong>Which team is top of the IPL 2026 table?</strong>
            <p style={{ marginTop: "8px", color: "#94a3b8" }}>
              {topTeam ? `${topTeam.name} is currently leading the IPL 2026 points table based on latest standings.` : "The IPL 2026 points table is updated after every match."}
            </p>
          </div>
          <div className="glass-card" style={{ padding: "16px" }}>
            <strong>How is NRR calculated in IPL?</strong>
            <p style={{ marginTop: "8px", color: "#94a3b8" }}>
              Net Run Rate is calculated as the average runs scored per over minus the average runs conceded per over in the league stage.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>Related IPL 2026 Pages</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/teams" className="btn-primary">All IPL teams and franchises</Link>
          <Link href="/live-score" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL 2026 live score updates
          </Link>
          <Link href="/players" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL player stats directory
          </Link>
        </div>
      </section>

      <style jsx>{`
        .table-row-hover:hover {
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </div>
  );
}
