'use client';

import { useMemo } from 'react';
import { PLAYERS, TEAMS } from '@/lib/data';
import { Gavel, TrendingUp, DollarSign, PieChart, Info } from 'lucide-react';
import PlayerAvatar from '@/components/PlayerAvatar';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IPL 2026 Auction – Sold Prices & Player Bids",
  description:
    "Explore IPL 2026 auction results including player sold prices, highest bids, and team spending details. Complete IPL auction history on JD’s IPL.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/auction",
  },
  openGraph: {
    title: "IPL 2026 Auction Results & Sold Prices",
    description:
      "Complete IPL auction details including top bids and player price breakdown.",
    url: "https://jds-ipl.vercel.app/auction",
    type: "website",
  },
};
export default function AuctionClient() {

  const parsePrice = (price: string) =>
    parseFloat(price.replace(' Cr', '') || '0');

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
    return TEAMS.map(team => {
      const spend = PLAYERS
        .filter(
          p =>
            p.currentTeam?.trim().toLowerCase() ===
            team.name?.trim().toLowerCase()
        )
        .reduce((acc, p) => acc + parsePrice(p.soldPrice), 0);
      return { ...team, spend };
    }).sort((a, b) => b.spend - a.spend);
  }, []);

  const maxSpend = Math.max(...teamSpend.map(t => t.spend));

  const getTeamLogo = (teamName: string) =>
    TEAMS.find(t => t.name === teamName)?.logoUrl ||
    '/team-placeholder.png';

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>

      {/* HEADER */}
      <header style={{ marginBottom: '40px' }}>
        <h1 className="dashboard-title">
          Auction Dashboard
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Real-time insights and historical data from all IPL auction cycles
        </p>
      </header>

      {/* SUMMARY */}
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}
      >

        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>
              Total Purse Spent
            </span>
            <DollarSign size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>
            ₹{totalSpend.toFixed(2)} Cr
          </div>
          <div style={{ color: '#22c55e', fontSize: '12px', marginTop: '8px' }}>
            All teams combined
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>
              Highest Individual Price
            </span>
            <Gavel size={18} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>
            ₹{highest?.soldPrice}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>
            {highest?.name}
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>
              Total Players
            </span>
            <PieChart size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>
            {PLAYERS.length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>
            Active dataset
          </div>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="auction-layout">

        {/* TABLE SECTION */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px' }}>Top Current Valuations</h2>
            <Info size={16} color="#64748b" />
          </div>

          <div
            className="glass-card table-wrapper"
            style={{
              padding: 0,
              overflowX: 'auto'
            }}
          >

            <table
              className="responsive-table"
              style={{
                width: '100%',
                minWidth: '600px',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '12px' }}>Player</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '12px' }}>Team</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontSize: '12px', textAlign: 'right' }}>Price</th>
                </tr>
              </thead>

              <tbody>
                {topBuys.slice(0, 10).map(player => (
                  <tr key={player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <PlayerAvatar name={player.name} src={player.avatarUrl} size={32} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{player.name}</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>{player.role}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 24px', color: '#94a3b8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={getTeamLogo(player.currentTeam)} alt="" style={{ width: '20px' }} />
                        {player.currentTeam}
                      </div>
                    </td>

                    <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: 'var(--secondary)' }}>
                      {player.soldPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </section>

        {/* TEAM SPEND SECTION */}
        <section style={{ width: '100%', minWidth: 0 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',marginTop: '24px' }}>
            <h2 style={{ fontSize: '24px' }}>Team Spend Share</h2>
            <TrendingUp size={20} color="var(--primary)" />
          </div>

          <div className="glass-card" style={{ width: '100%' }}>

            {teamSpend.map(team => {
              const percent =
                team.spend > 0 && maxSpend
                  ? Math.max((team.spend / maxSpend) * 100, 3)
                  : 3;

              return (
                <div key={team.id} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <img src={team.logoUrl} alt="" style={{ width: '24px' }} />
                      <span style={{ fontWeight: 600 }}>{team.abbreviation}</span>
                    </div>
                    <span style={{ color: '#94a3b8' }}>
                      ₹{team.spend.toFixed(2)} Cr
                    </span>
                  </div>

                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: team.color,
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </section>

      </div>
    </div>
  );
}
