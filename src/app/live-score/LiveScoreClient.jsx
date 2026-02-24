"use client";

import LiveScoreHeader from "@/components/LiveScoreHeader";
import { useState,useEffect } from "react";
import LiveBattingSection from "@/components/LiveBattingSection";
import LiveBowlingSection from "@/components/LiveBowlingSection";
import MatchSituation from "@/components/MatchSituation";
import { getMatchState } from "@/utils/getMatchState";

export default function LiveScorePage() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchScore();
    const interval = setInterval(fetchScore, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchScore() {
    const res = await fetch("/api/live-score");
    const json = await res.json();
    setData(json);
  }

  if (!data) return <div>Loading...</div>;
  const matchState = getMatchState(data);
return (
  <div style={{ marginTop: "50px" }} className="container page-content">

    <div style={{ marginBottom: "10px" }}>
      <LiveScoreHeader data={data} />
    </div>

    {/* ⭐ UPCOMING */}
    {matchState === "upcoming" && (
      <div className="glass-card">
        Match starts soon
      </div>
    )}

    {/* ⭐ WAITING */}
    {matchState === "waiting" && (
      <div className="glass-card">
        Waiting for season 🏏
      </div>
    )}

    {/* ⭐ COMPLETED */}
    {matchState === "completed" && (
      <>
        <MatchSituation data={data} />
        <LiveBattingSection data={data} />
        <LiveBowlingSection data={data} />
      </>
    )}

    {/* ⭐ LIVE */}
    {matchState === "live" && (
      <>
        <MatchSituation data={data} />

        <LiveBattingSection data={data} />

        <LiveBowlingSection data={data} />
      </>
    )}

  </div>
);
}