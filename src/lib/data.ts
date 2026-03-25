import { IPL_DATA, IPL_SEASONS } from "@/data/seasons";
import { getLatestAuctionPrice } from "@/data/transfers";
import {
  calculatePerformanceScore,
  getBenchPlayers,
  getCurrentPrice,
  getKeyPlayers,
  getNewSignings,
  getPlayerBadges,
  getPlayerById,
  getPlayersByTeam,
  getPlayingXI,
  getTeamSquadCount,
  getTransferredPlayers,
  isKeyPlayer,
  toUIPlayer,
} from "@/data/utils";
import type {
  AuctionRecord,
  IPLData,
  LegacyPlayer,
  LegacyTeam,
  Player,
  PlayerBadge,
  PlayerComputedFields,
  PlayerNationality,
  PlayerRole,
  PlayerStats,
  PlayerStatus,
  Team,
  TeamHistoryEntry,
  TeamId,
  TransferRecord,
  UIPlayer,
} from "@/data/types";

export type {
  AuctionRecord,
  IPLData,
  LegacyPlayer,
  LegacyTeam,
  Player,
  PlayerBadge,
  PlayerComputedFields,
  PlayerNationality,
  PlayerRole,
  PlayerStats,
  PlayerStatus,
  Team,
  TeamHistoryEntry,
  TeamId,
  TransferRecord,
  UIPlayer,
};

export {
  IPL_DATA,
  IPL_SEASONS,
  calculatePerformanceScore,
  getBenchPlayers,
  getCurrentPrice,
  getKeyPlayers,
  getNewSignings,
  getPlayerBadges,
  getPlayerById,
  getPlayersByTeam,
  getPlayingXI,
  getTeamSquadCount,
  getTransferredPlayers,
  isKeyPlayer,
  toUIPlayer,
};

const teamNameById = new Map(IPL_DATA.teams.map((team) => [team.id, team.name]));

function toLegacyTeam(team: Team): LegacyTeam {
  return {
    ...team,
    abbreviation: team.shortName,
    color: team.primaryColor,
    historyRankings: team.historyRankings ?? [],
  };
}

function toLegacyPlayer(player: Player): LegacyPlayer {
  const uiPlayer = toUIPlayer(player);

  return {
    id: uiPlayer.id,
    name: uiPlayer.name,
    role: uiPlayer.role,
    nationality: uiPlayer.nationality,
    avatarUrl: uiPlayer.avatarUrl,
    currentTeam: teamNameById.get(player.currentTeamId) ?? player.currentTeamId,
    soldPrice: getLatestAuctionPrice(player.auctionHistory),
    stats: uiPlayer.stats,
    badges: uiPlayer.badges,
    computedFields: uiPlayer.computedFields,
  };
}

export const TEAMS: LegacyTeam[] = IPL_DATA.teams.map(toLegacyTeam);

export const PLAYERS: LegacyPlayer[] = IPL_DATA.players
  .map(toLegacyPlayer)
  .sort((left, right) => {
    const scoreDelta =
      right.computedFields.performanceScore - left.computedFields.performanceScore;

    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return parseFloat(right.soldPrice) - parseFloat(left.soldPrice);
  });
