import { IPL_DATA } from "./seasons";
import { getLatestAuctionPrice } from "./transfers";
import type { Player, PlayerBadge, TeamId, UIPlayer } from "./types";

const playerIndex = new Map(IPL_DATA.players.map((player) => [player.id, player]));

export function calculatePerformanceScore(player: Player) {
  const runs = player.stats.runs ?? 0;
  const wickets = player.stats.wickets ?? 0;
  const average = player.stats.average ?? 0;
  const strikeRate = player.stats.strikeRate ?? 0;
  const economyBonus = player.stats.economy
    ? Math.max(0, 9 - player.stats.economy) * 12
    : 0;

  return Number(
    (
      runs +
      wickets * 28 +
      average * 3 +
      Math.max(0, strikeRate - 100) * 1.4 +
      economyBonus
    ).toFixed(2),
  );
}

export function isKeyPlayer(player: Player) {
  return (player.stats.runs ?? 0) > 400 || (player.stats.wickets ?? 0) > 15;
}

export function getPlayerBadges(player: Player): PlayerBadge[] {
  const badges: PlayerBadge[] = [];

  if (player.isNew) {
    badges.push("NEW");
  }

  if (player.isTransferred) {
    badges.push("TRANSFER");
  }

  if (isKeyPlayer(player)) {
    badges.push("KEY PLAYER");
  }

  return badges;
}

export function toUIPlayer(player: Player): UIPlayer {
  return {
    ...player,
    badges: getPlayerBadges(player),
    computedFields: {
      isKeyPlayer: isKeyPlayer(player),
      performanceScore: calculatePerformanceScore(player),
    },
  };
}

const uiPlayers = IPL_DATA.players.map(toUIPlayer);
const uiPlayerIndex = new Map(uiPlayers.map((player) => [player.id, player]));
const playersByTeamId = new Map<TeamId, UIPlayer[]>();

for (const player of uiPlayers) {
  const existingPlayers = playersByTeamId.get(player.currentTeamId) ?? [];
  existingPlayers.push(player);
  playersByTeamId.set(player.currentTeamId, existingPlayers);
}

export function getPlayerById(playerId: string) {
  return uiPlayerIndex.get(playerId);
}

export function getPlayersByTeam(teamId: TeamId) {
  return playersByTeamId.get(teamId) ?? [];
}

export function getPlayingXI(teamId: TeamId) {
  return getPlayersByTeam(teamId).filter((player) => player.status === "Playing XI");
}

export function getBenchPlayers(teamId: TeamId) {
  return getPlayersByTeam(teamId).filter((player) => player.status === "Bench");
}

export function getNewSignings(teamId: TeamId) {
  return getPlayersByTeam(teamId).filter((player) => player.isNew);
}

export function getTransferredPlayers(teamId: TeamId) {
  return getPlayersByTeam(teamId).filter((player) => player.isTransferred);
}

export function getKeyPlayers(teamId: TeamId) {
  return getPlayersByTeam(teamId).filter(
    (player) => player.computedFields.isKeyPlayer,
  );
}

export function getTeamSquadCount(teamId: TeamId) {
  return getPlayersByTeam(teamId).length;
}

export function getCurrentPrice(playerId: string) {
  return getLatestAuctionPrice(playerIndex.get(playerId)?.auctionHistory ?? []);
}
