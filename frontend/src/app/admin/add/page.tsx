"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchModal from "@/components/SearchModal";
import StarRating from "@/components/StarRating";
import { createReview, updateReview, fetchReview } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import type { MovieSearchResult, BookSearchResult, ReviewCreate } from "@/lib/api";

type Step = 1 | 2 | 3;

export default function AddReviewPageWrapper() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">Loading...</div>}>
      <AddReviewPage />
    </Suspense>
  );
}

function AddReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<"movie" | "book" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [creator, setCreator] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [quickTake, setQuickTake] = useState("");
  const [externalId, setExternalId] = useState("");
  const [extraMeta, setExtraMeta] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    // If editing, load the review
    if (editId) {
      fetchReview(editId)
        .then((review) => {
          setType(review.type);
          setTitle(review.title);
          setCoverUrl(review.cover_url || "");
          setYear(review.year || "");
          setCreator(review.creator || "");
          setGenres(review.genres);
          setRating(review.rating);
          setReviewText(review.review_text || "");
          setQuickTake(review.quick_take || "");
          setExternalId(review.external_id || "");
          setExtraMeta(review.extra_meta || {});
          setStep(3);
        })
        .catch(console.error);
    }
  }, [editId, router]);

  const handleSelectType = (t: "movie" | "book") => {
    setType(t);
    setStep(2);
  };

  const handleSelectResult = (result: MovieSearchResult | BookSearchResult) => {
    if (type === "movie") {
      const m = result as MovieSearchResult;
      setTitle(m.title);
      setCoverUrl(m.poster_url || "");
      setYear(m.year || "");
      setCreator(m.director || "");
      setGenres(m.genres);
      setExternalId(m.tmdb_id);
      setExtraMeta({
        runtime: m.runtime,
        language: m.language,
        tmdb_rating: m.tmdb_rating,
      });
    } else {
      const b = result as BookSearchResult;
      setTitle(b.title);
      setCoverUrl(b.cover_url || "");
      setYear(b.year || "");
      setCreator(b.author || "");
      setGenres(b.genres);
      setExternalId(b.ol_id);
      setExtraMeta({
        page_count: b.page_count,
        isbn: b.isbn,
        publisher: b.publisher,
      });
    }
    setStep(3);
  };

  const addGenre = () => {
    const trimmed = genreInput.trim();
    if (trimmed && !genres.includes(trimmed)) {
      setGenres([...genres, trimmed]);
    }
    setGenreInput("");
  };

  const removeGenre = (genre: string) => {
    setGenres(genres.filter((g) => g !== genre));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !title || rating === 0) return;

    setSubmitting(true);

    const data: ReviewCreate = {
      type,
      title,
      cover_url: coverUrl || null,
      year: typeof year === "number" ? year : null,
      creator: creator || null,
      genres,
      rating,
      review_text: reviewText || null,
      quick_take: quickTake || null,
      external_id: externalId || null,
      extra_meta: Object.keys(extraMeta).length > 0 ? extraMeta : null,
    };

    try {
      let review;
      if (editId) {
        review = await updateReview(editId, data);
      } else {
        review = await createReview(data);
      }
      router.push(`/review/${review.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save review");
      setSubmitting(false);
    }
  };

  if (!isAuthenticated()) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                step >= s
                  ? "bg-[var(--color-text-primary)] dark:bg-[var(--color-dark-text)] text-white dark:text-[var(--color-dark-bg)]"
                  : "bg-black/[0.06] dark:bg-white/[0.06] text-[var(--color-text-muted)]"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-[1px] ${
                  step > s
                    ? "bg-[var(--color-text-primary)] dark:bg-[var(--color-dark-text)]"
                    : "bg-black/[0.08] dark:bg-white/[0.08]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose type */}
      {step === 1 && (
        <div>
          <h2 className="text-[20px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] mb-6">
            What are you reviewing?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSelectType("movie")}
              className={`p-8 rounded-xl border-2 transition-all duration-150 text-center hover:scale-[1.01] ${
                type === "movie"
                  ? "border-[var(--color-movie-accent)] bg-[var(--color-movie-bg)] dark:bg-[var(--color-movie-bg-dark)] dark:border-[var(--color-movie-accent-dark)]"
                  : "border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-border-hover)] dark:hover:border-[var(--color-dark-border-hover)]"
              }`}
              id="select-movie"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`mx-auto mb-3 ${
                  type === "movie"
                    ? "text-[var(--color-movie-accent)] dark:text-[var(--color-movie-accent-dark)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5M2 2h20v20H2z" />
              </svg>
              <p className="text-[15px] font-medium">Movie</p>
            </button>

            <button
              onClick={() => handleSelectType("book")}
              className={`p-8 rounded-xl border-2 transition-all duration-150 text-center hover:scale-[1.01] ${
                type === "book"
                  ? "border-[var(--color-book-accent)] bg-[var(--color-book-bg)] dark:bg-[var(--color-book-bg-dark)] dark:border-[var(--color-book-accent-dark)]"
                  : "border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-border-hover)] dark:hover:border-[var(--color-dark-border-hover)]"
              }`}
              id="select-book"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`mx-auto mb-3 ${
                  type === "book"
                    ? "text-[var(--color-book-accent)] dark:text-[var(--color-book-accent-dark)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" />
              </svg>
              <p className="text-[15px] font-medium">Book</p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Search */}
      {step === 2 && type && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              Search for a {type}
            </h2>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors"
            >
              ← Back
            </button>
          </div>
          <SearchModal type={type} onSelect={handleSelectResult} />
          <button
            onClick={() => setStep(3)}
            className="mt-4 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors"
          >
            Skip search — enter manually
          </button>
        </div>
      )}

      {/* Step 3: Write review */}
      {step === 3 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
              {editId ? "Edit review" : "Write your review"}
            </h2>
            {!editId && (
              <button
                onClick={() => setStep(2)}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-dark-text)] transition-colors"
              >
                ← Back
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-1.5 font-medium">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-transparent text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                id="review-title"
              />
            </div>

            {/* Cover URL + preview */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-1.5 font-medium">
                Cover image URL
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-transparent text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                id="review-cover-url"
              />
              {coverUrl && (
                <div className="mt-2 w-20 aspect-[2/3] rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Year + Creator row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-1.5 font-medium">
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value ? parseInt(e.target.value) : "")
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-transparent text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  id="review-year"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-1.5 font-medium">
                  {type === "movie" ? "Director" : "Author"}
                </label>
                <input
                  type="text"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-transparent text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  id="review-creator"
                />
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-1.5 font-medium">
                Genres
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGenre();
                    }
                  }}
                  placeholder="Add a genre"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-transparent text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 placeholder:text-[var(--color-text-muted)]"
                  id="genre-input"
                />
                <button
                  type="button"
                  onClick={addGenre}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Star rating */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-2 font-medium">
                Rating
              </label>
              <StarRating rating={rating} size={28} interactive onChange={setRating} />
            </div>

            {/* Review text */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-1.5 font-medium">
                Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-transparent text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 resize-y"
                style={{ minHeight: "200px" }}
                id="review-text"
              />
            </div>

            {/* Quick take */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)] mb-1.5 font-medium">
                Quick take
              </label>
              <input
                type="text"
                value={quickTake}
                onChange={(e) => setQuickTake(e.target.value)}
                placeholder="One sentence summary"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-transparent text-sm text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 placeholder:text-[var(--color-text-muted)]"
                id="review-quick-take"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !title || rating === 0}
                className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--color-movie-accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                id="publish-review-btn"
              >
                {submitting
                  ? "Publishing..."
                  : editId
                  ? "Update review"
                  : "Publish review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
