import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best IPL Bowlers of All Time – Top Wicket Takers",
  description:
    "Discover the best IPL bowlers in history based on wickets, economy rate and match-winning performances.",
};

export default function BestIPLBowlers() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <h1>🌟 Best IPL Bowlers of All Time</h1>

      <p>
        Bowling plays a crucial role in the IPL’s high-scoring environment.
        Over the years, several bowlers have dominated the league with
        consistency, skill and match-winning performances.
      </p>

      <h2>🌟 Lasith Malinga</h2>
      <p>
        Malinga remains one of the most feared T20 bowlers. His toe-crushing
        yorkers and ability to deliver under pressure made him a legend in IPL history.
      </p>

      <h2>🌟 Dwayne Bravo</h2>
      <p>
        Bravo’s variations and slower balls earned him multiple Purple Caps,
        making him one of the highest wicket-takers in IPL history.
      </p>

      <h2>🌟 Bhuvneshwar Kumar</h2>
      <p>
        Known for swing bowling and control, Bhuvneshwar has consistently
        delivered economical spells in powerplays.
      </p>

      <h2>🌟 Sunil Narine</h2>
      <p>
        Narine’s mystery spin and tight economy rates have made him a
        match-winner across multiple seasons.
      </p>

      <h2>🌟 What Makes a Great IPL Bowler?</h2>
      <p>
        Adaptability, variations, death-over execution and mental strength
        are key traits. In a league dominated by big hitters, bowlers who
        control runs often determine match outcomes.
      </p>
    </div>
  );
}