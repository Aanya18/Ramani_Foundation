# Sahaay Foundation Starter

Greenfield starter codebase for a premium NGO website and admin portal.

## Stack

- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: FastAPI
- Database: SQLite-ready SQLAlchemy models

## Structure

```txt
frontend/  # public site and admin UI shell
backend/   # FastAPI app, routers, schemas, services, models
docs/      # reserved for deeper product and API docs
```

## Frontend setup

```powershell
cd frontend
npm install
npm run dev
```

## Backend setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.db.init_db
uvicorn app.main:app --reload
```

## Included in this scaffold

- Premium NGO homepage with trust-first layout
- Public page shells for About, Programs, Impact, Stories, Events, Blog, Gallery, Volunteer, Donate, Contact, Partner, and Legal
- Admin dashboard shell for non-technical teams
- FastAPI versioned route structure
- Starter content, donation, contact, volunteer, dashboard, and settings endpoints
- SQLite-ready SQLAlchemy models aligned with the NGO platform architecture

## Important note

This is a starter foundation, not a fully wired production build. The frontend currently uses static content placeholders, and the backend routes return starter payloads until repositories and persistence are connected.
