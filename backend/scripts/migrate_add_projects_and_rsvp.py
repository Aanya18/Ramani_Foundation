"""
Database migration script to add new tables and columns for enhanced gallery,
events, and RSVP functionality.

This script adds:
1. projects table - for project-based organization
2. gallery_images table - for multiple images per gallery item
3. event_rsvps table - for tracking RSVPs and volunteers
4. Columns: project_id to events and gallery tables
5. Columns: is_upcoming, accept_rsvp, accept_volunteers to events
6. Columns: description to gallery items
7. Columns: source, is_active to leads table
"""

import asyncio
import os
import sys
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + '/..'))
sys.stdout.reconfigure(encoding="utf-8")

from app.core import settings, Base
from app.models import *


async def migrate_database():
    """Run database migrations"""
    
    # Create async engine
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        print("Starting database migration...")
        
        try:
            # Create all new tables
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            print("✅ All tables created successfully")
            
            # Add new columns to existing tables
            async with engine.begin() as conn:
                # Add project_id to events table if it doesn't exist
                try:
                    await conn.execute(text("""
                        ALTER TABLE events ADD COLUMN project_id UUID REFERENCES projects(id);
                    """))
                    print("✅ Added project_id to events table")
                except Exception as e:
                    print(f"⚠️  project_id might already exist in events: {e}")
                
                # Add project_id to gallery table if it doesn't exist
                try:
                    await conn.execute(text("""
                        ALTER TABLE gallery ADD COLUMN project_id UUID REFERENCES projects(id);
                    """))
                    print("✅ Added project_id to gallery table")
                except Exception as e:
                    print(f"⚠️  project_id might already exist in gallery: {e}")
                
                # Add description to gallery table
                try:
                    await conn.execute(text("""
                        ALTER TABLE gallery ADD COLUMN description VARCHAR;
                    """))
                    print("✅ Added description to gallery table")
                except Exception as e:
                    print(f"⚠️  description might already exist in gallery: {e}")

                # Add event relation/ordering columns to gallery table
                try:
                    await conn.execute(text("""
                        ALTER TABLE gallery ADD COLUMN event_id UUID REFERENCES events(id);
                    """))
                    print("✅ Added event_id to gallery table")
                except Exception as e:
                    print(f"⚠️  event_id might already exist in gallery: {e}")

                try:
                    await conn.execute(text("""
                        ALTER TABLE gallery ADD COLUMN "order" INTEGER DEFAULT 0;
                    """))
                    print("✅ Added order to gallery table")
                except Exception as e:
                    print(f"⚠️  order might already exist in gallery: {e}")

                try:
                    await conn.execute(text("""
                        ALTER TABLE gallery ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
                    """))
                    print("✅ Added updated_at to gallery table")
                except Exception as e:
                    print(f"⚠️  updated_at might already exist in gallery: {e}")
                
                # Add new columns to events
                try:
                    await conn.execute(text("""
                        ALTER TABLE events ADD COLUMN is_upcoming BOOLEAN DEFAULT true;
                    """))
                    print("✅ Added is_upcoming to events table")
                except Exception as e:
                    print(f"⚠️  is_upcoming might already exist: {e}")
                
                try:
                    await conn.execute(text("""
                        ALTER TABLE events ADD COLUMN accept_rsvp BOOLEAN DEFAULT true;
                    """))
                    print("✅ Added accept_rsvp to events table")
                except Exception as e:
                    print(f"⚠️  accept_rsvp might already exist: {e}")
                
                try:
                    await conn.execute(text("""
                        ALTER TABLE events ADD COLUMN accept_volunteers BOOLEAN DEFAULT true;
                    """))
                    print("✅ Added accept_volunteers to events table")
                except Exception as e:
                    print(f"⚠️  accept_volunteers might already exist: {e}")
                
                try:
                    await conn.execute(text("""
                        ALTER TABLE events ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
                    """))
                    print("✅ Added updated_at to events table")
                except Exception as e:
                    print(f"⚠️  updated_at might already exist: {e}")
                
                # Add new columns to leads
                try:
                    await conn.execute(text("""
                        ALTER TABLE leads ADD COLUMN source VARCHAR;
                    """))
                    print("✅ Added source to leads table")
                except Exception as e:
                    print(f"⚠️  source might already exist in leads: {e}")
                
                try:
                    await conn.execute(text("""
                        ALTER TABLE leads ADD COLUMN is_active BOOLEAN DEFAULT true;
                    """))
                    print("✅ Added is_active to leads table")
                except Exception as e:
                    print(f"⚠️  is_active might already exist in leads: {e}")
                
                try:
                    await conn.execute(text("""
                        ALTER TABLE leads ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
                    """))
                    print("✅ Added updated_at to leads table")
                except Exception as e:
                    print(f"⚠️  updated_at might already exist in leads: {e}")
                
                # Add indexes
                try:
                    await conn.execute(text("""
                        CREATE INDEX IF NOT EXISTS idx_events_project_id ON events(project_id);
                    """))
                    print("✅ Created index on events.project_id")
                except Exception as e:
                    print(f"⚠️  Index creation failed: {e}")
                
                try:
                    await conn.execute(text("""
                        CREATE INDEX IF NOT EXISTS idx_gallery_project_id ON gallery(project_id);
                    """))
                    print("✅ Created index on gallery.project_id")
                except Exception as e:
                    print(f"⚠️  Index creation failed: {e}")

                try:
                    await conn.execute(text("""
                        CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON gallery(event_id);
                    """))
                    print("✅ Created index on gallery.event_id")
                except Exception as e:
                    print(f"⚠️  Index creation failed: {e}")
            
            print("\n✅ Database migration completed successfully!")
            
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            raise
        finally:
            await engine.dispose()


if __name__ == "__main__":
    asyncio.run(migrate_database())
