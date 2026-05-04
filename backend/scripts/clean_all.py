import asyncio
import os
import sys

# Add the parent directory (backend/) to sys.path so 'app' can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core import engine, Base

# Import all models here so SQLAlchemy knows about them before drop_all
from app.models.user import AdminUser
from app.models.event import Event
from app.models.gallery import GalleryItem
from app.models.lead import Lead
from app.models.donation import Donation

async def clean_db():
    # 1. Clean up Database Tables
    print("Dropping all database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Re-created empty database tables.")

if __name__ == "__main__":
    asyncio.run(clean_db())
