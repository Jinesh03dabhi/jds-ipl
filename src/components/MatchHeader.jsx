import { findTeamsFromMatch } from "@/utils/findTeamsFromMatch";

export default function MatchHeader({ match }) {

  const [team1, team2] = findTeamsFromMatch(match?.name);

  return (
    <div className="glass-card fade-in premium-scoreboard">

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
          <span className="live-badge">LIVE</span>
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

      {/* RUN RATE */}
      

    </div>
  );
}
