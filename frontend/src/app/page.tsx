"use client";

import { useState, useEffect } from "react";
import FilterPills from "@/components/FilterPills";
import ReviewGrid from "@/components/ReviewGrid";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import { fetchReviews, fetchStats } from "@/lib/api";
import type { Review, Stats } from "@/lib/api";

export default function HomePage() {
  const [filter, setFilter] = useState<"all" | "movie" | "book">("all");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [reviewsData, statsData] = await Promise.all([
          fetchReviews({ sort: "date_desc" }),
          fetchStats(),
        ]);
        setReviews(reviewsData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.type === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Filter pills */}
      <div className="mb-6">
        <FilterPills active={filter} onChange={setFilter} />
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-neutral-100 dark:bg-neutral-800" />
              <div className="mt-3 space-y-2">
                <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-3/4" />
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ReviewGrid reviews={filteredReviews} />
      )}

      {/* Spotify embed */}
      <SpotifyEmbed />

      {/* Stats bar */}
      {stats && (
        <div className="mt-12 pt-6 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]" style={{ borderWidth: "0.5px" }}>
          <p className="text-center text-[12px] text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] tracking-wide">
            {stats.movies_count} movies · {stats.books_count} books · {stats.total} total
          </p>
        </div>
      )}
    </div>
  );
}
