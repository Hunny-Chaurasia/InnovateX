from .collaboration_request import CollaborationRequest
from .counter import Counter
from .funding import Funding
from .portfolio import Portfolio
from .problem_statement import ProblemStatement
from .project import Project
from .proof_of_work import ProofOfWork
from .review import Review
from .team import Team
from .user import User

DOCUMENT_MODELS = [
    User, Team, Project, CollaborationRequest, Funding, Review,
    ProofOfWork, ProblemStatement, Portfolio, Counter,
]
