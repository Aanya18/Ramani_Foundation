from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import List, Optional
from app.schemas.article import ArticleResponse
from app.services.article import ArticleService
from app.api.deps import get_current_admin

router = APIRouter(dependencies=[Depends(get_current_admin)])

@router.post("/articles", response_model=ArticleResponse)
async def create_article(
    title: str = Form(...),
    content: str = Form(...),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    article_service: ArticleService = Depends()
):
    return await article_service.create_article(title, content, category, image)

@router.put("/articles/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str,
    title: str = Form(...),
    content: str = Form(...),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    article_service: ArticleService = Depends()
):
    return await article_service.update_article(article_id, title, content, category, image)

@router.delete("/articles/{article_id}")
async def delete_article(article_id: str, article_service: ArticleService = Depends()):
    await article_service.delete_article(article_id)
    return {"message": "Article deleted successfully"}
