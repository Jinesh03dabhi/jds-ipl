'use client';

import { useMemo } from "react";
import { PLAYERS, TEAMS } from "@/lib/data";
import { Gavel, TrendingUp, DollarSign, PieChart, Info } from "lucide-react";
import PlayerAvatar from "@/components/PlayerAvatar";
import Image from "next/image";
import Link from "next/link";

export default function AuctionClient() {
  const parsePrice = (price: string) =>
    parseFloat(price.replace(" Cr", "") || "0");

  const topBuys = useMemo(() => {
    return [...PLAYERS].sort(
      (a, b) => parsePrice(b.soldPrice) - parsePrice(a.soldPrice)
    );
  }, []);

  const totalSpend = useMemo(() => {
    return PLAYERS.reduce((acc, p) => acc + parsePrice(p.soldPrice), 0);
  }, []);

  const highest = topBuys[0];

  const teamSpend = useMemo(() => {
    return TEAMS.map((team) => {
      const spend = PLAYERS
        .filter(
          (p) =>
            p.currentTeam?.trim().toLowerCase() ===
            team.name?.trim().toLowerCase()
        )
        .reduce((acc, p) => acc + parsePrice(p.soldPrice), 0);
      return { ...team, spend };
    }).sort((a, b) => b.spend - a.spend);
  }, []);

  const maxSpend = Math.max(...teamSpend.map((t) => t.spend));

  const getTeamLogo = (teamName: string) =>
    TEAMS.find((t) => t.name === teamName)?.logoUrl || "/team-placeholder.png";

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 className="dashboard-title">IPL 2026 Auction Results Dashboard</h1>
        <p style={{ color: "#94a3b8" }}>
          IPL 2026 auction results highlight top sold prices, team spending and record bids across franchises. Check now.
        </p>
      </header>

      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "48px",
        }}
      >
        <div className="glass-card" style={{ borderLeft: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>Total Purse Spent</span>
            <DollarSign size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800 }}>
            Rs {totalSpend.toFixed(2)} Cr
          </div>
          <div style={{ color: "#22c55e", fontSize: "12px", marginTop: "8px" }}>All teams combined</div>
        </div>

        <div className="glass-card" style={{ borderLeft: "4px solid var(--secondary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>Highest Individual Price</span>
            <Gavel size={18} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800 }}>
            Rs {highest?.soldPrice}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "8px" }}>{highest?.name}</div>
        </div>

        <div className="glass-card" style={{ borderLeft: "4px solid #ef4444" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>Total Players</span>
            <PieChart size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800 }}>{PLAYERS.length}</div>
          <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "8px" }}>Active dataset</div>
        </div>
      </div>

      <div className="auction-layout">
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px" }}>Top IPL 2026 Auction Valuations</h2>
            <Info size={16} color="#64748b" />
          </div>

          <div className="glass-card table-wrapper" style={{ padding: 0, overflowX: "auto" }}>
            <table
              className="responsive-table"
              style={{
                width: "100%",
                minWidth: "600px",
                borderCollapse: "collapse",
              }}
            >
              <caption style={{ textAlign: "left", padding: "16px 24px", color: "#cbd5e1" }}>
                IPL 2026 top auction valuations and team bids
              </caption>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "12px" }}>Player</th>
                  <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "12px" }}>Team</th>
                  <th
                    style={{
                      padding: "16px 24px",
                      color: "#64748b",
                      fontSize: "12px",
                      textAlign: "right",
                    }}
                  >
                    Price
                  </th>
                </tr>
              </thead>

              <tbody>
                {topBuys.slice(0, 10).map((player) => (
                  <tr key={player.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <PlayerAvatar name={player.name} src={player.avatarUrl} size={32} alt={`${player.name} IPL player avatar`} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{player.name}</div>
                          <div style={{ fontSize: "10px", color: "#64748b" }}>{player.role}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "16px 24px", color: "#94a3b8" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Image
                          src={getTeamLogo(player.currentTeam)}
                          alt={`${player.currentTeam} IPL team logo`}
                          width={20}
                          height={20}
                        />
                        {player.currentTeam}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "16px 24px",
                        textAlign: "right",
                        fontWeight: 700,
                        color: "var(--secondary)",
                      }}
                    >
                      {player.soldPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ width: "100%", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", marginTop: "24px" }}>
            <h2 style={{ fontSize: "24px" }}>Team Auction Spend Share</h2>
            <TrendingUp size={20} color="var(--primary)" />
          </div>

          <div className="glass-card" style={{ width: "100%" }}>
            {teamSpend.map((team) => {
              const percent =
                team.spend > 0 && maxSpend ? Math.max((team.spend / maxSpend) * 100, 3) : 3;

              return (
                <div key={team.id} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <Image
                        src={team.logoUrl || "/team-placeholder.png"}
                        alt={`${team.name} IPL team logo`}
                        width={24}
                        height={24}
                      />
                      <span style={{ fontWeight: 600 }}>{team.abbreviation}</span>
                    </div>
                    <span style={{ color: "#94a3b8" }}>Rs {team.spend.toFixed(2)} Cr</span>
                  </div>

                  <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        background: team.color,
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "22px" }}>Explore More IPL 2026 Data</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/players" className="btn-primary">IPL 2026 player stats directory</Link>
          <Link href="/teams" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL teams and squads overview
          </Link>
          <Link href="/top-10-expensive-ipl-players" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            Top 10 most expensive IPL players
          </Link>
        </div>
      </section>
    </div>
  );
}
