import type { Metadata } from "next";
import { PLAYERS, TEAMS } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PlayerAvatar from '@/components/PlayerAvatar';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const player = PLAYERS.find(p => p.id === id);

  if (!player) {
    return {
      title: "Player Not Found",
    };
  }

  return {
    title: `${player.name} IPL Stats, Sold Price & Career Record`,
    description: `Check ${player.name}'s IPL career stats including total runs, wickets, strike rate, economy and latest auction sold price. Full performance breakdown on JD’s IPL.`,
    openGraph: {
      title: `${player.name} IPL Stats & Auction Price`,
      description: `Complete IPL performance analytics of ${player.name} including sold price and career statistics.`,
      url: `https://jds-ipl.vercel.app/players/${player.id}`,
      type: "article",
    },
    alternates: {
      canonical: `https://jds-ipl.vercel.app/players/${player.id}`,
    },
  };
}

export default async function PlayerProfile({ params }: Props) {

  const { id } = await params;
  const player = PLAYERS.find(p => p.id === id);

  if (!player) return notFound();

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find(t => t.name === teamName)?.logoUrl || '/team-placeholder.png';
  };
  const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: player.name,
  nationality: player.nationality,
  jobTitle: "IPL Cricketer",
  memberOf: {
    "@type": "SportsTeam",
    name: player.currentTeam,
  },
};

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <Link href="/players" className="btn-primary profile-back-btn">
        <ArrowLeft size={24} />
        <span>Back</span>
      </Link>

      <div className="profile-layout">
        <div>

          <div className="profile-header">
            <PlayerAvatar
              name={player.name}
              src={player.avatarUrl}
              size={160}
            />

            <div className="profile-header-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{player.name}</h1>
                <span className="profile-nationality">
                  ({player.nationality})
                </span>
              </div>

              <h3 className="profile-role">
                {player.role} 🏏
              </h3>

              <div className="profile-team">
                <Link
                  href={`/teams`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={getTeamLogo(player.currentTeam)}
                    alt={player.currentTeam}
                    className="profile-team-logo"
                  />
                </Link>
                <span>{player.currentTeam}</span>
              </div>
            </div>
          </div>

          <h2 style={{ marginBottom: '20px' }}>Career Stats</h2>

          <div className="stats-grid">

            {player.stats?.matches !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Matches</div>
                <div className="stat-value">{player.stats.matches}</div>
              </div>
            )}

            {player.stats?.runs !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Runs</div>
                <div className="stat-value">{player.stats.runs}</div>
              </div>
            )}

            {player.stats?.wickets !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Wickets</div>
                <div className="stat-value">{player.stats.wickets}</div>
              </div>
            )}

            {player.stats?.average !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Average</div>
                <div className="stat-value">{player.stats.average}</div>
              </div>
            )}

            {player.stats?.strikeRate !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Strike Rate</div>
                <div className="stat-value">{player.stats.strikeRate}</div>
              </div>
            )}

            {player.stats?.economy !== undefined && (
              <div className="glass-card stat-card">
                <div className="stat-label">Economy</div>
                <div className="stat-value">{player.stats.economy}</div>
              </div>
            )}

          </div>
        </div>

        <div>
          <div className="glass-card market-card">
            <h3>IPL Auction Sold Price</h3>
            <div className="market-value">
              ₹ {player.soldPrice}
            </div>
          </div>
        </div>

      </div>
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>

    </div>
  );
}
