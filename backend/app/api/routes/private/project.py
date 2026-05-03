from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from app.api.deps import get_db, get_current_user
from app.models import AdminUser
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectDetailResponse
from app.services.project import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectDetailResponse])
async def get_all_projects(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all projects (admin only)"""
    service = ProjectService(db)
    return await service.get_all_projects(status=status, skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def get_project(
    project_id: uuid.UUID,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get project by ID (admin only)"""
    service = ProjectService(db)
    project = await service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new project (admin only)"""
    service = ProjectService(db)
    
    # Check if project with same name already exists
    existing = await service.get_project_by_name(project_data.name)
    if existing:
        raise HTTPException(status_code=400, detail="Project with this name already exists")
    
    return await service.create_project(project_data)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: uuid.UUID,
    project_data: ProjectUpdate,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a project (admin only)"""
    service = ProjectService(db)
    project = await service.update_project(project_id, project_data)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: uuid.UUID,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a project (admin only)"""
    service = ProjectService(db)
    success = await service.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")


@router.get("/active/list", response_model=List[ProjectDetailResponse])
async def get_active_projects(
    skip: int = 0,
    limit: int = 100,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all active projects (admin only)"""
    service = ProjectService(db)
    return await service.get_active_projects(skip=skip, limit=limit)
