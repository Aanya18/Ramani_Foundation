from fastapi import HTTPException, UploadFile
import os
import asyncio
from app.core import settings

async def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    # Ensure directory exists
    os.makedirs(os.path.dirname(destination), exist_ok=True)

    # Read to check size and write asynchronously
    try:
        contents = await upload_file.read()
        max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024
        if len(contents) > max_size:
            raise HTTPException(status_code=400, detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE_MB}MB.")

        def sync_write():
            with open(destination, "wb") as f:
                f.write(contents)

        await asyncio.to_thread(sync_write)
        return destination
    finally:
        await upload_file.close()
