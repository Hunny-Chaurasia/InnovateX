from enum import Enum
from beanie import Document

class ProjectStage(str, Enum):
    idea = "idea"
    prototype = "prototype"
    pilot = "pilot"
    completed = "completed"

class Project(Document):
    title: str
    description: str
    category: str
    team_id: str
    stage: ProjectStage = ProjectStage.idea
    created_by: str
    created_at: str

    class Settings:
        name = "projects"
