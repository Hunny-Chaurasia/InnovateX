from app.realtime.ws_manager import manager

async def funding_status_changed(user_id: str, funding_id: str, status: str):
    await manager.send_to_user(user_id, {"type": "funding_status_changed", "funding_id": funding_id, "status": status})

async def new_review(user_id: str, review_id: str):
    await manager.send_to_user(user_id, {"type": "new_review", "review_id": review_id})

async def new_collaboration_request(user_id: str, request_id: str):
    await manager.send_to_user(user_id, {"type": "new_collaboration_request", "request_id": request_id})
