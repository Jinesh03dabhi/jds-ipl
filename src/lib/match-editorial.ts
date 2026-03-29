import {
  formatIndiaDateTime,
  getPredictionForMatch,
  getStadiumProfileByVenue,
  type IplMatch,
} from "@/lib/ipl-data";
import { PLAYERS, TEAMS, type LegacyPlayer, type LegacyTeam } from "@/lib/data";
import { countWords } from "@/lib/content";

export type MatchEditorialMode = "preview" | "live" | "result";

export type MatchTimelineItem = {
  title: string;
  detail: string;
};

export type MatchComparisonMetric = {
  label: string;
  team1: string;
  team2: string;
};

export type TeamFocusCard = {
  teamName: string;
  primaryPlayer: string;
  secondaryPlayer: string;
  note: string;
};

export type MatchEditorial = {
  summary: string[];
  highlights: string[];
  playerAnalysis: string[];
  insights: string[];
  venueAnalysis: string[];
  timeline: MatchTimelineItem[];
  comparison: MatchComparisonMetric[];
  teamFocus: TeamFocusCard[];
  contentWordCount: number;
  sourcesNote: string;
};

function ordinal(value: number) {
  const remainder10 = value % 10;
  const remainder100 = value % 100;

  if (remainder10 === 1 && remainder100 !== 11) return `${value}st`;
  if (remainder10 === 2 && remainder100 !== 12) return `${value}nd`;
  if (remainder10 === 3 && remainder100 !== 13) return `${value}rd`;
  return `${value}th`;
}

function formatRunRate(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "not available in the current dataset";
  }

  return value.toFixed(2);
}

function teamProfile(name: string) {
  return TEAMS.find((team) => team.name === name) || null;
}

function squadForTeam(name: string) {
  return PLAYERS.filter((player) => player.currentTeam === name);
}

function topBatter(name: string) {
  return [...squadForTeam(name)].sort((left, right) => {
    const runDelta = (right.stats?.runs ?? 0) - (left.stats?.runs ?? 0);
    if (runDelta !== 0) {
      return runDelta;
    }

    return (right.stats?.strikeRate ?? 0) - (left.stats?.strikeRate ?? 0);
  })[0] || null;
}

function strikeBowler(name: string) {
  return [...squadForTeam(name)].sort((left, right) => {
    const wicketDelta = (right.stats?.wickets ?? 0) - (left.stats?.wickets ?? 0);
    if (wicketDelta !== 0) {
      return wicketDelta;
    }

    return (left.stats?.economy ?? Number.MAX_SAFE_INTEGER) -
      (right.stats?.economy ?? Number.MAX_SAFE_INTEGER);
  })[0] || null;
}

function anchorText(player: LegacyPlayer | null, fallbackTeamName: string) {
  if (!player) {
    return `${fallbackTeamName} will rely on a collective effort rather than one standout statistical anchor.`;
  }

  const runs = player.stats?.runs ?? 0;
  const wickets = player.stats?.wickets ?? 0;
  const strikeRate = player.stats?.strikeRate;
  const economy = player.stats?.economy;

  if (runs > 0 && wickets > 0) {
    return `${player.name} brings dual value with ${runs} runs, ${wickets} wickets and a tempo profile that keeps both phases of the innings in play.`;
  }

  if (runs > 0) {
    return `${player.name} is the batting reference point with ${runs} runs and a strike rate of ${formatRunRate(strikeRate)}.`;
  }

  if (wickets > 0) {
    return `${player.name} leads the wicket-taking load with ${wickets} wickets and an economy of ${formatRunRate(economy)}.`;
  }

  return `${player.name} is part of the core matchday conversation even though the current dataset does not carry a standout statistical spike.`;
}

function buildSummary(
  match: IplMatch,
  mode: MatchEditorialMode,
  team1Profile: LegacyTeam | null,
  team2Profile: LegacyTeam | null,
) {
  const prediction = getPredictionForMatch(match);
  const stadium = getStadiumProfileByVenue(match.venue);
  const startTime = formatIndiaDateTime(match.dateTimeGMT);
  const resultLine = match.result || "the final result is still pending";

  if (mode === "live") {
    return [
      `${match.team1.name} and ${match.team2.name} come into this live route with the same core questions every serious cricket fan has on matchday: what the pitch is rewarding, which side is controlling the powerplay, and whether the toss has tilted the chase. The fixture is scheduled for ${startTime} IST at ${match.venue}, so this page is designed to stay useful before the first ball, during the match, and after the game moves into recap mode.`,
      `${prediction.winner.name} carried the ${prediction.confidence.toLowerCase()} in the pre-match model, but the live texture of the game matters more than any static pick. ${stadium?.pitchSummary || "The venue notes in the current dataset still suggest that phase control will matter more than hype."} ${match.tossWinner ? `${match.tossWinner} have already shaped the script by choosing to ${match.tossChoice || "make the first call"}.` : "The toss note will stay factual and update only when the source confirms it."}`,
    ];
  }

  if (mode === "result") {
    return [
      `${match.team1.name} vs ${match.team2.name} now has a permanent result page because recap traffic behaves differently from preview traffic. Fans returning after the game want the outcome, the scoreline, and a quick read on why the match tilted the way it did. This fixture at ${match.venue} started at ${startTime} IST, and the feed currently records the headline result as ${resultLine}.`,
      `${match.winner ? `${match.winner} finished on the right side of the contest,` : "If the winner field is still missing from the feed,"} but the deeper story sits in the same pressure points we track before every IPL fixture: powerplay scoring, middle-over squeeze, and death-over execution. ${prediction.winner.name} were the original editorial lean, which gives this page a useful prediction-versus-outcome angle instead of just dumping a final score and stopping there.`,
    ];
  }

  return [
    `${match.team1.name} vs ${match.team2.name} is a fixture that deserves more than a scoreboard stub because searchers usually want context before the toss, not just a date and venue. Match ${match.matchNumberValue ?? ""} is scheduled for ${startTime} IST at ${match.venue}, and the current editorial model gives ${prediction.winner.name} the ${prediction.confidence.toLowerCase()} heading into the game.`,
    `${stadium?.pitchSummary || "The venue profile in the current dataset suggests a balanced contest."} ${team1Profile ? `${match.team1.shortName} closed IPL 2025 in ${ordinal(team1Profile.lastYearRank)} place,` : `${match.team1.shortName} bring a known franchise base,`} while ${team2Profile ? `${match.team2.shortName} finished ${ordinal(team2Profile.lastYearRank)} last season.` : `${match.team2.shortName} arrive with their own established squad identity.`} That blend of venue behavior, recent team standing, and key-player form is what turns a thin fixture page into a genuinely useful preview.`,
  ];
}

function buildPlayerAnalysis(
  match: IplMatch,
  team1Batter: LegacyPlayer | null,
  team2Batter: LegacyPlayer | null,
  team1Bowler: LegacyPlayer | null,
  team2Bowler: LegacyPlayer | null,
) {
  return [
    `${match.team1.name} will naturally look toward ${team1Batter?.name || "their top order"} to set the early tempo. ${anchorText(team1Batter, match.team1.name)} On the other side, ${match.team2.name} have their own attacking reference in ${team2Batter?.name || "their batting core"}, and that duel should define whether the game opens with clean powerplay scoring or a more cautious start.`,
    `The second layer of this contest sits with the strike bowlers. ${anchorText(team1Bowler, match.team1.name)} ${anchorText(team2Bowler, match.team2.name)} In a typical IPL game that means whoever wins the overs immediately after the powerplay often ends up controlling the rest of the innings, because the platform either expands or tightens from there.`,
  ];
}

function buildInsights(match: IplMatch, mode: MatchEditorialMode) {
  const stadium = getStadiumProfileByVenue(match.venue);
  const prediction = getPredictionForMatch(match);

  const baseParagraph =
    stadium
      ? `${stadium.tossAngle} The pitch profile also says this ground is best for ${stadium.bestFor.toLowerCase()}, which makes tactical discipline more important than raw star power.`
      : "Without a strong venue note, the safest tactical read is to watch how quickly the batting side settles after the new ball.";

  if (mode === "result") {
    return [
      `Result pages should explain how a match was likely decided, even when the external feed does not yet provide a full ball-by-ball archive. For this fixture, the most believable swing points remain the familiar IPL pressure zones: whether the batting side got ahead of par in the powerplay, whether the spin or pace-off options slowed the middle overs, and which attack handled the last four overs with cleaner execution.`,
      `${baseParagraph} That is also why the pre-match lean toward ${prediction.winner.name} is still worth keeping on the page. It gives readers a clear before-and-after lens instead of forcing them to guess whether the original tactical read held up once the match actually played out.`,
    ];
  }

  if (mode === "live") {
    return [
      `Live pages work best when they frame the score inside a cricketing story. A scoreboard can tell you who is ahead at this moment, but it cannot tell you whether the run rate is genuinely healthy for the surface, whether one bowling unit is holding back its best overs, or whether the toss has created a stronger chase than the raw numbers suggest.`,
      `${baseParagraph} The current pre-match edge still belongs to ${prediction.winner.name}, but the main thing to track now is not the headline pick. It is whether the match is following the venue script or breaking away from it.`,
    ];
  }

  return [
    `The smartest pre-match read for this fixture is to think in phases rather than headlines. If one side gets a clean six-over start, the middle overs will open up for boundary hitters and finishing all-rounders. If the new-ball bowlers land their lengths early, the match can slow down and reward patience instead of all-out intent.`,
    `${baseParagraph} That is why the current lean toward ${prediction.winner.name} should be treated as an editorial nudge, not a certainty. The toss, the first two overs, and the match-up between anchor batters and change-up bowlers can rewrite the forecast very quickly in IPL cricket.`,
  ];
}

function buildVenueAnalysis(match: IplMatch) {
  const stadium = getStadiumProfileByVenue(match.venue);

  if (!stadium) {
    return [
      `${match.venue} does not yet have a full venue profile in the current dataset, so this section stays conservative and avoids inventing a fresh curator report.`,
      `Even without a deeper venue note, users still need a practical answer on matchday: expect the toss, powerplay control and boundary size to matter more than generic franchise reputation.`,
    ];
  }

  return [
    `${stadium.shortSummary} ${stadium.pitchSummary}`,
    `${stadium.tossAngle} The ground is usually best for ${stadium.bestFor.toLowerCase()}, while the main caution is that ${stadium.caution.toLowerCase()}`,
  ];
}

function buildTimeline(match: IplMatch, mode: MatchEditorialMode): MatchTimelineItem[] {
  const tossDetail = match.tossWinner
    ? `${match.tossWinner} won the toss and chose to ${match.tossChoice || "make the first call"}.`
    : "Toss and team-sheet confirmation remain the first major checkpoint.";

  if (mode === "result") {
    return [
      {
        title: "Toss and Setup",
        detail: tossDetail,
      },
      {
        title: "Powerplay Pressure",
        detail: "The opening six overs usually decide whether the batting side stays ahead of the venue rate or is forced to rebuild.",
      },
      {
        title: "Middle-Overs Swing",
        detail: "The contest often tilts when the strike bowlers return and the better rotation side protects wickets without losing scoring intent.",
      },
      {
        title: "Closing Overs",
        detail: "Death-over execution, yorkers, slower balls and boundary access usually decide whether a good position becomes a winning one.",
      },
    ];
  }

  if (mode === "live") {
    return [
      {
        title: "Pre-Toss Checkpoint",
        detail: tossDetail,
      },
      {
        title: "Opening Burst",
        detail: "Watch whether the batting side gets ahead of par in the first two overs or whether seamers control the tempo immediately.",
      },
      {
        title: "Middle-Overs Control",
        detail: "Spin, cutters and strike rotation often decide whether the live score reflects true dominance or only a temporary burst.",
      },
      {
        title: "Death Overs Watch",
        detail: "The last four overs are where venue behavior, dew and finishing quality start to matter most.",
      },
    ];
  }

  return [
    {
      title: "Team News Window",
      detail: "Lineups, impact-sub plans and the toss decision are the last major variables before the preview locks into a firmer match call.",
    },
    {
      title: "Powerplay Match-Up",
      detail: "Whichever top order handles the new ball better will shape the rest of the innings and the pace of the chase.",
    },
    {
      title: "Middle-Overs Grip",
      detail: "This is the phase where spinners and pace-off bowlers either squeeze the scoring or lose the tactical thread.",
    },
    {
      title: "Death-Over Finish",
      detail: "Even balanced fixtures often separate in the final overs when one side finishes cleaner with bat or ball.",
    },
  ];
}

function buildComparison(
  match: IplMatch,
  team1Profile: LegacyTeam | null,
  team2Profile: LegacyTeam | null,
  team1Batter: LegacyPlayer | null,
  team2Batter: LegacyPlayer | null,
  team1Bowler: LegacyPlayer | null,
  team2Bowler: LegacyPlayer | null,
) {
  return [
    {
      label: "IPL titles",
      team1: String(team1Profile?.titles.length ?? 0),
      team2: String(team2Profile?.titles.length ?? 0),
    },
    {
      label: "2025 finish",
      team1: team1Profile ? ordinal(team1Profile.lastYearRank) : "N/A",
      team2: team2Profile ? ordinal(team2Profile.lastYearRank) : "N/A",
    },
    {
      label: "Top batter runs",
      team1: team1Batter ? String(team1Batter.stats?.runs ?? 0) : "0",
      team2: team2Batter ? String(team2Batter.stats?.runs ?? 0) : "0",
    },
    {
      label: "Lead bowler wickets",
      team1: team1Bowler ? String(team1Bowler.stats?.wickets ?? 0) : "0",
      team2: team2Bowler ? String(team2Bowler.stats?.wickets ?? 0) : "0",
    },
  ];
}

function buildTeamFocus(
  match: IplMatch,
  team1Batter: LegacyPlayer | null,
  team2Batter: LegacyPlayer | null,
  team1Bowler: LegacyPlayer | null,
  team2Bowler: LegacyPlayer | null,
) {
  return [
    {
      teamName: match.team1.name,
      primaryPlayer: team1Batter?.name || "Top-order watch",
      secondaryPlayer: team1Bowler?.name || "Bowling unit",
      note: `${team1Batter?.name || match.team1.shortName} shapes the batting ceiling, while ${team1Bowler?.name || "the bowling unit"} decides whether ${match.team1.shortName} can control the middle overs.`,
    },
    {
      teamName: match.team2.name,
      primaryPlayer: team2Batter?.name || "Top-order watch",
      secondaryPlayer: team2Bowler?.name || "Bowling unit",
      note: `${team2Batter?.name || match.team2.shortName} gives the innings its base tempo, and ${team2Bowler?.name || "the bowling unit"} is the clearest route to momentum-changing breakthroughs.`,
    },
  ];
}

function buildHighlights(
  match: IplMatch,
  mode: MatchEditorialMode,
  team1Batter: LegacyPlayer | null,
  team2Batter: LegacyPlayer | null,
) {
  const prediction = getPredictionForMatch(match);

  return [
    `${match.team1.name} vs ${match.team2.name} is scheduled for ${formatIndiaDateTime(match.dateTimeGMT)} IST at ${match.venue}.`,
    `${prediction.winner.name} hold the ${prediction.confidence.toLowerCase()} in the current editorial model.`,
    `${team1Batter?.name || match.team1.shortName} and ${team2Batter?.name || match.team2.shortName} are the headline batting anchors to watch.`,
    match.tossWinner
      ? `${match.tossWinner} have already won the toss and shaped the early match script.`
      : "Toss and official playing XI status remain key update points before first ball.",
    mode === "result"
      ? `${match.result || "Result status is pending in the feed, so the recap stays honest about what is confirmed."}`
      : "Venue behavior, powerplay control and death-over execution should matter more than brand-name hype.",
  ];
}

export function buildMatchEditorial(match: IplMatch, mode: MatchEditorialMode): MatchEditorial {
  const team1Profile = teamProfile(match.team1.name);
  const team2Profile = teamProfile(match.team2.name);
  const team1Batter = topBatter(match.team1.name);
  const team2Batter = topBatter(match.team2.name);
  const team1Bowler = strikeBowler(match.team1.name);
  const team2Bowler = strikeBowler(match.team2.name);

  const summary = buildSummary(match, mode, team1Profile, team2Profile);
  const highlights = buildHighlights(match, mode, team1Batter, team2Batter);
  const playerAnalysis = buildPlayerAnalysis(
    match,
    team1Batter,
    team2Batter,
    team1Bowler,
    team2Bowler,
  );
  const insights = buildInsights(match, mode);
  const venueAnalysis = buildVenueAnalysis(match);
  const timeline = buildTimeline(match, mode);
  const comparison = buildComparison(
    match,
    team1Profile,
    team2Profile,
    team1Batter,
    team2Batter,
    team1Bowler,
    team2Bowler,
  );
  const teamFocus = buildTeamFocus(
    match,
    team1Batter,
    team2Batter,
    team1Bowler,
    team2Bowler,
  );

  return {
    summary,
    highlights,
    playerAnalysis,
    insights,
    venueAnalysis,
    timeline,
    comparison,
    teamFocus,
    contentWordCount: countWords(
      summary,
      highlights,
      playerAnalysis,
      insights,
      venueAnalysis,
      timeline.map((item) => `${item.title} ${item.detail}`),
      teamFocus.map((item) => item.note),
      comparison.map((item) => `${item.label} ${item.team1} ${item.team2}`),
    ),
    sourcesNote:
      "Editorial sections are generated from the current match schedule, curated squad statistics, and venue profiles stored in IPL Scorebook. Live fields such as toss and result are shown only when the source confirms them.",
  };
}
