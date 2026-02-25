"use client";

import OverLine from "./OverLine";
import { getMatchState } from "@/utils/getMatchState";

export default function CurrentPlayers({ data, balls = [] }) {

const matchState = getMatchState(data);

if (matchState !== "live") return null;

const inningsList = data?.scorecard?.scorecard || [];

if (!inningsList.length) {
return ( <div className="glass-card">
Waiting for players data… </div>
);
}

const latestInnings = inningsList[inningsList.length - 1];

const batting = latestInnings?.batting || [];
const bowling = latestInnings?.bowling || [];

const isActive = (text = "") => {
const t = text.toLowerCase();
return t.includes("not out") || t.includes("retired not out");
};

const currentBatsmen = batting.filter(player =>
isActive(player?.["dismissal-text"])
);

const displayBatsmen =
currentBatsmen.length
? currentBatsmen
: [...batting].sort((a, b) => (b?.r ?? 0) - (a?.r ?? 0)).slice(0, 2);

// ⭐ Pick last bowler (most recent)
const currentBowler = bowling.length
? bowling[bowling.length - 1]
: null;

return ( 
<div className="glass-card">


  <h3>Live Players</h3>

  <div className="current-grid">

    {/* Batsmen */}
    <div>

      <h4>Batsmen</h4>

      {displayBatsmen.length ? (
        displayBatsmen.map(player => (
          <div style={{ padding: "10px" }} key={player?.batsman?.id}>

            <span className="live-dot">●</span>

            {player?.batsman?.name || "Unknown"} — {player?.r ?? "-"} ({player?.b ?? "-"})

          </div>
        ))
      ) : (
        <div style={{ opacity: 0.6 }}>No batsmen yet</div>
      )}

    </div>

    {/* Bowler */}
    <div>

      <h4>Current Bowler</h4>

      <div style={{ padding: "10px" }}>
        <span className="live-dot">●</span>
        {currentBowler?.bowler?.name || "-"}
      </div>

      <div className="over-title">This Over</div>

      <OverLine balls={balls || []} />

    </div>

  </div>

</div>


);
}
