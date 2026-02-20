import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 10 Most Expensive IPL Players in History (Updated List)",
  description:
    "Complete and updated list of the top 10 most expensive IPL players in history including sold price, year, team and role.",
};

export default function TopExpensivePlayers() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <h1>🌟 Top 10 Most Expensive IPL Players in History</h1>

      <p>
        The IPL auction continues to break financial records each season.
        Below is the verified list of the top 10 most expensive players in IPL
        history based on auction price.
      </p>

    <div className="table-wrapper">
      <table className="expensive-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Price</th>
            <th>Year</th>
            <th>Team</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{justifyContent:"center"}}>
            <td>1</td>
            <td>Rishabh Pant</td>
            <td>₹27.00 Cr</td>
            <td>2025</td>
            <td>LSG</td>
            <td>Wicketkeeper-Batsman</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Shreyas Iyer</td>
            <td>₹26.75 Cr</td>
            <td>2025</td>
            <td>PBKS</td>
            <td>Batter (Captain)</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Cameron Green</td>
            <td>₹25.20 Cr</td>
            <td>2026</td>
            <td>KKR</td>
            <td>All-Rounder</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Mitchell Starc</td>
            <td>₹24.75 Cr</td>
            <td>2024</td>
            <td>KKR</td>
            <td>Bowler (Fast)</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Venkatesh Iyer</td>
            <td>₹23.75 Cr</td>
            <td>2025</td>
            <td>KKR</td>
            <td>All-Rounder</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Pat Cummins</td>
            <td>₹20.50 Cr</td>
            <td>2024</td>
            <td>SRH</td>
            <td>Bowler (Fast)</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Sam Curran</td>
            <td>₹18.50 Cr</td>
            <td>2023</td>
            <td>PBKS</td>
            <td>All-Rounder</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Arshdeep Singh</td>
            <td>₹18.00 Cr</td>
            <td>2025</td>
            <td>PBKS</td>
            <td>Bowler (Fast)</td>
          </tr>
          <tr>
            <td>9</td>
            <td>Yuzvendra Chahal</td>
            <td>₹18.00 Cr</td>
            <td>2025</td>
            <td>PBKS</td>
            <td>Bowler (Spin)</td>
          </tr>
          <tr>
            <td>10</td>
            <td>Cameron Green</td>
            <td>₹17.50 Cr</td>
            <td>2023</td>
            <td>MI</td>
            <td>All-Rounder</td>
          </tr>
        </tbody>
      </table>
    </div>
      <h2 style={{ marginTop: "40px" }}>Auction Trends & Analysis</h2>

      <p>
        The IPL auction has seen a dramatic rise in player valuations over
        the last few seasons. The 2025 and 2026 auctions in particular
        recorded multiple deals above ₹20 crore.
      </p>

      <p>
        All-rounders and fast bowlers dominate the top price bracket because
        they provide multi-dimensional value. Franchise captains and Indian
        core players also attract premium bids due to leadership and brand
        value.
      </p>

      <h2 style={{ marginTop: "40px" }}>Why Prices Are Increasing</h2>

      <p>
        Several factors contribute to rising IPL auction prices:
      </p>

      <ul style={{ lineHeight: "1.8" , marginLeft:"10px" }}>
        <li>Increased media revenue and broadcasting deals</li>
        <li>Salary cap expansion</li>
        <li>Demand for match-winning all-rounders</li>
        <li>Scarcity of elite Indian talent</li>
        <li>Strategic team rebuilding cycles</li>
      </ul>

      <p>
        As the IPL continues to grow globally, it is likely that auction
        records will continue to be broken in future mega auctions.
      </p>
    </div>
  );
}