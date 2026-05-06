import asyncio
import logging
import tempfile
import uuid
from functools import partial
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import quote

import cloudinary
import cloudinary.api
import cloudinary.uploader
from fastapi import HTTPException, UploadFile

from app.core.config import settings
from app.core.memory_cache import image_cache

logger = logging.getLogger(__name__)


class CloudinaryManager:
    _configured = False
    _lock = asyncio.Lock()

    @classmethod
    async def configure(cls) -> None:
        async with cls._lock:
            if cls._configured:
                return

            if not settings.CLOUDINARY_CLOUD_NAME:
                raise HTTPException(status_code=500, detail="Cloudinary cloud name is not configured")
            if not settings.CLOUDINARY_API_KEY:
                raise HTTPException(status_code=500, detail="Cloudinary API key is not configured")
            if not settings.CLOUDINARY_API_SECRET:
                raise HTTPException(status_code=500, detail="Cloudinary API secret is not configured")

            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=True,
            )
            cls._configured = True


class ImageService:
    @staticmethod
    def _looks_like_image_bytes(data: bytes) -> bool:
        if not data:
            return False
        return (
            data.startswith(b"\xff\xd8\xff")
            or data.startswith(b"\x89PNG\r\n\x1a\n")
            or data.startswith(b"GIF87a")
            or data.startswith(b"GIF89a")
            or (len(data) > 12 and data[0:4] == b"RIFF" and data[8:12] == b"WEBP")
        )

    @staticmethod
    def _cloudinary_url(public_id: str) -> str:
        cloud_name = settings.CLOUDINARY_CLOUD_NAME
        if not cloud_name:
            raise HTTPException(status_code=500, detail="Cloudinary cloud name is not configured")
        return f"https://res.cloudinary.com/{cloud_name}/image/upload/{quote(public_id, safe='/')}"

    @staticmethod
    def _content_type_to_extension(content_type: str | None) -> str | None:
        if not content_type:
            return None

        return {
            "image/jpeg": "jpg",
            "image/jpg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/webp": "webp",
            "image/bmp": "bmp",
            "image/tiff": "tiff",
        }.get(content_type.lower())

    def _cloudinary_delivery_url(self, public_id: str, content_type: str | None = None) -> str:
        if public_id.startswith(("http://", "https://")):
            return public_id

        base_url = self._cloudinary_url(public_id)
        extension = self._content_type_to_extension(content_type)
        if extension and not base_url.lower().endswith(f".{extension}"):
            return f"{base_url}.{extension}"
        return base_url

    async def upload_image(self, file: UploadFile) -> str:
        await CloudinaryManager.configure()

        content = await file.read()
        suffix = Path(file.filename or "").suffix.lower() or ".jpg"
        remote_name = f"{uuid.uuid4().hex}{suffix}"
        temp_path = Path(tempfile.gettempdir()) / remote_name

        try:
            temp_path.write_bytes(content)
            upload_result = await asyncio.to_thread(
                cloudinary.uploader.upload,
                str(temp_path),
                folder=settings.CLOUDINARY_FOLDER,
                resource_type="image",
                overwrite=False,
                unique_filename=True,
            )
            public_id = upload_result.get("public_id")
            if not public_id:
                raise HTTPException(status_code=500, detail="Failed to upload image to Cloudinary")
            return public_id
        except HTTPException:
            raise
        except Exception as exc:
            logger.error("Failed to upload image to Cloudinary: %s", exc)
            raise HTTPException(status_code=500, detail="Failed to upload image to Cloudinary") from exc
        finally:
            try:
                if temp_path.exists():
                    temp_path.unlink()
            except Exception:
                pass
            await file.close()

    async def get_image(self, public_id: str, content_type: str | None = None) -> bytes:
        cached = image_cache.get(public_id)
        if cached:
            return cached

        try:
            image_url = self._cloudinary_delivery_url(public_id, content_type)
            with await asyncio.to_thread(partial(urlopen, image_url, timeout=20)) as response:
                file_content = response.read()
            if file_content and self._looks_like_image_bytes(file_content):
                image_cache.set(public_id, file_content)
                return file_content
        except Exception as exc:
            logger.error("Failed to read image from Cloudinary: %s", exc)

        # Fallback for legacy rows that may only be resolvable via Cloudinary metadata.
        try:
            resource = await asyncio.to_thread(
                cloudinary.api.resource,
                public_id,
                resource_type="image",
                type="upload",
            )
            secure_url = resource.get("secure_url")
            if secure_url:
                with await asyncio.to_thread(partial(urlopen, secure_url, timeout=20)) as response:
                    file_content = response.read()
                if file_content and self._looks_like_image_bytes(file_content):
                    image_cache.set(public_id, file_content)
                    return file_content
        except Exception as exc:
            logger.error("Cloudinary metadata fallback failed: %s", exc)

        raise HTTPException(status_code=404, detail="Image not found")

    async def delete_image(self, public_id: str) -> None:
        await CloudinaryManager.configure()

        try:
            await asyncio.to_thread(
                cloudinary.uploader.destroy,
                public_id,
                resource_type="image",
                invalidate=True,
            )
        except Exception as exc:
            logger.error("Failed to delete image from Cloudinary: %s", exc)
        finally:
            image_cache.delete(public_id)
