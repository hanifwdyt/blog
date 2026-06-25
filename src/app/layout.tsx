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
  title: { default: "Hanif T. Widiyanto", template: "%s — Hanif T. Widiyanto" },
  description: "Menulis membuat saya pulang ke diri saya sendiri.",
  authors: [{ name: "Hanif T. Widiyanto" }],
  creator: "Hanif T. Widiyanto",
  openGraph: {
    siteName: "Hanif T. Widiyanto",
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
