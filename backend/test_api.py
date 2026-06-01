import httpx
import asyncio
import json

async def main():
    async with httpx.AsyncClient(verify=False) as client:
        try:
            print("--- TESTING MOVIE SEARCH ---")
            resp = await client.get("http://localhost:8000/api/search/movies?q=Inception")
            print("Movie Status Code:", resp.status_code)
            if resp.status_code == 200:
                data = resp.json()
                print("Movie Results count:", len(data))
                if data:
                    print("First movie title:", data[0].get("title"))
                    print("First movie year:", data[0].get("year"))
                    print("First movie genres:", data[0].get("genres"))
            else:
                print("Response text:", resp.text)
                
            print("\n--- TESTING BOOK SEARCH ---")
            resp_book = await client.get("http://localhost:8000/api/search/books?q=Hobbit")
            print("Book Status Code:", resp_book.status_code)
            if resp_book.status_code == 200:
                data_book = resp_book.json()
                print("Book Results count:", len(data_book))
                if data_book:
                    print("First book title:", data_book[0].get("title"))
                    print("First book author:", data_book[0].get("author"))
                    print("First book year:", data_book[0].get("year"))
            else:
                print("Response text:", resp_book.text)
                
        except Exception as e:
            print("Error occurred:", e)

if __name__ == "__main__":
    asyncio.run(main())

if __name__ == "__main__":
    asyncio.run(main())
