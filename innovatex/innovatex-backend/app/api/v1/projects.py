from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("", response_model=ProjectResponse, status_code=201)
async def create(data: ProjectCreate, user: User = Depends(get_current_user)):
    project = Project(**data.model_dump(), created_by=user.virtual_id, created_at=datetime.now(timezone.utc).isoformat())
    await project.insert()
    return ProjectResponse(id=str(project.id), **data.model_dump(), created_by=user.virtual_id)

@router.get("/{project_id}", response_model=ProjectResponse)
async def get(project_id: str, user: User = Depends(get_current_user)):
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse(id=str(project.id), title=project.title, description=project.description, category=project.category, team_id=project.team_id, stage=project.stage, created_by=project.created_by)
