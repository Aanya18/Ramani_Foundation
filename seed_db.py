import sys
import os
import uuid
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Load .env from backend directory
load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core import AsyncSessionLocal, Base, engine
from app.models.event import Event
from app.models.gallery import GalleryItem
from app.models.team_member import TeamMember
from app.models.testimonial import Testimonial
from app.models.article import Article
from sqlalchemy import delete

async def seed():
    async with AsyncSessionLocal() as db:
        try:
            print("Clearing existing data...")
            await db.execute(delete(GalleryItem))
            await db.execute(delete(Event))
            await db.execute(delete(TeamMember))
            await db.execute(delete(Testimonial))
            await db.execute(delete(Article))
            await db.commit()

            print("Seeding Events...")
            event1 = Event(
                id=uuid.uuid4(),
                title="Annual Education Summit",
                description="A gathering of educators and community leaders to discuss the future of rural education.",
                date="2024-12-15",
                location="Community Center Hall A",
            )
            event2 = Event(
                id=uuid.uuid4(),
                title="Healthcare Awareness Camp",
                description="Free health checkups and awareness sessions for local families.",
                date="2024-11-20",
                location="Primary Health Unit",
            )
            db.add_all([event1, event2])
            await db.commit()

            print("Seeding Gallery Items...")
            db.add_all([
                GalleryItem(title="Classroom Session", mega_file_id="dummy_file_1", content_type="image/jpeg", event_id=event1.id),
                GalleryItem(title="Health Checkup", mega_file_id="dummy_file_2", content_type="image/jpeg", event_id=event2.id),
                GalleryItem(title="Community Meeting", mega_file_id="dummy_file_3", content_type="image/jpeg"),
            ])

            print("Seeding Team Members...")
            db.add_all([
                TeamMember(name="Dr. Sarah Johnson", role="Medical Director", bio="Dedicated to improving community health."),
                TeamMember(name="Michael Chen", role="Education Lead", bio="Passionate about innovative teaching methods."),
            ])

            print("Seeding Testimonials...")
            db.add_all([
                Testimonial(name="Robert Smith", role="Community Member", content="The foundation has truly changed our lives for the better.", rating=5),
                Testimonial(name="Maria Garcia", role="Parent", content="My children now have access to quality education thanks to their scholarship program.", rating=5),
            ])

            print("Seeding Articles...")
            db.add_all([
                Article(title="The Importance of Early Childhood Education", content="Research shows that early childhood is the most critical period for brain development...", category="Education"),
                Article(title="Sustainable Healthcare Solutions", content="How we are bringing quality healthcare to remote areas using mobile clinics...", category="Health"),
            ])

            await db.commit()
            print("Successfully seeded the database!")

        except Exception as e:
            print(f"Error seeding database: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(seed())
