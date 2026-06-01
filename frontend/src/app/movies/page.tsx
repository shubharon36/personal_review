"use client";

import { useState, useEffect } from "react";
import ReviewGrid from "@/components/ReviewGrid";
import { fetchReviews } from "@/lib/api";
import type { Review } from "@/lib/api";

export default function MoviesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchReviews({ type: "movie", sort: "date_desc" });
        setReviews(data);
      } catch (err) {
        console.error("Failed to load movie reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
          Movies
        </h1>
        <p className="text-[13px] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] mt-0.5">
          All movie reviews
        </p>
      </div>

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
        <ReviewGrid reviews={reviews} />
      )}
    </div>
  );
}
