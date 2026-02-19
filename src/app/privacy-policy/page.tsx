import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | JD’s IPL",
  description:
    "Read the Privacy Policy of JD’s IPL regarding data usage, cookies, third-party services and user privacy protection.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <h1 style={{ marginBottom: "20px" }}>Privacy Policy</h1>

      <p>
        At JD’s IPL, we respect your privacy. This page explains how we collect,
        use, and protect your information.
      </p>

      <h3 style={{ marginTop: "30px" }}>Information We Collect</h3>
      <p>
        We may collect basic analytics data such as browser type, pages visited,
        and device information to improve user experience.
      </p>

      <h3 style={{ marginTop: "30px" }}>Cookies</h3>
      <p>
        Our website may use cookies to enhance browsing experience and analyze
        traffic performance.
      </p>

      <h3 style={{ marginTop: "30px" }}>Third-Party Services</h3>
      <p>
        We may use third-party services such as analytics tools or advertising
        partners which may collect limited information according to their policies.
      </p>

      <h3 style={{ marginTop: "30px" }}>Contact</h3>
      <p>
        If you have any questions regarding this Privacy Policy, please contact us
        through our Contact page.
      </p>
    </div>
  );
}
