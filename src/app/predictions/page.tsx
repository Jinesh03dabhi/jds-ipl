import type { Metadata } from "next";
import PredictionsClient from "./PredictionsClient";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL 2026 Predictions & Polls | IPL Scorebook",
  description:
    "Explore IPL 2026 predictions, auction price polls and community forecasts for upcoming marquee players and teams. Updated daily. Check now.",
  keywords: [
    "ipl 2026 predictions",
    "ipl polls",
    "ipl auction forecast",
    "ipl player price prediction",
    "ipl community polls",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/predictions`,
    languages: {
      en: `${baseUrl}/predictions`,
    },
  },
  openGraph: {
    title: "IPL 2026 Predictions & Polls | IPL Scorebook",
    description:
      "Explore IPL 2026 predictions, auction price polls and community forecasts for upcoming marquee players and teams. Updated daily. Check now.",
    url: `${baseUrl}/predictions`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL predictions and polls preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL 2026 Predictions & Polls | IPL Scorebook",
    description:
      "Explore IPL 2026 predictions, auction price polls and community forecasts for upcoming marquee players and teams. Updated daily. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function PredictionsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do IPL 2026 predictions work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Predictions blend historical auction data with community polling to forecast likely player prices and trends.",
        },
      },
      {
        "@type": "Question",
        name: "Are IPL auction predictions updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, polls and forecasts are refreshed frequently based on new IPL 2026 signals and market sentiment.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PredictionsClient />
    </>
  );
}
