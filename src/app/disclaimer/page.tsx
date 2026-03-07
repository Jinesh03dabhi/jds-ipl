import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | IPL Scorebook",
  description:
    "Read the official disclaimer of IPL Scorebook regarding analytics, predictions, third-party content and affiliation notice.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/disclaimer",
  },
};

import { ShieldX, AlertCircle, LineChart, Link as LinkIcon, AlertOctagon } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">Disclaimer</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          IPL Scorebook is an independent cricket analytics platform created for
          informational and educational purposes only.
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>

          <div className="callout-panel hover-scale">
            <ShieldX className="callout-icon" size={32} color="#ef4444" />
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>No Official Affiliation</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                IPL Scorebook is not affiliated, associated, authorized, endorsed by,
                or in any way officially connected with the Indian Premier League (IPL),
                its franchises, or governing bodies. All team names, logos, and trademarks
                belong to their respective owners.
              </p>
            </div>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title"><AlertCircle className="callout-icon" /> Accuracy of Information</h3>
            <p style={{ margin: 0 }}>
              While we strive to provide accurate statistics, analytics, and live
              updates, we do not guarantee the completeness or reliability of
              any information presented on this website.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title"><LineChart className="callout-icon" /> Predictions & Analysis</h3>
            <p style={{ margin: 0 }}>
              Match predictions, win probabilities, and performance analysis are based
              on available data and statistical models. They should not be considered
              guaranteed outcomes or financial advice.
            </p>
          </div>

          <div className="info-card hover-scale">
            <h3 className="section-title"><LinkIcon className="callout-icon" /> External Links</h3>
            <p style={{ margin: 0 }}>
              Our website may contain links to third-party websites such as official
              streaming platforms. We are not responsible for the content or policies
              of those external websites.
            </p>
          </div>

          <div className="highlight-box hover-scale" style={{ display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#eab308", background: "rgba(234, 179, 8, 0.1)" }}>
            <AlertOctagon size={32} color="#eab308" />
            <div>
              <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Use at Your Own Risk</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                By using IPL Scorebook, you acknowledge that any reliance on the information
                provided is strictly at your own risk.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
