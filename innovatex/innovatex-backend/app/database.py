from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models import DOCUMENT_MODELS

client = AsyncIOMotorClient(settings.mongo_uri)

def get_database():
    return client[settings.mongo_db]

async def init_database() -> None:
    await init_beanie(database=get_database(), document_models=DOCUMENT_MODELS)
