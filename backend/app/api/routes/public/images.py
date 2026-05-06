import io
import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.donation import Donation
from app.models.event import Event
from app.models.gallery import GalleryImage, GalleryItem
from app.models.team_member import TeamMember
from app.services.image import ImageService

router = APIRouter()

@router.get("/{db_id}")
async def get_proxied_image(
    db_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    image_service: ImageService = Depends()
):
    # 1. Try GalleryImage directly (specific image in a gallery)
    item = await db.get(GalleryImage, db_id)

    # 2. Try GalleryItem (main image for a gallery)
    if not item:
        item = await db.get(GalleryItem, db_id)
        # If it's a GalleryItem, it might have its own stored image
        # or we might need to fall back to its first GalleryImage.
        if item and not item.mega_file_id:
            gallery_image_stmt = (
                select(GalleryImage)
                .where(GalleryImage.gallery_item_id == db_id)
                .order_by(GalleryImage.order.asc(), GalleryImage.created_at.asc())
                .limit(1)
            )
            item = (await db.execute(gallery_image_stmt)).scalars().first()

    # 3. Try Event
    if not item:
        item = await db.get(Event, db_id)

    # If not in Event, try Donation
    if not item:
        item = await db.get(Donation, db_id)

    # If not in Donation, try TeamMember
    if not item:
        item = await db.get(TeamMember, db_id)

    if not item or not item.mega_file_id:
        raise HTTPException(status_code=404, detail="Image not found")

    try:
        image_bytes = await image_service.get_image(item.mega_file_id, getattr(item, "content_type", None))
    except HTTPException as e:
        # Clear stale references so repeated requests stop failing on the same row.
        if e.status_code == 404 and item.mega_file_id:
            item.mega_file_id = None
            try:
                await db.commit()
            except SQLAlchemyError:
                await db.rollback()
        raise
    
    # Return streaming response with security headers
    return StreamingResponse(
        io.BytesIO(image_bytes),
        media_type=item.content_type,
        headers={
            "Content-Disposition": "inline",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "public, max-age=3600"
        }
    )
