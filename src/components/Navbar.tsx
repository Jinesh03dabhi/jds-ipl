'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Gavel,
  TrendingUp,
  Layout,
  Search,
  ShieldAlert,
  Trophy,
  Menu,
  X
} from 'lucide-react'
import { PLAYERS, TEAMS } from '@/lib/data'

export default function Navbar() {

  const router = useRouter()

  const [query, setQuery] = useState('')
  const [playerResults, setPlayerResults] = useState<typeof PLAYERS>([])
  const [teamResults, setTeamResults] = useState<typeof TEAMS>([])
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (value: string) => {
    setQuery(value)

    if (!value.trim()) {
      setPlayerResults([])
      setTeamResults([])
      return
    }

    const q = value.toLowerCase()

    const players = PLAYERS.filter(p =>
      p.name.toLowerCase().includes(q)
    ).slice(0, 4)

    const teams = TEAMS.filter(t =>
      t.name.toLowerCase().includes(q)
    ).slice(0, 4)

    setPlayerResults(players)
    setTeamResults(teams)
  }

  const clearSearch = () => {
    setQuery('')
    setPlayerResults([])
    setTeamResults([])
  }

  const goToPlayer = (id: string) => {
    clearSearch()
    setMobileOpen(false)
    router.push(`/players/${id}`)
  }

  const goToTeam = (id: string) => {
    clearSearch()
    setMobileOpen(false)
    router.push(`/teams/${id}`)
  }

  return (
    <nav className="navbar-root">
      <div className="container navbar-container">

        {/* LOGO */}
        <Link href="/" className="navbar-logo">
          <span style={{ color: 'var(--primary)' }}>JD's</span>
          <span style={{ color: '#fff' }}>IPL</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="navbar-menu">
          <Link href="/" className="navbar-link"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link href="/players" className="navbar-link"><Users size={18} /> Players</Link>
          <Link href="/teams" className="navbar-link"><ShieldAlert size={18} /> Teams</Link>
          <Link href="/teams/standings" className="navbar-link"><Trophy size={18} /> Standings</Link>
          <Link href="/auction" className="navbar-link"><Gavel size={18} /> Auction</Link>
          <Link href="/predictions" className="navbar-link"><TrendingUp size={18} /> Predictions</Link>
          <Link href="/widgets" className="navbar-link"><Layout size={18} /> Widgets</Link>
        </div>

        {/* SEARCH */}
        <div className="navbar-search">
          <Search size={16} className="search-icon" />
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
          />

          {(playerResults.length > 0 || teamResults.length > 0) && (
            <div className="search-dropdown">
              {playerResults.map(p => (
                <div key={p.id} onClick={() => goToPlayer(p.id)}>
                  {p.name}
                </div>
              ))}
              {teamResults.map(t => (
                <div key={t.id} onClick={() => goToTeam(t.id)}>
                  {t.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          <Link href="/players" onClick={() => setMobileOpen(false)}>Players</Link>
          <Link href="/teams" onClick={() => setMobileOpen(false)}>Teams</Link>
          <Link href="/teams/standings" onClick={() => setMobileOpen(false)}>Standings</Link>
          <Link href="/auction" onClick={() => setMobileOpen(false)}>Auction</Link>
          <Link href="/predictions" onClick={() => setMobileOpen(false)}>Predictions</Link>
          <Link href="/widgets" onClick={() => setMobileOpen(false)}>Widgets</Link>
        </div>
      )}
    </nav>
  )
}
