-- Create the reviews table for personal review website
-- Run this in your Supabase SQL editor

create table if not exists reviews (
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

-- Index for common queries
create index if not exists idx_reviews_type on reviews(type);
create index if not exists idx_reviews_created_at on reviews(created_at desc);
create index if not exists idx_reviews_rating on reviews(rating desc);

-- Enable Row Level Security (optional, for public read access)
alter table reviews enable row level security;

-- Policy: allow public read access
create policy "Public can read reviews"
  on reviews for select
  using (true);

-- Policy: service role can do everything (used by backend with service key)
create policy "Service role has full access"
  on reviews for all
  using (true)
  with check (true);

-- Auto-update updated_at on row changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reviews_updated_at
  before update on reviews
  for each row
  execute function update_updated_at();
