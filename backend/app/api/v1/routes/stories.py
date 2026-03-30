from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminStoryBase, AdminStoryResponse
from app.schemas.content import StorySummary
from app.services.admin_service import create_story, list_admin_stories, update_story
from app.services.content_service import list_stories

router = APIRouter()


@router.get("", response_model=list[StorySummary])
def get_stories(db: Session = Depends(get_db)) -> list[StorySummary]:
    return list_stories(db)


@router.get("/admin", response_model=list[AdminStoryResponse])
def get_admin_stories(db: Session = Depends(get_db)) -> list[AdminStoryResponse]:
    return list_admin_stories(db)


@router.post("/admin", response_model=AdminStoryResponse)
def create_admin_story(
    payload: AdminStoryBase, db: Session = Depends(get_db)
) -> AdminStoryResponse:
    return create_story(db, payload)


@router.put("/admin/{story_id}", response_model=AdminStoryResponse)
def update_admin_story(
    story_id: str, payload: AdminStoryBase, db: Session = Depends(get_db)
) -> AdminStoryResponse:
    return update_story(db, story_id, payload)
