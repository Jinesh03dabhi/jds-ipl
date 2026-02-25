"use client";

import LiveScoreHeader from "@/components/LiveScoreHeader";
import { useState, useEffect } from "react";
import LiveBattingSection from "@/components/LiveBattingSection";
import LiveBowlingSection from "@/components/LiveBowlingSection";
import MatchSituation from "@/components/MatchSituation";
import { getMatchState } from "@/utils/getMatchState";

export default function LiveScorePage() {

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

// 🧠 Dynamic polling based on state
useEffect(() => {

if (!data) return;

let intervalTime = 60000;

if (matchState === "live") intervalTime = 30000;
if (matchState === "upcoming") intervalTime = 120000;
if (matchState === "waiting") intervalTime = 600000;

const interval = setInterval(fetchScore, intervalTime);

return () => clearInterval(interval);


}, [matchState]);

// ⭐ LOADING
if (matchState === "loading") {
return <div className="glass-card">Loading live match…</div>;
}

// ⭐ ERROR
if (matchState === "error") {
return <div className="glass-card">Service unavailable — retry later</div>;
}

return (
<div style={{ marginTop: "50px" }} className="container page-content">

```
  {/* Header only if match exists */}
  {data?.match && (
    <div style={{ marginBottom: "10px" }}>
      <LiveScoreHeader data={data} />
    </div>
  )}

  {/* UPCOMING */}
  {matchState === "upcoming" && (
    <div className="glass-card">Match starts soon</div>
  )}

  {/* WAITING */}
  {matchState === "waiting" && (
    <div className="glass-card">Waiting for season 🏏</div>
  )}

  {/* LIVE + COMPLETED */}
  {(matchState === "live" || matchState === "completed") && (
    <>
      <MatchSituation data={data} />
      <LiveBattingSection data={data} />
      <LiveBowlingSection data={data} />
    </>
  )}

</div>


);
}
