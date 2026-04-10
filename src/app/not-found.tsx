import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#080706",
        fontFamily: "var(--font-mono)",
      }}
    >
      <p
        style={{
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
          color: "var(--text-muted)",
          margin: "0 0 2rem 0",
        }}
      >
        — not found —
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
          color: "var(--accent)",
          textDecoration: "none",
          textTransform: "uppercase",
          transition: "opacity 0.15s ease",
        }}
      >
        ← back to index
      </Link>
    </main>
  );
}
