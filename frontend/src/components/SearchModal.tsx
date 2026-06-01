"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { searchMovies, searchBooks } from "@/lib/api";
import type { MovieSearchResult, BookSearchResult } from "@/lib/api";

interface SearchModalProps {
  type: "movie" | "book";
  onSelect: (result: MovieSearchResult | BookSearchResult) => void;
}

export default function SearchModal({ type, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(MovieSearchResult | BookSearchResult)[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        setSearched(false);
        return;
      }
      setLoading(true);
      setSearched(true);
      try {
        const data =
          type === "movie" ? await searchMovies(q) : await searchBooks(q);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [type]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  const getTitle = (r: MovieSearchResult | BookSearchResult) => r.title;
  const getSubtitle = (r: MovieSearchResult | BookSearchResult) => {
    if (type === "movie") {
      const m = r as MovieSearchResult;
      return [m.year, m.director].filter(Boolean).join(" · ");
    }
    const b = r as BookSearchResult;
    return [b.year, b.author].filter(Boolean).join(" · ");
  };
  const getCover = (r: MovieSearchResult | BookSearchResult) => {
    if (type === "movie") return (r as MovieSearchResult).poster_url;
    return (r as BookSearchResult).cover_url;
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-secondary)]"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search for a ${type}...`}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 placeholder:text-[var(--color-text-muted)]"
          id="search-input"
          autoFocus
        />
      </div>

      {/* Results */}
      <div className="max-h-[400px] overflow-y-auto space-y-1">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-[var(--color-text-muted)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <p className="text-center py-8 text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
            No results found
          </p>
        )}

        {!loading &&
          results.map((result, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(result)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors text-left"
              id={`search-result-${idx}`}
            >
              <div className="relative w-10 h-15 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                {getCover(result) ? (
                  <Image
                    src={getCover(result)!}
                    alt={getTitle(result)}
                    width={40}
                    height={60}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                    ?
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] truncate">
                  {getTitle(result)}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] truncate">
                  {getSubtitle(result)}
                </p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
