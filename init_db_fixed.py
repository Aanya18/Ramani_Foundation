import asyncio
import os
from dotenv import load_dotenv
import sys

# Load .env from backend directory
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core import engine, Base
# Import all models to ensure they are registered with Base.metadata
from app.models.user import AdminUser
from app.models.event import Event
from app.models.gallery import GalleryItem
from app.models.article import Article
from app.models.donation import Donation
from app.models.lead import Lead
from app.models.team_member import TeamMember
from app.models.testimonial import Testimonial

async def init_db():
    async with engine.begin() as conn:
        # Import all models before calling create_all
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized successfully.")

if __name__ == "__main__":
    asyncio.run(init_db())
