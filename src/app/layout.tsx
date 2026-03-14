import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";


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
  verification: {
    google: "vd3lLg6ke6o77ht1oLzaygwO8Ng9C1tYZIPLXgmxeUk",
  },
  title: "IPL 2026 Stats & Live Scores | IPL Scorebook",
  description:
    "IPL Scorebook delivers IPL 2026 live scores, auction analytics, player stats, team standings and match insights across every season. Check now.",
  icons: {
    icon: [
      { url: "/jds-ipl-logo-1.png", sizes: "32x32", type: "image/png" },
      { url: "/jds-ipl-logo-1.png", sizes: "16x16", type: "image/png" },
    ],
  },
  keywords: [
    "ipl 2026",
    "ipl live score",
    "ipl stats",
    "ipl auction data",
    "ipl points table",
    "ipl teams",
    "ipl player stats",
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
    title: "IPL 2026 Stats & Live Scores | IPL Scorebook",
    description:
      "Track IPL 2026 live scores, auction prices, team standings and player analytics in one place. Check now.",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: "https://jds-ipl.vercel.app/opengraph-image",
        width: 1200,
        height: 630,
        alt: "IPL Scorebook branded preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Stats & Live Scores | IPL Scorebook",
    description:
      "Track IPL 2026 live scores, auction prices, team standings and player analytics in one place. Check now.",
    images: ["https://jds-ipl.vercel.app/opengraph-image"],
  },
  alternates: {
    canonical: "https://jds-ipl.vercel.app",
    languages: {
      en: "https://jds-ipl.vercel.app",
    },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.cricapi.com" />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3689941361378688"
          crossOrigin="anonymous"
        ></script>

        {/* AMP Auto Ads */}
        <script
          async
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        ></script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PXSNXGLE6N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PXSNXGLE6N');
          `}
        </Script>
      </head>

      <body
        className={`${inter.variable} ${outfit.variable}`}
        style={{
          background: "#020617",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: '<amp-auto-ads type="adsense" data-ad-client="ca-pub-3689941361378688"></amp-auto-ads>' }} />

        <Navbar />

        <main
          style={{
            paddingTop: "calc(var(--nav-height))",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
        <Footer></Footer>
      </body>
    </html>
  );
}
