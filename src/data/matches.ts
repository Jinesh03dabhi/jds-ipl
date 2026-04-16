import { IPL_DATA } from "./seasons";
import type { Player, Team, TeamId } from "./types";
import { SEO_VENUES, normalizeVenueName } from "./venues";
import { generateMatchSlug } from "@/lib/slug";

export type MatchMargin = {
  type: "runs" | "wickets";
  value: number;
};

export type MatchBatterLine = {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal: string;
};

export type MatchBowlerLine = {
  playerId: string;
  name: string;
  overs: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
};

export type MatchInnings = {
  teamId: TeamId;
  runs: number;
  wickets: number;
  overs: string;
  extras: number;
  batters: MatchBatterLine[];
  bowlers: MatchBowlerLine[];
};

export type MatchTimelineEvent = {
  over: string;
  title: string;
  description: string;
  teamId?: TeamId;
};

export type SeoMatch = {
  id: string;
  slug: string;
  season: number;
  matchNumber: number;
  label: string;
  date: string;
  team1Id: TeamId;
  team2Id: TeamId;
  venueId: string;
  tossWinnerId: TeamId;
  tossDecision: "bat" | "field";
  winnerId: TeamId;
  margin: MatchMargin;
  result: string;
  innings: [MatchInnings, MatchInnings];
  timeline: MatchTimelineEvent[];
};

const MATCH_SEASONS = [2023, 2024, 2025, 2026];
const ALL_TEAMS = [...IPL_DATA.teams].sort((left, right) =>
  left.name.localeCompare(right.name),
);

const PLAYERS_BY_TEAM = IPL_DATA.players.reduce<Map<TeamId, Player[]>>((map, player) => {
  const existing = map.get(player.currentTeamId) ?? [];
  existing.push(player);
  map.set(player.currentTeamId, existing);
  return map;
}, new Map<TeamId, Player[]>());

const TEAM_BY_ID = new Map(ALL_TEAMS.map((team) => [team.id, team]));
const VENUE_BY_ID = new Map(SEO_VENUES.map((venue) => [venue.id, venue]));

function createSeed(...parts: Array<string | number>) {
  return parts.join("|").split("").reduce((total, char, index) => {
    return total + char.charCodeAt(0) * (index + 1);
  }, 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ratingFromPlayer(player: Player) {
  const runs = player.stats.runs ?? 0;
  const wickets = player.stats.wickets ?? 0;
  const average = player.stats.average ?? 0;
  const strikeRate = player.stats.strikeRate ?? 120;
  const economyBonus = player.stats.economy
    ? Math.max(0, 9 - player.stats.economy) * 14
    : 0;

  return runs + wickets * 28 + average * 3 + (strikeRate - 100) * 1.3 + economyBonus;
}

function battingRating(player: Player) {
  return (
    (player.stats.runs ?? 0) +
    (player.stats.average ?? 28) * 2.4 +
    (player.stats.strikeRate ?? 128) * 1.2
  );
}

function bowlingRating(player: Player) {
  return (
    (player.stats.wickets ?? 0) * 28 +
    Math.max(0, 9.5 - (player.stats.economy ?? 9.2)) * 24
  );
}

function getTeamRankForSeason(team: Team, season: number) {
  return (
    team.historyRankings.find((entry) => entry.year === season)?.rank ??
    team.historyRankings.find((entry) => entry.year === season + 1)?.rank ??
    team.historyRankings.find((entry) => entry.year === season - 1)?.rank ??
    team.lastYearRank
  );
}

function getTeamStrength(teamId: TeamId, season: number) {
  const team = TEAM_BY_ID.get(teamId);
  const players = PLAYERS_BY_TEAM.get(teamId) ?? [];

  if (!team) {
    return 0;
  }

  const playerImpact = [...players]
    .map(ratingFromPlayer)
    .sort((left, right) => right - left)
    .slice(0, 7)
    .reduce((total, value) => total + value, 0);
  const historicalRankBoost = (12 - getTeamRankForSeason(team, season)) * 14;
  const titleBoost = team.titles.filter((titleYear) => titleYear <= season).length * 18;

  return playerImpact / 16 + historicalRankBoost + titleBoost;
}

function getVenueForTeam(team: Team) {
  const normalizedVenue = normalizeVenueName(team.venue);
  const directMatch = SEO_VENUES.find((venue) => venue.name === normalizedVenue);

  if (directMatch) {
    return directMatch;
  }

  return SEO_VENUES.find((venue) => venue.homeTeamIds.includes(team.id)) ?? SEO_VENUES[0];
}

function getLineup(teamId: TeamId) {
  const players = PLAYERS_BY_TEAM.get(teamId) ?? [];

  return [...players].sort((left, right) => {
    const leftRoleWeight =
      left.role === "Batsman" || left.role === "Wicket-keeper"
        ? 0
        : left.role === "All-rounder"
          ? 1
          : 2;
    const rightRoleWeight =
      right.role === "Batsman" || right.role === "Wicket-keeper"
        ? 0
        : right.role === "All-rounder"
          ? 1
          : 2;

    if (leftRoleWeight !== rightRoleWeight) {
      return leftRoleWeight - rightRoleWeight;
    }

    return battingRating(right) - battingRating(left);
  });
}

function getBowlingUnit(teamId: TeamId) {
  const players = PLAYERS_BY_TEAM.get(teamId) ?? [];

  return [...players]
    .sort((left, right) => bowlingRating(right) - bowlingRating(left))
    .slice(0, 5);
}

function distributeByWeights(total: number, weights: number[]) {
  const safeWeights = weights.map((weight) => Math.max(0.01, weight));
  const totalWeight = safeWeights.reduce((sum, value) => sum + value, 0);
  const raw = safeWeights.map((weight) => (weight / totalWeight) * total);
  const floors = raw.map((value) => Math.floor(value));
  let remainder = total - floors.reduce((sum, value) => sum + value, 0);

  const decimals = raw
    .map((value, index) => ({ index, decimal: value - Math.floor(value) }))
    .sort((left, right) => right.decimal - left.decimal);

  for (const { index } of decimals) {
    if (remainder <= 0) {
      break;
    }

    floors[index] += 1;
    remainder -= 1;
  }

  return floors;
}

function oversToBalls(overs: string) {
  const [wholeOvers = "0", partialBalls = "0"] = overs.split(".");
  return Number(wholeOvers) * 6 + Number(partialBalls);
}

function ballsToOvers(balls: number) {
  const wholeOvers = Math.floor(balls / 6);
  const partialBalls = balls % 6;
  return partialBalls ? `${wholeOvers}.${partialBalls}` : `${wholeOvers}`;
}

function buildBattingCard(
  teamId: TeamId,
  bowlingTeamId: TeamId,
  runs: number,
  wickets: number,
  extras: number,
  seed: number,
) {
  const lineup = getLineup(teamId).slice(0, 7);
  const bowlingUnit = getBowlingUnit(bowlingTeamId);
  const distributableRuns = Math.max(60, runs - extras);
  const baseWeights = [28, 22, 16, 13, 9, 7, 5].map((weight, index) => {
    return weight + ((seed + index * 11) % 5);
  });
  const runShares = distributeByWeights(distributableRuns, baseWeights).map((value) =>
    Math.max(6, value),
  );
  const notOutCount = wickets >= 7 ? 1 : 2;

  return lineup.map((player, index) => {
    const playerRuns = runShares[index] ?? 0;
    const strikeRateBase = clamp(
      Math.round((player.stats.strikeRate ?? 130) + ((seed + index * 7) % 16) - 8),
      108,
      198,
    );
    const balls = Math.max(4, Math.round((playerRuns / strikeRateBase) * 100));
    const fours = Math.max(0, Math.round(playerRuns / 18) + ((seed + index) % 2));
    const sixes = Math.max(0, Math.round(playerRuns / 34) + ((seed + index * 3) % 2));
    const wicketTaker = bowlingUnit[index % bowlingUnit.length];
    const dismissal =
      index >= lineup.length - notOutCount
        ? "not out"
        : `c ${bowlingUnit[(index + 1) % bowlingUnit.length]?.name ?? wicketTaker.name} b ${wicketTaker.name}`;

    return {
      playerId: player.id,
      name: player.name,
      runs: playerRuns,
      balls,
      fours,
      sixes,
      strikeRate: Number(((playerRuns / balls) * 100).toFixed(2)),
      dismissal,
    };
  });
}

function buildBowlingCard(
  bowlingTeamId: TeamId,
  overs: string,
  runsConceded: number,
  wickets: number,
  seed: number,
) {
  const bowlers = getBowlingUnit(bowlingTeamId);
  const totalBalls = oversToBalls(overs);
  const ballsPerBowler = distributeByWeights(totalBalls, [1, 1, 1, 1, 1]);
  const wicketWeights = [18, 15, 13, 10, 8].map((weight, index) => {
    return weight + ((seed + index * 5) % 4);
  });
  const runWeights = [16, 18, 20, 22, 24].map((weight, index) => {
    return weight + ((seed + index * 3) % 4);
  });
  const wicketShares = distributeByWeights(wickets, wicketWeights);
  const runShares = distributeByWeights(runsConceded, runWeights);

  return bowlers.map((player, index) => {
    const bowledBalls = Math.max(6, ballsPerBowler[index] ?? 6);
    const runsOffBowler = Math.max(8, runShares[index] ?? 8);
    const wicketsByBowler = wicketShares[index] ?? 0;

    return {
      playerId: player.id,
      name: player.name,
      overs: ballsToOvers(bowledBalls),
      maidens:
        runsOffBowler <= 18 && bowledBalls >= 18 && ((seed + index) % 4 === 0) ? 1 : 0,
      runsConceded: runsOffBowler,
      wickets: wicketsByBowler,
      economy: Number(((runsOffBowler / bowledBalls) * 6).toFixed(2)),
    };
  });
}

function buildTimeline(
  battingFirstInnings: MatchInnings,
  battingSecondInnings: MatchInnings,
  tossWinnerId: TeamId,
  tossDecision: "bat" | "field",
  winnerId: TeamId,
  margin: MatchMargin,
  seed: number,
): MatchTimelineEvent[] {
  const topBatterFirst = [...battingFirstInnings.batters].sort(
    (left, right) => right.runs - left.runs,
  )[0];
  const topBatterSecond = [...battingSecondInnings.batters].sort(
    (left, right) => right.runs - left.runs,
  )[0];
  const topBowlerSecond = [...battingFirstInnings.bowlers].sort(
    (left, right) => right.wickets - left.wickets,
  )[0];

  return [
    {
      over: "0.0",
      title: "Toss update",
      description: `${TEAM_BY_ID.get(tossWinnerId)?.shortName ?? tossWinnerId} won the toss and chose to ${tossDecision}.`,
      teamId: tossWinnerId,
    },
    {
      over: "6.0",
      title: "Powerplay trend",
      description: `${topBatterFirst.name} set the tone early as ${TEAM_BY_ID.get(
        battingFirstInnings.teamId,
      )?.shortName ?? battingFirstInnings.teamId} raced into the match.`,
      teamId: battingFirstInnings.teamId,
    },
    {
      over: "12.3",
      title: "Middle-overs swing",
      description: `${topBowlerSecond.name} pulled momentum back with ${
        topBowlerSecond.wickets
      } wickets in the key middle phase.`,
      teamId: battingSecondInnings.teamId,
    },
    {
      over: "17.0",
      title: "Finishers push hard",
      description: `${topBatterSecond.name} kept the chase live with a high-tempo finish worth ${topBatterSecond.runs} runs.`,
      teamId: battingSecondInnings.teamId,
    },
    {
      over: "20.0",
      title: "Result",
      description: `${TEAM_BY_ID.get(winnerId)?.name ?? winnerId} won by ${margin.value} ${margin.type}. Match seed ${seed} delivered a close tactical finish.`,
      teamId: winnerId,
    },
  ];
}

function getBattingStrength(teamId: TeamId) {
  return getLineup(teamId)
    .slice(0, 6)
    .reduce((total, player) => total + battingRating(player), 0);
}

function getBowlingStrength(teamId: TeamId) {
  return getBowlingUnit(teamId).reduce((total, player) => total + bowlingRating(player), 0);
}

function createMatch(team1: Team, team2: Team, season: number, matchNumber: number) {
  const seed = createSeed(team1.id, team2.id, season, matchNumber);
  const homeTeam = (season + matchNumber) % 2 === 0 ? team1 : team2;
  const venue = getVenueForTeam(homeTeam);
  const tossWinner = seed % 2 === 0 ? team1 : team2;
  const tossDecision =
    venue.chasingWinRate >= 50
      ? seed % 5 === 0
        ? "bat"
        : "field"
      : seed % 4 === 0
        ? "field"
        : "bat";
  const battingFirst =
    tossDecision === "bat" ? tossWinner : tossWinner.id === team1.id ? team2 : team1;
  const battingSecond = battingFirst.id === team1.id ? team2 : team1;
  const battingFirstStrength =
    getTeamStrength(battingFirst.id, season) +
    getBattingStrength(battingFirst.id) / 40 +
    (homeTeam.id === battingFirst.id ? 12 : 0) +
    (venue.battingFirstWinRate - 50);
  const battingSecondStrength =
    getTeamStrength(battingSecond.id, season) +
    getBattingStrength(battingSecond.id) / 40 +
    getBowlingStrength(battingSecond.id) / 48 +
    (homeTeam.id === battingSecond.id ? 12 : 0) +
    (venue.chasingWinRate - 50);

  const firstRuns = clamp(
    Math.round(
      venue.averageFirstInningsScore +
        (battingFirstStrength - getBowlingStrength(battingSecond.id) / 30) * 0.14 +
        ((seed % 19) - 9),
    ),
    142,
    232,
  );
  const battingFirstWins =
    battingFirstStrength + ((seed % 13) - 6) >= battingSecondStrength + (((seed / 3) % 13) - 6);
  const margin: MatchMargin = battingFirstWins
    ? { type: "runs", value: 7 + (seed % 29) }
    : { type: "wickets", value: 2 + (seed % 7) };
  const secondRuns = battingFirstWins
    ? clamp(firstRuns - margin.value, 128, firstRuns - 1)
    : clamp(firstRuns + 1 + (seed % 10), firstRuns + 1, 236);
  const firstWickets = clamp(4 + (seed % 6), 4, 9);
  const secondWickets = battingFirstWins
    ? clamp(6 + ((seed / 5) % 5), 6, 10)
    : clamp(10 - margin.value, 2, 8);
  const secondOversBalls = battingFirstWins
    ? 120
    : clamp(102 + (seed % 17), 96, 119);
  const firstInningsOvers = battingFirstWins && firstWickets === 10 ? "19.4" : "20";
  const secondInningsOvers = ballsToOvers(secondOversBalls);
  const winner = battingFirstWins ? battingFirst : battingSecond;
  const battingFirstExtras = 8 + (seed % 9);
  const battingSecondExtras = 7 + ((seed / 7) % 8);

  const firstInnings: MatchInnings = {
    teamId: battingFirst.id,
    runs: firstRuns,
    wickets: firstWickets,
    overs: firstInningsOvers,
    extras: battingFirstExtras,
    batters: buildBattingCard(
      battingFirst.id,
      battingSecond.id,
      firstRuns,
      firstWickets,
      battingFirstExtras,
      seed,
    ),
    bowlers: buildBowlingCard(
      battingSecond.id,
      firstInningsOvers,
      firstRuns,
      firstWickets,
      seed + 9,
    ),
  };

  const secondInnings: MatchInnings = {
    teamId: battingSecond.id,
    runs: secondRuns,
    wickets: secondWickets,
    overs: secondInningsOvers,
    extras: battingSecondExtras,
    batters: buildBattingCard(
      battingSecond.id,
      battingFirst.id,
      secondRuns,
      secondWickets,
      battingSecondExtras,
      seed + 17,
    ),
    bowlers: buildBowlingCard(
      battingFirst.id,
      secondInningsOvers,
      secondRuns,
      secondWickets,
      seed + 23,
    ),
  };

  const date = new Date(`${season}-03-22T19:30:00+05:30`);
  date.setDate(date.getDate() + (matchNumber - 1) * 2);

  return {
    id: `${season}-${matchNumber}-${team1.id}-${team2.id}`,
    slug: generateMatchSlug(team1.shortName, team2.shortName, season),
    season,
    matchNumber,
    label: `Match ${String(matchNumber).padStart(2, "0")}`,
    date: date.toISOString(),
    team1Id: team1.id,
    team2Id: team2.id,
    venueId: venue.id,
    tossWinnerId: tossWinner.id,
    tossDecision,
    winnerId: winner.id,
    margin,
    result: `${winner.name} won by ${margin.value} ${margin.type}`,
    innings: [firstInnings, secondInnings],
    timeline: buildTimeline(
      firstInnings,
      secondInnings,
      tossWinner.id,
      tossDecision,
      winner.id,
      margin,
      seed,
    ),
  } satisfies SeoMatch;
}

function createSeasonSchedule(season: number) {
  const matches: SeoMatch[] = [];
  let matchNumber = 1;

  for (let outerIndex = 0; outerIndex < ALL_TEAMS.length; outerIndex += 1) {
    for (
      let innerIndex = outerIndex + 1;
      innerIndex < ALL_TEAMS.length;
      innerIndex += 1
    ) {
      matches.push(
        createMatch(ALL_TEAMS[outerIndex], ALL_TEAMS[innerIndex], season, matchNumber),
      );
      matchNumber += 1;
    }
  }

  return matches;
}

export const SEO_MATCHES: SeoMatch[] = MATCH_SEASONS.flatMap((season) =>
  createSeasonSchedule(season),
);

export function getVenueForMatch(match: SeoMatch) {
  return VENUE_BY_ID.get(match.venueId) ?? null;
}
