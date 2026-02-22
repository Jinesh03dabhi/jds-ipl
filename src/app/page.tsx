'use client';

import { PLAYERS, TEAMS } from '@/lib/data';
import { TrendingUp, Users, Gavel, Award, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PlayerAvatar from '@/components/PlayerAvatar';
export default function Home() {

  const featuredPlayers = PLAYERS.slice(0, 6);

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find(t => t.name === teamName)?.logoUrl || '/team-placeholder.png';
  };

  return (
    <div className="container hero-gradient" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      
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
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 82, 245, 0.1)',
            padding: '8px 16px',
            borderRadius: '100px',
            color: 'var(--primary)',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <Award size={16} /> IPL 2025 Analytics Now Live
          </div>

          <div><h1 className="text-gradient" style={{ fontSize: 'clamp(32px, 6vw, 64px)', marginBottom: '24px' }}>
            Deep Data for Serious <br /> IPL Enthusiasts
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: '700px', margin: '0 auto 40px' }}>
           ⭐ JD’s IPL provides structured datasets covering historical auctions,
            team roster evolution and high-value player movements. Our statistical
            approach allows users to evaluate performance consistency across seasons.
          </p>
          
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/players" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Browse Players <ArrowUpRight size={20} />
            </Link>

            <Link href="/auction" className="glass-card" style={{ padding: '12px 24px', color: '#fff' }}>
              Auction Insights
            </Link>
          </div>

        </div>
      </section>
      
      {/* QUICK STATS */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          marginTop: "30px",
          marginBottom: '30px',
          gap: '20px'
        }}
      >
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Users size={32} />
          <div>
            <div style={{ color: '#94a3b8' }}>Total Players</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{PLAYERS.length}+</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Gavel size={32} />
          <div>
            <div style={{ color: '#94a3b8' }}>Auction Records</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>18 Seasons</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <TrendingUp size={32} />
          <div>
            <div style={{ color: '#94a3b8' }}>Accuracy Rate</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>92.4%</div>
          </div>
        </div>
      </section>
        <div>
        
        

      </div>
      {/* FEATURED PLAYERS */}
      <section style={{marginTop: '30px',}}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: '32px' }}>Featured Analytics</h2>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {featuredPlayers.map(player => (
            <Link
              href={`/players/${player.id}`}
              key={player.id}
              className="glass-card"
              style={{ textDecoration: 'none', color: 'inherit', padding: '20px' }}
            >
              {/* Avatar + Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <PlayerAvatar name={player.name} src={player.avatarUrl} size={80} />
                <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>₹ {player.soldPrice}</span>
              </div>

              <h3 style={{ marginTop: '12px' }}>{player.name} ({player.role} 🏏)</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <img src={getTeamLogo(player.currentTeam)} alt={player.currentTeam} style={{ width: '30px', height: '30px' }} />
                <span style={{ color: '#94a3b8' }}>{player.currentTeam}</span>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                gap: '8px',
                fontSize: '12px'
              }}>
                {player.stats?.matches !== undefined && <Stat label="Matches" value={player.stats.matches} />}
                {player.stats?.runs !== undefined && <Stat label="Runs" value={player.stats.runs} />}
                {player.stats?.wickets !== undefined && <Stat label="Wickets" value={player.stats.wickets} />}
                {player.stats?.strikeRate !== undefined && <Stat label="SR" value={player.stats.strikeRate} />}
                {player.stats?.economy !== undefined && <Stat label="Eco" value={player.stats.economy} />}
              </div>

            </Link>
          ))}
        </div>
      </section>

      {/* VIEW MORE */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '45px' }}>
        <Link href="/players" className='btn-primary' style={{ width: "180px", height: "50px", display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
          <p>View More</p>
          <ArrowRight size={22} />
        </Link>
      </div>
      <section style={{ marginTop: "60px", maxWidth: "900px" }}>
  <h2>⭐About IPL Analytics</h2>

  <p>
    JD’s IPL is an independent cricket analytics platform focused on delivering
    structured insights into the Indian Premier League. Our platform goes beyond
    basic score updates by analyzing auction trends, player valuations,
    performance metrics and team strategies.
  </p>

  <p>
    We study how franchises allocate budgets, how auction records are broken,
    and how player performance impacts long-term team success. By combining
    historical data with modern statistical interpretation, JD’s IPL provides
    fans with a deeper understanding of the league’s financial and competitive ecosystem.
  </p>

  <p>
    Whether you are a fantasy cricket enthusiast, a casual viewer or a data-driven
    analyst, our goal is to present IPL information in a structured,
    research-oriented format.
  </p>
</section>

<section style={{ marginTop: "50px", maxWidth: "900px" }}>
  <h2>⭐Why JD’s IPL Stands Out</h2>

  <p>
    The IPL is no longer just a cricket tournament — it is a multi-billion
    dollar sports enterprise. Understanding auction strategy, player price
    inflation and squad composition requires more than surface-level coverage.
  </p>

  <ul style={{ marginTop: "20px", lineHeight: "1.9" ,listStyle:"none"}}>
    <li>✔ Detailed breakdown of record-breaking auction transfers</li>
    <li>✔ Analysis of top wicket-takers and Orange Cap contenders</li>
    <li>✔ Structured comparison of team spending patterns</li>
    <li>✔ Player-by-player performance evaluation</li>
    <li>✔ Long-term IPL financial trend observations</li>
  </ul>

  <p style={{ marginTop: "20px" }}>
    Our platform is designed to help fans understand not only what happens
    during a match, but why it happens from a strategic and financial perspective.
  </p>
</section>

  <section style={{ marginTop: "50px", maxWidth: "900px" }}>
  <h2>⭐Featured IPL Insights</h2>

  <p>
    Explore our in-depth research articles covering major IPL milestones
    and historical data trends:
  </p>

  <div style={{ marginTop: "20px", lineHeight: "1.9" }}>
    <p>
      <Link href="/top-10-expensive-ipl-players">
        ⭐Top 10 Most Expensive IPL Players in History
      </Link>
      {" "}– A detailed analysis of record-breaking auction prices and
      franchise investment patterns.
    </p>

    <p>
      <Link href="/best-ipl-bowlers">
        ⭐Best IPL Bowlers of All Time
      </Link>
      {" "}– Evaluating wicket tallies, economy rates and match-winning spells.
    </p>

    <p>
      <Link href="/ipl-auction-strategy">
        ⭐How IPL Auction Strategy Works
      </Link>
      {" "}– Understanding salary caps, player retention rules and bidding wars.
    </p>
  </div>
</section>


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
