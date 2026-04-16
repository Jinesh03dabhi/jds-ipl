import type { TeamId } from "./types";
import { generateSlug } from "@/lib/slug";

export type SeoVenue = {
  id: string;
  slug: string;
  name: string;
  city: string;
  homeTeamIds: TeamId[];
  averageFirstInningsScore: number;
  averageSecondInningsScore: number;
  battingFirstWinRate: number;
  chasingWinRate: number;
  tossWinRate: number;
  paceFactor: number;
  spinFactor: number;
  boundariesPerMatch: number;
  sixesPerMatch: number;
  pitchSummary: string;
  tossImpact: string;
  winningPattern: string;
};

const VENUE_NAME_ALIASES = new Map<string, string>([
  ["Rajiv Gandhi Intl. Cricket Stadium", "Rajiv Gandhi International Stadium"],
  ["M. A. Chidambaram Stadium", "M. A. Chidambaram Stadium"],
  ["M. Chinnaswamy Stadium", "M. Chinnaswamy Stadium"],
]);

export function normalizeVenueName(name: string) {
  const baseName = name.split(",")[0]?.trim() || name.trim();
  return VENUE_NAME_ALIASES.get(baseName) || baseName;
}

const VENUE_SEEDS: Omit<SeoVenue, "id" | "slug">[] = [
  {
    name: "M. A. Chidambaram Stadium",
    city: "Chennai",
    homeTeamIds: ["csk"],
    averageFirstInningsScore: 171,
    averageSecondInningsScore: 163,
    battingFirstWinRate: 54,
    chasingWinRate: 46,
    tossWinRate: 55,
    paceFactor: 0.86,
    spinFactor: 1.18,
    boundariesPerMatch: 41,
    sixesPerMatch: 15,
    pitchSummary:
      "Chepauk usually slows down through the middle overs, so teams with finger spin, wrist spin and pace-off control keep squeezing the chase.",
    tossImpact:
      "Captains often lean toward batting first here when the pitch looks dry because defending with spin becomes easier as the surface gets older.",
    winningPattern:
      "Powerplay discipline and middle-over spin are the clearest win conditions at Chennai.",
  },
  {
    name: "Arun Jaitley Stadium",
    city: "Delhi",
    homeTeamIds: ["dc"],
    averageFirstInningsScore: 184,
    averageSecondInningsScore: 177,
    battingFirstWinRate: 48,
    chasingWinRate: 52,
    tossWinRate: 58,
    paceFactor: 0.93,
    spinFactor: 1.02,
    boundariesPerMatch: 48,
    sixesPerMatch: 20,
    pitchSummary:
      "Delhi tends to reward clean hitting and quick boundary conversion, especially once batters survive the new-ball spell.",
    tossImpact:
      "Chasing remains attractive because smaller boundaries keep required rates within reach for longer than at most venues.",
    winningPattern:
      "Death-over execution matters more than slow middle phases because totals can move quickly in the last six overs.",
  },
  {
    name: "Narendra Modi Stadium",
    city: "Ahmedabad",
    homeTeamIds: ["gt"],
    averageFirstInningsScore: 181,
    averageSecondInningsScore: 173,
    battingFirstWinRate: 51,
    chasingWinRate: 49,
    tossWinRate: 53,
    paceFactor: 1.01,
    spinFactor: 0.98,
    boundariesPerMatch: 46,
    sixesPerMatch: 18,
    pitchSummary:
      "Ahmedabad plays differently across strips, but the broader pattern is a fair balance between high-scoring batting and disciplined bowling plans.",
    tossImpact:
      "Surface reading matters more than venue reputation because the black-soil and red-soil strips behave differently.",
    winningPattern:
      "Balanced attacks that can switch between hit-the-deck pace and spin control usually travel best in Ahmedabad.",
  },
  {
    name: "Eden Gardens",
    city: "Kolkata",
    homeTeamIds: ["kkr"],
    averageFirstInningsScore: 186,
    averageSecondInningsScore: 181,
    battingFirstWinRate: 49,
    chasingWinRate: 51,
    tossWinRate: 56,
    paceFactor: 1.03,
    spinFactor: 0.97,
    boundariesPerMatch: 49,
    sixesPerMatch: 21,
    pitchSummary:
      "Eden Gardens generally offers true pace and carry, which keeps aggressive top-order batting in play from ball one.",
    tossImpact:
      "Evening conditions can freshen up the chase, but the exact call still depends on how dry the strip looks at the toss.",
    winningPattern:
      "Sides that attack the powerplay without leaking at the death are usually the ones that control Eden Gardens fixtures.",
  },
  {
    name: "Ekana Cricket Stadium",
    city: "Lucknow",
    homeTeamIds: ["lsg"],
    averageFirstInningsScore: 166,
    averageSecondInningsScore: 158,
    battingFirstWinRate: 55,
    chasingWinRate: 45,
    tossWinRate: 51,
    paceFactor: 0.88,
    spinFactor: 1.14,
    boundariesPerMatch: 38,
    sixesPerMatch: 13,
    pitchSummary:
      "Lucknow remains one of the more controlled batting environments in this dataset, with grip and pace variation staying relevant deep into the innings.",
    tossImpact:
      "Batting first is a live choice because the middle overs can get stickier once the surface dries out.",
    winningPattern:
      "Teams with stronger spin overs and patient batting platforms usually outlast all-out hitters at Ekana.",
  },
  {
    name: "Wankhede Stadium",
    city: "Mumbai",
    homeTeamIds: ["mi"],
    averageFirstInningsScore: 189,
    averageSecondInningsScore: 183,
    battingFirstWinRate: 47,
    chasingWinRate: 53,
    tossWinRate: 59,
    paceFactor: 1.07,
    spinFactor: 0.92,
    boundariesPerMatch: 50,
    sixesPerMatch: 22,
    pitchSummary:
      "Wankhede gives seamers early carry, but once the shine goes the surface rewards batters who can hit straight and square with confidence.",
    tossImpact:
      "Captains regularly chase because dew and skid can reduce the margin for error when defending under lights.",
    winningPattern:
      "Powerplay wickets plus late-innings yorkers decide a huge share of matches in Mumbai.",
  },
  {
    name: "New PCA Stadium",
    city: "New Chandigarh",
    homeTeamIds: ["pbks"],
    averageFirstInningsScore: 176,
    averageSecondInningsScore: 169,
    battingFirstWinRate: 52,
    chasingWinRate: 48,
    tossWinRate: 52,
    paceFactor: 0.97,
    spinFactor: 0.99,
    boundariesPerMatch: 43,
    sixesPerMatch: 16,
    pitchSummary:
      "New Chandigarh usually offers a more balanced contest, with early seam movement still in the game if bowlers land the right length.",
    tossImpact:
      "The toss matters less than execution here because neither innings feels dramatically easier on the average surface.",
    winningPattern:
      "Sides that protect boundary pockets and stay calm through the middle overs tend to win at this venue.",
  },
  {
    name: "Sawai Mansingh Stadium",
    city: "Jaipur",
    homeTeamIds: ["rr"],
    averageFirstInningsScore: 175,
    averageSecondInningsScore: 168,
    battingFirstWinRate: 53,
    chasingWinRate: 47,
    tossWinRate: 50,
    paceFactor: 0.91,
    spinFactor: 1.08,
    boundariesPerMatch: 42,
    sixesPerMatch: 15,
    pitchSummary:
      "Jaipur sits in the balanced middle ground: good batting once set, but enough grip for spinners and cutters to shape the tempo.",
    tossImpact:
      "Captains weigh conditions carefully because both innings can work depending on dryness and the chance of dew.",
    winningPattern:
      "Balanced batting orders with at least two quality spin options usually finish strongest in Jaipur.",
  },
  {
    name: "M. Chinnaswamy Stadium",
    city: "Bengaluru",
    homeTeamIds: ["rcb"],
    averageFirstInningsScore: 193,
    averageSecondInningsScore: 188,
    battingFirstWinRate: 46,
    chasingWinRate: 54,
    tossWinRate: 61,
    paceFactor: 1.05,
    spinFactor: 0.9,
    boundariesPerMatch: 54,
    sixesPerMatch: 24,
    pitchSummary:
      "The Chinnaswamy remains one of the quickest scoring venues in the cycle because short boundaries and a fast outfield punish defensive lengths.",
    tossImpact:
      "Chasing is usually the preferred toss call because even a strong first-innings score can disappear quickly at this ground.",
    winningPattern:
      "High-end death batting and brave yorker execution shape more results here than slow accumulation.",
  },
  {
    name: "Rajiv Gandhi International Stadium",
    city: "Hyderabad",
    homeTeamIds: ["srh"],
    averageFirstInningsScore: 191,
    averageSecondInningsScore: 184,
    battingFirstWinRate: 49,
    chasingWinRate: 51,
    tossWinRate: 57,
    paceFactor: 1.02,
    spinFactor: 0.95,
    boundariesPerMatch: 51,
    sixesPerMatch: 23,
    pitchSummary:
      "Hyderabad has produced some of the cleanest high-scoring decks in the league, with top-order hitters often dictating the game early.",
    tossImpact:
      "If evening dew is likely, captains are generally comfortable chasing because the ball skids on cleanly later in the night.",
    winningPattern:
      "Aggressive batting depth and smarter slower balls at the death decide a big share of Hyderabad fixtures.",
  },
];

export const SEO_VENUES: SeoVenue[] = VENUE_SEEDS.map((venue) => ({
  ...venue,
  id: generateSlug(venue.name),
  slug: generateSlug(venue.name),
}));
