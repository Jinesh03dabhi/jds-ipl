"use client";

import LiveScoreHeader from "@/components/LiveScoreHeader";
import { useState, useEffect, useMemo } from "react";
import LiveBattingSection from "@/components/LiveBattingSection";
import LiveBowlingSection from "@/components/LiveBowlingSection";
import MatchSituation from "@/components/MatchSituation";
import { getMatchState } from "@/utils/getMatchState";
import CurrentPlayers from "@/components/CurrentPlayers";
import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";

export default function LiveScorePage({ showHeading = true }) {
  const [data, setData] = useState(null);

  async function fetchScore() {
    try {
      const res = await fetch("/api/live-score");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setData({ type: "error" });
    }
  }

  useEffect(() => {
    fetchScore();
  }, []);

  const matchState = getMatchState(data);

  useEffect(() => {
    if (!data) return;

    let intervalTime = 1800000;

    if (matchState === "live") {
      intervalTime = 60000;
    }

    if (matchState === "upcoming" && data.match?.dateTimeGMT) {
      const matchStart = new Date(data.match.dateTimeGMT).getTime();
      const now = Date.now();

      const twoHoursBefore = matchStart - 2 * 60 * 60 * 1000;
      const thirtyMinutesBefore = matchStart - 30 * 60 * 1000;

      if (now >= thirtyMinutesBefore) {
        intervalTime = 60000;
      } else if (now >= twoHoursBefore) {
        intervalTime = 300000;
      } else {
        intervalTime = 1800000;
      }
    }

    if (matchState === "completed") {
      intervalTime = 900000;
    }

    if (matchState === "error") {
      intervalTime = 900000;
    }

    const interval = setInterval(fetchScore, intervalTime);
    return () => clearInterval(interval);
  }, [matchState, data]);

  const structuredData = useMemo(() => {
    if (!data?.match) return null;

    return {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: data.match?.name || "IPL 2026 Live Match",
      sport: "Cricket",
      startDate: data.match?.dateTimeGMT || new Date().toISOString(),
      location: {
        "@type": "Place",
        name: data.match?.venue || "India",
      },
      organizer: {
        "@type": "Organization",
        name: "BCCI",
      },
      eventStatus:
        matchState === "live"
          ? "https://schema.org/EventInProgress"
          : matchState === "completed"
          ? "https://schema.org/EventCompleted"
          : "https://schema.org/EventScheduled",
      url: `${baseUrl}/live-score`,
    };
  }, [data, matchState]);

  if (!data || matchState === "loading") {
    return (
      <div style={{ marginTop: "24px" }} className="container page-content">
        <div className="glass-card" style={{ display: "grid", gap: "18px" }}>
          <div
            style={{
              width: "180px",
              height: "16px",
              borderRadius: "999px",
              background: "rgba(148, 163, 184, 0.18)",
            }}
          />
          <div
            style={{
              width: "100%",
              minHeight: "180px",
              borderRadius: "18px",
              background:
                "linear-gradient(90deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9), rgba(15,23,42,0.9))",
              border: "1px solid rgba(148, 163, 184, 0.14)",
            }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                style={{
                  minHeight: "110px",
                  borderRadius: "16px",
                  background: "rgba(15, 23, 42, 0.72)",
                  border: "1px solid rgba(148, 163, 184, 0.12)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (matchState === "error") {
    return (
      <div style={{ marginTop: "80px" }} className="glass-card">
        Live updates temporarily unavailable.
      </div>
    );
  }

  return (
    <div style={{ marginTop: "60px" }} className="container page-content">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {showHeading && (
        <header style={{ marginBottom: "24px" }}>
          <h1>IPL 2026 Live Score</h1>
          <p style={{ color: "#94a3b8" }}>
            IPL 2026 live score coverage brings ball by ball updates, IPL match today details, and real-time updates for every over. Check now.
          </p>
        </header>
      )}
  
      {data?.match && (
        <div style={{ marginBottom: "10px" }}>
          <LiveScoreHeader data={data} />
        </div>
      )}

      {matchState === "upcoming" && (
        <div style={{ marginTop: "20px" }} className="glass-card">
          Next match starts at{" "}
          {new Date(data.match?.dateTimeGMT).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      )}

      {matchState === "waiting" && (
        <div
          style={{ marginTop: "20px", textAlign: "center", padding: "30px", fontSize: "1.2rem" }}
          className="glass-card"
        >
          Waiting for IPL matches
        </div>
      )}

      {(matchState === "live" || matchState === "completed") && (
        <>
          <MatchSituation data={data} />
          <CurrentPlayers data={data} />
          <LiveBattingSection data={data} />
          <LiveBowlingSection data={data} />
        </>
      )}

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>Related IPL 2026 Pages</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/ipl-live-score-today" className="btn-primary">IPL live score today hub</Link>
          <Link href="/points-table" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            IPL 2026 points table
          </Link>
          <Link href="/predictions" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
            Upcoming match predictions
          </Link>
        </div>
      </section>
    </div>
  );
}
