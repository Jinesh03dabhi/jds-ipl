import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | JD’s IPL",
  description:
    "Read the Privacy Policy of JD’s IPL regarding data usage, cookies, third-party services and user privacy protection.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/privacy-policy",
  },
};

import { ShieldCheck, Database, Cookie, Lock, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">Privacy Policy</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          At JD’s IPL, we respect your privacy. This page explains how we collect,
          use, and protect your information.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>

          <div className="info-card hover-scale">
            <h3 className="section-title"><Database className="callout-icon" /> Information We Collect</h3>
            <p style={{ margin: 0 }}>
              We may collect basic analytics data such as browser type, pages visited,
              and device information to improve user experience.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title"><Cookie className="callout-icon" /> Cookies</h3>
            <p style={{ margin: 0 }}>
              Our website may use cookies to enhance browsing experience and analyze
              traffic performance. By using our website, you agree to the use of cookies.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title"><Lock className="callout-icon" /> Third-Party Services</h3>
            <p style={{ margin: 0 }}>
              We may use third-party services such as analytics tools or advertising
              partners which may collect limited information according to their own privacy policies.
            </p>
          </div>

          <div className="highlight-box hover-scale" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Mail size={32} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Contact Us</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                If you have any questions regarding this Privacy Policy, please contact us
                through our Contact page.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
