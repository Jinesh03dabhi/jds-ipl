import type { Metadata } from "next";
import { ShieldCheck, Database, Cookie, Lock, Mail } from "lucide-react";
import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "IPL Scorebook Privacy Policy | IPL Scorebook",
  description:
    "Read the IPL Scorebook privacy policy covering data usage, cookies, analytics, and user protections across our IPL analytics platform. Check now.",
  keywords: [
    "ipl scorebook privacy policy",
    "ipl analytics privacy",
    "cookie policy",
    "data usage",
    "user privacy",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/privacy-policy`,
    languages: {
      en: `${baseUrl}/privacy-policy`,
    },
  },
  openGraph: {
    title: "IPL Scorebook Privacy Policy | IPL Scorebook",
    description:
      "Read the IPL Scorebook privacy policy covering data usage, cookies, analytics, and user protections across our IPL analytics platform. Check now.",
    url: `${baseUrl}/privacy-policy`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "IPL Scorebook privacy policy preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Scorebook Privacy Policy | IPL Scorebook",
    description:
      "Read the IPL Scorebook privacy policy covering data usage, cookies, analytics, and user protections across our IPL analytics platform. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function PrivacyPolicyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "IPL Scorebook Privacy Policy",
    url: `${baseUrl}/privacy-policy`,
    description:
      "Privacy policy describing data usage, cookies and user protections on IPL Scorebook.",
  };

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">IPL Scorebook Privacy Policy</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          The IPL Scorebook privacy policy explains how we collect, use and protect data for IPL analytics and live score experiences. Check now.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>
          <div className="info-card hover-scale">
            <h2 className="section-title">
              <Database className="callout-icon" /> Information We Collect
            </h2>
            <p style={{ margin: 0 }}>
              We may collect basic analytics data such as browser type, pages visited and device information to improve user experience.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title">
              <Cookie className="callout-icon" /> Cookies
            </h2>
            <p style={{ margin: 0 }}>
              IPL Scorebook may use cookies to enhance browsing experience and analyze traffic performance. By using our website, you agree to cookie usage.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h2 className="section-title">
              <Lock className="callout-icon" /> Third-Party Services
            </h2>
            <p style={{ margin: 0 }}>
              We may use third-party services such as analytics tools or advertising partners that collect limited information according to their privacy policies.
            </p>
          </div>

          <div className="highlight-box hover-scale" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Mail size={32} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Contact Us</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                If you have questions about this IPL Scorebook privacy policy, please contact us through our Contact page.
              </p>
            </div>
          </div>
        </div>

        <section style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "22px" }}>Related IPL Scorebook Pages</h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">Contact IPL Scorebook</Link>
            <Link href="/terms-conditions" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              Terms and conditions
            </Link>
            <Link href="/disclaimer" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              Disclaimer page
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
