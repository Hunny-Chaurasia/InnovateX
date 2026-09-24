from beanie import Document

class Counter(Document):
    key: str
    sequence: int = 0

    class Settings:
        name = "counters"
        indexes = ["key"]
