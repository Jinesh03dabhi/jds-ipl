import type { Metadata } from "next";
import { PLAYERS, TEAMS } from "@/lib/data";
import { notFound } from "next/navigation";
import PlayerAvatar from "@/components/PlayerAvatar";
import Link from "next/link";
import Image from "next/image";
import { Award, MapPin, Users, TrendingUp, Gavel, ArrowLeft } from "lucide-react";

const baseUrl = "https://jds-ipl.vercel.app";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const team = TEAMS.find((t) => t.id === id);

  if (!team) {
    return { title: "Team Not Found | IPL Scorebook" };
  }

  const title = `${team.name} Squad & Stats | IPL Scorebook`;
  const description = `Explore ${team.name} IPL squad, player list, auction spending, ranking history and title wins for IPL 2026 insights. Check now.`;

  return {
    title,
    description,
    keywords: [
      `${team.name} IPL team`,
      "ipl team squad",
      "ipl team stats",
      "ipl auction spending",
      "ipl team profile",
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/teams/${team.id}`,
      type: "website",
      siteName: "IPL Scorebook",
      locale: "en_IN",
      images: [
        {
          url: `${baseUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${team.name} IPL team preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/opengraph-image`],
    },
    alternates: {
      canonical: `${baseUrl}/teams/${team.id}`,
      languages: {
        en: `${baseUrl}/teams/${team.id}`,
      },
    },
  };
}

export default async function TeamDetail({ params }: Props) {
  const { id } = await params;
  const team = TEAMS.find((t) => t.id === id);
  if (!team) return notFound();

  const teamPlayers = PLAYERS.filter((p) => p.currentTeam === team.name);

  const parsePrice = (price: string) => parseFloat(price.replace(" Cr", "") || "0");

  const totalSpend = teamPlayers.reduce((acc, p) => acc + parsePrice(p.soldPrice), 0);

  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    sport: "Cricket",
    url: `${baseUrl}/teams/${team.id}`,
    memberOf: {
      "@type": "SportsOrganization",
      name: "IPL",
    },
    member: teamPlayers.map((player) => ({
      "@type": "Person",
      name: player.name,
      url: `${baseUrl}/players/${player.id}`,
    })),
    description: `${team.name} IPL team profile with squad, titles and home venue for IPL 2026 analytics.`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Teams",
        item: `${baseUrl}/ipl-teams`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: team.name,
        item: `${baseUrl}/teams/${team.id}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many IPL titles has ${team.name} won?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${team.name} has won ${team.titles.length} IPL titles.`,
        },
      },
      {
        "@type": "Question",
        name: `Where is ${team.name} based?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: team.venue,
        },
      },
    ],
  };

  const structuredData = [teamSchema, breadcrumbSchema, faqSchema];

  return (
    <div className="container team-detail-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Link href="/ipl-teams" className="btn btn-primary team-back-btn">
        <ArrowLeft size={16} /> Back to IPL teams
      </Link>

      <div className="glass-card team-header-card" style={{ borderLeft: `8px solid ${team.color}` }}>
        <div className="team-header-top">
          <div className="team-logo-box-lg" style={{ position: "relative", width: "100px", height: "100px" }}>
            <Image
              src={team.logoUrl || "/team-placeholder.png"}
              alt={`${team.name} IPL team logo`}
              fill
              sizes="100px"
              style={{ objectFit: "contain" }}
              priority
              fetchPriority="high"
            />
          </div>

          <div className="team-header-info">
            <h1 className="team-detail-title">{team.name} IPL Team Profile</h1>
            <p style={{ color: "#94a3b8", marginTop: "6px" }}>
              {team.name} IPL team profile covers squad depth, auction spending and ranking history for IPL 2026. Check now.
            </p>

            <div className="team-meta-row">
              <div>
                <Users size={18} color={team.color} /> {team.owner}
              </div>
              <div>
                <MapPin size={18} color={team.color} /> {team.venue}
              </div>
            </div>
          </div>

          <div className="team-rank-box">
            <div>2025 RANK</div>
            <div className="team-rank-number">#{team.lastYearRank}</div>
          </div>
        </div>

        <div className="team-titles">
          {team.titles.length > 0 ? (
            team.titles.map((year) => (
              <div key={year} className="team-title-badge">
                <Award size={14} /> {year} Champion
              </div>
            ))
          ) : (
            <span className="no-titles">No titles yet</span>
          )}
        </div>
      </div>

      <div className="team-detail-layout">
        <section>
          <h2 className="section-title">Team Roster and IPL Squad ({teamPlayers.length})</h2>

          <div className="roster-list">
            {teamPlayers.map((player) => (
              <Link href={`/players/${player.id}`} key={player.id} className="glass-card roster-row">
                <PlayerAvatar
                  name={player.name}
                  src={player.avatarUrl}
                  size={60}
                  alt={`${player.name} IPL player avatar`}
                />

                <div className="roster-info">
                  <div className="roster-name">{player.name}</div>
                  <div className="roster-sub">
                    {player.role} - {player.nationality}
                  </div>
                </div>

                <div className="roster-price">
                  <div className="price-value">{player.soldPrice}</div>
                  <div className="price-label">SOLD PRICE</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div>
          <h2 className="section-title">IPL Performance History</h2>

          <div className="glass-card history-card">
            <h3 className="sub-heading">
              <TrendingUp size={18} /> Ranking Trend
            </h3>

            {team.historyRankings.map((item) => (
              <div key={item.year} className="history-row">
                <span>{item.year}</span>
                <span>#{item.rank}</span>
              </div>
            ))}
          </div>

          <div className="glass-card auction-card">
            <h3 className="sub-heading">
              <Gavel size={18} /> Auction Stats
            </h3>

            <div className="auction-total">{totalSpend.toFixed(2)} Cr</div>
            <div className="auction-label">Total Squad Spend</div>
          </div>
        </div>
      </div>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>Explore More IPL 2026 Pages</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href={`/teams/${team.id}/stats`} className="btn-primary">View Full Stats</Link>
          <Link href={`/teams/${team.id}/squad`} className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>Team Squad & XI</Link>
          <Link href="/ipl-teams" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>All IPL teams</Link>
          <Link href="/players" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL player stats directory
          </Link>
          <Link href="/auction" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL 2026 auction results
          </Link>
        </div>
      </section>
    </div>
  );
}
