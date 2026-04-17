import asyncio
import os
import sys

# Add the parent directory (backend/) to sys.path so 'app' can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core import engine, Base
from app.services.image import mega_manager

# Import all models here so SQLAlchemy knows about them before drop_all
from app.models.user import AdminUser
from app.models.event import Event
from app.models.gallery import GalleryItem
from app.models.lead import Lead
from app.models.donation import Donation

async def clean_db_and_mega():
    # 1. Clean up Database Tables
    print("Dropping all database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Re-created empty database tables.")

    # 2. Clean up MEGA Cloud Storage
    print("Connecting to MEGA cloud storage...")
    try:
        mega, root_id = await mega_manager.get_client()
        fs = await mega.get_filesystem()

        # Get all children of the root folder by checking parent_id
        children_ids = [node.id for node in fs.nodes.values() if node.parent_id == root_id]
        if children_ids:
            print(f"Found {len(children_ids)} files/folders to delete in MEGA.")
            for child_id in children_ids:
                print(f"Deleting MEGA node: {child_id}")
                await mega.destroy(child_id)
            print("Successfully deleted all files in MEGA root folder.")
        else:
            print("MEGA root folder is already empty.")

    except Exception as e:
        print(f"Error while cleaning MEGA cloud storage: {e}")

if __name__ == "__main__":
    asyncio.run(clean_db_and_mega())
