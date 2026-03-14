import type { Metadata } from "next";
import { FileText, Briefcase, AlertTriangle, Link as LinkIcon, Edit3 } from "lucide-react";
import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL Scorebook Terms & Conditions | IPL Scorebook",
  description:
    "Read IPL Scorebook terms and conditions for content usage, intellectual property rights, and user responsibilities. Check now.",
  keywords: [
    "ipl scorebook terms",
    "terms and conditions",
    "ipl analytics terms",
    "content usage policy",
    "intellectual property",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/terms-conditions`,
    languages: {
      en: `${baseUrl}/terms-conditions`,
    },
  },
  openGraph: {
    title: "IPL Scorebook Terms & Conditions | IPL Scorebook",
    description:
      "Read IPL Scorebook terms and conditions for content usage, intellectual property rights, and user responsibilities. Check now.",
    url: `${baseUrl}/terms-conditions`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL Scorebook terms and conditions preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Scorebook Terms & Conditions | IPL Scorebook",
    description:
      "Read IPL Scorebook terms and conditions for content usage, intellectual property rights, and user responsibilities. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function TermsConditionsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "IPL Scorebook Terms and Conditions",
    url: `${baseUrl}/terms-conditions`,
    description: "Terms and conditions for IPL Scorebook platform usage.",
  };

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">IPL Scorebook Terms & Conditions</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          IPL Scorebook terms and conditions describe content usage, intellectual property rights, and platform responsibilities for users. Check now.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>
          <div className="info-card hover-scale">
            <h2 className="section-title">
              <FileText className="callout-icon" /> Use of Content
            </h2>
            <p style={{ margin: 0 }}>
              All statistics, analytics and design elements are provided for informational purposes only. Users may not copy or redistribute content without permission.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title">
              <Briefcase className="callout-icon" /> Intellectual Property
            </h2>
            <p style={{ margin: 0 }}>
              IPL Scorebook is an independent analytics platform and is not affiliated with the official IPL governing body. All trademarks belong to their owners.
            </p>
          </div>

          <div className="callout-panel hover-scale">
            <AlertTriangle className="callout-icon" size={32} />
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Disclaimer</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Match predictions and analytics are based on available data and should not be considered guaranteed outcomes. Users are responsible for their decisions.
              </p>
            </div>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title">
              <LinkIcon className="callout-icon" /> Third-Party Links
            </h2>
            <p style={{ margin: 0 }}>
              IPL Scorebook may contain links to third-party platforms. We are not responsible for external website content or policies.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title">
              <Edit3 className="callout-icon" /> Changes to Terms
            </h2>
            <p style={{ margin: 0 }}>
              We reserve the right to modify these terms at any time. Continued use of the website implies acceptance of the updated terms.
            </p>
          </div>
        </div>

        <section style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "22px" }}>Related IPL Scorebook Pages</h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/privacy-policy" className="btn-primary">Privacy policy</Link>
            <Link href="/disclaimer" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              Disclaimer page
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
