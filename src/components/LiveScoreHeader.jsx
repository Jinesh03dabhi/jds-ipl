"use client";

import LiveBadge from "./LiveBadge";
export default function LiveScoreHeader({ data }) {

  if (!data) return null;

  const { type, match, message } = data;

  // 🟢 Safe check
  const innings =
    match?.score && match.score.length
      ? match.score[match.score.length - 1]
      : null;

  const team1 = match?.teamInfo?.[0];
  const team2 = match?.teamInfo?.[1];

  const isLive = type === "live";

  // 🧠 Calculate Run Rate safely
  const runRate =
    innings?.o && innings.o > 0
      ? (innings.r / innings.o).toFixed(2)
      : "-";

  return (
    <div className="glass-card premium-scoreboard">

      {/* TOP ROW */}
      <div className="premium-row">

        {/* TEAM 1 */}
        <div className="premium-team">
          {team1?.img && (
            <img
              src={team1.img}
              alt={team1.name}
              width={40}
              height={40}
            />
          )}
          <div>
            <div className="team-name">{team1?.name}</div>
            <div className="team-abbr">{team1?.shortname}</div>
          </div>
        </div>

        {/* CENTER */}
        <div className="premium-center">
          {isLive && <LiveBadge />}
          <div className="match-status">
            {match?.status || message}
          </div>
        </div>

        {/* TEAM 2 */}
        <div className="premium-team premium-right">
          <div>
            <div className="team-name">{team2?.name}</div>
            <div className="team-abbr">{team2?.shortname}</div>
          </div>
          {team2?.img && (
            <img
              src={team2.img}
              alt={team2.name}
              width={40}
              height={40}
            />
          )}
        </div>

      </div>

      {/* SCORE SECTION */}
      {innings && (
        <div className="score-details">

          <div className="score-box">
            <span className="label">Score</span>
            <span className="value">
              {innings.r} / {innings.w}
            </span>
          </div>

          <div className="score-box">
            <span className="label">Overs</span>
            <span className="value">{innings.o}</span>
          </div>

          <div className="score-box">
            <span className="label">Run Rate</span>
            <span className="value">{runRate}</span>
          </div>

          <div className="score-box">
            <span className="label">Venue</span>
            <span className="value">
              {match?.venue || "-"}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}