import type { Metadata } from "next";
import Standings from "@/app/teams/standings/StandingsPage"

export const metadata: Metadata = {
  title: "IPL 2026 Points Table – Team Standings & Net Run Rate",
  description:
    "Check the latest IPL 2026 points table including team standings, wins, losses, net run rate (NRR) and updated rankings.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/standings",
  },
};

export default function StandingsPage() {
  return(
    <Standings></Standings>
  );
}