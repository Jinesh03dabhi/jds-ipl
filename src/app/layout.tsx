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
  metadataBase: new URL("https://jds-ipl.vercel.app"),

  title: {
    default: "JD’s IPL – Live Scores, Auction History & Player Stats",
    template: "%s | JD’s IPL",
  },

  description:
    "JD’s IPL provides live IPL scores, detailed player sold prices, full auction history, team squads, match predictions, and advanced cricket performance analytics.",

  keywords: [
    "IPL live score",
    "IPL auction price",
    "IPL player sold price",
    "IPL team squad 2026",
    "IPL match predictions",
    "IPL statistics",
    "Cricket analytics platform"
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://jds-ipl.vercel.app",
    title: "JD’s IPL – Live Score & Auction Analytics",
    description:
      "Track IPL live scores, explore player auction prices, analyze team performance and access deep cricket insights.",
    siteName: "JD’s IPL",
  },

  twitter: {
    card: "summary_large_image",
    title: "JD’s IPL – Live IPL Data & Insights",
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
