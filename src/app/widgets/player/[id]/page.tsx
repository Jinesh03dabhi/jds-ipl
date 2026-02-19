import { PLAYERS } from '@/lib/data'
import { notFound } from 'next/navigation'

export default async function PlayerWidget({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  // ✅ unwrap params correctly
  const { id } = await params

  const decodedId = decodeURIComponent(id)

  const player = PLAYERS.find(
    p => String(p.id).toLowerCase() === decodedId.toLowerCase()
  )

  if (!player) {
    console.log('PLAYER NOT FOUND →', decodedId)
    return notFound()
  }

  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        padding: '20px',
        background: '#0b1220',
        color: '#fff',
        width: '350px',
        borderRadius: '12px',
      }}
    >
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
        LIVE STATS
      </div>

      <h3 style={{ marginBottom: '4px' }}>{player.name}</h3>

      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
        {player.currentTeam}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '8px',
        }}
      >
        <Stat label="MATCHES" value={player.stats?.matches ?? '-'} />
        <Stat label="RUNS" value={player.stats?.runs ?? '-'} />
        <Stat label="WICKETS" value={player.stats?.wickets ?? '-'} />
      </div>

      <div
        style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748b',
        }}
      >
        Powered by JD's IPL
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div
    style={{
      fontFamily: 'Inter, sans-serif',
      padding: '20px',
      background: '#0b1220',
      color: '#fff',
      width: '100%',
      maxWidth: '350px',
      borderRadius: '12px',
      boxSizing: 'border-box',
    }}
  >
      <div style={{ fontSize: '10px', color: '#64748b' }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  )
}
