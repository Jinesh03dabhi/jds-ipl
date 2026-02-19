import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | JD’s IPL",
  description:
    "Contact JD’s IPL for queries, feedback, business collaboration and support.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <h1 style={{ marginBottom: "20px" }}>Contact Us</h1>

      <p>
        For feedback, business inquiries or collaborations, reach us through
        the following platforms:
      </p>

      <div style={{ marginTop: "30px", lineHeight: "2" }}>
        <p><strong>Instagram:</strong><a href="https://instagram.com/mr__j__d_"> https://instagram.com/mr__j__d_</a></p>
        <p><strong>Facebook:</strong><a href="https://facebook.com/mr__j__d_"> https://facebook.com/mr__j__d_</a></p>
        <p><strong>WhatsApp:</strong><a>+919427142807</a></p>
        <p><strong>Email:</strong><a href="jinesh03dabhi@gmail.com">jinesh03dabhi@gmail.com</a></p>
      </div>
    </div>
  );
}
