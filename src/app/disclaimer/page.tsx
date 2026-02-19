import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | JD’s IPL",
  description:
    "Read the official disclaimer of JD’s IPL regarding analytics, predictions, third-party content and affiliation notice.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <h1 style={{ marginBottom: "20px" }}>Disclaimer</h1>

      <p>
        JD’s IPL is an independent cricket analytics platform created for
        informational and educational purposes only.
      </p>

      <h3 style={{ marginTop: "30px" }}>No Official Affiliation</h3>
      <p>
        JD’s IPL is not affiliated, associated, authorized, endorsed by,
        or in any way officially connected with the Indian Premier League (IPL),
        its franchises, or governing bodies. All team names, logos, and trademarks
        belong to their respective owners.
      </p>

      <h3 style={{ marginTop: "30px" }}>Accuracy of Information</h3>
      <p>
        While we strive to provide accurate statistics, analytics, and live
        updates, we do not guarantee the completeness or reliability of
        any information presented on this website.
      </p>

      <h3 style={{ marginTop: "30px" }}>Predictions & Analysis</h3>
      <p>
        Match predictions, win probabilities, and performance analysis are based
        on available data and statistical models. They should not be considered
        guaranteed outcomes or financial advice.
      </p>

      <h3 style={{ marginTop: "30px" }}>External Links</h3>
      <p>
        Our website may contain links to third-party websites such as official
        streaming platforms. We are not responsible for the content or policies
        of those external websites.
      </p>

      <h3 style={{ marginTop: "30px" }}>Use at Your Own Risk</h3>
      <p>
        By using JD’s IPL, you acknowledge that any reliance on the information
        provided is strictly at your own risk.
      </p>
    </div>
  );
}
