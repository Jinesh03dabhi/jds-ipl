import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | JD’s IPL",
  description:
    "Learn about JD’s IPL – an independent IPL analytics platform providing player stats, auction data, match insights and performance analysis.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/about",
  },
};

import { Info, Target, List, Shield, User } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">About JD’s IPL</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          JD’s IPL is an independent cricket analytics platform focused on
          delivering in-depth IPL statistics, player performance insights,
          auction history data, match analysis and predictive insights.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>

          <div className="info-card hover-scale">
            <h3 className="section-title" style={{ marginBottom: "16px" }}><Target className="callout-icon" /> Our Mission</h3>
            <p>
              Our mission is to provide cricket fans with structured, data-driven
              insights about the Indian Premier League. We aim to simplify complex
              statistics and present them in an engaging and accessible format.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title" style={{ marginBottom: "16px" }}><List className="callout-icon" /> What We Provide</h3>
            <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              <li style={{ color: "#fff" }}>🏏 Player performance analytics</li>
              <li style={{ color: "#fff" }}>💰 IPL auction history & sold prices</li>
              <li style={{ color: "#fff" }}>🔴 Live match score tracking</li>
              <li style={{ color: "#fff" }}>🏆 Team standings & rankings</li>
              <li style={{ color: "#fff" }}>🧢 Orange & Purple Cap leaders</li>
              <li style={{ color: "#fff" }}>🔮 Match predictions</li>
            </ul>
          </div>

          <div className="callout-panel hover-scale">
            <Shield className="callout-icon" size={32} />
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Independence Notice</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                JD’s IPL is not affiliated with the official IPL governing body or
                any franchise team. All team names and trademarks belong to their
                respective owners.
              </p>
            </div>
          </div>

          <div className="info-card hover-scale" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ background: "rgba(37, 99, 235, 0.2)", padding: "16px", borderRadius: "50%" }}>
              <User size={32} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Founder — Jinesh Dabhi</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                JD’s IPL was created with the
                goal of building a modern IPL analytics ecosystem for cricket fans.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
