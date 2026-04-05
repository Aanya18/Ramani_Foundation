from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import List
from app.schemas import GalleryItemResponse
from app.services import GalleryService
from app.api.deps import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

@router.get("/gallery", response_model=List[GalleryItemResponse])
async def get_all_gallery(gallery_service: GalleryService = Depends()):
    return await gallery_service.get_all_gallery_items()

@router.post("/gallery", response_model=GalleryItemResponse)
async def create_gallery_item(
    title: str = Form(...),
    image: UploadFile = File(...),
    gallery_service: GalleryService = Depends()
):
    return await gallery_service.create_gallery_item(title, image)
