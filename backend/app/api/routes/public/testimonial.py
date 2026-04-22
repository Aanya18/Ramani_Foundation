from fastapi import APIRouter, Depends
from typing import List
from app.schemas.testimonial import TestimonialResponse
from app.services.testimonial import TestimonialService

router = APIRouter()

@router.get("/testimonials", response_model=List[TestimonialResponse])
async def get_testimonials(testimonial_service: TestimonialService = Depends()):
    return await testimonial_service.get_all_testimonials()
