from fastapi import APIRouter, Query, HTTPException
from services.tmdb import search_movies
from services.open_library import search_books

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("/movies")
async def search_movies_endpoint(q: str = Query(..., min_length=1)):
    """Search TMDB for movies."""
    try:
        results = await search_movies(q)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail="Movie search service is temporarily unavailable. Please try again later.",
        )


@router.get("/books")
async def search_books_endpoint(q: str = Query(..., min_length=1)):
    """Search Open Library for books."""
    try:
        results = await search_books(q)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail="Book search service is temporarily unavailable. Please try again later.",
        )
