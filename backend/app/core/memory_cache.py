from cachetools import TTLCache
from app.core.config import settings
import sys

class MemoryCache:
    def __init__(self, max_bytes: int, ttl: int):
        # We use a custom getsizeof to limit by bytes
        self.cache = TTLCache(maxsize=max_bytes, ttl=ttl, getsizeof=self._get_size)

    def _get_size(self, value):
        if isinstance(value, bytes):
            return len(value)
        return sys.getsizeof(value)

    def get(self, key: str):
        return self.cache.get(key)

    def set(self, key: str, value: bytes):
        self.cache[key] = value

    def delete(self, key: str):
        if key in self.cache:
            del self.cache[key]

    def clear(self):
        self.cache.clear()

# Global image cache
image_cache = MemoryCache(
    max_bytes=settings.IMAGE_CACHE_MAX_BYTES,
    ttl=settings.DEFAULT_CACHE_EXPIRE_SECONDS
)
