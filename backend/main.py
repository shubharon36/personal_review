from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routers import reviews, search
from auth import create_access_token, verify_password
from pydantic import BaseModel

app = FastAPI(
    title="Personal Reviews API",
    description="Backend API for personal movie & book reviews",
    version="1.0.0",
)

# CORS
settings = get_settings()
allowed_origins = [
    settings.frontend_url,
    "http://localhost:3000",
    "https://personal-review-black.vercel.app",
    "https://personal-review-mkcsml09s-shubharon36s-projects.vercel.app",
]
# Remove duplicates and empty strings
allowed_origins = list(set(o for o in allowed_origins if o))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(reviews.router)
app.include_router(search.router)


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str


@app.post("/api/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate with admin password and get a JWT token."""
    if not verify_password(request.password):
        from fastapi import HTTPException

        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token()
    return LoginResponse(token=token)


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}
