import { NextResponse } from "next/server";
import { TEAMS } from "@/lib/data";

type MatchStatus = "upcoming" | "live" | "completed";

type TeamInfo = {
  name: string;
  shortName: string;
  logo: string;
  color: string;
};

type MatchScore = {
  team1: string | null;
  team2: string | null;
};

type Match = {
  id: string;
  matchNumber: string;
  date: string;
  dateTimeGMT: string;
  team1: TeamInfo;
  team2: TeamInfo;
  venue: string;
  status: MatchStatus;
  result: string | null;
  score: MatchScore;
  winner: string | null;
};

const API_KEYS = [
  process.env.CRIC_API_KEY_1,
  process.env.CRIC_API_KEY_2,
  process.env.CRIC_API_KEY_3,
  process.env.CRIC_API_KEY_4,
  process.env.CRIC_API_KEY_5,
  process.env.CRIC_API_KEY_6,
].filter(Boolean);

const SERIES_ID =
  process.env.CRIC_API_IPL_SERIES_ID ||
  process.env.IPL_SERIES_ID ||
  process.env.CRIC_API_SERIES_ID ||
  "";

const teamIndex = new Map(TEAMS.map((team) => [team.name, team]));
const TEAM_ALIASES = new Map([
  ["Royal Challengers Bangalore", "Royal Challengers Bengaluru"],
  ["Delhi Daredevils", "Delhi Capitals"],
  ["Kings XI Punjab", "Punjab Kings"],
]);

const normalizeTeamName = (name: string) => TEAM_ALIASES.get(name) || name;

const toTeamInfo = (
  name: string,
  fallbackLogo?: string,
  fallbackShort?: string
): TeamInfo => {
  const normalized = normalizeTeamName(name);
  const team = teamIndex.get(normalized);
  return {
    name: normalized,
    shortName:
      fallbackShort ||
      team?.abbreviation ||
      normalized
        .split(" ")
        .map((part) => part[0])
        .join(""),
    logo: team?.logoUrl || fallbackLogo || "/team-placeholder.png",
    color: team?.color || "#334155",
  };
};

const parseScoreText = (score: any) => {
  if (!score) return null;
  const runs = score.r ?? score.runs;
  const wkts = score.w ?? score.wickets;
  const overs = score.o ?? score.overs;
  if (runs === undefined || wkts === undefined || overs === undefined) return null;
  return `${runs}/${wkts} (${overs})`;
};

const matchStatus = (match: any): MatchStatus => {
  if (match?.matchEnded) return "completed";
  if (match?.matchStarted) return "live";
  return "upcoming";
};

const resolveVenue = (match: any) =>
  match?.venue ||
  match?.venueName ||
  match?.venueInfo?.name ||
  match?.venue?.name ||
  "TBD";

const resolveDate = (match: any) => {
  if (match?.date) return match.date;
  if (match?.dateTimeGMT) return match.dateTimeGMT.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
};

const resolveMatchNumber = (match: any, index: number) => {
  if (match?.matchNumber) return `Match ${match.matchNumber}`;
  if (typeof match?.name === "string") {
    const found = match.name.match(/Match\s*\d+/i);
    if (found) return found[0].replace(/\s+/g, " ");
  }
  return `Match ${index + 1}`;
};

const buildScore = (match: any, team1: TeamInfo, team2: TeamInfo): MatchScore => {
  const scores = Array.isArray(match?.score) ? match.score : [];

  const findScoreForTeam = (team: TeamInfo) => {
    const entry = scores.find((item: any) => {
      const inning = String(item?.inning || "").toLowerCase();
      return inning.includes(team.name.toLowerCase()) || inning.includes(team.shortName.toLowerCase());
    });
    return parseScoreText(entry);
  };

  return {
    team1: findScoreForTeam(team1),
    team2: findScoreForTeam(team2),
  };
};

const normalizeMatch = (match: any, index: number): Match | null => {
  const teamNames =
    match?.teams ||
    match?.teamInfo?.map((team: any) => team?.name || team?.teamName) ||
    [];

  if (teamNames.length < 2) return null;

  const teamInfo =
    match?.teamInfo ||
    teamNames.map((name: string) => ({ name })) ||
    [];

  const team1Name = teamInfo[0]?.name || teamNames[0];
  const team2Name = teamInfo[1]?.name || teamNames[1];

  const team1 = toTeamInfo(
    team1Name,
    teamInfo[0]?.img,
    teamInfo[0]?.shortname || teamInfo[0]?.shortName
  );
  const team2 = toTeamInfo(
    team2Name,
    teamInfo[1]?.img,
    teamInfo[1]?.shortname || teamInfo[1]?.shortName
  );

  return {
    id: match?.id || `${match?.name || "ipl-match"}-${index}`,
    matchNumber: resolveMatchNumber(match, index),
    date: resolveDate(match),
    dateTimeGMT: match?.dateTimeGMT || `${resolveDate(match)}T14:00:00Z`,
    team1,
    team2,
    venue: resolveVenue(match),
    status: matchStatus(match),
    result: match?.status || match?.statusStr || null,
    score: buildScore(match, team1, team2),
    winner: match?.winner || match?.winningTeam || null,
  };
};

const FALLBACK_MATCHES: Match[] = [
  {
    id: "match-1",
    matchNumber: "Match 1",
    date: "2026-03-28",
    dateTimeGMT: "2026-03-28T14:00:00Z",
    team1: toTeamInfo("Royal Challengers Bengaluru"),
    team2: toTeamInfo("Sunrisers Hyderabad"),
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-2",
    matchNumber: "Match 2",
    date: "2026-03-29",
    dateTimeGMT: "2026-03-29T14:00:00Z",
    team1: toTeamInfo("Mumbai Indians"),
    team2: toTeamInfo("Kolkata Knight Riders"),
    venue: "Wankhede Stadium, Mumbai",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-3",
    matchNumber: "Match 3",
    date: "2026-03-30",
    dateTimeGMT: "2026-03-30T14:00:00Z",
    team1: toTeamInfo("Rajasthan Royals"),
    team2: toTeamInfo("Chennai Super Kings"),
    venue: "Barsapara Cricket Stadium, Guwahati",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-4",
    matchNumber: "Match 4",
    date: "2026-03-31",
    dateTimeGMT: "2026-03-31T14:00:00Z",
    team1: toTeamInfo("Punjab Kings"),
    team2: toTeamInfo("Gujarat Titans"),
    venue: "PCA Stadium, New Chandigarh",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-5",
    matchNumber: "Match 5",
    date: "2026-04-01",
    dateTimeGMT: "2026-04-01T14:00:00Z",
    team1: toTeamInfo("Lucknow Super Giants"),
    team2: toTeamInfo("Delhi Capitals"),
    venue: "Ekana Cricket Stadium, Lucknow",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-6",
    matchNumber: "Match 6",
    date: "2026-04-02",
    dateTimeGMT: "2026-04-02T14:00:00Z",
    team1: toTeamInfo("Kolkata Knight Riders"),
    team2: toTeamInfo("Sunrisers Hyderabad"),
    venue: "Eden Gardens, Kolkata",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-7",
    matchNumber: "Match 7",
    date: "2026-04-03",
    dateTimeGMT: "2026-04-03T14:00:00Z",
    team1: toTeamInfo("Chennai Super Kings"),
    team2: toTeamInfo("Punjab Kings"),
    venue: "M. A. Chidambaram Stadium, Chennai",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-8",
    matchNumber: "Match 8",
    date: "2026-04-04",
    dateTimeGMT: "2026-04-04T10:00:00Z",
    team1: toTeamInfo("Delhi Capitals"),
    team2: toTeamInfo("Mumbai Indians"),
    venue: "Arun Jaitley Stadium, Delhi",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-9",
    matchNumber: "Match 9",
    date: "2026-04-04",
    dateTimeGMT: "2026-04-04T14:00:00Z",
    team1: toTeamInfo("Gujarat Titans"),
    team2: toTeamInfo("Rajasthan Royals"),
    venue: "Narendra Modi Stadium, Ahmedabad",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-10",
    matchNumber: "Match 10",
    date: "2026-04-05",
    dateTimeGMT: "2026-04-05T10:00:00Z",
    team1: toTeamInfo("Sunrisers Hyderabad"),
    team2: toTeamInfo("Lucknow Super Giants"),
    venue: "Rajiv Gandhi International Stadium, Hyderabad",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-11",
    matchNumber: "Match 11",
    date: "2026-04-05",
    dateTimeGMT: "2026-04-05T14:00:00Z",
    team1: toTeamInfo("Royal Challengers Bengaluru"),
    team2: toTeamInfo("Chennai Super Kings"),
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-12",
    matchNumber: "Match 12",
    date: "2026-04-06",
    dateTimeGMT: "2026-04-06T14:00:00Z",
    team1: toTeamInfo("Kolkata Knight Riders"),
    team2: toTeamInfo("Punjab Kings"),
    venue: "Eden Gardens, Kolkata",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-13",
    matchNumber: "Match 13",
    date: "2026-04-07",
    dateTimeGMT: "2026-04-07T14:00:00Z",
    team1: toTeamInfo("Rajasthan Royals"),
    team2: toTeamInfo("Mumbai Indians"),
    venue: "Barsapara Cricket Stadium, Guwahati",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-14",
    matchNumber: "Match 14",
    date: "2026-04-08",
    dateTimeGMT: "2026-04-08T14:00:00Z",
    team1: toTeamInfo("Delhi Capitals"),
    team2: toTeamInfo("Gujarat Titans"),
    venue: "Arun Jaitley Stadium, Delhi",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-15",
    matchNumber: "Match 15",
    date: "2026-04-09",
    dateTimeGMT: "2026-04-09T14:00:00Z",
    team1: toTeamInfo("Kolkata Knight Riders"),
    team2: toTeamInfo("Lucknow Super Giants"),
    venue: "Eden Gardens, Kolkata",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-16",
    matchNumber: "Match 16",
    date: "2026-04-10",
    dateTimeGMT: "2026-04-10T14:00:00Z",
    team1: toTeamInfo("Rajasthan Royals"),
    team2: toTeamInfo("Royal Challengers Bengaluru"),
    venue: "Barsapara Cricket Stadium, Guwahati",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-17",
    matchNumber: "Match 17",
    date: "2026-04-11",
    dateTimeGMT: "2026-04-11T10:00:00Z",
    team1: toTeamInfo("Punjab Kings"),
    team2: toTeamInfo("Sunrisers Hyderabad"),
    venue: "PCA Stadium, New Chandigarh",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-18",
    matchNumber: "Match 18",
    date: "2026-04-11",
    dateTimeGMT: "2026-04-11T14:00:00Z",
    team1: toTeamInfo("Chennai Super Kings"),
    team2: toTeamInfo("Delhi Capitals"),
    venue: "M. A. Chidambaram Stadium, Chennai",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-19",
    matchNumber: "Match 19",
    date: "2026-04-12",
    dateTimeGMT: "2026-04-12T10:00:00Z",
    team1: toTeamInfo("Lucknow Super Giants"),
    team2: toTeamInfo("Gujarat Titans"),
    venue: "Ekana Cricket Stadium, Lucknow",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
  {
    id: "match-20",
    matchNumber: "Match 20",
    date: "2026-04-12",
    dateTimeGMT: "2026-04-12T14:00:00Z",
    team1: toTeamInfo("Mumbai Indians"),
    team2: toTeamInfo("Royal Challengers Bengaluru"),
    venue: "Wankhede Stadium, Mumbai",
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
  },
];

export async function GET() {
  const fallbackResponse = {
    matches: FALLBACK_MATCHES,
    lastUpdated: new Date().toISOString(),
    source: "fallback",
  };

  if (!API_KEYS.length || !SERIES_ID) {
    return NextResponse.json(fallbackResponse, {
      headers: {
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  }

  for (const key of API_KEYS) {
    try {
      const res = await fetch(
        `https://api.cricapi.com/v1/series_info?apikey=${key}&id=${SERIES_ID}`,
        { cache: "no-store" }
      );

      if (!res.ok) continue;

      const payload = await res.json();
      if (payload?.status === "failure") continue;

      const matchList = payload?.data?.matchList || payload?.data?.matchlist || [];
      const normalized = matchList
        .map((match: any, index: number) => normalizeMatch(match, index))
        .filter(Boolean) as Match[];

      const sorted = normalized.sort(
        (a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime()
      );

      return NextResponse.json(
        {
          matches: sorted.length ? sorted : FALLBACK_MATCHES,
          lastUpdated: new Date().toISOString(),
          source: sorted.length ? "api" : "fallback",
        },
        {
          headers: {
            "Cache-Control": "public, max-age=3600, must-revalidate",
          },
        }
      );
    } catch {
      continue;
    }
  }

  return NextResponse.json(fallbackResponse, {
    headers: {
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
