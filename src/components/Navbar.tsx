'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Gavel,
  TrendingUp,
  Layout,
  Search,
  ShieldAlert,
  Trophy,
  Calendar,
  Menu,
  X
} from 'lucide-react'
import { PLAYERS, TEAMS } from '@/lib/data'

export default function Navbar() {

  const router = useRouter()
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;

      if (window.scrollY > 10) {
        navRef.current.classList.add("scrolled");
      } else {
        navRef.current.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const linkStyle = (href: string) =>
    isActive(href) ? { color: "var(--primary)" } : undefined;

  return (
    <nav className="navbar-root" ref={navRef}>
      <div className="container navbar-container">

        {/* LOGO */}
        <Link href="/" className="navbar-logo">
          <Image src="/jds-ipl-logo-1.png" alt="IPL Scorebook Logo" width={30} height={30} />
          <span style={{ color: 'var(--primary)' }}>IPL</span>
          <span style={{ color: '#fff' }}>Scorebook</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="navbar-menu">
          <Link href="/" className="navbar-link" style={linkStyle("/")}><LayoutDashboard size={18} /> Dashboard</Link>
          <Link href="/players" className="navbar-link" style={linkStyle("/players")}><Users size={18} /> Players</Link>
          <Link href="/teams" className="navbar-link" style={linkStyle("/teams")}><ShieldAlert size={18} /> Teams</Link>
          <Link href="/standings" className="navbar-link" style={linkStyle("/standings")}><Trophy size={18} /> Ranking</Link>
          <Link href="/schedule" className="navbar-link" style={linkStyle("/schedule")}><Calendar size={18} /> Schedule</Link>
          <Link href="/auction" className="navbar-link" style={linkStyle("/auction")}><Gavel size={18} /> Auction</Link>
          <Link href="/ipl-winners" className="navbar-link" style={linkStyle("/ipl-winners")}><Trophy size={18} /> Winners</Link>
          <Link href="/predictions" className="navbar-link" style={linkStyle("/predictions")}><TrendingUp size={18} /> Predictions</Link>
          <Link href="/widgets" className="navbar-link" style={linkStyle("/widgets")}><Layout size={18} /> Widgets</Link>
        </div>

        {/* SEARCH */}
        <div className="navbar-search">
          <Search size={16} className="search-icon" />
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Players & Teams..."
          />

          {(playerResults.length > 0 || teamResults.length > 0) && (
            <div className="search-dropdown">

              {/* Players Section */}
              {playerResults.length > 0 && (
                <>
                  <div className="search-section-title">Players</div>

                  {playerResults.map(p => (
                    <div
                      key={p.id}
                      className="search-item"
                      onClick={() => goToPlayer(p.id)}
                    >
                      {p.name}
                    </div>
                  ))}
                </>
              )}

              {/* Teams Section */}
              {teamResults.length > 0 && (
                <>
                  <div className="search-section-title">Teams</div>

                  {teamResults.map(t => (
                    <div
                      key={t.id}
                      className="search-item"
                      onClick={() => goToTeam(t.id)}
                    >
                      {t.name}
                    </div>
                  ))}
                </>
              )}

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
        <div className="navbar-menu">
          <Link href="/" onClick={() => setMobileOpen(false)} style={linkStyle("/")}>Dashboard</Link>
          <Link href="/players" onClick={() => setMobileOpen(false)} style={linkStyle("/players")}>Players</Link>
          <Link href="/teams" onClick={() => setMobileOpen(false)} style={linkStyle("/teams")}>Teams</Link>
          <Link href="/standings" onClick={() => setMobileOpen(false)} style={linkStyle("/standings")}>Ranking</Link>
          <Link href="/schedule" onClick={() => setMobileOpen(false)} style={linkStyle("/schedule")}>Schedule</Link>
          <Link href="/auction" onClick={() => setMobileOpen(false)} style={linkStyle("/auction")}>Auction</Link>
          <Link href="/ipl-winners" onClick={() => setMobileOpen(false)} style={linkStyle("/ipl-winners")}>Winners</Link>
          <Link href="/predictions" onClick={() => setMobileOpen(false)} style={linkStyle("/predictions")}>Predictions</Link>
          <Link href="/widgets" onClick={() => setMobileOpen(false)} style={linkStyle("/widgets")}>Widgets</Link>
        </div>
      )}
    </nav>
  )
}
