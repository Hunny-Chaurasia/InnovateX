import types

import pytest_asyncio
from mongomock_motor import AsyncMongoMockClient
from beanie import init_beanie
from app.models import DOCUMENT_MODELS


def _patch_mock_database_methods(client, database):
    async def list_collection_names_compat(self, *args, **kwargs):
        kwargs.pop("authorizedCollections", None)
        kwargs.pop("nameOnly", None)
        source = self.__dict__.get("_AsyncMongoMockDatabase__database")
        return source.list_collection_names(*args, **kwargs)

    async def list_database_names_compat(self, *args, **kwargs):
        kwargs.pop("authorizedDatabases", None)
        kwargs.pop("nameOnly", None)
        source = self.__dict__.get("_AsyncMongoMockClient__client")
        return source.list_database_names(*args, **kwargs)

    database.list_collection_names = types.MethodType(list_collection_names_compat, database)
    client.list_database_names = types.MethodType(list_database_names_compat, client)


@pytest_asyncio.fixture(autouse=True)
async def mongo_database():
    client = AsyncMongoMockClient()
    database = client["innovatex_test"]
    _patch_mock_database_methods(client, database)
    await init_beanie(database=database, document_models=DOCUMENT_MODELS)
    return database
