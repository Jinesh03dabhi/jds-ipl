import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | JD’s IPL",
  description:
    "Contact JD’s IPL for queries, feedback, business collaboration and support.",
  alternates: {
    canonical: "https://jds-ipl.vercel.app/contact",
  },
};

import { Instagram, Facebook, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container" style={{ marginTop: "80px", paddingBottom: "80px" }}>
      <div className="content-wrapper">
        <h1 className="page-headline text-gradient">Contact Us</h1>

        <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "40px" }}>
          For feedback, business inquiries, advertising queries or collaborations, reach us through
          the following platforms:
        </p>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "16px" }}>

          <a href="https://instagram.com/mr__j__d_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#E1306C", background: "rgba(225, 48, 108, 0.1)" }}>
              <Instagram size={32} color="#E1306C" />
              <div>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "4px" }}>Instagram</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>@mr__j__d_</p>
              </div>
            </div>
          </a>

          <a href="https://facebook.com/mr__j__d_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#1877F2", background: "rgba(24, 119, 242, 0.1)" }}>
              <Facebook size={32} color="#1877F2" />
              <div>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "4px" }}>Facebook</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>facebook.com/mr__j__d_</p>
              </div>
            </div>
          </a>

          <a href="https://wa.me/919427142807" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#25D366", background: "rgba(37, 211, 102, 0.1)" }}>
              <Phone size={32} color="#25D366" />
              <div>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "4px" }}>WhatsApp</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>+91 94271 42807</p>
              </div>
            </div>
          </a>

          <a href="mailto:jinesh03dabhi@gmail.com" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="highlight-box hover-scale" style={{ margin: 0, display: "flex", alignItems: "center", gap: "20px", borderLeftColor: "#EA4335", background: "rgba(234, 67, 53, 0.1)" }}>
              <Mail size={32} color="#EA4335" />
              <div>
                <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "4px" }}>Email</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>jinesh03dabhi@gmail.com</p>
              </div>
            </div>
          </a>

        </div>
      </div>
    </div>
  );
}
