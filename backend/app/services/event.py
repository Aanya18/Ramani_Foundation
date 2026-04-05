from fastapi import Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repository.event import EventRepository
from app.models.event import Event
from app.schemas.event import EventResponse
from app.core.config import settings
from app.utils.utils import save_upload_file
import uuid
import os
from typing import List

class EventService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.event_repo = EventRepository(db)

    async def get_all_events(self) -> List[EventResponse]:
        events = await self.event_repo.get_all()
        return [EventResponse.from_orm(event) for event in events]

    async def create_event(self, title: str, description: str, date: str, location: str, image: UploadFile | None) -> EventResponse:
        image_url = None
        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            ext = os.path.splitext(image.filename)[1]
            filename = f"{uuid.uuid4()}{ext}"
            filepath = os.path.join(settings.UPLOADS_DIR, filename)
            await save_upload_file(image, filepath)
            image_url = f"/{settings.UPLOADS_DIR}/{filename}"

        db_event = Event(
            title=title,
            description=description,
            date=date,
            location=location,
            image_url=image_url
        )
        created_event = await self.event_repo.create(db_event)
        return EventResponse.from_orm(created_event)
