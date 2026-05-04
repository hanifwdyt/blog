import Link from "next/link";
import { getArticles, formatDate, toRoman, extractExcerpt, estimateReadingTime } from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  const articles = await getArticles();
  const published = articles.filter((a) => a.status === "published");

  return (
    <main className="page-main">
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="page-topbar">
        <span className="label-mono">Hanif Widiyanto</span>
        <span className="label-mono" style={{ color: "var(--accent)", opacity: 0.6 }}>
          blog.hanif.app
        </span>
      </div>

      {/* ── Hero header ──────────────────────────────────────── */}
      <header className="hero-header">
        <span className="hero-tagline">Jakarta, Indonesia</span>
        <h1 className="hero-title">Catatan Perjalanan</h1>
        <p className="hero-description">
          Software engineer yang nulis tentang apa yang dia bangun,
          <br />
          rusak, dan pelajari di sepanjang jalan.
        </p>
        <p className="hero-sub">
          Tentang kode. Tentang sistem. Tentang proses jadi lebih baik.
        </p>
      </header>

      {/* ── Articles ─────────────────────────────────────────── */}
      <section>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="label-mono">Tulisan</span>
          <span className="count-badge">
            {published.length}&thinsp;{published.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {published.length === 0 ? (
          <div
            style={{
              padding: "5rem 0",
              borderBottom: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <p className="label-mono" style={{ marginBottom: "0.75rem" }}>
              — belum ada tulisan —
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                color: "var(--text-dim)",
                fontStyle: "italic",
              }}
            >
              Sedang ditulis. Sabar dulu.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {published.map((article, i) => {
              const readTime = article.contentHtml
                ? estimateReadingTime(article.contentHtml)
                : null;
              return (
                <li
                  key={article.id}
                  className="article-item"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <Link href={`/${article.slug}`} className="article-link">
                    <article className="article-row">
                      {/* ── Number ── */}
                      <span className="article-num">{toRoman(i + 1)}</span>

                      {/* ── Title + excerpt + meta ── */}
                      <div className="article-content-col">
                        <h2 className="article-title">{article.title}</h2>
                        {article.contentHtml && (
                          <p className="article-excerpt">
                            {extractExcerpt(article.contentHtml, 140)}
                          </p>
                        )}
                        <div className="article-meta-row">
                          <span className="article-author-label">
                            {article.author || "Hanif Widiyanto"}
                          </span>
                          {readTime && (
                            <span className="reading-time">{readTime}&thinsp;min</span>
                          )}
                        </div>
                      </div>

                      {/* ── Date ── */}
                      <span className="article-date-col">
                        {formatDate(article.createdAt)}
                      </span>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="page-footer">
        <span
          className="label-mono"
          style={{ color: "var(--text-dim)", fontStyle: "italic", textTransform: "none" }}
        >
          Hanif Widiyanto · Software Engineer · Jakarta
        </span>
        <span className="label-mono" style={{ color: "var(--text-dim)" }}>
          &copy;&thinsp;{new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}
