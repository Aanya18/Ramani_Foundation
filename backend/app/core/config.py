from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import validator, Field

class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str
    ROOT_MESSAGE: str

    # Security Settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_ALGORITHM: str
    HASHING_SCHEME: str
    ARGON2_TIME_COST: int
    ARGON2_MEMORY_COST: int
    ARGON2_PARALLELISM: int

    # CORS Settings
    BACKEND_CORS_ORIGINS: Union[str, List[str]]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v

    # Database Settings
    DATABASE_URL: str
    POSTGRES_POOL_SIZE: int = Field(default=10, gt=0)
    POSTGRES_MAX_OVERFLOW: int = Field(default=20, ge=0)
    POSTGRES_POOL_TIMEOUT: int = Field(default=30, gt=0)
    POSTGRES_POOL_RECYCLE: int = Field(default=1800, gt=0)
    POSTGRES_POOL_PRE_PING: bool = Field(default=True)

    # File Uploads
    UPLOADS_DIR: str
    MAX_FILE_SIZE_MB: int
    ALLOWED_IMAGE_TYPES: Union[str, List[str]]

    @validator("ALLOWED_IMAGE_TYPES", pre=True)
    def assemble_allowed_image_types(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v

    # Authentication URL
    AUTH_TOKEN_URL: str

    # Caching Settings
    CACHE_DIR: str
    DEFAULT_CACHE_EXPIRE_SECONDS: int

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
