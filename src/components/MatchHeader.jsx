import { findTeamsFromMatch } from "@/utils/findTeamsFromMatch";

export default function MatchHeader({ match }) {

  const [team1, team2] = findTeamsFromMatch(match?.name);

  const score = match?.score || {};
  const innings = score?.innings?.[0] || {};

  const isLive = match?.status?.toLowerCase().includes("live");

  return (
    <div className="glass-card fade-in premium-scoreboard">

      {/* TOP ROW */}
      <div className="premium-row">

        {/* TEAM 1 */}
        <div className="premium-team">
          <div className="team-logo-box">
            <img src={team1?.logoUrl} alt={team1?.name} />
          </div>
          <div>
            <div className="team-name">{team1?.name}</div>
            <div className="team-abbr">{team1?.abbreviation}</div>
          </div>
        </div>

        {/* CENTER */}
        <div className="premium-center">
          {isLive && <span className="live-badge pulse">LIVE</span>}
          <div className="premium-score">{match?.status}</div>
        </div>

        {/* TEAM 2 */}
        <div className="premium-team premium-right">
          <div>
            <div className="team-name">{team2?.name}</div>
            <div className="team-abbr">{team2?.abbreviation}</div>
          </div>
          <div className="team-logo-box">
            <img src={team2?.logoUrl} alt={team2?.name} />
          </div>
        </div>

      </div>

      {/* SCORE DETAILS */}
      <div className="score-details">

        <div className="score-box">
          <span className="label">Score</span>
          <span className="value">
            {innings?.runs || "-"} / {innings?.wickets || "-"}
          </span>
        </div>

        <div className="score-box">
          <span className="label">Overs</span>
          <span className="value">{innings?.overs || "-"}</span>
        </div>

        <div className="score-box">
          <span className="label">Run Rate</span>
          <span className="value">{innings?.runRate || "-"}</span>
        </div>

        <div className="score-box">
          <span className="label">Toss</span>
          <span className="value">{match?.toss || "N/A"}</span>
        </div>

      </div>

    </div>
  );
}