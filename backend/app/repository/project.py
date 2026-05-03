from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
import uuid
from typing import List, Optional


class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, project_data: ProjectCreate) -> Project:
        db_project = Project(**project_data.dict())
        self.db.add(db_project)
        await self.db.commit()
        await self.db.refresh(db_project)
        return db_project

    async def get_by_id(self, project_id: uuid.UUID) -> Optional[Project]:
        result = await self.db.execute(select(Project).where(Project.id == project_id))
        return result.scalars().first()

    async def get_by_name(self, name: str) -> Optional[Project]:
        result = await self.db.execute(select(Project).where(Project.name == name))
        return result.scalars().first()

    async def get_all(self, status: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Project]:
        query = select(Project)
        if status:
            query = query.where(Project.status == status)
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update(self, project_id: uuid.UUID, project_data: ProjectUpdate) -> Optional[Project]:
        db_project = await self.get_by_id(project_id)
        if not db_project:
            return None
        
        update_data = project_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_project, field, value)
        
        await self.db.commit()
        await self.db.refresh(db_project)
        return db_project

    async def delete(self, project_id: uuid.UUID) -> bool:
        db_project = await self.get_by_id(project_id)
        if not db_project:
            return False
        
        await self.db.delete(db_project)
        await self.db.commit()
        return True

    async def get_count_by_status(self, status: str) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(Project).where(Project.status == status)
        )
        return int(result.scalar_one())
