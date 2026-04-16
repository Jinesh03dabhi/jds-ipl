import { SEO_MATCHES, type SeoMatch } from "@/data/matches";
import { IPL_DATA } from "@/data/seasons";
import type { Player, Team } from "@/data/types";
import { SEO_VENUES, type SeoVenue } from "@/data/venues";
import { generateHeadToHeadSlug, generateSlug } from "@/lib/slug";

export type SluggedPlayer = Player & { slug: string };
export type SluggedTeam = Team & { slug: string };
export type SluggedVenue = SeoVenue & { slug: string };

const PLAYERS: SluggedPlayer[] = IPL_DATA.players.map((player) => ({
  ...player,
  slug: generateSlug(player.name),
}));

const TEAMS: SluggedTeam[] = IPL_DATA.teams.map((team) => ({
  ...team,
  slug: generateSlug(team.name),
}));

const VENUES: SluggedVenue[] = SEO_VENUES.map((venue) => ({
  ...venue,
  slug: venue.slug,
}));

const playerBySlug = new Map(PLAYERS.map((player) => [player.slug, player]));
const teamBySlug = new Map(TEAMS.map((team) => [team.slug, team]));
const venueBySlug = new Map(VENUES.map((venue) => [venue.slug, venue]));
const matchBySlug = new Map(SEO_MATCHES.map((match) => [match.slug, match]));
const teamById = new Map(TEAMS.map((team) => [team.id, team]));

const teamPairs = TEAMS.flatMap((team, index) =>
  TEAMS.slice(index + 1).map((opponent) => ({
    team,
    opponent,
    slug: generateHeadToHeadSlug(team.name, opponent.name),
  })),
);

const headToHeadBySlug = new Map(
  teamPairs.map((pair) => [
    pair.slug,
    {
      team1: pair.team,
      team2: pair.opponent,
    },
  ]),
);

export function getAllPlayers() {
  return PLAYERS;
}

export function getAllTeams() {
  return TEAMS;
}

export function getAllVenues() {
  return VENUES;
}

export function getAllSeoMatches() {
  return SEO_MATCHES;
}

export function getPlayerBySlug(slug: string) {
  return playerBySlug.get(slug) ?? null;
}

export function getTeamBySlug(slug: string) {
  return teamBySlug.get(slug) ?? null;
}

export function getTeamById(teamId: Team["id"]) {
  return teamById.get(teamId) ?? null;
}

export function getVenueBySlug(slug: string) {
  return venueBySlug.get(slug) ?? null;
}

export function getMatchBySlug(slug: string) {
  return matchBySlug.get(slug) ?? null;
}

export function getPlayersForTeam(teamId: Team["id"]) {
  return PLAYERS.filter((player) => player.currentTeamId === teamId);
}

export function getMatchesForTeam(teamId: Team["id"]) {
  return SEO_MATCHES.filter(
    (match) => match.team1Id === teamId || match.team2Id === teamId,
  );
}

export function getMatchesForVenue(venueId: SeoVenue["id"]) {
  return SEO_MATCHES.filter((match) => match.venueId === venueId);
}

export function getHeadToHeadPages() {
  return teamPairs;
}

export function getHeadToHeadPairBySlug(slug: string) {
  return headToHeadBySlug.get(slug) ?? null;
}

export function getTeamName(teamId: Team["id"]) {
  return teamById.get(teamId)?.name ?? teamId;
}

export function getTeamShortName(teamId: Team["id"]) {
  return teamById.get(teamId)?.shortName ?? teamId.toUpperCase();
}

export function getMatchTeams(match: SeoMatch) {
  return {
    team1: getTeamById(match.team1Id),
    team2: getTeamById(match.team2Id),
  };
}
