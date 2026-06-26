import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
