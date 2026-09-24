# InnovateX Backend

FastAPI backend connecting students, faculty, industry partners, and mentors. It uses MongoDB with Beanie and Motor, JWT authentication, role-based dependencies, async service logic, WebSocket events, and optional S3 storage.

## Run locally

```powershell
Copy-Item .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API documentation is available at `http://localhost:8000/docs`.

## Run with Docker

```powershell
docker compose up --build
```

## Tests

```powershell
pytest
```

Critical authorization rules are enforced in `funding_service.py`, `review_service.py`, and `team_service.py`, rather than relying only on request validation.
