from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.article import Article
from app.core import cache, settings
from typing import List

class ArticleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @cache.memoize(tag="articles", expire=settings.DEFAULT_CACHE_EXPIRE_SECONDS)
    async def get_all(self) -> List[Article]:
        result = await self.db.execute(select(Article).order_by(Article.created_at.desc()))
        return result.scalars().all()

    async def get_by_id(self, article_id: str) -> Article | None:
        result = await self.db.execute(select(Article).where(Article.id == article_id))
        return result.scalars().first()

    async def create(self, article: Article) -> Article:
        self.db.add(article)
        await self.db.commit()
        await self.db.refresh(article)
        cache.invalidate_tag("articles")
        return article

    async def update(self, article: Article) -> Article:
        await self.db.commit()
        await self.db.refresh(article)
        cache.invalidate_tag("articles")
        return article

    async def delete(self, article: Article) -> None:
        await self.db.delete(article)
        await self.db.commit()
        cache.invalidate_tag("articles")
