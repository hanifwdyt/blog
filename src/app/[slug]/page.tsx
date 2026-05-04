import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles, formatDateLong, estimateReadingTime } from "@/lib/api";
import ArticleChart from "@/components/ArticleChart";
import ReadingProgress from "@/components/ReadingProgress";
import ContentRenderer from "@/components/ContentRenderer";
import ScrollToTop from "@/components/ScrollToTop";
import ShareButton from "@/components/ShareButton";

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles
    .filter((a) => a.status === "published")
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const author = article.author || "Hanif Widiyanto";
  return {
    title: article.title,
    description: `${author} · ${formatDateLong(article.createdAt)}`,
    openGraph: {
      title: article.title,
      description: `${author} · ${formatDateLong(article.createdAt)}`,
      type: "article",
      authors: [author],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [article, allArticles] = await Promise.all([
    getArticle(slug),
    getArticles(),
  ]);

  if (!article || article.status !== "published") {
    notFound();
  }

  const published = allArticles.filter((a) => a.status === "published");
  const currentIndex = published.findIndex((a) => a.slug === slug);
  const olderArticle = currentIndex < published.length - 1 ? published[currentIndex + 1] : null;
  const newerArticle = currentIndex > 0 ? published[currentIndex - 1] : null;

  const readingTime = article.contentHtml ? estimateReadingTime(article.contentHtml) : null;
  const author = article.author || "Hanif Widiyanto";

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />
      <main
        style={{
          minHeight: "100vh",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "clamp(3rem, 7vw, 5.5rem) clamp(1.5rem, 5vw, 3rem)",
        }}
      >
        {/* ── Top nav ────────────────────────────────────────── */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "clamp(4rem, 10vw, 7rem)",
          }}
        >
          <Link href="/" className="link-back">← semua tulisan</Link>
          <span className="label-mono">Hanif Widiyanto</span>
        </nav>

        {/* ── Article header ─────────────────────────────────── */}
        <header style={{ marginBottom: "3.5rem" }}>
          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem 1.25rem",
              marginBottom: "1.75rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                color: "var(--accent)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {author}
            </span>

            <span
              style={{
                width: "1.25rem",
                height: "1px",
                background: "var(--border-soft)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                color: "var(--text-muted)",
                letterSpacing: "0.06em",
              }}
            >
              {formatDateLong(article.createdAt)}
            </span>

            {readingTime && (
              <>
                <span
                  style={{
                    width: "1.25rem",
                    height: "1px",
                    background: "var(--border-soft)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span className="reading-time">{readingTime}&thinsp;min read</span>
              </>
            )}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 6vw, 3.4rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              color: "var(--text)",
              margin: 0,
              maxWidth: "22ch",
            }}
          >
            {article.title}
          </h1>
        </header>

        {/* ── Divider ────────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            marginBottom: "3.5rem",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-0.48rem",
              left: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              color: "var(--accent-dim)",
              letterSpacing: "0.2em",
              background: "var(--bg)",
              paddingRight: "0.75rem",
              userSelect: "none",
            }}
          >
            ◆
          </span>
        </div>

        {/* ── Chart (if present) ─────────────────────────────── */}
        {article.chartData && article.chartData !== "" && (
          <ArticleChart raw={article.chartData} />
        )}

        {/* ── Article body ───────────────────────────────────── */}
        {article.contentHtml ? (
          <ContentRenderer
            html={article.contentHtml}
            className="prose"
            style={{ fontFamily: "var(--font-body), Georgia, serif" }}
          />
        ) : (
          <p className="label-mono">— belum ada konten —</p>
        )}

        {/* ── Author bio ─────────────────────────────────────── */}
        <div className="author-bio">
          <div className="author-bio-avatar">HW</div>
          <div className="author-bio-text">
            <div className="author-bio-name">{author}</div>
            <p className="author-bio-desc">
              Software engineer di Jakarta. Nulis tentang kode, sistem, dan hal-hal
              yang masih terus gue pelajari. Kadang nge-run, kadang nge-build,
              selalu masih figuring it out.
            </p>
          </div>
        </div>

        {/* ── Prev / Next navigation ──────────────────────────── */}
        {(olderArticle || newerArticle) && (
          <div className="article-sibling-nav">
            {olderArticle ? (
              <Link href={`/${olderArticle.slug}`} className="article-sibling-link">
                <span className="article-sibling-dir">← tulisan sebelumnya</span>
                <span className="article-sibling-title">{olderArticle.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {newerArticle ? (
              <Link href={`/${newerArticle.slug}`} className="article-sibling-link is-next">
                <span className="article-sibling-dir">tulisan berikutnya →</span>
                <span className="article-sibling-title">{newerArticle.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer
          style={{
            marginTop: "clamp(3rem, 8vw, 5rem)",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <Link href="/" className="link-back">← semua tulisan</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ShareButton />
            <span className="label-mono" style={{ color: "var(--text-dim)" }}>
              &copy;&thinsp;{new Date().getFullYear()}
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
