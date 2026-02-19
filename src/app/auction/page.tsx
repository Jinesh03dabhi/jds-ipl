
import type { Metadata } from "next";
import AuctionClient from "./AuctionClient";
export const metadata: Metadata = {
  title: "IPL 2026 Auction – Sold Prices & Player Bids",
  description:
    "Explore IPL 2026 auction results including player sold prices, highest bids, and team spending details. Complete IPL auction history on JD’s IPL.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/auction",
  },
  openGraph: {
    title: "IPL 2026 Auction Results & Sold Prices",
    description:
      "Complete IPL auction details including top bids and player price breakdown.",
    url: "https://jds-ipl.vercel.app/auction",
    type: "website",
  },
};

export default function AuctionDashboard() {
  return(
    <AuctionClient></AuctionClient>
  );
}