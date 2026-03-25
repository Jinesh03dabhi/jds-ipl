import { PLAYER_SEEDS } from "./players";
import { TEAM_SEEDS } from "./teams";
import {
  derivePreviousTeamId,
  deriveTransferHistory,
  hasTransferInSeason,
} from "./transfers";
import type { IPLData, Player, Team, TeamId } from "./types";

function buildPlayersForSeason(season: number, playerSeeds = PLAYER_SEEDS): Player[] {
  return playerSeeds.map((seed) => {
    const transferHistory = deriveTransferHistory(seed.auctionHistory);
    const previousTeamId = derivePreviousTeamId(
      seed.auctionHistory,
      season,
      seed.currentTeamId,
    );

    return {
      ...seed,
      previousTeamId,
      isTransferred: hasTransferInSeason(transferHistory, season),
      transferHistory,
    };
  });
}

function buildTeamsForSeason(players: Player[], season: number): Team[] {
  const squads = new Map<TeamId, string[]>();

  for (const player of players) {
    const existingSquad = squads.get(player.currentTeamId) ?? [];
    existingSquad.push(player.id);
    squads.set(player.currentTeamId, existingSquad);
  }

  return TEAM_SEEDS.map((team) => ({
    ...team,
    squad: squads.get(team.id) ?? [],
    lastYearRank:
      team.historyRankings?.find((entry) => entry.year === season - 1)?.rank ??
      team.lastYearRank,
  }));
}

function validateIPLData(data: IPLData) {
  const teamIds = new Set(data.teams.map((team) => team.id));
  const playerIds = new Set<string>();

  for (const player of data.players) {
    if (!teamIds.has(player.currentTeamId)) {
      throw new Error(`Unknown team reference on player ${player.id}`);
    }

    if (player.previousTeamId && !teamIds.has(player.previousTeamId)) {
      throw new Error(`Unknown previousTeamId on player ${player.id}`);
    }

    if (playerIds.has(player.id)) {
      throw new Error(`Duplicate player id detected: ${player.id}`);
    }

    playerIds.add(player.id);
  }

  for (const team of data.teams) {
    const uniqueSquad = new Set(team.squad);

    if (uniqueSquad.size !== team.squad.length) {
      throw new Error(`Duplicate squad member found for team ${team.id}`);
    }

    for (const playerId of team.squad) {
      const player = data.players.find((candidate) => candidate.id === playerId);

      if (!player) {
        throw new Error(`Broken squad reference ${playerId} on team ${team.id}`);
      }

      if (player.currentTeamId !== team.id) {
        throw new Error(
          `Mismatched team reference for player ${player.id} on team ${team.id}`,
        );
      }
    }
  }
}

function buildHistoricalSeason(targetSeason: number, currentData: IPLData): IPLData {
  const players = currentData.players.flatMap((player) => {
    if (player.isNew && player.auctionHistory.length === 1) {
      return [];
    }

    const filteredHistory = player.auctionHistory.filter(
      (entry) => entry.year <= targetSeason,
    );

    const historicalCurrentTeamId =
      filteredHistory.at(-1)?.teamId ?? player.previousTeamId ?? player.currentTeamId;
    const historicalHistory =
      filteredHistory.length > 0
        ? filteredHistory
        : [
            {
              year: targetSeason,
              teamId: historicalCurrentTeamId,
              price: player.auctionHistory[0]?.price ?? "0.30 Cr",
            },
          ];
    const transferHistory = deriveTransferHistory(historicalHistory);

    return [
      {
        ...player,
        currentTeamId: historicalCurrentTeamId,
        previousTeamId: derivePreviousTeamId(
          historicalHistory,
          targetSeason,
          historicalCurrentTeamId,
        ),
        isNew: false,
        isTransferred: hasTransferInSeason(transferHistory, targetSeason),
        season: targetSeason,
        auctionHistory: historicalHistory,
        transferHistory,
      },
    ];
  });

  const teams = buildTeamsForSeason(players, targetSeason);
  const data = {
    season: targetSeason,
    teams,
    players,
  };

  validateIPLData(data);

  return data;
}

const currentSeasonPlayers = buildPlayersForSeason(2026);
const currentSeasonTeams = buildTeamsForSeason(currentSeasonPlayers, 2026);

export const IPL_DATA: IPLData = {
  season: 2026,
  teams: currentSeasonTeams,
  players: currentSeasonPlayers,
};

validateIPLData(IPL_DATA);

export const IPL_SEASONS: Record<number, IPLData> = {
  2025: buildHistoricalSeason(2025, IPL_DATA),
  2026: IPL_DATA,
};
