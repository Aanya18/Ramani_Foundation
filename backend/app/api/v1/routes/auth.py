from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token
from app.schemas.auth import LoginRequest, TokenResponse, UserSummary

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    if payload.email != "admin@example.org" or payload.password != "admin123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(subject=payload.email)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserSummary)
def me() -> UserSummary:
    return UserSummary(
        id="admin-1",
        full_name="Demo Admin",
        email="admin@example.org",
        role="super_admin",
    )
