from enum import Enum
from beanie import Document

class ProblemStatus(str, Enum):
    new = "new"
    shortlisted = "shortlisted"
    csr = "csr"

class ProblemStatement(Document):
    title: str
    description: str
    industry_id: str
    status: ProblemStatus = ProblemStatus.new
    seen_by: list[str] = []
    created_at: str

    class Settings:
        name = "problem_statements"
