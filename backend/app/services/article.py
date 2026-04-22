from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, settings
from app.repository.article import ArticleRepository
from app.models.article import Article
from app.schemas.article import ArticleResponse
from app.services.image import ImageService
import uuid
from typing import List

class ArticleService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.article_repo = ArticleRepository(db)
        self.image_service = ImageService()

    async def get_all_articles(self) -> List[ArticleResponse]:
        articles = await self.article_repo.get_all()
        return [
            ArticleResponse(
                id=a.id,
                title=a.title,
                content=a.content,
                category=a.category,
                image_url=f"{settings.API_V1_STR}/public/images/{a.id}" if a.mega_file_id else None,
                created_at=a.created_at
            ) for a in articles
        ]

    async def create_article(self, title: str, content: str, category: str | None, image: UploadFile | None) -> ArticleResponse:
        mega_file_id = None
        content_type = None
        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            mega_file_id = await self.image_service.upload_image(image)
            content_type = image.content_type

        db_article = Article(
            title=title,
            content=content,
            category=category,
            mega_file_id=mega_file_id,
            content_type=content_type
        )
        created_article = await self.article_repo.create(db_article)

        return ArticleResponse(
            id=created_article.id,
            title=created_article.title,
            content=created_article.content,
            category=created_article.category,
            image_url=f"{settings.API_V1_STR}/public/images/{created_article.id}" if created_article.mega_file_id else None,
            created_at=created_article.created_at
        )

    async def update_article(self, article_id: str, title: str, content: str, category: str | None, image: UploadFile | None) -> ArticleResponse:
        db_a = await self.article_repo.get_by_id(article_id)
        if not db_a:
            raise HTTPException(status_code=404, detail="Article not found")

        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            new_mega_file_id = await self.image_service.upload_image(image)

            if db_a.mega_file_id:
                await self.image_service.delete_image(db_a.mega_file_id)

            db_a.mega_file_id = new_mega_file_id
            db_a.content_type = image.content_type

        db_a.title = title
        db_a.content = content
        db_a.category = category

        updated_a = await self.article_repo.update(db_a)

        return ArticleResponse(
            id=updated_a.id,
            title=updated_a.title,
            content=updated_a.content,
            category=updated_a.category,
            image_url=f"{settings.API_V1_STR}/public/images/{updated_a.id}" if updated_a.mega_file_id else None,
            created_at=updated_a.created_at
        )

    async def delete_article(self, article_id: str) -> None:
        db_a = await self.article_repo.get_by_id(article_id)
        if not db_a:
            raise HTTPException(status_code=404, detail="Article not found")

        if db_a.mega_file_id:
            await self.image_service.delete_image(db_a.mega_file_id)

        await self.article_repo.delete(db_a)
