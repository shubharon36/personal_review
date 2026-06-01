from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    supabase_url: str = ""
    supabase_key: str = ""
    tmdb_api_key: str = ""
    admin_password: str = "admin"
    secret_key: str = "change-me-in-production"
    frontend_url: str = "http://localhost:3000"

    # JWT settings
    access_token_expire_days: int = 7
    algorithm: str = "HS256"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
