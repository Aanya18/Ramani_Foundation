from fastapi import APIRouter

router = APIRouter()


@router.get("")
def get_gallery() -> dict[str, list[dict[str, str]]]:
    return {
        "items": [
            {"title": "Learning session", "media_type": "image"},
            {"title": "Community workshop", "media_type": "image"},
        ]
    }
