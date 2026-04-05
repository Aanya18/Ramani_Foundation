import asyncio
from sqlalchemy.future import select
from app.core import AsyncSessionLocal, get_password_hash
from app.models import AdminUser

async def seed_admin():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(AdminUser).where(AdminUser.username == "admin"))
        if not result.scalars().first():
            admin = AdminUser(
                username="admin",
                hashed_password=get_password_hash("admin123")
            )
            session.add(admin)
            await session.commit()
            print("Admin user 'admin' created.")
        else:
            print("Admin user 'admin' already exists.")

if __name__ == "__main__":
    asyncio.run(seed_admin())
