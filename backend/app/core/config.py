from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    app_name: str = "TraceID-AI"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = True

    host: str = "127.0.0.1"
    port: int = 8000
    frontend_url: str = "http://localhost:3000"

    database_url: str = "sqlite:///./traceid.db"
    secret_key: str = "development_secret_key_change_in_production"
    access_token_expire_minutes: int = 60

    storage_provider: str = "local"
    upload_dir: str = "./data/uploads"
    max_upload_size_mb: int = 10

    search_api_key: str = ""
    github_api_token: str = ""
    youtube_api_key: str = ""
    linkedin_api_key: str = ""
    linkedin_cookie_li_at: str = ""
    linkedin_username: str = ""
    linkedin_password: str = ""
    instagram_graph_token: str = ""
    twitter_bearer_token: str = ""

    digilocker_client_id: str = ""
    digilocker_client_secret: str = ""
    digilocker_redirect_uri: str = "http://localhost:3000/api/auth/digilocker/callback"

    ai_provider: str = ""
    ai_api_key: str = ""
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    vector_dimension: int = 384

    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_effective_database_url(self) -> str:
        if "YOUR_PASSWORD" in self.database_url or "localhost:5433" in self.database_url:
            return "sqlite:///./traceid.db"
        return self.database_url


settings = Settings()
