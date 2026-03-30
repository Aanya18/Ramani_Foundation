from fastapi import APIRouter

router = APIRouter()


@router.get("")
def list_users() -> dict[str, list[dict[str, str]]]:
    return {
        "items": [
            {"id": "admin-1", "name": "Demo Admin", "role": "super_admin"},
            {"id": "admin-2", "name": "Content Manager", "role": "content_manager"},
        ]
    }
