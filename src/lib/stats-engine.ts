import { getLatestAuctionPrice } from "@/data/transfers";
import type { TeamId } from "@/data/types";
import { getVenueForMatch } from "@/data/matches";
import {
  getAllPlayers,
  getAllSeoMatches,
  getHeadToHeadPairBySlug,
  getMatchBySlug,
  getMatchesForTeam,
  getMatchesForVenue,
  getPlayerBySlug,
  getPlayersForTeam,
  getTeamById,
  getTeamBySlug,
  getTeamName,
  getTeamShortName,
  getVenueBySlug,
} from "@/lib/data-helpers";
import { generateHeadToHeadSlug, generateSlug } from "@/lib/slug";

type TeamOutcome = "W" | "L";

type SimilarPlayer = {
  id: string;
  slug: string;
  name: string;
  role: string;
  teamName: string;
  statLine: string;
  scoreGap: number;
};

type TeamMatchSummary = {
  slug: string;
  season: number;
  label: string;
  date: string;
  opponentName: string;
  opponentSlug: string;
  venueName: string;
  result: string;
  outcome: TeamOutcome;
};

function roundStat(value: number, fractionDigits = 2) {
  return Number(value.toFixed(fractionDigits));
}

function playerImpactScore(player: ReturnType<typeof getAllPlayers>[number]) {
  const runs = player.stats.runs ?? 0;
  const wickets = player.stats.wickets ?? 0;
  const average = player.stats.average ?? 0;
  const strikeRate = player.stats.strikeRate ?? 120;
  const economy = player.stats.economy ?? 9;

  return runs + wickets * 30 + average * 3 + strikeRate * 0.9 + Math.max(0, 9 - economy) * 18;
}

function buildPlayerStatLine(player: ReturnType<typeof getAllPlayers>[number]) {
  if (player.stats.runs && player.stats.wickets) {
    return `${player.stats.runs} runs, ${player.stats.wickets} wickets`;
  }

  if (player.stats.runs) {
    return `${player.stats.runs} runs at ${player.stats.strikeRate ?? 0} SR`;
  }

  if (player.stats.wickets) {
    return `${player.stats.wickets} wickets at ${player.stats.economy ?? 0} economy`;
  }

  return `${player.stats.matches} matches in the current squad dataset`;
}

function buildForm(matches: ReturnType<typeof getAllSeoMatches>) {
  return matches
    .slice()
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
}

function getTeamOutcome(match: ReturnType<typeof getAllSeoMatches>[number], teamId: TeamId) {
  return match.winnerId === teamId ? "W" : "L";
}

function getTeamScorecard(
  match: ReturnType<typeof getAllSeoMatches>[number],
  teamId: TeamId,
) {
  return match.innings.find((innings) => innings.teamId === teamId) ?? null;
}

function getOpponentTeamId(
  match: ReturnType<typeof getAllSeoMatches>[number],
  teamId: TeamId,
) {
  return match.team1Id === teamId ? match.team2Id : match.team1Id;
}

function buildTeamMatchSummary(teamId: TeamId) {
  return getMatchesForTeam(teamId)
    .map<TeamMatchSummary>((match) => {
      const opponentId = getOpponentTeamId(match, teamId);
      const venue = getVenueForMatch(match);

      return {
        slug: match.slug,
        season: match.season,
        label: match.label,
        date: match.date,
        opponentName: getTeamName(opponentId),
        opponentSlug: generateSlug(getTeamName(opponentId)),
        venueName: venue?.name ?? "IPL venue",
        result: match.result,
        outcome: getTeamOutcome(match, teamId),
      };
    })
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

function getPreMatchWindow(
  match: ReturnType<typeof getAllSeoMatches>[number],
  teamId: TeamId,
  limit = 5,
) {
  return getMatchesForTeam(teamId)
    .filter((candidate) => new Date(candidate.date).getTime() < new Date(match.date).getTime())
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, limit);
}

function getVenueRecord(teamId: TeamId, venueId: string, beforeDate?: string) {
  const matches = getMatchesForVenue(venueId).filter((match) => {
    if (beforeDate) {
      return new Date(match.date).getTime() < new Date(beforeDate).getTime();
    }

    return true;
  });

  const relevantMatches = matches.filter(
    (match) => match.team1Id === teamId || match.team2Id === teamId,
  );

  return {
    played: relevantMatches.length,
    wins: relevantMatches.filter((match) => match.winnerId === teamId).length,
    losses: relevantMatches.filter((match) => match.winnerId !== teamId).length,
  };
}

function buildProbability(team1Score: number, team2Score: number) {
  const total = team1Score + team2Score;

  if (total <= 0) {
    return {
      team1: 50,
      team2: 50,
    };
  }

  const team1 = Math.round((team1Score / total) * 100);

  return {
    team1,
    team2: 100 - team1,
  };
}

export function getPlayerStats(slug: string) {
  const player = getPlayerBySlug(slug);

  if (!player) {
    return null;
  }

  const team = getTeamById(player.currentTeamId);
  const similarPlayers: SimilarPlayer[] = getAllPlayers()
    .filter((candidate) => candidate.id !== player.id && candidate.role === player.role)
    .map((candidate) => ({
      id: candidate.id,
      slug: candidate.slug,
      name: candidate.name,
      role: candidate.role,
      teamName: getTeamName(candidate.currentTeamId),
      statLine: buildPlayerStatLine(candidate),
      scoreGap: Math.abs(playerImpactScore(candidate) - playerImpactScore(player)),
    }))
    .sort((left, right) => left.scoreGap - right.scoreGap)
    .slice(0, 3);

  return {
    player,
    team,
    totalRuns: player.stats.runs ?? 0,
    average: roundStat(player.stats.average ?? 0),
    strikeRate: roundStat(player.stats.strikeRate ?? 0),
    wickets: player.stats.wickets ?? 0,
    price: getLatestAuctionPrice(player.auctionHistory),
    teamStatsUrl: team ? `/teams/${team.slug}/stats` : null,
    teamSquadUrl: team ? `/teams/${team.slug}/squad` : null,
    similarPlayers,
  };
}

export function getTeamStats(slug: string) {
  const team = getTeamBySlug(slug);

  if (!team) {
    return null;
  }

  const squad = getPlayersForTeam(team.id);
  const currentSeasonMatches = buildForm(
    getMatchesForTeam(team.id).filter((match) => match.season === 2026),
  );
  const wins = currentSeasonMatches.filter((match) => match.winnerId === team.id).length;
  const losses = currentSeasonMatches.filter((match) => match.winnerId !== team.id).length;
  const topPlayers = squad
    .slice()
    .sort((left, right) => playerImpactScore(right) - playerImpactScore(left))
    .slice(0, 5);
  const predictedXI = squad
    .filter((player) => player.status === "Playing XI")
    .slice()
    .sort((left, right) => playerImpactScore(right) - playerImpactScore(left))
    .slice(0, 11);
  const bowlingDepth = squad.filter((player) => (player.stats.wickets ?? 0) >= 10).length;
  const highStrikeRateBatters = squad.filter(
    (player) => (player.stats.strikeRate ?? 0) >= 150,
  ).length;
  const strengths = [
    highStrikeRateBatters >= 3
      ? "Multiple high-tempo batters can push the run rate without waiting for a single finisher."
      : "The batting order is built around anchors who can keep the innings stable before the finishers take over.",
    bowlingDepth >= 3
      ? "There are enough wicket-taking bowlers to pressure both the powerplay and death overs."
      : "The attack relies heavily on a couple of lead bowlers, so workload management matters.",
    `Home matches at ${team.venue} give this squad a familiar tactical setup.`,
  ];
  const weaknesses = [
    squad.filter((player) => player.status !== "Playing XI").length < 4
      ? "Bench depth is thinner than the strongest squads, which can hurt if form or availability shifts."
      : "The bench has coverage, but the drop from the first XI to rotation options is still noticeable.",
    highStrikeRateBatters <= 2
      ? "The side can get stuck if the top order does not create powerplay momentum."
      : "If early wickets fall, the middle order still has to prove it can absorb pressure without slowing down.",
  ];
  const recentMatches = buildTeamMatchSummary(team.id).slice(0, 5);
  const headToHeadLinks = getAllSeoMatches()
    .filter((match) => {
      return (
        match.season === 2026 &&
        (match.team1Id === team.id || match.team2Id === team.id)
      );
    })
    .map((match) => getOpponentTeamId(match, team.id))
    .filter((opponentId, index, array) => array.indexOf(opponentId) === index)
    .slice(0, 4)
    .map((opponentId) => ({
      name: `${team.shortName} vs ${getTeamShortName(opponentId)} Head to Head`,
      href: `/${generateHeadToHeadSlug(team.name, getTeamName(opponentId))}`,
    }));

  return {
    team,
    squad,
    wins,
    losses,
    winRate: currentSeasonMatches.length
      ? roundStat((wins / currentSeasonMatches.length) * 100)
      : 0,
    topPlayers,
    predictedXI,
    strengths,
    weaknesses,
    recentMatches,
    headToHeadLinks,
  };
}

export function getMatchPredictionData(slug: string) {
  const match = getMatchBySlug(slug);

  if (!match) {
    return null;
  }

  const team1 = getTeamById(match.team1Id);
  const team2 = getTeamById(match.team2Id);
  const venue = getVenueForMatch(match);

  if (!team1 || !team2 || !venue) {
    return null;
  }

  const team1Recent = getPreMatchWindow(match, team1.id);
  const team2Recent = getPreMatchWindow(match, team2.id);
  const team1RecentWins = team1Recent.filter((candidate) => candidate.winnerId === team1.id).length;
  const team2RecentWins = team2Recent.filter((candidate) => candidate.winnerId === team2.id).length;
  const headToHeadBeforeMatch = getAllSeoMatches().filter((candidate) => {
    const sameFixture =
      (candidate.team1Id === team1.id && candidate.team2Id === team2.id) ||
      (candidate.team1Id === team2.id && candidate.team2Id === team1.id);

    return sameFixture && new Date(candidate.date).getTime() < new Date(match.date).getTime();
  });
  const team1HeadToHeadWins = headToHeadBeforeMatch.filter(
    (candidate) => candidate.winnerId === team1.id,
  ).length;
  const team2HeadToHeadWins = headToHeadBeforeMatch.filter(
    (candidate) => candidate.winnerId === team2.id,
  ).length;
  const team1VenueRecord = getVenueRecord(team1.id, venue.id, match.date);
  const team2VenueRecord = getVenueRecord(team2.id, venue.id, match.date);
  const team1SquadScore = getPlayersForTeam(team1.id)
    .slice()
    .sort((left, right) => playerImpactScore(right) - playerImpactScore(left))
    .slice(0, 7)
    .reduce((total, player) => total + playerImpactScore(player), 0);
  const team2SquadScore = getPlayersForTeam(team2.id)
    .slice()
    .sort((left, right) => playerImpactScore(right) - playerImpactScore(left))
    .slice(0, 7)
    .reduce((total, player) => total + playerImpactScore(player), 0);

  const team1Score =
    team1RecentWins * 7 +
    team1HeadToHeadWins * 5 +
    team1VenueRecord.wins * 3 +
    team1SquadScore / 120 +
    (venue.homeTeamIds.includes(team1.id) ? 6 : 0);
  const team2Score =
    team2RecentWins * 7 +
    team2HeadToHeadWins * 5 +
    team2VenueRecord.wins * 3 +
    team2SquadScore / 120 +
    (venue.homeTeamIds.includes(team2.id) ? 6 : 0);
  const probabilities = buildProbability(team1Score, team2Score);
  const predictedWinner = probabilities.team1 >= probabilities.team2 ? team1 : team2;
  const actualWinner = getTeamById(match.winnerId);
  const headToHeadRecord = getHeadToHead(team1.slug, team2.slug);

  return {
    match,
    team1,
    team2,
    venue,
    actualWinner,
    predictedWinner,
    team1WinProbability: probabilities.team1,
    team2WinProbability: probabilities.team2,
    team1RecentWins,
    team2RecentWins,
    headToHeadRecord,
    reasons: [
      `${predictedWinner.shortName} carry the better model profile through squad impact and recent form entering this fixture.`,
      `${venue.name} usually rewards ${venue.chasingWinRate >= venue.battingFirstWinRate
        ? "clean chases and late acceleration"
        : "batting-first control and middle-over squeeze"
      }.`,
      `${team1.shortName} vs ${team2.shortName} had a ${headToHeadBeforeMatch.length
      }-match sample before this game, which keeps the model grounded in direct matchup history.`,
    ],
  };
}

export function getMatchData(slug: string) {
  const match = getMatchBySlug(slug);

  if (!match) {
    return null;
  }

  const team1 = getTeamById(match.team1Id);
  const team2 = getTeamById(match.team2Id);
  const venue = getVenueForMatch(match);

  if (!team1 || !team2 || !venue) {
    return null;
  }

  const team1Score = getTeamScorecard(match, team1.id);
  const team2Score = getTeamScorecard(match, team2.id);
  const topBatters = [...match.innings.flatMap((innings) => innings.batters)]
    .sort((left, right) => right.runs - left.runs)
    .slice(0, 4);
  const topBowlers = [...match.innings.flatMap((innings) => innings.bowlers)]
    .sort(
      (left, right) =>
        right.wickets - left.wickets || left.runsConceded - right.runsConceded,
    )
    .slice(0, 4);

  return {
    match,
    team1,
    team2,
    venue,
    team1Score,
    team2Score,
    topBatters,
    topBowlers,
    prediction: getMatchPredictionData(slug),
    relatedMatches: getAllSeoMatches()
      .filter((candidate) => {
        if (candidate.slug === match.slug) {
          return false;
        }

        return (
          candidate.venueId === match.venueId ||
          candidate.team1Id === match.team1Id ||
          candidate.team2Id === match.team2Id ||
          candidate.team1Id === match.team2Id ||
          candidate.team2Id === match.team1Id
        );
      })
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
      .slice(0, 4),
  };
}

export function getHeadToHead(team1: string, team2: string) {
  const team1Data = getTeamBySlug(team1) ?? getHeadToHeadPairBySlug(team1)?.team1 ?? null;
  const team2Data = getTeamBySlug(team2) ?? getHeadToHeadPairBySlug(team2)?.team2 ?? null;

  if (!team1Data || !team2Data) {
    return null;
  }

  const matches = getAllSeoMatches()
    .filter((match) => {
      return (
        (match.team1Id === team1Data.id && match.team2Id === team2Data.id) ||
        (match.team1Id === team2Data.id && match.team2Id === team1Data.id)
      );
    })
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
  const team1Wins = matches.filter((match) => match.winnerId === team1Data.id).length;
  const team2Wins = matches.filter((match) => match.winnerId === team2Data.id).length;
  const lastFive = matches.slice(0, 5).map((match) => {
    const venue = getVenueForMatch(match);

    return {
      slug: match.slug,
      season: match.season,
      winnerName: getTeamName(match.winnerId),
      result: match.result,
      venueName: venue?.name ?? "IPL venue",
      date: match.date,
    };
  });
  const venueBreakdown = matches.reduce<
    Array<{
      venueName: string;
      matches: number;
      team1Wins: number;
      team2Wins: number;
    }>
  >((accumulator, match) => {
    const venue = getVenueForMatch(match);
    const venueName = venue?.name ?? "IPL venue";
    const existing = accumulator.find((candidate) => candidate.venueName === venueName);

    if (existing) {
      existing.matches += 1;
      existing.team1Wins += match.winnerId === team1Data.id ? 1 : 0;
      existing.team2Wins += match.winnerId === team2Data.id ? 1 : 0;
      return accumulator;
    }

    accumulator.push({
      venueName,
      matches: 1,
      team1Wins: match.winnerId === team1Data.id ? 1 : 0,
      team2Wins: match.winnerId === team2Data.id ? 1 : 0,
    });
    return accumulator;
  }, []);

  return {
    team1: team1Data,
    team2: team2Data,
    slug: generateHeadToHeadSlug(team1Data.name, team2Data.name),
    totalMatches: matches.length,
    team1Wins,
    team2Wins,
    dominantTeam:
      team1Wins === team2Wins ? null : team1Wins > team2Wins ? team1Data : team2Data,
    lastFive,
    venueBreakdown: venueBreakdown.sort((left, right) => right.matches - left.matches),
    matchSlugs: matches.map((match) => ({
      slug: match.slug,
      season: match.season,
      predictionSlug: `/match/${match.slug}/prediction`,
      matchSlug: `/match/${match.slug}`,
      label: `${getTeamShortName(match.team1Id)} vs ${getTeamShortName(match.team2Id)} ${match.season}`,
    })),
  };
}

export function getHeadToHeadBySlug(slug: string) {
  const pair = getHeadToHeadPairBySlug(slug);

  if (!pair) {
    return null;
  }

  return getHeadToHead(pair.team1.slug, pair.team2.slug);
}

export function getVenueStats(slug: string) {
  const venue = getVenueBySlug(slug);

  if (!venue) {
    return null;
  }

  const matches = getMatchesForVenue(venue.id).sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
  );
  const averageFirstInningsScore = roundStat(
    matches.reduce((total, match) => total + match.innings[0].runs, 0) /
    Math.max(matches.length, 1),
    1,
  );
  const averageSecondInningsScore = roundStat(
    matches.reduce((total, match) => total + match.innings[1].runs, 0) /
    Math.max(matches.length, 1),
    1,
  );
  const tossWinnerWins = matches.filter((match) => match.tossWinnerId === match.winnerId).length;
  const chasingWins = matches.filter(
    (match) => match.innings[1].teamId === match.winnerId,
  ).length;
  const battingFirstWins = matches.length - chasingWins;
  const teamPerformance = matches.reduce<
    Array<{
      teamId: TeamId;
      teamName: string;
      wins: number;
      matches: number;
    }>
  >((accumulator, match) => {
    for (const teamId of [match.team1Id, match.team2Id]) {
      const existing = accumulator.find((candidate) => candidate.teamId === teamId);

      if (existing) {
        existing.matches += 1;
        existing.wins += match.winnerId === teamId ? 1 : 0;
        continue;
      }

      accumulator.push({
        teamId,
        teamName: getTeamName(teamId),
        wins: match.winnerId === teamId ? 1 : 0,
        matches: 1,
      });
    }

    return accumulator;
  }, []);

  return {
    venue,
    matches,
    averageFirstInningsScore,
    averageSecondInningsScore,
    tossImpact: roundStat((tossWinnerWins / Math.max(matches.length, 1)) * 100, 1),
    chasingWinRate: roundStat((chasingWins / Math.max(matches.length, 1)) * 100, 1),
    battingFirstWinRate: roundStat((battingFirstWins / Math.max(matches.length, 1)) * 100, 1),
    winningPattern: venue.winningPattern,
    topTeams: teamPerformance
      .sort((left, right) => right.wins - left.wins || right.matches - left.matches)
      .slice(0, 5),
    recentMatches: matches.slice(0, 5),
  };
}
