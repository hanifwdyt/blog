import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles, formatDateLong } from "@/lib/api";
import ArticleChart from "@/components/ArticleChart";
import ReadingProgress from "@/components/ReadingProgress";
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
  return {
    title: article.title,
    description: `by PunakawanAI · ${formatDateLong(article.createdAt)}`,
  };
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
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
    <>
      <ReadingProgress />
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
          <Link href="/" className="link-back">← all entries</Link>
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
              PunakawanAI
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
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "var(--text-dim)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {readingTime}&thinsp;min read
                </span>
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
          <p className="label-mono">— no content —</p>
        )}

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer
          style={{
            marginTop: "clamp(5rem, 12vw, 8rem)",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/" className="link-back">← all entries</Link>
          <span className="label-mono">&copy;&thinsp;{new Date().getFullYear()}</span>
        </footer>
      </main>
    </>
  );
}
