"use client";

import { getMatchState } from "@/utils/getMatchState";
import Link from 'next/link';

export default function LiveBowlingSection({ data }) {

  const matchState = getMatchState(data);

  if (matchState === "upcoming" || matchState === "waiting") return null;

  const inningsList = data?.scorecard?.scorecard || [];

  if (!inningsList.length) {
    return <div className="glass-card">Waiting for bowling to begin…</div>;
  }

  const validInnings = inningsList.filter(
    inn => inn?.bowling && inn.bowling.length
  );

  if (!validInnings.length) {
    return <div className="glass-card">Scorecard not available yet</div>;
  }

  const latestInnings = validInnings[validInnings.length - 1];
  const bowling = latestInnings?.bowling || [];

  const convertOversToBalls = (overs) => {
    if (!overs && overs !== 0) return 0;
    const [full, balls] = overs.toString().split(".");
    return Number(full) * 6 + Number(balls || 0);
  };

  const isActiveBowler = (overs) => {
    if (!overs) return false;
    const o = overs.toString();
    return o.includes(".") && !o.endsWith(".0");
  };

  const sortedBowling = [...bowling].sort((a, b) => {

    const wicketsDiff = (b?.w ?? 0) - (a?.w ?? 0);
    if (wicketsDiff !== 0) return wicketsDiff;

    const econA = convertOversToBalls(a?.o) > 0
      ? (a?.r ?? 0) / convertOversToBalls(a?.o)
      : Infinity;

    const econB = convertOversToBalls(b?.o) > 0
      ? (b?.r ?? 0) / convertOversToBalls(b?.o)
      : Infinity;

    return econA - econB;

  });

  return (
    <div className="glass-card table-card">

      <h3 style={{ marginBottom: 16 }}>
        {matchState === "live" ? "Live Bowling" : "Bowling Scorecard"}
      </h3>

      <div className="table-wrapper">

        <table className="responsive-table">

          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Bowler</th>
              <th>O</th>
              <th>M</th>
              <th>R</th>
              <th>W</th>
              <th>Econ</th>
            </tr>
          </thead>

          <tbody>
            {sortedBowling.map((player, index) => {

              const runs = Number(player?.r ?? 0);
              const overs = player?.o ?? 0;
              const ballsBowled = convertOversToBalls(overs);

              const economy =
                ballsBowled > 0
                  ? ((runs / ballsBowled) * 6).toFixed(2)
                  : 0;

              const active = isActiveBowler(overs);

              return (
                <tr
                  key={player?.bowler?.id || index}
                  className={active ? "current-bowler-row" : ""}
                >

                  <td style={{ textAlign: "left" }}>
                    {active && (
                      <span
                        style={{
                          color: "#22c55e",
                          marginRight: 6,
                          fontWeight: 700
                        }}
                      >
                        ●
                      </span>
                    )}
                    <Link href="/players" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {player?.bowler?.name || "Unknown"}
                    </Link>
                  </td>

                  <td>{overs}</td>
                  <td>{player?.m ?? 0}</td>
                  <td>{runs}</td>
                  <td>{player?.w ?? 0}</td>
                  <td>{economy}</td>

                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

    </div>
  );
}