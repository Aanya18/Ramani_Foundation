from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import List, Optional
from app.schemas.team_member import TeamMemberResponse
from app.services.team_member import TeamMemberService
from app.api.deps import get_current_admin

router = APIRouter(dependencies=[Depends(get_current_admin)])

@router.post("/team", response_model=TeamMemberResponse)
async def create_member(
    name: str = Form(...),
    role: str = Form(...),
    bio: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    team_service: TeamMemberService = Depends()
):
    return await team_service.create_member(name, role, bio, image)

@router.put("/team/{member_id}", response_model=TeamMemberResponse)
async def update_member(
    member_id: str,
    name: str = Form(...),
    role: str = Form(...),
    bio: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    team_service: TeamMemberService = Depends()
):
    return await team_service.update_member(member_id, name, role, bio, image)

@router.delete("/team/{member_id}")
async def delete_member(member_id: str, team_service: TeamMemberService = Depends()):
    await team_service.delete_member(member_id)
    return {"message": "Team member deleted successfully"}
