import type { Metadata } from "next";
import { ShieldX, AlertCircle, LineChart, Link as LinkIcon, AlertOctagon } from "lucide-react";
import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL Scorebook Disclaimer | IPL Scorebook",
  description:
    "Read the IPL Scorebook disclaimer for analytics accuracy, predictions, third-party content and affiliation notice. Check now.",
  keywords: [
    "ipl scorebook disclaimer",
    "ipl analytics disclaimer",
    "prediction disclaimer",
    "ipl affiliation notice",
    "third-party content",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/disclaimer`,
    languages: {
      en: `${baseUrl}/disclaimer`,
    },
  },
  openGraph: {
    title: "IPL Scorebook Disclaimer | IPL Scorebook",
    description:
      "Read the IPL Scorebook disclaimer for analytics accuracy, predictions, third-party content and affiliation notice. Check now.",
    url: `${baseUrl}/disclaimer`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL Scorebook disclaimer preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Scorebook Disclaimer | IPL Scorebook",
    description:
      "Read the IPL Scorebook disclaimer for analytics accuracy, predictions, third-party content and affiliation notice. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function DisclaimerPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "IPL Scorebook Disclaimer",
    url: `${baseUrl}/disclaimer`,
    description:
      "Disclaimer covering analytics accuracy, predictions and affiliation notice for IPL Scorebook.",
  };

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">IPL Scorebook Disclaimer</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          The IPL Scorebook disclaimer explains analytics limitations, prediction risks and affiliate neutrality for IPL content. Check now.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>
          <div className="callout-panel hover-scale">
            <ShieldX className="callout-icon" size={32} color="#ef4444" />
            <div>
              <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>No Official Affiliation</h2>
              <p style={{ margin: 0, fontSize: "14px" }}>
                IPL Scorebook is not affiliated with the Indian Premier League, its franchises or governing bodies. All team names and trademarks belong to their owners.
              </p>
            </div>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title">
              <AlertCircle className="callout-icon" /> Accuracy of Information
            </h2>
            <p style={{ margin: 0 }}>
              While we strive for accuracy, we do not guarantee completeness or reliability of statistics, analytics or live updates on this website.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title">
              <LineChart className="callout-icon" /> Predictions and Analysis
            </h2>
            <p style={{ margin: 0 }}>
              Match predictions, win probabilities and performance analysis are based on available data and should not be considered guaranteed outcomes.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title">
              <LinkIcon className="callout-icon" /> External Links
            </h2>
            <p style={{ margin: 0 }}>
              IPL Scorebook may contain links to third-party websites. We are not responsible for the content or policies of external platforms.
            </p>
          </div>

          <div
            className="highlight-box hover-scale"
            style={{ display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#eab308", background: "rgba(234, 179, 8, 0.1)" }}
          >
            <AlertOctagon size={32} color="#eab308" />
            <div>
              <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Use at Your Own Risk</h2>
              <p style={{ margin: 0, fontSize: "14px" }}>
                By using IPL Scorebook, you acknowledge that any reliance on the information provided is strictly at your own risk.
              </p>
            </div>
          </div>
        </div>

        <section style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "22px" }}>Related IPL Scorebook Pages</h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/terms" className="btn-primary">Terms and conditions</Link>
            <Link href="/privacy-policy" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              Privacy policy
            </Link>
            <Link href="/contact" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              Contact IPL Scorebook
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
