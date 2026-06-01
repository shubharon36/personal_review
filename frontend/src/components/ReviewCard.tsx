import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";
import type { Review } from "@/lib/api";

interface ReviewCardProps {
  review: Review;
  priority?: boolean;
}

export default function ReviewCard({ review, priority = false }: ReviewCardProps) {
  const isMovie = review.type === "movie";

  const badgeClasses = isMovie
    ? "bg-[var(--color-movie-bg)] text-[var(--color-movie-accent)] dark:bg-[var(--color-movie-bg-dark)] dark:text-[var(--color-movie-accent-dark)]"
    : "bg-[var(--color-book-bg)] text-[var(--color-book-accent)] dark:bg-[var(--color-book-bg-dark)] dark:text-[var(--color-book-accent-dark)]";

  const dateStr = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Link href={`/review/${review.id}`} id={`review-card-${review.id}`}>
      <article className="group rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] dark:hover:border-[var(--color-dark-border-hover)] hover:shadow-sm">
        {/* Cover Image */}
        <div className="relative aspect-[2/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
          {review.cover_url ? (
            <Image
              src={review.cover_url}
              alt={review.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-neutral-300 dark:text-neutral-600"
              >
                {isMovie ? (
                  <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5M2 2h20v20H2z" />
                ) : (
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" />
                )}
              </svg>
            </div>
          )}

          {/* Category badge */}
          <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase ${badgeClasses}`}>
            {review.type}
          </div>
        </div>

        {/* Info section */}
        <div className="p-3">
          <h3 className="text-[14px] font-medium leading-tight line-clamp-2 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
            {review.title}
          </h3>
          <p className="mt-1 text-[12px] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] truncate">
            {review.year}
            {review.creator && ` · ${review.creator}`}
          </p>
          <div className="mt-1.5">
            <StarRating rating={review.rating} size={12} />
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)]">
            {dateStr}
          </p>
        </div>
      </article>
    </Link>
  );
}
