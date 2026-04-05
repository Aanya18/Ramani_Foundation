from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ramani Foundation API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here" # placeholder
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    DATABASE_URL: str = "sqlite+aiosqlite:///data/database.db"

    class Config:
        case_sensitive = True

settings = Settings()
