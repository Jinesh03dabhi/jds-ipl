import { TEAMS } from "@/lib/data";
import { resolveMatchWinnerName } from "@/lib/ipl-data";
import type { IplMatch, TeamInfo } from "@/lib/ipl-data";

export type PointsTableResult = "W" | "L" | "NR" | "T";

export type PointsTableMatchInput = {
  matchId: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  oversA: number | string;
  scoreB: number;
  oversB: number | string;
  winner: string | null;
  outcome?: "completed" | "noResult" | "tie";
  allOutA?: boolean;
  allOutB?: boolean;
  maxOvers?: number;
  completedAt?: string;
};

export type PointsTableEntry = {
  team: TeamInfo;
  played: number;
  won: number;
  lost: number;
  noResult: number;
  points: number;
  runsScored: number;
  runsConceded: number;
  oversFaced: number;
  oversBowled: number;
  netRunRate: number;
  lastMatchResult: PointsTableResult | null;
  form: PointsTableResult[];
  position: number;
  previousPosition: number;
  positionChange: number;
  isPlayoffZone: boolean;
};

export type PointsTableState = {
  rows: PointsTableEntry[];
  appliedMatchIds: string[];
  lastUpdated: string | null;
};

type ParsedScore = {
  runs: number;
  wickets: number;
  overs: string;
};

const DEFAULT_MAX_OVERS = 20;

function roundToThree(value: number) {
  return Number(value.toFixed(3));
}

function normalizeTeamInfo(name: string): TeamInfo {
  const team = TEAMS.find((item) => item.name === name);

  return {
    id: team?.id,
    name,
    shortName:
      team?.abbreviation ||
      name
        .split(" ")
        .map((part) => part[0])
        .join(""),
    logo: team?.logoUrl || "/jds-ipl-logo-1.png",
    color: team?.color || "#334155",
  };
}

function createEmptyEntry(name: string): PointsTableEntry {
  return {
    team: normalizeTeamInfo(name),
    played: 0,
    won: 0,
    lost: 0,
    noResult: 0,
    points: 0,
    runsScored: 0,
    runsConceded: 0,
    oversFaced: 0,
    oversBowled: 0,
    netRunRate: 0,
    lastMatchResult: null,
    form: [],
    position: 0,
    previousPosition: 0,
    positionChange: 0,
    isPlayoffZone: false,
  };
}

function getSortFallbackValue(row: PointsTableEntry) {
  return row.previousPosition || Number.MAX_SAFE_INTEGER;
}

function cloneEntry(row: PointsTableEntry): PointsTableEntry {
  return {
    ...row,
    team: { ...row.team },
    form: [...row.form],
  };
}

function resolveOutcome(match: PointsTableMatchInput) {
  if (match.outcome === "tie") {
    return { teamA: "T" as const, teamB: "T" as const };
  }

  if (match.outcome === "noResult" || match.winner === null) {
    return { teamA: "NR" as const, teamB: "NR" as const };
  }

  if (match.winner === match.teamA) {
    return { teamA: "W" as const, teamB: "L" as const };
  }

  if (match.winner === match.teamB) {
    return { teamA: "L" as const, teamB: "W" as const };
  }

  return { teamA: "NR" as const, teamB: "NR" as const };
}

function parseScoreString(scoreText: string | null) {
  if (!scoreText) {
    return null;
  }

  const match = scoreText.match(/(\d+)\/(\d+)\s+\(([\d.]+)\)/);

  if (!match) {
    return null;
  }

  return {
    runs: Number(match[1]),
    wickets: Number(match[2]),
    overs: match[3],
  } satisfies ParsedScore;
}

function normalizeOversForNrr(
  overs: number | string,
  isAllOut = false,
  maxOvers = DEFAULT_MAX_OVERS,
) {
  const decimalOvers = oversToDecimal(overs);

  if (isAllOut && decimalOvers > 0 && decimalOvers < maxOvers) {
    return maxOvers;
  }

  return decimalOvers;
}

function applyResultToEntry(entry: PointsTableEntry, result: PointsTableResult) {
  entry.played += 1;
  entry.lastMatchResult = result;
  entry.form = [...entry.form, result].slice(-5);

  if (result === "W") {
    entry.won += 1;
    entry.points += 2;
  } else if (result === "L") {
    entry.lost += 1;
  } else if (result === "NR") {
    entry.noResult += 1;
    entry.points += 1;
  } else if (result === "T") {
    entry.points += 1;
  }
}

function applyScoreToEntry(
  entry: PointsTableEntry,
  runsScored: number,
  runsConceded: number,
  oversFaced: number,
  oversBowled: number,
) {
  entry.runsScored += runsScored;
  entry.runsConceded += runsConceded;
  entry.oversFaced += oversFaced;
  entry.oversBowled += oversBowled;
  entry.netRunRate = calculateNRR(entry);
}

function entryMapToRows(map: Map<string, PointsTableEntry>) {
  return [...map.values()].map(cloneEntry);
}

export function oversToDecimal(overs: number | string) {
  const normalized = String(overs).trim();

  if (!normalized) {
    return 0;
  }

  const [wholePart = "0", ballsPart = "0"] = normalized.split(".");
  const completedOvers = Number(wholePart);
  const balls = Number(ballsPart);

  if (!Number.isFinite(completedOvers) || !Number.isFinite(balls)) {
    throw new Error(`Invalid overs value: ${overs}`);
  }

  if (completedOvers < 0) {
    throw new Error(`Overs cannot be negative: ${overs}`);
  }

  if (ballsPart && (balls < 0 || balls > 5)) {
    throw new Error(`Invalid ball count in overs value: ${overs}`);
  }

  return completedOvers + balls / 6;
}

export function calculateNRR(
  team: Pick<
    PointsTableEntry,
    "runsScored" | "runsConceded" | "oversFaced" | "oversBowled"
  >,
) {
  if (team.oversFaced <= 0 || team.oversBowled <= 0) {
    return 0;
  }

  const scoredRate = team.runsScored / team.oversFaced;
  const concededRate = team.runsConceded / team.oversBowled;
  return roundToThree(scoredRate - concededRate);
}

export function sortPointsTable(rows: PointsTableEntry[]) {
  const sortedRows = [...rows].sort((left, right) => {
    if (right.points !== left.points) {
      return right.points - left.points;
    }

    if (right.netRunRate !== left.netRunRate) {
      return right.netRunRate - left.netRunRate;
    }

    const previousPositionDelta = getSortFallbackValue(left) - getSortFallbackValue(right);
    if (previousPositionDelta !== 0) {
      return previousPositionDelta;
    }

    return left.team.name.localeCompare(right.team.name);
  });

  return sortedRows.map((row, index) => {
    const position = index + 1;
    const previousPosition = row.previousPosition || position;

    return {
      ...row,
      position,
      previousPosition,
      positionChange: previousPosition - position,
      isPlayoffZone: position <= 4,
    };
  });
}

export function createPointsTableSeed() {
  return sortPointsTable(
    TEAMS.map((team, index) => ({
      team: {
        id: team.id,
        name: team.name,
        shortName: team.abbreviation,
        logo: team.logoUrl,
        color: team.color,
      },
      played: 0,
      won: 0,
      lost: 0,
      noResult: 0,
      points: 0,
      runsScored: 0,
      runsConceded: 0,
      oversFaced: 0,
      oversBowled: 0,
      netRunRate: 0,
      lastMatchResult: null,
      form: [],
      position: index + 1,
      previousPosition: index + 1,
      positionChange: 0,
      isPlayoffZone: index < 4,
    })),
  );
}

export function updatePointsTable(
  currentRows: PointsTableEntry[],
  match: PointsTableMatchInput,
) {
  const entries = new Map(
    currentRows.map((row) => [row.team.name, cloneEntry(row)]),
  );

  const teamAEntry = entries.get(match.teamA) || createEmptyEntry(match.teamA);
  const teamBEntry = entries.get(match.teamB) || createEmptyEntry(match.teamB);

  entries.set(teamAEntry.team.name, teamAEntry);
  entries.set(teamBEntry.team.name, teamBEntry);

  const outcome = resolveOutcome(match);
  applyResultToEntry(teamAEntry, outcome.teamA);
  applyResultToEntry(teamBEntry, outcome.teamB);

  const maxOvers = match.maxOvers ?? DEFAULT_MAX_OVERS;
  applyScoreToEntry(
    teamAEntry,
    match.scoreA,
    match.scoreB,
    normalizeOversForNrr(match.oversA, match.allOutA, maxOvers),
    normalizeOversForNrr(match.oversB, match.allOutB, maxOvers),
  );
  applyScoreToEntry(
    teamBEntry,
    match.scoreB,
    match.scoreA,
    normalizeOversForNrr(match.oversB, match.allOutB, maxOvers),
    normalizeOversForNrr(match.oversA, match.allOutA, maxOvers),
  );

  return sortPointsTable(entryMapToRows(entries));
}

export function createPointsTableState(initialMatches: PointsTableMatchInput[] = []): PointsTableState {
  const appliedMatchIds: string[] = [];
  let rows = createPointsTableSeed();

  for (const match of initialMatches) {
    if (appliedMatchIds.includes(match.matchId)) {
      continue;
    }

    rows = updatePointsTable(rows, match);
    appliedMatchIds.push(match.matchId);
  }

  return {
    rows,
    appliedMatchIds,
    lastUpdated: initialMatches.at(-1)?.completedAt || null,
  };
}

export function applyMatchUpdate(
  state: PointsTableState,
  match: PointsTableMatchInput,
): PointsTableState {
  if (state.appliedMatchIds.includes(match.matchId)) {
    return state;
  }

  return {
    rows: updatePointsTable(state.rows, match),
    appliedMatchIds: [...state.appliedMatchIds, match.matchId],
    lastUpdated: match.completedAt || new Date().toISOString(),
  };
}

export function parsePointsTableMatch(match: IplMatch): PointsTableMatchInput | null {
  const scoreA = parseScoreString(match.score.team1);
  const scoreB = parseScoreString(match.score.team2);

  if (!scoreA || !scoreB) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[PointsTable] Skipping completed match without parsable score data", {
        id: match.id,
        result: match.result,
        winner: match.winner,
        score: match.score,
      });
    }
    return null;
  }

  const resultText = String(match.result || "").toLowerCase();
  const outcome =
    resultText.includes("no result") || resultText.includes("abandoned")
      ? "noResult"
      : resultText.includes("tie") && !match.winner
      ? "tie"
      : "completed";

  return {
    matchId: match.id,
    teamA: match.team1.name,
    teamB: match.team2.name,
    scoreA: scoreA.runs,
    oversA: scoreA.overs,
    scoreB: scoreB.runs,
    oversB: scoreB.overs,
    winner: resolveMatchWinnerName(match) || match.winner,
    outcome,
    allOutA: scoreA.wickets === 10,
    allOutB: scoreB.wickets === 10,
    completedAt: match.dateTimeGMT,
  } satisfies PointsTableMatchInput;
}

export function getCompletedMatchInputs(matches: IplMatch[]): PointsTableMatchInput[] {
  return matches
    .filter((match) => match.status === "completed")
    .map(parsePointsTableMatch)
    .filter((match): match is PointsTableMatchInput => Boolean(match));
}

export const POINTS_TABLE_MOCK_MATCH: PointsTableMatchInput = {
  matchId: "demo-mi-vs-csk-finished",
  teamA: "Mumbai Indians",
  teamB: "Chennai Super Kings",
  scoreA: 186,
  oversA: 20,
  scoreB: 182,
  oversB: 19.4,
  winner: "Mumbai Indians",
  completedAt: "2026-04-20T17:00:00Z",
};
