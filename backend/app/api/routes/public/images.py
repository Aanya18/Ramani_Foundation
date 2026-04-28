from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import get_db
from app.models.gallery import GalleryItem
from app.models.event import Event
from app.models.donation import Donation
from app.models.team_member import TeamMember
from app.models.testimonial import Testimonial
from app.models.article import Article
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
    # Try searching in Gallery
    item = await db.get(GalleryItem, db_id)
    
    # If not in Gallery, try Event
    if not item:
        item = await db.get(Event, db_id)

    # If not in Event, try Donation
    if not item:
        item = await db.get(Donation, db_id)

    # If not in Donation, try TeamMember
    if not item:
        item = await db.get(TeamMember, db_id)

    # If not in TeamMember, try Testimonial
    if not item:
        item = await db.get(Testimonial, db_id)

    # If not in Testimonial, try Article
    if not item:
        item = await db.get(Article, db_id)
    
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
