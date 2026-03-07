import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | IPL Scorebook",
  description:
    "Read the Terms and Conditions for using IPL Scorebook including content usage, intellectual property rights and platform responsibilities.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/terms-conditions",
  },
};

import { FileText, Briefcase, AlertTriangle, Link as LinkIcon, Edit3 } from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">Terms & Conditions</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          By accessing and using IPL Scorebook, you agree to comply with the following
          Terms and Conditions. Please read them carefully.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>

          <div className="info-card hover-scale">
            <h3 className="section-title"><FileText className="callout-icon" /> Use of Content</h3>
            <p style={{ margin: 0 }}>
              All content including statistics, analytics, text, and design elements
              are provided for informational purposes only. Users may not copy,
              reproduce, or redistribute content without permission.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title"><Briefcase className="callout-icon" /> Intellectual Property</h3>
            <p style={{ margin: 0 }}>
              IPL Scorebook is an independent analytics platform and is not affiliated
              with the official IPL governing body. All trademarks and team names
              belong to their respective owners.
            </p>
          </div>

          <div className="callout-panel hover-scale">
            <AlertTriangle className="callout-icon" size={32} />
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Disclaimer</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Match predictions and analytics are based on available data and should
                not be considered guaranteed outcomes. Users are responsible for their
                own decisions.
              </p>
            </div>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title"><LinkIcon className="callout-icon" /> Third-Party Links</h3>
            <p style={{ margin: 0 }}>
              Our website may contain links to third-party platforms such as official
              streaming services. We are not responsible for external website content
              or policies.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title"><Edit3 className="callout-icon" /> Changes to Terms</h3>
            <p style={{ margin: 0 }}>
              We reserve the right to modify these Terms & Conditions at any time.
              Continued use of the website implies acceptance of the updated terms.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
