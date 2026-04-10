const NULIS_API = process.env.NULIS_API_URL || "https://nulis.hanif.app";

export interface ChartSeries {
  key: string;
  name: string;
  color?: string;
}

export interface ChartData {
  type: "bar" | "line" | "area" | "pie";
  title?: string;
  description?: string;
  data: Record<string, string | number>[];
  series?: ChartSeries[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  contentHtml: string;
  chartData: string;
  status: string;
  mode: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${NULIS_API}/api/articles?mode=public`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${NULIS_API}/api/articles/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function toRoman(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}
