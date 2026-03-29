"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Trophy, ChevronRight } from "lucide-react";

const STATUS_COLORS = {
  upcoming: "#64748b",
  live: "#ef4444",
  completed: "#22c55e",
};

const getDateKey = (dateStr) => {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  return new Date(dateStr).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
};

const formatDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00+05:30`);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const isToday = (dateStr) => getDateKey(dateStr) === getDateKey(new Date().toISOString());

const isTomorrow = (dateStr) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return getDateKey(dateStr) === getDateKey(tomorrow.toISOString());
};

const groupByDate = (matches) => {
  return matches.reduce((acc, match) => {
    const key = match.date || match.dateTimeGMT?.slice(0, 10);
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});
};

const applyFilter = (grouped, filter) => {
  if (filter === "all") return grouped;
  const filtered = {};
  Object.entries(grouped).forEach(([date, matches]) => {
    const next = matches.filter((match) => match.status === filter);
    if (next.length) filtered[date] = next;
  });
  return filtered;
};

const getCountdown = (dateTimeGMT, now) => {
  const target = new Date(dateTimeGMT).getTime();
  const diff = target - now;
  if (diff <= 0) return { label: "Starting soon!", urgent: true };

  const minutes = Math.floor(diff / 60000);
  if (minutes < 30) return { label: "Starting soon!", urgent: true };
  if (minutes < 60) return { label: `Starts in ${minutes}m`, urgent: "soon" };

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return { label: `Starts in ${hours}h ${remaining}m`, urgent: false };
};

const formatTimeIST = (dateTimeGMT) => {
  const date = new Date(dateTimeGMT);
  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  return `${time} IST`;
};

const getStatusColor = (status) => STATUS_COLORS[status] || "#64748b";

const hexToRgba = (hex, alpha) => {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getOverInfo = (match) => {
  const score = match?.score?.team2 || match?.score?.team1;
  if (!score) return null;
  const overs = score.match(/\(([^)]+)\)/)?.[1];
  return overs ? `Over ${overs}` : null;
};

export default function ScheduleClient() {
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [now, setNow] = useState(Date.now());
  const todayRef = useRef(null);

  const loadSchedule = useEffectEvent(async () => {
    try {
      const res = await fetch("/api/schedule", {
        cache: "no-store",
      });
      const data = await res.json();
      setSchedule(data.matches || []);
      setLastUpdated(data.lastUpdated || null);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadSchedule();
    }, 0);
    const intervalId = window.setInterval(() => {
      void loadSchedule();
    }, 60000);

    return () => {
      window.clearTimeout(timerId);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  const grouped = useMemo(() => groupByDate(schedule), [schedule]);
  const filteredGroups = useMemo(() => applyFilter(grouped, filter), [grouped, filter]);

  const counts = useMemo(() => {
    return {
      upcoming: schedule.filter((match) => match.status === "upcoming").length,
      live: schedule.filter((match) => match.status === "live").length,
      completed: schedule.filter((match) => match.status === "completed").length,
    };
  }, [schedule]);

  const fixtureRange = useMemo(() => {
    if (!schedule.length) return "TBD";
    const dates = schedule
      .map((match) => match.date || match.dateTimeGMT?.slice(0, 10))
      .filter(Boolean)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const formatShort = (dateStr) => {
      const date = new Date(`${dateStr}T00:00:00+05:30`);
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        timeZone: "Asia/Kolkata",
      }).format(date);
    };
    return `${formatShort(dates[0])} - ${formatShort(dates[dates.length - 1])}`;
  }, [schedule]);

  const nextMatch = useMemo(() => {
    const live = schedule.filter((match) => match.status === "live");
    if (live.length) return live[0];
    const upcoming = schedule
      .filter((match) => match.status === "upcoming")
      .sort(
        (a, b) =>
          new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime()
      );
    return upcoming[0] || null;
  }, [schedule]);

  const updatedLabel = useMemo(() => {
    if (!lastUpdated) return null;
    const date = new Date(lastUpdated);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  }, [lastUpdated]);

  const sortedDates = Object.keys(filteredGroups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <header className="fade-in hero">
        <div className="hero-card glass-card">
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
            <div className="glass-card" style={{ padding: "10px", borderRadius: "14px" }}>
              <Calendar size={20} color="var(--primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: "32px", margin: 0 }}>IPL 2026 Schedule</h1>
              <p style={{ color: "#94a3b8", marginTop: "6px" }}>
                IPL 2026 schedule coverage with match dates, IST start times, venues, live scores and results so you never miss a fixture. Check now.
              </p>
            </div>
          </div>
          {updatedLabel && (
            <div className="updated-row">
              <Clock size={14} /> Updated {updatedLabel} IST
            </div>
          )}
          <div className="summary-grid">
            <div className="info-card hover-scale summary-card">
              <div className="summary-label">Total Matches</div>
              <div className="summary-value">{schedule.length || "-"}</div>
            </div>
            <div className="info-card hover-scale summary-card">
              <div className="summary-label">Upcoming Fixtures</div>
              <div className="summary-value">{counts.upcoming || "-"}</div>
              {nextMatch && (
                <div className="summary-sub">
                  Next: {nextMatch.team1.shortName} vs {nextMatch.team2.shortName} at{" "}
                  {formatTimeIST(nextMatch.dateTimeGMT)}
                </div>
              )}
            </div>
            <div className="info-card hover-scale summary-card">
              <div className="summary-label">Live Now</div>
              <div className="summary-value">{counts.live || "0"}</div>
              <div className="summary-sub">{counts.completed} Completed Matches</div>
            </div>
            <div className="info-card hover-scale summary-card">
              <div className="summary-label">Fixture Window</div>
              <div className="summary-value">{fixtureRange}</div>
              <div className="summary-sub">India venues across all matchdays</div>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky-tabs">
        {[
          { key: "all", label: "All Matches", count: schedule.length },
          { key: "upcoming", label: "Upcoming", count: counts.upcoming, tone: "upcoming" },
          { key: "live", label: "Live", count: counts.live, tone: "live" },
          { key: "completed", label: "Completed", count: counts.completed, tone: "completed" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`filter-tab ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            <span className="tab-label">
              <span className={`tab-dot ${tab.tone || "all"}`} />
              {tab.label}
            </span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
          Loading IPL 2026 schedule...
        </div>
      ) : sortedDates.length === 0 ? (
        <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
          No matches found for this filter.
        </div>
      ) : (
        sortedDates.map((dateKey) => {
          const matches = filteredGroups[dateKey];
          const isTodayDate = isToday(dateKey);
          const isTomorrowDate = isTomorrow(dateKey);

          return (
            <section key={dateKey} className="date-group">
              <div
                ref={isTodayDate ? todayRef : null}
                className="date-header glass-card"
              >
                <div className="date-left">
                  <span>{formatDate(dateKey)}</span>
                  {isTodayDate && <span className="date-pill">TODAY</span>}
                  {isTomorrowDate && <span className="date-pill">TOMORROW</span>}
                </div>
                <div className="date-right">{matches.length} Matches</div>
              </div>

              <div className="matches-grid">
                {matches.map((match) => {
                  const countdown = match.status === "upcoming" ? getCountdown(match.dateTimeGMT, now) : null;
                  const liveOvers = match.status === "live" ? getOverInfo(match) : null;
                  const winnerName = match.winner?.toLowerCase();
                  const isTeam1Winner = winnerName && winnerName.includes(match.team1.name.toLowerCase());
                  const isTeam2Winner = winnerName && winnerName.includes(match.team2.name.toLowerCase());

                  return (
                    <div key={match.id} className={`glass-card match-card hover-scale ${match.status}`}>
                      <div className="match-top">
                        <div className="match-meta">
                          <span>{match.matchNumber}</span>
                          <span className="dot">-</span>
                          <span className="venue">
                            <MapPin size={12} />
                            {match.venue}
                          </span>
                        </div>
                        <div
                          className={`status-badge ${match.status}`}
                          style={{ borderColor: getStatusColor(match.status) }}
                        >
                          {match.status === "upcoming" && (
                            <>
                              <Clock size={14} /> {formatTimeIST(match.dateTimeGMT)}
                            </>
                          )}
                          {match.status === "live" && (
                            <>
                              <span className="live-dot" /> LIVE {liveOvers ? ` ${liveOvers}` : ""}
                            </>
                          )}
                          {match.status === "completed" && (
                            <>
                              Done
                            </>
                          )}
                        </div>
                      </div>

                      <div className="match-body">
                        <div
                          className="team-panel"
                          style={{
                            background: hexToRgba(match.team1.color, 0.08),
                          }}
                        >
                          <div
                            className="team-logo"
                            style={
                              isTeam1Winner
                                ? {
                                    boxShadow: "0 0 20px rgba(234, 179, 8, 0.6)",
                                    border: "1.5px solid #eab308",
                                  }
                                : undefined
                            }
                          >
                            <Image
                              src={match.team1.logo}
                              alt={`${match.team1.name} IPL team logo`}
                              width={60}
                              height={60}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <div className="team-name">{match.team1.name}</div>
                          {match.score?.team1 && (
                            <div className="team-score">
                              {match.score.team1}
                            </div>
                          )}
                          {isTeam1Winner && (
                            <div className="winner-chip">
                              <Trophy size={12} color="var(--secondary)" /> Winner
                            </div>
                          )}
                        </div>

                        <div className="match-center">
                          <div className="team-short">
                            {match.team1.shortName}
                            <span className="vs">vs</span>
                            {match.team2.shortName}
                          </div>
                          {match.status === "upcoming" && countdown && (
                            <div
                              className={`countdown ${countdown.urgent ? "urgent" : ""} ${
                                countdown.urgent === "soon" ? "soon" : ""
                              }`}
                            >
                              {countdown.label}
                            </div>
                          )}
                          {match.status === "completed" && match.result && (
                            <div className="result-text">
                              <Trophy size={14} color="var(--secondary)" /> {match.result}
                            </div>
                          )}
                        </div>

                        <div
                          className="team-panel"
                          style={{
                            background: hexToRgba(match.team2.color, 0.08),
                          }}
                        >
                          <div
                            className="team-logo"
                            style={
                              isTeam2Winner
                                ? {
                                    boxShadow: "0 0 20px rgba(234, 179, 8, 0.6)",
                                    border: "1.5px solid #eab308",
                                  }
                                : undefined
                            }
                          >
                            <Image
                              src={match.team2.logo}
                              alt={`${match.team2.name} IPL team logo`}
                              width={60}
                              height={60}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <div className="team-name">{match.team2.name}</div>
                          {match.score?.team2 && (
                            <div className="team-score">
                              {match.score.team2}
                            </div>
                          )}
                          {isTeam2Winner && (
                            <div className="winner-chip">
                              <Trophy size={12} color="var(--secondary)" /> Winner
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="match-footer">
                        <Link href={`/matches/${match.detailSlug}`} className="match-link">
                          Match preview <ChevronRight size={14} />
                        </Link>
                        <Link href={`/${match.predictionSlug}`} className="match-link">
                          Prediction page <ChevronRight size={14} />
                        </Link>
                        <Link href="/points-table" className="match-link">
                          Points table <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      )}

      <section style={{ marginTop: "40px" }}>
        <h2 className="section-title">More IPL 2026 Fixtures and Results</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/ipl-live-score-today" className="btn-primary">IPL live score today</Link>
          <Link href="/predictions" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            Match prediction hub
          </Link>
          <Link href="/points-table" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL 2026 points table
          </Link>
        </div>
      </section>

      <style jsx>{`
        .hero {
          margin-bottom: 32px;
        }

        .hero-card {
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 50%),
            radial-gradient(circle at top right, rgba(234, 179, 8, 0.12), transparent 45%);
          pointer-events: none;
        }

        .hero-card > * {
          position: relative;
          z-index: 1;
        }

        .updated-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .summary-card {
          padding: 16px;
          background: rgba(15, 23, 42, 0.65);
        }

        .summary-label {
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .summary-value {
          font-size: 22px;
          font-weight: 800;
          color: #e2e8f0;
        }

        .summary-sub {
          margin-top: 6px;
          font-size: 12px;
          color: #64748b;
        }

        .sticky-tabs {
          position: sticky;
          top: calc(var(--nav-height) + 16px);
          z-index: 20;
          display: flex;
          gap: 12px;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding: 12px 0 18px;
          background: #02060f;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .filter-tab {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(15, 23, 42, 0.6);
          color: #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .tab-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .tab-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #64748b;
        }

        .tab-dot.upcoming {
          background: #eab308;
        }

        .tab-dot.live {
          background: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
        }

        .tab-dot.completed {
          background: #22c55e;
        }

        .filter-tab.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }

        .tab-count {
          background: rgba(255, 255, 255, 0.15);
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 12px;
        }

        .date-group {
          margin-bottom: 36px;
        }

        .date-header {
          position: sticky;
          top: calc(var(--nav-height) + 74px);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .date-left {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
        }

        .date-pill {
          background: rgba(37, 99, 235, 0.2);
          color: var(--primary);
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .date-right {
          color: #94a3b8;
          font-size: 12px;
        }

        .matches-grid {
          display: grid;
          gap: 20px;
        }

        .match-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(2, 6, 15, 0.95));
          box-shadow: 0 18px 40px rgba(2, 8, 23, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .match-card:hover {
          transform: translateY(-4px);
          border-color: rgba(37, 99, 235, 0.45);
          box-shadow: 0 24px 48px rgba(2, 8, 23, 0.5);
        }

        .match-card.live {
          border-color: rgba(239, 68, 68, 0.45);
          box-shadow: 0 0 28px rgba(239, 68, 68, 0.2);
        }

        .match-card.completed {
          border-color: rgba(34, 197, 94, 0.35);
        }

        .match-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .match-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #cbd5f5;
          font-size: 13px;
        }

        .dot {
          color: #64748b;
        }

        .venue {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          color: #64748b;
          font-size: 12px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          border: 1px solid transparent;
          color: #e2e8f0;
          background: rgba(15, 23, 42, 0.7);
        }

        .status-badge.upcoming {
          background: rgba(148, 163, 184, 0.15);
          color: #e2e8f0;
        }

        .status-badge.live {
          color: #fecaca;
          background: rgba(239, 68, 68, 0.16);
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.25);
        }

        .status-badge.completed {
          background: rgba(34, 197, 94, 0.16);
          color: #bbf7d0;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          animation: pulse 1.4s infinite;
        }

        .match-body {
          display: grid;
          grid-template-columns: 1fr 160px 1fr;
          gap: 16px;
          align-items: center;
        }

        .team-panel {
          padding: 16px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          text-align: center;
        }

        .team-logo {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, 0.6);
        }

        .team-name {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
        }

        .team-score {
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
        }

        .winner-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--secondary);
          font-weight: 600;
          background: rgba(234, 179, 8, 0.12);
          padding: 4px 8px;
          border-radius: 999px;
        }

        .match-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .team-short {
          font-size: 18px;
          font-weight: 700;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .vs {
          font-size: 12px;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .countdown {
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
        }

        .countdown.soon {
          color: var(--secondary);
        }

        .countdown.urgent {
          color: #f87171;
          animation: pulse 1.6s infinite;
        }

        .result-text {
          color: var(--secondary);
          font-weight: 600;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .match-footer {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 13px;
          padding-top: 8px;
          border-top: 1px solid rgba(148, 163, 184, 0.12);
        }

        .match-link {
          color: #93c5fd;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        @media (min-width: 1100px) {
          .matches-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .match-body {
            grid-template-columns: 1fr;
          }

          .match-center {
            order: 2;
          }

          .team-panel {
            order: unset;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
