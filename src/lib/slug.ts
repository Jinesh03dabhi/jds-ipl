type TeamSlugInput =
  | string
  | {
      name: string;
      shortName?: string;
    };

function readTeamLabel(team: TeamSlugInput) {
  if (typeof team === "string") {
    return team;
  }

  return team.shortName || team.name;
}

export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[().,'/]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateMatchSlug(
  team1: TeamSlugInput,
  team2: TeamSlugInput,
  year: number,
) {
  return `${generateSlug(readTeamLabel(team1))}-vs-${generateSlug(
    readTeamLabel(team2),
  )}-${year}`;
}

export function generateHeadToHeadSlug(team1: string, team2: string) {
  return `${generateSlug(team1)}-vs-${generateSlug(team2)}-head-to-head`;
}
