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

---

## Database Schema

```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('movie', 'book')),
  title text not null,
  cover_url text,
  year integer,
  creator text,        -- director for movies, author for books
  genres text[],       -- array of genre strings
  rating integer check (rating between 1 and 5),
  review_text text,
  quick_take text,
  external_id text,    -- tmdb_id or open_library id
  extra_meta jsonb,    -- runtime, page_count, isbn, language etc.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## Setup & Running Locally

### Prerequisites
* Python 3.9+
* Node.js 18+
* Supabase Account & Database
* TMDB v3 API Key

### Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example` and paste your Supabase keys and TMDB API keys:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_service_role_key
   TMDB_API_KEY=your_tmdb_api_key
   ADMIN_PASSWORD=your_dashboard_password
   SECRET_KEY=any_long_random_secret_string
   FRONTEND_URL=http://localhost:3000
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
