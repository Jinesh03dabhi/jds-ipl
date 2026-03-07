'use client';

import { PLAYERS, TEAMS } from '@/lib/data';
import { TrendingUp, Users, Gavel, Award, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PlayerAvatar from '@/components/PlayerAvatar';
import LiveScoreClient from "./live-score/LiveScoreClient";

export default function Home() {

  const featuredPlayers = PLAYERS.slice(0, 6);

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find(t => t.name === teamName)?.logoUrl || '/team-placeholder.png';
  };

  return (
    <div className='container'>
      {/* 🚀 JSON-LD Structured Data: SportsEvent & FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              "name": "IPL Match",
              "sport": "Cricket"
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is IPL?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Indian Premier League (IPL) is a professional T20 cricket competition established in 2008 by the BCCI, played in India globally recognized as the most-attended cricket league in the world."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who won IPL 2023?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Chennai Super Kings (CSK) won the IPL 2023 title by defeating Gujarat Titans (GT) in the final match."
                  }
                }
              ]
            }
          ]),
        }}
      />
      <LiveScoreClient />
      <div className="container" style={{ minHeight: '100vh', paddingBottom: '80px' }}>

        {/* HERO */}
        <section className="hero-bg"
          style={{

            textAlign: 'center',
            padding: '80px 16px 60px',
            position: 'relative',
            overflow: 'hidden'

          }}
        >

          {/* OVERLAY */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(2,6,23,0.7) 0%, rgba(2, 2, 28, 0.9) 300%)',
              zIndex: 0
            }}
          />

          {/* CONTENT */}
          <div className="fade-in" style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(37, 99, 235, 0.2)',
              padding: '8px 16px',
              borderRadius: '100px',
              color: '#60a5fa',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '24px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", background: "#f87171", borderRadius: "50%", animation: "pulse 2s infinite" }}></span>
              IPL 2026 Analytics Now Live
            </div>

            <div>
              <h1 className="page-headline">
                Deep Data for Serious <br /> IPL Enthusiasts
              </h1>

              <p style={{ color: '#cbd5e1', fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                IPL Scorebook provides structured datasets covering historical auctions,
                team roster evolution and high-value player movements. Our statistical
                approach allows users to evaluate performance consistency across seasons.
              </p>

            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/players" className="btn-primary hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Browse Players <ArrowUpRight size={20} />
              </Link>

              <Link href="/auction" className="glass-card hover-scale" style={{ padding: '12px 24px', color: '#fff', textDecoration: 'none' }}>
                Auction Insights
              </Link>
            </div>

          </div>
        </section>

        {/* QUICK STATS */}
        <section
          className="grid fade-in"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            marginTop: "40px",
            marginBottom: '40px',
            gap: '24px'
          }}
        >
          <div className="info-card hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
            <div style={{ background: "rgba(37,99,235,0.2)", padding: '16px', borderRadius: '12px' }}>
              <Users size={32} color="var(--primary)" />
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Players</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>{PLAYERS.length}+</div>
            </div>
          </div>

          <div className="info-card hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
            <div style={{ background: "rgba(234,179,8,0.2)", padding: '16px', borderRadius: '12px' }}>
              <Gavel size={32} color="var(--secondary)" />
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Auction Records</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>18 Seasons</div>
            </div>
          </div>

          <div className="info-card hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
            <div style={{ background: "rgba(34,197,94,0.2)", padding: '16px', borderRadius: '12px' }}>
              <TrendingUp size={32} color="#22c55e" />
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy Rate</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>92.4%</div>
            </div>
          </div>
        </section>

        {/* FEATURED PLAYERS */}
        <section style={{ marginTop: '60px' }}>
          <h2 className="section-title">Featured Analytics</h2>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {featuredPlayers.map(player => (
              <div key={player.id} className="info-card hover-scale" style={{ padding: '24px' }}>
                <Link
                  href={`/players/${player.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <PlayerAvatar name={player.name} src={player.avatarUrl} size={80} />
                    <span style={{ color: 'var(--secondary)', fontWeight: 800, background: 'rgba(234,179,8,0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
                      ₹ {player.soldPrice}
                    </span>
                  </div>

                  <h3 style={{ marginTop: '16px', fontSize: '20px' }}>{player.name}</h3>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>{player.role} 🏏</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <Image src={getTeamLogo(player.currentTeam)} alt={player.currentTeam} width={24} height={24} style={{ objectFit: 'contain' }} />
                    <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '14px' }}>{player.currentTeam}</span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                    gap: '10px',
                    fontSize: '12px'
                  }}>
                    {player.stats?.matches !== undefined && <Stat label="M" value={player.stats.matches} />}
                    {player.stats?.runs !== undefined && <Stat label="R" value={player.stats.runs} />}
                    {player.stats?.wickets !== undefined && <Stat label="W" value={player.stats.wickets} />}
                    {player.stats?.strikeRate !== undefined && <Stat label="SR" value={player.stats.strikeRate} />}
                    {player.stats?.economy !== undefined && <Stat label="Eco" value={player.stats.economy} />}
                  </div>

                </Link>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Link href="/players" className='btn-primary hover-scale' style={{ width: "200px", padding: "16px", display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
              <span>View All Players</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* RELATED CONTENT / INSIGHTS */}
        <section style={{ marginTop: "80px" }}>
          <h2 className="section-title">Deep Dive Insights</h2>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="info-card hover-scale" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "rgba(37,99,235,0.1)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp color="var(--primary)" size={24} />
              </div>
              <h3 style={{ fontSize: "20px" }}>About IPL Analytics</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
                Our platform goes beyond basic score updates by analyzing auction trends, player valuations, performance metrics and team strategies.
              </p>
            </div>

            <div className="info-card hover-scale" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "rgba(234,179,8,0.1)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award color="var(--secondary)" size={24} />
              </div>
              <h3 style={{ fontSize: "20px" }}>Why We Stand Out</h3>
              <ul style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.8", listStyle: "none", padding: 0 }}>
                <li>🏏 Breakdown of record auction transfers</li>
                <li>📊 Analysis of top wicket-takers</li>
                <li>💰 Comparison of spending patterns</li>
              </ul>
            </div>

            <div className="info-card hover-scale" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "rgba(34,197,94,0.1)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight color="#22c55e" size={24} />
              </div>
              <h3 style={{ fontSize: "20px" }}>Featured Research</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <Link href="/top-10-expensive-ipl-players" style={{ color: "var(--primary)", textDecoration: "none" }}>→ Top 10 Most Expensive Players</Link>
                <Link href="/best-ipl-bowlers" style={{ color: "var(--primary)", textDecoration: "none" }}>→ Best IPL Bowlers of All Time</Link>
                <Link href="/ipl-auction-strategy" style={{ color: "var(--primary)", textDecoration: "none" }}>→ How Auction Strategy Works</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section style={{ marginTop: "80px", maxWidth: "800px", margin: "80px auto 0" }}>
          <h2 className="section-title">Frequently Asked Questions</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, padding: "20px", borderRadius: "12px" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "#fff" }}>What is IPL?</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                The Indian Premier League (IPL) is a professional T20 cricket competition established in 2008 by the BCCI, played in India globally recognized as the most-attended cricket league in the world.
              </p>
            </div>

            <div className="highlight-box hover-scale" style={{ margin: 0, padding: "20px", borderRadius: "12px", borderLeftColor: "var(--secondary)", background: "rgba(234,179,8,0.05)" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "#fff" }}>Who won IPL 2023?</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                Chennai Super Kings (CSK) won the IPL 2023 title by defeating Gujarat Titans (GT) in the final match.
              </p>
            </div>

            <div className="highlight-box hover-scale" style={{ margin: 0, padding: "20px", borderRadius: "12px", borderLeftColor: "#22c55e", background: "rgba(34,197,94,0.05)" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "#fff" }}>Does IPL Scorebook offer real-time scores?</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                Yes, our Live Score section provides real-time ball-by-ball updates and detailed scorecards for all live matches during the tournament.
              </p>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string, value: any }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
      <div style={{ color: '#64748b' }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}
