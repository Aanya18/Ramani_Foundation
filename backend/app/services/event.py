from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, settings
from app.repository import EventRepository
from app.models import Event
from app.schemas import EventResponse
from app.services.image import ImageService
import uuid
from typing import List

class EventService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.event_repo = EventRepository(db)
        self.image_service = ImageService()

    async def get_all_events(self) -> List[EventResponse]:
        events = await self.event_repo.get_all()
        return [
            EventResponse(
                id=event.id,
                title=event.title,
                description=event.description,
                date=event.date,
                location=event.location,
                image_url=f"{settings.API_V1_STR}/public/images/{event.id}" if event.mega_file_id else None,
                created_at=event.created_at
            ) for event in events
        ]

    async def create_event(self, title: str, description: str, date: str, location: str, image: UploadFile | None) -> EventResponse:
        mega_file_id = None
        content_type = None
        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            # Upload to Mega
            mega_file_id = await self.image_service.upload_image(image)
            content_type = image.content_type

        db_event = Event(
            title=title,
            description=description,
            date=date,
            location=location,
            mega_file_id=mega_file_id,
            content_type=content_type
        )
        created_event = await self.event_repo.create(db_event)
        
        return EventResponse(
            id=created_event.id,
            title=created_event.title,
            description=created_event.description,
            date=created_event.date,
            location=created_event.location,
            image_url=f"{settings.API_V1_STR}/public/images/{created_event.id}" if created_event.mega_file_id else None,
            created_at=created_event.created_at
        )

    async def update_event(self, event_id: str, title: str, description: str, date: str, location: str, image: UploadFile | None) -> EventResponse:
        try:
            target_uuid = uuid.UUID(event_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid event ID format")

        db_event = await self.event_repo.get_by_id(target_uuid)
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")

        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            # Upload new image to Mega
            new_mega_file_id = await self.image_service.upload_image(image)

            # Delete old image if it exists
            if db_event.mega_file_id:
                await self.image_service.delete_image(db_event.mega_file_id)

            db_event.mega_file_id = new_mega_file_id
            db_event.content_type = image.content_type

        db_event.title = title
        db_event.description = description
        db_event.date = date
        db_event.location = location

        updated_event = await self.event_repo.update(db_event)

        return EventResponse(
            id=updated_event.id,
            title=updated_event.title,
            description=updated_event.description,
            date=updated_event.date,
            location=updated_event.location,
            image_url=f"{settings.API_V1_STR}/public/images/{updated_event.id}" if updated_event.mega_file_id else None,
            created_at=updated_event.created_at
        )

    async def delete_event(self, event_id: str) -> None:
        try:
            target_uuid = uuid.UUID(event_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid event ID format")

        db_event = await self.event_repo.get_by_id(target_uuid)
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")

        if db_event.mega_file_id:
            await self.image_service.delete_image(db_event.mega_file_id)

        await self.event_repo.delete(db_event)
