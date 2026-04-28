from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid
from app.models.team_member import TeamMember
from app.core import cache, settings
from typing import List

class TeamMemberRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @cache.memoize(tag="team_members", expire=settings.DEFAULT_CACHE_EXPIRE_SECONDS)
    async def get_all(self) -> List[TeamMember]:
        result = await self.db.execute(select(TeamMember).order_by(TeamMember.created_at.desc()))
        return result.scalars().all()

    async def get_by_id(self, member_id: uuid.UUID) -> TeamMember | None:
        result = await self.db.execute(select(TeamMember).where(TeamMember.id == member_id))
        return result.scalars().first()

    async def create(self, member: TeamMember) -> TeamMember:
        self.db.add(member)
        await self.db.commit()
        await self.db.refresh(member)
        cache.invalidate_tag("team_members")
        return member

    async def update(self, member: TeamMember) -> TeamMember:
        await self.db.commit()
        await self.db.refresh(member)
        cache.invalidate_tag("team_members")
        return member

    async def delete(self, member: TeamMember) -> None:
        await self.db.delete(member)
        await self.db.commit()
        cache.invalidate_tag("team_members")
