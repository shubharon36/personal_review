"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminTable from "@/components/AdminTable";
import { fetchReviews, deleteReview } from "@/lib/api";
import { isAuthenticated, removeToken } from "@/lib/auth";
import type { Review } from "@/lib/api";

export default function AdminDashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    async function load() {
      try {
        const data = await fetchReviews({ sort: "date_desc", limit: 100 });
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  const handleEdit = (review: Review) => {
    // For now, navigate to add page with review ID as query param
    router.push(`/admin/add?edit=${review.id}`);
  };

  const handleLogout = () => {
    removeToken();
    router.push("/admin/login");
  };

  if (!isAuthenticated()) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[22px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
          Admin
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/add"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-movie-accent)] text-white hover:opacity-90 transition-opacity"
            id="add-review-btn"
          >
            Add new review
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
            id="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl"
            />
          ))}
        </div>
      ) : (
        <AdminTable
          reviews={reviews}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
