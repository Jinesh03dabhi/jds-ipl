"use client";

import LiveBadge from "./LiveBadge";
import { getMatchState } from "@/utils/getMatchState";

export default function LiveScoreHeader({ data }) {

if (!data || !data.match) return null;

const { match, scorecard, message } = data;

const matchState = getMatchState(data);

const team1 = match?.teamInfo?.[0];
const team2 = match?.teamInfo?.[1];

const inningsList = scorecard?.scorecard || [];
const latestInnings =
inningsList.length > 0
? inningsList[inningsList.length - 1]
: null;

const totals = latestInnings?.totals || {};

const runs = totals?.r ?? "-";
const wickets = totals?.w ?? "-";
const overs = totals?.o ?? "-";

const numericOvers =
typeof overs === "number" || !isNaN(Number(overs))
? Number(overs)
: null;

const runRate =
numericOvers && numericOvers > 0
? (runs / numericOvers).toFixed(2)
: "-";

const isLive =
matchState === "live" && inningsList.length > 0;

return ( <div className="glass-card premium-scoreboard">

  {/* TOP ROW */}
  <div className="premium-row">

    {/* TEAM 1 */}
    <div className="premium-team">
      {team1?.img && (
        <img src={team1.img} alt={team1.name} width={40} height={40} />
      )}
      <div>
        <div className="team-name">{team1?.name || "-"}</div>
        <div className="team-abbr">{team1?.shortname || ""}</div>
      </div>
    </div>

    {/* CENTER */}
    <div className="premium-center">
      {isLive && <LiveBadge />}
      <div className="match-status">
        {match?.status || message || "Match update"}
      </div>
    </div>

    {/* TEAM 2 */}
    <div className="premium-team premium-right">
      <div>
        <div className="team-name">{team2?.name || "-"}</div>
        <div className="team-abbr">{team2?.shortname || ""}</div>
      </div>
      {team2?.img && (
        <img src={team2.img} alt={team2.name} width={40} height={40} />
      )}
    </div>

  </div>

  {/* SCORE SECTION */}
  {(matchState === "live" || matchState === "completed") && latestInnings && (
    <div className="score-details">

      <div className="score-box">
        <span className="label">Score</span>
        <span className="value">{runs} / {wickets}</span>
      </div>

      <div className="score-box">
        <span className="label">Overs</span>
        <span className="value">{overs}</span>
      </div>

      <div className="score-box">
        <span className="label">Run Rate</span>
        <span className="value">{runRate}</span>
      </div>

      <div className="score-box">
        <span className="label">Venue</span>
        <span className="value">{match?.venue || "-"}</span>
      </div>

    </div>
  )}

  {/* WAITING SCORECARD */}
  {matchState === "live" && !latestInnings && (
    <div className="score-details" style={{ opacity: 0.7 }}>
      Waiting for score update…
    </div>
  )}

</div>


);
}
