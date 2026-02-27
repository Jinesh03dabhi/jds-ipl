"use client";

import LiveBadge from "./LiveBadge";
import { getMatchState } from "@/utils/getMatchState";

export default function LiveScoreHeader({ data }) {

  if (!data || !data.match) return null;

  const { match, message } = data;

  const matchState = getMatchState(data);

  const team1 = match?.teamInfo?.[0];
  const team2 = match?.teamInfo?.[1];

  // 🔥 Use match.score (summary scoreboard)
  const scores = match?.score || [];

  const team1Score = scores[0] || null;
  const team2Score = scores[1] || null;

  // 🧠 Run rate calculator
  const calculateRR = (runs, overs) => {
    if (!runs || !overs) return "-";
    const o = Number(overs);
    if (!o || o === 0) return "-";
    return (runs / o).toFixed(2);
  };

  const team1RR = team1Score
    ? calculateRR(team1Score.r, team1Score.o)
    : "-";

  const team2RR = team2Score
    ? calculateRR(team2Score.r, team2Score.o)
    : "-";

  const isLive = matchState === "live";

  return (
    <div className="glass-card premium-scoreboard">

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

            {team1Score && (
              <div className="team-score">
                {team1Score.r}/{team1Score.w} ({team1Score.o})
                {isLive && <span className="rr"> • RR {team1RR}</span>}
              </div>
            )}
          </div>
        </div>

        {/* CENTER */}
        <div className="premium-center">
          {isLive && <LiveBadge />}
          <div className="match-status">
            {match?.status || message || "Match update"}
          </div>
          <div className="venue">
            {match?.venue || "-"}
          </div>
        </div>

        {/* TEAM 2 */}
        <div className="premium-team premium-right">
          <div>
            <div className="team-name">{team2?.name || "-"}</div>
            <div className="team-abbr">{team2?.shortname || ""}</div>

            {team2Score && (
              <div className="team-score">
                {team2Score.r}/{team2Score.w} ({team2Score.o})
                {isLive && <span className="rr"> • RR {team2RR}</span>}
              </div>
            )}
          </div>

          {team2?.img && (
            <img src={team2.img} alt={team2.name} width={40} height={40} />
          )}
        </div>

      </div>

    </div>
  );
}