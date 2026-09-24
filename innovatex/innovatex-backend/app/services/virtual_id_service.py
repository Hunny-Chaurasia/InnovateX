from datetime import datetime
from pymongo import ReturnDocument
from app.models.counter import Counter
from app.models.user import UserRole

ROLE_CODES = {UserRole.student: "STU", UserRole.faculty: "FAC", UserRole.industry: "IND", UserRole.mentor: "MEN", UserRole.admin: "ADM"}

async def generate_virtual_id(role: UserRole, year: int | None = None) -> str:
    year = year or datetime.now().year
    key = f"{role.value}:{year}"
    counter = await Counter.find_one(Counter.key == key).upsert(
        {"$setOnInsert": {"key": key, "sequence": 0}},
        on_insert=Counter(key=key, sequence=0),
    )
    updated = await Counter.get(counter.id).get_motor_collection().find_one_and_update(
        {"_id": counter.id}, {"$inc": {"sequence": 1}}, return_document=ReturnDocument.AFTER
    )
    return f"{ROLE_CODES[role]}-{year}-{updated['sequence']:04d}"
