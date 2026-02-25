import Link from "next/link";

export const metadata = {
  title: "IPL Winners List 2008–2025 | Complete Champions History",
  description:
    "Full IPL winners list from 2008 to 2025 including finals results, runner-up teams, venues, and player of the match.",
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
  { year: 2025, winner: "RCB", runner: "PBKS", venue: "PCA New cricket Stadium , Tirs", pom: "Suyash sharma", result: "Royal Challengers Bengaluru won by 6 runs" },
];

export default function IPLWinnersPage() {
  return (
    <div className="ipl-page" style={{marginTop:"30px"}}>

  <div className="page-container">

    {/* HERO */}
    <section className="hero">
      <h1>🏆 IPL Winners List (2008–2025)</h1>
      <p>Complete list of IPL champions, finals results, venues, and Player of the Match.</p>
    </section>

    {/* STATS */}
    <section className="section">
      <div className="stats-grid">
        <StatCard title="Most Titles" value="Mumbai Indians (5)" />
        <StatCard title="Latest Winner" value="KKR (2024)" />
        <StatCard title="First Winner" value="Rajasthan Royals" />
        <StatCard title="Total Seasons" value="17" />
      </div>
    </section>

    {/* TABLE */}
    <section className="section">
  <div className="table-card">

    <div className="table-scroll">
      <table className="ipl-table">
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

    {/* FAQ */}
    <section className="section faq">
      <h2>FAQ</h2>
      <p><strong>Who won the first IPL?</strong> Rajasthan Royals.</p>
      <p><strong>Which team has most IPL trophies?</strong> Mumbai Indians.</p>
      <p><strong>Who won IPL 2024?</strong> Kolkata Knight Riders.</p>
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
