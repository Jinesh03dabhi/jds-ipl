import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"), // change after buying domain

  title: {
    default: "JD’s IPL Analytics Hub – Live Scores, Auction History & Player Stats",
    template: "%s | JD’s IPL Analytics Hub",
  },

  description:
    "JD’s IPL Analytics Hub provides live IPL scores, detailed player sold prices, full auction history, team squads, match predictions, and advanced performance analytics for serious cricket fans.",

  keywords: [
    "IPL live score",
    "IPL auction history",
    "IPL player sold price",
    "IPL team squad",
    "IPL statistics",
    "IPL predictions",
    "Cricket analytics platform"
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://yourdomain.com",
    title: "JD’s IPL Analytics Hub – Live Scores & Auction Stats",
    description:
      "Track IPL live scores, explore player auction prices, analyze team performance and get data-driven match insights.",
    siteName: "JD’s IPL Analytics Hub",
  },

  twitter: {
    card: "summary_large_image",
    title: "JD’s IPL Analytics Hub – Live IPL Data & Insights",
    description:
      "Live IPL score updates, auction prices, player stats and advanced cricket analytics.",
  },

  alternates: {
    canonical: "/",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Mobile responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        className={`${inter.variable} ${outfit.variable}`}
        style={{
          background: "#020617",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <main
          style={{
            paddingTop: "calc(var(--nav-height) + 24px)",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
