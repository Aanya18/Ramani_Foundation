from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, settings
from app.repository.team_member import TeamMemberRepository
from app.models.team_member import TeamMember
from app.schemas.team_member import TeamMemberResponse
from app.services.image import ImageService
import uuid
from typing import List

class TeamMemberService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.team_repo = TeamMemberRepository(db)
        self.image_service = ImageService()

    async def get_all_members(self) -> List[TeamMemberResponse]:
        members = await self.team_repo.get_all()
        return [
            TeamMemberResponse(
                id=member.id,
                name=member.name,
                role=member.role,
                bio=member.bio,
                image_url=f"{settings.API_V1_STR}/public/images/{member.id}" if member.mega_file_id else None,
                created_at=member.created_at
            ) for member in members
        ]

    async def create_member(self, name: str, role: str, bio: str | None, image: UploadFile | None) -> TeamMemberResponse:
        mega_file_id = None
        content_type = None
        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            mega_file_id = await self.image_service.upload_image(image)
            content_type = image.content_type

        db_member = TeamMember(
            name=name,
            role=role,
            bio=bio,
            mega_file_id=mega_file_id,
            content_type=content_type
        )
        created_member = await self.team_repo.create(db_member)

        return TeamMemberResponse(
            id=created_member.id,
            name=created_member.name,
            role=created_member.role,
            bio=created_member.bio,
            image_url=f"{settings.API_V1_STR}/public/images/{created_member.id}" if created_member.mega_file_id else None,
            created_at=created_member.created_at
        )

    async def update_member(self, member_id: str, name: str, role: str, bio: str | None, image: UploadFile | None) -> TeamMemberResponse:
        db_member = await self.team_repo.get_by_id(member_id)
        if not db_member:
            raise HTTPException(status_code=404, detail="Team member not found")

        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            new_mega_file_id = await self.image_service.upload_image(image)

            if db_member.mega_file_id:
                await self.image_service.delete_image(db_member.mega_file_id)

            db_member.mega_file_id = new_mega_file_id
            db_member.content_type = image.content_type

        db_member.name = name
        db_member.role = role
        db_member.bio = bio

        updated_member = await self.team_repo.update(db_member)

        return TeamMemberResponse(
            id=updated_member.id,
            name=updated_member.name,
            role=updated_member.role,
            bio=updated_member.bio,
            image_url=f"{settings.API_V1_STR}/public/images/{updated_member.id}" if updated_member.mega_file_id else None,
            created_at=updated_member.created_at
        )

    async def delete_member(self, member_id: str) -> None:
        db_member = await self.team_repo.get_by_id(member_id)
        if not db_member:
            raise HTTPException(status_code=404, detail="Team member not found")

        if db_member.mega_file_id:
            await self.image_service.delete_image(db_member.mega_file_id)

        await self.team_repo.delete(db_member)
