import { unstable_cache } from "next/cache";
import { PLAYERS, TEAMS } from "@/lib/data";
import { IPL_SEASON_YEAR, IPL_TIMEZONE } from "@/lib/site";

export type MatchStatus = "upcoming" | "live" | "completed";

export type TeamInfo = {
  id?: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
};

export type MatchScore = {
  team1: string | null;
  team2: string | null;
};

export type IplSeries = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type IplMatch = {
  id: string;
  matchNumber: string;
  matchNumberValue: number | null;
  date: string;
  dateTimeGMT: string;
  team1: TeamInfo;
  team2: TeamInfo;
  venue: string;
  venueSlug: string;
  status: MatchStatus;
  result: string | null;
  score: MatchScore;
  winner: string | null;
  predictionSlug: string;
  detailSlug: string;
  tossWinner?: string | null;
  tossChoice?: string | null;
};

export type IplScheduleResponse = {
  matches: IplMatch[];
  lastUpdated: string;
  source: "cricapi" | "official-seed";
  series: IplSeries | null;
};

export type IplLiveResponse = {
  type: "live" | "upcoming" | "completed" | "waiting" | "error";
  match?: IplMatch;
  scorecard?: any;
  message: string;
  source: string;
  lastUpdated: string;
};

export type PointsTableRow = {
  team: TeamInfo;
  played: number;
  wins: number;
  losses: number;
  noResult: number;
  ties: number;
  points: number;
  runsFor: number;
  runsAgainst: number;
  ballsFaced: number;
  ballsBowled: number;
  nrr: number;
  form: ("W" | "L" | "NR" | "T")[];
};

export type KeyPlayer = {
  id: string;
  name: string;
  role: string;
  team: string;
  statLine: string;
};

export type StadiumProfile = {
  name: string;
  slug: string;
  city: string;
  shortSummary: string;
  pitchSummary: string;
  tossAngle: string;
  bestFor: string;
  caution: string;
  homeTeams: string[];
};

const API_KEYS = [
  process.env.CRIC_API_KEY_1,
  process.env.CRIC_API_KEY_2,
  process.env.CRIC_API_KEY_3,
  process.env.CRIC_API_KEY_4,
  process.env.CRIC_API_KEY_5,
  process.env.CRIC_API_KEY_6,
].filter(Boolean) as string[];

const TEAM_ALIASES = new Map([
  ["Royal Challengers Bangalore", "Royal Challengers Bengaluru"],
  ["RCB Women", "Royal Challengers Bengaluru"],
  ["Delhi Daredevils", "Delhi Capitals"],
  ["Kings XI Punjab", "Punjab Kings"],
  ["Punjab", "Punjab Kings"],
]);

const SHORT_NAME_ALIASES = new Map([["RCBW", "RCB"]]);

const VENUE_ALIASES = new Map([
  ["M.Chinnaswamy Stadium", "M. Chinnaswamy Stadium"],
  ["MA Chidambaram Stadium", "M. A. Chidambaram Stadium"],
  [
    "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium",
    "Ekana Cricket Stadium",
  ],
  [
    "Maharaja Yadavindra Singh International Cricket Stadium",
    "New PCA Stadium",
  ],
]);

const PITCH_SLUG_ALIASES = new Map([
  ["mchinnaswamy-stadium-pitch-report", "m-chinnaswamy-stadium-pitch-report"],
  ["ma-chidambaram-stadium-pitch-report", "m-a-chidambaram-stadium-pitch-report"],
  [
    "bharat-ratna-shri-atal-bihari-vajpayee-ekana-cricket-stadium-pitch-report",
    "ekana-cricket-stadium-pitch-report",
  ],
  [
    "maharaja-yadavindra-singh-international-cricket-stadium-pitch-report",
    "new-pca-stadium-pitch-report",
  ],
  ["mullanpur-pitch-report", "new-pca-stadium-pitch-report"],
]);

const teamIndex = new Map(TEAMS.map((team) => [team.name, team]));

const OFFICIAL_PHASE_ONE_MATCHES: IplMatch[] = [
  seedMatch("match-1", "Match 1", "2026-03-28", "2026-03-28T14:00:00Z", "Royal Challengers Bengaluru", "Sunrisers Hyderabad", "M. Chinnaswamy Stadium, Bengaluru"),
  seedMatch("match-2", "Match 2", "2026-03-29", "2026-03-29T14:00:00Z", "Mumbai Indians", "Kolkata Knight Riders", "Wankhede Stadium, Mumbai"),
  seedMatch("match-3", "Match 3", "2026-03-30", "2026-03-30T14:00:00Z", "Rajasthan Royals", "Chennai Super Kings", "Barsapara Cricket Stadium, Guwahati"),
  seedMatch("match-4", "Match 4", "2026-03-31", "2026-03-31T14:00:00Z", "Punjab Kings", "Gujarat Titans", "New PCA Stadium, New Chandigarh"),
  seedMatch("match-5", "Match 5", "2026-04-01", "2026-04-01T14:00:00Z", "Lucknow Super Giants", "Delhi Capitals", "Ekana Cricket Stadium, Lucknow"),
  seedMatch("match-6", "Match 6", "2026-04-02", "2026-04-02T14:00:00Z", "Kolkata Knight Riders", "Sunrisers Hyderabad", "Eden Gardens, Kolkata"),
  seedMatch("match-7", "Match 7", "2026-04-03", "2026-04-03T14:00:00Z", "Chennai Super Kings", "Punjab Kings", "M. A. Chidambaram Stadium, Chennai"),
  seedMatch("match-8", "Match 8", "2026-04-04", "2026-04-04T10:00:00Z", "Delhi Capitals", "Mumbai Indians", "Arun Jaitley Stadium, Delhi"),
  seedMatch("match-9", "Match 9", "2026-04-04", "2026-04-04T14:00:00Z", "Gujarat Titans", "Rajasthan Royals", "Narendra Modi Stadium, Ahmedabad"),
  seedMatch("match-10", "Match 10", "2026-04-05", "2026-04-05T10:00:00Z", "Sunrisers Hyderabad", "Lucknow Super Giants", "Rajiv Gandhi International Stadium, Hyderabad"),
  seedMatch("match-11", "Match 11", "2026-04-05", "2026-04-05T14:00:00Z", "Royal Challengers Bengaluru", "Chennai Super Kings", "M. Chinnaswamy Stadium, Bengaluru"),
  seedMatch("match-12", "Match 12", "2026-04-06", "2026-04-06T14:00:00Z", "Kolkata Knight Riders", "Punjab Kings", "Eden Gardens, Kolkata"),
  seedMatch("match-13", "Match 13", "2026-04-07", "2026-04-07T14:00:00Z", "Rajasthan Royals", "Mumbai Indians", "Barsapara Cricket Stadium, Guwahati"),
  seedMatch("match-14", "Match 14", "2026-04-08", "2026-04-08T14:00:00Z", "Delhi Capitals", "Gujarat Titans", "Arun Jaitley Stadium, Delhi"),
  seedMatch("match-15", "Match 15", "2026-04-09", "2026-04-09T14:00:00Z", "Kolkata Knight Riders", "Lucknow Super Giants", "Eden Gardens, Kolkata"),
  seedMatch("match-16", "Match 16", "2026-04-10", "2026-04-10T14:00:00Z", "Rajasthan Royals", "Royal Challengers Bengaluru", "Barsapara Cricket Stadium, Guwahati"),
  seedMatch("match-17", "Match 17", "2026-04-11", "2026-04-11T10:00:00Z", "Punjab Kings", "Sunrisers Hyderabad", "New PCA Stadium, New Chandigarh"),
  seedMatch("match-18", "Match 18", "2026-04-11", "2026-04-11T14:00:00Z", "Chennai Super Kings", "Delhi Capitals", "M. A. Chidambaram Stadium, Chennai"),
  seedMatch("match-19", "Match 19", "2026-04-12", "2026-04-12T10:00:00Z", "Lucknow Super Giants", "Gujarat Titans", "Ekana Cricket Stadium, Lucknow"),
  seedMatch("match-20", "Match 20", "2026-04-12", "2026-04-12T14:00:00Z", "Mumbai Indians", "Royal Challengers Bengaluru", "Wankhede Stadium, Mumbai"),
];

function seedMatch(
  id: string,
  matchNumber: string,
  date: string,
  dateTimeGMT: string,
  team1Name: string,
  team2Name: string,
  venue: string
): IplMatch {
  const team1 = toTeamInfo(team1Name);
  const team2 = toTeamInfo(team2Name);
  return {
    id,
    matchNumber,
    matchNumberValue: extractMatchNumber(matchNumber),
    date,
    dateTimeGMT,
    team1,
    team2,
    venue,
    venueSlug: getVenueSlug(venue),
    status: "upcoming",
    result: null,
    score: { team1: null, team2: null },
    winner: null,
    predictionSlug: getPredictionSlug(team1.name, team2.name),
    detailSlug: getDetailSlug(matchNumber, team1.name, team2.name),
  };
}

function normalizeTeamName(name: string) {
  return TEAM_ALIASES.get(name) || name;
}

function normalizeShortName(shortName?: string | null) {
  if (!shortName) return "";
  return SHORT_NAME_ALIASES.get(shortName) || shortName;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[().,']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getVenueBaseName(venue: string) {
  const baseName = venue.split(",")[0]?.trim() || venue.trim();
  return VENUE_ALIASES.get(baseName) || baseName;
}

export function getVenueSlug(venue: string) {
  return `${slugify(getVenueBaseName(venue))}-pitch-report`;
}

export function getPredictionSlug(team1: string, team2: string) {
  return `${slugify(team1)}-vs-${slugify(team2)}-prediction`;
}

export function getDetailSlug(matchNumber: string, team1: string, team2: string) {
  const matchNumberValue = extractMatchNumber(matchNumber);
  const suffix = matchNumberValue ? `-match-${matchNumberValue}` : "";
  return `${slugify(team1)}-vs-${slugify(team2)}${suffix}`;
}

export function getIndiaDateKey(date: Date | string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: IPL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(date));

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export function shiftIndiaDate(dateKey: string, offsetDays: number) {
  const date = new Date(`${dateKey}T00:00:00+05:30`);
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatIndiaDateLong(dateKey: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: IPL_TIMEZONE,
  }).format(new Date(`${dateKey}T00:00:00+05:30`));
}

export function formatIndiaDateTime(dateTimeGMT: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IPL_TIMEZONE,
  }).format(new Date(dateTimeGMT));
}

function extractMatchNumber(matchNumber: string) {
  const value = matchNumber.match(/(\d+)/)?.[1];
  return value ? Number(value) : null;
}

function toTeamInfo(
  name: string,
  fallbackLogo?: string,
  fallbackShort?: string | null
): TeamInfo {
  const normalized = normalizeTeamName(name);
  const team = teamIndex.get(normalized);
  return {
    id: team?.id,
    name: normalized,
    shortName:
      normalizeShortName(fallbackShort) ||
      team?.abbreviation ||
      normalized
        .split(" ")
        .map((part) => part[0])
        .join(""),
    logo: team?.logoUrl || fallbackLogo || "/jds-ipl-logo-1.png",
    color: team?.color || "#334155",
  };
}

function parseScoreText(score: any) {
  if (!score) return null;
  const runs = score.r ?? score.runs;
  const wickets = score.w ?? score.wickets;
  const overs = score.o ?? score.overs;
  if (runs === undefined || wickets === undefined || overs === undefined) {
    return null;
  }
  return `${runs}/${wickets} (${overs})`;
}

function matchStatus(match: any): MatchStatus {
  if (match?.matchEnded) return "completed";
  if (match?.matchStarted) return "live";
  return "upcoming";
}

function buildScore(match: any, team1: TeamInfo, team2: TeamInfo): MatchScore {
  const scores = Array.isArray(match?.score) ? match.score : [];

  const findScoreForTeam = (team: TeamInfo) => {
    const entry = scores.find((item: any) => {
      const inning = String(item?.inning || "").toLowerCase();
      return inning.includes(team.name.toLowerCase()) || inning.includes(team.shortName.toLowerCase());
    });
    return parseScoreText(entry);
  };

  return {
    team1: findScoreForTeam(team1),
    team2: findScoreForTeam(team2),
  };
}

function normalizeApiMatch(match: any, index: number): IplMatch | null {
  const teamNames =
    match?.teams ||
    match?.teamInfo?.map((team: any) => team?.name || team?.teamName) ||
    [];

  if (teamNames.length < 2) {
    return null;
  }

  const teamInfo = match?.teamInfo || teamNames.map((name: string) => ({ name }));
  const team1Name = teamInfo[0]?.name || teamNames[0];
  const team2Name = teamInfo[1]?.name || teamNames[1];
  const team1 = toTeamInfo(
    team1Name,
    teamInfo[0]?.img,
    teamInfo[0]?.shortname || teamInfo[0]?.shortName
  );
  const team2 = toTeamInfo(
    team2Name,
    teamInfo[1]?.img,
    teamInfo[1]?.shortname || teamInfo[1]?.shortName
  );
  const date = match?.date || match?.dateTimeGMT?.slice(0, 10) || getIndiaDateKey(new Date());
  const dateTimeGMT = match?.dateTimeGMT?.endsWith("Z")
    ? match.dateTimeGMT
    : `${match?.dateTimeGMT || `${date}T14:00:00`}Z`;
  const rawMatchNumber =
    match?.matchNumber ||
    match?.name?.match(/(\d+)(st|nd|rd|th)? Match/i)?.[0]?.replace(",", "") ||
    `Match ${index + 1}`;
  const matchNumber = rawMatchNumber.toLowerCase().startsWith("match")
    ? rawMatchNumber
    : `Match ${String(rawMatchNumber).match(/\d+/)?.[0] || index + 1}`;
  const venue =
    match?.venue ||
    match?.venueName ||
    match?.venueInfo?.name ||
    match?.venue?.name ||
    "TBD";

  return {
    id: match?.id || `${slugify(team1.name)}-${slugify(team2.name)}-${index + 1}`,
    matchNumber,
    matchNumberValue: extractMatchNumber(matchNumber),
    date,
    dateTimeGMT,
    team1,
    team2,
    venue,
    venueSlug: getVenueSlug(venue),
    status: matchStatus(match),
    result: match?.status || match?.statusStr || null,
    score: buildScore(match, team1, team2),
    winner: match?.winner || match?.winningTeam || null,
    predictionSlug: getPredictionSlug(team1.name, team2.name),
    detailSlug: getDetailSlug(matchNumber, team1.name, team2.name),
    tossWinner: match?.tossWinner || null,
    tossChoice: match?.tossChoice || null,
  };
}

async function fetchCricApiJson(path: string) {
  if (!API_KEYS.length) {
    return null;
  }

  for (const key of API_KEYS) {
    try {
      const response = await fetch(`https://api.cricapi.com/v1/${path}${path.includes("?") ? "&" : "?"}apikey=${key}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        continue;
      }

      const payload = await response.json();
      if (payload?.status === "failure") {
        continue;
      }

      return payload;
    } catch {
      continue;
    }
  }

  return null;
}

const getDiscoveredSeries = unstable_cache(
  async (): Promise<IplSeries | null> => {
    const queries = ["indian%20premier%20league", "ipl"];

    for (const query of queries) {
      const payload = await fetchCricApiJson(`series?search=${query}`);
      const series = (payload?.data || []).find((item: any) =>
        new RegExp(`Indian Premier League ${IPL_SEASON_YEAR}`, "i").test(String(item?.name || ""))
      );

      if (series) {
        return {
          id: series.id,
          name: series.name,
          startDate: series.startDate,
          endDate: series.endDate,
        };
      }
    }

    return null;
  },
  [`ipl-series-${IPL_SEASON_YEAR}`],
  { revalidate: 60 * 60 * 12 }
);

export const getIplSchedule = unstable_cache(
  async (): Promise<IplScheduleResponse> => {
    const series = await getDiscoveredSeries();

    if (series) {
      const payload = await fetchCricApiJson(`series_info?id=${series.id}`);
      const matchList = payload?.data?.matchList || payload?.data?.matchlist || [];
      const normalized = matchList
        .map((match: any, index: number) => normalizeApiMatch(match, index))
        .filter(Boolean) as IplMatch[];

      if (normalized.length) {
        return {
          matches: normalized.sort(
            (a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime()
          ),
          lastUpdated: new Date().toISOString(),
          source: "cricapi",
          series,
        };
      }
    }

    return {
      matches: OFFICIAL_PHASE_ONE_MATCHES,
      lastUpdated: new Date().toISOString(),
      source: "official-seed",
      series,
    };
  },
  [`ipl-schedule-${IPL_SEASON_YEAR}`],
  { revalidate: 60 * 10 }
);

async function getCurrentIplMatchesFromApi() {
  const payload = await fetchCricApiJson("currentMatches?offset=0");
  const matches = payload?.data || [];

  return matches
    .filter((match: any) => /ipl|indian premier league/i.test(String(match?.name || "")))
    .map((match: any, index: number) => normalizeApiMatch(match, index))
    .filter(Boolean) as IplMatch[];
}

async function getScorecard(matchId: string) {
  const payload = await fetchCricApiJson(`match_scorecard?id=${matchId}`);
  return payload?.data || null;
}

export const getIplLiveSnapshot = unstable_cache(
  async (): Promise<IplLiveResponse> => {
    const [schedule, currentMatches] = await Promise.all([getIplSchedule(), getCurrentIplMatchesFromApi()]);
    const nowKey = getIndiaDateKey(new Date());

    const liveMatch = currentMatches.find((match) => match.status === "live");
    if (liveMatch) {
      return {
        type: "live",
        match: liveMatch,
        scorecard: await getScorecard(liveMatch.id),
        message: "Live IPL match in progress.",
        source: "cricapi-currentMatches",
        lastUpdated: new Date().toISOString(),
      };
    }

    const todayScheduledMatch = schedule.matches.find(
      (match) => match.status !== "completed" && getIndiaDateKey(match.dateTimeGMT) === nowKey
    );

    if (todayScheduledMatch) {
      return {
        type: "upcoming",
        match: todayScheduledMatch,
        message: `Today's IPL fixture starts at ${formatIndiaDateTime(todayScheduledMatch.dateTimeGMT)} IST.`,
        source: schedule.source,
        lastUpdated: new Date().toISOString(),
      };
    }

    const nextMatch = schedule.matches.find(
      (match) => match.status === "upcoming" && new Date(match.dateTimeGMT).getTime() >= Date.now()
    );

    if (nextMatch) {
      return {
        type: "upcoming",
        match: nextMatch,
        message: `Next IPL fixture starts at ${formatIndiaDateTime(nextMatch.dateTimeGMT)} IST.`,
        source: schedule.source,
        lastUpdated: new Date().toISOString(),
      };
    }

    const latestCompleted = [...schedule.matches]
      .filter((match) => match.status === "completed")
      .sort((a, b) => new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime())[0];

    if (latestCompleted) {
      return {
        type: "completed",
        match: latestCompleted,
        message: latestCompleted.result || "Latest completed IPL match.",
        source: schedule.source,
        lastUpdated: new Date().toISOString(),
      };
    }

    return {
      type: "waiting",
      message: seriesWaitingMessage(schedule.series),
      source: schedule.source,
      lastUpdated: new Date().toISOString(),
    };
  },
  [`ipl-live-snapshot-${IPL_SEASON_YEAR}`],
  { revalidate: 60 }
);

function seriesWaitingMessage(series: IplSeries | null) {
  if (series?.startDate) {
    return `The IPL ${IPL_SEASON_YEAR} season begins on ${series.startDate}.`;
  }

  return `Waiting for IPL ${IPL_SEASON_YEAR} matches.`;
}

export async function getMatchByDetailSlug(slug: string) {
  const schedule = await getIplSchedule();
  return schedule.matches.find((match) => match.detailSlug === slug) || null;
}

export async function getMatchByPredictionSlug(slug: string) {
  const schedule = await getIplSchedule();
  const matches = schedule.matches.filter((match) => match.predictionSlug === slug);

  if (!matches.length) {
    return null;
  }

  const priority = [...matches].sort((a, b) => {
    const statusWeight = (match: IplMatch) => {
      if (match.status === "live") return 0;
      if (match.status === "upcoming") return 1;
      return 2;
    };

    const weightDifference = statusWeight(a) - statusWeight(b);
    if (weightDifference !== 0) return weightDifference;
    return new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime();
  });

  return priority[0];
}

export function getMatchesForIndiaDate(matches: IplMatch[], dateKey: string) {
  return matches.filter((match) => getIndiaDateKey(match.dateTimeGMT) === dateKey);
}

export function getLatestCompletedMatch(matches: IplMatch[]) {
  return [...matches]
    .filter((match) => match.status === "completed")
    .sort((a, b) => new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime())[0] || null;
}

const STADIUM_PROFILES_INTERNAL: StadiumProfile[] = [
  {
    name: "M. Chinnaswamy Stadium",
    slug: "m-chinnaswamy-stadium-pitch-report",
    city: "Bengaluru",
    shortSummary:
      "Usually one of the quickest-scoring IPL venues because clean hitters get value from the short boundaries and fast outfield.",
    pitchSummary:
      "Expect a batting-friendly surface more often than not. The new ball can move for a brief spell, but once batters settle the bounce is true and the square boundaries keep the asking rate in play.",
    tossAngle:
      "Captains often prefer chasing here because dew and boundary size can make defense harder in the second innings.",
    bestFor: "Aggressive top-order batting and death-over finishing.",
    caution: "Mistimed pace-off bowling can disappear quickly if the surface stays hard.",
    homeTeams: ["Royal Challengers Bengaluru"],
  },
  {
    name: "Wankhede Stadium",
    slug: "wankhede-stadium-pitch-report",
    city: "Mumbai",
    shortSummary:
      "A pace-friendly venue early in the innings that still rewards strokeplay once the ball gets older.",
    pitchSummary:
      "There is usually good carry for seamers with the new ball, especially in night games, but Wankhede rarely stays quiet for long. Once the shine fades, timing through the line becomes easier and totals can accelerate quickly.",
    tossAngle:
      "Chasing is regularly attractive at Wankhede because evening moisture can reduce grip for bowlers.",
    bestFor: "Powerplay seam, high-tempo batting and hitters square of the wicket.",
    caution: "If dew arrives, yorker execution and boundary protection become far more important than raw pace.",
    homeTeams: ["Mumbai Indians"],
  },
  {
    name: "M. A. Chidambaram Stadium",
    slug: "m-a-chidambaram-stadium-pitch-report",
    city: "Chennai",
    shortSummary:
      "Chepauk is usually slower than the pure batting decks on the circuit and often rewards spin, cutters and smart pacing.",
    pitchSummary:
      "The surface can grip as the game moves on, which is why quality finger spin, wrist spin and pace-off bowling matter here. Batters who hit straight and rotate well tend to build stronger innings than all-out boundary hunters.",
    tossAngle:
      "If the strip looks dry, batting first can still be valuable because the surface often gets tougher to hit through later.",
    bestFor: "Spinners, cutters and batting units comfortable against slower pace.",
    caution: "Teams that rely only on hard-length pace can look one-dimensional at Chepauk.",
    homeTeams: ["Chennai Super Kings"],
  },
  {
    name: "Eden Gardens",
    slug: "eden-gardens-pitch-report",
    city: "Kolkata",
    shortSummary:
      "A venue that often balances strong strokeplay with enough pace and carry to keep seamers involved.",
    pitchSummary:
      "Eden Gardens frequently produces truer bounce than the slower venues, so batsmen can trust the surface if they survive the early overs. The ball also comes nicely onto the bat, although cutters and smart pace variation still matter late on.",
    tossAngle:
      "Chasing remains appealing when conditions are fresh, but the exact call depends on surface dryness more than reputation alone.",
    bestFor: "Top-order timing, quick outfield value and seamers who hit a hard length.",
    caution: "Overpitching under lights can turn into a boundary-heavy spell quickly.",
    homeTeams: ["Kolkata Knight Riders"],
  },
  {
    name: "Arun Jaitley Stadium",
    slug: "arun-jaitley-stadium-pitch-report",
    city: "Delhi",
    shortSummary:
      "Small boundaries and a generally true surface make Delhi one of the stronger batting venues in the competition.",
    pitchSummary:
      "Runs tend to be available if batters get through the first phase cleanly. The dimensions mean even mishits can clear the rope, so spinners and seamers both need sharp field settings and change-ups instead of predictable lengths.",
    tossAngle:
      "Teams often like chasing here because par scores can move quickly once one side gains momentum.",
    bestFor: "Boundary hitters, sweepers against spin and death-over specialists with slower balls.",
    caution: "Missed yorkers are expensive because the straight and square pockets are reachable.",
    homeTeams: ["Delhi Capitals"],
  },
  {
    name: "Narendra Modi Stadium",
    slug: "narendra-modi-stadium-pitch-report",
    city: "Ahmedabad",
    shortSummary:
      "The surface can vary by strip, but Ahmedabad usually offers a fair contest between batting depth and disciplined bowling.",
    pitchSummary:
      "Narendra Modi Stadium does not always play the same way because different soil bases can change pace and grip. On its truer strips, batters can score heavily; on drier ones, cutters and spin become much more relevant in the middle overs.",
    tossAngle:
      "The toss call depends heavily on the strip in use, so surface reading matters more here than blanket chasing logic.",
    bestFor: "Flexible attacks with both hit-the-deck pace and spin options.",
    caution: "One-dimensional plans can be punished if the strip behaves differently from the previous match.",
    homeTeams: ["Gujarat Titans"],
  },
  {
    name: "Rajiv Gandhi International Stadium",
    slug: "rajiv-gandhi-international-stadium-pitch-report",
    city: "Hyderabad",
    shortSummary:
      "Recent IPL games in Hyderabad have regularly leaned toward high scores and fast starts from the top order.",
    pitchSummary:
      "The ball often travels cleanly here, especially if the surface stays hard and even. That means stroke-makers can dominate square of the wicket, while bowlers need stronger pace variation and end-over execution to control damage.",
    tossAngle:
      "If the outfield is quick and evening dew is expected, captains are usually comfortable chasing.",
    bestFor: "Power hitters, openers who attack pace and bowlers with reliable slower-ball control.",
    caution: "Defending middling totals is difficult if the surface stays flat for 40 overs.",
    homeTeams: ["Sunrisers Hyderabad"],
  },
  {
    name: "Barsapara Cricket Stadium",
    slug: "barsapara-cricket-stadium-pitch-report",
    city: "Guwahati",
    shortSummary:
      "Barsapara usually gives batters value for timing and can produce fluent scoring after the powerplay.",
    pitchSummary:
      "The new ball can offer a little movement, but the bigger story is often how quickly strokeplay opens up once the ball softens. Batters who handle back-of-a-length pace well can cash in here, while cutters become important late in the innings.",
    tossAngle:
      "Chasing can be attractive, though captains still watch for any early moisture in the first innings.",
    bestFor: "Shot-makers through the off side and bowlers with slower-ball variation at the death.",
    caution: "Hard lengths without variation are easier to line up once the surface settles.",
    homeTeams: ["Rajasthan Royals"],
  },
  {
    name: "Ekana Cricket Stadium",
    slug: "ekana-cricket-stadium-pitch-report",
    city: "Lucknow",
    shortSummary:
      "Ekana has often played slower than the league's flatter batting venues, which keeps all-round bowling attacks relevant.",
    pitchSummary:
      "Lucknow surfaces have regularly asked batters to earn their scoring options. The pitch can be slightly two-paced, especially if it dries out, so teams with quality spin and pace-off options usually stay in the game longer than pure hit-the-deck attacks.",
    tossAngle:
      "Batting first is still a live option when the pitch looks dry because the chase can slow down in the middle overs.",
    bestFor: "Spinners, smart middle-over bowling and patient batting starts.",
    caution: "Teams that chase recklessly here can lose shape if the ball grips and holds.",
    homeTeams: ["Lucknow Super Giants"],
  },
  {
    name: "New PCA Stadium",
    slug: "new-pca-stadium-pitch-report",
    city: "New Chandigarh",
    shortSummary:
      "A more balanced surface where seamers can stay in the contest if they hit disciplined lengths early.",
    pitchSummary:
      "New Chandigarh generally offers a fairer contest than the smallest batting venues. Pace bowlers can find enough assistance with the new ball, while the larger boundaries also reward teams that bowl to a plan instead of searching only for magic balls.",
    tossAngle:
      "The toss is useful, but disciplined powerplay bowling can matter more than batting order at this ground.",
    bestFor: "Seamers with control, boundary riders who protect pockets and batters willing to build before launching.",
    caution: "Loose starts with the ball can still turn into catch-up cricket because the outfield stays quick.",
    homeTeams: ["Punjab Kings"],
  },
  {
    name: "Sawai Mansingh Stadium",
    slug: "sawai-mansingh-stadium-pitch-report",
    city: "Jaipur",
    shortSummary:
      "Jaipur usually sits in the balanced middle ground, rewarding good batting but still keeping spin and cutters in play.",
    pitchSummary:
      "Sawai Mansingh surfaces have often allowed batters to score once set without turning every game into a boundary sprint. The square boundaries are more forgiving than the smallest venues, so teams that rotate strike well and vary pace cleverly tend to control the game better.",
    tossAngle:
      "Captains weigh conditions carefully here because either innings can work depending on dryness and dew.",
    bestFor: "Balanced teams with reliable spinners and anchors who can accelerate late.",
    caution: "A slow start can leave too much work for finishers if the surface grips in the middle overs.",
    homeTeams: ["Rajasthan Royals"],
  },
];

export const STADIUM_PROFILES = STADIUM_PROFILES_INTERNAL;

function parseScoreParts(scoreText: string | null) {
  if (!scoreText) return null;
  const match = scoreText.match(/(\d+)\/(\d+)\s+\(([\d.]+)\)/);
  if (!match) return null;
  return {
    runs: Number(match[1]),
    wickets: Number(match[2]),
    overs: match[3],
  };
}

function oversToBalls(overs: string) {
  const [whole, partial] = overs.split(".");
  return Number(whole) * 6 + Number(partial || 0);
}

function ballsForNrr(scoreText: string | null) {
  const parsed = parseScoreParts(scoreText);
  if (!parsed) return 0;
  const balls = oversToBalls(parsed.overs);
  if (parsed.wickets === 10 && balls < 120) {
    return 120;
  }
  return balls;
}

function resultToken(match: IplMatch) {
  const winner = normalizeTeamName(match.winner || "");
  if (winner && winner === match.team1.name) return { team1: "W" as const, team2: "L" as const };
  if (winner && winner === match.team2.name) return { team1: "L" as const, team2: "W" as const };

  const result = String(match.result || "").toLowerCase();
  if (result.includes("no result") || result.includes("abandoned")) {
    return { team1: "NR" as const, team2: "NR" as const };
  }

  if (result.includes("tie")) {
    return { team1: "T" as const, team2: "T" as const };
  }

  return null;
}

export function buildPointsTable(matches: IplMatch[]) {
  const rows = new Map<string, PointsTableRow>();

  for (const team of TEAMS) {
    rows.set(team.name, {
      team: toTeamInfo(team.name, team.logoUrl, team.abbreviation),
      played: 0,
      wins: 0,
      losses: 0,
      noResult: 0,
      ties: 0,
      points: 0,
      runsFor: 0,
      runsAgainst: 0,
      ballsFaced: 0,
      ballsBowled: 0,
      nrr: 0,
      form: [],
    });
  }

  const completedMatches = matches
    .filter((match) => match.status === "completed")
    .sort((a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime());

  for (const match of completedMatches) {
    const team1 = rows.get(match.team1.name);
    const team2 = rows.get(match.team2.name);

    if (!team1 || !team2) {
      continue;
    }

    const token = resultToken(match);

    team1.played += 1;
    team2.played += 1;

    if (token?.team1 === "W") {
      team1.wins += 1;
      team1.points += 2;
      team2.losses += 1;
    } else if (token?.team2 === "W") {
      team2.wins += 1;
      team2.points += 2;
      team1.losses += 1;
    } else if (token?.team1 === "NR") {
      team1.noResult += 1;
      team2.noResult += 1;
      team1.points += 1;
      team2.points += 1;
    } else if (token?.team1 === "T") {
      team1.ties += 1;
      team2.ties += 1;
      team1.points += 1;
      team2.points += 1;
    }

    if (token) {
      team1.form.push(token.team1);
      team2.form.push(token.team2);
    }

    const score1 = parseScoreParts(match.score.team1);
    const score2 = parseScoreParts(match.score.team2);

    if (score1 && score2) {
      team1.runsFor += score1.runs;
      team1.runsAgainst += score2.runs;
      team1.ballsFaced += ballsForNrr(match.score.team1);
      team1.ballsBowled += ballsForNrr(match.score.team2);

      team2.runsFor += score2.runs;
      team2.runsAgainst += score1.runs;
      team2.ballsFaced += ballsForNrr(match.score.team2);
      team2.ballsBowled += ballsForNrr(match.score.team1);
    }
  }

  return [...rows.values()]
    .map((row) => ({
      ...row,
      form: row.form.slice(-5),
      nrr:
        row.ballsFaced && row.ballsBowled
          ? Number(
              (
                row.runsFor / (row.ballsFaced / 6) -
                row.runsAgainst / (row.ballsBowled / 6)
              ).toFixed(3)
            )
          : 0,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.nrr !== a.nrr) return b.nrr - a.nrr;
      return a.team.name.localeCompare(b.team.name);
    });
}

type KeyPlayerStats = {
  runs?: number;
  wickets?: number;
  average?: number;
  strikeRate?: number;
  economy?: number;
};

function buildPlayerStatLine(name: string, stats: KeyPlayerStats) {
  if (stats.runs && stats.wickets) {
    return `${stats.runs} runs and ${stats.wickets} wickets in the current squad dataset`;
  }
  if (stats.runs) {
    return `${stats.runs} runs in the current squad dataset`;
  }
  if (stats.wickets) {
    return `${stats.wickets} wickets in the current squad dataset`;
  }
  return `${name} is part of the current squad tracker`;
}

export function getKeyPlayers(teamName: string, limit = 4): KeyPlayer[] {
  const normalized = normalizeTeamName(teamName);

  return PLAYERS.filter((player) => normalizeTeamName(player.currentTeam) === normalized)
    .map((player) => {
      const stats = player.stats || {};
      const impact =
        (stats.runs || 0) +
        (stats.wickets || 0) * 25 +
        (stats.average || 0) +
        (stats.strikeRate || 0) / 2 +
        (stats.economy ? Math.max(0, 12 - stats.economy) * 10 : 0);

      const statLine = buildPlayerStatLine(player.name, stats);

      return {
        id: player.id,
        name: player.name,
        role: player.role,
        team: normalized,
        statLine,
        impact,
      };
    })
    .sort((a, b) => b.impact - a.impact)
    .slice(0, limit)
    .map(({ impact: _impact, ...player }) => player);
}

export function getStadiumProfile(slug: string) {
  const canonicalSlug = PITCH_SLUG_ALIASES.get(slug) || slug;
  return STADIUM_PROFILES_INTERNAL.find((profile) => profile.slug === canonicalSlug) || null;
}

export function getStadiumProfileByVenue(venue: string) {
  return getStadiumProfile(getVenueSlug(venue));
}

export function getPredictionForMatch(match: IplMatch) {
  const team1Profile = TEAMS.find((team) => team.name === match.team1.name);
  const team2Profile = TEAMS.find((team) => team.name === match.team2.name);
  const homeAdvantageTeam =
    TEAMS.find((team) => getVenueSlug(team.venue) === match.venueSlug)?.name ||
    getStadiumProfileByVenue(match.venue)?.homeTeams[0] ||
    null;

  let team1Score = 0;
  let team2Score = 0;
  const reasons: string[] = [];

  if (homeAdvantageTeam === match.team1.name) {
    team1Score += 1.2;
    reasons.push(`${match.team1.shortName} have the venue familiarity edge at ${getVenueBaseName(match.venue)}.`);
  } else if (homeAdvantageTeam === match.team2.name) {
    team2Score += 1.2;
    reasons.push(`${match.team2.shortName} have the venue familiarity edge at ${getVenueBaseName(match.venue)}.`);
  }

  if (team1Profile && team2Profile) {
    if (team1Profile.lastYearRank < team2Profile.lastYearRank) {
      team1Score += 0.8;
      reasons.push(`${match.team1.shortName} finished ahead of ${match.team2.shortName} in the 2025 league standings.`);
    } else if (team2Profile.lastYearRank < team1Profile.lastYearRank) {
      team2Score += 0.8;
      reasons.push(`${match.team2.shortName} finished ahead of ${match.team1.shortName} in the 2025 league standings.`);
    }
  }

  const stadiumProfile = getStadiumProfileByVenue(match.venue);
  if (stadiumProfile) {
    reasons.push(stadiumProfile.shortSummary);
  }

  const winner = team1Score >= team2Score ? match.team1 : match.team2;
  const confidenceDelta = Math.abs(team1Score - team2Score);

  return {
    winner,
    confidence: confidenceDelta >= 1.2 ? "Moderate edge" : "Slight edge",
    reasons: reasons.slice(0, 3),
  };
}
