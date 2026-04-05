from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes.public import auth as public_auth, event as public_event, gallery as public_gallery, lead as public_lead, donation as public_donation
from app.api.routes.private import event as private_event, gallery as private_gallery, lead as private_lead, donation as private_donation

app = FastAPI(title=settings.PROJECT_NAME)

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
app.include_router(public_auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(public_event.router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_gallery.router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_lead.router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_donation.router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])

# Include private routers
app.include_router(private_event.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_gallery.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_lead.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_donation.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {"message": settings.ROOT_MESSAGE}
