from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import List
from app.schemas.event import EventResponse
from app.services.event import EventService
from app.api.deps import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

@router.get("/events", response_model=List[EventResponse])
async def get_all_events(event_service: EventService = Depends()):
    return await event_service.get_all_events()

@router.post("/events", response_model=EventResponse)
async def create_event(
    title: str = Form(...),
    description: str = Form(...),
    date: str = Form(...),
    location: str = Form(...),
    image: UploadFile = File(None),
    event_service: EventService = Depends()
):
    return await event_service.create_event(title, description, date, location, image)
