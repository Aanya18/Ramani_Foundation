import asyncio
import sys
import uuid
from pathlib import Path
from datetime import datetime, timedelta

# Add parent directory to path so we can import app
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core import AsyncSessionLocal
from app.models import Donation, Event, GalleryItem, Lead

async def seed_data():
    async with AsyncSessionLocal() as session:
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
                image_url=None, # Example with no image
                created_at=datetime.utcnow() - timedelta(days=5)
            ),
        ]
        session.add_all(events_data)
        print(f"Seeded {len(events_data)} events.")

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
        print(f"Seeded {len(gallery_data)} gallery items.")

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
        print(f"Seeded {len(donations_data)} donations.")

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
        print(f"Seeded {len(leads_data)} leads.")


        await session.commit()
        print("Dummy data seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
