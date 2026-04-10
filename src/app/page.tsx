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
        maxWidth: "860px",
        margin: "0 auto",
        padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 3rem)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ marginBottom: "clamp(3rem, 8vw, 6rem)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            blog.hanif.app
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
            }}
          >
            {published.length} {published.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              margin: "0 0 1.2rem 0",
            }}
          >
            Hanif Widiyanto
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: "52ch",
              margin: 0,
            }}
          >
            Writing on technology, systems,
            <br />
            and the patterns that connect them.
          </p>
        </div>
      </header>

      {/* ── Articles ────────────────────────────────────────── */}
      <section>
        <div style={{ borderTop: "1px solid var(--border)" }} />

        {published.length === 0 ? (
          <div style={{ padding: "4rem 0", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
              }}
            >
              — nothing published yet —
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {published.map((article, i) => (
              <li key={article.id}>
                <Link href={`/${article.slug}`} className="article-link">
                  <article className="article-row">
                    {/* Roman numeral */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: "var(--accent)",
                        letterSpacing: "0.05em",
                        paddingTop: "0.35rem",
                        userSelect: "none",
                      }}
                    >
                      {toRoman(i + 1)}
                    </span>

                    {/* Title + author */}
                    <div>
                      <h2
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "clamp(1.15rem, 3vw, 1.45rem)",
                          fontWeight: 600,
                          lineHeight: 1.25,
                          letterSpacing: "-0.02em",
                          color: "var(--text)",
                          margin: "0 0 0.5rem 0",
                        }}
                      >
                        {article.title}
                      </h2>
                      {article.author && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.68rem",
                            color: "var(--text-muted)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {article.author}
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: "var(--text-muted)",
                        letterSpacing: "0.04em",
                        paddingTop: "0.35rem",
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

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: "clamp(3rem, 8vw, 5rem)",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          href="https://nulis.hanif.app"
          target="_blank"
          rel="noopener noreferrer"
          className="link-muted"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.06em" }}
        >
          ↗ nulis.hanif.app
        </a>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--border-soft)",
            letterSpacing: "0.06em",
          }}
        >
          {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}
