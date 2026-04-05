import asyncio
from app.core import AsyncSessionLocal, engine, Base, get_password_hash
from app.models import Donation, Event, GalleryItem, Lead, AdminUser
import os
import shutil

async def seed_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if admin exists
        from sqlalchemy.future import select
        result = await session.execute(select(AdminUser).where(AdminUser.username == "admin"))
        if not result.scalars().first():
            admin = AdminUser(
                username="admin",
                hashed_password=get_password_hash("admin123")
            )
            session.add(admin)

        # Seed events
        events = [
            Event(title="Community Cleanup", description="Join us for a neighborhood cleanup.", date="2024-05-10", location="City Park", image_url=None),
            Event(title="Food Drive", description="Collecting non-perishables for the local shelter.", date="2024-06-15", location="Community Center", image_url=None),
        ]
        session.add_all(events)

        # Seed gallery
        gallery = [
            GalleryItem(title="Last year's food drive", image_url="/uploads/placeholder1.jpg"),
            GalleryItem(title="School building project", image_url="/uploads/placeholder2.jpg"),
        ]
        session.add_all(gallery)

        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())
