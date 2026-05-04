"""
Allow gallery rows without a cover mega_file_id (multi-image flow creates item first).

Run once: python scripts/migrate_gallery_mega_nullable.py
"""

import asyncio
import os
import sys

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.stdout.reconfigure(encoding="utf-8")

from app.core import settings  # noqa: E402


async def main() -> None:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        q = text(
            """
            SELECT is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'gallery'
              AND column_name = 'mega_file_id'
            """
        )
        row = (await conn.execute(q)).scalar_one_or_none()
        if row == "YES":
            print("gallery.mega_file_id already nullable — nothing to do")
        else:
            await conn.execute(
                text("ALTER TABLE gallery ALTER COLUMN mega_file_id DROP NOT NULL")
            )
            print("✅ gallery.mega_file_id is now nullable")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
