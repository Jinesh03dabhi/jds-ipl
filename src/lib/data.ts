// ===== TYPES =====

export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  nationality: 'Indian' | 'Overseas';
  currentTeam: string;
  soldPrice: string;
  avatarUrl?: string;
  stats: {
    matches: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
    economy?: number;
  };
  auctionHistory: {
    year: number;
    team: string;
    price: string;
  }[];
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  logoUrl?: string;
  titles: number[];
  owner: string;
  venue: string;
  lastYearRank: number;
  historyRankings: { year: number; rank: number }[];
}

// ===== TEAMS (unchanged) =====

export const TEAMS: Team[] = [
  {
    id: 'mi',
    name: 'Mumbai Indians',
    abbreviation: 'MI',
    color: '#004BA0',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/MI.png',
    titles: [2013, 2015, 2017, 2019, 2020],
    owner: 'Reliance Industries (Ambanis)',
    venue: 'Wankhede Stadium, Mumbai',
    lastYearRank: 4,
    historyRankings: [
      { year: 2025, rank: 4 },
      { year: 2024, rank: 10 },
      { year: 2023, rank: 4 },
      { year: 2022, rank: 10 },
      { year: 2021, rank: 5 },
      { year: 2020, rank: 1 }
    ]
  },
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    abbreviation: 'CSK',
    color: '#FFFF00',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/CSK.png',
    titles: [2010, 2011, 2018, 2021, 2023],
    owner: 'India Cements (N. Srinivasan)',
    venue: 'M. A. Chidambaram Stadium, Chennai',
    lastYearRank: 10,
    historyRankings: [
      { year: 2025, rank: 10 },
      { year: 2024, rank: 5 },
      { year: 2023, rank: 1 },
      { year: 2022, rank: 9 },
      { year: 2021, rank: 1 },
      { year: 2020, rank: 7 }
    ]
  },
  {
    id: 'rcb',
    name: 'Royal Challengers Bengaluru',
    abbreviation: 'RCB',
    color: '#EC1C24',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/RCB.png',
    titles: [],
    owner: 'United Spirits (Diageo)',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    lastYearRank: 2,
    historyRankings: [
      { year: 2025, rank: 2 },
      { year: 2024, rank: 4 },
      { year: 2023, rank: 6 },
      { year: 2022, rank: 4 },
      { year: 2021, rank: 4 },
      { year: 2020, rank: 4 }
    ]
  },
  {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    abbreviation: 'KKR',
    color: '#3A225D',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/KKR.png',
    titles: [2012, 2014, 2024],
    owner: 'Red Chillies & Mehta Group',
    venue: 'Eden Gardens, Kolkata',
    lastYearRank: 8,
    historyRankings: [
      { year: 2025, rank: 8 },
      { year: 2024, rank: 1 },
      { year: 2023, rank: 7 },
      { year: 2022, rank: 7 },
      { year: 2021, rank: 2 },
      { year: 2020, rank: 5 }
    ]
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    abbreviation: 'GT',
    color: '#2d3d73',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/GT.png',
    titles: [2022],
    owner: 'Torrent Group & CVC Capital',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    lastYearRank: 3,
    historyRankings: [
      { year: 2025, rank: 3 },
      { year: 2024, rank: 8 },
      { year: 2023, rank: 2 },
      { year: 2022, rank: 1 }
    ]
  },
  {
    id: 'lsg',
    name: 'Lucknow Super Giants',
    abbreviation: 'LSG',
    color: '#0057E2',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/LSG.png',
    titles: [],
    owner: 'RPSG Group (Sanjiv Goenka)',
    venue: 'Ekana Cricket Stadium, Lucknow',
    lastYearRank: 7,
    historyRankings: [
      { year: 2025, rank: 7 },
      { year: 2024, rank: 7 },
      { year: 2023, rank: 3 },
      { year: 2022, rank: 3 }
    ]
  },
  {
    id: 'rr',
    name: 'Rajasthan Royals',
    abbreviation: 'RR',
    color: '#EA1A85',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/RR.png',
    titles: [2008],
    owner: 'Emerging Media (Manoj Badale)',
    venue: 'Sawai Mansingh Stadium, Jaipur',
    lastYearRank: 9,
    historyRankings: [
      { year: 2025, rank: 9 },
      { year: 2024, rank: 3 },
      { year: 2023, rank: 5 },
      { year: 2022, rank: 2 },
      { year: 2021, rank: 7 },
      { year: 2020, rank: 8 }
    ]
  },
  {
    id: 'dc',
    name: 'Delhi Capitals',
    abbreviation: 'DC',
    color: '#00008B',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/DC.png',
    titles: [],
    owner: 'GMR Group & JSW Sports',
    venue: 'Arun Jaitley Stadium, Delhi',
    lastYearRank: 5,
    historyRankings: [
      { year: 2025, rank: 5 },
      { year: 2024, rank: 6 },
      { year: 2023, rank: 9 },
      { year: 2022, rank: 5 },
      { year: 2021, rank: 3 },
      { year: 2020, rank: 2 }
    ]
  },
  {
    id: 'pbks',
    name: 'Punjab Kings',
    abbreviation: 'PBKS',
    color: '#D71920',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/PBKS.png',
    titles: [2025],
    owner: 'KPH Dreamz (Preity Zinta, Ness Wadia)',
    venue: 'PCA Stadium, Mohali',
    lastYearRank: 1,
    historyRankings: [
      { year: 2025, rank: 1 },
      { year: 2024, rank: 9 },
      { year: 2023, rank: 8 },
      { year: 2022, rank: 6 },
      { year: 2021, rank: 6 },
      { year: 2020, rank: 6 }
    ]
  },
  {
    id: 'srh',
    name: 'Sunrisers Hyderabad',
    abbreviation: 'SRH',
    color: '#FF822A',
    logoUrl: 'https://scores.iplt20.com/ipl/teamlogos/SRH.png',
    titles: [2016],
    owner: 'Sun TV Network (Kalanithi Maran)',
    venue: 'Rajiv Gandhi International Cricket Stadium, Hyderabad',
    lastYearRank: 6,
    historyRankings: [
      { year: 2025, rank: 6 },
      { year: 2024, rank: 2 },
      { year: 2023, rank: 10 },
      { year: 2022, rank: 8 },
      { year: 2021, rank: 8 },
      { year: 2020, rank: 3 }
    ]
  }
];

// ===== PLAYERS CLEANED =====



export const PLAYERS: Player[] = [
  {
    id: "2026-001",
    name: "Cameron Green",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Kolkata Knight Riders",
    soldPrice: "25.20 Cr",
    avatarUrl: "/players/cameron-green.webp",
    stats: { matches: 13, runs: 255, wickets: 10, strikeRate: 143.26, economy: 9.41 },
    auctionHistory: [{ year: 2026, team: "Kolkata Knight Riders", price: "25.20 Cr" }]
  },
  {
    id: "2026-002",
    name: "Matheesha Pathirana",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Kolkata Knight Riders",
    soldPrice: "18 Cr",
    avatarUrl: "/players/matheesha-pathirana.webp",
    stats: { matches: 6, wickets: 13, economy: 7.68 },
    auctionHistory: [{ year: 2026, team: "Kolkata Knight Riders", price: "18 Cr" }]
  },
  {
    id: "2026-003",
    name: "Prashant Veer",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Chennai Super Kings",
    soldPrice: "14.20 Cr",
    avatarUrl: "/players/prashant-veer.webp",
    stats: { matches: 0, runs: 0, wickets: 0 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "14.20 Cr" }]
  },
  {
    id: "2026-004",
    name: "Kartik Sharma",
    role: "Wicket-keeper",
    nationality: "Indian",
    currentTeam: "Chennai Super Kings",
    soldPrice: "14.20 Cr",
    avatarUrl: "/players/kartik-sharma.webp",
    stats: { matches: 0, runs: 0 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "14.20 Cr" }]
  },
  {
    id: "2026-005",
    name: "Aaqib Dar",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Delhi Capitals",
    soldPrice: "8.40 Cr",
    avatarUrl: "/players/aaqib-dar.jpg",
    stats: { matches: 0, runs: 0, wickets: 0 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "8.40 Cr" }]
  },
  {
    id: "2026-006",
    name: "Ravi Bishnoi",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Rajasthan Royals",
    soldPrice: "7.20 Cr",
    avatarUrl: "/players/ravi-bishnoi.jpg",
    stats: { matches: 14, wickets: 10, economy: 8.77 },
    auctionHistory: [{ year: 2026, team: "Rajasthan Royals", price: "7.20 Cr" }]
  },
  {
    id: "2026-007",
    name: "Venkatesh Iyer",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Royal Challengers Bengaluru",
    soldPrice: "7 Cr",
    avatarUrl: "/players/venkatesh-iyer.webp",
    stats: { matches: 14, runs: 370, strikeRate: 158.80 },
    auctionHistory: [{ year: 2026, team: "Royal Challengers Bengaluru", price: "7 Cr" }]
  },
  {
    id: "2026-008",
    name: "Liam Livingstone",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "13 Cr",
    avatarUrl: "/players/liam-livingstone.jpg",
    stats: { matches: 7, runs: 111, strikeRate: 142.31 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "13 Cr" }]
  },
  {
    id: "2026-009",
    name: "David Miller",
    role: "Batsman",
    nationality: "Overseas",
    currentTeam: "Delhi Capitals",
    soldPrice: "2 Cr",
    avatarUrl: "/players/david-miller.webp",
    stats: { matches: 9, runs: 210, strikeRate: 151.08 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "2 Cr" }]
  },
  {
    id: "2026-010",
    name: "Quinton de Kock",
    role: "Wicket-keeper",
    nationality: "Overseas",
    currentTeam: "Mumbai Indians",
    soldPrice: "1 Cr",
    avatarUrl: "/players/quinton-de-kock.jpg",
    stats: { matches: 11, runs: 250, strikeRate: 134.41 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "1 Cr" }]
  },
  {
    id: "2026-011",
    name: "Ben Duckett",
    role: "Wicket-keeper",
    nationality: "Overseas",
    currentTeam: "Delhi Capitals",
    soldPrice: "2 Cr",
    avatarUrl: "/players/ben-duckett.webp",
    stats: { matches: 0, runs: 0 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "2 Cr" }]
  },
  {
    id: "2026-012",
    name: "Finn Allen",
    role: "Batsman",
    nationality: "Overseas",
    currentTeam: "Kolkata Knight Riders",
    soldPrice: "2 Cr",
    avatarUrl: "/players/finn-allen.webp",
    stats: { matches: 0, runs: 0 },
    auctionHistory: [{ year: 2026, team: "Kolkata Knight Riders", price: "2 Cr" }]
  },
  {
    id: "2026-013",
    name: "Akshat Raghuwanshi",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Lucknow Super Giants",
    soldPrice: "2.2 Cr",
    avatarUrl: "/players/akshat-raghuwanshi.webp",
    stats: { matches: 0, runs: 0 },
    auctionHistory: [{ year: 2026, team: "Lucknow Super Giants", price: "2.2 Cr" }]
  },
  {
    id: "2026-014",
    name: "Wanindu Hasaranga",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Rajasthan Royals",
    soldPrice: "10 Cr",
    avatarUrl: "/players/wanindu-hasaranga.jpg",
    stats: { matches: 0, runs: 0, wickets: 0 },
    auctionHistory: [{ year: 2026, team: "Rajasthan Royals", price: "10 Cr" }]
  },
  {
    id: "2026-015",
    name: "Josh Hazlewood",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Royal Challengers Bengaluru",
    soldPrice: "11 Cr",
    avatarUrl: "/players/josh-hazlewood.webp",
    stats: { matches: 0, wickets: 0 },
    auctionHistory: [{ year: 2026, team: "Royal Challengers Bengaluru", price: "11 Cr" }]
  },
  {
    id: "2026-016",
    name: "Mitchell Starc",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Gujarat Titans",
    soldPrice: "9.5 Cr",
    avatarUrl: "/players/mitchell-starc.jpg",
    stats: { matches: 14, wickets: 17, economy: 10.61 },
    auctionHistory: [{ year: 2026, team: "Gujarat Titans", price: "9.5 Cr" }]
  },
  {
    id: "2026-017",
    name: "Kagiso Rabada",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Punjab Kings",
    soldPrice: "9.25 Cr",
    avatarUrl: "/players/kagiso-rabada.jpg",
    stats: { matches: 11, wickets: 11, economy: 8.86 },
    auctionHistory: [{ year: 2026, team: "Punjab Kings", price: "9.25 Cr" }]
  },
  {
    id: "2026-018",
    name: "Pat Cummins",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "8 Cr",
    avatarUrl: "/players/pat-cummins.jpg",
    stats: { matches: 16, wickets: 18, economy: 9.27 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "8 Cr" }]
  },
  {
    id: "2026-019",
    name: "Shubman Gill",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Gujarat Titans",
    soldPrice: "8 Cr",
    avatarUrl: "/players/shubman-gill.jpg",
    stats: { matches: 12, runs: 426, average: 38.73, strikeRate: 147.40 },
    auctionHistory: [{ year: 2026, team: "Gujarat Titans", price: "8 Cr" }]
  },
  {
    id: "2026-020",
    name: "Ruturaj Gaikwad",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Chennai Super Kings",
    soldPrice: "7 Cr",
    avatarUrl: "/players/ruturaj-gaikwad.jpg",
    stats: { matches: 14, runs: 583, average: 53.00, strikeRate: 141.16 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "7 Cr" }]
  },
  {
    id: "2026-021",
    name: "KL Rahul",
    role: "Wicket-keeper",
    nationality: "Indian",
    currentTeam: "Lucknow Super Giants",
    soldPrice: "11 Cr",
    avatarUrl: "/players/kl-rahul.jpg",
    stats: { matches: 14, runs: 520, average: 37.14, strikeRate: 136.13 },
    auctionHistory: [{ year: 2026, team: "Lucknow Super Giants", price: "11 Cr" }]
  },
  {
    id: "2026-022",
    name: "Ishan Kishan",
    role: "Wicket-keeper",
    nationality: "Indian",
    currentTeam: "Mumbai Indians",
    soldPrice: "8.25 Cr",
    avatarUrl: "/players/ishan-kishan.jpg",
    stats: { matches: 14, runs: 320, strikeRate: 148.84 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "8.25 Cr" }]
  },
  {
    id: "2026-023",
    name: "Sanju Samson",
    role: "Wicket-keeper",
    nationality: "Indian",
    currentTeam: "Rajasthan Royals",
    soldPrice: "7 Cr",
    avatarUrl: "/players/sanju-samson.jpg",
    stats: { matches: 15, runs: 531, average: 48.27, strikeRate: 153.47 },
    auctionHistory: [{ year: 2026, team: "Rajasthan Royals", price: "7 Cr" }]
  },
  {
    id: "2026-024",
    name: "Hardik Pandya",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Mumbai Indians",
    soldPrice: "15 Cr",
    avatarUrl: "/players/hardik-pandya.jpg",
    stats: { matches: 14, runs: 216, wickets: 11, economy: 10.75 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "15 Cr" }]
  },
  {
    id: "2026-025",
    name: "Ravindra Jadeja",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Chennai Super Kings",
    soldPrice: "16 Cr",
    avatarUrl: "/players/ravindra-jadeja.jpg",
    stats: { matches: 14, runs: 267, wickets: 8, economy: 7.85 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "16 Cr" }]
  },
  {
    id: "2026-026",
    name: "Axar Patel",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Delhi Capitals",
    soldPrice: "9 Cr",
    avatarUrl: "/players/axar-patel.webp",
    stats: { matches: 14, runs: 235, wickets: 11, economy: 7.65 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "9 Cr" }]
  },
  {
    id: "2026-027",
    name: "Mohammed Siraj",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Royal Challengers Bengaluru",
    soldPrice: "7 Cr",
    avatarUrl: "/players/mohammed-siraj.jpg",
    stats: { matches: 14, wickets: 15, economy: 9.18 },
    auctionHistory: [{ year: 2026, team: "Royal Challengers Bengaluru", price: "7 Cr" }]
  },
  {
    id: "2026-028",
    name: "Jasprit Bumrah",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Mumbai Indians",
    soldPrice: "12 Cr",
    avatarUrl: "/players/jasprit-bumrah.jpg",
    stats: { matches: 13, wickets: 20, economy: 6.48 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "12 Cr" }]
  },
  {
    id: "2026-029",
    name: "Arshdeep Singh",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Punjab Kings",
    soldPrice: "6 Cr",
    avatarUrl: "/players/arshdeep-singh.jpg",
    stats: { matches: 14, wickets: 19, economy: 10.03 },
    auctionHistory: [{ year: 2026, team: "Punjab Kings", price: "6 Cr" }]
  },
  {
    id: "2026-030",
    name: "Yuzvendra Chahal",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Rajasthan Royals",
    soldPrice: "6.5 Cr",
    avatarUrl: "/players/yuzvendra-chahal.jpg",
    stats: { matches: 15, wickets: 18, economy: 9.41 },
    auctionHistory: [{ year: 2026, team: "Rajasthan Royals", price: "6.5 Cr" }]
  },
  {
    id: "2026-031",
    name: "Kuldeep Yadav",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Delhi Capitals",
    soldPrice: "6 Cr",
    avatarUrl: "/players/kuldeep-yadav.jpg",
    stats: { matches: 11, wickets: 16, economy: 8.69 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "6 Cr" }]
  },
  {
    id: "2026-032",
    name: "Bhuvneshwar Kumar",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "4.2 Cr",
    avatarUrl: "/players/bhuvneshwar-kumar.jpg",
    stats: { matches: 14, wickets: 11, economy: 9.23 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "4.2 Cr" }]
  },
  {
    id: "2026-033",
    name: "Shardul Thakur",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Chennai Super Kings",
    soldPrice: "4 Cr",
    avatarUrl: "/players/shardul-thakur.webp",
    stats: { matches: 9, wickets: 5, economy: 9.75 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "4 Cr" }]
  },
  {
    id: "2026-034",
    name: "Deepak Chahar",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Chennai Super Kings",
    soldPrice: "6.75 Cr",
    avatarUrl: "/players/deepak-chahar.webp",
    stats: { matches: 8, wickets: 5, economy: 8.60 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "6.75 Cr" }]
  },
  {
    id: "2026-035",
    name: "T Natarajan",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "4 Cr",
    avatarUrl: "/players/t-natarajan.webp",
    stats: { matches: 14, wickets: 19, economy: 9.05 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "4 Cr" }]
  },
  {
    id: "2026-036",
    name: "Lockie Ferguson",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Kolkata Knight Riders",
    soldPrice: "10 Cr",
    avatarUrl: "/players/lockie-ferguson.webp",
    stats: { matches: 7, wickets: 9, economy: 10.62 },
    auctionHistory: [{ year: 2026, team: "Kolkata Knight Riders", price: "10 Cr" }]
  },
  {
    id: "2026-037",
    name: "Tim David",
    role: "Batsman",
    nationality: "Overseas",
    currentTeam: "Mumbai Indians",
    soldPrice: "8.25 Cr",
    avatarUrl: "/players/tim-david.webp",
    stats: { matches: 13, runs: 241, strikeRate: 158.55 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "8.25 Cr" }]
  },
  {
    id: "2026-038",
    name: "Glenn Maxwell",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Royal Challengers Bengaluru",
    soldPrice: "11 Cr",
    avatarUrl: "/players/glenn-maxwell.webp",
    stats: { matches: 10, runs: 52, wickets: 6, strikeRate: 120.93 },
    auctionHistory: [{ year: 2026, team: "Royal Challengers Bengaluru", price: "11 Cr" }]
  },
  {
    id: "2026-039",
    name: "Marcus Stoinis",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Lucknow Super Giants",
    soldPrice: "8 Cr",
    avatarUrl: "/players/marcus-stoinis.jpg",
    stats: { matches: 14, runs: 388, wickets: 4, strikeRate: 147.52 },
    auctionHistory: [{ year: 2026, team: "Lucknow Super Giants", price: "8 Cr" }]
  },
  {
    id: "2026-040",
    name: "Nicholas Pooran",
    role: "Wicket-keeper",
    nationality: "Overseas",
    currentTeam: "Lucknow Super Giants",
    soldPrice: "7.5 Cr",
    avatarUrl: "/players/nicholas-pooran.jpg",
    stats: { matches: 14, runs: 499, average: 62.38, strikeRate: 178.21 },
    auctionHistory: [{ year: 2026, team: "Lucknow Super Giants", price: "7.5 Cr" }]
  },
  {
    id: "2026-041",
    name: "Shimron Hetmyer",
    role: "Batsman",
    nationality: "Overseas",
    currentTeam: "Rajasthan Royals",
    soldPrice: "8 Cr",
    avatarUrl: "/players/shimron-hetmyer.jpg",
    stats: { matches: 12, runs: 113, strikeRate: 163.76 },
    auctionHistory: [{ year: 2026, team: "Rajasthan Royals", price: "8 Cr" }]
  },
  {
    id: "2026-042",
    name: "Devon Conway",
    role: "Batsman",
    nationality: "Overseas",
    currentTeam: "Chennai Super Kings",
    soldPrice: "1 Cr",
    avatarUrl: "/players/devon-conway.jpg",
    stats: { matches: 0, runs: 0 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "1 Cr" }]
  },
  {
    id: "2026-043",
    name: "Jos Buttler",
    role: "Wicket-keeper",
    nationality: "Overseas",
    currentTeam: "Rajasthan Royals",
    soldPrice: "10 Cr",
    avatarUrl: "/players/jos-buttler.webp",
    stats: { matches: 11, runs: 359, average: 39.89, strikeRate: 140.78 },
    auctionHistory: [{ year: 2026, team: "Rajasthan Royals", price: "10 Cr" }]
  },
  {
    id: "2026-044",
    name: "David Warner",
    role: "Batsman",
    nationality: "Overseas",
    currentTeam: "Delhi Capitals",
    soldPrice: "6.25 Cr",
    avatarUrl: "/players/david-warner.jpg",
    stats: { matches: 8, runs: 168, strikeRate: 134.40 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "6.25 Cr" }]
  },
  {
    id: "2026-045",
    name: "Faf du Plessis",
    role: "Batsman",
    nationality: "Overseas",
    currentTeam: "Royal Challengers Bengaluru",
    soldPrice: "7 Cr",
    avatarUrl: "/players/faf-du-plessis.jpg",
    stats: { matches: 15, runs: 438, average: 29.20, strikeRate: 161.62 },
    auctionHistory: [{ year: 2026, team: "Royal Challengers Bengaluru", price: "7 Cr" }]
  },
  {
    id: "2026-046",
    name: "Kane Williamson",
    role: "Batsman",
    nationality: "Overseas",
    currentTeam: "Gujarat Titans",
    soldPrice: "2 Cr",
    avatarUrl: "/players/kane-williamson.jpg",
    stats: { matches: 2, runs: 27 },
    auctionHistory: [{ year: 2026, team: "Gujarat Titans", price: "2 Cr" }]
  },
  {
    id: "2026-047",
    name: "Rahul Tripathi",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "5 Cr",
    avatarUrl: "/players/rahul-tripathi.jpg",
    stats: { matches: 6, runs: 161, strikeRate: 141.22 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "5 Cr" }]
  },
  {
    id: "2026-048",
    name: "Nitish Rana",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Kolkata Knight Riders",
    soldPrice: "8 Cr",
    avatarUrl: "/players/nitish-rana.webp",
    stats: { matches: 2, runs: 42 },
    auctionHistory: [{ year: 2026, team: "Kolkata Knight Riders", price: "8 Cr" }]
  },
  {
    id: "2026-049",
    name: "Rinku Singh",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Kolkata Knight Riders",
    soldPrice: "5.5 Cr",
    avatarUrl: "/players/rinku-singh.jpg",
    stats: { matches: 14, runs: 168, strikeRate: 148.67 },
    auctionHistory: [{ year: 2026, team: "Kolkata Knight Riders", price: "5.5 Cr" }]
  },
  {
    id: "2026-050",
    name: "Suryakumar Yadav",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Mumbai Indians",
    soldPrice: "8 Cr",
    avatarUrl: "/players/suryakumar-yadav.jpg",
    stats: { matches: 11, runs: 345, average: 34.50, strikeRate: 167.47 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "8 Cr" }]
  },
  {
    id: "2026-051",
    name: "Tilak Varma",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Mumbai Indians",
    soldPrice: "4 Cr",
    avatarUrl: "/players/tilak-varma.webp",
    stats: { matches: 13, runs: 416, average: 41.60, strikeRate: 149.64 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "4 Cr" }]
  },
  {
    id: "2026-052",
    name: "Prithvi Shaw",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Delhi Capitals",
    soldPrice: "7.5 Cr",
    avatarUrl: "/players/prithvi-shaw.jpg",
    stats: { matches: 8, runs: 198, strikeRate: 163.63 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "7.5 Cr" }]
  },
  {
    id: "2026-053",
    name: "Mayank Agarwal",
    role: "Batsman",
    nationality: "Indian",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "8.25 Cr",
    avatarUrl: "/players/mayank-agarwal.webp",
    stats: { matches: 4, runs: 64 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "8.25 Cr" }]
  },
  {
    id: "2026-054",
    name: "Abhishek Sharma",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "6.5 Cr",
    avatarUrl: "/players/abhishek-sharma.webp",
    stats: { matches: 16, runs: 484, wickets: 2, strikeRate: 204.21 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "6.5 Cr" }]
  },
  {
    id: "2026-055",
    name: "Washington Sundar",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "8.75 Cr",
    avatarUrl: "/players/washington-sundar.webp",
    stats: { matches: 2, wickets: 1 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "8.75 Cr" }]
  },
  {
    id: "2026-056",
    name: "Krunal Pandya",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Lucknow Super Giants",
    soldPrice: "8.25 Cr",
    avatarUrl: "/players/krunal-pandya.jpg",
    stats: { matches: 14, runs: 188, wickets: 6, economy: 7.33 },
    auctionHistory: [{ year: 2026, team: "Lucknow Super Giants", price: "8.25 Cr" }]
  },
  {
    id: "2026-057",
    name: "Harshal Patel",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Royal Challengers Bengaluru",
    soldPrice: "10.75 Cr",
    avatarUrl: "/players/harshal-patel.webp",
    stats: { matches: 14, wickets: 24, economy: 9.73 },
    auctionHistory: [{ year: 2026, team: "Royal Challengers Bengaluru", price: "10.75 Cr" }]
  },
  {
    id: "2026-058",
    name: "Anrich Nortje",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Delhi Capitals",
    soldPrice: "6.5 Cr",
    avatarUrl: "/players/anrich-nortje.webp",
    stats: { matches: 6, wickets: 7, economy: 13.36 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "6.5 Cr" }]
  },
  {
    id: "2026-059",
    name: "Mustafizur Rahman",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Chennai Super Kings",
    soldPrice: "2 Cr",
    avatarUrl: "/players/mustafizur-rahman.webp",
    stats: { matches: 9, wickets: 14, economy: 9.26 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "2 Cr" }]
  },
  {
    id: "2026-060",
    name: "Trent Boult",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Rajasthan Royals",
    soldPrice: "8 Cr",
    avatarUrl: "/players/trent-boult.webp",
    stats: { matches: 15, wickets: 16, economy: 8.30 },
    auctionHistory: [{ year: 2026, team: "Rajasthan Royals", price: "8 Cr" }]
  },
  {
    id: "2026-061",
    name: "Chris Jordan",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Mumbai Indians",
    soldPrice: "2 Cr",
    avatarUrl: "/players/chris-jordan.webp",
    stats: { matches: 0, wickets: 0 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "2 Cr" }]
  },
  {
    id: "2026-062",
    name: "Sam Curran",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Punjab Kings",
    soldPrice: "18.5 Cr",
    avatarUrl: "/players/sam-curran.jpg",
    stats: { matches: 13, runs: 270, wickets: 16, economy: 10.15 },
    auctionHistory: [{ year: 2026, team: "Punjab Kings", price: "18.5 Cr" }]
  },
  {
    id: "2026-063",
    name: "Ben Stokes",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Chennai Super Kings",
    soldPrice: "16.25 Cr",
    avatarUrl: "/players/ben-stokes.webp",
    stats: { matches: 0, runs: 0, wickets: 0 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "16.25 Cr" }]
  },
  {
    id: "2026-064",
    name: "Daryl Mitchell",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Chennai Super Kings",
    soldPrice: "14 Cr",
    avatarUrl: "/players/daryl-mitchell.webp",
    stats: { matches: 13, runs: 318, strikeRate: 142.60 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "14 Cr" }]
  },
  {
    id: "2026-065",
    name: "Glenn Phillips",
    role: "Wicket-keeper",
    nationality: "Overseas",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "1.5 Cr",
    avatarUrl: "/players/glenn-phillips.webp",
    stats: { matches: 1, runs: 0 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "1.5 Cr" }]
  },
  {
    id: "2026-066",
    name: "Rashid Khan",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Gujarat Titans",
    soldPrice: "15 Cr",
    avatarUrl: "/players/rashid-khan.jpg",
    stats: { matches: 12, wickets: 10, economy: 8.40 },
    auctionHistory: [{ year: 2026, team: "Gujarat Titans", price: "15 Cr" }]
  },
  {
    id: "2026-067",
    name: "Noor Ahmad",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Gujarat Titans",
    soldPrice: "8.5 Cr",
    avatarUrl: "/players/noor-ahmad.jpg",
    stats: { matches: 10, wickets: 8, economy: 8.32 },
    auctionHistory: [{ year: 2026, team: "Gujarat Titans", price: "8.5 Cr" }]
  },
  {
    id: "2026-068",
    name: "Mohammed Shami",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Gujarat Titans",
    soldPrice: "6.25 Cr",
    avatarUrl: "/players/mohammed-shami.jpg",
    stats: { matches: 0, wickets: 0 },
    auctionHistory: [{ year: 2026, team: "Gujarat Titans", price: "6.25 Cr" }]
  },
  {
    id: "2026-069",
    name: "Avesh Khan",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Lucknow Super Giants",
    soldPrice: "10 Cr",
    avatarUrl: "/players/avesh-khan.jpg",
    stats: { matches: 16, wickets: 19, economy: 9.59 },
    auctionHistory: [{ year: 2026, team: "Lucknow Super Giants", price: "10 Cr" }]
  },
  {
    id: "2026-070",
    name: "Umesh Yadav",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Gujarat Titans",
    soldPrice: "5.8 Cr",
    avatarUrl: "/players/umesh-yadav.webp",
    stats: { matches: 7, wickets: 8, economy: 10.04 },
    auctionHistory: [{ year: 2026, team: "Gujarat Titans", price: "5.8 Cr" }]
  },
  {
    id: "2026-071",
    name: "Mukesh Kumar",
    role: "Bowler",
    nationality: "Indian",
    currentTeam: "Delhi Capitals",
    soldPrice: "5.5 Cr",
    avatarUrl: "/players/mukesh-kumar.webp",
    stats: { matches: 10, wickets: 17, economy: 10.36 },
    auctionHistory: [{ year: 2026, team: "Delhi Capitals", price: "5.5 Cr" }]
  },
  {
    id: "2026-072",
    name: "Shivam Dube",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Chennai Super Kings",
    soldPrice: "4 Cr",
    avatarUrl: "/players/shivam-dube.webp",
    stats: { matches: 14, runs: 396, strikeRate: 162.29 },
    auctionHistory: [{ year: 2026, team: "Chennai Super Kings", price: "4 Cr" }]
  },
  {
    id: "2026-073",
    name: "Riyan Parag",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Rajasthan Royals",
    soldPrice: "3.8 Cr",
    avatarUrl: "/players/riyan-parag.webp",
    stats: { matches: 15, runs: 573, average: 52.09, strikeRate: 149.21 },
    auctionHistory: [{ year: 2026, team: "Rajasthan Royals", price: "3.8 Cr" }]
  },
  {
    id: "2026-074",
    name: "Shahbaz Ahmed",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Sunrisers Hyderabad",
    soldPrice: "2.4 Cr",
    avatarUrl: "/players/shahbaz-ahmed.jpg",
    stats: { matches: 16, runs: 207, wickets: 3, strikeRate: 137.08 },
    auctionHistory: [{ year: 2026, team: "Sunrisers Hyderabad", price: "2.4 Cr" }]
  },
  {
    id: "2026-075",
    name: "Vijay Shankar",
    role: "All-rounder",
    nationality: "Indian",
    currentTeam: "Gujarat Titans",
    soldPrice: "1.4 Cr",
    avatarUrl: "/players/vijay-shankar.webp",
    stats: { matches: 7, runs: 83, strikeRate: 125.75 },
    auctionHistory: [{ year: 2026, team: "Gujarat Titans", price: "1.4 Cr" }]
  },
  {
    id: "2026-076",
    name: "Romario Shepherd",
    role: "All-rounder",
    nationality: "Overseas",
    currentTeam: "Mumbai Indians",
    soldPrice: "7.75 Cr",
    avatarUrl: "/players/romario-shepherd.webp",
    stats: { matches: 5, runs: 67, wickets: 1, strikeRate: 280.00 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "7.75 Cr" }]
  },
  {
    id: "2026-077",
    name: "Gerald Coetzee",
    role: "Bowler",
    nationality: "Overseas",
    currentTeam: "Mumbai Indians",
    soldPrice: "5 Cr",
    avatarUrl: "/players/gerald-coetzee.webp",
    stats: { matches: 10, wickets: 13, economy: 10.17 },
    auctionHistory: [{ year: 2026, team: "Mumbai Indians", price: "5 Cr" }]
  }
];






// export const PLAYERS: Player[] = [

//   { id: 'cameron-green', name: 'Cameron Green', role: 'All-rounder', nationality: 'Overseas', currentTeam: 'Kolkata Knight Riders', soldPrice: '25.20 Cr', avatarUrl: '/players/cameron-green.webp', stats: { strikeRate : 153.70 }, auctionHistory: [] },
//   { id: 'matheesha-pathirana', name: 'Matheesha Pathirana', role: 'Bowler', nationality: 'Overseas', currentTeam: 'Kolkata Knight Riders', soldPrice: '18 Cr', avatarUrl: '/players/matheesha-pathirana.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'prashant-veer', name: 'Prashant Veer', role: 'All-rounder', nationality: 'Indian', currentTeam: 'Chennai Super Kings', soldPrice: '14.20 Cr', avatarUrl: '/players/prashant-veer.webp', stats: { matches: 0 }, auctionHistory: [] },
//   { id: 'kartik-sharma', name: 'Kartik Sharma', role: 'All-rounder', nationality: 'Indian', currentTeam: 'Chennai Super Kings', soldPrice: '14.20 Cr', avatarUrl: '/players/kartik-sharma.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'aaqib-dar', name: 'Aaqib Dar', role: 'Bowler', nationality: 'Indian', currentTeam: 'Delhi Capitals', soldPrice: '8.40 Cr', avatarUrl: '/players/aaqib-dar.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'ravi-bishnoi', name: 'Ravi Bishnoi', role: 'Bowler', nationality: 'Indian', currentTeam: 'Rajasthan Royals', soldPrice: '7.20 Cr', avatarUrl: '/players/ravi-bishnoi.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'venkatesh-iyer', name: 'Venkatesh Iyer', role: 'All-rounder', nationality: 'Indian', currentTeam: 'Royal Challengers Bengaluru', soldPrice: '7 Cr', avatarUrl: '/players/venkatesh-iyer.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'liam-livingstone', name: 'Liam Livingstone', role: 'All-rounder', nationality: 'Overseas', currentTeam: 'Sunrisers Hyderabad', soldPrice: '13 Cr', avatarUrl: '/players/liam-livingstone.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'david-miller', name: 'David Miller', role: 'Batsman', nationality: 'Overseas', currentTeam: 'Delhi Capitals', soldPrice: '2 Cr', avatarUrl: '/players/david-miller.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'quinton-de-kock', name: 'Quinton de Kock', role: 'Wicket-keeper', nationality: 'Overseas', currentTeam: 'Mumbai Indians', soldPrice: '1 Cr', avatarUrl: '/players/quinton-de-kock.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'ben-duckett', name: 'Ben Duckett', role: 'Batsman', nationality: 'Overseas', currentTeam: 'Delhi Capitals', soldPrice: '2 Cr', avatarUrl: '/players/ben-duckett.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'finn-allen', name: 'Finn Allen', role: 'Wicket-keeper', nationality: 'Overseas', currentTeam: 'Kolkata Knight Riders', soldPrice: '2 Cr', avatarUrl: '/players/finn-allen.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'akshat-raghuwanshi', name: 'Akshat Raghuwanshi', role: 'Batsman', nationality: 'Indian', currentTeam: 'Lucknow Super Giants', soldPrice: '2.2 Cr', avatarUrl: '/players/akshat-raghuwanshi.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'wanindu-hasaranga', name: 'Wanindu Hasaranga', role: 'All-rounder', nationality: 'Overseas', currentTeam: 'Rajasthan Royals', soldPrice: '10 Cr', avatarUrl: '/players/wanindu-hasaranga.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'josh-hazlewood', name: 'Josh Hazlewood', role: 'Bowler', nationality: 'Overseas', currentTeam: 'Royal Challengers Bengaluru', soldPrice: '11 Cr', avatarUrl: '/players/josh-hazlewood.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'mitchell-starc', name: 'Mitchell Starc', role: 'Bowler', nationality: 'Overseas', currentTeam: 'Gujarat Titans', soldPrice: '9.5 Cr', avatarUrl: '/players/mitchell-starc.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'kagiso-rabada', name: 'Kagiso Rabada', role: 'Bowler', nationality: 'Overseas', currentTeam: 'Punjab Kings', soldPrice: '9.25 Cr', avatarUrl: '/players/kagiso-rabada.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'pat-cummins', name: 'Pat Cummins', role: 'Bowler', nationality: 'Overseas', currentTeam: 'Sunrisers Hyderabad', soldPrice: '8 Cr', avatarUrl: '/players/pat-cummins.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'shubman-gill', name: 'Shubman Gill', role: 'Batsman', nationality: 'Indian', currentTeam: 'Gujarat Titans', soldPrice: '8 Cr', avatarUrl: '/players/shubman-gill.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'ruturaj-gaikwad', name: 'Ruturaj Gaikwad', role: 'Batsman', nationality: 'Indian', currentTeam: 'Chennai Super Kings', soldPrice: '7 Cr', avatarUrl: '/players/ruturaj-gaikwad.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'kl-rahul', name: 'KL Rahul', role: 'Wicket-keeper', nationality: 'Indian', currentTeam: 'Lucknow Super Giants', soldPrice: '11 Cr', avatarUrl: '/players/kl-rahul.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'ishan-kishan', name: 'Ishan Kishan', role: 'Wicket-keeper', nationality: 'Indian', currentTeam: 'Mumbai Indians', soldPrice: '8.25 Cr', avatarUrl: '/players/ishan-kishan.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'sanju-samson', name: 'Sanju Samson', role: 'Wicket-keeper', nationality: 'Indian', currentTeam: 'Rajasthan Royals', soldPrice: '7 Cr', avatarUrl: '/players/sanju-samson.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'hardik-pandya', name: 'Hardik Pandya', role: 'All-rounder', nationality: 'Indian', currentTeam: 'Mumbai Indians', soldPrice: '15 Cr', avatarUrl: '/players/hardik-pandya.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'ravindra-jadeja', name: 'Ravindra Jadeja', role: 'All-rounder', nationality: 'Indian', currentTeam: 'Chennai Super Kings', soldPrice: '16 Cr', avatarUrl: '/players/ravindra-jadeja.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'jasprit-bumrah', name: 'Jasprit Bumrah', role: 'Bowler', nationality: 'Indian', currentTeam: 'Mumbai Indians', soldPrice: '12 Cr', avatarUrl: '/players/jasprit-bumrah.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'axar-patel', name: 'Axar Patel', role: 'All-rounder', nationality: 'Indian', currentTeam: 'Delhi Capitals', soldPrice: '9 Cr', avatarUrl: '/players/axar-patel.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'mohammed-siraj', name: 'Mohammed Siraj', role: 'Bowler', nationality: 'Indian', currentTeam: 'Royal Challengers Bengaluru', soldPrice: '7 Cr', avatarUrl: '/players/mohammed-siraj.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'arshdeep-singh', name: 'Arshdeep Singh', role: 'Bowler', nationality: 'Indian', currentTeam: 'Punjab Kings', soldPrice: '6 Cr', avatarUrl: '/players/arshdeep-singh.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'yuzvendra-chahal', name: 'Yuzvendra Chahal', role: 'Bowler', nationality: 'Indian', currentTeam: 'Rajasthan Royals', soldPrice: '6.5 Cr', avatarUrl: '/players/yuzvendra-chahal.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'kuldeep-yadav', name: 'Kuldeep Yadav', role: 'Bowler', nationality: 'Indian', currentTeam: 'Delhi Capitals', soldPrice: '6 Cr', avatarUrl: '/players/kuldeep-yadav.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'bhuvneshwar-kumar', name: 'Bhuvneshwar Kumar', role: 'Bowler', nationality: 'Indian', currentTeam: 'Sunrisers Hyderabad', soldPrice: '4.2 Cr', avatarUrl: '/players/bhuvneshwar-kumar.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'deepak-chahar', name: 'Deepak Chahar', role: 'Bowler', nationality: 'Indian', currentTeam: 'Chennai Super Kings', soldPrice: '6.75 Cr', avatarUrl: '/players/deepak-chahar.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'rashid-khan', name: 'Rashid Khan', role: 'Bowler', nationality: 'Overseas', currentTeam: 'Gujarat Titans', soldPrice: '15 Cr', avatarUrl: '/players/rashid-khan.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'sam-curran', name: 'Sam Curran', role: 'All-rounder', nationality: 'Overseas', currentTeam: 'Punjab Kings', soldPrice: '18.5 Cr', avatarUrl: '/players/sam-curran.jpg', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'ben-stokes', name: 'Ben Stokes', role: 'All-rounder', nationality: 'Overseas', currentTeam: 'Chennai Super Kings', soldPrice: '16.25 Cr', avatarUrl: '/players/ben-stokes.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'daryl-mitchell', name: 'Daryl Mitchell', role: 'All-rounder', nationality: 'Overseas', currentTeam: 'Chennai Super Kings', soldPrice: '14 Cr', avatarUrl: '/players/daryl-mitchell.webp', stats: { matches: 0 }, auctionHistory: [] },

//   { id: 'mohammed-shami', name: 'Mohammed Shami', role: 'Bowler', nationality: 'Indian', currentTeam: 'Gujarat Titans', soldPrice: '6.25 Cr', avatarUrl: '/players/mohammed-shami.jpg', stats: { matches: 0 }, auctionHistory: [] },

// ];
