from pydantic import BaseModel, Field
from app.models.problem_statement import ProblemStatus

class ProblemStatementCreate(BaseModel):
    title: str = Field(min_length=2)
    description: str = Field(min_length=10)

class ProblemStatementResponse(ProblemStatementCreate):
    id: str
    industry_id: str
    status: ProblemStatus
