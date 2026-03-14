'use client';

import { useEffect, useMemo, useState } from "react";
import { PLAYERS, TEAMS } from "@/lib/data";
import { TrendingUp, Users, Gavel, Award, ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PlayerAvatar from "@/components/PlayerAvatar";
import LiveScoreClient from "./live-score/LiveScoreClient";

const baseUrl = "https://jds-ipl.vercel.app";

export default function HomeClient() {
  type LiveScoreMatch = {
    name?: string;
    dateTimeGMT?: string;
    venue?: string;
  };

  type LiveScoreResponse = {
    type?: string;
    match?: LiveScoreMatch;
    scorecard?: unknown;
    message?: string;
    lastUpdated?: number;
  };

  const [eventData, setEventData] = useState<LiveScoreResponse | null>(null);

  const featuredPlayers = PLAYERS.slice(0, 6);

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find((t) => t.name === teamName)?.logoUrl || "/team-placeholder.png";
  };

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await fetch("/api/live-score");
        const json = await res.json();
        setEventData(json);
      } catch (err) {
        setEventData(null);
      }
    };

    loadEvent();
  }, []);

  const structuredData = useMemo(() => {
    const sportsEvent = eventData?.match
      ? {
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: eventData.match?.name || "IPL 2026 Match",
          sport: "Cricket",
          startDate: eventData.match?.dateTimeGMT || new Date().toISOString(),
          location: {
            "@type": "Place",
            name: eventData.match?.venue || "India",
          },
          organizer: {
            "@type": "Organization",
            name: "BCCI",
          },
        }
      : null;

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is IPL 2026 analytics?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "IPL 2026 analytics covers live scores, auction prices, player stats, and team standings to help fans track every match in real time.",
          },
        },
        {
          "@type": "Question",
          name: "Who won the latest IPL season?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Royal Challengers Bengaluru won the IPL 2025 title, with updated winners and results tracked on IPL Scorebook.",
          },
        },
        {
          "@type": "Question",
          name: "Does IPL Scorebook provide live scores?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, IPL Scorebook provides live match scorecards and ball by ball updates throughout the IPL 2026 season.",
          },
        },
      ],
    };

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "IPL Scorebook",
      url: baseUrl,
      logo: `${baseUrl}/jds-ipl-logo-1.png`,
      sameAs: [],
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/players?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };

    return [orgSchema, websiteSchema, faqSchema, sportsEvent].filter(Boolean);
  }, [eventData]);

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <LiveScoreClient showHeading={false} />
      <div className="container" style={{ minHeight: "100vh", paddingBottom: "80px" }}>
        <section
          className="hero-bg"
          style={{
            textAlign: "center",
            padding: "80px 16px 60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(2,6,23,0.7) 0%, rgba(2, 2, 28, 0.9) 300%)",
              zIndex: 0,
            }}
          />

          <div className="fade-in" style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(37, 99, 235, 0.2)",
                padding: "8px 16px",
                borderRadius: "100px",
                color: "#60a5fa",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "24px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              IPL 2026 Analytics Now Live
            </div>

            <div>
              <h1 className="page-headline">IPL 2026 Analytics for Serious Fans</h1>

              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "clamp(16px, 2vw, 20px)",
                  maxWidth: "700px",
                  margin: "0 auto 40px",
                  lineHeight: 1.6,
                }}
              >
                IPL 2026 analytics on IPL Scorebook combines live scores, auction prices, player stats and team standings to help you track every match and season trend. Check now.
              </p>
            </div>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/players" className="btn-primary hover-scale" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                Browse IPL player stats <ArrowUpRight size={20} />
              </Link>

              <Link href="/auction" className="glass-card hover-scale" style={{ padding: "12px 24px", color: "#fff", textDecoration: "none" }}>
                IPL 2026 auction insights
              </Link>
            </div>
          </div>
        </section>

        <section
          className="grid fade-in"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            marginTop: "40px",
            marginBottom: "40px",
            gap: "24px",
          }}
        >
          <div className="info-card hover-scale" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "24px" }}>
            <div style={{ background: "rgba(37,99,235,0.2)", padding: "16px", borderRadius: "12px" }}>
              <Users size={32} color="var(--primary)" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Total Players</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>{PLAYERS.length}+</div>
            </div>
          </div>

          <div className="info-card hover-scale" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "24px" }}>
            <div style={{ background: "rgba(234,179,8,0.2)", padding: "16px", borderRadius: "12px" }}>
              <Gavel size={32} color="var(--secondary)" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Auction Records</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>18 Seasons</div>
            </div>
          </div>

          <div className="info-card hover-scale" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "24px" }}>
            <div style={{ background: "rgba(34,197,94,0.2)", padding: "16px", borderRadius: "12px" }}>
              <TrendingUp size={32} color="#22c55e" />
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Accuracy Rate</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>92.4%</div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: "60px" }}>
          <h2 className="section-title">Featured IPL Analytics Insights</h2>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {featuredPlayers.map((player) => (
              <div key={player.id} className="info-card hover-scale" style={{ padding: "24px" }}>
                <Link href={`/players/${player.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <PlayerAvatar
                      name={player.name}
                      src={player.avatarUrl}
                      size={80}
                      alt={`${player.name} IPL player avatar`}
                    />
                    <span
                      style={{
                        color: "var(--secondary)",
                        fontWeight: 800,
                        background: "rgba(234,179,8,0.1)",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "14px",
                      }}
                    >
                      Rs {player.soldPrice}
                    </span>
                  </div>

                  <h3 style={{ marginTop: "16px", fontSize: "20px" }}>{player.name}</h3>
                  <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>{player.role} cricket role</div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "20px",
                      padding: "8px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "8px",
                    }}
                  >
                    <Image
                      src={getTeamLogo(player.currentTeam)}
                      alt={`${player.currentTeam} IPL team logo`}
                      width={24}
                      height={24}
                      style={{ objectFit: "contain" }}
                    />
                    <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "14px" }}>{player.currentTeam}</span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
                      gap: "10px",
                      fontSize: "12px",
                    }}
                  >
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

          <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
            <Link
              href="/players"
              className="btn-primary hover-scale"
              style={{ width: "220px", padding: "16px", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", fontSize: "16px" }}
            >
              <span>View all IPL players</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        <section style={{ marginTop: "80px" }}>
          <h2 className="section-title">IPL Data Insights and Research</h2>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
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
              <h3 style={{ fontSize: "20px" }}>Why IPL Scorebook Stands Out</h3>
              <ul style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.8", listStyle: "none", padding: 0 }}>
                <li>Record auction transfer breakdowns</li>
                <li>Analysis of top wicket takers and run scorers</li>
                <li>Comparisons of team spending patterns</li>
              </ul>
            </div>

            <div className="info-card hover-scale" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "rgba(34,197,94,0.1)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight color="#22c55e" size={24} />
              </div>
              <h3 style={{ fontSize: "20px" }}>Featured IPL Research</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <Link href="/top-10-expensive-ipl-players" style={{ color: "var(--primary)", textDecoration: "none" }}>Top 10 most expensive IPL players</Link>
                <Link href="/best-ipl-bowlers" style={{ color: "var(--primary)", textDecoration: "none" }}>Best IPL bowlers of all time</Link>
                <Link href="/ipl-auction-strategy" style={{ color: "var(--primary)", textDecoration: "none" }}>IPL auction strategy explained</Link>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: "80px", maxWidth: "800px", margin: "80px auto 0" }}>
          <h2 className="section-title">IPL 2026 Analytics FAQ</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, padding: "20px", borderRadius: "12px" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "#fff" }}>What is IPL 2026 analytics?</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                IPL 2026 analytics combines live scores, auction prices, player stats and team standings into one place for fans and analysts.
              </p>
            </div>

            <div className="highlight-box hover-scale" style={{ margin: 0, padding: "20px", borderRadius: "12px", borderLeftColor: "var(--secondary)", background: "rgba(234,179,8,0.05)" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "#fff" }}>Who won the latest IPL season?</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                Royal Challengers Bengaluru won IPL 2025, and the winners list is updated after every season.
              </p>
            </div>

            <div className="highlight-box hover-scale" style={{ margin: 0, padding: "20px", borderRadius: "12px", borderLeftColor: "#22c55e", background: "rgba(34,197,94,0.05)" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "#fff" }}>Does IPL Scorebook offer real-time scores?</h3>
              <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                Yes, the live score section provides ball by ball updates and detailed scorecards for IPL 2026 matches.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", padding: "6px", borderRadius: "8px", textAlign: "center" }}>
      <div style={{ color: "#64748b" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}
