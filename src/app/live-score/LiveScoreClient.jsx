"use client";
import { useEffect, useState } from "react";
import MatchHeader from "@/components/MatchHeader";
import BattingTable from "@/components/BattingTable";
import BowlingTable from "@/components/BowlingTable";
import MatchProgressBar from "@/components/MatchProgressBar";
import CommentaryPanel from "@/components/CommentaryPanel";
import LiveEventsPanel from "@/components/LiveEventsPanel";
import BallHistory from "@/components/BallHistory"



function generateEvent(oldStatus, newStatus) {

  const oldScore = extractScore(oldStatus);
  const newScore = extractScore(newStatus);

  if (!oldScore || !newScore) return null;

  if (newScore.wickets > oldScore.wickets) {
    return { type: "wicket", player: "", text: "WICKET!" };
  }

  const diff = newScore.runs - oldScore.runs;

  if (diff === 6) return { type: "6", player: "", text: "SIX!" };
  if (diff === 4) return { type: "4", player: "", text: "FOUR!" };
  if (diff === 1) return { type: "dot", player: "", text: "Single run" };
  if (diff === 0) return { type: "dot", player: "", text: "Dot ball" };

  return { type: "dot", player: "", text: "Runs scored" };
}


function generateBall(oldStatus, newStatus) {

  const oldScore = extractScore(oldStatus);
  const newScore = extractScore(newStatus);

  if (!oldScore || !newScore) return ".";

  if (newScore.wickets > oldScore.wickets) return "W";

  const diff = newScore.runs - oldScore.runs;

  if (diff === 6) return "6";
  if (diff === 4) return "4";
  if (diff === 1) return "1";
  if (diff === 2) return "2";
  if (diff === 3) return "3";

  return ".";
}

function extractScore(status) {
  if (!status) return null;

  const match = status.match(/(\d+)\/(\d+)/);
  if (!match) return null;

  return {
    runs: parseInt(match[1]),
    wickets: parseInt(match[2])
  };
}


export default function LiveScorePage() {
  const [data, setData] = useState(null);
  const [prevScore, setPrevScore] = useState(null);
  const [events, setEvents] = useState([]);
  const [balls, setBalls] = useState([]);


  const fetchScore = async () => {
    const res = await fetch("/api/live-score");
    const json = await res.json();
    setData(json);
  };

 useEffect(() => {

  fetchScore();

  const interval = setInterval(() => {
    if (document.visibilityState === "visible") {
      fetchScore();
    }
  }, 120000); // 2 minutes

  return () => clearInterval(interval);

}, []);

  useEffect(() => {
  if (!data?.match?.status) return;

  const currentScore = data.match.status;

  if (prevScore && prevScore !== currentScore) {

    const newEvent = generateEvent(prevScore, currentScore);
    const newBall = generateBall(prevScore, currentScore);

    setEvents(prev => [newEvent, ...prev].slice(0, 10));

    setBalls(prev => {
      const updated = [...prev, newBall];
      return updated.slice(-6);
    });

  }

  setPrevScore(currentScore);

}, [data]);


  if (!data) {
  return (
    <div className="container" style={{ marginTop: 120,marginBottom: 120  }}>
      <div className="glass-card" style={{backgroundColor:"#b60c0c"}}>Loading score…</div>
    </div>
  );
}

if (data.type === "error") {
  return (
    <div className="container" style={{ marginTop: 120,marginBottom: 120  }}>
      <div className="glass-card" style={{backgroundColor:"#b60c0c"}}>API error or rate limit</div>
    </div>
  );
}

if (!data?.match) {
  return (
    <div className="container" style={{ marginTop: 120,marginBottom: 120 }}>
      <div className="glass-card" style={{backgroundColor:"#b60c0c"}}>
        <h3>No live feed detected</h3>
        <p style={{ color: "#94a3b8" }}>
          Showing last known data or waiting for match to start…
        </p>
      </div>
    </div>
  );
}


  // ===== BUILD INNINGS OBJECT =====
  const rawInnings = data?.scorecard?.scorecard || [];

const inningsList = rawInnings.map((inning, index) => ({
  title: `${index + 1}${index === 0 ? "st" : index === 1 ? "nd" : "th"} Innings`,
  batting: inning?.batting || [],
  bowling: inning?.bowling || []
}));


  return (
    <div className="container" style={{ marginTop: 120 }}>

      <MatchHeader match={data.match} />
      {data?.lastUpdated && (  <div className="glass-card" style={{  marginTop: 8,  marginBottom: 12,  padding: "6px 12px",  textAlign: "center",  fontSize: 12,  color: "#94a3b8"}}>
        Last updated {Math.floor((Date.now() - data.lastUpdated) / 1000)}s ago
      </div>
      )}
      {data?.lastUpdated && (
  <div style={{ color: "#94a3b8", fontSize: 12 }}>
    Updated {Math.floor((Date.now() - data.lastUpdated) / 1000)}s ago
  </div>
)}

      <MatchProgressBar />
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
  );
}
