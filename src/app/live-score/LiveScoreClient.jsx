"use client";

import LiveScoreHeader from "@/components/LiveScoreHeader";
import { useState,useEffect } from "react";
import LiveBattingSection from "@/components/LiveBattingSection";
import LiveBowlingSection from "@/components/LiveBowlingSection";
import MatchSituation from "@/components/MatchSituation";


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

 return (
  <div style={{marginTop:"50px"}} className="container page-content">
    <div style={{marginBottom:"10px"}}>
    <LiveScoreHeader data={data} />
</div>
    

      <div style={{marginBottom:"10px"}}>
        <MatchSituation data={data} />
      </div>
      <div style={{marginBottom:"10px"}}>
        <LiveBattingSection data={data} />
      </div>

 
  <div style={{marginBottom:"10px"}}>
    <LiveBowlingSection data={data} />
  </div>
  </div>
);
}