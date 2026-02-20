import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How IPL Auction Strategy Works – Team Building Explained",
  description:
    "Understand how IPL teams build squads during auctions including player retention, budget allocation and bidding strategies.",
};

export default function AuctionStrategyPage() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <h1>⭐How IPL Auction Strategy Works</h1>

      <p>
        The IPL auction is not just about buying star players — it is a
        carefully calculated strategy process involving budget management,
        squad balance and long-term planning.
      </p>

      <h2>⭐Budget Allocation</h2>
      <p>
        Each franchise operates under a salary cap. Teams must distribute
        their budget across top-tier players, role players and backups.
      </p>

      <h2>⭐Role-Based Selection</h2>
      <p>
        Teams identify specific needs such as power hitters, death bowlers,
        spin specialists and wicketkeepers.
      </p>

      <h2>⭐Retention vs Fresh Bidding</h2>
      <p>
        Retaining core players ensures stability while fresh signings bring
        new tactical dimensions.
      </p>

      <h2>⭐Impact Player Strategy</h2>
      <p>
        With evolving IPL rules, franchises now prioritize versatile players
        who can contribute in multiple roles.
      </p>

      <p>
        Successful auction strategy often determines a team’s success long
        before the season begins.
      </p>
    </div>
  );
}