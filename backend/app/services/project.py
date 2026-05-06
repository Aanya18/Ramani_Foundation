from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Project, Event, GalleryItem
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectDetailResponse
from app.repository.project import ProjectRepository
import uuid
from typing import List, Optional


class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ProjectRepository(db)

    async def create_project(self, project_data: ProjectCreate) -> ProjectResponse:
        """Create a new project"""
        project = await self.repo.create(project_data)
        return ProjectResponse.from_orm(project)

    async def get_project(self, project_id: uuid.UUID) -> Optional[ProjectDetailResponse]:
        """Get project by ID with statistics"""
        project = await self.repo.get_by_id(project_id)
        if not project:
            return None
        
        # Count related items
        events_count = await self._count_events(project_id)
        gallery_count = await self._count_gallery(project_id)
        
        return ProjectDetailResponse(
            **ProjectResponse.from_orm(project).dict(),
            events_count=events_count,
            gallery_items_count=gallery_count
        )

    async def get_all_projects(self, status: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[ProjectDetailResponse]:
        """Get all projects with optional status filter"""
        projects = await self.repo.get_all(status=status, skip=skip, limit=limit)
        results = []
        
        for project in projects:
            events_count = await self._count_events(project.id)
            gallery_count = await self._count_gallery(project.id)
            
            results.append(ProjectDetailResponse(
                **ProjectResponse.from_orm(project).dict(),
                events_count=events_count,
                gallery_items_count=gallery_count
            ))
        
        return results

    async def update_project(self, project_id: uuid.UUID, project_data: ProjectUpdate) -> Optional[ProjectResponse]:
        """Update a project"""
        project = await self.repo.update(project_id, project_data)
        if not project:
            return None
        return ProjectResponse.from_orm(project)

    async def delete_project(self, project_id: uuid.UUID) -> bool:
        """Delete a project"""
        return await self.repo.delete(project_id)

    async def get_project_by_name(self, name: str) -> Optional[ProjectResponse]:
        """Get project by name"""
        project = await self.repo.get_by_name(name)
        if not project:
            return None
        return ProjectResponse.from_orm(project)

    async def get_active_projects(self, skip: int = 0, limit: int = 100) -> List[ProjectDetailResponse]:
        """Get all active projects"""
        return await self.get_all_projects(status="active", skip=skip, limit=limit)

    async def _count_events(self, project_id: uuid.UUID) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(Event).where(Event.project_id == project_id)
        )
        return int(result.scalar_one())

    async def _count_gallery(self, project_id: uuid.UUID) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(GalleryItem).where(GalleryItem.project_id == project_id)
        )
        return int(result.scalar_one())
