"use client";

import { useState, useEffect } from "react";
import { fetchStats } from "@/lib/api";
import type { Stats } from "@/lib/api";

export default function AboutPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-[28px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
        About
      </h1>

      <div className="mt-6 text-[16px] leading-[1.7] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
        <p>
          Welcome to my personal corner of the internet where I log my thoughts on movies I&apos;ve watched
          and books I&apos;ve read. No ratings aggregators, no recommendation algorithms — just honest,
          unfiltered opinions from one person&apos;s perspective.
        </p>
        <p className="mt-4">
          I believe every movie and book deserves a thoughtful take, even the ones that don&apos;t land.
          This site is my way of keeping track of what I&apos;ve consumed and what I&apos;ve thought about it.
        </p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mt-10">
          <div className="p-5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] text-center">
            <p className="text-[28px] font-medium text-[var(--color-movie-accent)] dark:text-[var(--color-movie-accent-dark)]">
              {stats.movies_count}
            </p>
            <p className="text-[12px] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] mt-1">
              Movies reviewed
            </p>
          </div>
          <div className="p-5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] text-center">
            <p className="text-[28px] font-medium text-[var(--color-book-accent)] dark:text-[var(--color-book-accent-dark)]">
              {stats.books_count}
            </p>
            <p className="text-[12px] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] mt-1">
              Books reviewed
            </p>
          </div>
          <div className="p-5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] text-center">
            <p className="text-[28px] font-medium text-[var(--color-star)]">
              {stats.avg_rating.toFixed(1)}
            </p>
            <p className="text-[12px] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] mt-1">
              Average rating
            </p>
          </div>
        </div>
      )}

      {/* Spotify link */}
      <div className="mt-10 pt-6 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]" style={{ borderWidth: "0.5px" }}>
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors"
          id="spotify-profile-link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Find me on Spotify
        </a>
      </div>
    </div>
  );
}
