from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, settings
from app.repository.testimonial import TestimonialRepository
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialResponse
from app.services.image import ImageService
import uuid
from typing import List

class TestimonialService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.testimonial_repo = TestimonialRepository(db)
        self.image_service = ImageService()

    async def get_all_testimonials(self) -> List[TestimonialResponse]:
        testimonials = await self.testimonial_repo.get_all()
        return [
            TestimonialResponse(
                id=t.id,
                name=t.name,
                role=t.role,
                content=t.content,
                rating=t.rating,
                image_url=f"{settings.API_V1_STR}/public/images/{t.id}" if t.mega_file_id else None,
                created_at=t.created_at
            ) for t in testimonials
        ]

    async def create_testimonial(self, name: str, role: str | None, content: str, rating: int, image: UploadFile | None) -> TestimonialResponse:
        mega_file_id = None
        content_type = None
        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            mega_file_id = await self.image_service.upload_image(image)
            content_type = image.content_type

        db_testimonial = Testimonial(
            name=name,
            role=role,
            content=content,
            rating=rating,
            mega_file_id=mega_file_id,
            content_type=content_type
        )
        created_testimonial = await self.testimonial_repo.create(db_testimonial)

        return TestimonialResponse(
            id=created_testimonial.id,
            name=created_testimonial.name,
            role=created_testimonial.role,
            content=created_testimonial.content,
            rating=created_testimonial.rating,
            image_url=f"{settings.API_V1_STR}/public/images/{created_testimonial.id}" if created_testimonial.mega_file_id else None,
            created_at=created_testimonial.created_at
        )

    async def update_testimonial(self, testimonial_id: str, name: str, role: str | None, content: str, rating: int, image: UploadFile | None) -> TestimonialResponse:
        try:
            target_uuid = uuid.UUID(testimonial_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid testimonial ID format")

        db_t = await self.testimonial_repo.get_by_id(target_uuid)
        if not db_t:
            raise HTTPException(status_code=404, detail="Testimonial not found")

        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            new_mega_file_id = await self.image_service.upload_image(image)

            if db_t.mega_file_id:
                await self.image_service.delete_image(db_t.mega_file_id)

            db_t.mega_file_id = new_mega_file_id
            db_t.content_type = image.content_type

        db_t.name = name
        db_t.role = role
        db_t.content = content
        db_t.rating = rating

        updated_t = await self.testimonial_repo.update(db_t)

        return TestimonialResponse(
            id=updated_t.id,
            name=updated_t.name,
            role=updated_t.role,
            content=updated_t.content,
            rating=updated_t.rating,
            image_url=f"{settings.API_V1_STR}/public/images/{updated_t.id}" if updated_t.mega_file_id else None,
            created_at=updated_t.created_at
        )

    async def delete_testimonial(self, testimonial_id: str) -> None:
        try:
            target_uuid = uuid.UUID(testimonial_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid testimonial ID format")

        db_t = await self.testimonial_repo.get_by_id(target_uuid)
        if not db_t:
            raise HTTPException(status_code=404, detail="Testimonial not found")

        if db_t.mega_file_id:
            await self.image_service.delete_image(db_t.mega_file_id)

        await self.testimonial_repo.delete(db_t)
