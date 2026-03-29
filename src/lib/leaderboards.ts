import { PLAYERS, TEAMS, type LegacyPlayer } from "@/lib/data";

export type LeaderboardEntry = {
  id: string;
  name: string;
  team: string;
  teamLogo: string;
  role: string;
  soldPrice: string;
  matches: number;
  runs: number;
  wickets: number;
  strikeRate: number | null;
  economy: number | null;
};

function sortByPrice(left: LegacyPlayer, right: LegacyPlayer) {
  return parseFloat(right.soldPrice) - parseFloat(left.soldPrice);
}

function toEntry(player: LegacyPlayer): LeaderboardEntry {
  const teamLogo =
    TEAMS.find((team) => team.name === player.currentTeam)?.logoUrl || "/jds-ipl-logo-1.png";

  return {
    id: player.id,
    name: player.name,
    team: player.currentTeam,
    teamLogo,
    role: player.role,
    soldPrice: player.soldPrice,
    matches: player.stats?.matches ?? 0,
    runs: player.stats?.runs ?? 0,
    wickets: player.stats?.wickets ?? 0,
    strikeRate: player.stats?.strikeRate ?? null,
    economy: player.stats?.economy ?? null,
  };
}

export function getOrangeCapLeaders(limit = 10) {
  return PLAYERS.filter((player) => (player.stats?.runs ?? 0) > 0)
    .sort((left, right) => {
      const runDelta = (right.stats?.runs ?? 0) - (left.stats?.runs ?? 0);
      if (runDelta !== 0) {
        return runDelta;
      }

      const strikeRateDelta = (right.stats?.strikeRate ?? 0) - (left.stats?.strikeRate ?? 0);
      if (strikeRateDelta !== 0) {
        return strikeRateDelta;
      }

      return sortByPrice(left, right);
    })
    .slice(0, limit)
    .map(toEntry);
}

export function getPurpleCapLeaders(limit = 10) {
  return PLAYERS.filter((player) => (player.stats?.wickets ?? 0) > 0)
    .sort((left, right) => {
      const wicketDelta = (right.stats?.wickets ?? 0) - (left.stats?.wickets ?? 0);
      if (wicketDelta !== 0) {
        return wicketDelta;
      }

      const economyDelta = (left.stats?.economy ?? Number.MAX_SAFE_INTEGER) -
        (right.stats?.economy ?? Number.MAX_SAFE_INTEGER);
      if (economyDelta !== 0) {
        return economyDelta;
      }

      return sortByPrice(left, right);
    })
    .slice(0, limit)
    .map(toEntry);
}
