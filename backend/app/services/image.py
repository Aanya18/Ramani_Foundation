import asyncio
import io
import logging
import os
import tempfile
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException
from mega.client import MegaNzClient as AsyncMega
from app.core.config import settings
from app.core.memory_cache import image_cache

logger = logging.getLogger(__name__)

class MegaManager:
    _instance = None
    _lock = asyncio.Lock()

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MegaManager, cls).__new__(cls)
            cls._instance.mega = AsyncMega()
            cls._instance.user = None
            cls._instance.root_folder_id = None
        return cls._instance

    async def get_client(self):
        async with self._lock:
            if not self._instance.mega.logged_in:
                try:
                    await self._instance.mega.login(settings.MEGA_USER, settings.MEGA_PASSWORD)
                    # Ensure root folder exists
                    fs = await self._instance.mega.get_filesystem()
                    root_name = settings.MEGA_ROOT_FOLDER
                    
                    # Find root node by name
                    root_node = next((n for n in fs.nodes.values() if n.attributes and n.attributes.name == root_name), None)
                    
                    if not root_node:
                        root_node = await self._instance.mega.create_folder(root_name)
                        self.root_folder_id = root_node.id
                    else:
                        self.root_folder_id = root_node.id
                        
                except Exception as e:
                    logger.error(f"Mega login failed: {e}")
                    raise HTTPException(status_code=500, detail="Cloud storage authentication failed")
            return self._instance.mega, self.root_folder_id

    async def refresh_session(self):
        async with self._lock:
            if self._instance.mega.logged_in:
                await self._instance.mega.close()
            self._instance.mega = AsyncMega()
            return await self.get_client()

mega_manager = MegaManager()

class ImageService:
    async def upload_image(self, file: UploadFile) -> str:
        mega, root_id = await mega_manager.get_client()
        content = await file.read()
        
        # async-mega-py 2.1.0 upload requires a file path
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        try:
            uploaded_node = await mega.upload(tmp_path, dest_node_id=root_id)
            return uploaded_node.id
        except Exception as e:
            logger.error(f"Upload to Mega failed: {e}")
            try:
                mega, root_id = await mega_manager.refresh_session()
                uploaded_node = await mega.upload(tmp_path, dest_node_id=root_id)
                return uploaded_node.id
            except Exception as e2:
                logger.error(f"Retry upload failed: {e2}")
                raise HTTPException(status_code=500, detail="Failed to upload image to cloud storage")
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            await file.close()

    async def get_image(self, mega_file_id: str) -> bytes:
        # Check cache first
        cached = image_cache.get(mega_file_id)
        if cached:
            return cached

        mega, _ = await mega_manager.get_client()
        
        async def _download(client, node_id):
            fs = await client.get_filesystem()
            node = fs.nodes.get(node_id)
            if not node:
                raise HTTPException(status_code=404, detail="Image node not found")
            
            # Download to a temporary directory
            with tempfile.TemporaryDirectory() as tmp_dir:
                dest_path = await client.download(node, output_dir=tmp_dir)
                with open(dest_path, "rb") as f:
                    return f.read()

        try:
            file_content = await _download(mega, mega_file_id)
            if file_content:
                image_cache.set(mega_file_id, file_content)
            return file_content
        except Exception as e:
            logger.error(f"Download from Mega failed: {e}")
            try:
                mega, _ = await mega_manager.refresh_session()
                file_content = await _download(mega, mega_file_id)
                if file_content:
                    image_cache.set(mega_file_id, file_content)
                return file_content
            except Exception as e2:
                logger.error(f"Retry download failed: {e2}")
                raise HTTPException(status_code=404, detail="Image not found in cloud storage")

    async def delete_image(self, mega_file_id: str) -> None:
        mega, _ = await mega_manager.get_client()

        async def _delete(client, node_id):
            fs = await client.get_filesystem()
            node = fs.nodes.get(node_id)
            if node:
                await client.destroy(node.id)

        try:
            await _delete(mega, mega_file_id)
        except Exception as e:
            logger.error(f"Delete from Mega failed: {e}")
            try:
                mega, _ = await mega_manager.refresh_session()
                await _delete(mega, mega_file_id)
            except Exception as e2:
                logger.error(f"Retry delete failed: {e2}")
                # We log it but do not necessarily raise an error to not block the main entity deletion,
                # or we can raise depending on strictness.
                pass
        finally:
            image_cache.delete(mega_file_id)
