const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Types ───────────────────────────────────────────────────────────

export interface Review {
  id: string;
  type: "movie" | "book";
  title: string;
  cover_url: string | null;
  year: number | null;
  creator: string | null;
  genres: string[];
  rating: number;
  review_text: string | null;
  quick_take: string | null;
  external_id: string | null;
  extra_meta: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ReviewCreate {
  type: "movie" | "book";
  title: string;
  cover_url?: string | null;
  year?: number | null;
  creator?: string | null;
  genres?: string[];
  rating: number;
  review_text?: string | null;
  quick_take?: string | null;
  external_id?: string | null;
  extra_meta?: Record<string, unknown> | null;
}

export interface ReviewUpdate extends Partial<ReviewCreate> {}

export interface Stats {
  total: number;
  movies_count: number;
  books_count: number;
  avg_rating: number;
}

export interface MovieSearchResult {
  tmdb_id: string;
  title: string;
  year: number | null;
  poster_url: string | null;
  director: string | null;
  genres: string[];
  overview: string;
  runtime: number | null;
  language: string | null;
  tmdb_rating: number | null;
}

export interface BookSearchResult {
  ol_id: string;
  title: string;
  year: number | null;
  author: string | null;
  cover_url: string | null;
  genres: string[];
  description: string | null;
  page_count: number | null;
  isbn: string | null;
  publisher: string | null;
}

// ─── Helper ──────────────────────────────────────────────────────────

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Reviews ─────────────────────────────────────────────────────────

export async function fetchReviews(params?: {
  type?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}): Promise<Review[]> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set("type", params.type);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  if (params?.sort) searchParams.set("sort", params.sort);

  const query = searchParams.toString();
  return apiFetch<Review[]>(`/api/reviews${query ? `?${query}` : ""}`);
}

export async function fetchReview(id: string): Promise<Review> {
  return apiFetch<Review>(`/api/reviews/${id}`);
}

export async function createReview(data: ReviewCreate): Promise<Review> {
  return apiFetch<Review>("/api/reviews", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateReview(
  id: string,
  data: ReviewUpdate
): Promise<Review> {
  return apiFetch<Review>(`/api/reviews/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteReview(id: string): Promise<void> {
  return apiFetch<void>(`/api/reviews/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

// ─── Stats ───────────────────────────────────────────────────────────

export async function fetchStats(): Promise<Stats> {
  return apiFetch<Stats>("/api/reviews/stats");
}

// ─── Search ──────────────────────────────────────────────────────────

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  return apiFetch<MovieSearchResult[]>(
    `/api/search/movies?q=${encodeURIComponent(query)}`
  );
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  return apiFetch<BookSearchResult[]>(
    `/api/search/books?q=${encodeURIComponent(query)}`
  );
}

// ─── Auth ────────────────────────────────────────────────────────────

export async function login(password: string): Promise<string> {
  const res = await apiFetch<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  return res.token;
}
