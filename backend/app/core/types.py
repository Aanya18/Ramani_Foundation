import uuid
from sqlalchemy.types import TypeDecorator, CHAR

class GUID(TypeDecorator):
    """
    Platform-independent GUID type.

    Uses CHAR(36) for storage, storing as stringified hex values.
    """
    impl = CHAR(36)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(value))
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            return uuid.UUID(value)
