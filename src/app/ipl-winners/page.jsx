import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata = {
  title: "IPL Winners List 2008-2025 | IPL Scorebook",
  description:
    "Complete IPL winners list from 2008 to 2025 with finals results, runner-up teams, venues and Player of the Match. Updated through 2025. Check now.",
  keywords: [
    "ipl winners list",
    "ipl champions",
    "ipl finals results",
    "ipl 2025 winner",
    "ipl history",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/ipl-winners`,
    languages: {
      en: `${baseUrl}/ipl-winners`,
    },
  },
  openGraph: {
    title: "IPL Winners List 2008-2025 | IPL Scorebook",
    description:
      "Complete IPL winners list from 2008 to 2025 with finals results, runner-up teams, venues and Player of the Match. Updated through 2025. Check now.",
    url: `${baseUrl}/ipl-winners`,
    type: "article",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL winners list preview",
      },
    ],
    modifiedTime: new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Winners List 2008-2025 | IPL Scorebook",
    description:
      "Complete IPL winners list from 2008 to 2025 with finals results, runner-up teams, venues and Player of the Match. Updated through 2025. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

const winnersData = [
  { year: 2008, winner: "Rajasthan Royals", runner: "CSK", venue: "Mumbai", pom: "Yusuf Pathan", result: "RR won by 3 wickets" },
  { year: 2009, winner: "Deccan Chargers", runner: "RCB", venue: "Johannesburg", pom: "Anil Kumble", result: "DC won by 6 runs" },
  { year: 2010, winner: "CSK", runner: "Mumbai Indians", venue: "Mumbai", pom: "Suresh Raina", result: "CSK won by 22 runs" },
  { year: 2011, winner: "CSK", runner: "RCB", venue: "Chennai", pom: "Murali Vijay", result: "CSK won by 58 runs" },
  { year: 2012, winner: "KKR", runner: "CSK", venue: "Chennai", pom: "Manvinder Bisla", result: "KKR won by 5 wickets" },
  { year: 2013, winner: "Mumbai Indians", runner: "CSK", venue: "Kolkata", pom: "Kieron Pollard", result: "MI won by 23 runs" },
  { year: 2014, winner: "KKR", runner: "Kings XI Punjab", venue: "Bangalore", pom: "Manish Pandey", result: "KKR won by 3 wickets" },
  { year: 2015, winner: "Mumbai Indians", runner: "CSK", venue: "Kolkata", pom: "Rohit Sharma", result: "MI won by 41 runs" },
  { year: 2016, winner: "Sunrisers Hyderabad", runner: "RCB", venue: "Bangalore", pom: "Ben Cutting", result: "SRH won by 8 runs" },
  { year: 2017, winner: "Mumbai Indians", runner: "Rising Pune", venue: "Hyderabad", pom: "Krunal Pandya", result: "MI won by 1 run" },
  { year: 2018, winner: "CSK", runner: "SRH", venue: "Mumbai", pom: "Shane Watson", result: "CSK won by 8 wickets" },
  { year: 2019, winner: "Mumbai Indians", runner: "CSK", venue: "Hyderabad", pom: "Jasprit Bumrah", result: "MI won by 1 run" },
  { year: 2020, winner: "Mumbai Indians", runner: "Delhi Capitals", venue: "Dubai", pom: "Trent Boult", result: "MI won by 5 wickets" },
  { year: 2021, winner: "CSK", runner: "KKR", venue: "Dubai", pom: "Faf du Plessis", result: "CSK won by 27 runs" },
  { year: 2022, winner: "Gujarat Titans", runner: "RR", venue: "Ahmedabad", pom: "Hardik Pandya", result: "GT won by 7 wickets" },
  { year: 2023, winner: "CSK", runner: "Gujarat Titans", venue: "Ahmedabad", pom: "Devon Conway", result: "CSK won by 5 wickets" },
  { year: 2024, winner: "KKR", runner: "SRH", venue: "Chennai", pom: "Mitchell Starc", result: "KKR won by 8 wickets" },
  { year: 2025, winner: "RCB", runner: "PBKS", venue: "PCA New Cricket Stadium, Tirs", pom: "Suyash Sharma", result: "Royal Challengers Bengaluru won by 6 runs" },
];

const latestYear = Math.max(...winnersData.map((w) => w.year));
const latestWinner = winnersData.find((w) => w.year === latestYear);
const totalSeasons = winnersData.length;

export default function IPLWinnersPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `IPL Winners List 2008-${latestYear}`,
    itemListElement: winnersData.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${w.year} IPL Winner: ${w.winner}`,
      description: w.result,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Who won IPL ${latestYear}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${latestWinner?.winner} won IPL ${latestYear}.`,
        },
      },
      {
        "@type": "Question",
        name: "Which team has won the most IPL titles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mumbai Indians have won the most IPL titles with five championships.",
        },
      },
      {
        "@type": "Question",
        name: `Where was IPL ${latestYear} final held?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: latestWinner?.venue || "The final venue is listed on the IPL winners page.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "IPL Winners", item: `${baseUrl}/ipl-winners` },
    ],
  };

  return (
    <div className="ipl-page" style={{ marginTop: "30px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([itemListSchema, faqSchema, breadcrumbSchema]) }}
      />

      <div className="page-container">
        <section className="hero">
          <h1>IPL Winners List (2008-{latestYear})</h1>
          <p>IPL winners list with champions, finals results, venues, and Player of the Match details. Check now.</p>
        </section>

        <section className="section">
          <div className="stats-grid">
            <StatCard title="Most Titles" value="Mumbai Indians (5)" />
            <StatCard title="Latest Winner" value={`${latestWinner?.winner} (${latestYear})`} />
            <StatCard title="First Winner" value="Rajasthan Royals" />
            <StatCard title="Total Seasons" value={`${totalSeasons}`} />
          </div>
        </section>

        <section className="section">
          <div className="table-card">
            <div className="table-scroll">
              <table className="ipl-table">
                <caption>IPL winners list with finals results and venues</caption>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Winner</th>
                    <th>Runner-Up</th>
                    <th>Venue</th>
                    <th>Player of Match</th>
                    <th>Result</th>
                  </tr>
                </thead>

                <tbody>
                  {winnersData.map((item) => (
                    <tr key={item.year}>
                      <td>{item.year}</td>
                      <td>{item.winner}</td>
                      <td>{item.runner}</td>
                      <td>{item.venue}</td>
                      <td>{item.pom}</td>
                      <td>{item.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section faq">
          <h2>IPL Winners FAQ</h2>
          <p><strong>Who won IPL {latestYear}?</strong> {latestWinner?.winner}.</p>
          <p><strong>Which team has most IPL trophies?</strong> Mumbai Indians.</p>
          <p><strong>Where was IPL {latestYear} final held?</strong> {latestWinner?.venue}.</p>
        </section>

        <section className="section">
          <h2 style={{ fontSize: "22px" }}>Related IPL Pages</h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/ipl-teams" className="btn-primary">IPL teams and franchises</Link>
            <Link href="/players" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              IPL player stats directory
            </Link>
            <Link href="/auction" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              IPL 2026 auction results
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="col-md-3">
      <div className="stat-card">
        <h6>{title}</h6>
        <h4>{value}</h4>
      </div>
    </div>
  );
}
