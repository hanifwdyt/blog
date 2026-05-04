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
      <main className="page-main">
        {/* ── Top nav ────────────────────────────────────────── */}
        <nav className="article-page-nav">
          <Link href="/" className="link-back">← semua tulisan</Link>
          <span className="label-mono">Hanif Widiyanto</span>
        </nav>

        {/* ── Article header ─────────────────────────────────── */}
        <header className="article-header">
          {/* Meta row */}
          <div className="article-header-meta">
            <span className="article-meta-author">{author}</span>
            <span className="article-meta-sep" />
            <span className="article-meta-date">{formatDateLong(article.createdAt)}</span>
            {readingTime && (
              <>
                <span className="article-meta-sep" />
                <span className="reading-time">{readingTime}&thinsp;min read</span>
              </>
            )}
          </div>
          <h1 className="article-page-title">{article.title}</h1>
        </header>

        {/* ── Divider ────────────────────────────────────────── */}
        <div className="article-divider">
          <span className="article-divider-diamond">◆</span>
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
        <footer className="article-footer">
          <Link href="/" className="link-back">← semua tulisan</Link>
          <div className="article-footer-actions">
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
