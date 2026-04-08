from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core import settings, engine, Base, AsyncSessionLocal
from app.api import public_auth_router, public_event_router, public_gallery_router, public_lead_router, public_donation_router, private_event_router, private_gallery_router, private_lead_router, private_donation_router
import asyncio
from sqlalchemy.future import select

# Import all models to register them with Base
from app.models import AdminUser, Donation, Event, GalleryItem, Lead
from app.core.security import get_password_hash
import uuid
from datetime import datetime, timedelta

app = FastAPI(title=settings.PROJECT_NAME)

# Startup event to initialize database and seed data
@app.on_event("startup")
async def startup_event():
    """Initialize database and seed data on app startup"""
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✓ Database tables created/verified.")
    
    # Seed admin user if not exists
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(AdminUser).where(AdminUser.username == "admin"))
        if not result.scalars().first():
            admin = AdminUser(
                username="admin",
                hashed_password=get_password_hash("admin123")
            )
            session.add(admin)
            await session.commit()
            print("✓ Admin user 'admin' created (password: admin123)")
        else:
            print("✓ Admin user already exists.")
        
        # Seed test data if no events exist
        result = await session.execute(select(Event))
        event_count = len(result.scalars().all())
        if event_count == 0:
            # Seed events
            events_data = [
                Event(
                    id=uuid.uuid4(),
                    title="Community Cleanup Drive",
                    description="Join us in making our community cleaner and greener! All volunteers are welcome.",
                    date="2024-07-20",
                    location="City Park, Green Avenue",
                    image_url="/uploads/event_cleanup.jpg",
                    created_at=datetime.utcnow() - timedelta(days=10)
                ),
                Event(
                    id=uuid.uuid4(),
                    title="Annual Charity Gala",
                    description="An evening of elegance to raise funds for our educational programs. Dinner and live music.",
                    date="2024-09-15",
                    location="Grand Ballroom, Downtown Hotel",
                    image_url="/uploads/event_gala.jpg",
                    created_at=datetime.utcnow() - timedelta(days=20)
                ),
                Event(
                    id=uuid.uuid4(),
                    title="Youth Empowerment Workshop",
                    description="A free workshop for high school students focusing on leadership and skill development.",
                    date="2024-08-05",
                    location="Youth Community Center",
                    image_url=None,
                    created_at=datetime.utcnow() - timedelta(days=5)
                ),
            ]
            session.add_all(events_data)

            # Seed gallery items
            gallery_data = [
                GalleryItem(
                    id=uuid.uuid4(),
                    title="Volunteers at work during last cleanup",
                    image_url="/uploads/gallery_cleanup_volunteers.jpg",
                    created_at=datetime.utcnow() - timedelta(days=12)
                ),
                GalleryItem(
                    id=uuid.uuid4(),
                    title="Gala 2023 Highlights",
                    image_url="/uploads/gallery_gala_highlights.jpg",
                    created_at=datetime.utcnow() - timedelta(days=25)
                ),
                GalleryItem(
                    id=uuid.uuid4(),
                    title="Workshop in Progress",
                    image_url="/uploads/gallery_workshop.jpg",
                    created_at=datetime.utcnow() - timedelta(days=6)
                ),
            ]
            session.add_all(gallery_data)

            # Seed donations
            donations_data = [
                Donation(
                    id=uuid.uuid4(),
                    donor_name="John Doe",
                    email="john.doe@example.com",
                    amount="100.00",
                    proof_image_url="/uploads/proof_john.jpg",
                    verified=True,
                    created_at=datetime.utcnow() - timedelta(days=3)
                ),
                Donation(
                    id=uuid.uuid4(),
                    donor_name="Jane Smith",
                    email="jane.smith@example.com",
                    amount="50.00",
                    proof_image_url="/uploads/proof_jane.jpg",
                    verified=False,
                    created_at=datetime.utcnow() - timedelta(days=1)
                ),
            ]
            session.add_all(donations_data)

            # Seed leads
            leads_data = [
                Lead(
                    id=uuid.uuid4(),
                    type="volunteer",
                    name="Alice Brown",
                    email="alice.b@example.com",
                    phone="111-222-3333",
                    message="Interested in helping with community events.",
                    created_at=datetime.utcnow() - timedelta(days=7)
                ),
                Lead(
                    id=uuid.uuid4(),
                    type="contact",
                    name="Bob White",
                    email="bob.w@example.com",
                    phone=None,
                    message="Had a question about your latest initiative.",
                    created_at=datetime.utcnow() - timedelta(days=2)
                ),
            ]
            session.add_all(leads_data)

            await session.commit()
            print("✓ Seed data created (events, gallery, donations, leads)")
        else:
            print(f"✓ Data already exists ({event_count} events found).")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
import os
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
app.mount(f"/{settings.UPLOADS_DIR}", StaticFiles(directory=settings.UPLOADS_DIR), name=settings.UPLOADS_DIR)

# Include public routers
app.include_router(public_auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(public_event_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_gallery_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_lead_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_donation_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])

# Include private routers
app.include_router(private_event_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_gallery_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_lead_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_donation_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])



@app.get("/")
def read_root():
    return {"message": settings.ROOT_MESSAGE}
