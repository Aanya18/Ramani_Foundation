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
