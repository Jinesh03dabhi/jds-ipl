"use client";

import { useEffect, useState } from "react";
import MatchHeader from "@/components/MatchHeader";
import BattingTable from "@/components/BattingTable";
import BowlingTable from "@/components/BowlingTable";
import MatchProgressBar from "@/components/MatchProgressBar";
import CommentaryPanel from "@/components/CommentaryPanel";
import LiveEventsPanel from "@/components/LiveEventsPanel";
import BallHistory from "@/components/BallHistory";
import WinProbability from "@/components/WinProbability";
import MatchTimeline from "@/components/MatchTimeline";

function Skeleton() {
  return (
    <div className="container" style={{ marginTop: 80, marginBottom: 30 }}>
      <div className="glass-card">
        <div style={{ height: 20, background: "#1e293b", marginBottom: 10 }} />
        <div style={{ height: 20, background: "#1e293b", marginBottom: 10 }} />
        <div style={{ height: 20, background: "#1e293b" }} />
      </div>
    </div>
  );
}

function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(date) - new Date();

      if (diff <= 0) {
        setTimeLeft("Starting soon");
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return <p style={{ fontSize: 18, marginTop: 10 }}>⏳ {timeLeft}</p>;
}

export default function LiveScorePage() {
  const [data, setData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [prevScore, setPrevScore] = useState(null);
  const [events, setEvents] = useState([]);
  const [balls, setBalls] = useState([]);

  const fetchScore = async () => {
    try {
      const res = await fetch("/api/live-score");
      const json = await res.json();
      setData(json);
    } catch {
      setData({ type: "error" });
    }
  };

  // ⭐ Smart polling
 useEffect(() => {

  fetchScore();

  let intervalTime = 1800000;

  if (data?.type === "live") intervalTime = 60000;
  else if (data?.type === "upcoming") intervalTime = 300000;

  const interval = setInterval(() => {
    if (document.visibilityState === "visible") {
      fetchScore();
    }
  }, intervalTime);

  return () => clearInterval(interval);

}, [data?.type, retryCount]);


  // ⭐ Score diff logic
useEffect(() => {
  // 🚨 Only run for LIVE match
  if (!data || data.type !== "live" || !data.match?.status) return;

  const extractScore = status => {
    if (!status) return null;
    const match = status.match(/(\d+)\/(\d+)/);
    if (!match) return null;
    return {
      runs: Number(match[1]),
      wickets: Number(match[2])
    };
  };

  const oldScore = extractScore(prevScore);
  const newScore = extractScore(data.match.status);

  if (oldScore && newScore && prevScore !== data.match.status) {

    if (newScore.wickets > oldScore.wickets) {
      setEvents(prev => [{ text: "WICKET!" }, ...prev].slice(0, 10));
      setBalls(prev => [...prev, "W"].slice(-6));
    } else {
      const diff = newScore.runs - oldScore.runs;

      if (diff > 0) {
        setEvents(prev => [{ text: `${diff} runs` }, ...prev].slice(0, 10));
        setBalls(prev => [...prev, diff.toString()].slice(-6));
      }
    }
  }

  setPrevScore(data.match.status);

}, [data]);

  // ⭐ Loading
  if (!data) return <Skeleton />;

  // ⭐ Error
  if (data.type === "error") {
    return (
      <div className="container" style={{ marginTop: 80,marginBottom: 30 }}>
        <div className="glass-card" style={{ textAlign: "center" }}>
          <h3>Service unavailable</h3>
          <button
            className="btn"
            onClick={() => setRetryCount(prev => prev + 1)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ⭐ Waiting
  if (data.type === "waiting") {
    return (
      <div className="container" style={{ marginTop: 80 ,marginBottom: 30}}>
        <div className="glass-card" style={{ textAlign: "center" }}>
          <h2>🏏 Waiting for IPL Season</h2>
          <p>Live scores will appear here once IPL begins</p>
        </div>
      </div>
    );
  }

  if (data.type === "last") {
  return (
    <div className="container" style={{ marginTop: 80,marginBottom: 30 }}>
      <div className="glass-card" style={{ textAlign: "center" }}>
        <h2>Last IPL Match</h2>
        <h3>{data.match?.name}</h3>
        <p>{data.match?.status}</p>
      </div>
    </div>
  );
}

  // ⭐ Upcoming
  if (data.type === "upcoming") {
    return (
      <div className="container" style={{ marginTop: 80,marginBottom: 30 }}>
        <div className="glass-card" style={{ textAlign: "center" }}>
          <h2>Next IPL Match</h2>
          <h3>{data.match?.name}</h3>
          <Countdown date={data.match?.dateTimeGMT} />
          <p style={{ marginTop: 10 }}>
            {new Date(data.match?.dateTimeGMT).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }


  // ⭐ LIVE UI
  const rawInnings = data?.scorecard?.scorecard || [];

  const inningsList = rawInnings.map((inning, index) => ({
    title: `${index + 1}${index === 0 ? "st" : index === 1 ? "nd" : "th"} Innings`,
    batting: inning?.batting || [],
    bowling: inning?.bowling || []
  }));

  return (
  <>
    {/* ✅ SEO META */}
    <head>
      <title>
        {data.match?.name} Live Score | IPL Live
      </title>

      <meta
        name="description"
        content={`${data.match?.name} live score, commentary, scorecard and match updates.`}
      />

      <link rel="canonical" href="https://yourdomain.com/live-score" />

      {/* OpenGraph */}
      <meta property="og:title" content={`${data.match?.name} Live Score`} />
      <meta property="og:description" content="Live IPL match score and updates" />
      <meta property="og:type" content="website" />
    </head>

    {/* ✅ STRUCTURED DATA */}
    {data?.match && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: data.match.name,
            description: `${data.match.name} live cricket score`,
            startDate: data.match.dateTimeGMT,
            eventStatus:
              data.type === "live"
                ? "https://schema.org/EventInProgress"
                : "https://schema.org/EventScheduled",
            sport: "Cricket",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: data.match.venue || "IPL Stadium"
            },
            organizer: {
              "@type": "SportsOrganization",
              name: "Indian Premier League"
            },
            competitor: data.match.teams?.map(team => ({
              "@type": "SportsTeam",
              name: team
            }))
          })
        }}
      />
    )}

    <div className="container" style={{ marginTop: 80,marginBottom: 30}}>
      <MatchHeader match={data.match} />

      {data?.lastUpdated && (
        <div className="glass-card" style={{ textAlign: "center", fontSize: 12 }}>
          Last updated {Math.floor((Date.now() - data.lastUpdated) / 1000)}s ago
        </div>
      )}

      <MatchProgressBar />
      <MatchTimeline status={data.match.status} />
      <WinProbability status={data.match.status} />
      <BallHistory balls={balls} />

      <div className="tables-section">
        {inningsList.map((innings, index) => (
          <div key={index} className="innings-block">
            <BattingTable innings={innings} />
            <BowlingTable innings={innings} />
          </div>
        ))}
      </div>

      <LiveEventsPanel inningsList={inningsList} />
      <CommentaryPanel inningsList={inningsList} />
    </div>
  </>
);
}