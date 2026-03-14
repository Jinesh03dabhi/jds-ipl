import type { Metadata } from "next";
import { Info, Target, List, Shield, User } from "lucide-react";
import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "About IPL Scorebook Platform | IPL Scorebook",
  description:
    "Learn about IPL Scorebook, an independent IPL analytics platform for player stats, auction data, live scores and team insights. Check now.",
  keywords: [
    "about ipl scorebook",
    "ipl analytics platform",
    "ipl stats site",
    "ipl auction data",
    "ipl live scores",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/about`,
    languages: {
      en: `${baseUrl}/about`,
    },
  },
  openGraph: {
    title: "About IPL Scorebook Platform | IPL Scorebook",
    description:
      "Learn about IPL Scorebook, an independent IPL analytics platform for player stats, auction data, live scores and team insights. Check now.",
    url: `${baseUrl}/about`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "About IPL Scorebook preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About IPL Scorebook Platform | IPL Scorebook",
    description:
      "Learn about IPL Scorebook, an independent IPL analytics platform for player stats, auction data, live scores and team insights. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function AboutPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About IPL Scorebook",
      url: `${baseUrl}/about`,
      description:
        "IPL Scorebook is an independent analytics platform for IPL live scores, auction prices and player statistics.",
      about: {
        "@type": "Organization",
        name: "IPL Scorebook",
        url: baseUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "IPL Scorebook",
      url: baseUrl,
      logo: `${baseUrl}/jds-ipl-logo-1.png`,
    },
  ];

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">About IPL Scorebook</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          IPL Scorebook is an independent IPL analytics platform delivering player stats, auction history, live scores and match insights for every season. Check now.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>
          <div className="info-card hover-scale">
            <h2 className="section-title" style={{ marginBottom: "16px" }}>
              <Target className="callout-icon" /> Our Mission for IPL Analytics
            </h2>
            <p>
              Our mission is to provide cricket fans with structured, data-driven IPL insights. We simplify complex statistics and present them in an engaging format.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title" style={{ marginBottom: "16px" }}>
              <List className="callout-icon" /> What IPL Scorebook Provides
            </h2>
            <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              <li style={{ color: "#fff" }}>Player performance analytics</li>
              <li style={{ color: "#fff" }}>IPL auction history and sold prices</li>
              <li style={{ color: "#fff" }}>Live match score tracking</li>
              <li style={{ color: "#fff" }}>Team standings and rankings</li>
              <li style={{ color: "#fff" }}>Orange and Purple Cap leaders</li>
              <li style={{ color: "#fff" }}>Match predictions and polling</li>
            </ul>
          </div>

          <div className="callout-panel hover-scale">
            <Shield className="callout-icon" size={32} />
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Independence Notice</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                IPL Scorebook is not affiliated with the official IPL governing body or any franchise team. All team names and trademarks belong to their respective owners.
              </p>
            </div>
          </div>

          <div className="info-card hover-scale" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ background: "rgba(37, 99, 235, 0.2)", padding: "16px", borderRadius: "50%" }}>
              <User size={32} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Founder - Jinesh Dabhi</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                IPL Scorebook was created to build a modern IPL analytics ecosystem for cricket fans worldwide.
              </p>
            </div>
          </div>
        </div>

        <section style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "22px" }}>Explore More IPL Scorebook Pages</h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">Contact IPL Scorebook</Link>
            <Link href="/privacy-policy" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              Privacy policy
            </Link>
            <Link href="/teams" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              IPL teams and squads
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
