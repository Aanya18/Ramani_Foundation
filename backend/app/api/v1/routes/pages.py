from fastapi import APIRouter

from app.schemas.content import PageResponse
from app.services.content_service import get_page_by_slug

router = APIRouter()


@router.get("/{slug}", response_model=PageResponse)
def get_page(slug: str) -> PageResponse:
    return get_page_by_slug(slug)
