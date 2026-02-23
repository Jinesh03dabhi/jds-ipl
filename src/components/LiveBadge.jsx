export default function LiveBadge() {
  return (
    <span style={{
      background: "#dc2626",
      color: "white",
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      animation: "blink 1.2s infinite"
    }}>
      ● LIVE
      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1 }
          50% { opacity: 0.4 }
          100% { opacity: 1 }
        }
      `}</style>
    </span>
  );
}