import httpx


async def search_books(query: str) -> list[dict]:
    """Search Open Library for books and return normalized results."""
    async with httpx.AsyncClient(verify=False) as client:
        resp = await client.get(
            "https://openlibrary.org/search.json",
            params={"q": query, "limit": 10, "fields": "key,title,author_name,first_publish_year,cover_i,subject,number_of_pages_median,isbn,publisher"},
            timeout=10.0,
        )
        resp.raise_for_status()
        data = resp.json()

        results = []
        docs_list = data.get("docs")
        if isinstance(docs_list, list):
            for book in docs_list[:10]:
                cover_id = book.get("cover_i")
                cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg" if cover_id else None

                # Extract Open Library ID from key (e.g. "/works/OL12345W" -> "OL12345W")
                ol_key = book.get("key", "")
                ol_id = ol_key.split("/")[-1] if ol_key else None

                # Get subjects as genres (take first 5)
                subjects = book.get("subject")
                genres = subjects[:5] if isinstance(subjects, list) else []

                # Get first ISBN if available
                isbns = book.get("isbn")
                isbn = isbns[0] if isinstance(isbns, list) and isbns else None

                # Get first publisher
                publishers = book.get("publisher")
                publisher = publishers[0] if isinstance(publishers, list) and publishers else None

                # Get first author
                authors = book.get("author_name")
                author = authors[0] if isinstance(authors, list) and authors else None

                results.append(
                    {
                        "ol_id": ol_id,
                        "title": book.get("title", "") or "",
                        "year": book.get("first_publish_year"),
                        "author": author,
                        "cover_url": cover_url,
                        "genres": genres,
                        "description": None,  # Open Library search doesn't return descriptions
                        "page_count": book.get("number_of_pages_median"),
                        "isbn": isbn,
                        "publisher": publisher,
                    }
                )

        return results
