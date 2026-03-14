import { PLAYERS } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

const baseUrl = "https://jds-ipl.vercel.app";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const player = PLAYERS.find((p) => String(p.id).toLowerCase() === decodedId.toLowerCase());

  if (!player) {
    return {
      title: "Player Widget Not Found | IPL Scorebook",
    };
  }

  const title = `${player.name} IPL Widget | IPL Scorebook`;
  const description = `Embed ${player.name} IPL player stats widget with key career highlights and auction value. Check now.`;

  return {
    title,
    description,
    keywords: [
      "ipl widgets",
      "ipl player widget",
      `${player.name} widget`,
      "ipl stats embed",
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/widgets/player/${player.id}`,
      languages: {
        en: `${baseUrl}/widgets/player/${player.id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/widgets/player/${player.id}`,
      type: "website",
      siteName: "IPL Scorebook",
      locale: "en_IN",
      images: [
        {
          url: `${baseUrl}/players/${player.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${player.name} IPL widget preview`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [`${baseUrl}/players/${player.id}/opengraph-image`],
    },
  };
}

export default async function PlayerWidget({ params }: Props) {
  const { id } = await params;

  const decodedId = decodeURIComponent(id);

  const player = PLAYERS.find(
    (p) => String(p.id).toLowerCase() === decodedId.toLowerCase()
  );

  if (!player) {
    console.log("PLAYER NOT FOUND ->", decodedId);
    return notFound();
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    jobTitle: "Professional Cricketer",
    knowsAbout: ["Cricket", "IPL", player.role],
    url: `${baseUrl}/players/${player.id}`,
  };

  return (
    <div
      style={{
        marginTop: "80px",
        fontFamily: "Inter, sans-serif",
        padding: "20px",
        background: "#0b1220",
        color: "#fff",
        width: "350px",
        borderRadius: "12px",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <h1 style={{ position: "absolute", left: "-10000px", top: "auto" }}>
        IPL player stats widget for {player.name}
      </h1>

      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
        LIVE STATS
      </div>

      <h3 style={{ marginBottom: "4px" }}>{player.name}</h3>

      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}>
        {player.currentTeam}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "8px",
        }}
      >
        <Stat label="MATCHES" value={player.stats?.matches ?? "-"} />
        <Stat label="RUNS" value={player.stats?.runs ?? "-"} />
        <Stat label="WICKETS" value={player.stats?.wickets ?? "-"} />
      </div>

      <div
        style={{
          marginTop: "16px",
          textAlign: "center",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        Powered by IPL Scorebook
      </div>

      <div style={{ marginTop: "12px", fontSize: "12px", textAlign: "center" }}>
        <Link href={`/players/${player.id}`} style={{ color: "#93c5fd", textDecoration: "none" }}>
          View full IPL player profile
        </Link>
        {" "} | {" "}
        <Link href="/players" style={{ color: "#93c5fd", textDecoration: "none" }}>
          IPL player directory
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        padding: "20px",
        background: "#0b1220",
        color: "#fff",
        width: "100%",
        maxWidth: "350px",
        borderRadius: "12px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "10px", color: "#64748b" }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}
