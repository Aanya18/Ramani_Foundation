from fastapi import APIRouter, Depends
from typing import List
from app.schemas import GalleryItemResponse
from app.services import GalleryService

router = APIRouter()

@router.get("/gallery", response_model=List[GalleryItemResponse])
async def get_gallery(gallery_service: GalleryService = Depends()):
    return await gallery_service.get_all_gallery_items()
