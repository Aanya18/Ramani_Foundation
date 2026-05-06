import asyncio
import mimetypes
import os
import sys
import uuid
from pathlib import Path

from sqlalchemy import select, text

BACKEND_DIR = Path(__file__).resolve().parent.parent
os.chdir(BACKEND_DIR)
sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import AsyncSessionLocal
from app.models.event import Event
from app.models.gallery import GalleryImage
from app.models.project import Project
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


PROJECTS = [
    {
        "name": "Project PAHAL",
        "image_rel_path": "../../frontend/src/assets/gallery/g1.jpg",
    },
    {
        "name": "Project UDAAN",
        "image_rel_path": "../../frontend/src/assets/udaan-celebration.jpg",
    },
    {
        "name": "Project SHAKTI",
        "image_rel_path": "../../frontend/src/assets/shakti-women.jpg",
    },
    {
        "name": "Project PRAYAAS",
        "image_rel_path": "../../frontend/src/assets/gallery/g4.jpg",
    },
]

EVENT_IMAGES = {
    "Community Health Camp": "../../frontend/src/assets/gallery/g3.jpg",
    "Shakti Skill Workshop": "../../frontend/src/assets/shakti-women.jpg",
}


def _build_path(scripts_dir: Path, rel_path: str) -> Path:
    return (scripts_dir / rel_path).resolve()


async def _upload_file(image_service: ImageService, image_path: Path) -> str:
    mime_type = mimetypes.guess_type(str(image_path))[0] or "image/jpeg"
    with image_path.open("rb") as file_handle:
        upload = FileForUpload(
            filename=image_path.name,
            content_type=mime_type,
            data=file_handle.read(),
        )
        return await image_service.upload_image(upload)


async def seed():
    image_service = ImageService()
    scripts_dir = Path(__file__).resolve().parent

    async with AsyncSessionLocal() as db:
        for item in PROJECTS:
            image_path = _build_path(scripts_dir, item["image_rel_path"])
            if not image_path.exists():
                print(f"[warn] project image not found: {image_path}")
                continue

            result = await db.execute(select(Project).where(Project.name == item["name"]))
            project = result.scalars().first()
            if not project:
                print(f"[warn] project not found: {item['name']}")
                continue

            public_id = await _upload_file(image_service, image_path)
            title = f"{item['name']} Cover"

            gallery_result = await db.execute(
                text(
                    """
                    SELECT id FROM gallery
                    WHERE project_id = :project_id AND title = :title
                    LIMIT 1
                    """
                ),
                {"project_id": str(project.id), "title": title},
            )
            gallery_row = gallery_result.first()
            gallery_item_id = uuid.UUID(str(gallery_row[0])) if gallery_row else uuid.uuid4()

            if gallery_row:
                await db.execute(
                    text(
                        """
                        UPDATE gallery
                        SET mega_file_id = :public_id,
                            content_type = :content_type,
                            image_filename = :image_filename,
                            description = :description,
                            project_id = :project_id
                        WHERE id = :id
                        """
                    ),
                    {
                        "id": str(gallery_item_id),
                        "public_id": public_id,
                        "content_type": mime_type,
                        "image_filename": image_path.name,
                        "description": f"Cover image for {item['name']}",
                        "project_id": str(project.id),
                    },
                )
                print(f"[update] gallery: {title}")
            else:
                await db.execute(
                    text(
                        """
                        INSERT INTO gallery
                        (id, title, mega_file_id, content_type, event_id, image_filename, project_id, description, "order")
                        VALUES
                        (:id, :title, :public_id, :content_type, NULL, :image_filename, :project_id, :description, 0)
                        """
                    ),
                    {
                        "id": str(gallery_item_id),
                        "title": title,
                        "public_id": public_id,
                        "content_type": mime_type,
                        "image_filename": image_path.name,
                        "project_id": str(project.id),
                        "description": f"Cover image for {item['name']}",
                    },
                )
                print(f"[create] gallery: {title}")

            image_row = await db.execute(
                select(GalleryImage).where(GalleryImage.gallery_item_id == gallery_item_id)
            )
            existing_image = image_row.scalars().first()
            if existing_image:
                existing_image.mega_file_id = public_id
                existing_image.image_filename = image_path.name
                existing_image.content_type = mime_type
                print(f"[update] gallery image: {title}")
            else:
                db.add(
                    GalleryImage(
                        gallery_item_id=gallery_item_id,
                        mega_file_id=public_id,
                        image_filename=image_path.name,
                        content_type=mime_type,
                        order=0,
                    )
                )
                print(f"[create] gallery image: {title}")

        for event_title, image_rel_path in EVENT_IMAGES.items():
            image_path = _build_path(scripts_dir, image_rel_path)
            if not image_path.exists():
                print(f"[warn] event image not found: {image_path}")
                continue

            result = await db.execute(select(Event).where(Event.title == event_title))
            event = result.scalars().first()
            if not event:
                print(f"[warn] event not found: {event_title}")
                continue

            public_id = await _upload_file(image_service, image_path)
            await db.execute(
                text(
                    """
                    UPDATE events
                    SET mega_file_id = :public_id,
                        content_type = :content_type
                    WHERE id = :id
                    """
                ),
                {
                    "id": str(event.id),
                    "public_id": public_id,
                    "content_type": mime_type,
                },
            )
            print(f"[update] event: {event_title}")

        await db.commit()
        print("Done.")


if __name__ == "__main__":
    asyncio.run(seed())
