import type { Metadata } from "next";
import { Playfair_Display, Lora, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Hanif Widiyanto", template: "%s — Hanif Widiyanto" },
  description:
    "Catatan perjalanan seorang software engineer di Jakarta — tentang kode, sistem, dan proses belajar yang tidak pernah selesai.",
  authors: [{ name: "Hanif Widiyanto" }],
  creator: "Hanif Widiyanto",
  openGraph: {
    siteName: "Hanif Widiyanto",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${lora.variable} ${mono.variable}`}>
      <body style={{ fontFamily: "var(--font-body), Georgia, serif" }}>
        {children}
      </body>
    </html>
  );
}
