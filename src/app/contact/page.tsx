import type { Metadata } from "next";
import { Instagram, Facebook, Phone, Mail } from "lucide-react";
import Link from "next/link";

const baseUrl = "https://jds-ipl.vercel.app";

export const metadata: Metadata = {
  title: "Contact IPL Scorebook | IPL Scorebook",
  description:
    "Contact IPL Scorebook for feedback, business collaboration, advertising queries and support across our IPL analytics platform. Check now.",
  keywords: [
    "contact ipl scorebook",
    "ipl analytics support",
    "ipl scorebook contact",
    "ipl collaboration",
    "ipl business inquiries",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
    languages: {
      en: `${baseUrl}/contact`,
    },
  },
  openGraph: {
    title: "Contact IPL Scorebook | IPL Scorebook",
    description:
      "Contact IPL Scorebook for feedback, business collaboration, advertising queries and support across our IPL analytics platform. Check now.",
    url: `${baseUrl}/contact`,
    type: "website",
    siteName: "IPL Scorebook",
    locale: "en_IN",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Contact IPL Scorebook preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact IPL Scorebook | IPL Scorebook",
    description:
      "Contact IPL Scorebook for feedback, business collaboration, advertising queries and support across our IPL analytics platform. Check now.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function ContactPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact IPL Scorebook",
    url: `${baseUrl}/contact`,
    description: "Contact page for IPL Scorebook support and collaboration.",
  };

  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">Contact IPL Scorebook</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          IPL Scorebook contact details for feedback, business inquiries, advertising and partnerships across our IPL analytics platform. Check now.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "16px" }}>
          <a href="https://instagram.com/mr__j__d_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#E1306C", background: "rgba(225, 48, 108, 0.1)" }}>
              <Instagram size={32} color="#E1306C" />
              <div>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "4px" }}>Instagram</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>@mr__j__d_</p>
              </div>
            </div>
          </a>

          <a href="https://facebook.com/mr__j__d_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#1877F2", background: "rgba(24, 119, 242, 0.1)" }}>
              <Facebook size={32} color="#1877F2" />
              <div>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "4px" }}>Facebook</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>facebook.com/mr__j__d_</p>
              </div>
            </div>
          </a>

          <a href="https://wa.me/919427142807" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#25D366", background: "rgba(37, 211, 102, 0.1)" }}>
              <Phone size={32} color="#25D366" />
              <div>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "4px" }}>WhatsApp</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>+91 94271 42807</p>
              </div>
            </div>
          </a>

          <a href="mailto:jinesh03dabhi@gmail.com" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#EA4335", background: "rgba(234, 67, 53, 0.1)" }}>
              <Mail size={32} color="#EA4335" />
              <div>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "4px" }}>Email</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>jinesh03dabhi@gmail.com</p>
              </div>
            </div>
          </a>
        </div>

        <section style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "22px" }}>Related IPL Scorebook Pages</h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/about" className="btn-primary">About IPL Scorebook</Link>
            <Link href="/privacy-policy" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              Privacy policy
            </Link>
            <Link href="/terms-conditions" className="glass-card" style={{ padding: "10px 18px", textDecoration: "none" }}>
              Terms and conditions
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
