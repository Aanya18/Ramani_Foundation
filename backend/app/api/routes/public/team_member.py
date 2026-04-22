from fastapi import APIRouter, Depends
from typing import List
from app.schemas.team_member import TeamMemberResponse
from app.services.team_member import TeamMemberService

router = APIRouter()

@router.get("/team", response_model=List[TeamMemberResponse])
async def get_team(team_service: TeamMemberService = Depends()):
    return await team_service.get_all_members()
