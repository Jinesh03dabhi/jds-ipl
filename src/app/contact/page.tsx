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
        <p><strong>Instagram:</strong> https://instagram.com/mr__j__d_</p>
        <p><strong>Facebook:</strong> https://facebook.com/mr__j__d_</p>
        <p><strong>WhatsApp:</strong> +919427142807</p>
        <p><strong>Email:</strong> jinesh03dabhi@gmail.com</p>
      </div>
    </div>
  );
}
