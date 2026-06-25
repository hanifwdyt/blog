import Link from "next/link";
import { getArticles, formatDate, extractExcerpt } from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  const articles = await getArticles();
  const published = articles.filter((a) => a.status === "published");

  return (
    <main className="page-main">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="site-header">
        <span className="site-name">Hanif Widiyanto</span>
        <p className="site-tagline">
          Catatan seorang software engineer di Jakarta — tentang kode,
          sistem, dan proses belajar yang nggak pernah selesai.
        </p>
        <hr className="site-rule" />
      </header>

      {/* ── Posts ──────────────────────────────────────────── */}
      {published.length === 0 ? (
        <div className="empty-state">
          <p className="label-mono">— belum ada tulisan —</p>
          <p>Lagi ditulis. Sabar dulu.</p>
        </div>
      ) : (
        <ul className="post-list">
          {published.map((article, i) => (
            <li
              key={article.id}
              className="post-item"
              style={{ "--i": i } as React.CSSProperties}
            >
              <Link href={`/${article.slug}`} className="post-link">
                <h2 className="post-title">{article.title}</h2>
                {article.contentHtml && (
                  <p className="post-excerpt">
                    {extractExcerpt(article.contentHtml, 120)}
                  </p>
                )}
                <span className="post-date">{formatDate(article.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
