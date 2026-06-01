"use client";

import Image from "next/image";
import StarRating from "./StarRating";
import type { Review } from "@/lib/api";

interface AdminTableProps {
  reviews: Review[];
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

export default function AdminTable({ reviews, onEdit, onDelete }: AdminTableProps) {
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      onDelete(id);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
        <p className="text-sm">No reviews yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
      <table className="w-full text-sm" id="admin-reviews-table">
        <thead>
          <tr className="border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-black/[0.02] dark:bg-white/[0.02]">
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] text-xs uppercase tracking-wider">
              Cover
            </th>
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] text-xs uppercase tracking-wider">
              Title
            </th>
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] text-xs uppercase tracking-wider">
              Type
            </th>
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] text-xs uppercase tracking-wider">
              Rating
            </th>
            <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] text-xs uppercase tracking-wider">
              Date
            </th>
            <th className="text-right py-3 px-4 font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] text-xs uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] last:border-0"
            >
              <td className="py-3 px-4">
                <div className="relative w-8 h-12 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {review.cover_url ? (
                    <Image
                      src={review.cover_url}
                      alt={review.title}
                      width={32}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">
                      ?
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <p className="font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                  {review.title}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                  {review.creator}
                </p>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide ${
                    review.type === "movie"
                      ? "bg-[var(--color-movie-bg)] text-[var(--color-movie-accent)] dark:bg-[var(--color-movie-bg-dark)] dark:text-[var(--color-movie-accent-dark)]"
                      : "bg-[var(--color-book-bg)] text-[var(--color-book-accent)] dark:bg-[var(--color-book-bg-dark)] dark:text-[var(--color-book-accent-dark)]"
                  }`}
                >
                  {review.type}
                </span>
              </td>
              <td className="py-3 px-4">
                <StarRating rating={review.rating} size={12} />
              </td>
              <td className="py-3 px-4 text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                {review.created_at
                  ? new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(review)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                    id={`edit-${review.id}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id, review.title)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    id={`delete-${review.id}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
