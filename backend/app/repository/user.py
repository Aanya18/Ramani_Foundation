from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import AdminUser

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_username(self, username: str) -> AdminUser | None:
        result = await self.db.execute(select(AdminUser).where(AdminUser.username == username))
        return result.scalars().first()

