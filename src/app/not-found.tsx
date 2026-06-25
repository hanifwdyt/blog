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
        background: "var(--bg)",
        fontFamily: "var(--font-mono)",
        padding: "1.5rem",
      }}
    >
      <p
        style={{
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
          color: "var(--text-muted)",
          margin: "0 0 2rem 0",
          textTransform: "uppercase",
        }}
      >
        — halaman ngga ketemu —
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
        }}
      >
        ← balik ke beranda
      </Link>
    </main>
  );
}
