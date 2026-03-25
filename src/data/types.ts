import { PLAYER_IMAGE_PATHS } from "./player-images";

export type TeamId =
  | "csk"
  | "dc"
  | "gt"
  | "kkr"
  | "lsg"
  | "mi"
  | "pbks"
  | "rr"
  | "rcb"
  | "srh";

export type PlayerRole =
  | "Batsman"
  | "Bowler"
  | "All-rounder"
  | "Wicket-keeper";

export type PlayerNationality = "Indian" | "Overseas";

export type PlayerStatus =
  | "Playing XI"
  | "Bench"
  | "Injured"
  | "Unavailable";

export type PlayerBadge = "NEW" | "TRANSFER" | "KEY PLAYER";

export type PlayerStats = {
  matches: number;
  runs?: number;
  wickets?: number;
  average?: number;
  strikeRate?: number;
  economy?: number;
};

export type AuctionRecord = {
  year: number;
  teamId: TeamId;
  price: string;
};

export type TransferRecord = {
  fromTeamId: TeamId;
  toTeamId: TeamId;
  year: number;
  price?: string;
};

export type Player = {
  id: string;
  name: string;
  role: PlayerRole;
  nationality: PlayerNationality;
  avatarUrl: string;
  currentTeamId: TeamId;
  previousTeamId?: TeamId;
  status: PlayerStatus;
  isNew: boolean;
  isTransferred: boolean;
  season: number;
  stats: PlayerStats;
  auctionHistory: AuctionRecord[];
  transferHistory: TransferRecord[];
};

export type TeamHistoryEntry = {
  year: number;
  rank: number;
};

export type Team = {
  id: TeamId;
  name: string;
  shortName: string;
  logoUrl: string;
  primaryColor: string;
  captain: string;
  coach?: string;
  venue: string;
  owner: string;
  squad: string[];
  titles: number[];
  lastYearRank: number;
  historyRankings: TeamHistoryEntry[];
};

export type IPLData = {
  season: number;
  teams: Team[];
  players: Player[];
};

export type TeamSeed = Omit<Team, "squad">;

export type RawPlayerSeed = {
  id: string;
  name: string;
  role: PlayerRole;
  nationality: PlayerNationality;
  avatarUrl: string;
  currentTeamId: TeamId;
  status: PlayerStatus;
  isNew: boolean;
  season: number;
  stats: PlayerStats;
  auctionHistory: AuctionRecord[];
};

export type PlayerComputedFields = {
  isKeyPlayer: boolean;
  performanceScore: number;
};

export type UIPlayer = Player & {
  badges: PlayerBadge[];
  computedFields: PlayerComputedFields;
};

export type LegacyPlayer = {
  id: string;
  name: string;
  role: PlayerRole;
  nationality: PlayerNationality;
  avatarUrl: string;
  currentTeam: string;
  soldPrice: string;
  stats: PlayerStats;
  badges: PlayerBadge[];
  computedFields: PlayerComputedFields;
};

export type LegacyTeam = Team & {
  abbreviation: string;
  color: string;
};

export function createPlayerId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createAvatarUrl(playerId: string) {
  return PLAYER_IMAGE_PATHS[playerId] ?? "";
}
