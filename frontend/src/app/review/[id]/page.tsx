import { fetchReview } from "@/lib/api";
import ReviewDetailClient from "./ReviewDetailClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const review = await fetchReview(id);
    return {
      title: `${review.title} — So's Reviews`,
      description: review.quick_take || `${review.type === "movie" ? "Movie" : "Book"} review: ${review.title}`,
      openGraph: {
        title: `${review.title} — So's Reviews`,
        description: review.quick_take || `A ${review.type} review`,
        images: review.cover_url ? [{ url: review.cover_url }] : [],
      },
    };
  } catch {
    return {
      title: "Review — So's Reviews",
    };
  }
}

export default async function ReviewPage({ params }: PageProps) {
  const { id } = await params;
  return <ReviewDetailClient id={id} />;
}
