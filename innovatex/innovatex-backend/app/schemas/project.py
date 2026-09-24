from pydantic import BaseModel, Field
from app.models.project import ProjectStage

class ProjectCreate(BaseModel):
    title: str = Field(min_length=2)
    description: str = Field(min_length=10)
    category: str = Field(min_length=2)
    team_id: str
    stage: ProjectStage = ProjectStage.idea

class ProjectResponse(ProjectCreate):
    id: str
    created_by: str
