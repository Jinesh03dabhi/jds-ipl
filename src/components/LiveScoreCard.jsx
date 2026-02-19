import MatchHeader from "@/components/MatchHeader";
import MatchProgressBar from "@/components/MatchProgressBar";
import CommentaryPanel from "@/components/CommentaryPanel";
import BattingTable from "@/components/BattingTable";
import BowlingTable from "@/components/BowlingTable";

<div className="container" style={{ marginTop: 120 }}>

  <MatchHeader match={data.match} />

  <MatchProgressBar />

  <div className="grid" style={{ marginTop: 24 }}>
    <BattingTable batting={batting} />
    <BowlingTable bowling={bowling} />
  </div>

  <CommentaryPanel />

</div>
