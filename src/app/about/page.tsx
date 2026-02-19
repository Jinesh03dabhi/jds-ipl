import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | JD’s IPL",
  description:
    "Learn about JD’s IPL – an independent IPL analytics platform providing player stats, auction data, match insights and performance analysis.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <h1 style={{ marginBottom: "20px" }}>About JD’s IPL</h1>

      <p>
        JD’s IPL is an independent cricket analytics platform focused on
        delivering in-depth IPL statistics, player performance insights,
        auction history data, match analysis and predictive insights.
      </p>

      <h3 style={{ marginTop: "30px" }}>Our Mission</h3>
      <p>
        Our mission is to provide cricket fans with structured, data-driven
        insights about the Indian Premier League. We aim to simplify complex
        statistics and present them in an engaging and accessible format.
      </p>

      <h3 style={{ marginTop: "30px" }}>What We Provide</h3>
      <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
        <li>Player performance analytics</li>
        <li>IPL auction history & sold prices</li>
        <li>Live match score tracking</li>
        <li>Team standings & rankings</li>
        <li>Orange Cap & Purple Cap leaderboards</li>
        <li>Match predictions & performance comparison</li>
      </ul>

      <h3 style={{ marginTop: "30px" }}>Independence Notice</h3>
      <p>
        JD’s IPL is not affiliated with the official IPL governing body or
        any franchise team. All team names and trademarks belong to their
        respective owners.
      </p>

      <h3 style={{ marginTop: "30px" }}>Founder</h3>
      <p>
        Founded and developed by Jinesh Dabhi, JD’s IPL was created with the
        goal of building a modern IPL analytics ecosystem for cricket fans.
      </p>
    </div>
  );
}
