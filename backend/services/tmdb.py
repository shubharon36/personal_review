import urllib.request
import urllib.parse
import json
import asyncio
from config import get_settings

def _sync_get(url: str, params: dict) -> dict:
    query_string = urllib.parse.urlencode(params)
    full_url = f"{url}?{query_string}"
    
    req = urllib.request.Request(
        full_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    with urllib.request.urlopen(req, timeout=10.0) as response:
        return json.loads(response.read().decode("utf-8"))

async def _async_get(url: str, params: dict) -> dict:
    return await asyncio.to_thread(_sync_get, url, params)

async def search_movies(query: str) -> list[dict]:
    """Search TMDB for movies and return normalized results."""
    settings = get_settings()
    api_key = settings.tmdb_api_key

    if not api_key:
        return []

    try:
        data = await _async_get(
            "https://api.themoviedb.org/3/search/movie",
            {"api_key": api_key, "query": query, "language": "en-US", "page": 1}
        )
    except Exception as e:
        import traceback
        print("=== TMDB ERROR ===")
        print(type(e), e)
        traceback.print_exc()
        print("==================")
        raise e

    results = []
    results_list = data.get("results")
    if isinstance(results_list, list):
        for movie in results_list[:10]:
            movie_id = movie.get("id")

            # Fetch additional details (director, runtime)
            director = None
            runtime = None
            genres = []

            if movie_id:
                try:
                    detail = await _async_get(
                        f"https://api.themoviedb.org/3/movie/{movie_id}",
                        {"api_key": api_key, "append_to_response": "credits"}
                    )
                    runtime = detail.get("runtime")
                    genres_list = detail.get("genres")
                    if isinstance(genres_list, list):
                        genres = [g.get("name", "") for g in genres_list if isinstance(g, dict)]

                    # Find director from credits
                    credits = detail.get("credits")
                    if isinstance(credits, dict):
                        crew_list = credits.get("crew")
                        if isinstance(crew_list, list):
                            for crew in crew_list:
                                if isinstance(crew, dict) and crew.get("job") == "Director":
                                    director = crew.get("name")
                                    break
                except Exception:
                    pass

            poster_path = movie.get("poster_path")
            poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

            release_date = movie.get("release_date", "")
            year = None
            if release_date and len(release_date) >= 4:
                try:
                    year = int(release_date[:4])
                except ValueError:
                    pass

            results.append(
                {
                    "tmdb_id": str(movie_id) if movie_id is not None else "",
                    "title": movie.get("title", "") or "",
                    "year": year,
                    "poster_url": poster_url,
                    "director": director,
                    "genres": genres,
                    "overview": movie.get("overview", "") or "",
                    "runtime": runtime,
                    "language": movie.get("original_language"),
                    "tmdb_rating": movie.get("vote_average"),
                }
            )

    return results
