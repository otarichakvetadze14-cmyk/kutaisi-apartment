import type { Metadata } from "next";
import { Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import "./globals.css";
import "./landing.css";

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-georgian",
  display: "swap",
});

const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-georgian",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kutaisi Central Square",
  description: "High-end booking website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ka"
      className={`${notoSansGeorgian.variable} ${notoSerifGeorgian.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}