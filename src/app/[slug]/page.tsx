import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles, formatDateLong, estimateReadingTime } from "@/lib/api";
import ArticleChart from "@/components/ArticleChart";
import ContentRenderer from "@/components/ContentRenderer";

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
  const author = article.author || "Hanif T. Widiyanto";
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
  const article = await getArticle(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  const readingTime = article.contentHtml ? estimateReadingTime(article.contentHtml) : null;

  return (
    <main className="page-main">
      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="article-nav">
        <Link href="/" className="link-back">← tulisan</Link>
        <span className="label-mono">Hanif T. Widiyanto</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="article-header">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span>{formatDateLong(article.createdAt)}</span>
          {readingTime && (
            <>
              <span className="article-meta-sep">·</span>
              <span>{readingTime} min baca</span>
            </>
          )}
        </div>
      </header>

      {/* ── Chart (optional) ───────────────────────────────── */}
      {article.chartData && article.chartData !== "" && (
        <ArticleChart raw={article.chartData} />
      )}

      {/* ── Body ───────────────────────────────────────────── */}
      {article.contentHtml ? (
        <ContentRenderer html={article.contentHtml} className="prose" />
      ) : (
        <p className="label-mono">— belum ada konten —</p>
      )}

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="article-footer">
        <Link href="/" className="link-back">← semua tulisan</Link>
        <span className="label-mono">&copy;&thinsp;{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
