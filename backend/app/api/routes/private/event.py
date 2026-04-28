from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import List
from app.schemas import EventResponse
from app.services import EventService
from app.api.deps import get_current_admin

router = APIRouter(dependencies=[Depends(get_current_admin)])

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

@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    title: str = Form(...),
    description: str = Form(...),
    date: str = Form(...),
    location: str = Form(...),
    image: UploadFile = File(None),
    event_service: EventService = Depends()
):
    return await event_service.update_event(event_id, title, description, date, location, image)

@router.delete("/events/{event_id}", status_code=204)
async def delete_event(
    event_id: str,
    event_service: EventService = Depends()
):
    await event_service.delete_event(event_id)
