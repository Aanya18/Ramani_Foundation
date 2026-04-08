import asyncio
import sys
from pathlib import Path
from sqlalchemy.future import select

# Add parent directory to path so we can import app
sys.path.insert(0, str(Path(__file__).parent.parent))

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
