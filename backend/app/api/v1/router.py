from fastapi import APIRouter

from app.api.v1.routes import (
    auth,
    blogs,
    contact,
    dashboard,
    donations,
    donors,
    events,
    gallery,
    pages,
    programs,
    reports,
    settings,
    stories,
    users,
    volunteers,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(pages.router, prefix="/pages", tags=["pages"])
api_router.include_router(programs.router, prefix="/programs", tags=["programs"])
api_router.include_router(blogs.router, prefix="/blogs", tags=["blogs"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(gallery.router, prefix="/gallery", tags=["gallery"])
api_router.include_router(stories.router, prefix="/stories", tags=["stories"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(volunteers.router, prefix="/volunteers", tags=["volunteers"])
api_router.include_router(donations.router, prefix="/donations", tags=["donations"])
api_router.include_router(donors.router, prefix="/admin/donors", tags=["donors"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(users.router, prefix="/admin/users", tags=["users"])
api_router.include_router(dashboard.router, prefix="/admin/dashboard", tags=["dashboard"])
api_router.include_router(reports.router, prefix="/admin/reports", tags=["reports"])
