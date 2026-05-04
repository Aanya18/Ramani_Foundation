import asyncio
import mimetypes
import os
import sys
import uuid
from pathlib import Path

from sqlalchemy import select, text

# Add backend root to path when running as a script.
BACKEND_DIR = Path(__file__).resolve().parent.parent
os.chdir(BACKEND_DIR)
sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import AsyncSessionLocal
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
        "objective": "To provide comprehensive educational support to children in underprivileged areas.",
        "activities": [
            "Identifying and appointing local SPOCs in bastis and villages.",
            "Setting up independent educational units in targeted areas.",
            "Providing books, stationery and study materials.",
            "Organising weekly educational workshops and mentoring.",
            "Awareness campaigns for parents about education.",
            "Regular monitoring and evaluation through SPOCs.",
        ],
    },
    {
        "name": "Project UDAAN",
        "image_rel_path": "../../frontend/src/assets/udaan-celebration.jpg",
        "objective": "To collaborate with local NGOs, orphanages, old age homes and other institutions to expand the scope of impact.",
        "activities": [
            "Mapping and connecting with local NGOs and homes.",
            "Conducting need assessment surveys.",
            "Organising joint health check-ups, food distribution and cultural activities.",
            "Volunteer support for partner organisations.",
            "Creating a resource-sharing network.",
            "Documenting success stories and best practices.",
        ],
    },
    {
        "name": "Project SHAKTI",
        "image_rel_path": "../../frontend/src/assets/shakti-women.jpg",
        "objective": "To empower women by introducing new schemes and promoting self-reliance.",
        "activities": [
            "Skill development workshops - tailoring, handicrafts, digital literacy.",
            "Micro-finance and small business support schemes.",
            "Health awareness and wellness camps.",
            "Legal literacy on women's rights and self-defence.",
            "Identifying and supporting women leaders in communities.",
            "Collaborating with government schemes to amplify impact.",
        ],
    },
    {
        "name": "Project PRAYAAS",
        "image_rel_path": "../../frontend/src/assets/gallery/g4.jpg",
        "objective": "To foster holistic development in bastis and villages by addressing key infrastructural needs.",
        "activities": [
            "Mobile medical camps for basic healthcare.",
            "Improving vehicle accessibility through transportation initiatives.",
            "Ensuring water access via handpumps, tanks and pipelines.",
            "Community cleanliness and hygiene drives.",
            "Lighting solutions for energy-deprived areas.",
            "Partnering with local authorities for advocacy.",
        ],
    },
]


def build_description(objective: str, activities: list[str]) -> str:
    lines = [f"Objective: {objective}", "", "Activities:"]
    lines.extend([f"- {activity}" for activity in activities])
    return "\n".join(lines)


async def seed():
    image_service = ImageService()
    scripts_dir = Path(__file__).resolve().parent

    async with AsyncSessionLocal() as db:
        for item in PROJECTS:
            description = build_description(item["objective"], item["activities"])
            project_name = item["name"]

            result = await db.execute(select(Project).where(Project.name == project_name))
            project = result.scalars().first()

            if not project:
                project = Project(name=project_name, description=description, status="active")
                db.add(project)
                await db.flush()
                print(f"[create] project: {project_name}")
            else:
                project.description = description
                print(f"[update] project: {project_name}")

            gallery_title = f"{project_name} Cover"
            gallery_result = await db.execute(
                text(
                    """
                    SELECT id FROM gallery
                    WHERE project_id = :project_id AND title = :title
                    LIMIT 1
                    """
                ),
                {"project_id": str(project.id), "title": gallery_title},
            )
            gallery_row = gallery_result.first()
            gallery_item_id = uuid.UUID(str(gallery_row[0])) if gallery_row else None

            image_path = (scripts_dir / item["image_rel_path"]).resolve()
            if not image_path.exists():
                print(f"[warn] image not found for {project_name}: {image_path}")
                continue

            mime_type = mimetypes.guess_type(str(image_path))[0] or "image/jpeg"
            with image_path.open("rb") as f:
                upload = FileForUpload(
                    filename=image_path.name,
                    content_type=mime_type,
                    data=f.read(),
                )
                mega_file_id = await image_service.upload_image(upload)

            if not gallery_item_id:
                gallery_item_id = uuid.uuid4()
                await db.execute(
                    text(
                        """
                        INSERT INTO gallery
                        (id, title, mega_file_id, content_type, event_id, image_filename, project_id, description, "order")
                        VALUES
                        (:id, :title, :mega_file_id, :content_type, NULL, :image_filename, :project_id, :description, 0)
                        """
                    ),
                    {
                        "id": str(gallery_item_id),
                        "title": gallery_title,
                        "mega_file_id": mega_file_id,
                        "content_type": mime_type,
                        "image_filename": image_path.name,
                        "project_id": str(project.id),
                        "description": f"Cover image for {project_name}",
                    },
                )
                print(f"[create] gallery item: {gallery_title}")
            else:
                await db.execute(
                    text(
                        """
                        UPDATE gallery
                        SET mega_file_id = :mega_file_id,
                            content_type = :content_type,
                            image_filename = :image_filename,
                            description = :description,
                            project_id = :project_id
                        WHERE id = :id
                        """
                    ),
                    {
                        "id": str(gallery_item_id),
                        "mega_file_id": mega_file_id,
                        "content_type": mime_type,
                        "image_filename": image_path.name,
                        "description": f"Cover image for {project_name}",
                        "project_id": str(project.id),
                    },
                )
                print(f"[update] gallery item: {gallery_title}")

            image_check = await db.execute(
                select(GalleryImage).where(GalleryImage.gallery_item_id == gallery_item_id)
            )
            existing_image = image_check.scalars().first()
            if existing_image:
                existing_image.mega_file_id = mega_file_id
                existing_image.image_filename = image_path.name
                existing_image.content_type = mime_type
                print(f"[update] gallery_images for: {project_name}")
            else:
                db_image = GalleryImage(
                    gallery_item_id=gallery_item_id,
                    mega_file_id=mega_file_id,
                    image_filename=image_path.name,
                    content_type=mime_type,
                    order=0,
                )
                db.add(db_image)
                print(f"[create] gallery_images for: {project_name}")

            print(f"[ok] image linked for: {project_name}")

        await db.commit()
        print("Done.")


if __name__ == "__main__":
    asyncio.run(seed())
