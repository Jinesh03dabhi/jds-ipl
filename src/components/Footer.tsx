"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Youtube, Mail, MapPin, Facebook, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "80px",
        padding: "60px 0 20px 0",
        background: "linear-gradient(180deg, #020617 0%, rgba(15, 23, 42, 0.9) 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        color: "#94a3b8",
        fontSize: "14px",
      }}
    >
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>

        {/* Section 1: Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Image src="/jds-ipl-logo-1.png" alt="IPL Scorebook Logo" width={40} height={40} />
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff" }}>
              <span style={{ color: "var(--primary)" }}>IPL</span> Scorebook
            </div>
          </div>
          <p style={{ lineHeight: "1.6" }}>
            The ultimate destination for live IPL scores, deep auction analytics, team standings, and comprehensive player statistics.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "8px" }}>Quick Links</h3>
          <Link href="/live-score" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Live Score</Link>
          <Link href="/teams/standings" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Points Table</Link>
          <Link href="/teams" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Teams</Link>
          <Link href="/players" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Players</Link>
          <Link href="/auction" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Auction Hub</Link>
        </div>

        {/* Section 3: Resources */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "8px" }}>Resources</h3>
          <Link href="/about" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>About Us</Link>
          <Link href="/contact" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Contact</Link>
          <Link href="/privacy-policy" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Privacy Policy</Link>
          <Link href="/terms-conditions" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Terms & Conditions</Link>
          <Link href="/disclaimer" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")}>Disclaimer</Link>
        </div>

        {/* Section 4: Social Links & Contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "8px" }}>Connect With Us</h3>
          <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
            <Link href="https://wa.me/919427142807" aria-label="Phone" style={{ color: "#fff", opacity: 0.7, transition: "opacity 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.opacity = "1")} onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}>
              <Phone size={24} />
            </Link>
            <Link href="https://instagram.com/mr__j__d_" aria-label="Instagram" style={{ color: "#fff", opacity: 0.7, transition: "opacity 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.opacity = "1")} onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}>
              <Instagram size={24} />
            </Link>
            <Link href="https://facebook.com/mr__j__d_" aria-label="Facebook" style={{ color: "#fff", opacity: 0.7, transition: "opacity 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.opacity = "1")} onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}>
              <Facebook size={24} />
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} /> <a style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseOut={(e) => (e.currentTarget.style.color = "inherit")} href="mailto:jinesh03dabhi@gmail.com">jinesh03dabhi@gmail.com</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} /> Navsari, Gujarat, India
          </div>
        </div>
      </div>

      {/* Section 5: Copyright */}
      <div className="container" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          © {new Date().getFullYear()} IPL Scorebook. All rights reserved.
        </div>
        <div style={{ fontSize: "12px", opacity: 0.6 }}>
          IPL Scorebook is an independent platform and is not affiliated with the BCCI, IPL, or any participating franchises.
        </div>
      </div>
    </footer>
  );
}
