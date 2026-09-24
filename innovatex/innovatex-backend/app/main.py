from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.deps import get_current_user
from app.api.v1 import auth, funding, portfolio, problems, projects, proof_of_work, public, reviews, teams, users
from app.config import settings
from app.database import init_database
from app.realtime.ws_manager import manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()
    yield

app = FastAPI(title="InnovateX API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins.split(","), allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
api_prefix = "/api/v1"
for router in (auth.router, users.router, teams.router, projects.router, funding.router, reviews.router, proof_of_work.router, problems.router, portfolio.router, public.router):
    app.include_router(router, prefix=api_prefix)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
