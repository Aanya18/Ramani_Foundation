from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, settings
from app.repository.event import EventRepository
from app.models import Event
from app.schemas.event import EventResponse, EventCreate, EventUpdate, EventDetailResponse
from app.services.image import ImageService
import uuid
from typing import List, Optional


class EventService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db
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
                project_id=event.project_id,
                is_upcoming=event.is_upcoming,
                accept_rsvp=event.accept_rsvp,
                accept_volunteers=event.accept_volunteers,
                image_url=f"{settings.API_V1_STR}/public/images/{event.id}" if event.mega_file_id else None,
                created_at=event.created_at
            ) for event in events
        ]

    async def get_upcoming_events(self) -> List[EventResponse]:
        events = await self.event_repo.get_upcoming()
        return [
            EventResponse(
                id=event.id,
                title=event.title,
                description=event.description,
                date=event.date,
                location=event.location,
                project_id=event.project_id,
                is_upcoming=event.is_upcoming,
                accept_rsvp=event.accept_rsvp,
                accept_volunteers=event.accept_volunteers,
                image_url=f"{settings.API_V1_STR}/public/images/{event.id}" if event.mega_file_id else None,
                created_at=event.created_at
            ) for event in events
        ]

    async def get_events_by_project(self, project_id: uuid.UUID) -> List[EventResponse]:
        events = await self.event_repo.get_by_project(project_id)
        return [
            EventResponse(
                id=event.id,
                title=event.title,
                description=event.description,
                date=event.date,
                location=event.location,
                project_id=event.project_id,
                is_upcoming=event.is_upcoming,
                accept_rsvp=event.accept_rsvp,
                accept_volunteers=event.accept_volunteers,
                image_url=f"{settings.API_V1_STR}/public/images/{event.id}" if event.mega_file_id else None,
                created_at=event.created_at
            ) for event in events
        ]

    async def create_event(
        self, 
        title: str, 
        description: str, 
        date: str, 
        location: str, 
        project_id: Optional[uuid.UUID] = None,
        image: Optional[UploadFile] = None,
        is_upcoming: bool = True,
        accept_rsvp: bool = True,
        accept_volunteers: bool = True
    ) -> EventResponse:
        mega_file_id = None
        content_type = None
        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            # Store image in Mega storage
            mega_file_id = await self.image_service.upload_image(image)
            content_type = image.content_type

        db_event = Event(
            title=title,
            description=description,
            date=date,
            location=location,
            project_id=project_id,
            mega_file_id=mega_file_id,
            content_type=content_type,
            is_upcoming=is_upcoming,
            accept_rsvp=accept_rsvp,
            accept_volunteers=accept_volunteers
        )
        created_event = await self.event_repo.create(db_event)
        
        return EventResponse(
            id=created_event.id,
            title=created_event.title,
            description=created_event.description,
            date=created_event.date,
            location=created_event.location,
            project_id=created_event.project_id,
            is_upcoming=created_event.is_upcoming,
            accept_rsvp=created_event.accept_rsvp,
            accept_volunteers=created_event.accept_volunteers,
            image_url=f"{settings.API_V1_STR}/public/images/{created_event.id}" if created_event.mega_file_id else None,
            created_at=created_event.created_at
        )

    async def update_event(
        self, 
        event_id: str, 
        event_data: EventUpdate,
        image: Optional[UploadFile] = None
    ) -> EventResponse:
        db_event = await self.event_repo.get_by_id(event_id)
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")

        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            # Store new image in Mega storage
            new_mega_file_id = await self.image_service.upload_image(image)

            # Delete old image if it exists
            if db_event.mega_file_id:
                await self.image_service.delete_image(db_event.mega_file_id)

            db_event.mega_file_id = new_mega_file_id
            db_event.content_type = image.content_type

        # Update fields from event_data
        update_data = event_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_event, field, value)

        updated_event = await self.event_repo.update(db_event)

        return EventResponse(
            id=updated_event.id,
            title=updated_event.title,
            description=updated_event.description,
            date=updated_event.date,
            location=updated_event.location,
            project_id=updated_event.project_id,
            is_upcoming=updated_event.is_upcoming,
            accept_rsvp=updated_event.accept_rsvp,
            accept_volunteers=updated_event.accept_volunteers,
            image_url=f"{settings.API_V1_STR}/public/images/{updated_event.id}" if updated_event.mega_file_id else None,
            created_at=updated_event.created_at
        )

    async def get_event_by_id(self, event_id: str) -> Optional[EventDetailResponse]:
        """Get event by ID with details"""
        db_event = await self.event_repo.get_by_id(event_id)
        if not db_event:
            return None
        
        # Count RSVPs and volunteers
        rsvp_count = len(db_event.rsvps) if db_event.rsvps else 0
        volunteer_count = sum(1 for r in db_event.rsvps if r.is_volunteer) if db_event.rsvps else 0
        
        # Get gallery items
        gallery_items = [
            {
                "id": item.id,
                "title": item.title,
                "images": [{"id": img.id, "mega_file_id": img.mega_file_id} for img in item.images]
            } for item in db_event.gallery_items
        ] if db_event.gallery_items else []
        
        return EventDetailResponse(
            id=db_event.id,
            title=db_event.title,
            description=db_event.description,
            date=db_event.date,
            location=db_event.location,
            project_id=db_event.project_id,
            is_upcoming=db_event.is_upcoming,
            accept_rsvp=db_event.accept_rsvp,
            accept_volunteers=db_event.accept_volunteers,
            image_url=f"{settings.API_V1_STR}/public/images/{db_event.id}" if db_event.mega_file_id else None,
            created_at=db_event.created_at,
            gallery_items=gallery_items,
            rsvp_count=rsvp_count,
            volunteer_count=volunteer_count,
            project_name=db_event.project.name if db_event.project else None
        )

    async def delete_event(self, event_id: str) -> None:
        db_event = await self.event_repo.get_by_id(event_id)
        if not db_event:
            raise HTTPException(status_code=404, detail="Event not found")

        if db_event.mega_file_id:
            await self.image_service.delete_image(db_event.mega_file_id)

        await self.event_repo.delete(db_event)
