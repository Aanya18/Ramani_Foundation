from fastapi import APIRouter, Depends
from typing import List
from app.schemas.article import ArticleResponse
from app.services.article import ArticleService

router = APIRouter()

@router.get("/articles", response_model=List[ArticleResponse])
async def get_articles(article_service: ArticleService = Depends()):
    return await article_service.get_all_articles()
