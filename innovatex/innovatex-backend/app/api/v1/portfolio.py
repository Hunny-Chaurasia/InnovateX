from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.portfolio import Portfolio
from app.models.user import User
from app.schemas.portfolio import PortfolioEnsure, PortfolioResponse
from app.services.portfolio_service import ensure_portfolio, unique_slug

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

def output(portfolio):
    return PortfolioResponse.model_validate(portfolio, from_attributes=True)

@router.post("/ensure", response_model=PortfolioResponse)
async def ensure(data: PortfolioEnsure, user: User = Depends(get_current_user)):
    return output(await ensure_portfolio(user.virtual_id, user.name, data.bio))

@router.post("/toggle", response_model=PortfolioResponse)
async def toggle(user: User = Depends(get_current_user)):
    portfolio = await ensure_portfolio(user.virtual_id, user.name)
    portfolio.enabled = not portfolio.enabled
    await portfolio.save()
    return output(portfolio)

@router.post("/regenerate", response_model=PortfolioResponse)
async def regenerate(user: User = Depends(get_current_user)):
    portfolio = await ensure_portfolio(user.virtual_id, user.name)
    portfolio.slug = await unique_slug(user.name)
    await portfolio.save()
    return output(portfolio)
