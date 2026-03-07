"use client";

export default function WinnerCard({ teamName }) {

  return (
    <div className="glass-card winner-card" style={{
      background: 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(234,179,8,0.1) 100%)',
      border: '1px solid rgba(255,215,0,0.3)',
      boxShadow: '0 8px 32px 0 rgba(234,179,8,0.1)',
      textAlign: 'center',
      padding: '30px'
    }}>

      <div className="winner-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>

        <div className="trophy" style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px rgba(234,179,8,0.5))', animation: 'fadeInUp 0.6s ease' }}>🏆</div>

        <div className="winner-text" style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #fff, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {teamName || "Team"} Won The Match!
        </div>

        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '5px' }}>Match Concluded</div>

      </div>

    </div>
  );
}