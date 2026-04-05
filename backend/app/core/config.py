from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import validator

class Settings(BaseSettings):
    PROJECT_NAME: str
    API_V1_STR: str
    ROOT_MESSAGE: str

    # Security Settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_ALGORITHM: str
    HASHING_SCHEME: str

    # CORS Settings
    BACKEND_CORS_ORIGINS: Union[str, List[str]]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        return v

    # Database Settings
    DATABASE_URL: str

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

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
