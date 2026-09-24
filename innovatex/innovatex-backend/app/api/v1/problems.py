from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.problem_statement import ProblemStatement, ProblemStatus
from app.models.user import User, UserRole
from app.schemas.problem_statement import ProblemStatementCreate, ProblemStatementResponse

router = APIRouter(prefix="/problems", tags=["problems"])

def output(problem):
    return ProblemStatementResponse(id=str(problem.id), title=problem.title, description=problem.description, industry_id=problem.industry_id, status=problem.status)

@router.post("", response_model=ProblemStatementResponse, status_code=201)
async def publish(data: ProblemStatementCreate, user: User = Depends(get_current_user)):
    if user.role != UserRole.industry:
        raise HTTPException(status_code=403, detail="Only industry users can publish problems")
    problem = ProblemStatement(**data.model_dump(), industry_id=user.virtual_id, created_at=datetime.now(timezone.utc).isoformat())
    await problem.insert()
    return output(problem)

@router.get("", response_model=list[ProblemStatementResponse])
async def list_all(user: User = Depends(get_current_user)):
    return [output(problem) async for problem in ProblemStatement.find_all()]

@router.post("/{problem_id}/seen")
async def mark_seen(problem_id: str, user: User = Depends(get_current_user)):
    problem = await ProblemStatement.get(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    if user.virtual_id not in problem.seen_by:
        problem.seen_by.append(user.virtual_id)
        await problem.save()
    return {"seen": True}

@router.post("/{problem_id}/shortlist", response_model=ProblemStatementResponse)
async def shortlist(problem_id: str, user: User = Depends(get_current_user)):
    problem = await ProblemStatement.get(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    problem.status = ProblemStatus.shortlisted if problem.status != ProblemStatus.shortlisted else ProblemStatus.new
    await problem.save()
    return output(problem)
