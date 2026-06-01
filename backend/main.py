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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
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
