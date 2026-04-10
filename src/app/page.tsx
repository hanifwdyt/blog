import Link from "next/link";
import { getArticles, formatDate, toRoman } from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  const articles = await getArticles();
  const published = articles.filter((a) => a.status === "published");

  return (
    <main
      style={{
        minHeight: "100vh",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "clamp(3rem, 7vw, 5.5rem) clamp(1.5rem, 5vw, 3rem)",
      }}
    >
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "clamp(4rem, 10vw, 7rem)",
        }}
      >
        <span className="label-mono">Hanif Widiyanto</span>
        <span className="label-mono">
          {published.length}&thinsp;{published.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* ── Hero header ──────────────────────────────────────── */}
      <header style={{ marginBottom: "clamp(4rem, 10vw, 7rem)" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.8rem, 8vw, 5rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            color: "var(--text)",
            margin: "0 0 1.75rem",
            maxWidth: "16ch",
          }}
        >
          Field Notes
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.95rem, 2.2vw, 1.08rem)",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            maxWidth: "48ch",
          }}
        >
          Writing on technology, systems,
          <br />
          and the patterns that connect them.
        </p>
      </header>

      {/* ── Articles ─────────────────────────────────────────── */}
      <section>
        {published.length === 0 ? (
          <div
            style={{
              padding: "5rem 0",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <p className="label-mono" style={{ textAlign: "center" }}>
              — nothing published yet —
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {published.map((article, i) => (
              <li key={article.id}>
                <Link href={`/${article.slug}`} className="article-link">
                  <article className="article-row">
                    {/* ── Number ── */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
                        color: "var(--accent)",
                        letterSpacing: "0.08em",
                        paddingTop: "0.28rem",
                        userSelect: "none",
                        opacity: 0.75,
                      }}
                    >
                      {toRoman(i + 1)}
                    </span>

                    {/* ── Title + author ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                      <h2 className="article-title">{article.title}</h2>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.62rem",
                          color: "var(--text-dim)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {article.author ? "PunakawanAI" : "anonymous"}
                      </span>
                    </div>

                    {/* ── Date ── */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
                        color: "var(--text-muted)",
                        letterSpacing: "0.05em",
                        paddingTop: "0.28rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(article.createdAt)}
                    </span>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: "clamp(4rem, 10vw, 6rem)",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <span className="label-mono">&copy;&thinsp;{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
