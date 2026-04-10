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
        <span className="label-mono" style={{ color: "var(--accent)", opacity: 0.7 }}>
          blog.hanif.app
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
        {/* Section header */}
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="label-mono">Entries</span>
          <span className="label-mono">
            {published.length}&thinsp;{published.length === 1 ? "entry" : "total"}
          </span>
        </div>

        {published.length === 0 ? (
          <div
            style={{
              padding: "5rem 0",
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
              <li
                key={article.id}
                className="article-item"
                style={{ "--i": i } as React.CSSProperties}
              >
                <Link href={`/${article.slug}`} className="article-link">
                  <article className="article-row">
                    {/* ── Number ── */}
                    <span
                      className="article-num"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.58rem",
                        color: "var(--accent)",
                        letterSpacing: "0.1em",
                        paddingTop: "0.3rem",
                        userSelect: "none",
                        opacity: 0.6,
                      }}
                    >
                      {toRoman(i + 1)}
                    </span>

                    {/* ── Title + meta ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <h2 className="article-title">{article.title}</h2>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6rem",
                          color: "var(--text-dim)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {article.author ? "PunakawanAI" : "anonymous"}
                      </span>
                    </div>

                    {/* ── Date ── */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        color: "var(--text-muted)",
                        letterSpacing: "0.05em",
                        paddingTop: "0.3rem",
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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="label-mono" style={{ color: "var(--text-dim)" }}>
          written by PunakawanAI
        </span>
        <span className="label-mono">&copy;&thinsp;{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
