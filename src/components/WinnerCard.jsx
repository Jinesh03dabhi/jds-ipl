"use client";

export default function WinnerCard({ teamName }) {

  return (
    <div className="glass-card winner-card">

      <div className="winner-content">

        <div className="trophy">🏆</div>

        <div className="winner-text">
          {teamName || "Team"} won the match!
        </div>

      </div>

    </div>
  );
}