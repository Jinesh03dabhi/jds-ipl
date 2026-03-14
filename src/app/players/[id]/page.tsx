import type { Metadata } from "next";
import { PLAYERS, TEAMS } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PlayerAvatar from "@/components/PlayerAvatar";
import { notFound } from "next/navigation";
import Image from "next/image";

const baseUrl = "https://jds-ipl.vercel.app";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const player = PLAYERS.find((p) => p.id === id);

  if (!player) {
    return {
      title: "Player Not Found | IPL Scorebook",
    };
  }

  const title = `${player.name} IPL Stats & Price | IPL Scorebook`;
  const description = `View ${player.name} IPL player profile with stats, role, team and auction sold price in IPL Scorebook. Track performance highlights and updates. Check now.`;

  return {
    title,
    description,
    keywords: [
      `${player.name} IPL stats`,
      "ipl player profile",
      "ipl auction price",
      "ipl career record",
      "ipl player analytics",
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/players/${player.id}`,
      type: "article",
      siteName: "IPL Scorebook",
      locale: "en_IN",
      images: [
        {
          url: `${baseUrl}/players/${player.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${player.name} IPL player profile`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [`${baseUrl}/players/${player.id}/opengraph-image`],
    },
    alternates: {
      canonical: `${baseUrl}/players/${player.id}`,
      languages: {
        en: `${baseUrl}/players/${player.id}`,
      },
    },
  };
}

export default async function PlayerProfile({ params }: Props) {
  const { id } = await params;
  const player = PLAYERS.find((p) => p.id === id);

  if (!player) return notFound();

  const getTeamLogo = (teamName: string) => {
    return TEAMS.find((t) => t.name === teamName)?.logoUrl || "/team-placeholder.png";
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    nationality: player.nationality,
    jobTitle: "Professional Cricketer",
    knowsAbout: ["Cricket", "IPL", player.role],
    memberOf: {
      "@type": "SportsTeam",
      name: player.currentTeam,
      sport: "Cricket",
      memberOf: {
        "@type": "SportsOrganization",
        name: "IPL",
      },
    },
    description: `${player.name} is an IPL player for ${player.currentTeam} known for ${player.role.toLowerCase()} performances.`,
    url: `${baseUrl}/players/${player.id}`,
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
        name: "Players",
        item: `${baseUrl}/players`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: player.name,
        item: `${baseUrl}/players/${player.id}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${player.name}'s IPL sold price?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Rs ${player.soldPrice}`,
        },
      },
      {
        "@type": "Question",
        name: `Which team does ${player.name} play for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: player.currentTeam,
        },
      },
    ],
  };

  const structuredData = [personSchema, breadcrumbSchema, faqSchema];

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Link href="/players" className="btn-primary profile-back-btn">
        <ArrowLeft size={24} />
        <span>Back to players directory</span>
      </Link>

      <div className="profile-layout">
        <div>
          <header className="profile-header">
            <PlayerAvatar
              name={player.name}
              src={player.avatarUrl}
              size={160}
              alt={`${player.name} IPL player portrait`}
              priority
              fetchPriority="high"
            />

            <div className="profile-header-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{player.name} IPL Player Profile</h1>
                <span className="profile-nationality">({player.nationality})</span>
              </div>

              <p style={{ color: "#94a3b8", marginTop: "8px" }}>
                {player.name} IPL player profile highlights current team, role, and auction value for IPL 2026 analytics. Check now.
              </p>

              <h3 className="profile-role">{player.role} role</h3>

              <div className="profile-team">
                <Link href="/teams" style={{ textDecoration: "none", color: "inherit" }}>
                  <Image
                    src={getTeamLogo(player.currentTeam)}
                    alt={`${player.currentTeam} IPL team logo`}
                    width={40}
                    height={40}
                    className="profile-team-logo"
                  />
                </Link>
                <span>{player.currentTeam}</span>
              </div>
            </div>
          </header>

          <h2 style={{ marginBottom: "20px" }}>IPL Career Stats and Highlights</h2>

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
            <div className="market-value">Rs {player.soldPrice}</div>
          </div>
        </div>
      </div>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>More IPL 2026 Resources</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/players" className="btn-primary">IPL player stats directory</Link>
          <Link href="/teams" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL teams and squads
          </Link>
          <Link href="/auction" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL 2026 auction results
          </Link>
        </div>
      </section>
    </div>
  );
}
