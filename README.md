# Personal Reviews (Movies & Books)

A personal review logging platform for tracking movies watched and books read. The application features a clean, responsive user interface, password-protected admin dashboard, and automated metadata pre-filling via integration with external APIs (TMDB and Open Library).

---

## Architecture Overview

The project is structured as a decoupled monorepo:
* **`backend/`**: A REST API built with FastAPI, Uvicorn, and Supabase (PostgreSQL) for persistence. Includes TMDB and Open Library search modules, and JWT token authentication.
* **`frontend/`**: A modern Next.js client built with TypeScript, React, and styled with vanilla PostCSS/CSS using a unified CSS custom property design system.

---

## Features

* **Dual-Category Reviews**: Unified platform for reviewing both movies (tracking directors, runtimes, TMDB ratings, languages) and books (tracking authors, publishers, ISBNs, page counts).
* **Metadata Auto-population**:
  * **Movies**: Integrated with TMDB API (The Movie Database) to fetch titles, posters, directors, runtimes, genres, and ratings.
  * **Books**: Integrated with Open Library API to fetch titles, covers, authors, publishers, and page counts.
* **Admin Dashboard**: Secure, session-based dashboard to add, edit, and delete review records.
* **Robust Error Handling**: Handles transient API timeouts, connection resets, and null responses gracefully.

---

## Tech Stack

### Backend
* **FastAPI**: Lightweight, asynchronous ASGI web framework.
* **Supabase Python Client**: Database interface communicating with a cloud PostgreSQL database.
* **Uvicorn**: High-performance ASGI web server.
* **Python-Jose**: JWT signing and verification.

### Frontend
* **Next.js (v16)**: React framework with App Router, SSR, and Turbopack.
* **TypeScript**: Static typing for components and API clients.
* **PostCSS**: Vanilla CSS layouts using custom-curated color schemes (dark mode support).


