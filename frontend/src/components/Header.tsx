"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check system preference or saved preference
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)]/80 dark:bg-[var(--color-dark-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)]" style={{ borderWidth: "0.5px" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: Site name */}
        <Link href="/" className="group" id="site-logo">
          <h1 className="text-[22px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
            Shubharon&apos;s Reviews
          </h1>
          <p className="text-[11px] text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] -mt-0.5">
            personal opinions, no algorithms
          </p>
        </Link>

        {/* Right: Nav */}
        <nav className="flex items-center gap-5">
          <Link
            href="/movies"
            className="text-[13px] font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors"
            id="nav-movies"
          >
            Movies
          </Link>
          <Link
            href="/books"
            className="text-[13px] font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors"
            id="nav-books"
          >
            Books
          </Link>
          <Link
            href="/about"
            className="text-[13px] font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors"
            id="nav-about"
          >
            About
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
            aria-label="Toggle dark mode"
            id="dark-mode-toggle"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-dark-text)]">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-secondary)]">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
