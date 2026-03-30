from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminProgramBase, AdminProgramResponse
from app.schemas.content import ProgramSummary
from app.services.admin_service import create_program, list_admin_programs, update_program
from app.services.content_service import list_programs

router = APIRouter()


@router.get("", response_model=list[ProgramSummary])
def get_programs(db: Session = Depends(get_db)) -> list[ProgramSummary]:
    return list_programs(db)


@router.get("/admin", response_model=list[AdminProgramResponse])
def get_admin_programs(db: Session = Depends(get_db)) -> list[AdminProgramResponse]:
    return list_admin_programs(db)


@router.post("/admin", response_model=AdminProgramResponse)
def create_admin_program(
    payload: AdminProgramBase, db: Session = Depends(get_db)
) -> AdminProgramResponse:
    return create_program(db, payload)


@router.put("/admin/{program_id}", response_model=AdminProgramResponse)
def update_admin_program(
    program_id: str, payload: AdminProgramBase, db: Session = Depends(get_db)
) -> AdminProgramResponse:
    return update_program(db, program_id, payload)
