import ReviewCard from "./ReviewCard";
import type { Review } from "@/lib/api";

interface ReviewGridProps {
  reviews: Review[];
}

export default function ReviewGrid({ reviews }: ReviewGridProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-300 dark:text-neutral-600 mb-4"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <p className="text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] text-sm">
          No reviews yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} priority={index < 4} />
      ))}
    </div>
  );
}
