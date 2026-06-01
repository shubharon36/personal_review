"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await login(password);
      setToken(token);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="p-8 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]">
          <h1 className="text-[20px] font-medium text-center text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] mb-6">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-transparent text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 placeholder:text-[var(--color-text-muted)]"
                id="password-input"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--color-text-primary)] dark:bg-[var(--color-dark-text)] text-white dark:text-[var(--color-dark-bg)] hover:opacity-90 transition-opacity disabled:opacity-40"
              id="login-submit"
            >
              {loading ? "Signing in..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
