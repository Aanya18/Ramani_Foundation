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
    event_id: str = Form(None),
    gallery_service: GalleryService = Depends()
):
    return await gallery_service.create_gallery_item(title, image, event_id)

@router.put("/gallery/{item_id}", response_model=GalleryItemResponse)
async def update_gallery_item(
    item_id: str,
    title: str = Form(...),
    image: UploadFile = File(None),
    event_id: str = Form(None),
    gallery_service: GalleryService = Depends()
):
    return await gallery_service.update_gallery_item(item_id, title, image, event_id)

@router.delete("/gallery/{item_id}", status_code=204)
async def delete_gallery_item(
    item_id: str,
    gallery_service: GalleryService = Depends()
):
    await gallery_service.delete_gallery_item(item_id)
