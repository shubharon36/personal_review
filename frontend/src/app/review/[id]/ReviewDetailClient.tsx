"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import { fetchReview } from "@/lib/api";
import type { Review } from "@/lib/api";

interface Props {
  id: string;
}

export default function ReviewDetailClient({ id }: Props) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchReview(id);
        setReview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load review");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-20" />
          <div className="h-8 bg-neutral-100 dark:bg-neutral-800 rounded w-2/3" />
          <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
          <div className="flex gap-6">
            <div className="w-[200px] aspect-[2/3] bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded" />
              <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded" />
              <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-[var(--color-text-secondary)]">
          {error || "Review not found"}
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors">
          ← Back to reviews
        </Link>
      </div>
    );
  }

  const isMovie = review.type === "movie";
  const badgeClasses = isMovie
    ? "bg-[var(--color-movie-bg)] text-[var(--color-movie-accent)] dark:bg-[var(--color-movie-bg-dark)] dark:text-[var(--color-movie-accent-dark)]"
    : "bg-[var(--color-book-bg)] text-[var(--color-book-accent)] dark:bg-[var(--color-book-bg-dark)] dark:text-[var(--color-book-accent-dark)]";

  const dateStr = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const extraMeta = (review.extra_meta || {}) as Record<string, string | number | null>;

  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[13px] text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors mb-8"
        id="back-link"
      >
        ← Back
      </Link>

      {/* Category badge */}
      <div className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium uppercase tracking-wider mb-4 ${badgeClasses}`}>
        {review.type}
      </div>

      {/* Title */}
      <h1 className="text-[28px] font-medium leading-tight text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
        {review.title}
      </h1>

      {/* Subtitle row */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-[14px] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
          {[review.year, review.creator].filter(Boolean).join(" · ")}
        </span>
        {review.genres.map((genre) => (
          <span
            key={genre}
            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]"
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Star rating */}
      <div className="mt-4">
        <StarRating rating={review.rating} size={20} />
      </div>

      {/* Content area */}
      <div className="mt-8 flex flex-col md:flex-row gap-6">
        {/* Cover */}
        {review.cover_url && (
          <div className="w-full md:w-[30%] flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
              <Image
                src={review.cover_url}
                alt={review.title}
                fill
                sizes="(max-width: 768px) 100vw, 200px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Review text */}
        <div className={review.cover_url ? "flex-1" : "w-full"}>
          {review.review_text && (
            <div className="text-[16px] leading-[1.7] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] whitespace-pre-wrap">
              {review.review_text}
            </div>
          )}

          {review.quick_take && (
            <div className="mt-6 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-1.5 font-medium">
                Quick take
              </p>
              <p className="text-[15px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                {review.quick_take}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]" style={{ borderWidth: "0.5px" }} />

      {/* Metadata row */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)]">
        {dateStr && <span>Added on {dateStr}</span>}
        <span>Filed under {isMovie ? "Movies" : "Books"}</span>
      </div>

      {/* Extra metadata */}
      {isMovie && Object.keys(extraMeta).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-[12px] text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)]">
          {extraMeta.runtime && <span>{String(extraMeta.runtime)} min</span>}
          {extraMeta.language && <span>{String(extraMeta.language).toUpperCase()}</span>}
          {extraMeta.tmdb_rating && <span>TMDB {String(extraMeta.tmdb_rating)}/10</span>}
        </div>
      )}

      {!isMovie && Object.keys(extraMeta).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-[12px] text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)]">
          {extraMeta.page_count && <span>{String(extraMeta.page_count)} pages</span>}
          {extraMeta.publisher && <span>{String(extraMeta.publisher)}</span>}
          {extraMeta.isbn && <span>ISBN {String(extraMeta.isbn)}</span>}
        </div>
      )}
    </div>
  );
}
