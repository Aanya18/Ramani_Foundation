from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import List, Optional
from app.schemas.testimonial import TestimonialResponse
from app.services.testimonial import TestimonialService
from app.api.deps import get_current_admin

router = APIRouter(dependencies=[Depends(get_current_admin)])

@router.post("/testimonials", response_model=TestimonialResponse)
async def create_testimonial(
    name: str = Form(...),
    role: Optional[str] = Form(None),
    content: str = Form(...),
    rating: int = Form(5),
    image: Optional[UploadFile] = File(None),
    testimonial_service: TestimonialService = Depends()
):
    return await testimonial_service.create_testimonial(name, role, content, rating, image)

@router.put("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: str,
    name: str = Form(...),
    role: Optional[str] = Form(None),
    content: str = Form(...),
    rating: int = Form(5),
    image: Optional[UploadFile] = File(None),
    testimonial_service: TestimonialService = Depends()
):
    return await testimonial_service.update_testimonial(testimonial_id, name, role, content, rating, image)

@router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, testimonial_service: TestimonialService = Depends()):
    await testimonial_service.delete_testimonial(testimonial_id)
    return {"message": "Testimonial deleted successfully"}
