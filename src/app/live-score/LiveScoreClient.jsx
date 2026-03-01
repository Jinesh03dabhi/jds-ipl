"use client";

import LiveScoreHeader from "@/components/LiveScoreHeader";
import { useState, useEffect } from "react";
import LiveBattingSection from "@/components/LiveBattingSection";
import LiveBowlingSection from "@/components/LiveBowlingSection";
import MatchSituation from "@/components/MatchSituation";
import { getMatchState } from "@/utils/getMatchState";
import CurrentPlayers from "@/components/CurrentPlayers"

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

  // ✅ Initial fetch
  useEffect(() => {
    fetchScore();
  }, []);

  const matchState = getMatchState(data);

  // ✅ SMART POLLING
  useEffect(() => {

    if (!data) return;

    let intervalTime = 1800000; // default 30 min

    // 🔴 LIVE
    if (matchState === "live") {
      intervalTime = 60000; // 1 min
    }

    // 🔜 UPCOMING (time-based logic)
    if (matchState === "upcoming" && data.match?.dateTimeGMT) {

      const matchStart = new Date(data.match.dateTimeGMT).getTime();
      const now = Date.now();

      const twoHoursBefore = matchStart - (2 * 60 * 60 * 1000);
      const thirtyMinutesBefore = matchStart - (30 * 60 * 1000);

      if (now >= thirtyMinutesBefore) {
        intervalTime = 60000; // 1 min
      }
      else if (now >= twoHoursBefore) {
        intervalTime = 300000; // 5 min
      }
      else {
        intervalTime = 1800000; // 30 min
      }
    }

    // ✅ COMPLETED
    if (matchState === "completed") {
      intervalTime = 900000; // 15 min
    }

    // ❌ ERROR → slow retry
    if (matchState === "error") {
      intervalTime = 900000; // 15 min
    }

    console.log("Polling every:", intervalTime / 1000, "seconds");

    const interval = setInterval(fetchScore, intervalTime);

    return () => clearInterval(interval);

  }, [matchState, data]);

  // ⭐ LOADING
  if (!data || matchState === "loading") {
    return <div className="glass-card">Loading match data…</div>;
  }

  // ⭐ ERROR
  if (matchState === "error") {
    return (
      <div style={{ marginTop: "80px" }} className="glass-card">
        Live updates temporarily unavailable.
      </div>
    );
  }

  return (
    <div style={{ marginTop: "60px" }} className="container page-content">

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
        <div style={{ marginTop: "20px" }} className="glass-card">
          Waiting for T20 World Cup matches 🏏
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

    </div>
  );
}