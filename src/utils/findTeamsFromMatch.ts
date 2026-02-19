
import { TEAMS } from '@/lib/data';

export function findTeamsFromMatch(matchName?: string) {
  if (!matchName) return [];

  const parts = matchName.split(" vs ");

  return parts.map(part => {
    return (
      TEAMS.find(team =>
        part.toLowerCase().includes(team.name.toLowerCase())
      ) || null
    );
  });
}
