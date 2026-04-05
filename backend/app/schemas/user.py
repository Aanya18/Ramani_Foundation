from pydantic import BaseModel


class AdminUserCreate(BaseModel):
    username: str
    password: str
