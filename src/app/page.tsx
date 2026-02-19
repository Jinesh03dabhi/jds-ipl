'use client';

import { PLAYERS, TEAMS } from '@/lib/data';
import { TrendingUp, Users, Gavel, Award, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PlayerAvatar from '@/components/PlayerAvatar';
import LiveScoreClient from '@/app/live-score/LiveScoreClient'
export default function Home() {

  const featuredPlayers = PLAYERS.slice(0, 6);

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find(t => t.name === teamName)?.logoUrl || '/team-placeholder.png';
  };

  return (
    <div className="container hero-gradient" style={{ minHeight: '100vh', paddingBottom: '80px' }}>

      {/* HERO */}
      <section
        style={{
          textAlign: 'center',
          padding: '80px 16px 60px',
          position: 'relative',
          backgroundImage: "url('/ipl-background1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
            Explore historical auction data, real-time player analysis, and community-driven price predictions.
          </p></div>

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
      <div>
        
        <LiveScoreClient />

      </div>
      {/* QUICK STATS */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          marginTop: "30px",
          marginBottom: '80px',
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

      {/* FEATURED PLAYERS */}
      <section>
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
