from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class ReviewCreate(BaseModel):
    """Schema for creating a new review."""

    type: str = Field(..., pattern="^(movie|book)$")
    title: str = Field(..., min_length=1, max_length=500)
    cover_url: Optional[str] = None
    year: Optional[int] = None
    creator: Optional[str] = None  # director for movies, author for books
    genres: Optional[list[str]] = []
    rating: int = Field(..., ge=1, le=5)
    review_text: Optional[str] = None
    quick_take: Optional[str] = None
    external_id: Optional[str] = None  # tmdb_id or open_library id
    extra_meta: Optional[dict] = None  # runtime, page_count, isbn, language etc.


class ReviewUpdate(BaseModel):
    """Schema for updating an existing review."""

    type: Optional[str] = Field(None, pattern="^(movie|book)$")
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    cover_url: Optional[str] = None
    year: Optional[int] = None
    creator: Optional[str] = None
    genres: Optional[list[str]] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    review_text: Optional[str] = None
    quick_take: Optional[str] = None
    external_id: Optional[str] = None
    extra_meta: Optional[dict] = None


class ReviewResponse(BaseModel):
    """Schema for review API responses."""

    id: str
    type: str
    title: str
    cover_url: Optional[str] = None
    year: Optional[int] = None
    creator: Optional[str] = None
    genres: list[str] = []
    rating: int
    review_text: Optional[str] = None
    quick_take: Optional[str] = None
    external_id: Optional[str] = None
    extra_meta: Optional[dict] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class StatsResponse(BaseModel):
    """Schema for stats API response."""

    total: int
    movies_count: int
    books_count: int
    avg_rating: float
