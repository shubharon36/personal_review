from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from models.review import ReviewCreate, ReviewUpdate, ReviewResponse, StatsResponse
from services.supabase_client import get_supabase
from auth import require_admin

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.get("", response_model=list[ReviewResponse])
async def list_reviews(
    type: Optional[str] = Query(None, pattern="^(movie|book)$"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort: str = Query("date_desc", pattern="^(date_desc|date_asc|rating_desc|rating_asc)$"),
):
    """List all reviews with optional filtering and sorting."""
    db = get_supabase()
    query = db.table("reviews").select("*")

    if type:
        query = query.eq("type", type)

    # Apply sorting
    sort_map = {
        "date_desc": ("created_at", True),
        "date_asc": ("created_at", False),
        "rating_desc": ("rating", True),
        "rating_asc": ("rating", False),
    }
    col, is_desc = sort_map.get(sort, sort_map["date_desc"])
    query = query.order(col, desc=is_desc)

    query = query.range(offset, offset + limit - 1)

    result = query.execute()
    return result.data


@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get review statistics."""
    db = get_supabase()
    result = db.table("reviews").select("type, rating").execute()
    reviews = result.data

    total = len(reviews)
    movies_count = sum(1 for r in reviews if r.get("type") == "movie")
    books_count = sum(1 for r in reviews if r.get("type") == "book")
    avg_rating = round(sum(r.get("rating") or 0 for r in reviews) / total, 1) if total > 0 else 0.0

    return StatsResponse(
        total=total,
        movies_count=movies_count,
        books_count=books_count,
        avg_rating=avg_rating,
    )


@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: str):
    """Get a single review by ID."""
    db = get_supabase()
    result = db.table("reviews").select("*").eq("id", review_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found")

    return result.data[0]


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(review: ReviewCreate, _: bool = Depends(require_admin)):
    """Create a new review (admin only)."""
    db = get_supabase()
    data = review.model_dump(exclude_none=True)

    result = db.table("reviews").insert(data).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create review")

    return result.data[0]


@router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(review_id: str, review: ReviewUpdate, _: bool = Depends(require_admin)):
    """Update an existing review (admin only)."""
    db = get_supabase()
    data = review.model_dump(exclude_none=True)

    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = db.table("reviews").update(data).eq("id", review_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found")

    return result.data[0]


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(review_id: str, _: bool = Depends(require_admin)):
    """Delete a review (admin only)."""
    db = get_supabase()
    result = db.table("reviews").delete().eq("id", review_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Review not found")

    return None
