from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.proof_of_work import ProofOfWork
from app.models.user import User
from app.schemas.proof_of_work import ProofOfWorkCreate, ProofOfWorkResponse

router = APIRouter(prefix="/proof-of-work", tags=["proof-of-work"])

@router.post("", response_model=ProofOfWorkResponse, status_code=201)
async def add(data: ProofOfWorkCreate, user: User = Depends(get_current_user)):
    proof = ProofOfWork(**data.model_dump(), added_by=user.virtual_id, created_at=datetime.now(timezone.utc).isoformat())
    await proof.insert()
    return ProofOfWorkResponse(id=str(proof.id), **data.model_dump(), added_by=user.virtual_id)

@router.delete("/{proof_id}", status_code=204)
async def remove(proof_id: str, user: User = Depends(get_current_user)):
    proof = await ProofOfWork.get(proof_id)
    if not proof:
        raise HTTPException(status_code=404, detail="Proof entry not found")
    if proof.added_by != user.virtual_id:
        raise HTTPException(status_code=403, detail="Only the author can remove proof")
    await proof.delete()
