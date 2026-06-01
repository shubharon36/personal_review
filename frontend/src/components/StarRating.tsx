"use client";

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  size = 14,
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform duration-100`}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill={star <= rating ? "var(--color-star)" : "var(--color-star-empty)"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
