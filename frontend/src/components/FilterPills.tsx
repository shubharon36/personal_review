"use client";

interface FilterPillsProps {
  active: "all" | "movie" | "book";
  onChange: (filter: "all" | "movie" | "book") => void;
}

const pills = [
  { key: "all" as const, label: "All" },
  { key: "movie" as const, label: "Movies" },
  { key: "book" as const, label: "Books" },
];

export default function FilterPills({ active, onChange }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-2">
      {pills.map(({ key, label }) => {
        const isActive = active === key;
        let activeClasses = "";

        if (isActive) {
          if (key === "movie") {
            activeClasses =
              "bg-[var(--color-movie-bg)] text-[var(--color-movie-accent)] dark:bg-[var(--color-movie-bg-dark)] dark:text-[var(--color-movie-accent-dark)]";
          } else if (key === "book") {
            activeClasses =
              "bg-[var(--color-book-bg)] text-[var(--color-book-accent)] dark:bg-[var(--color-book-bg-dark)] dark:text-[var(--color-book-accent-dark)]";
          } else {
            activeClasses =
              "bg-[var(--color-text-primary)] text-white dark:bg-[var(--color-dark-text)] dark:text-[var(--color-dark-bg)]";
          }
        }

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
              isActive
                ? activeClasses
                : "text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
