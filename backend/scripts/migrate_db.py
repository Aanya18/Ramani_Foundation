import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core import engine
from sqlalchemy import text

async def migrate():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE gallery ADD COLUMN event_id UUID REFERENCES events(id) ON DELETE SET NULL;"))
            print("Successfully added event_id column to gallery table.")
        except Exception as e:
            print(f"Error during migration: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
