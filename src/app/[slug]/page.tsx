import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles, formatDateLong } from "@/lib/api";

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
    description: `${article.author ? `by ${article.author} · ` : ""}${formatDateLong(article.createdAt)}`,
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

  return (
    <main
      style={{
        minHeight: "100vh",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 3rem)",
      }}
    >
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav style={{ marginBottom: "clamp(3rem, 8vw, 5rem)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <Link href="/" className="link-back">
            ← back
          </Link>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
            }}
          >
            blog.hanif.app
          </span>
        </div>
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </nav>

      {/* ── Article header ──────────────────────────────────── */}
      <header style={{ marginBottom: "3.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            margin: "0 0 2rem 0",
            maxWidth: "20ch",
          }}
        >
          {article.title}
        </h1>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {article.author && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--accent)",
                letterSpacing: "0.06em",
              }}
            >
              {article.author}
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {formatDateLong(article.createdAt)}
          </span>
        </div>
      </header>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          marginBottom: "3rem",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "-0.55rem",
            left: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--accent)",
            letterSpacing: "0.15em",
            background: "var(--bg)",
            paddingRight: "0.75rem",
          }}
        >
          ◆
        </span>
      </div>

      {/* ── Article body ────────────────────────────────────── */}
      {article.contentHtml ? (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          style={{ fontFamily: "var(--font-body), Georgia, serif" }}
        />
      ) : (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          — no content —
        </p>
      )}

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: "clamp(4rem, 10vw, 6rem)",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <Link
          href="/"
          className="link-muted"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em" }}
        >
          ← all entries
        </Link>
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
