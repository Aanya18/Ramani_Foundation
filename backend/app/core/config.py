from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Ramani Foundation API"
    api_version: str = "0.1.0"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 30
    database_url: str = "sqlite:///./sahaay.db"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
