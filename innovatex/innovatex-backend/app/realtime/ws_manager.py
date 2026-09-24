from collections import defaultdict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.connections: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.connections[user_id].add(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket):
        self.connections[user_id].discard(websocket)

    async def send_to_user(self, user_id: str, event: dict):
        for websocket in list(self.connections[user_id]):
            await websocket.send_json(event)

manager = ConnectionManager()
