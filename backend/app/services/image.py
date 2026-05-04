import logging
import tempfile
import uuid
import asyncio
import types
from pathlib import Path
from urllib.request import urlopen

from fastapi import HTTPException, UploadFile

from app.core.config import settings
from app.core.memory_cache import image_cache

logger = logging.getLogger(__name__)

# Compatibility for older mega.py on Python 3.11+
if not hasattr(asyncio, "coroutine"):
    asyncio.coroutine = types.coroutine


class ImageService:
    @staticmethod
    def _looks_like_image_bytes(data: bytes) -> bool:
        if not data:
            return False
        # Common image signatures: jpeg, png, gif, webp
        return (
            data.startswith(b"\xff\xd8\xff")
            or data.startswith(b"\x89PNG\r\n\x1a\n")
            or data.startswith(b"GIF87a")
            or data.startswith(b"GIF89a")
            or (len(data) > 12 and data[0:4] == b"RIFF" and data[8:12] == b"WEBP")
        )

    async def _open_mega_client(self):
        if not settings.MEGA_USER or not settings.MEGA_PASSWORD:
            raise HTTPException(
                status_code=500,
                detail="Mega credentials are not configured",
            )

        try:
            from mega.client import MegaNzClient
        except ImportError as exc:
            raise HTTPException(
                status_code=500,
                detail="Mega client is not installed",
            ) from exc

        try:
            mega = MegaNzClient()
            await mega.login(settings.MEGA_USER, settings.MEGA_PASSWORD)
            return mega
        except Exception as exc:
            logger.error("Failed to initialize Mega client: %s", exc)
            raise HTTPException(
                status_code=500,
                detail="Failed to initialize Mega storage",
            ) from exc

    async def _get_root_folder(self, client):
        folder_name = settings.MEGA_ROOT_FOLDER

        try:
            folder = await client.find(folder_name)
            if folder:
                return folder.id

            created = await client.create_folder(folder_name)
            return created.id
        except Exception as exc:
            logger.error("Failed to resolve Mega root folder: %s", exc)
            raise HTTPException(
                status_code=500,
                detail="Failed to resolve Mega upload folder",
            ) from exc

        raise HTTPException(
            status_code=500,
            detail="Failed to resolve Mega upload folder",
        )

    async def upload_image(self, file: UploadFile) -> str:
        content = await file.read()
        suffix = Path(file.filename or "").suffix.lower() or ".jpg"
        remote_name = f"{uuid.uuid4().hex}{suffix}"
        temp_path = Path(tempfile.gettempdir()) / remote_name

        try:
            temp_path.write_bytes(content)
            async with await self._open_mega_client() as client:
                folder = await self._get_root_folder(client)
                uploaded = await client.upload(str(temp_path), folder)
                public_link = await client.get_public_link(uploaded)
                if not public_link:
                    raise HTTPException(status_code=500, detail="Failed to create Mega link")
                return public_link
        except HTTPException:
            raise
        except Exception as exc:
            logger.error("Failed to upload image to Mega: %s", exc)
            raise HTTPException(status_code=500, detail="Failed to upload image") from exc
        finally:
            try:
                if temp_path.exists():
                    temp_path.unlink()
            except Exception:
                pass
            await file.close()

    async def get_image(self, stored_ref: str) -> bytes:
        cached = image_cache.get(stored_ref)
        if cached:
            return cached

        try:
            async with await self._open_mega_client() as client:
                with tempfile.TemporaryDirectory() as temp_dir:
                    if stored_ref.startswith(("http://", "https://")):
                        download_results = await client.download_url(stored_ref, temp_dir)
                        if download_results is not None and getattr(download_results, "success", None):
                            output_path = next(iter(download_results.success.values()))
                            file_content = Path(output_path).read_bytes()
                            if file_content:
                                image_cache.set(stored_ref, file_content)
                                return file_content
                            raise HTTPException(status_code=404, detail="Image not found")
                        raise HTTPException(status_code=404, detail="Image not found")

                    filesystem = await client.get_filesystem()
                    if stored_ref not in filesystem:
                        raise HTTPException(status_code=404, detail="Image not found")

                    node = filesystem[stored_ref]
                    output_path = await client.download(node, temp_dir)
                    file_content = Path(output_path).read_bytes()
                    if file_content:
                        image_cache.set(stored_ref, file_content)
                        return file_content

                raise HTTPException(status_code=404, detail="Image not found")
        except HTTPException:
            # For public URLs, fallback to direct download when Mega client flow fails.
            if stored_ref.startswith(("http://", "https://")):
                try:
                    with urlopen(stored_ref, timeout=20) as response:
                        file_content = response.read()
                    if self._looks_like_image_bytes(file_content):
                        image_cache.set(stored_ref, file_content)
                        return file_content
                except Exception as fallback_exc:
                    logger.error("Direct URL fallback failed for image: %s", fallback_exc)
            raise
        except Exception as exc:
            logger.error("Failed to read image from Mega: %s", exc)
            if stored_ref.startswith(("http://", "https://")):
                try:
                    with urlopen(stored_ref, timeout=20) as response:
                        file_content = response.read()
                    if self._looks_like_image_bytes(file_content):
                        image_cache.set(stored_ref, file_content)
                        return file_content
                except Exception as fallback_exc:
                    logger.error("Direct URL fallback failed for image: %s", fallback_exc)
            raise HTTPException(status_code=404, detail="Image not found") from exc

    async def delete_image(self, stored_ref: str) -> None:
        try:
            logger.info("Skipping remote delete for Mega public link: %s", stored_ref)
        finally:
            image_cache.delete(stored_ref)



