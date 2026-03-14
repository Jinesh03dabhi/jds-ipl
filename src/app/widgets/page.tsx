import type { Metadata } from "next";
import WidgetsClient from "./WidgetsClient";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL Widgets for Blogs & Fantasy Sites | IPL Scorebook",
  description:
    "Embed IPL widgets with player stats, auction highlights and team spending cards for blogs, fantasy apps and cricket communities. Check now.",
  keywords: [
    "ipl widgets",
    "ipl embed",
    "ipl player stats widget",
    "ipl auction widget",
    "ipl scorebook widgets",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/widgets`,
    languages: {
      en: `${baseUrl}/widgets`,
    },
  },
  openGraph: {
    title: "IPL Widgets for Blogs & Fantasy Sites | IPL Scorebook",
    description:
      "Embed IPL widgets with player stats, auction highlights and team spending cards for blogs, fantasy apps and cricket communities. Check now.",
    url: `${baseUrl}/widgets`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL widgets preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Widgets for Blogs & Fantasy Sites | IPL Scorebook",
    description:
      "Embed IPL widgets with player stats, auction highlights and team spending cards for blogs, fantasy apps and cricket communities. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function WidgetsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "IPL Widgets",
    url: `${baseUrl}/widgets`,
    description:
      "Embeddable IPL widgets for player stats, auction highlights and team spending cards.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <WidgetsClient />
    </>
  );
}
