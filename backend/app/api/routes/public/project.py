from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db
from app.schemas.project import ProjectResponse
from app.services.project import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectResponse])
async def get_all_projects(
    db: AsyncSession = Depends(get_db)
):
    """Get all active projects (public)"""
    service = ProjectService(db)
    return await service.get_active_projects()
