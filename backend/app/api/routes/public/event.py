from fastapi import APIRouter, Depends
from typing import List
from app.schemas import EventResponse
from app.services import EventService

router = APIRouter()

@router.get("/events", response_model=List[EventResponse])
async def get_events(event_service: EventService = Depends()):
    return await event_service.get_all_events()
