import { unstable_cache } from "next/cache";
import { fetchCricApiJson } from "@/lib/cricapi-client";
import { PLAYERS, TEAMS } from "@/lib/data";
import {
  discoverOfficialIplCompetition,
  fetchOfficialIplScheduleFeed,
  type OfficialIplCompetition,
} from "@/lib/ipl-official-client";
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
  startDate: string | null;
  endDate: string | null;
};

export type LiveBatterSummary = {
  name: string;
  runs: number | null;
  balls: number | null;
  fours: number | null;
  sixes: number | null;
  strikeRate: number | null;
  image: string | null;
};

export type LiveBowlerSummary = {
  name: string;
  overs: string | null;
  runs: number | null;
  wickets: number | null;
  maidens: number | null;
  economy: number | null;
  image: string | null;
};

export type MatchLiveContext = {
  commentary: string | null;
  chaseText: string | null;
  currentInnings: number | null;
  currentBatters: LiveBatterSummary[];
  currentBowler: LiveBowlerSummary | null;
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
  liveContext?: MatchLiveContext | null;
};

export type IplScheduleResponse = {
  matches: IplMatch[];
  lastUpdated: string;
  source: "official-feed" | "cricapi" | "unavailable";
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

function normalizeWhitespace(value: string | null | undefined) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractYear(value: unknown) {
  const match = String(value || "").match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function toNullableNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function parseScoreSummaryText(scoreText: string | null | undefined) {
  const normalized = normalizeWhitespace(scoreText);

  if (!normalized) {
    return null;
  }

  const match = normalized.match(/(\d+)\s*\/\s*(\d+)\s*\(([\d.]+)\s*(?:ov|overs?)?\.?\)/i);
  if (!match) {
    return null;
  }

  return {
    runs: Number(match[1]),
    wickets: Number(match[2]),
    overs: match[3],
  };
}

function normalizeScoreSummaryText(scoreText: string | null | undefined) {
  const parsed = parseScoreSummaryText(scoreText);

  if (!parsed) {
    return normalizeWhitespace(scoreText) || null;
  }

  return `${parsed.runs}/${parsed.wickets} (${parsed.overs})`;
}

function buildOfficialDateTimeGmt(match: any, fallbackDate: string) {
  const gmtDate = String(match?.GMTMatchDate || "").trim() || fallbackDate;
  const gmtTime = String(match?.GMTMatchTime || "")
    .replace(/\s*GMT/i, "")
    .trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(gmtDate) && /^\d{1,2}:\d{2}$/.test(gmtTime)) {
    return `${gmtDate}T${gmtTime}:00Z`;
  }

  const commenceAt = normalizeWhitespace(match?.MATCH_COMMENCE_START_DATE);
  if (commenceAt) {
    const parsed = new Date(commenceAt.replace(" ", "T") + "+05:30");
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return `${fallbackDate}T14:00:00Z`;
}

function parseTossChoice(details: string | null | undefined) {
  const normalized = normalizeWhitespace(details).toLowerCase();

  if (!normalized) {
    return null;
  }

  if (normalized.includes("field") || normalized.includes("bowl")) {
    return "bowl";
  }

  if (normalized.includes("bat")) {
    return "bat";
  }

  return null;
}

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
  const startTime = new Date(match?.dateTimeGMT || "").getTime();
  const now = Date.now();

  if (match?.matchEnded || COMPLETED_STATUS_PATTERN.test(statusText)) {
    return "completed";
  }

  if (
    hasRecordedScore(match) &&
    Number.isFinite(startTime) &&
    startTime > 0 &&
    now - startTime > 8 * 60 * 60 * 1000
  ) {
    return "completed";
  }

  if (match?.matchStarted || LIVE_STATUS_PATTERN.test(statusText) || hasRecordedScore(match)) {
    return "live";
  }

  if (Number.isFinite(startTime) && startTime > 0 && now >= startTime && !match?.matchEnded) {
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

function getOfficialScoreEntries(match: any) {
  return [
    {
      teamName: normalizeWhitespace(match?.FirstBattingTeamName),
      score: normalizeScoreSummaryText(match?.FirstBattingSummary || match?.["1Summary"]),
    },
    {
      teamName: normalizeWhitespace(match?.SecondBattingTeamName),
      score: normalizeScoreSummaryText(match?.SecondBattingSummary || match?.["2Summary"]),
    },
    {
      teamName: normalizeWhitespace(match?.SecondInningsFirstBattingName),
      score: normalizeScoreSummaryText(match?.["3Summary"]),
    },
    {
      teamName: normalizeWhitespace(match?.SecondInningsSecondBattingName),
      score: normalizeScoreSummaryText(match?.["4Summary"]),
    },
  ].filter((entry) => entry.teamName && entry.score);
}

function buildOfficialScore(match: any, team1: TeamInfo, team2: TeamInfo): MatchScore {
  const entries = getOfficialScoreEntries(match);

  const findTeamScore = (team: TeamInfo) => {
    const matchEntry = entries.find((entry) => textMentionsTeam(entry.teamName, team));
    return matchEntry?.score || null;
  };

  return {
    team1: findTeamScore(team1),
    team2: findTeamScore(team2),
  };
}

function getOfficialMatchStatus(match: any): MatchStatus {
  const rawStatus = normalizeWhitespace(match?.MatchStatus).toLowerCase();
  const resultText = normalizeWhitespace(match?.Commentss || match?.Comments);
  const hasOfficialScore = getOfficialScoreEntries(match).length > 0;
  const startAt = new Date(buildOfficialDateTimeGmt(match, String(match?.MatchDate || ""))).getTime();
  const now = Date.now();

  if (
    rawStatus === "post" ||
    rawStatus === "completed" ||
    rawStatus === "result" ||
    COMPLETED_STATUS_PATTERN.test(resultText) ||
    normalizeWhitespace(match?.WinningTeamID)
  ) {
    return "completed";
  }

  if (rawStatus === "live" || rawStatus === "in progress" || LIVE_STATUS_PATTERN.test(resultText)) {
    return "live";
  }

  if (hasOfficialScore && Number.isFinite(startAt) && startAt > 0 && now >= startAt) {
    return "live";
  }

  return "upcoming";
}

function buildOfficialLiveContext(match: any): MatchLiveContext | null {
  const currentBatters: LiveBatterSummary[] = [
    {
      name: normalizeWhitespace(match?.CurrentStrikerName),
      runs: toNullableNumber(match?.StrikerRuns),
      balls: toNullableNumber(match?.StrikerBalls),
      fours: toNullableNumber(match?.StrikerFours),
      sixes: toNullableNumber(match?.StrikerSixes),
      strikeRate: toNullableNumber(match?.StrikerSR),
      image: normalizeWhitespace(match?.StrikerImage) || null,
    },
    {
      name: normalizeWhitespace(match?.CurrentNonStrikerName),
      runs: toNullableNumber(match?.NonStrikerRuns),
      balls: toNullableNumber(match?.NonStrikerBalls),
      fours: toNullableNumber(match?.NonStrikerFours),
      sixes: toNullableNumber(match?.NonStrikerSixes),
      strikeRate: toNullableNumber(match?.NonStrikerSR),
      image: normalizeWhitespace(match?.NonStrikerImage) || null,
    },
  ].filter((player) => player.name);

  const bowlerName = normalizeWhitespace(match?.CurrentBowlerName);
  const currentBowler: LiveBowlerSummary | null = bowlerName
    ? {
        name: bowlerName,
        overs: normalizeWhitespace(match?.BowlerOvers) || null,
        runs: toNullableNumber(match?.BowlerRuns),
        wickets: toNullableNumber(match?.BowlerWickets),
        maidens: toNullableNumber(match?.BowlerMaidens),
        economy: toNullableNumber(match?.BowlerEconomy),
        image: normalizeWhitespace(match?.BowlerImage) || null,
      }
    : null;

  const commentary = normalizeWhitespace(match?.Comments || match?.MatchBreakComments) || null;
  const chaseText = normalizeWhitespace(match?.ChasingText) || null;
  const currentInnings = toNullableNumber(match?.CurrentInnings);

  if (!commentary && !chaseText && !currentBatters.length && !currentBowler) {
    return null;
  }

  return {
    commentary,
    chaseText,
    currentInnings,
    currentBatters,
    currentBowler,
  };
}

function getOfficialResultText(match: any, status: MatchStatus) {
  if (status === "completed") {
    return normalizeWhitespace(match?.Commentss || match?.Comments) || null;
  }

  if (status === "live") {
    return normalizeWhitespace(match?.Comments || match?.ChasingText || match?.MatchBreakComments) || null;
  }

  return normalizeWhitespace(match?.TossDetails) || null;
}

function sortMatchesByStartTime(matches: IplMatch[]) {
  return [...matches].sort(
    (a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime(),
  );
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
    liveContext: null,
  };
}

function normalizeOfficialSeries(competition: OfficialIplCompetition | null): IplSeries | null {
  if (!competition) {
    return null;
  }

  return {
    id: competition.id,
    name: competition.name,
    startDate: null,
    endDate: null,
  };
}

function normalizeOfficialMatch(match: any, index: number): IplMatch | null {
  const homeTeamName = normalizeWhitespace(match?.HomeTeamName);
  const awayTeamName = normalizeWhitespace(match?.AwayTeamName);

  if (!homeTeamName || !awayTeamName) {
    return null;
  }

  const team1 = toTeamInfo(
    homeTeamName,
    match?.MatchHomeTeamLogo || match?.HomeTeamLogo,
    match?.HomeTeamCode || match?.HomeTeamShortName,
  );
  const team2 = toTeamInfo(
    awayTeamName,
    match?.MatchAwayTeamLogo || match?.AwayTeamLogo,
    match?.AwayTeamCode || match?.AwayTeamShortName,
  );
  const date = String(match?.GMTMatchDate || match?.MatchDate || "").trim() || getIndiaDateKey(new Date());
  const dateTimeGMT = buildOfficialDateTimeGmt(match, date);
  const matchNumber = normalizeWhitespace(match?.MatchOrder) || `Match ${index + 1}`;
  const status = getOfficialMatchStatus(match);
  const venueBase = normalizeWhitespace(match?.GroundName) || "TBD";
  const city = normalizeWhitespace(match?.city);
  const venue = city && !venueBase.toLowerCase().includes(city.toLowerCase()) ? `${venueBase}, ${city}` : venueBase;
  const result = getOfficialResultText(match, status);
  const winner =
    resolveMatchWinnerName({
      winner: normalizeWhitespace(match?.WinningTeamName) || normalizeWhitespace(match?.WinningTeamID),
      result,
      team1,
      team2,
    }) ||
    (String(match?.WinningTeamID || "") === String(match?.HomeTeamID || "") ? team1.name : null) ||
    (String(match?.WinningTeamID || "") === String(match?.AwayTeamID || "") ? team2.name : null) ||
    null;

  return {
    id: String(match?.MatchID || `${slugify(team1.name)}-${slugify(team2.name)}-${index + 1}`),
    matchNumber,
    matchNumberValue: extractMatchNumber(matchNumber),
    date,
    dateTimeGMT,
    team1,
    team2,
    venue,
    venueSlug: getVenueSlug(venue),
    status,
    result,
    score: buildOfficialScore(match, team1, team2),
    winner,
    predictionSlug: getPredictionSlug(team1.name, team2.name),
    detailSlug: getDetailSlug(matchNumber, team1.name, team2.name),
    tossWinner: normalizeWhitespace(match?.TossTeam) || null,
    tossChoice: parseTossChoice(match?.TossDetails),
    liveContext: buildOfficialLiveContext(match),
  };
}

const getDiscoveredSeries = unstable_cache(
  async (): Promise<IplSeries | null> => {
    const queries = [
      "indian%20premier%20league",
      "ipl",
      "tata%20ipl",
      `indian%20premier%20league%20${IPL_SEASON_YEAR}`,
      `tata%20ipl%20${IPL_SEASON_YEAR}`,
    ];
    const discoveredSeries = new Map<string, IplSeries & { score: number }>();

    for (const query of queries) {
      const payload = await fetchCricApiJson(`series?search=${query}`);
      const seriesList = Array.isArray(payload?.data) ? payload.data : [];

      for (const item of seriesList) {
        const id = String(item?.id || "");
        const name = String(item?.name || "").toLowerCase();

        if (!id || (!name.includes("indian premier league") && !/\bipl\b/.test(name))) {
          continue;
        }

        const discoveredYear = extractYear(item?.name || item?.startDate || item?.endDate);
        let score = 0;

        if (name.includes("indian premier league")) score += 80;
        if (/\bipl\b/.test(name)) score += 40;
        if (discoveredYear === IPL_SEASON_YEAR) score += 100;
        if (discoveredYear) score += discoveredYear;

        const currentBest = discoveredSeries.get(id);
        if (!currentBest || score > currentBest.score) {
          discoveredSeries.set(id, {
            id,
            name: String(item?.name || ""),
            startDate: item?.startDate || null,
            endDate: item?.endDate || null,
            score,
          });
        }
      }
    }

    const series = [...discoveredSeries.values()].sort((left, right) => right.score - left.score)[0];

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

    if (process.env.NODE_ENV !== "production") {
      console.warn("[IPL API] Unable to discover IPL series for season", IPL_SEASON_YEAR);
    }

    return null;
  },
  [`ipl-series-${IPL_SEASON_YEAR}-${IPL_CACHE_VERSION}`],
  { revalidate: 60 * 30 }
);

async function getCricApiScheduleFallback() {
  const series = await getDiscoveredSeries();
  const currentMatches = await getCurrentIplMatchesFromApi();

  if (!series) {
    return {
      matches: currentMatches,
      series: null as IplSeries | null,
    };
  }

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
  const normalizedMatches = matchList
    .map((match: any, index: number) => normalizeApiMatch(match, index))
    .filter(Boolean) as IplMatch[];

  return {
    matches: normalizedMatches.length ? normalizedMatches : currentMatches,
    series,
  };
}

export const getIplSchedule = unstable_cache(
  async (): Promise<IplScheduleResponse> => {
    const lastUpdated = new Date().toISOString();
    let officialCompetition: OfficialIplCompetition | null = null;

    try {
      officialCompetition = await discoverOfficialIplCompetition();

      if (officialCompetition) {
        const officialMatches = (await fetchOfficialIplScheduleFeed(officialCompetition))
          .map((match: any, index: number) => normalizeOfficialMatch(match, index))
          .filter(Boolean) as IplMatch[];

        if (officialMatches.length) {
          return {
            matches: sortMatchesByStartTime(officialMatches),
            lastUpdated,
            source: "official-feed",
            series: normalizeOfficialSeries(officialCompetition),
          };
        }

        console.warn("[IPL Data] Official schedule feed returned no matches", {
          competitionId: officialCompetition.id,
          competitionName: officialCompetition.name,
        });
      }
    } catch (error) {
      console.error("[IPL Data] Official schedule feed failed", {
        reason: error instanceof Error ? error.message : String(error),
      });
    }

    const cricApiSchedule = await getCricApiScheduleFallback();
    const hydratedMatches = await hydrateCompletedMatches(cricApiSchedule.matches, "cricapi");

    if (hydratedMatches.length) {
      return {
        matches: sortMatchesByStartTime(hydratedMatches),
        lastUpdated,
        source: "cricapi",
        series: cricApiSchedule.series,
      };
    }

    return {
      matches: [],
      lastUpdated,
      source: "unavailable",
      series: normalizeOfficialSeries(officialCompetition) ?? cricApiSchedule.series,
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

async function hydrateCompletedMatches(
  matches: IplMatch[],
  source: IplScheduleResponse["source"],
) {
  if (source !== "cricapi") {
    return matches;
  }

  return Promise.all(matches.map((match) => hydrateCompletedMatch(match)));
}

export const getLatestCompletedCurrentIplMatch = unstable_cache(
  async () => {
    const schedule = await getIplSchedule();
    return getLatestCompletedMatch(schedule.matches);
  },
  [`ipl-current-completed-${IPL_SEASON_YEAR}-${IPL_CACHE_VERSION}`],
  { revalidate: 60 }
);

export const getIplLiveSnapshot = unstable_cache(
  async (): Promise<IplLiveResponse> => {
    const schedule = await getIplSchedule();
    const nowKey = getIndiaDateKey(new Date());

    const liveMatch = schedule.matches.find((match) => match.status === "live");
    if (liveMatch) {
      return {
        type: "live",
        match: liveMatch,
        scorecard: schedule.source === "cricapi" ? await getScorecard(liveMatch.id) : null,
        message:
          liveMatch.liveContext?.chaseText ||
          liveMatch.liveContext?.commentary ||
          liveMatch.result ||
          "Live IPL match in progress.",
        source: schedule.source,
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
        message:
          todayScheduledMatch.result ||
          `Today's IPL fixture starts at ${formatIndiaDateTime(todayScheduledMatch.dateTimeGMT)} IST.`,
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
        message:
          nextMatch.result ||
          `Next IPL fixture starts at ${formatIndiaDateTime(nextMatch.dateTimeGMT)} IST.`,
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
    return `${series.name} begins on ${series.startDate}.`;
  }

  if (series?.name) {
    return `Waiting for ${series.name} matches.`;
  }

  return "Waiting for IPL matches.";
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
