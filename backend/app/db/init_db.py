from app.db.base import Base
from app.db.models import *  # noqa: F403
from app.db.seed import seed_defaults
from app.db.session import SessionLocal
from app.db.session import engine


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_defaults(db)
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
