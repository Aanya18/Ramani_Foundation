import asyncio
import mimetypes
import os
import sys
from pathlib import Path

from sqlalchemy import text

# Add backend root to path when running as a script.
BACKEND_DIR = Path(__file__).resolve().parent.parent
os.chdir(BACKEND_DIR)
sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import AsyncSessionLocal
from app.services.image import ImageService


class FileForUpload:
    def __init__(self, filename: str, content_type: str, data: bytes):
        self.filename = filename
        self.content_type = content_type
        self._data = data
        self._read = False

    async def read(self) -> bytes:
        if self._read:
            return b""
        self._read = True
        return self._data

    async def close(self) -> None:
        return None


EVENT_IMAGES = {
    "Community Health Camp": "../../frontend/src/assets/gallery/g3.jpg",
    "Shakti Skill Workshop": "../../frontend/src/assets/shakti-women.jpg",
}


async def seed():
    image_service = ImageService()
    scripts_dir = Path(__file__).resolve().parent

    async with AsyncSessionLocal() as db:
        for event_title, image_rel_path in EVENT_IMAGES.items():
            image_path = (scripts_dir / image_rel_path).resolve()
            if not image_path.exists():
                print(f"[warn] image not found for {event_title}: {image_path}")
                continue

            result = await db.execute(
                text("SELECT id FROM events WHERE title = :title LIMIT 1"),
                {"title": event_title},
            )
            event_row = result.first()
            if not event_row:
                print(f"[warn] event not found: {event_title}")
                continue

            mime_type = mimetypes.guess_type(str(image_path))[0] or "image/jpeg"
            with image_path.open("rb") as file_handle:
                upload = FileForUpload(
                    filename=image_path.name,
                    content_type=mime_type,
                    data=file_handle.read(),
                )
                mega_file_id = await image_service.upload_image(upload)

            await db.execute(
                text(
                    """
                    UPDATE events
                    SET mega_file_id = :mega_file_id,
                        content_type = :content_type
                    WHERE id = :id
                    """
                ),
                {
                    "id": event_row[0],
                    "mega_file_id": mega_file_id,
                    "content_type": mime_type,
                },
            )
            print(f"[ok] event image linked: {event_title}")

        await db.commit()
        print("Done.")


if __name__ == "__main__":
    asyncio.run(seed())
