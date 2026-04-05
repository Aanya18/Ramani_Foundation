from fastapi import HTTPException, UploadFile
import os
import asyncio

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

async def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    # Ensure directory exists
    os.makedirs(os.path.dirname(destination), exist_ok=True)

    # Read to check size and write asynchronously
    try:
        contents = await upload_file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

        def sync_write():
            with open(destination, "wb") as f:
                f.write(contents)

        await asyncio.to_thread(sync_write)
        return destination
    finally:
        await upload_file.close()
