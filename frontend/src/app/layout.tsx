import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Shubharon's Reviews — Movies & Books",
  description:
    "Personal reviews of movies and books. No algorithms, just honest opinions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased bg-[var(--color-background)] dark:bg-[var(--color-dark-bg)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] transition-colors duration-200">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
