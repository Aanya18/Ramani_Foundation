import diskcache as dc
import os
import asyncio
import functools
import hashlib
import json
from typing import Any, Callable, Optional, TypeVar
from app.core.config import settings

T = TypeVar("T")

class AsyncCache:
    """
    A robust, async-friendly wrapper around diskcache.Cache that supports tagging 
    for efficient O(1) collection-level invalidation and non-blocking I/O.
    """
    def __init__(self, directory: str):
        # Ensure the absolute path for cache directory
        if not os.path.isabs(directory):
            directory = os.path.abspath(directory)
            
        os.makedirs(directory, exist_ok=True)
        self._cache = dc.Cache(directory)

    def _get_tag_version(self, tag: str) -> int:
        """Retrieves the current version of a tag. Defaults to 0."""
        return self._cache.get(f"tag_version:{tag}", default=0)

    def invalidate_tag(self, tag: str):
        """
        Invalidates all cache entries associated with a specific tag by incrementing its version.
        This is a highly efficient constant-time operation.
        """
        version = self._get_tag_version(tag)
        self._cache.set(f"tag_version:{tag}", version + 1)

    def _make_key(self, func: Callable, tag: Optional[str], args: tuple, kwargs: dict) -> str:
        """
        Generates a stable cache key based on the function, arguments, and current tag version.
        Skips 'self' for instance methods to ensure stable keys across dependency-injected instances.
        """
        # Skip 'self' for Repository instance methods to maintain key stability
        args_to_hash = args
        if args and hasattr(args[0], '__class__') and "Repository" in args[0].__class__.__name__:
            args_to_hash = args[1:]

        # Create a dictionary of all arguments and function metadata
        key_data = {
            "module": func.__module__,
            "func": func.__qualname__,
            "args": [str(a) for a in args_to_hash],
            "kwargs": {k: str(v) for k, v in kwargs.items()}
        }
        
        # Deterministic JSON serialization and MD5 hashing
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
        Retrieves a value from the cache or populates it using the creator function if missing.
        Uses asyncio.to_thread to keep disk I/O off the main event loop.
        """
        # Try to get value from cache
        val = await asyncio.to_thread(self._cache.get, key)
        if val is not None:
            return val

        # Execute the creator (handles both async and sync creators)
        result = creator()
        if asyncio.iscoroutine(result):
            val = await result
        else:
            val = result

        # Save to cache if result is not None
        if val is not None:
            await asyncio.to_thread(self._cache.set, key, val, expire=expire)
        
        return val

    def memoize(self, tag: Optional[str] = None, expire: Optional[int] = None):
        """
        Production-grade async memoization decorator with tagging and stable key generation.
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

# Initialize the global cache instance
# Uses the directory specified in settings, defaulting to 'cache' in the project root
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
cache_path = os.path.join(project_root, settings.CACHE_DIR)
cache = AsyncCache(cache_path)
