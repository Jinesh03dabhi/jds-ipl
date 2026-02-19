import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "60px",
        padding: "30px 0",
        borderTop: "1px solid #1e293b",
        textAlign: "center",
        fontSize: "14px",
        color: "#94a3b8",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        © {new Date().getFullYear()} JD’s IPL. All rights reserved.
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/terms-conditions">Terms & Conditions</Link>
        <Link href="/about">About Us</Link>
        <Link href="/disclaimer">Disclaimer</Link>

      </div>
    </footer>
  );
}
