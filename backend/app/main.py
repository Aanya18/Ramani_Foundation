from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core import settings, engine, Base
from .api import (
    public_auth_router,
    public_event_router,
    public_gallery_router,
    public_lead_router,
    public_donation_router,
    public_team_member_router,
    public_images_router,
    public_project_router,
    private_event_router,
    private_gallery_router,
    private_lead_router,
    private_project_router,
    private_donation_router,
    private_team_member_router
)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include public routers
app.include_router(public_auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(public_event_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_gallery_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_lead_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_donation_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_team_member_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_project_router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(public_images_router, prefix=f"{settings.API_V1_STR}/public/images", tags=["images"])

# Include private routers
app.include_router(private_event_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_gallery_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_lead_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_project_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_donation_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(private_team_member_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])



@app.get("/")
@app.head("/")
def read_root():
    return {"message": settings.ROOT_MESSAGE}


@app.get(f"{settings.API_V1_STR}")
@app.head(f"{settings.API_V1_STR}")
def api_health():
    return {"status": "ok", "message": "API is running"}
