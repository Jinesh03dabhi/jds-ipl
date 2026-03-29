import { unstable_cache } from "next/cache";
import { fetchCricApiJson } from "@/lib/cricapi-client";
import { PLAYERS, TEAMS } from "@/lib/data";
import { IPL_SEASON_YEAR, IPL_TIMEZONE } from "@/lib/site";

export type MatchStatus = "upcoming" | "live" | "completed";

export type TeamInfo = {
  id?: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
};

export type MatchScore = {
  team1: string | null;
  team2: string | null;
};

type InningScoreSummary = {
  runs: number;
  wickets: number;
  overs: string;
};

export type IplSeries = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type IplMatch = {
  id: string;
  matchNumber: string;
  matchNumberValue: number | null;
  date: string;
  dateTimeGMT: string;
  team1: TeamInfo;
  team2: TeamInfo;
  venue: string;
  venueSlug: string;
  status: MatchStatus;
  result: string | null;
  score: MatchScore;
  winner: string | null;
  predictionSlug: string;
  detailSlug: string;
  tossWinner?: string | null;
  tossChoice?: string | null;
};

export type IplScheduleResponse = {
  matches: IplMatch[];
  lastUpdated: string;
  source: "cricapi" | "official-seed";
  series: IplSeries | null;
};

export type IplLiveResponse = {
  type: "live" | "upcoming" | "completed" | "waiting" | "error";
  match?: IplMatch;
  scorecard?: any;
  message: string;
  source: string;
  lastUpdated: string;
};

export type PointsTableRow = {
  team: TeamInfo;
  played: number;
  wins: number;
  losses: number;
  noResult: number;
  ties: number;
  points: number;
  runsFor: number;
  runsAgainst: number;
  ballsFaced: number;
  ballsBowled: number;
  nrr: number;
  form: ("W" | "L" | "NR" | "T")[];
};

export type KeyPlayer = {
  id: string;
  name: string;
  role: string;
  team: string;
  statLine: string;
};

export type StadiumProfile = {
  name: string;
  slug: string;
  city: string;
  shortSummary: string;
  pitchSummary: string;
  tossAngle: string;
  bestFor: string;
  caution: string;
  homeTeams: string[];
};

const TEAM_ALIASES = new Map([
  ["Royal Challengers Bangalore", "Royal Challengers Bengaluru"],
  ["RCB Women", "Royal Challengers Bengaluru"],
  ["Delhi Daredevils", "Delhi Capitals"],
  ["Kings XI Punjab", "Punjab Kings"],
  ["Punjab", "Punjab Kings"],
]);

const SHORT_NAME_ALIASES = new Map([["RCBW", "RCB"]]);

const VENUE_ALIASES = new Map([
  ["M.Chinnaswamy Stadium", "M. Chinnaswamy Stadium"],
  ["MA Chidambaram Stadium", "M. A. Chidambaram Stadium"],
  [
    "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium",
    "Ekana Cricket Stadium",
  ],
  [
    "Maharaja Yadavindra Singh International Cricket Stadium",
    "New PCA Stadium",
  ],
]);

const PITCH_SLUG_ALIASES = new Map([
  ["mchinnaswamy-stadium-pitch-report", "m-chinnaswamy-stadium-pitch-report"],
  ["ma-chidambaram-stadium-pitch-report", "m-a-chidambaram-stadium-pitch-report"],
  [
    "bharat-ratna-shri-atal-bihari-vajpayee-ekana-cricket-stadium-pitch-report",
    "ekana-cricket-stadium-pitch-report",
  ],
  [
    "maharaja-yadavindra-singh-international-cricket-stadium-pitch-report",
    "new-pca-stadium-pitch-report",
  ],
  ["mullanpur-pitch-report", "new-pca-stadium-pitch-report"],
]);

const teamIndex = new Map(TEAMS.map((team) => [team.name, team]));
const IPL_CACHE_VERSION = "2026-03-29-points-table-fix-v2";

const OFFICIAL_PHASE_ONE_MATCHES: IplMatch[] = [
  seedMatch("match-1", "Match 1", "2026-03-28", "2026-03-28T14:00:00Z", "Royal Challengers Bengaluru", "Sunrisers Hyderabad", "M. Chinnaswamy Stadium, Bengaluru"),
  seedMatch("match-2", "Match 2", "2026-03-29", "2026-03-29T14:00:00Z", "Mumbai Indians", "Kolkata Knight Riders", "Wankhede Stadium, Mumbai"),
  seedMatch("match-3", "Match 3", "2026-03-30", "2026-03-30T14:00:00Z", "Rajasthan Royals", "Chennai Super Kings", "Barsapara Cricket Stadium, Guwahati"),
  seedMatch("match-4", "Match 4", "2026-03-31", "2026-03-31T14:00:00Z", "Punjab Kings", "Gujarat Titans", "New PCA Stadium, New Chandigarh"),
  seedMatch("match-5", "Match 5", "2026-04-01", "2026-04-01T14:00:00Z", "Lucknow Super Giants", "Delhi Capitals", "Ekana Cricket Stadium, Lucknow"),
  seedMatch("match-6", "Match 6", "2026-04-02", "2026-04-02T14:00:00Z", "Kolkata Knight Riders", "Sunrisers Hyderabad", "Eden Gardens, Kolkata"),
  seedMatch("match-7", "Match 7", "2026-04-03", "2026-04-03T14:00:00Z", "Chennai Super Kings", "Punjab Kings", "M. A. Chidambaram Stadium, Chennai"),
  seedMatch("match-8", "Match 8", "2026-04-04", "2026-04-04T10:00:00Z", "Delhi Capitals", "Mumbai Indians", "Arun Jaitley Stadium, Delhi"),
  seedMatch("match-9", "Match 9", "2026-04-04", "2026-04-04T14:00:00Z", "Gujarat Titans", "Rajasthan Royals", "Narendra Modi Stadium, Ahmedabad"),
  seedMatch("match-10", "Match 10", "2026-04-05", "2026-04-05T10:00:00Z", "Sunrisers Hyderabad", "Lucknow Super Giants", "Rajiv Gandhi International Stadium, Hyderabad"),
  seedMatch("match-11", "Match 11", "2026-04-05", "2026-04-05T14:00:00Z", "Royal Challengers Bengaluru", "Chennai Super Kings", "M. Chinnaswamy Stadium, Bengaluru"),
  seedMatch("match-12", "Match 12", "2026-04-06", "2026-04-06T14:00:00Z", "Kolkata Knight Riders", "Punjab Kings", "Eden Gardens, Kolkata"),
  seedMatch("match-13", "Match 13", "2026-04-07", "2026-04-07T14:00:00Z", "Rajasthan Royals", "Mumbai Indians", "Barsapara Cricket Stadium, Guwahati"),
  seedMatch("match-14", "Match 14", "2026-04-08", "2026-04-08T14:00:00Z", "Delhi Capitals", "Gujarat Titans", "Arun Jaitley Stadium, Delhi"),
  seedMatch("match-15", "Match 15", "2026-04-09", "2026-04-09T14:00:00Z", "Kolkata Knight Riders", "Lucknow Super Giants", "Eden Gardens, Kolkata"),
  seedMatch("match-16", "Match 16", "2026-04-10", "2026-04-10T14:00:00Z", "Rajasthan Royals", "Royal Challengers Bengaluru", "Barsapara Cricket Stadium, Guwahati"),
  seedMatch("match-17", "Match 17", "2026-04-11", "2026-04-11T10:00:00Z", "Punjab Kings", "Sunrisers Hyderabad", "New PCA Stadium, New Chandigarh"),
  seedMatch("match-18", "Match 18", "2026-04-11", "2026-04-11T14:00:00Z", "Chennai Super Kings", "Delhi Capitals", "M. A. Chidambaram Stadium, Chennai"),
  seedMatch("match-19", "Match 19", "2026-04-12", "2026-04-12T10:00:00Z", "Lucknow Super Giants", "Gujarat Titans", "Ekana Cricket Stadium, Lucknow"),
  seedMatch("match-20", "Match 20", "2026-04-12", "2026-04-12T14:00:00Z", "Mumbai Indians", "Royal Challengers Bengaluru", "Wankhede Stadium, Mumbai"),
];

const MANUAL_MATCH_OVERRIDES = [
  {
    dateTimeGMT: "2026-03-28T14:00:00Z",
    team1: "Royal Challengers Bengaluru",
    team2: "Sunrisers Hyderabad",
    status: "completed" as const,
    result: "Royal Challengers Bengaluru won by 6 wkts",
    winner: "Royal Challengers Bengaluru",
    score: {
      team1: "203/4 (15.4)",
      team2: "201/9 (20)",
    } satisfies MatchScore,
    tossWinner: "Royal Challengers Bengaluru",
    tossChoice: "bowl",
  },
];

function seedMatch(
  id: string,
  matchNumber: string,
  date: string,
  dateTimeGMT: string,
  team1Name: string,
  team2Name: string,
  venue: string
): IplMatch {
  const team1 = toTeamInfo(team1Name);
  const team2 = toTeamInfo(team2Name);
  return {
    id,
    matchNumber,
    matchNumberValue: extractMatchNumber(matchNumber),
    date,
    dateTimeGMT,
    team1,
    team2,
    venue,
    venueSlug: getVenueSlug(venue),
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
    predictionSlug: getPredictionSlug(team1.name, team2.name),
    detailSlug: getDetailSlug(matchNumber, team1.name, team2.name),
  };
}

function normalizeTeamName(name: string) {
  return TEAM_ALIASES.get(name) || name;
}

function normalizeShortName(shortName?: string | null) {
  if (!shortName) return "";
  return SHORT_NAME_ALIASES.get(shortName) || shortName;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[().,']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getVenueBaseName(venue: string) {
  const baseName = venue.split(",")[0]?.trim() || venue.trim();
  return VENUE_ALIASES.get(baseName) || baseName;
}

export function getVenueSlug(venue: string) {
  return `${slugify(getVenueBaseName(venue))}-pitch-report`;
}

export function getPredictionSlug(team1: string, team2: string) {
  return `${slugify(team1)}-vs-${slugify(team2)}-prediction`;
}

export function getDetailSlug(matchNumber: string, team1: string, team2: string) {
  const matchNumberValue = extractMatchNumber(matchNumber);
  const suffix = matchNumberValue ? `-match-${matchNumberValue}` : "";
  return `${slugify(team1)}-vs-${slugify(team2)}${suffix}`;
}

export function getIndiaDateKey(date: Date | string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: IPL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(date));

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export function shiftIndiaDate(dateKey: string, offsetDays: number) {
  const date = new Date(`${dateKey}T00:00:00+05:30`);
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatIndiaDateLong(dateKey: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: IPL_TIMEZONE,
  }).format(new Date(`${dateKey}T00:00:00+05:30`));
}

export function formatIndiaDateTime(dateTimeGMT: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IPL_TIMEZONE,
  }).format(new Date(dateTimeGMT));
}

function extractMatchNumber(matchNumber: string) {
  const value = matchNumber.match(/(\d+)/)?.[1];
  return value ? Number(value) : null;
}

function toTeamInfo(
  name: string,
  fallbackLogo?: string,
  fallbackShort?: string | null
): TeamInfo {
  const normalized = normalizeTeamName(name);
  const team = teamIndex.get(normalized);
  return {
    id: team?.id,
    name: normalized,
    shortName:
      normalizeShortName(fallbackShort) ||
      team?.abbreviation ||
      normalized
        .split(" ")
        .map((part) => part[0])
        .join(""),
    logo: team?.logoUrl || fallbackLogo || "/jds-ipl-logo-1.png",
    color: team?.color || "#334155",
  };
}

function normalizeComparisonText(value: string | null | undefined) {
  return normalizeTeamName(String(value || ""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function textMentionsTeam(value: string | null | undefined, team: TeamInfo) {
  const haystack = normalizeComparisonText(value);
  if (!haystack) {
    return false;
  }

  const teamNames = [team.name, team.shortName];

  return teamNames.some((teamName) => {
    const needle = normalizeComparisonText(teamName);
    return needle ? haystack === needle || haystack.includes(needle) : false;
  });
}

export function resolveMatchWinnerName(
  match: Pick<IplMatch, "winner" | "result" | "team1" | "team2">,
) {
  const winnerText = match.winner || null;
  const resultText = match.result || null;

  const winnerMatchesTeam1 =
    textMentionsTeam(winnerText, match.team1) || textMentionsTeam(resultText, match.team1);
  const winnerMatchesTeam2 =
    textMentionsTeam(winnerText, match.team2) || textMentionsTeam(resultText, match.team2);

  if (winnerMatchesTeam1 && !winnerMatchesTeam2) {
    return match.team1.name;
  }

  if (winnerMatchesTeam2 && !winnerMatchesTeam1) {
    return match.team2.name;
  }

  return null;
}

function parseScoreText(score: any) {
  if (!score) return null;
  const runs = score.r ?? score.runs;
  const wickets = score.w ?? score.wickets;
  const overs = score.o ?? score.overs;
  if (runs === undefined || wickets === undefined || overs === undefined) {
    return null;
  }
  return `${runs}/${wickets} (${overs})`;
}

function oversValueToBalls(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const normalized = String(value).trim();
  const [wholePart = "0", ballPart = "0"] = normalized.split(".");
  const completedOvers = Number(wholePart);
  const balls = Number(ballPart);

  if (!Number.isFinite(completedOvers) || !Number.isFinite(balls)) {
    return 0;
  }

  return completedOvers * 6 + balls;
}

function ballsToOversString(totalBalls: number) {
  if (!Number.isFinite(totalBalls) || totalBalls <= 0) {
    return "0";
  }

  const completedOvers = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  return balls ? `${completedOvers}.${balls}` : `${completedOvers}`;
}

function sumExtras(extras: Record<string, unknown> | null | undefined) {
  return Object.values(extras || {}).reduce<number>((sum, value) => {
    const nextValue = Number(value);
    return Number.isFinite(nextValue) ? sum + nextValue : sum;
  }, 0);
}

function countDismissals(batting: any[]) {
  return Math.min(
    batting.filter((entry) => {
      const dismissalText = String(
        entry?.["dismissal-text"] || entry?.dismissalText || entry?.dismissal || "",
      ).toLowerCase();
      return dismissalText && dismissalText !== "not out";
    }).length,
    10,
  );
}

function buildInningScoreSummary(inning: any): InningScoreSummary | null {
  const batting = Array.isArray(inning?.batting) ? inning.batting : [];
  const bowling = Array.isArray(inning?.bowling) ? inning.bowling : [];

  if (!batting.length && !bowling.length) {
    return null;
  }

  const battingRuns = batting.reduce((sum: number, entry: any) => {
    const runs = Number(entry?.r ?? 0);
    return Number.isFinite(runs) ? sum + runs : sum;
  }, 0);
  const totalBalls = bowling.reduce((sum: number, entry: any) => {
    return sum + oversValueToBalls(entry?.o);
  }, 0);

  return {
    runs: battingRuns + sumExtras(inning?.extras),
    wickets: countDismissals(batting),
    overs: ballsToOversString(totalBalls),
  };
}

function formatInningScore(summary: InningScoreSummary | null) {
  if (!summary) {
    return null;
  }

  return `${summary.runs}/${summary.wickets} (${summary.overs})`;
}

function inferScoresFromResult(
  match: Pick<IplMatch, "team1" | "team2" | "winner" | "result">,
  team1Score: InningScoreSummary | null,
  team2Score: InningScoreSummary | null,
) {
  const winner = resolveMatchWinnerName(match) || match.winner || null;
  const resultText = String(match.result || "").toLowerCase();
  const wicketsWinMatch = resultText.match(/won by (\d+)\s+wkt/);
  const runsWinMatch = resultText.match(/won by (\d+)\s+run/);

  let nextTeam1Score = team1Score ? { ...team1Score } : null;
  let nextTeam2Score = team2Score ? { ...team2Score } : null;

  if (wicketsWinMatch && winner) {
    const wicketsInHand = Number(wicketsWinMatch[1]);
    const winnerWicketsLost = Math.max(0, 10 - wicketsInHand);

    if (winner === match.team1.name && nextTeam2Score) {
      nextTeam1Score = {
        runs: nextTeam2Score.runs + 1,
        wickets: winnerWicketsLost,
        overs: nextTeam1Score?.overs || "0",
      };
    } else if (winner === match.team2.name && nextTeam1Score) {
      nextTeam2Score = {
        runs: nextTeam1Score.runs + 1,
        wickets: winnerWicketsLost,
        overs: nextTeam2Score?.overs || "0",
      };
    }
  }

  if (runsWinMatch && winner) {
    const margin = Number(runsWinMatch[1]);

    if (winner === match.team1.name && nextTeam1Score) {
      nextTeam2Score = {
        runs: Math.max(0, nextTeam1Score.runs - margin),
        wickets: nextTeam2Score?.wickets ?? 10,
        overs: nextTeam2Score?.overs || "20",
      };
    } else if (winner === match.team2.name && nextTeam2Score) {
      nextTeam1Score = {
        runs: Math.max(0, nextTeam2Score.runs - margin),
        wickets: nextTeam1Score?.wickets ?? 10,
        overs: nextTeam1Score?.overs || "20",
      };
    }
  }

  return {
    team1: nextTeam1Score,
    team2: nextTeam2Score,
  };
}

function buildScoreFromScorecard(
  match: Pick<IplMatch, "team1" | "team2" | "winner" | "result">,
  scorecardData: any,
): MatchScore {
  const innings = Array.isArray(scorecardData?.scorecard) ? scorecardData.scorecard : [];

  const findInningSummary = (team: TeamInfo) => {
    const inning = innings.find((entry: any) => textMentionsTeam(entry?.inning, team));
    return inning ? buildInningScoreSummary(inning) : null;
  };

  const inferredScores = inferScoresFromResult(
    match,
    findInningSummary(match.team1),
    findInningSummary(match.team2),
  );

  return {
    team1: formatInningScore(inferredScores.team1),
    team2: formatInningScore(inferredScores.team2),
  };
}

const COMPLETED_STATUS_PATTERN =
  /\b(won by|match tied|tied\b|tie\b|abandoned|no result|n\/r|cancelled|called off|super over)\b/i;
const LIVE_STATUS_PATTERN =
  /\b(need(?:s)?\b|require(?:s|d)?\b|trail by|lead by|innings break|stumps|day \d|drinks|lunch|tea)\b/i;

function hasRecordedScore(match: any) {
  const scores = Array.isArray(match?.score) ? match.score : [];
  return scores.some((entry: any) => {
    const runs = entry?.r ?? entry?.runs;
    const overs = entry?.o ?? entry?.overs;
    return runs !== undefined || overs !== undefined;
  });
}

function matchStatus(match: any): MatchStatus {
  const statusText = String(match?.status || match?.statusStr || "");

  if (match?.matchEnded || COMPLETED_STATUS_PATTERN.test(statusText)) {
    return "completed";
  }

  if (match?.matchStarted || LIVE_STATUS_PATTERN.test(statusText) || hasRecordedScore(match)) {
    return "live";
  }

  return "upcoming";
}

function buildScore(match: any, team1: TeamInfo, team2: TeamInfo): MatchScore {
  const scores = Array.isArray(match?.score) ? match.score : [];

  const findScoreForTeam = (team: TeamInfo) => {
    const entry = scores.find((item: any) => {
      return textMentionsTeam(item?.inning, team);
    });
    return parseScoreText(entry);
  };

  return {
    team1: findScoreForTeam(team1),
    team2: findScoreForTeam(team2),
  };
}

function applyManualMatchOverride(match: IplMatch): IplMatch {
  const override = MANUAL_MATCH_OVERRIDES.find((item) => {
    return (
      sameTeamName(item.team1, match.team1.name) &&
      sameTeamName(item.team2, match.team2.name) &&
      new Date(item.dateTimeGMT).getTime() === new Date(match.dateTimeGMT).getTime()
    );
  });

  if (!override) {
    return match;
  }

  return {
    ...match,
    status: override.status,
    result: override.result,
    winner: override.winner,
    score: {
      team1: override.score.team1,
      team2: override.score.team2,
    },
    tossWinner: override.tossWinner || match.tossWinner || null,
    tossChoice: override.tossChoice || match.tossChoice || null,
  };
}

function sameTeamName(left: string, right: string) {
  return normalizeTeamName(left) === normalizeTeamName(right);
}

function sameTeamPair(
  left: Pick<IplMatch, "team1" | "team2">,
  right: Pick<IplMatch, "team1" | "team2">,
) {
  return (
    (sameTeamName(left.team1.name, right.team1.name) &&
      sameTeamName(left.team2.name, right.team2.name)) ||
    (sameTeamName(left.team1.name, right.team2.name) &&
      sameTeamName(left.team2.name, right.team1.name))
  );
}

function isSameFixture(left: IplMatch, right: IplMatch) {
  if (left.id === right.id) {
    return true;
  }

  if (!sameTeamPair(left, right)) {
    return false;
  }

  if (
    left.matchNumberValue !== null &&
    right.matchNumberValue !== null &&
    left.matchNumberValue === right.matchNumberValue
  ) {
    return true;
  }

  const leftTime = new Date(left.dateTimeGMT).getTime();
  const rightTime = new Date(right.dateTimeGMT).getTime();

  if (!Number.isFinite(leftTime) || !Number.isFinite(rightTime)) {
    return false;
  }

  return Math.abs(leftTime - rightTime) <= 36 * 60 * 60 * 1000;
}

function alignCurrentMatchToSchedule(scheduleMatch: IplMatch, currentMatch: IplMatch) {
  const isDirectOrder =
    sameTeamName(scheduleMatch.team1.name, currentMatch.team1.name) &&
    sameTeamName(scheduleMatch.team2.name, currentMatch.team2.name);

  if (isDirectOrder) {
    return currentMatch;
  }

  const isSwappedOrder =
    sameTeamName(scheduleMatch.team1.name, currentMatch.team2.name) &&
    sameTeamName(scheduleMatch.team2.name, currentMatch.team1.name);

  if (!isSwappedOrder) {
    return currentMatch;
  }

  return {
    ...currentMatch,
    team1: currentMatch.team2,
    team2: currentMatch.team1,
    score: {
      team1: currentMatch.score.team2,
      team2: currentMatch.score.team1,
    },
  };
}

function mergeMatchScores(baseScore: MatchScore, currentScore: MatchScore): MatchScore {
  return {
    team1: currentScore.team1 || baseScore.team1,
    team2: currentScore.team2 || baseScore.team2,
  };
}

function pickFreshestStatus(baseStatus: MatchStatus, currentStatus: MatchStatus) {
  const priority: Record<MatchStatus, number> = {
    upcoming: 0,
    live: 1,
    completed: 2,
  };

  return priority[currentStatus] >= priority[baseStatus] ? currentStatus : baseStatus;
}

function mergeScheduledMatch(scheduleMatch: IplMatch, currentMatch: IplMatch): IplMatch {
  const alignedCurrent = alignCurrentMatchToSchedule(scheduleMatch, currentMatch);
  const result = alignedCurrent.result || scheduleMatch.result;
  const winner =
    resolveMatchWinnerName({
      winner: alignedCurrent.winner || scheduleMatch.winner,
      result,
      team1: scheduleMatch.team1,
      team2: scheduleMatch.team2,
    }) ||
    alignedCurrent.winner ||
    scheduleMatch.winner ||
    null;

  return {
    ...scheduleMatch,
    ...alignedCurrent,
    id: alignedCurrent.id || scheduleMatch.id,
    matchNumber: scheduleMatch.matchNumber || alignedCurrent.matchNumber,
    matchNumberValue:
      scheduleMatch.matchNumberValue ?? alignedCurrent.matchNumberValue ?? null,
    date: alignedCurrent.date || scheduleMatch.date,
    dateTimeGMT: alignedCurrent.dateTimeGMT || scheduleMatch.dateTimeGMT,
    team1: scheduleMatch.team1,
    team2: scheduleMatch.team2,
    venue: alignedCurrent.venue || scheduleMatch.venue,
    venueSlug: scheduleMatch.venueSlug || alignedCurrent.venueSlug,
    status: pickFreshestStatus(scheduleMatch.status, alignedCurrent.status),
    result,
    score: mergeMatchScores(scheduleMatch.score, alignedCurrent.score),
    winner,
    predictionSlug: scheduleMatch.predictionSlug,
    detailSlug: scheduleMatch.detailSlug,
    tossWinner: alignedCurrent.tossWinner || scheduleMatch.tossWinner || null,
    tossChoice: alignedCurrent.tossChoice || scheduleMatch.tossChoice || null,
  };
}

function sortMatchesByStartTime(matches: IplMatch[]) {
  return [...matches].sort(
    (a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime(),
  );
}

function mergeScheduleWithCurrentMatches(
  scheduleMatches: IplMatch[],
  currentMatches: IplMatch[],
) {
  if (!currentMatches.length) {
    return sortMatchesByStartTime(scheduleMatches);
  }

  const remainingCurrentMatches = [...currentMatches];
  const mergedMatches = scheduleMatches.map((scheduleMatch) => {
    const currentMatchIndex = remainingCurrentMatches.findIndex((currentMatch) =>
      isSameFixture(scheduleMatch, currentMatch),
    );

    if (currentMatchIndex === -1) {
      return scheduleMatch;
    }

    const [currentMatch] = remainingCurrentMatches.splice(currentMatchIndex, 1);
    return mergeScheduledMatch(scheduleMatch, currentMatch);
  });

  return sortMatchesByStartTime([...mergedMatches, ...remainingCurrentMatches]);
}

function normalizeApiMatch(match: any, index: number): IplMatch | null {
  const teamNames =
    match?.teams ||
    match?.teamInfo?.map((team: any) => team?.name || team?.teamName) ||
    [];

  if (teamNames.length < 2) {
    return null;
  }

  const teamInfo = match?.teamInfo || teamNames.map((name: string) => ({ name }));
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
  const date = match?.date || match?.dateTimeGMT?.slice(0, 10) || getIndiaDateKey(new Date());
  const dateTimeGMT = match?.dateTimeGMT?.endsWith("Z")
    ? match.dateTimeGMT
    : `${match?.dateTimeGMT || `${date}T14:00:00`}Z`;
  const rawMatchNumber =
    match?.matchNumber ||
    match?.name?.match(/(\d+)(st|nd|rd|th)? Match/i)?.[0]?.replace(",", "") ||
    `Match ${index + 1}`;
  const matchNumber = rawMatchNumber.toLowerCase().startsWith("match")
    ? rawMatchNumber
    : `Match ${String(rawMatchNumber).match(/\d+/)?.[0] || index + 1}`;
  const venue =
    match?.venue ||
    match?.venueName ||
    match?.venueInfo?.name ||
    match?.venue?.name ||
    "TBD";
  const result = match?.status || match?.statusStr || null;
  const winner =
    resolveMatchWinnerName({
      winner: match?.winner || match?.winningTeam || null,
      result,
      team1,
      team2,
    }) ||
    match?.winner ||
    match?.winningTeam ||
    null;

  return {
    id: match?.id || `${slugify(team1.name)}-${slugify(team2.name)}-${index + 1}`,
    matchNumber,
    matchNumberValue: extractMatchNumber(matchNumber),
    date,
    dateTimeGMT,
    team1,
    team2,
    venue,
    venueSlug: getVenueSlug(venue),
    status: matchStatus(match),
    result,
    score: buildScore(match, team1, team2),
    winner,
    predictionSlug: getPredictionSlug(team1.name, team2.name),
    detailSlug: getDetailSlug(matchNumber, team1.name, team2.name),
    tossWinner: match?.tossWinner || null,
    tossChoice: match?.tossChoice || null,
  };
}

const getDiscoveredSeries = unstable_cache(
  async (): Promise<IplSeries | null> => {
    const queries = ["indian%20premier%20league", "ipl", "tata%20ipl"];

    for (const query of queries) {
      const payload = await fetchCricApiJson(`series?search=${query}`);
      const seriesList = Array.isArray(payload?.data) ? payload.data : [];
      const series = seriesList.find((item: any) => {
        const name = String(item?.name || "").toLowerCase();
        return (
          name.includes(String(IPL_SEASON_YEAR)) &&
          (name.includes("indian premier league") || /\bipl\b/.test(name))
        );
      });

      if (series) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[IPL API] Discovered IPL series", series.name, series.id);
        }
        return {
          id: series.id,
          name: series.name,
          startDate: series.startDate,
          endDate: series.endDate,
        };
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn("[IPL API] Unable to discover IPL series for season", IPL_SEASON_YEAR);
    }

    return null;
  },
  [`ipl-series-${IPL_SEASON_YEAR}-${IPL_CACHE_VERSION}`],
  { revalidate: 60 * 30 }
);

export const getIplSchedule = unstable_cache(
  async (): Promise<IplScheduleResponse> => {
    const [series, currentMatches] = await Promise.all([
      getDiscoveredSeries(),
      getCurrentIplMatchesFromApi(),
    ]);

    let scheduleMatches = OFFICIAL_PHASE_ONE_MATCHES;
    let scheduleSource: IplScheduleResponse["source"] = "official-seed";

    if (series) {
      const payload = await fetchCricApiJson(`series_info?id=${series.id}`);
      const seriesData =
        payload?.data && typeof payload.data === "object"
          ? (payload.data as {
              matchList?: unknown;
              matchlist?: unknown;
            })
          : null;
      const matchList = Array.isArray(seriesData?.matchList)
        ? seriesData.matchList
        : Array.isArray(seriesData?.matchlist)
          ? seriesData.matchlist
          : [];
      const normalized = matchList
        .map((match: any, index: number) => normalizeApiMatch(match, index))
        .filter(Boolean) as IplMatch[];

      if (normalized.length) {
        scheduleMatches = normalized;
        scheduleSource = "cricapi";
      }
    }

    const mergedMatches = mergeScheduleWithCurrentMatches(scheduleMatches, currentMatches);
    const hydratedMatches = await hydrateCompletedMatches(mergedMatches);

    return {
      matches: hydratedMatches,
      lastUpdated: new Date().toISOString(),
      source: currentMatches.length ? "cricapi" : scheduleSource,
      series,
    };
  },
  [`ipl-schedule-${IPL_SEASON_YEAR}-${IPL_CACHE_VERSION}`],
  { revalidate: 60 }
);

const getCurrentIplMatchesFromApi = unstable_cache(
  async (): Promise<IplMatch[]> => {
    const payload = await fetchCricApiJson("currentMatches?offset=0");
    const matches = Array.isArray(payload?.data) ? payload.data : [];

    return matches
      .filter((match: any) => /ipl|indian premier league/i.test(String(match?.name || "")))
      .map((match: any, index: number) => normalizeApiMatch(match, index))
      .filter(Boolean) as IplMatch[];
  },
  [`ipl-current-matches-${IPL_SEASON_YEAR}-${IPL_CACHE_VERSION}`],
  { revalidate: 60 }
);

async function getScorecard(matchId: string) {
  const payload = await fetchCricApiJson(`match_scorecard?id=${matchId}`);
  return payload?.data ?? null;
}

const getCompletedMatchScoreSummary = unstable_cache(
  async (
    matchId: string,
    team1Name: string,
    team1ShortName: string,
    team2Name: string,
    team2ShortName: string,
    result: string | null,
    winner: string | null,
  ) => {
    const scorecardData = (await getScorecard(matchId)) as
      | {
          status?: string | null;
          matchWinner?: string | null;
          [key: string]: unknown;
        }
      | null;
    if (!scorecardData) {
      return null;
    }

    const team1 = {
      name: team1Name,
      shortName: team1ShortName,
      logo: "",
      color: "",
    } satisfies TeamInfo;
    const team2 = {
      name: team2Name,
      shortName: team2ShortName,
      logo: "",
      color: "",
    } satisfies TeamInfo;
    const resolvedResult = result || scorecardData.status || null;
    const resolvedWinner =
      resolveMatchWinnerName({
        winner: winner || scorecardData.matchWinner || null,
        result: resolvedResult,
        team1,
        team2,
      }) ||
      winner ||
      scorecardData.matchWinner ||
      null;

    return {
      score: buildScoreFromScorecard(
        {
          team1,
          team2,
          result: resolvedResult,
          winner: resolvedWinner,
        },
        scorecardData,
      ),
      result: resolvedResult,
      winner: resolvedWinner,
    };
  },
  [`ipl-completed-match-score-summary-${IPL_CACHE_VERSION}`],
  { revalidate: 60 * 60 * 24 * 30 },
);

async function hydrateCompletedMatch(match: IplMatch): Promise<IplMatch> {
  if (match.status !== "completed" || (match.score.team1 && match.score.team2)) {
    return match;
  }

  const summary = await getCompletedMatchScoreSummary(
    match.id,
    match.team1.name,
    match.team1.shortName,
    match.team2.name,
    match.team2.shortName,
    match.result,
    match.winner,
  );

  if (!summary) {
    return match;
  }

  return {
    ...match,
    result: summary.result || match.result,
    winner: summary.winner || match.winner,
    score: {
      team1: summary.score.team1 || match.score.team1,
      team2: summary.score.team2 || match.score.team2,
    },
  };
}

async function hydrateCompletedMatches(matches: IplMatch[]) {
  return Promise.all(
    matches.map((match) => hydrateCompletedMatch(applyManualMatchOverride(match))),
  );
}

export const getLatestCompletedCurrentIplMatch = unstable_cache(
  async () => {
    const currentMatches = await getCurrentIplMatchesFromApi();
    const latestCompletedMatch =
      [...currentMatches]
        .filter((match) => match.status === "completed")
        .sort((a, b) => new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime())[0] ||
      null;

    return latestCompletedMatch ? hydrateCompletedMatch(latestCompletedMatch) : null;
  },
  [`ipl-current-completed-${IPL_SEASON_YEAR}-${IPL_CACHE_VERSION}`],
  { revalidate: 60 }
);

export const getIplLiveSnapshot = unstable_cache(
  async (): Promise<IplLiveResponse> => {
    const [schedule, currentMatches] = await Promise.all([getIplSchedule(), getCurrentIplMatchesFromApi()]);
    const nowKey = getIndiaDateKey(new Date());

    const liveMatch = currentMatches.find((match) => match.status === "live");
    if (liveMatch) {
      return {
        type: "live",
        match: liveMatch,
        scorecard: await getScorecard(liveMatch.id),
        message: "Live IPL match in progress.",
        source: "cricapi-currentMatches",
        lastUpdated: new Date().toISOString(),
      };
    }

    const todayScheduledMatch = schedule.matches.find(
      (match) => match.status !== "completed" && getIndiaDateKey(match.dateTimeGMT) === nowKey
    );

    if (todayScheduledMatch) {
      return {
        type: "upcoming",
        match: todayScheduledMatch,
        message: `Today's IPL fixture starts at ${formatIndiaDateTime(todayScheduledMatch.dateTimeGMT)} IST.`,
        source: schedule.source,
        lastUpdated: new Date().toISOString(),
      };
    }

    const nextMatch = schedule.matches.find(
      (match) => match.status === "upcoming" && new Date(match.dateTimeGMT).getTime() >= Date.now()
    );

    if (nextMatch) {
      return {
        type: "upcoming",
        match: nextMatch,
        message: `Next IPL fixture starts at ${formatIndiaDateTime(nextMatch.dateTimeGMT)} IST.`,
        source: schedule.source,
        lastUpdated: new Date().toISOString(),
      };
    }

    const latestCompleted = [...schedule.matches]
      .filter((match) => match.status === "completed")
      .sort((a, b) => new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime())[0];

    if (latestCompleted) {
      return {
        type: "completed",
        match: latestCompleted,
        message: latestCompleted.result || "Latest completed IPL match.",
        source: schedule.source,
        lastUpdated: new Date().toISOString(),
      };
    }

    return {
      type: "waiting",
      message: seriesWaitingMessage(schedule.series),
      source: schedule.source,
      lastUpdated: new Date().toISOString(),
    };
  },
  [`ipl-live-snapshot-${IPL_SEASON_YEAR}-${IPL_CACHE_VERSION}`],
  { revalidate: 30 }
);

function seriesWaitingMessage(series: IplSeries | null) {
  if (series?.startDate) {
    return `The IPL ${IPL_SEASON_YEAR} season begins on ${series.startDate}.`;
  }

  return `Waiting for IPL ${IPL_SEASON_YEAR} matches.`;
}

export async function getMatchByDetailSlug(slug: string) {
  const schedule = await getIplSchedule();
  return schedule.matches.find((match) => match.detailSlug === slug) || null;
}

export async function getMatchByPredictionSlug(slug: string) {
  const schedule = await getIplSchedule();
  const matches = schedule.matches.filter((match) => match.predictionSlug === slug);

  if (!matches.length) {
    return null;
  }

  const priority = [...matches].sort((a, b) => {
    const statusWeight = (match: IplMatch) => {
      if (match.status === "live") return 0;
      if (match.status === "upcoming") return 1;
      return 2;
    };

    const weightDifference = statusWeight(a) - statusWeight(b);
    if (weightDifference !== 0) return weightDifference;
    return new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime();
  });

  return priority[0];
}

export function getMatchesForIndiaDate(matches: IplMatch[], dateKey: string) {
  return matches.filter((match) => getIndiaDateKey(match.dateTimeGMT) === dateKey);
}

export function getLatestCompletedMatch(matches: IplMatch[]) {
  return [...matches]
    .filter((match) => match.status === "completed")
    .sort((a, b) => new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime())[0] || null;
}

const STADIUM_PROFILES_INTERNAL: StadiumProfile[] = [
  {
    name: "M. Chinnaswamy Stadium",
    slug: "m-chinnaswamy-stadium-pitch-report",
    city: "Bengaluru",
    shortSummary:
      "Usually one of the quickest-scoring IPL venues because clean hitters get value from the short boundaries and fast outfield.",
    pitchSummary:
      "Expect a batting-friendly surface more often than not. The new ball can move for a brief spell, but once batters settle the bounce is true and the square boundaries keep the asking rate in play.",
    tossAngle:
      "Captains often prefer chasing here because dew and boundary size can make defense harder in the second innings.",
    bestFor: "Aggressive top-order batting and death-over finishing.",
    caution: "Mistimed pace-off bowling can disappear quickly if the surface stays hard.",
    homeTeams: ["Royal Challengers Bengaluru"],
  },
  {
    name: "Wankhede Stadium",
    slug: "wankhede-stadium-pitch-report",
    city: "Mumbai",
    shortSummary:
      "A pace-friendly venue early in the innings that still rewards strokeplay once the ball gets older.",
    pitchSummary:
      "There is usually good carry for seamers with the new ball, especially in night games, but Wankhede rarely stays quiet for long. Once the shine fades, timing through the line becomes easier and totals can accelerate quickly.",
    tossAngle:
      "Chasing is regularly attractive at Wankhede because evening moisture can reduce grip for bowlers.",
    bestFor: "Powerplay seam, high-tempo batting and hitters square of the wicket.",
    caution: "If dew arrives, yorker execution and boundary protection become far more important than raw pace.",
    homeTeams: ["Mumbai Indians"],
  },
  {
    name: "M. A. Chidambaram Stadium",
    slug: "m-a-chidambaram-stadium-pitch-report",
    city: "Chennai",
    shortSummary:
      "Chepauk is usually slower than the pure batting decks on the circuit and often rewards spin, cutters and smart pacing.",
    pitchSummary:
      "The surface can grip as the game moves on, which is why quality finger spin, wrist spin and pace-off bowling matter here. Batters who hit straight and rotate well tend to build stronger innings than all-out boundary hunters.",
    tossAngle:
      "If the strip looks dry, batting first can still be valuable because the surface often gets tougher to hit through later.",
    bestFor: "Spinners, cutters and batting units comfortable against slower pace.",
    caution: "Teams that rely only on hard-length pace can look one-dimensional at Chepauk.",
    homeTeams: ["Chennai Super Kings"],
  },
  {
    name: "Eden Gardens",
    slug: "eden-gardens-pitch-report",
    city: "Kolkata",
    shortSummary:
      "A venue that often balances strong strokeplay with enough pace and carry to keep seamers involved.",
    pitchSummary:
      "Eden Gardens frequently produces truer bounce than the slower venues, so batsmen can trust the surface if they survive the early overs. The ball also comes nicely onto the bat, although cutters and smart pace variation still matter late on.",
    tossAngle:
      "Chasing remains appealing when conditions are fresh, but the exact call depends on surface dryness more than reputation alone.",
    bestFor: "Top-order timing, quick outfield value and seamers who hit a hard length.",
    caution: "Overpitching under lights can turn into a boundary-heavy spell quickly.",
    homeTeams: ["Kolkata Knight Riders"],
  },
  {
    name: "Arun Jaitley Stadium",
    slug: "arun-jaitley-stadium-pitch-report",
    city: "Delhi",
    shortSummary:
      "Small boundaries and a generally true surface make Delhi one of the stronger batting venues in the competition.",
    pitchSummary:
      "Runs tend to be available if batters get through the first phase cleanly. The dimensions mean even mishits can clear the rope, so spinners and seamers both need sharp field settings and change-ups instead of predictable lengths.",
    tossAngle:
      "Teams often like chasing here because par scores can move quickly once one side gains momentum.",
    bestFor: "Boundary hitters, sweepers against spin and death-over specialists with slower balls.",
    caution: "Missed yorkers are expensive because the straight and square pockets are reachable.",
    homeTeams: ["Delhi Capitals"],
  },
  {
    name: "Narendra Modi Stadium",
    slug: "narendra-modi-stadium-pitch-report",
    city: "Ahmedabad",
    shortSummary:
      "The surface can vary by strip, but Ahmedabad usually offers a fair contest between batting depth and disciplined bowling.",
    pitchSummary:
      "Narendra Modi Stadium does not always play the same way because different soil bases can change pace and grip. On its truer strips, batters can score heavily; on drier ones, cutters and spin become much more relevant in the middle overs.",
    tossAngle:
      "The toss call depends heavily on the strip in use, so surface reading matters more here than blanket chasing logic.",
    bestFor: "Flexible attacks with both hit-the-deck pace and spin options.",
    caution: "One-dimensional plans can be punished if the strip behaves differently from the previous match.",
    homeTeams: ["Gujarat Titans"],
  },
  {
    name: "Rajiv Gandhi International Stadium",
    slug: "rajiv-gandhi-international-stadium-pitch-report",
    city: "Hyderabad",
    shortSummary:
      "Recent IPL games in Hyderabad have regularly leaned toward high scores and fast starts from the top order.",
    pitchSummary:
      "The ball often travels cleanly here, especially if the surface stays hard and even. That means stroke-makers can dominate square of the wicket, while bowlers need stronger pace variation and end-over execution to control damage.",
    tossAngle:
      "If the outfield is quick and evening dew is expected, captains are usually comfortable chasing.",
    bestFor: "Power hitters, openers who attack pace and bowlers with reliable slower-ball control.",
    caution: "Defending middling totals is difficult if the surface stays flat for 40 overs.",
    homeTeams: ["Sunrisers Hyderabad"],
  },
  {
    name: "Barsapara Cricket Stadium",
    slug: "barsapara-cricket-stadium-pitch-report",
    city: "Guwahati",
    shortSummary:
      "Barsapara usually gives batters value for timing and can produce fluent scoring after the powerplay.",
    pitchSummary:
      "The new ball can offer a little movement, but the bigger story is often how quickly strokeplay opens up once the ball softens. Batters who handle back-of-a-length pace well can cash in here, while cutters become important late in the innings.",
    tossAngle:
      "Chasing can be attractive, though captains still watch for any early moisture in the first innings.",
    bestFor: "Shot-makers through the off side and bowlers with slower-ball variation at the death.",
    caution: "Hard lengths without variation are easier to line up once the surface settles.",
    homeTeams: ["Rajasthan Royals"],
  },
  {
    name: "Ekana Cricket Stadium",
    slug: "ekana-cricket-stadium-pitch-report",
    city: "Lucknow",
    shortSummary:
      "Ekana has often played slower than the league's flatter batting venues, which keeps all-round bowling attacks relevant.",
    pitchSummary:
      "Lucknow surfaces have regularly asked batters to earn their scoring options. The pitch can be slightly two-paced, especially if it dries out, so teams with quality spin and pace-off options usually stay in the game longer than pure hit-the-deck attacks.",
    tossAngle:
      "Batting first is still a live option when the pitch looks dry because the chase can slow down in the middle overs.",
    bestFor: "Spinners, smart middle-over bowling and patient batting starts.",
    caution: "Teams that chase recklessly here can lose shape if the ball grips and holds.",
    homeTeams: ["Lucknow Super Giants"],
  },
  {
    name: "New PCA Stadium",
    slug: "new-pca-stadium-pitch-report",
    city: "New Chandigarh",
    shortSummary:
      "A more balanced surface where seamers can stay in the contest if they hit disciplined lengths early.",
    pitchSummary:
      "New Chandigarh generally offers a fairer contest than the smallest batting venues. Pace bowlers can find enough assistance with the new ball, while the larger boundaries also reward teams that bowl to a plan instead of searching only for magic balls.",
    tossAngle:
      "The toss is useful, but disciplined powerplay bowling can matter more than batting order at this ground.",
    bestFor: "Seamers with control, boundary riders who protect pockets and batters willing to build before launching.",
    caution: "Loose starts with the ball can still turn into catch-up cricket because the outfield stays quick.",
    homeTeams: ["Punjab Kings"],
  },
  {
    name: "Sawai Mansingh Stadium",
    slug: "sawai-mansingh-stadium-pitch-report",
    city: "Jaipur",
    shortSummary:
      "Jaipur usually sits in the balanced middle ground, rewarding good batting but still keeping spin and cutters in play.",
    pitchSummary:
      "Sawai Mansingh surfaces have often allowed batters to score once set without turning every game into a boundary sprint. The square boundaries are more forgiving than the smallest venues, so teams that rotate strike well and vary pace cleverly tend to control the game better.",
    tossAngle:
      "Captains weigh conditions carefully here because either innings can work depending on dryness and dew.",
    bestFor: "Balanced teams with reliable spinners and anchors who can accelerate late.",
    caution: "A slow start can leave too much work for finishers if the surface grips in the middle overs.",
    homeTeams: ["Rajasthan Royals"],
  },
];

export const STADIUM_PROFILES = STADIUM_PROFILES_INTERNAL;

function parseScoreParts(scoreText: string | null) {
  if (!scoreText) return null;
  const match = scoreText.match(/(\d+)\/(\d+)\s+\(([\d.]+)\)/);
  if (!match) return null;
  return {
    runs: Number(match[1]),
    wickets: Number(match[2]),
    overs: match[3],
  };
}

function oversToBalls(overs: string) {
  const [whole, partial] = overs.split(".");
  return Number(whole) * 6 + Number(partial || 0);
}

function ballsForNrr(scoreText: string | null) {
  const parsed = parseScoreParts(scoreText);
  if (!parsed) return 0;
  const balls = oversToBalls(parsed.overs);
  if (parsed.wickets === 10 && balls < 120) {
    return 120;
  }
  return balls;
}

function resultToken(match: IplMatch) {
  const winner = resolveMatchWinnerName(match);
  if (winner && winner === match.team1.name) return { team1: "W" as const, team2: "L" as const };
  if (winner && winner === match.team2.name) return { team1: "L" as const, team2: "W" as const };

  const result = String(match.result || "").toLowerCase();
  if (result.includes("no result") || result.includes("abandoned")) {
    return { team1: "NR" as const, team2: "NR" as const };
  }

  if (result.includes("tie")) {
    return { team1: "T" as const, team2: "T" as const };
  }

  return null;
}

export function buildPointsTable(matches: IplMatch[]) {
  const rows = new Map<string, PointsTableRow>();

  for (const team of TEAMS) {
    rows.set(team.name, {
      team: toTeamInfo(team.name, team.logoUrl, team.abbreviation),
      played: 0,
      wins: 0,
      losses: 0,
      noResult: 0,
      ties: 0,
      points: 0,
      runsFor: 0,
      runsAgainst: 0,
      ballsFaced: 0,
      ballsBowled: 0,
      nrr: 0,
      form: [],
    });
  }

  const completedMatches = matches
    .filter((match) => match.status === "completed")
    .sort((a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime());

  for (const match of completedMatches) {
    const team1 = rows.get(match.team1.name);
    const team2 = rows.get(match.team2.name);

    if (!team1 || !team2) {
      continue;
    }

    const token = resultToken(match);

    team1.played += 1;
    team2.played += 1;

    if (token?.team1 === "W") {
      team1.wins += 1;
      team1.points += 2;
      team2.losses += 1;
    } else if (token?.team2 === "W") {
      team2.wins += 1;
      team2.points += 2;
      team1.losses += 1;
    } else if (token?.team1 === "NR") {
      team1.noResult += 1;
      team2.noResult += 1;
      team1.points += 1;
      team2.points += 1;
    } else if (token?.team1 === "T") {
      team1.ties += 1;
      team2.ties += 1;
      team1.points += 1;
      team2.points += 1;
    }

    if (token) {
      team1.form.push(token.team1);
      team2.form.push(token.team2);
    }

    const score1 = parseScoreParts(match.score.team1);
    const score2 = parseScoreParts(match.score.team2);

    if (score1 && score2) {
      team1.runsFor += score1.runs;
      team1.runsAgainst += score2.runs;
      team1.ballsFaced += ballsForNrr(match.score.team1);
      team1.ballsBowled += ballsForNrr(match.score.team2);

      team2.runsFor += score2.runs;
      team2.runsAgainst += score1.runs;
      team2.ballsFaced += ballsForNrr(match.score.team2);
      team2.ballsBowled += ballsForNrr(match.score.team1);
    }
  }

  return [...rows.values()]
    .map((row) => ({
      ...row,
      form: row.form.slice(-5),
      nrr:
        row.ballsFaced && row.ballsBowled
          ? Number(
              (
                row.runsFor / (row.ballsFaced / 6) -
                row.runsAgainst / (row.ballsBowled / 6)
              ).toFixed(3)
            )
          : 0,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.nrr !== a.nrr) return b.nrr - a.nrr;
      return a.team.name.localeCompare(b.team.name);
    });
}

type KeyPlayerStats = {
  runs?: number;
  wickets?: number;
  average?: number;
  strikeRate?: number;
  economy?: number;
};

function buildPlayerStatLine(name: string, stats: KeyPlayerStats) {
  if (stats.runs && stats.wickets) {
    return `${stats.runs} runs and ${stats.wickets} wickets in the current squad dataset`;
  }
  if (stats.runs) {
    return `${stats.runs} runs in the current squad dataset`;
  }
  if (stats.wickets) {
    return `${stats.wickets} wickets in the current squad dataset`;
  }
  return `${name} is part of the current squad tracker`;
}

export function getKeyPlayers(teamName: string, limit = 4): KeyPlayer[] {
  const normalized = normalizeTeamName(teamName);

  return PLAYERS.filter((player) => normalizeTeamName(player.currentTeam) === normalized)
    .map((player) => {
      const stats = player.stats || {};
      const impact =
        (stats.runs || 0) +
        (stats.wickets || 0) * 25 +
        (stats.average || 0) +
        (stats.strikeRate || 0) / 2 +
        (stats.economy ? Math.max(0, 12 - stats.economy) * 10 : 0);

      const statLine = buildPlayerStatLine(player.name, stats);

      return {
        id: player.id,
        name: player.name,
        role: player.role,
        team: normalized,
        statLine,
        impact,
      };
    })
    .sort((a, b) => b.impact - a.impact)
    .slice(0, limit)
    .map(({ impact: _impact, ...player }) => player);
}

export function getStadiumProfile(slug: string) {
  const canonicalSlug = PITCH_SLUG_ALIASES.get(slug) || slug;
  return STADIUM_PROFILES_INTERNAL.find((profile) => profile.slug === canonicalSlug) || null;
}

export function getStadiumProfileByVenue(venue: string) {
  return getStadiumProfile(getVenueSlug(venue));
}

export function getPredictionForMatch(match: IplMatch) {
  const team1Profile = TEAMS.find((team) => team.name === match.team1.name);
  const team2Profile = TEAMS.find((team) => team.name === match.team2.name);
  const homeAdvantageTeam =
    TEAMS.find((team) => getVenueSlug(team.venue) === match.venueSlug)?.name ||
    getStadiumProfileByVenue(match.venue)?.homeTeams[0] ||
    null;

  let team1Score = 0;
  let team2Score = 0;
  const reasons: string[] = [];

  if (homeAdvantageTeam === match.team1.name) {
    team1Score += 1.2;
    reasons.push(`${match.team1.shortName} have the venue familiarity edge at ${getVenueBaseName(match.venue)}.`);
  } else if (homeAdvantageTeam === match.team2.name) {
    team2Score += 1.2;
    reasons.push(`${match.team2.shortName} have the venue familiarity edge at ${getVenueBaseName(match.venue)}.`);
  }

  if (team1Profile && team2Profile) {
    if (team1Profile.lastYearRank < team2Profile.lastYearRank) {
      team1Score += 0.8;
      reasons.push(`${match.team1.shortName} finished ahead of ${match.team2.shortName} in the 2025 league standings.`);
    } else if (team2Profile.lastYearRank < team1Profile.lastYearRank) {
      team2Score += 0.8;
      reasons.push(`${match.team2.shortName} finished ahead of ${match.team1.shortName} in the 2025 league standings.`);
    }
  }

  const stadiumProfile = getStadiumProfileByVenue(match.venue);
  if (stadiumProfile) {
    reasons.push(stadiumProfile.shortSummary);
  }

  const winner = team1Score >= team2Score ? match.team1 : match.team2;
  const confidenceDelta = Math.abs(team1Score - team2Score);

  return {
    winner,
    confidence: confidenceDelta >= 1.2 ? "Moderate edge" : "Slight edge",
    reasons: reasons.slice(0, 3),
  };
}
