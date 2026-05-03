from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select
from app.core.database import get_db
from app.models.gallery import GalleryItem, GalleryImage
from app.models.event import Event
from app.models.donation import Donation
from app.models.team_member import TeamMember
from app.services.image import ImageService
import io
import uuid

router = APIRouter()

@router.get("/{db_id}")
async def get_proxied_image(
    db_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    image_service: ImageService = Depends()
):
    # Try gallery item first (images are stored in GalleryImage table)
    gallery_item = await db.get(GalleryItem, db_id)
    if gallery_item:
        gallery_image_stmt = (
            select(GalleryImage)
            .where(GalleryImage.gallery_item_id == db_id)
            .order_by(GalleryImage.order.asc(), GalleryImage.created_at.asc())
            .limit(1)
        )
        gallery_image = (await db.execute(gallery_image_stmt)).scalars().first()

        if not gallery_image or not gallery_image.mega_file_id:
            raise HTTPException(status_code=404, detail="Image not found")

        try:
            image_bytes = await image_service.get_image(gallery_image.mega_file_id)
        except HTTPException as e:
            if e.status_code == 404 and gallery_image.mega_file_id:
                gallery_image.mega_file_id = None
                try:
                    await db.commit()
                except SQLAlchemyError:
                    await db.rollback()
            raise

        return StreamingResponse(
            io.BytesIO(image_bytes),
            media_type=gallery_image.content_type,
            headers={
                "Content-Disposition": "inline",
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "public, max-age=3600"
            }
        )

    # If not in Gallery, try Event
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
        image_bytes = await image_service.get_image(item.mega_file_id)
    except HTTPException as e:
        # Mega node deleted: clear stale reference to stop repeated failing loads.
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
