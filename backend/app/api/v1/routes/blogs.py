from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminBlogBase, AdminBlogResponse
from app.schemas.content import BlogSummary
from app.services.admin_service import create_blog, list_admin_blogs, update_blog
from app.services.content_service import list_blogs

router = APIRouter()


@router.get("", response_model=list[BlogSummary])
def get_blogs(db: Session = Depends(get_db)) -> list[BlogSummary]:
    return list_blogs(db)


@router.get("/admin", response_model=list[AdminBlogResponse])
def get_admin_blogs(db: Session = Depends(get_db)) -> list[AdminBlogResponse]:
    return list_admin_blogs(db)


@router.post("/admin", response_model=AdminBlogResponse)
def create_admin_blog(payload: AdminBlogBase, db: Session = Depends(get_db)) -> AdminBlogResponse:
    return create_blog(db, payload)


@router.put("/admin/{blog_id}", response_model=AdminBlogResponse)
def update_admin_blog(
    blog_id: str, payload: AdminBlogBase, db: Session = Depends(get_db)
) -> AdminBlogResponse:
    return update_blog(db, blog_id, payload)
