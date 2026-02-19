import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | JD’s IPL",
  description:
    "Read the Terms and Conditions for using JD’s IPL including content usage, intellectual property rights and platform responsibilities.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/terms-conditions",
  },
};

export default function TermsConditionsPage() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <h1 style={{ marginBottom: "20px" }}>Terms & Conditions</h1>

      <p>
        By accessing and using JD’s IPL, you agree to comply with the following
        Terms and Conditions. Please read them carefully.
      </p>

      <h3 style={{ marginTop: "30px" }}>Use of Content</h3>
      <p>
        All content including statistics, analytics, text, and design elements
        are provided for informational purposes only. Users may not copy,
        reproduce, or redistribute content without permission.
      </p>

      <h3 style={{ marginTop: "30px" }}>Intellectual Property</h3>
      <p>
        JD’s IPL is an independent analytics platform and is not affiliated
        with the official IPL governing body. All trademarks and team names
        belong to their respective owners.
      </p>

      <h3 style={{ marginTop: "30px" }}>Disclaimer</h3>
      <p>
        Match predictions and analytics are based on available data and should
        not be considered guaranteed outcomes. Users are responsible for their
        own decisions.
      </p>

      <h3 style={{ marginTop: "30px" }}>Third-Party Links</h3>
      <p>
        Our website may contain links to third-party platforms such as official
        streaming services. We are not responsible for external website content
        or policies.
      </p>

      <h3 style={{ marginTop: "30px" }}>Changes to Terms</h3>
      <p>
        We reserve the right to modify these Terms & Conditions at any time.
        Continued use of the website implies acceptance of the updated terms.
      </p>
    </div>
  );
}
