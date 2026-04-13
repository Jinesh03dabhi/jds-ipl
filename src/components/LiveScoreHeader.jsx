"use client";

import Link from "next/link";
import Image from "next/image";
import LiveBadge from "./LiveBadge";
import { getMatchState } from "@/utils/getMatchState";

function parseScore(scoreText) {
  if (!scoreText) {
    return null;
  }

  const match = String(scoreText).match(/(\d+)\/(\d+)\s+\(([\d.]+)\)/);
  if (!match) {
    return null;
  }

  return {
    runs: Number(match[1]),
    wickets: Number(match[2]),
    overs: match[3],
  };
}

function calculateRunRate(scoreText) {
  const parsed = parseScore(scoreText);

  if (!parsed || !parsed.overs) {
    return "-";
  }

  const [completedOvers = "0", balls = "0"] = parsed.overs.split(".");
  const totalBalls = Number(completedOvers) * 6 + Number(balls || 0);

  if (!Number.isFinite(totalBalls) || totalBalls <= 0) {
    return "-";
  }

  return ((parsed.runs / totalBalls) * 6).toFixed(2);
}

export default function LiveScoreHeader({ data }) {
  if (!data?.match) return null;

  const { match, message } = data;
  const matchState = getMatchState(data);
  const isLive = matchState === "live";
  const statusLine =
    message ||
    match.liveContext?.chaseText ||
    match.liveContext?.commentary ||
    match.result ||
    "Match update";

  return (
    <div className="glass-card premium-scoreboard">
      <div className="premium-row">
        <div className="premium-team">
          <Image
            src={match.team1.logo}
            alt={`${match.team1.name} IPL team logo`}
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
            unoptimized
          />
          <div>
            <Link href="/ipl-teams" className="team-name" style={{ textDecoration: "none", color: "inherit" }}>
              {match.team1.name}
            </Link>
            <div className="team-abbr">{match.team1.shortName}</div>

            {match.score?.team1 && (
              <div className="team-score">
                {match.score.team1}
                {isLive && <span className="rr"> - RR {calculateRunRate(match.score.team1)}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="premium-center">
          {isLive && <LiveBadge />}
          <div className="match-status">{statusLine}</div>
          <div className="venue">{match.venue || "-"}</div>
        </div>

        <div className="premium-team premium-right">
          <div>
            <Link href="/ipl-teams" className="team-name" style={{ textDecoration: "none", color: "inherit" }}>
              {match.team2.name}
            </Link>
            <div className="team-abbr">{match.team2.shortName}</div>

            {match.score?.team2 && (
              <div className="team-score">
                {match.score.team2}
                {isLive && <span className="rr"> - RR {calculateRunRate(match.score.team2)}</span>}
              </div>
            )}
          </div>

          <Image
            src={match.team2.logo}
            alt={`${match.team2.name} IPL team logo`}
            width={40}
            height={40}
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
