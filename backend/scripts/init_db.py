import asyncio
import os
import sys

# Add the parent directory (backend/) to sys.path so 'app' can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core import engine, Base
# Import all models here so SQLAlchemy knows about them before create_all
from app.models.user import AdminUser
from app.models.event import Event
from app.models.gallery import GalleryItem
from app.models.lead import Lead
from app.models.donation import Donation

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created.")

if __name__ == "__main__":
    asyncio.run(init_db())
