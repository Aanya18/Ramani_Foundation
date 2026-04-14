from typing import Any, Callable, Optional, TypeVar, Dict
import asyncio
import functools
import hashlib
import json
import time
from app.core.config import settings

T = TypeVar("T")

class AsyncCache:
    """
    A professional, in-memory async-friendly cache that supports tagging 
    for efficient O(1) collection-level invalidation.
    No local disk storage is used.
    """
    def __init__(self):
        self._cache: Dict[str, Any] = {}
        self._tag_versions: Dict[str, int] = {}

    def _get_tag_version(self, tag: str) -> int:
        """Retrieves the current version of a tag. Defaults to 0."""
        return self._tag_versions.get(tag, 0)

    def invalidate_tag(self, tag: str):
        """
        Invalidates all cache entries associated with a specific tag by incrementing its version.
        """
        version = self._get_tag_version(tag)
        self._tag_versions[tag] = version + 1

    def _make_key(self, func: Callable, tag: Optional[str], args: tuple, kwargs: dict) -> str:
        """
        Generates a stable cache key.
        """
        # Skip 'self' for Repository instance methods
        args_to_hash = args
        if args and hasattr(args[0], '__class__') and "Repository" in args[0].__class__.__name__:
            args_to_hash = args[1:]

        key_data = {
            "module": func.__module__,
            "func": func.__qualname__,
            "args": [str(a) for a in args_to_hash],
            "kwargs": {k: str(v) for k, v in kwargs.items()}
        }
        
        key_hash = hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest()
        
        if tag:
            version = self._get_tag_version(tag)
            return f"cache:{tag}:{version}:{key_hash}"
        return f"cache:default:{key_hash}"

    async def get_or_set(
        self, 
        key: str, 
        creator: Callable[[], Any], 
        expire: int = settings.DEFAULT_CACHE_EXPIRE_SECONDS
    ) -> Any:
        """
        Retrieves a value from memory or populates it.
        """
        now = time.time()
        cached_item = self._cache.get(key)
        
        if cached_item:
            value, expiry = cached_item
            if expiry > now:
                return value
            else:
                del self._cache[key]

        # Execute the creator
        result = creator()
        if asyncio.iscoroutine(result):
            val = await result
        else:
            val = result

        if val is not None:
            self._cache[key] = (val, now + expire)
        
        return val

    def memoize(self, tag: Optional[str] = None, expire: Optional[int] = None):
        """
        Async memoization decorator with tagging.
        """
        def decorator(func: Callable):
            @functools.wraps(func)
            async def wrapper(*args, **kwargs):
                key = self._make_key(func, tag, args, kwargs)
                return await self.get_or_set(
                    key, 
                    lambda: func(*args, **kwargs), 
                    expire=expire or settings.DEFAULT_CACHE_EXPIRE_SECONDS
                )
            return wrapper
        return decorator

    def clear(self):
        """Clears the entire cache."""
        self._cache.clear()
        self._tag_versions.clear()

# Global cache instance (In-Memory)
cache = AsyncCache()
